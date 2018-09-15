package goparse

import (
	"go/ast"
	"go/parser"
	"go/token"
)

type File struct {
	ExportedFuncs []*Function
}

func ParseFile(filename string) (*File, error) {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, filename, nil, parser.AllErrors)
	if err != nil {
		return nil, err
	}
	ast.FileExports(f)
	file := &File{}
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
