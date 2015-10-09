cd ..\SplitterOptionsGenerator
del /Q legend.json
go build
.\SplitterOptionsGenerator.exe
cd ..\CloudParser
del /Q out.json
go build
.\CloudParser.exe
cd ..\LegendJoiner
go build
del /Q legend.json
.\LegendJoiner.exe
copy legend.json C:\Users\sorin.mecu\Dropbox\CerebralHike
echo Done


