package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/NYTimes/gziphandler"
	"github.com/d4l3k/feedlight/srv/feedlightpb"
	"github.com/gorilla/handlers"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/rs/cors"
	"github.com/soheilhy/cmux"
	"google.golang.org/grpc"
)

type server struct {
}

func (s *server) Listen(addr string) error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Create the main listener.
	l, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	defer l.Close()

	log.Printf("Listening %s...", l.Addr())

	m := cmux.New(l)

	// Match connections in order:
	// First grpc, then HTTP.
	grpcL := m.Match(cmux.HTTP2HeaderField("content-type", "application/grpc"))
	httpL := m.Match(cmux.Any())

	// Create your protocol servers.
	grpcS := grpc.NewServer()
	feedlightpb.RegisterFeedbackServiceServer(grpcS, s)

	apiMux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithInsecure()}
	if err := feedlightpb.RegisterFeedbackServiceHandlerFromEndpoint(ctx, apiMux, "localhost"+*bind, opts); err != nil {
		return err
	}
	apiCors := cors.Default().Handler(apiMux)

	mux := http.NewServeMux()
	mux.Handle("/api/", apiCors)
	mux.Handle("/", http.FileServer(http.Dir("../www/dist/")))

	withGz := gziphandler.GzipHandler(mux)
	withLog := handlers.CombinedLoggingHandler(os.Stderr, withGz)

	httpS := &http.Server{
		Handler: withLog,
	}

	go grpcS.Serve(grpcL)
	go httpS.Serve(httpL)

	return m.Serve()
}
