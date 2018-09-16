package goparse

import (
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

type Param struct {
	Name string
	Type string
}

type Function struct {
	Name    string
	Params  []Param
	Returns []string
}

type TypeStmt struct {
	Name    string
	TypeStr string
}

func ParseFile(read io.Reader, url string, filename string) (*File, error) {
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

func parseTypeStmt(a *ast.GenDecl) *TypeStmt {
	if a.Tok != token.TYPE {
		return nil
	}
	spec := a.Specs[0].(*ast.TypeSpec)
	return &TypeStmt{
		Name:    spec.Name.Name,
		TypeStr: parseType(spec.Type),
	}
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
		parm.Type = parseType(p.Type)
		fnc.Params = append(fnc.Params, parm)
	}
	if f.Type.Results != nil {
		for _, r := range f.Type.Results.List {
			fnc.Returns = append(fnc.Returns, parseType(r.Type))
		}
	}
	return fnc
}

func parseType(t ast.Expr) string {
	switch v := t.(type) {
	case *ast.Ident:
		return v.Name
	case *ast.StarExpr:
		return "*" + parseType(v.X)
	case *ast.SliceExpr:
		return "[]" + parseType(v.X)
	case *ast.StructType:
		a := "{"
		for i, f := range v.Fields.List {
			if len(f.Names) > 0 {
				a += f.Names[0].Name + " "
			}
			a += parseType(f.Type)
			if i < len(v.Fields.List)-1 {
				a += ", "
			}
		}
		a += "}"
		return a
    case *ast.SelectorExpr:
        return parseType(v.X) + "." + v.Sel.Name
	default:
		return ""
	}
}
