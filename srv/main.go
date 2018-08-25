package main

import (
	"flag"

	"github.com/golang/glog"
)

var bind = flag.String("bind", ":8081", "address to bind server to")

func run() error {
	s := &server{}
	return s.Listen(*bind)
}

func main() {
	flag.Parse()
	defer glog.Flush()

	if err := run(); err != nil {
		glog.Fatal(err)
	}
}
