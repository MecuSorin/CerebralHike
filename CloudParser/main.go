package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"

	"golang.org/x/net/html"
)

var (
	url				   = flag.String("url", "https://www.dropbox.com/sh/zkfic58fepffr1k/AADCQvTbgtODplwWdbE84ph-a?dl=0", "The page with the data")
	parentTagId		   = flag.String("parentTagId", "gallery-view-media", "Id of the parent tag")
	parentTag		   = flag.String("parentTag", "ol", "Type of the parent tag")
	tags			   = flag.String("tags", "a,img", "Tags with relevant info")
	tagsAttribute	   = flag.String("tagsAttribute", "href,src", "The attributes with relevat data for the specified tags")
	jsonOut			   = flag.String("out", "out.json", "The output json file")
	splittedTags	   []string
	splittedAttributes []string
	clips			   = make([]Clip, 0)
	regexPattern	   = regexp.MustCompile("=ld.+?/")
)

type Clip struct {
	OriginalName string
	Url			 string
	Thumbnail	 string
}

func (c Clip) String() string {
	return fmt.Sprintf("Name: %s\n\tUrl: %s\n\tImg: %s\n", c.OriginalName, c.Url, c.Thumbnail)
}

func bailOnError(err error) {
	if nil != err {
		log.Fatal(err)
	}
}

func main() {
	flag.Parse()
	pageResponse, err := http.Get(*url)
	bailOnError(err)
	defer pageResponse.Body.Close()
	//body, err := ioutil.ReadAll(pageResponse.Body)
	//bailOnError(err)
	doc, err := html.Parse(pageResponse.Body)
	bailOnError(err)
	splittedTags = strings.Split(*tags, ",")
	splittedAttributes = strings.Split(*tagsAttribute, ",")
	if len(splittedTags) != len(splittedAttributes) {
		log.Fatal("Invalid arguments for child tags and attributes, the count doesn't match")
	}
	// accumulator
	clipsChan := make(chan Clip)
	generatedClips := []Clip{}
	// processor
	go func(clipsCh chan Clip) {
		defer close(clipsCh)
		ProcessNode(doc, nil, clipsChan)
	}(clipsChan)
	for clip := range clipsChan {
		generatedClips = append(generatedClips, clip)
	}
	// serialize output
	outFile, err := os.Create(*jsonOut)
	if nil != err {
		fmt.Println("Failed to create the output file")
		fmt.Println(generatedClips)
		return
	}
	defer outFile.Close()
	encoder := json.NewEncoder(outFile)
	encoder.Encode(generatedClips)
	fmt.Println("Done")
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
func show(text string) {
	if 0 < len(text) {
		fmt.Println(">>> ", text[:min(len(text), 20)])
	}
}

func ProcessNode(node *html.Node, parent *html.Node, clipsCh chan Clip) {
	findedParent := parent
	if nil != parent {
		if node.Type == html.ElementNode {
			for tagIndex, tag := range splittedTags {
				if node.Data == tag {
					for _, attr := range node.Attr {
						if attr.Key == splittedAttributes[tagIndex] {
							process(parent, node, attr.Val, tagIndex, clipsCh)
							break
						}
					}
				}
			}
		} else {
		}
	} else {
		if node.Type == html.ElementNode && node.Data == *parentTag {
			findedParent = node
		}
	}
	for child := node.FirstChild; child != nil; child = child.NextSibling {
		ProcessNode(child, findedParent, clipsCh)
	}
}

func process(parent, node *html.Node, attributeValue string, childTabIndex int, clipsCh chan Clip) {
	//fmt.Printf("Parent: %s	Child: %s\tAttribute: %s\n", parent.Data, node.Data, attributeValue)
	// asssume that childTabIndex == 0 will genereate a new Clip - the order of tags and attributes is important
	switch childTabIndex {
	case 0:
		originalName := getOriginalName(attributeValue, regexPattern)
		url := strings.Replace(attributeValue, "?dl=0", "?dl=1", 1)
		newClip := Clip{OriginalName: originalName, Url: url}
		clips = append(clips, newClip)
	case 1:
		clip := clips[-1+len(clips)]
		clip.Thumbnail = attributeValue
		//		fmt.Println(clip)
		clipsCh <- clip
	}

}

func getOriginalName(text string, regexPattern *regexp.Regexp) string {
	reversed := Reverse(text)
	result := regexPattern.FindString(reversed)
	return Reverse(result)[1 : len(result)-4]
}

func Reverse(s string) string {
	r := []rune(s)
	for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return string(r)
}
