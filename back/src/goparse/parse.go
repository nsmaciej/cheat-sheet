package goparse

import (
	"go/ast"
	"go/parser"
	"go/token"
	"io"
)

type File struct {
    Filename string
	ExportedFuncs []*Function
}

func ParseFile(filename string, read io.Reader) (*File, error) {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, filename, read, parser.AllErrors)
	if err != nil {
		return nil, err
	}
	ast.FileExports(f)
    file := &File{Filename: filename}
	for _, decl := range f.Decls {
		switch d := decl.(type) {
		case *ast.FuncDecl:
			file.ExportedFuncs = append(file.ExportedFuncs, parseFunc(d))
		}
	}
	return file, nil
}

type Function struct {
	Name    string
	Params  []string
	Returns []string
}

func parseFunc(f *ast.FuncDecl) *Function {
	fnc := &Function{
		Name: f.Name.Name,
	}
	for _, p := range f.Type.Params.List {
		fnc.Params = append(fnc.Params, (p.Type.(*ast.Ident)).Name)
	}
	if f.Type.Results != nil {
		for _, r := range f.Type.Results.List {
			fnc.Returns = append(fnc.Returns, (r.Type.(*ast.Ident)).Name)
		}
	}
	return fnc
}
