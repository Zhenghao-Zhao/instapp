package main

import (
	"log"

	"github.com/zhenghao-zhao/instapp/app/controllers"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile) // Adds filename:line
	server := controllers.Server{}
	server.Run()
}
