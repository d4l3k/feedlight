package main

import (
	"context"

	"github.com/d4l3k/feedlight/srv/feedlightpb"
)

func (s *server) SimilarFeedback(ctx context.Context, req *feedlightpb.SimilarFeedbackRequest) (*feedlightpb.SimilarFeedbackResponse, error) {
	return &feedlightpb.SimilarFeedbackResponse{
		Feedback: []*feedlightpb.Feedback{
			{
				Feedback:   "The app crashes when I try to post.",
				NumSimilar: 10,
				Response:   "We're aware of the issue and a fix should be rolling out soon!",
			},
			{
				Feedback:   "It'd be nice to be able to insert emoji in our statuses.",
				NumSimilar: 1,
			},
		},
	}, nil
}

func (s *server) SubmitFeedback(ctx context.Context, req *feedlightpb.SubmitFeedbackRequest) (*feedlightpb.SubmitFeedbackResponse, error) {
	return &feedlightpb.SubmitFeedbackResponse{}, nil
}
