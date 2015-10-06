/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class DownloadController {
        public static Alias ="DownloadController";
        public static $inject=['$scope', DownloadService.Alias];

        public FailedToLoad: string = "Loading ...";
        public Files: IFeature[] = [];

        constructor(public $scope: angular.IScope, public downloadService: DownloadService) {
            console.log('Download controller');
            downloadService.LoadLegend()
                .then(()=>this.ShowFiles())
                .catch(reason=>this.ShowErrorLoadingLegend(reason))
                .finally(()=>this.RefreshScope());
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

        public GetIconMarkedForDownload(file: IFeature): string {
            return (file.ToBeDownloaded) ? 'ion-ios-download' : 'ion-ios-download-outline';
        }

        public GetIconIsLocal(file: IFeature): string {
            return (file.ClipExtraLocal && file.ClipMainLocal) ? 'ion-ios-film' : 'ion-ios-film-outline';
        }

        public IsDownloadButtonVisible(file: IFeature): boolean {
            return (file.ClipMainLocal && file.ClipExtraLocal) ? false : true;
        }

        public ChangeToDownload(file: IFeature) {
            //console.log('Before ' + file.Japan + ' to be downloaded: ' + file.ToBeDownloaded);
            file.ToBeDownloaded = !file.ToBeDownloaded;
            //console.log('Updated ' + file.Japan + ' to be downloaded: ' + file.ToBeDownloaded);
            this.downloadService.SaveLocalLegend();
        }
	}

	cerebralhikeControllers.controller(DownloadController.Alias, DownloadController);
}