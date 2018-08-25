package main

import (
	"flag"

	"go.uber.org/zap"
)

var bind = flag.String("bind", ":8081", "address to bind server to")
var log *zap.SugaredLogger

func run() error {
	flag.Parse()
	logger, err := zap.NewDevelopment()
	if err != nil {
		return err
	}
	log = logger.Sugar()
	defer log.Sync()

	s := &server{}
	return s.Listen(*bind)
}

func main() {

	if err := run(); err != nil {
		log.Fatal(err)
	}
}
