/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
    export class DownloadService implements IFeatureVerifier {
		public static Alias = "downloadService";

        constructor(public apiFactory: ApiFactory, public $q: angular.Enhanced.IQService, public $cordovaFileTransfer: ngCordova.IFileTransfer, public $cordovaFile: ngCordova.IFile)
        {
            this.RootDirEntryPromise = this.GetRootDirPromise();
        }
        private RootDirEntryPromise: angular.IPromise<string>;
        private LegendFilePath: string = null;
        public Files: IFeature[] = [];
        private DownloadFilesInProgress: boolean = false;


        public LoadLegend = (): angular.IPromise<void> => {
            if (this.Files.length >0 ) {
                return this.$q.when();
            }
            var remotePromise = this.apiFactory.GetOriginalLegend();
            var localPromise = this.CreateLocalLegendIfNotExists().then(() => this.ReadLocalLegend());
            return this.$q.all([localPromise, remotePromise])
                .then(() => {
                    localPromise.then(files=> this.Files = files);
                    return remotePromise
                        .then(legend=> Feature.ToLocal(legend))
                        .then(files=> this.UpdateLocalLegend(files))
                });
        }

        private ReadLocalLegend = (): angular.IPromise<IFeature[]> => {
            return this.RootDirEntryPromise
                .then(root=> this.$cordovaFile.checkFile(root, LocalVerbs.legend)
                    .then(file=> {
                        var legendPath = file.nativeURL;
                        console.log('legend path: ' + legendPath);
                        return this.apiFactory.GetLegend(legendPath).then(legend=> this.$q.when(Feature.ToLocalInstance(legend, this)));
                    }));
        }

        private GetRootDirPromise = (): angular.IPromise<string> => {
            console.log('CheckForRootDir:' + cordova.file.externalDataDirectory);
            var deferrer = this.$q.defer<string>();
            this.$cordovaFile.checkDir(LocalVerbs.GetStorage(), "")
                .then(entry=> {
                    console.log("Using " + LocalVerbs.GetStorage());
                    deferrer.resolve(LocalVerbs.GetStorage())
                })
                .catch(reason=> {
                    console.log("Cannot find root folder");
                    deferrer.reject(reason)
                });
            return deferrer.promise;
        }

        public CreateLocalLegendIfNotExists = (): angular.IPromise<void> => {
            console.log('CreateLocalLegendIfNotExists');
            var createFileDeferrer = this.$q.defer<void>();
            this.RootDirEntryPromise
                .then(dirEntry=> this.$cordovaFile.checkFile(dirEntry, LocalVerbs.legend)
                    .then(fe=> {
                        this.LegendFilePath = fe.nativeURL;
                        console.log('Found local legend file:');
                        createFileDeferrer.resolve()
                    })
                    .catch(reason=> {
                        console.log('Initiate local legend file');
                        this.$cordovaFile.writeFile(dirEntry, LocalVerbs.legend, "[]", false)
                            .then(progress=> createFileDeferrer.resolve())
                            .catch(failCreateFile=> createFileDeferrer.reject(failCreateFile))
                    })
                )
                .catch(failCreateRoot=> createFileDeferrer.reject(failCreateRoot));
            return createFileDeferrer.promise;
        }

        public SaveLocalLegend = (): angular.IPromise<void> => {
            var saveDeferrer = this.$q.defer<void>();
            this.$cordovaFile.writeFile(LocalVerbs.GetStorage(), LocalVerbs.legend, Utils.ToJson(this.Files), true)
                .then(progress=> saveDeferrer.resolve())
                .catch(failCreateFile=> saveDeferrer.reject(failCreateFile));
            saveDeferrer.promise
                .then(() => console.log("Saved the legend.json"))
                .catch(reason=> console.log("Failed to save the legend.json"));
            return saveDeferrer.promise;
        }


        private UpdateLocalLegend = (cloudLegend: IFeature[]): angular.IPromise<void> => {
            console.log("local have " + this.Files.length);
            console.log("cloud have " + cloudLegend.length);

            for (var c = 0, clngth = cloudLegend.length; c < clngth; c++) {
                var newFeatureFound = true;
                for (var l = 0, llngth = this.Files.length; l < llngth; l++) {
                    if (Feature.AreEqual(this.Files[l], cloudLegend[c])) {
                        Feature.UpdateLocalFromCloud(this.Files[l], cloudLegend[c]);
                        newFeatureFound = false;
                        break;
                    }
                }
                if (newFeatureFound) {
                    this.Files.push(cloudLegend[c]);
                }
            }
            this.SaveLocalLegend();
            return this.$q.when();
        }

        public UpdateLocalClipsStatus = (feature: IFeature) => {
            this.$cordovaFile.checkFile(feature.ClipMainLocal, '').catch(reason => feature.ClipMainLocal = null);
            this.$cordovaFile.checkFile(feature.ClipExtraLocal, '').catch(reason => feature.ClipExtraLocal = null);
        }

        public DownloadFiles = () => {
            if (this.DownloadFilesInProgress) {
                this.DownloadFilesInProgress = false;
                return;
            }
            this.DownloadFilesInProgress = true;
            var downloadCounts = 0;
            for (var i = 0, lngth = this.Files.length; i < lngth; i++) {
                if (!this.DownloadFilesInProgress) {        //sequencial javascript -- has no sense
                    return;
                }
                var feature = this.Files[i];
                if (4 < downloadCounts) break;
                if (!feature.ToBeDownloaded) continue;
                downloadCounts += 1;
                var someChange = false;
                if (!feature.ClipMainLocal) {
                    this.DownloadFile(feature.ClipMainCloud).then(localPath=> this.Files[i].ClipMainLocal = localPath);
                    someChange = true;
                }
                if (!feature.ClipExtraLocal) {
                    this.DownloadFile(feature.ClipExtraCloud).then(localPath=> this.Files[i].ClipExtraLocal = localPath);
                    someChange = true;
                }

                if (feature.ClipMainLocal && feature.ClipExtraLocal) {
                    this.Files[i].ToBeDownloaded = false;
                    someChange = true;
                }
                if (someChange) {
                    this.SaveLocalLegend();
                }
            }
        }

        private DownloadFile = (remotePath: string): angular.IPromise<string> => {
            var suggestedName = DownloadService.GetRandomNameForLocalFile(remotePath);
            var localName = LocalVerbs.GetNewFile(suggestedName);
            return this.$cordovaFileTransfer
                .download(remotePath, localName, null, true)
                .then(savedFile=> this.$q.when(savedFile.nativeURL));
            //return this.$q.reject("disabled download");
        }

        private static GetRandomNameForLocalFile(url: string): string {
            try {
                var results = /\b([\w.]+).dl=/gi.exec(url);
                var suggestedName = results[1].replace(/(.*)\.(\w+)/gi, "$1" + Utils.GetDateMarker() + ".$2");
                return suggestedName;
            }
            catch (eeee) {
                return "unknownSource" + Utils.GetDateMarker();
            }
        }


	}

	cerebralhikeServices.service(DownloadService.Alias, DownloadService);
}

