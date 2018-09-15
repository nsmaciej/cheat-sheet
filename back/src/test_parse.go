package main

import (
	"encoding/json"
	"fmt"
	"goparse"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Printf("Please provide one filename")
		return
	}
	for _, f := range os.Args[1:] {
		f, err := goparse.ParseFile(f)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error parsing file %s: %v", f, err)
		}
		m, err := json.Marshal(f)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error marshalling file %s: %v", f, err)
		}
		fmt.Println(string(m))
	}
}
