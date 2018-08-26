package embeddings

import (
	"bufio"
	"context"
	"io"
	"os"
	"runtime"
	"strconv"
	"strings"
	"sync"

	"golang.org/x/sync/errgroup"
	"gonum.org/v1/gonum/blas/blas32"
)

// Embeddings contains a set of embeddings.
type Embeddings struct {
	Raw map[string][]float32
	N   int
}

// Load loads a set of word embeddings via the file name.
func Load(file string) (Embeddings, error) {
	f, err := os.Open(file)
	if err != nil {
		return Embeddings{}, err
	}
	defer f.Close()

	return LoadReader(f)
}

// LoadReader loads a set of word embeddings from a io.Reader.
func LoadReader(r io.Reader) (Embeddings, error) {
	em := map[string][]float32{}
	var emLock sync.Mutex
	var n int

	wg, ctx := errgroup.WithContext(context.TODO())

	workers := runtime.NumCPU()
	lines := make(chan string, workers)

	var err error
	for i := 0; i < workers; i++ {
		wg.Go(func() error {
			for line := range lines {
				parts := strings.Split(line, " ")
				word := parts[0]
				nums := make([]float32, len(parts)-1)
				for i, nbytes := range parts[1:] {
					n, err2 := strconv.ParseFloat(string(nbytes), 32)
					if err2 != nil {
						return err
					}
					nums[i] = float32(n)
				}

				emLock.Lock()
				em[word] = nums
				emLock.Unlock()
			}

			return nil
		})
	}

	wg.Go(func() error {
		scanner := bufio.NewScanner(r)
		for scanner.Scan() {
			select {
			case lines <- scanner.Text():
			case <-ctx.Done():
				break
			}
		}
		close(lines)
		return nil
	})

	if err := wg.Wait(); err != nil {
		return Embeddings{}, err
	}

	for _, v := range em {
		n = len(v)
		break
	}

	return Embeddings{
		Raw: em,
		N:   n,
	}, nil
}

// Word returns the embedding for the specified word.
func (e Embeddings) Word(word string) []float32 {
	v, ok := e.Raw[word]
	if ok {
		return v
	}
	v, ok = e.Raw[strings.ToLower(word)]
	if ok {
		return v
	}
	return nil
}

// Sentence returns an embedding for the sentence.
func (e Embeddings) Sentence(s string) []float32 {
	words := strings.Split(s, " ")
	var vecs [][]float32
	for _, word := range words {
		v := e.Word(word)
		if v != nil {
			vecs = append(vecs, v)
		}
	}
	if len(vecs) == 0 {
		return make([]float32, e.N)
	}
	return Sum(vecs)
}

// Sum sums up the set of vectors.
func Sum(vecs [][]float32) []float32 {
	n := len(vecs[0])
	sum := blas32.Vector{
		Data: make([]float32, n),
		Inc:  1,
	}
	for _, vec := range vecs {
		blas32.Axpy(n, 1, blas32.Vector{
			Data: vec,
			Inc:  1,
		}, sum)
	}
	return sum.Data
}

// Similarity returns the cosine similarity of the two vectors using BLAS.
func Similarity(a, b []float32) float32 {
	av := blas32.Vector{
		Data: a,
		Inc:  1,
	}
	bv := blas32.Vector{
		Data: b,
		Inc:  1,
	}
	anorm := blas32.Nrm2(len(a), av)
	bnorm := blas32.Nrm2(len(b), bv)
	dot := blas32.Dot(len(a), av, bv)
	return dot / (anorm * bnorm)
}
