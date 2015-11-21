package main

import (
	"encoding/csv"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
)

var (
	markers    *string = flag.String("markers", "Markers.txt", "Path to the markers file")
	outputName *string = flag.String("outputName", "{book}_%03d_{suffix}.mp4", "Name of the output files something like clip_%03_{suffix}_{book}_{technique}.mp4 will generate clip_003_m_ikkajo_ippondori.mp4")
	cleanNames *bool   = flag.Bool("cleanNames", false, "Use it for clean book or tehnique names from spaces or dashes")
	//movieFile *string = flag.String("movieFile", "~/Downloads/Hidden MOkuroku Ikka-jo + Nika-jo  MP4.mp4", "Path to the video file")
)

const (
	//_ = iota
	ColBook = iota
	ColAttack
	ColFront
	ColPosition
	ColJapan
	ColRo
	ColStart
	ColEnd
)

type move struct {
	Book			  string
	Attack			  string
	Front			  string
	Position		  string
	Japan			  string
	Ro				  string
	Marker			  FileMarker
	AdditionalMarkers []FileMarker
}

type jsonMove struct {
	Book	  string
	Attack	  string
	Front	  string
	Position  string
	Japan	  string
	Ro		  string
	ClipMain  string
	ClipExtra string
}

func (m move) GetClips() (string, string) {
	mainClip := m.Marker.GetRange()
	additionals := ""
	for _, marker := range m.AdditionalMarkers {
		additionals = additionals + fmt.Sprintf(",+%s", marker.GetRange())
	}
	return "," + mainClip, "," + additionals[2:]
}

func NewMove(book, attack, front, position, japan, ro, start, end string, additionalMarkers ...string) move {
	if 0 != len(additionalMarkers)%2 {
		log.Fatal("Invalid additional markers count for: " + japan)
	}
	var markers []FileMarker
	for i, length := 0, len(additionalMarkers); i < length; i = i + 2 {
		marker := NewFileMarker(additionalMarkers[i], additionalMarkers[i+1])
		markers = append(markers, marker)
	}
	return move{Book: book, Attack: attack, Front: front, Position: position, Japan: japan, Ro: ro, Marker: NewFileMarker(start, end), AdditionalMarkers: markers}
}

type BookOptions struct {
	moves	  []move
	lastIndex int
}

func NewBookOptions() *BookOptions {
	result := BookOptions{make([]move, 0), 0}
	return &result
}

func (b *BookOptions) AddMove(m move) {
	b.moves = append(b.moves, m)
}

type FileMarker struct {
	rawStart string
	rawEnd	 string
	start	 string
	end		 string
}

func NewFileMarker(rawStart, rawEnd string) FileMarker {
	start := parseSeconds(rawStart)
	end := parseSeconds(rawEnd)
	if start >= end {
		log.Fatal("Invalid time interval")
	}
	return FileMarker{rawStart, rawEnd, start, end}
}

func parseSeconds(markerTime string) string {
	val, err := time.Parse("4:05", markerTime)
	if nil != err {
		log.Fatal("Invalid time provided in marker file")
	}
	return strconv.Itoa(val.Minute()*60 + val.Second())
}

func (fm FileMarker) GetRange() string {
	rawStart := getProperHour(fm.rawStart)
	rawEnd := getProperHour(fm.rawEnd)
	return rawStart + "-" + rawEnd
}

func getProperHour(time string) string {
	switch len(time) {
	case 5:
		return "00:" + time
	case 4:
		return "00:0" + time
	default:
		return time
	}
}

func (m move) getClipName(suffix string, index int) string {
	book := m.Book
	if *cleanNames {
		book = clean(m.Book)
	}
	technique := clean(m.Japan)
	if *cleanNames {
		technique = clean(m.Japan)
	}
	name := strings.Replace(*outputName, "{suffix}", suffix, 1)
	name = strings.Replace(name, "{book}", book, 1)
	name = strings.Replace(name, "{technique}", technique, 1)
	return fmt.Sprintf(name, index)
}

func saveOptionsFile(bookName, partsText, suffix string) {
	f, err := os.Create("splitter_" + suffix + "_" + bookName + ".options")
	if nil != err {
		log.Fatal("Unable to create the splitting options file")
	}
	defer f.Close()
	clipName := strings.Replace(*outputName, "{suffix}", suffix, 1)
	clipName = strings.Replace(clipName, "{book}", bookName, 1)
	//just for brevity - not optimal
	allText := []string{"-o",
		clipName,
		"--no-subtitles",
		"--no-buttons",
		"--no-track-tags",
		"--no-chapters",
		"--no-attachments",
		"--no-global-tags",
		"--split",
		"parts:" + partsText}
	f.WriteString(strings.Join(allText, "\n"))
}

func existsFile(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}

func readOldJSONLegend() []jsonMove {
	if !existsFile("legend.json") {
		return []jsonMove{} //empty slice
	}
	oldLegendBytes, err := ioutil.ReadFile("legend.json")
	if nil != err {
		log.Fatal("Unable to read the old legend from file")
	}
	var oldLegend []jsonMove
	if nil != json.Unmarshal(oldLegendBytes, &oldLegend) {
		log.Fatal("Failed to understand the old legend")
	}
	return oldLegend
}

func saveDataToJSON(data []jsonMove) {
	toSave := append(readOldJSONLegend(), data...)
	f, err := os.Create("legend.json")
	if nil != err {
		log.Fatal("Unable to save the legend file")
	}
	defer f.Close()
	encoder := json.NewEncoder(f)
	if nil != encoder.Encode(toSave) {
		log.Fatal("Unable to marshal the legend")
	}
}

func main() {
	flag.Parse()
	tsvFile, err := os.Open(*markers)
	if nil != err {
		log.Fatal("Unable to open the markers file at: " + *markers)
	}
	defer tsvFile.Close()

	reader := csv.NewReader(tsvFile)
	reader.Comma = '\t'
	reader.FieldsPerRecord = -1

	rows, err := reader.ReadAll()
	if nil != err {
		log.Fatal("Failed to read the data from markers file")
	}
	allMoves := make(map[string]*BookOptions)
	for _, each := range rows {
		m := NewMove(each[ColBook], each[ColAttack], each[ColFront], each[ColPosition], each[ColJapan], each[ColRo], each[ColStart], each[ColEnd], each[ColEnd+1:]...)
		if _, ok := allMoves[m.Book]; !ok {
			allMoves[m.Book] = NewBookOptions()
		}
		allMoves[m.Book].AddMove(m)
	}
	jsonOutput := make([]jsonMove, len(rows))
	overallMoveIndex := 0
	for bookName := range allMoves {
		splittingOptionsMain, splittingOptionsExtra := "", ""
		for _, each := range allMoves[bookName].moves {
			mainOpt, extraOpt := each.GetClips()
			splittingOptionsMain = splittingOptionsMain + mainOpt
			splittingOptionsExtra = splittingOptionsExtra + extraOpt
			clipIndexByBook := allMoves[bookName].lastIndex + 1
			jsonOutput[overallMoveIndex] = jsonMove{each.Book, each.Attack, each.Front, each.Position, each.Japan, each.Ro, each.getClipName("m", clipIndexByBook), each.getClipName("e", clipIndexByBook)}
			allMoves[bookName].lastIndex = clipIndexByBook
			overallMoveIndex = overallMoveIndex + 1
			//		fmt.Printf("%s \t %s %d %d", each.Japan, each.Ro, each.Marker.start, each.Marker.end)
			//cmd := exec.Command("vlc", "--start-time", each.Marker.start, "--stop-time", each.Marker.end, *movieFile)
			//err = cmd.Run()
			//if nil != err {
			//log.Print(err)
			//}
		}
		saveOptionsFile(bookName, splittingOptionsMain[1:], "m")
		saveOptionsFile(bookName, splittingOptionsExtra[1:], "e")
	}
	saveDataToJSON(jsonOutput)
	log.Println("Generated the options file")
}

func clean(text string) string {
	return strings.Replace(strings.Replace(text, " ", "", -1), "-", "", -1)
}
