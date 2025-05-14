package main

import (
	"log"

	"github.com/zhenghao-zhao/instapp/app/api"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile) // Adds filename:line
	server := api.Server{}
	server.Run()
}
