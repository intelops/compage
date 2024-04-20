package utils

import (
	log "github.com/sirupsen/logrus"
	"io"
	"net/http"
	"os"
)

func DownloadFile(destination, src string) error {
	// Create blank file
	file, err := os.Create(destination)
	if err != nil {
		log.Errorf("error while creating file [" + err.Error() + "]")
		return err
	}
	client := http.Client{
		CheckRedirect: func(r *http.Request, via []*http.Request) error {
			r.URL.Opaque = r.URL.Path
			return nil
		},
	}
	// Put content on file
	resp, err := client.Get(src)
	if err != nil {
		log.Errorf("error while getting file [" + err.Error() + "]")
		return err
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)
	size, err := io.Copy(file, resp.Body)
	defer func(file *os.File) {
		_ = file.Close()
	}(file)
	log.Debugf("Downloaded a file %s with size %d", src, size)
	return nil
}
