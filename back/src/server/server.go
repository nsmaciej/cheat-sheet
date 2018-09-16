package main

import (
	"fmt"
	"net/http"
	"os"
    "goparse"
)

func main() {
	http.HandleFunc("/parse", Respond)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error serving: %v", err)
	}
}

func Respond(w http.ResponseWriter, req *http.Request) {
    path, ok := r.URL.Query()["path"]
    if !ok {
        http.Error(w, "no path provided", http.StatusBadRequest)
        return
    }
    resp, err := http.Get(path)
    if err != nil {
        http.Error(w, "could not get path", http.StatusInternalServerError)
        return
    }
    if resp.StatusCode != http.StatusOK {
        http.Error(w, "could not get path", http.StatusInternalServerError)
        return
    }
}
