package test

import "testing"

// Add is our function that sums two integers
func Add(x, y int) (res int) {
	return x + y
}

func TestAdd(t *testing.T) {
	got := Add(4, 6)
	want := 10
	if got != want {
		t.Errorf("got %q, wanted %q", got, want)
	}
}
