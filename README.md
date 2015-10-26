# CerebralHike

### Roadmap:
My plans can be found here: https://github.com/MecuSorin/CerebralHike/blob/master/ToDo.md 


## SplitterOptionGenerator
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

## VideoEncoder
Used for encoding the output of the splitting. The output should be placed in the dropbox folder along with the legend.json generated by the *SplitterOptionsGenerator*.

## CloudParser
Generates a json list of urls from a shared dropbox folder

## LegendJoiner
Updates the clips from the original *legend.json* with the ones generated by the * CloudParser * .

## Mobile
The ionic mobile app. Is not a commercial app! Is used by a limited number of people on android devices.

## Latest build
- for Android: can be downloaded from here: https://www.dropbox.com/s/d983ozfk63ug1en/CerebralHikeApp.apk?dl=1


<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=WKPS2DT7CNBBQ&lc=RO&item_name=Encourages%20further%20development%20of%20application%20CerebralHike&item_number=open%2dsource%20CerebralHike&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted">
<img src="https://camo.githubusercontent.com/bce14c8e2e39ba0464551b34602b4c60c182526b/68747470733a2f2f7777772e70617970616c6f626a656374732e636f6d2f656e5f55532f692f62746e2f62746e5f646f6e6174655f4c472e676966" alt="[paypal]" data-canonical-src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" style="max-width:100%;">
</a>
