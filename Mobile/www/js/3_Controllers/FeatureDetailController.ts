/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class FeatureDetailController {
        public static Alias ="FeatureDetailController";
        public static $inject=['$scope', FeatureService.Alias, '$stateParams'];
        public Feature: IFeature = null;

        constructor(public $scope: angular.IScope, FeatureService: FeatureService, $stateParams) {
            this.Feature = FeatureService.GetFeature($stateParams.featureId);
            this.ImageSrcMain = ApiVerbs.GetImagesRoot() + "funny.png";
            this.ImageSrcExtra = ApiVerbs.GetImagesRoot() + "flow.png";
        }

        public ImageSrcMain: string;
        public ImageSrcExtra: string;

        public PlayClipMain = () => {
            //this.playClip(this.Feature.ClipMain);
            this.playClip("file:///android_asset/www/appdata/ikkajo_001_m.mp4");
        }

        public PlayClipExtra = () => {
            this.playClip("https://www.youtube.com/watch?v=en_sVVjWFKk");
        }

        private playClip(clipLocation: string) {
            console.log("Play clip: " + clipLocation)
            var host: any = window.plugins;
            host.videoPlayer.play(clipLocation);
            /*, {
                    volume: 0.5,
                    scalingMode: VideoPlayer.SCALING_MODE.SCALE_TO_FIT_WITH_CROPPING
                },
                function () {
                    console.log("video completed");
                },
                function (err) {
                    console.log(err);
                }
            );
            */
        }
    }
    //https://github.com/moust/cordova-plugin-videoplayer
    //https://github.com/dawsonloudon/VideoPlayer
    //https://blog.nraboy.com/2015/01/embed-video-ios-android-ionicframework-app/
    //https://codepen.io/mhartington/pen/Khzxc
    //http://devdactic.com/images-videos-fullscreen-ionic/
    cerebralhikeControllers.controller(FeatureDetailController.Alias, FeatureDetailController);
}