/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class FeatureDetailController {
        public static Alias ="FeatureDetailController";
        public Feature: IFeature = null;

        constructor(public downloadService: DownloadService,
            public FeatureService: FeatureService,
            public $location: angular.ILocationService,
            public $ionicHistory: ionic.navigation.IonicHistoryService,
            $stateParams: angular.ui.IStateParams) {
            chLogger.log('Searching for feature with id:' + $stateParams["featureId"]);
            this.Feature = FeatureService.GetFeature($stateParams["featureId"]);
            chLogger.log("Using feature: " + this.Feature.Japan);
            this.IsNavigationAvailable = this.FeatureService.IsNavigationAvailable && Utils.ParseBoolean($stateParams["isCommingFromLearningListPage"]);
            chLogger.log("Having navigation: " + this.IsNavigationAvailable);
            if (Utils.CaseInsensitiveSameHead(this.Feature.Position, 'suwari')) {
                this.PositionImage = "img/suwari_waza.png";
                return;
            }
            if (Utils.CaseInsensitiveSameHead(this.Feature.Position, 'hanmi')) {
                this.PositionImage = "img/hanmi_handachi.png";
                return;
            }
            if (Utils.CaseInsensitiveSameHead(this.Feature.Position, 'tachi')) {
                this.PositionImage = "img/tachi_waza.png";
                return;
            }
        }

        public IsNavigationAvailable: boolean = false; 
        public PositionImage: string = '';

        public PlayClipMain = () => {
            this.downloadService.GetClipSafe(this.Feature.ClipMainLocal, this.Feature.ClipMainCloud)
                .then(clipLocation => Utils.PlayClip(clipLocation));
        };

        public PlayClipExtra = () => {
            this.downloadService.GetClipSafe(this.Feature.ClipExtraLocal, this.Feature.ClipExtraCloud)
                .then(clipLocation => Utils.PlayClip(clipLocation));
        };

        public GoNext = () => {
            if (!this.IsNavigationAvailable) {
                chLogger.log("Navigation unavailable");
                return;
            }
            var nextFeature = this.FeatureService.GetNextFeature(this.Feature);
            this.NavigateToFeature(nextFeature);
        };

        public GoPrevious = () => {
            if (!this.IsNavigationAvailable) {
                chLogger.log("Navigation unavailable");
                return;
            }
            var previousFeature = this.FeatureService.GetPreviousFeature(this.Feature);
            this.NavigateToFeature(previousFeature);
        };
        
        private NavigateToFeature = (feature: IFeature) => {
            chLogger.log("Changing state to next featureId: " + feature.Id);
            var featurePath = FeatureListController.GetLearnFeatureAppPath(feature, true, false);
            chLogger.log('Loading path: ' + featurePath);

            this.$ionicHistory.currentView(this.$ionicHistory.backView());
            this.$location.path(featurePath);
        }
    }
    //https://github.com/moust/cordova-plugin-videoplayer
    //https://github.com/dawsonloudon/VideoPlayer
    //https://blog.nraboy.com/2015/01/embed-video-ios-android-ionicframework-app/
    //https://codepen.io/mhartington/pen/Khzxc
    //http://devdactic.com/images-videos-fullscreen-ionic/
    cerebralhikeControllers.controller(FeatureDetailController.Alias, FeatureDetailController);
}