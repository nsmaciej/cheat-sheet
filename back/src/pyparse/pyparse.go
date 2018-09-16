package main

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"os/exec"
)

func parsePython(read io.Reader) ([]byte, error) {
	cmd := exec.Command("./py.py")
	cmd.Stdin = read
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		fmt.Println("fucked")
	}
	fmt.Printf("output: %s\n", out.String())
	return nil, nil
}

func main() {
	for _, f := range os.Args[1:] {
		file, err := os.Open(f)
		if err != nil {
			fmt.Printf("%v", err)
			continue
		}
		parsePython(file)
	}
}
