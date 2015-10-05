/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class FeatureListController {
        public static Alias ="FeatureListController";
        public static $inject=['$scope', FeatureService.Alias];

        public Features :IFeature[] = [];
        public FailedToLoadFeatures :string = "Loading ..."
        constructor(public $scope: angular.IScope, public FeatureService: FeatureService) {
            FeatureService.LoadFeatures()
                .then(()=>this.ShowFeatures())
                .catch(reason=>this.ShowErrorLoadingFeatures(reason))
                .finally(()=>this.RefreshScope());
        }

        private RefreshScope = () => {
            if (!this.$scope.$$phase) { 
                this.$scope.$apply();
            }
        };

        private ShowErrorLoadingFeatures = reason=> {
            this.Features = [];
            this.FailedToLoadFeatures = "Failed to load" + reason.toString();
        }

        private ShowFeatures = () => {
            this.Features = this.FeatureService.Features;
            if (0 == this.Features.length) {
                this.FailedToLoadFeatures = "Data is not available";
            }
            else {
                this.FailedToLoadFeatures = ""; //= "Found " + this.Features.length;
            }
        }
	}

	cerebralhikeControllers.controller(FeatureListController.Alias, FeatureListController);
}