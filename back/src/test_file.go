package test

var TestVar = 1 + 2

type ExportedStruct struct {
	ExportedField int
	unexported    string
	Nested        struct {
		Export int
	}
}

/*
[
    {
        name: "Exported_Field"
        value: "int"
    },
    {
        name: "Nested"
        value: {
            [
                {
                    name: "Nested"
                    value: "int"
                }
            ]
        }
    },
]
*/

type ExportedType int

func ExportedFunction(int, int, string) (int32, int64) {
}
