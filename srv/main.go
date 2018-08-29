package main

import (
	"flag"

	"github.com/d4l3k/feedlight/srv/embeddings"
	"go.uber.org/zap"
)

var (
	bind    = flag.String("bind", ":8081", "address to bind server to")
	embFile = flag.String("embeddings", "/home/rice/Developer/topics/wiki-news-300d-1M.vec", "file to load the embeddings from")
	dbAddr  = flag.String("dbaddr", `postgres://root@localhost:26257/feedlight?sslcert=%2Fetc%2Fcockroachdb%2Fcerts%2Fclient.root.crt&sslkey=%2Fetc%2Fcockroachdb%2Fcerts%2Fclient.root.key&sslmode=verify-full&sslrootcert=%2Fetc%2Fcockroachdb%2Fcerts%2Fca.crt`, "address to connect to the DB at")
)
var log *zap.SugaredLogger

var emb embeddings.Embeddings

func run() error {
	flag.Parse()
	logger, err := zap.NewDevelopment()
	if err != nil {
		return err
	}
	log = logger.Sugar()
	defer log.Sync()

	log.Infof("Loading embeddings... %s", *embFile)
	emb, err = embeddings.Load(*embFile)
	if err != nil {
		return err
	}

	s := &server{}
	return s.Listen(*bind)
}

func main() {

	if err := run(); err != nil {
		log.Fatal(err)
	}
}
