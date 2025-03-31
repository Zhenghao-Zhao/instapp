package main

import (
	"github.com/zhenghao-zhao/instapp/app/controllers"
)

func main() {
	server := controllers.Server{}
	server.Run()
}
