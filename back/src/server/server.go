package main

import (
	"encoding/json"
	"fmt"
	"github"
	"goparse"
	"io"
	"net/http"
	"os"
	"path"
	"pyparse"
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

func respond(w http.ResponseWriter, req *http.Request) {
	repo := req.URL.Query().Get("repo")
	val, err := getFiles(repo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write(val)
}

func getFiles(repo string) ([]byte, error) {
	extToFunc := map[string]func(io.Reader, string, string) (*goparse.File, error) {
		".go": goparse.ParseFile,
		".py": pythonToGo,
	}
	links, err := github.GetLinks(repo, ghc, []string{".go", ".py"})
	if err != nil {
		return nil, err
	}
	ft2f := make(map[string][]*goparse.File)
	for _, link := range links {
		resp, err := http.Get(link.DownloadURL)
		if err != nil {
			return nil, err
		}
		if resp.StatusCode != 200 {
			return nil, fmt.Errorf("Bad status")
		}
		ext := path.Ext(link.DownloadURL)
		file, err := extToFunc[ext](resp.Body, link.GithubURL, link.Filename)
		if err != nil {
            return nil, err
		}
        ft2f[ext] = append(ft2f[ext], file)
	}
	return json.Marshal(ft2f)
}

func pythonToGo(read io.Reader, url, file string) (*goparse.File, error) {
	f := &goparse.File{}
	bytes, err := pyparse.ParsePython(read, url, file)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(bytes, f)
	if err != nil {
		return nil, err
	}
	return f, nil
}
