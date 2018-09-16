package main

import (
	"encoding/json"
	"fmt"
	"github"
	"goparse"
	"net/http"
	"os"
)

var ghc github.Client

func main() {
	ghc = github.NewClient()
	http.HandleFunc("/", respond)
	fmt.Println("Serving on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error serving: %v", err)
	}
}

func getFiles(repo string) ([]byte, error) {
	links, err := github.GetLinks(repo, ghc, []string{".go"})
	if err != nil {
		return nil, err
	}
	files := make([]*goparse.File, len(links))
	for i, link := range links {
		resp, err := http.Get(link)
		if err != nil {
			return nil, err
		}
		if resp.StatusCode != 200 {
			return nil, fmt.Errorf("Bad status")
		}
		file, err := goparse.ParseFile(link, resp.Body)
		if err != nil {
			return nil, err
		}
		files[i] = file
	}

	return json.Marshal(files)
}

func respond(w http.ResponseWriter, req *http.Request) {
	repo := req.URL.Query().Get("repo")
	val, err := getFiles(repo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(val)
	getFiles(repo)
}
