# CerebralHike

## Generator
	The generator will create 3 files:
		- main clips splitting options file
		- extra clips (concatenated) options file
		- legend.json file (with the association between names and clips, to be used by the future app)

	### Usage:

~~~
	SplitterOptionsGenerator.exe -markers *Markers.txt* -outputName *"SomeChunk_%03d_{suffix}.mp4"*
	mkvmerge.exe *'someVideoFile.mp4'* '@splitter_m.options'
	mkvmerge.exe *'someVideoFile.mp4'* '@splitter_e.options'
~~~




