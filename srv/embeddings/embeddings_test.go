package embeddings

import (
	"strings"
	"testing"

	"go.uber.org/goleak"
)

func TestEmbeddings(t *testing.T) {
	defer goleak.VerifyNoLeaks(t)

	f := `foo 1 2 3 4
bar 2 3 4 5`

	e, err := LoadReader(strings.NewReader(f))
	if err != nil {
		t.Fatal(err)
	}

	{
		v := e.Sentence("foo bar yes. moo")
		if len(v) != 4 {
			t.Fatal("got unexpected length embedding")
		}
	}

	{
		v := e.Sentence("")
		if len(v) != 4 {
			t.Fatal("got unexpected length embedding")
		}
	}
}

func TestSimilarity(t *testing.T) {
	cases := []struct {
		a, b []float32
		want float32
	}{
		{[]float32{1, 0}, []float32{1, 0}, 1},
		{[]float32{1, 0}, []float32{0, 1}, 0},
	}
	for _, c := range cases {
		out := Similarity(c.a, c.b)
		if out != c.want {
			t.Fatalf("Similarity(%+v, %+v) = %+v; not %+v", c.a, c.b, out, c.want)
		}
	}
}
