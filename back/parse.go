package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Printf("Please provide one filename")
		return
	}
    for _, f := range os.Args[1:] {
        if err := parseFile(f); err != nil {
            fmt.Fprintf(os.Stderr, "Error parsing file %s: %v", f, err)
        }
    }
}

func parseFile(filename string) error {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, filename, nil, parser.AllErrors)
	if err != nil {
		return err
	}
    if !ast.FileExports(f) {
        return fmt.Errorf("No exported fields")
    }
	if err := ast.Print(fset, f); err != nil {
		return err
	}
	return nil
}
