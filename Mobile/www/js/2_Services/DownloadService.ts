/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
    export class DownloadService implements IFeatureVerifier {
		public static Alias = "downloadService";

        constructor(public apiFactory: ApiFactory
            , public $q: angular.Enhanced.IQService
            , public $cordovaFileTransfer: ngCordova.IFileTransfer
            , public $cordovaFile: ngCordova.IFile
            , public $ionicPopup: ionic.popup.IonicPopupService
            , public $cordovaNetwork: ngCordova.INetworkService)
        {
            this.RootDirEntryPromise = this.GetRootDirPromise();
        }
        private RootDirEntryPromise: angular.IPromise<string>;
        private LegendFilePath: string = null;
        public Files: IFeature[] = [];
        public IgnoreNetworkCosts: boolean = false;

        public LoadLegend = (): angular.IPromise<void> => {
            if (this.Files.length >0 ) {
                return this.$q.when();
            }
            var remotePromise: angular.IPromise<ICloudFeature[]> = this.$q.when<ICloudFeature[]>([]);
            if (Utils.HaveAnyNetworkConnection(this.$cordovaNetwork)) {
                remotePromise = this.apiFactory.GetOriginalLegend();
            } 
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
            if (Feature.HasLocalMainClip(feature)) {
                this.$cordovaFile.checkFile(feature.ClipMainLocal, '').catch(reason => feature.ClipMainLocal = null);
            }
            if (Feature.HasLocalExtraClip(feature)) {
                this.$cordovaFile.checkFile(feature.ClipExtraLocal, '').catch(reason => feature.ClipExtraLocal = null);
            }
        }

        private DownloadFeatureResources = (feature: IFeature): angular.IPromise<void> => {
            if (!feature.ToBeDownloaded) {
                return this.$q.when();
            }
            var resourceDownloadDeferrer = this.$q.defer<void>();
            var mainPromise = this.$q.when();
            if (!Feature.HasLocalMainClip(feature)) {
                mainPromise = this.DownloadFile(feature.ClipMainCloud).then(localPath=> {
                    feature.ClipMainLocal = localPath;
                    Feature.UpdateToDownloadAfterResourceDownload(feature);
                    return this.SaveLocalLegend();
                });
            }
            var extraPromise = this.$q.when();
            if (!Feature.HasLocalExtraClip(feature)) {
                extraPromise = this.DownloadFile(feature.ClipExtraCloud).then(localPath=> {
                    feature.ClipExtraLocal = localPath;
                    Feature.UpdateToDownloadAfterResourceDownload(feature);
                    return this.SaveLocalLegend();
                });
            }
            this.$q.all([mainPromise, extraPromise])
                .then(() => resourceDownloadDeferrer.resolve())
                .catch(reason=> resourceDownloadDeferrer.reject(reason));
            return resourceDownloadDeferrer.promise;
        }

        public GetClipSafe = (local: string, remote: string): angular.IPromise<string> => {
            if (local) return this.$q.when(local);
            if (Utils.HaveCheapNetworkConnection(this.$cordovaNetwork) || this.IgnoreNetworkCosts) return this.$q.when(remote);
            return this.$ionicPopup.confirm({
                title: 'Conexiunea poate genera costuri',
                template: 'Continui redarea acestui film si a celorlate (viitoare din aceasta sesiune), in ciuda posibilitatii de a cauza costuri suplimentare?'
            }).then(response=> {
                if (response) {
                    this.IgnoreNetworkCosts = true;
                    return this.$q.when(remote);
                } else {
                    this.IgnoreNetworkCosts = false;
                    return "";
                }
            });
        }

        public DownloadAllFiles = () => {
            //if (!Utils.HaveCheapNetworkConnection(this.$cordovaNetwork)) {
            //    this.$ionicPopup.alert({ title: "Retea costisitoare", template: "Conectati-va la un WiFi inainte de a descarca filmele (volumul mare de date va genera costuri)" });
            //    return;
            //}
            this.DownloadFiles(0);
        }


        public DownloadFiles = (featureIndex: number): angular.IPromise<void> => {
            if (featureIndex >= this.Files.length) {
                return this.$q.reject("Work done");
            }
            return this.DownloadFeatureResources(this.Files[featureIndex])
                .then(() => this.DownloadFiles(featureIndex + 1));
        }

        private DownloadFile = (remotePath: string): angular.IPromise<string> => {
            var suggestedName = DownloadService.GetRandomNameForLocalFile(remotePath);
            var localName = LocalVerbs.GetNewFile(suggestedName);
            var noOptions = null;
            var ignoreCertificateIssues = true;
            return this.$cordovaFileTransfer
                .download(remotePath, localName, noOptions, ignoreCertificateIssues)
                .then(savedFile=> this.$q.when(savedFile.nativeURL));
            //return this.$q.reject("disabled download");
        }

        public RemoveLocalFiles = (feature: IFeature): angular.IPromise<any> => {
            var mainPromise = this.$q.when();
            if (Feature.HasLocalMainClip(feature)) {
                mainPromise = this.GetRemoveFilePromise(feature.ClipMainLocal)
                    .then(_ => {
                        console.log("main deleted");
                        feature.ClipMainLocal = '';
                        Feature.UpdateToDownloadAfterResourceDownload(feature);
                        return this.SaveLocalLegend();
                    });
            }
            var extraPromise = this.$q.when();
            if (Feature.HasLocalExtraClip(feature)) {
                extraPromise = this.GetRemoveFilePromise(feature.ClipExtraLocal)
                    .then(_ => {
                        console.log("extra deleted");
                        feature.ClipMainLocal = '';
                        Feature.UpdateToDownloadAfterResourceDownload(feature);
                        return this.SaveLocalLegend();
                    });
            }
            return this.$q.all([mainPromise, extraPromise]);
        }

        private GetRemoveFilePromise = (url: string): angular.IPromise<any> => {
            var fileExistsPromise = this.$cordovaFile.checkFile(url, '');
            fileExistsPromise.then(abbbbbb => {
                console.log('File about to be removed: ' + url);
            });
            var deleteFilePromise = fileExistsPromise.then(entry=> {
                //this.$cordovaFile.removeFile(url, '')     this doesn't work
                var removedFileDeferrer = this.$q.defer();
                entry.remove(() => removedFileDeferrer.resolve(), reason=> removedFileDeferrer.reject(reason));
                return removedFileDeferrer.promise;
            });
            deleteFilePromise.then(caaaaaa => console.log('File deleted: ' + url));
            return deleteFilePromise;
        }

        private static GetRandomNameForLocalFile(url: string): string {
            try {
                var results = /\b([\w\._-]+).dl=/gi.exec(url);
                console.log(results[1]);
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

