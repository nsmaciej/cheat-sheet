package main

import (
    "os"
    "fmt"
)

func main(){
    if len(os.Args) < 2 {
        fmt.Printf("Please provide one filename")
        return
    }
}

func parseFile(filename string){
}
