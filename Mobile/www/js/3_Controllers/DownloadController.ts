/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class DownloadController {
        public static Alias ="DownloadController";

        public FailedToLoad: string = "Loading ...";
        public Files: IFeature[] = [];

        constructor(public $scope: angular.IScope, public downloadService: DownloadService, public $ionicPopup: ionic.popup.IonicPopupService) {
            console.log('Download controller');
            downloadService.LoadLegend()
                .then(()=>this.ShowFiles())
                .catch(reason=>this.ShowErrorLoadingLegend(reason))
                .finally(()=>this.RefreshScope());
        }

        public DownloadFiles = () => {
            this.downloadService.DownloadAllFiles();
        }

        private ShowErrorLoadingLegend = reason=> {
            this.Files = [];
            this.FailedToLoad = "Failed to load: " + reason.toString();
        }

        private ShowFiles = () => {
            this.Files = this.downloadService.Files;
            if (0 == this.Files.length) {
                this.FailedToLoad = "Data is not available";
            }
            else {
                this.FailedToLoad = ""; //= "Found " + this.Features.length;
            }
        }

        private RefreshScope = () => {
            if (!this.$scope.$$phase) {
                this.$scope.$apply();
            }
        };

        //public GetIconMarkedForDownload(file: IFeature): string {
        //    return (file.ToBeDownloaded) ? 'ion-ios-download' : 'ion-ios-download-outline';
        //}

        public GetIconAction(file: IFeature): string {
            if (Feature.HasLocalExtraClip(file) && Feature.HasLocalMainClip(file)) {
                return "ion-trash-a";
            }
            return (file.ToBeDownloaded) ? 'ion-ios-download' : 'ion-ios-download-outline';
        }

        public GetIconIsLocal(file: IFeature): string {
            return (Feature.HasLocalMainClip(file) && Feature.HasLocalExtraClip(file)) ? 'ion-ios-film' : 'ion-ios-film-outline';
        }
        public DownloadOrRemove = (file: IFeature) => {
            if (Feature.HasLocalExtraClip(file) && Feature.HasLocalMainClip(file)) {
                this.RemoveLocalFiles(file);
            }
            else {
                //console.log('Before ' + file.Japan + ' to be downloaded: ' + file.ToBeDownloaded);
                file.ToBeDownloaded = !file.ToBeDownloaded;
                //console.log('Updated ' + file.Japan + ' to be downloaded: ' + file.ToBeDownloaded);
                this.downloadService.SaveLocalLegend();
            }
        }

        //public IsDownloadButtonVisible(file: IFeature): boolean {
        //    return (Feature.HasLocalMainClip(file) && Feature.HasLocalExtraClip(file)) ? false : true;
        //}

        public ProvideInfo = (file: IFeature) => {
            var main = '</br>sursa clipului principal este internetul (poate genera costuri la redare)';
            var extra = '</br>sursa clipului secundar este internetul (poate genera costuri la redare)';
            if (Feature.HasLocalMainClip(file)) {
                main = '</br>' +file.ClipMainLocal;
            }
            if (Feature.HasLocalExtraClip(file)) {
                extra = '</br>' +file.ClipExtraLocal;
            }
            this.$ionicPopup.alert({ title: file.Japan, template: 'Fisiere pe dispozitiv:' + main + extra });
        }

        public RemoveLocalFiles = (file: IFeature) => {
            this.downloadService.RemoveLocalFiles(file).catch(reason =>
                this.$ionicPopup.alert({
                    title: 'Fail',
                    template: 'Failed to remove the files saved on device associated with <b>' + file.Japan + '</b>'
                }));
        }
	}

	cerebralhikeControllers.controller(DownloadController.Alias, DownloadController);
}