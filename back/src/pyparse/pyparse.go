package pyparse

import (
	"bytes"
	"io"
	"os/exec"
)

func ParsePython(read io.Reader, url, file string) ([]byte, error) {
	cmd := exec.Command("./py.py", url, file)
	cmd.Stdin = read
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return nil, err
	}
	return out.Bytes(), nil
}
