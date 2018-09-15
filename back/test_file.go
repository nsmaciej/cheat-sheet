package test

type ExportedStruct struct {
    Exported int
    unexported int
}

type ExportedType int

func ExportedFunction(int, int, string) (int32, int64) {
}
