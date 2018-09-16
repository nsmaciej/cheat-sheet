package test

var TestVar = 1 + 2

type ExportedStruct struct {
	ExportedField int
	unexported    string
	Nested        struct {
		Export int
	}
}

type Alias = int32

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

func (e *ExportedType) Received() {
}

func ExportedFunction(int1 int, int2 int, str1 string) (int32, int64) {
}
