package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
)

var (
	legendFile = flag.String("legendFile", `..\SplitterOptionsGenerator\legend.json`, "The path to the legend file that contains the tehniques details")
	urlsFile   = flag.String("urlsFile", `..\CloudParser\out.json`, "The file that contains the dropbox urls")
	outFile    = flag.String("out", "legend.json", "The output file")
)

type jsonMove struct {
	Book	   string
	Attack	   string
	Front	   string
	Position   string
	Japan	   string
	Ro		   string
	ClipMain   string
	ThumbMain  string
	ClipExtra  string
	ThumbExtra string
}

type Clip struct {
	OriginalName string
	Url			 string
	Thumbnail	 string
}

func bailOnError(err error) {
	if nil != err {
		log.Fatal(err)
	}
}

func main() {
	flag.Parse()
	legend := ReadLegend(*legendFile)
	clips := ReadUrls(*urlsFile)
	for _, clip := range clips {
		for i, _ := range legend {
			shouldBreak := false
			move := &legend[i]
			if strings.EqualFold(move.ClipMain, clip.OriginalName) {
				move.ClipMain = clip.Url
				move.ThumbMain = clip.Thumbnail
				shouldBreak = true
			}

			if strings.EqualFold(move.ClipExtra, clip.OriginalName) {
				move.ClipExtra = clip.Url
				move.ThumbExtra = clip.Thumbnail
				shouldBreak = true
			}
			if shouldBreak {
				fmt.Println(clip.OriginalName)
				break
			}
		}
	}
	legendWriter, err := os.Create(*outFile)
	bailOnError(err)
	defer legendWriter.Close()
	encoder := json.NewEncoder(legendWriter)
	encoder.Encode(legend)
	fmt.Println("Done joining")
}

func ReadLegend(legendFile string) []jsonMove {
	legendReader, err := os.Open(legendFile)
	bailOnError(err)
	defer legendReader.Close()
	decoder := json.NewDecoder(legendReader)
	var result []jsonMove
	err = decoder.Decode(&result)
	bailOnError(err)
	return result
}

func ReadUrls(urlsFile string) []Clip {
	urlsReader, err := os.Open(urlsFile)
	bailOnError(err)
	defer urlsReader.Close()
	decoder := json.NewDecoder(urlsReader)
	bailOnError(err)
	var result []Clip
	err = decoder.Decode(&result)
	bailOnError(err)
	return result
}
