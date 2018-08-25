PROTO_FILES = $(shell find . -type f -name '*.proto')
PROTO_GO_FILES = $(patsubst %.proto, %.pb.go, $(PROTO_FILES))
proto_import_paths=-I ${GOPATH}/src -I ${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis
GO_FILES = $(shell find . -type f -name '*.go')

.PHONY: run
run: feedlight
	./feedlight


feedlight: $(GO_FILES) protobuf
	go build -v -o feedlight .


.PHONY: protobuf
protobuf: $(PROTO_GO_FILES)

%.pb.go: %.proto
	protoc --proto_path=${GOPATH}/src:. ${proto_import_paths} $< --gogoslick_out=plugins=grpc:. --grpc-gateway_out=logtostderr=true:.