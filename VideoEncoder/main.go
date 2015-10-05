package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

var (
	folderRoot	  = flag.String("root", ".", "The folder to check for clips")
	clipExtension = flag.String("ext", "mp4", "The file extension")
	command		  = flag.String("cmd", "avidemux2_cli --load {fileInput} --video-codec x264 --output-format mp4 --save out/{fileName} --quit", "The encoding command.")
)

func main() {
	flag.Parse()
	if err := filepath.Walk(*folderRoot, visitFile); nil != err {
		log.Fatal("Folder navigation returned the error: %v\n", err)
	}
}

func visitFile(path string, f os.FileInfo, err error) error {
	if filepath.Ext(path) == "."+*clipExtension {
		args := strings.Replace(*command, "{fileInput}", path, 1)
		args = strings.Replace(args, "{fileName}", f.Name(), 1)
		splittedArgs := strings.Split(args, " ")
		cmd := exec.Command(splittedArgs[0], splittedArgs[1:]...)
		if err := cmd.Run(); nil != err {
			fmt.Println(">>>>> Failed: ", path)
		} else {
			fmt.Println(path)
		}
	}

	return nil
}
