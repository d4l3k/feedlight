package main

import (
	"context"
	"encoding/json"
	"math"
	"sort"
	"time"

	"github.com/d4l3k/feedlight/srv/embeddings"
	"github.com/d4l3k/feedlight/srv/feedlightpb"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
)

func (s *server) SimilarFeedback(ctx context.Context, req *feedlightpb.SimilarFeedbackRequest) (*feedlightpb.SimilarFeedbackResponse, error) {
	if len(req.Domain) == 0 {
		return nil, grpc.Errorf(codes.InvalidArgument, "missing domain")
	}

	if len(req.Feedback.Feedback) == 0 {
		return &feedlightpb.SimilarFeedbackResponse{}, nil
	}

	var feedback []Feedback
	if err := db.Where(Feedback{
		Domain: req.Domain,
		Feedback: feedlightpb.Feedback{
			SharePublicly: true,
		},
	}).Find(
		&feedback,
	).Error; err != nil {
		return nil, err
	}

	embedding := emb.Sentence(req.Feedback.Feedback)

	scores := map[int64]float32{}
	for _, f := range feedback {
		popularityScore := float32(math.Log(float64(f.NumSimilar+1))) + 1

		emb, err := f.GetEmbedding()
		if err != nil {
			return nil, err
		}
		scores[f.Feedback.Id] = embeddings.Similarity(embedding, emb) * popularityScore
	}

	sort.Slice(feedback, func(i, j int) bool {
		return scores[feedback[i].Feedback.Id] > scores[feedback[j].Feedback.Id]
	})

	const maxRet = 5
	if len(feedback) > maxRet {
		feedback = feedback[:maxRet]
	}

	resp := feedlightpb.SimilarFeedbackResponse{}
	for _, f := range feedback {
		f.Feedback.Score = int32(f.NumSimilar)
		resp.Feedback = append(resp.Feedback, f.Feedback)
	}

	return &resp, nil
}

func (s *server) SubmitFeedback(ctx context.Context, req *feedlightpb.SubmitFeedbackRequest) (*feedlightpb.SubmitFeedbackResponse, error) {
	if len(req.Email) == 0 {
		return nil, grpc.Errorf(codes.InvalidArgument, "missing email")
	}
	if len(req.Domain) == 0 {
		return nil, grpc.Errorf(codes.InvalidArgument, "missing domain")
	}
	if len(req.Feedback.Feedback) == 0 {
		return nil, grpc.Errorf(codes.InvalidArgument, "missing feedback")
	}

	embedding, err := json.Marshal(emb.Sentence(req.Feedback.Feedback))
	if err != nil {
		return nil, err
	}

	now := time.Now().Unix()
	req.Feedback.CreatedAt = now
	req.Feedback.UpdatedAt = now

	tx := db.Begin()
	feedback := Feedback{
		Feedback:  req.Feedback,
		Email:     req.Email,
		Domain:    req.Domain,
		Embedding: embedding,
	}
	if err := tx.Create(&feedback).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	for _, similar := range req.Similar {
		if similar.Similar == similar.Dissimilar {
			continue
		}
		link := FeedbackLink{
			FromID:  feedback.Feedback.Id,
			ToID:    similar.Id,
			Email:   req.Email,
			Similar: similar.Similar,
		}
		if err := tx.Create(&link).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
		if similar.Similar {
			if err := tx.Exec(
				"UPDATE feedbacks SET num_similar = num_similar + 1 WHERE id = ?",
				similar.Id,
			).Error; err != nil {
				return nil, err
			}
		} else {
			if err := tx.Exec(
				"UPDATE feedbacks SET num_dissimilar = num_dissimilar + 1 WHERE id = ?",
				similar.Id,
			).Error; err != nil {
				return nil, err
			}
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	return &feedlightpb.SubmitFeedbackResponse{
		Id: feedback.Feedback.Id,
	}, nil
}

func getFeedback(id int64) (Feedback, error) {
	if id == 0 {
		return Feedback{}, errors.Errorf("expected non-zero ID")
	}
	var f Feedback
	if err := db.Where(&Feedback{
		Feedback: feedlightpb.Feedback{
			Id: id,
		},
	}).Find(&f).Error; err != nil {
		return Feedback{}, err
	}
	return f, nil
}

func (s *server) Feedback(ctx context.Context, req *feedlightpb.FeedbackRequest) (*feedlightpb.FeedbackResponse, error) {

	f, err := getFeedback(req.Id)
	if err != nil {
		return nil, err
	}

	var links []FeedbackLink
	if err := db.Where("from_id = ? OR to_id = ?", req.Id, req.Id).Find(&links).Error; err != nil {
		return nil, err
	}

	scores := map[int64]int{}
	for _, link := range links {
		id := link.FromID
		if id == req.Id {
			id = link.ToID
		}
		if link.Similar {
			scores[id] += 1
		} else {
			scores[id] -= 1
		}
	}

	var ids []int64
	for id, score := range scores {
		if score > 0 {
			ids = append(ids, id)
		}
	}

	var similar []Feedback
	if err := db.Where("share_publicly = true AND id in (?)", ids).Find(&similar).Error; err != nil {
		return nil, err
	}

	var similarProto []feedlightpb.Feedback
	for _, s := range similar {
		similarProto = append(similarProto, s.Feedback)
	}

	return &feedlightpb.FeedbackResponse{
		Domain:   f.Domain,
		Feedback: f.Feedback,
		Similar:  similarProto,
	}, nil
}
