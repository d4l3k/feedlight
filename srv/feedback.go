package main

import (
	"context"

	"github.com/d4l3k/feedlight/srv/feedlightpb"
)

func (s *server) SimilarFeedback(ctx context.Context, req *feedlightpb.SimilarFeedbackRequest) (*feedlightpb.SimilarFeedbackResponse, error) {
	return &feedlightpb.SimilarFeedbackResponse{}, nil
}

func (s *server) SubmitFeedback(ctx context.Context, req *feedlightpb.SubmitFeedbackRequest) (*feedlightpb.SubmitFeedbackResponse, error) {
	return &feedlightpb.SubmitFeedbackResponse{}, nil
}
