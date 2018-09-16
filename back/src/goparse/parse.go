package goparse

import (
	"encoding/json"
	"go/ast"
	"go/parser"
	"go/token"
	"io"
)

type File struct {
	Filename      string
	URL           string
	ExportedFuncs []*Function
	ExportedTypes []*TypeStmt
}

func ParseFile(filename string, url string, read io.Reader) (*File, error) {
	fset := token.NewFileSet()
	f, err := parser.ParseFile(fset, filename, read, parser.AllErrors)
	if err != nil {
		return nil, err
	}
	ast.FileExports(f)
	file := &File{Filename: filename, URL: url}
	for _, decl := range f.Decls {
		switch d := decl.(type) {
		case *ast.FuncDecl:
			file.ExportedFuncs = append(file.ExportedFuncs, parseFunc(d))
		case *ast.GenDecl:
			if v := parseTypeStmt(d); v != nil {
				file.ExportedTypes = append(file.ExportedTypes, v)
			}
		}
	}
	return file, nil
}

type Param struct {
	Name string
	Type string
}

type Function struct {
	Name    string
	Params  []Param
	Returns []string
}

func parseFunc(f *ast.FuncDecl) *Function {
	fnc := &Function{
		Name: f.Name.Name,
	}
	for _, p := range f.Type.Params.List {
		parm := Param{}
		if len(p.Names) > 0 {
			parm.Name = p.Names[0].Name
		}
		if n, ok := p.Type.(*ast.Ident); ok {
			parm.Type = n.Name
		}
		fnc.Params = append(fnc.Params, parm)
	}
	if f.Type.Results != nil {
		for _, r := range f.Type.Results.List {
			fnc.Returns = append(fnc.Returns, (r.Type.(*ast.Ident)).Name)
		}
	}
	return fnc
}

type Val struct {
	Name     string
	topLevel string
	nested   *strct
}

type strct struct {
	Fields []Val
}

type TypeStmt struct {
	TypeName string
	Struct   *strct
}

func (v *Val) MarshalJSON() ([]byte, error) {
	t := struct {
		Name  string
		Value string
	}{}
	t.Name = v.Name
	if v.nested == nil {
		t.Value = v.topLevel
		return json.Marshal(t)
	}
	m, err := json.Marshal(v.nested)
	if err != nil {
		return nil, err
	}
	t.Value = string(m)
	return json.Marshal(t)
}

func parseTypeStmt(f *ast.GenDecl) *TypeStmt {
	if f.Tok != token.TYPE {
		return nil
	}
	spec := f.Specs[0].(*ast.TypeSpec)

	t := &TypeStmt{
		TypeName: spec.Name.Name,
	}

	v, ok := spec.Type.(*ast.StructType)
	if !ok {
		return nil
	}
	t.Struct = parseStruct(v)
	return t
}

func parseStruct(v *ast.StructType) *strct {
	s := &strct{}
	for _, f := range v.Fields.List {
		va := Val{}
		va.Name = f.Names[0].Name
		switch d := f.Type.(type) {
		case *ast.StructType:
			va.nested = parseStruct(d)
		case *ast.Ident:
			va.topLevel = d.Name
		}
		s.Fields = append(s.Fields, va)
	}
	return s
}
