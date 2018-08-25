package main

import (
	"net/http"

	"go.uber.org/zap"
)

type logWriter struct {
	*zap.SugaredLogger
}

func (w logWriter) Println(v ...interface{}) {
	w.Debug(v...)
}

type requestLogger struct {
	http.Handler
}

func (l requestLogger) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	wStatus := responseWriterStatus{
		ResponseWriter: w,
	}
	l.Handler.ServeHTTP(&wStatus, r)
	log.Infow("HTTP request",
		"method", r.Method,
		"path", r.URL.Path,
		"status", wStatus.status,
		"user-agent", r.Header.Get("User-Agent"),
	)
}

type responseWriterStatus struct {
	http.ResponseWriter
	status int
}

func (r *responseWriterStatus) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}
