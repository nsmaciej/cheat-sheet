package test

type ExportedStruct struct {
	ExportedField int
	unexported    string
}

type ExportedType int

func ExportedFunction(int, int, string) (int32, int64) {
}
