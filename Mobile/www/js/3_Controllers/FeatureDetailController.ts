/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class FeatureDetailController {
        public static Alias ="FeatureDetailController";
        public Feature: IFeature = null;

        constructor(public downloadService: DownloadService, FeatureService: FeatureService, $stateParams) {
            chLogger.log('Searching for feature with id:' + $stateParams.featureId);
            this.Feature = FeatureService.GetFeature($stateParams.featureId);
            chLogger.log("Using feature: " + this.Feature.Japan);
            //this.ImageSrcMain = Utils.GetSafe(this.Feature.ThumbMainLocal, Utils.GetSafe(this.Feature.ThumbMainCloud, ApiVerbs.GetImagesRoot() + "funny.png"));
            //this.ImageSrcExtra = Utils.GetSafe(this.Feature.ThumbExtraLocal, Utils.GetSafe(this.Feature.ThumbExtraCloud, ApiVerbs.GetImagesRoot() + "flow.png"));
            this.ImageSrcMain =  ApiVerbs.GetImagesRoot() + "funny.png";
            this.ImageSrcExtra = ApiVerbs.GetImagesRoot() + "flow.png";
        }

        public ImageSrcMain: string;
        public ImageSrcExtra: string;

        public PlayClipMain = () => {
            this.downloadService.GetClipSafe(this.Feature.ClipMainLocal, this.Feature.ClipMainCloud)
                .then(clipLocation => Utils.PlayClip(clipLocation));
        }

        public PlayClipExtra = () => {
            this.downloadService.GetClipSafe(this.Feature.ClipExtraLocal, this.Feature.ClipExtraCloud)
                .then(clipLocation => Utils.PlayClip(clipLocation));
        }

        
    }
    //https://github.com/moust/cordova-plugin-videoplayer
    //https://github.com/dawsonloudon/VideoPlayer
    //https://blog.nraboy.com/2015/01/embed-video-ios-android-ionicframework-app/
    //https://codepen.io/mhartington/pen/Khzxc
    //http://devdactic.com/images-videos-fullscreen-ionic/
    cerebralhikeControllers.controller(FeatureDetailController.Alias, FeatureDetailController);
}