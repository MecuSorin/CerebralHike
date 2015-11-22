/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class FeatureListController {
        public static Alias ="FeatureListController";

        public Features :IFeature[] = [];
        public FailedToLoadFeatures: string = "Loading ...";
        constructor(public $scope: angular.IScope, public FeatureService: FeatureService) {
            FeatureService.LoadFeatures()
                .then(()=>this.ShowFeatures())
                .catch(reason=>this.ShowErrorLoadingFeatures(reason))
                .finally(() => this.RefreshScope());
        }

        public FeatureFilter: string = '';
        private RefreshScope = () => {
            if (!this.$scope.$$phase) { 
                this.$scope.$apply();
            }
        };

        private ShowErrorLoadingFeatures = reason=> {
            this.Features = [];
            this.FailedToLoadFeatures = "Failed to load" + reason.toString();
        };

        private ShowFeatures = () => {
            this.FeatureService.LoadFeatures()
                .then(features => {
                    this.Features = features;
                    if (0 == this.Features.length) {
                        this.FailedToLoadFeatures = "Data is not available";
                    }
                    else {
                        this.FailedToLoadFeatures = ""; //= "Found " + this.Features.length;
                    }
                })
                .catch(reason=> {
                    this.Features = [];
                    this.FailedToLoadFeatures = reason;
                });
        };

        public HideFeature(feature: IFeature): void {
            feature.ToHide = !feature.ToHide;
            this.FeatureService.downloadService.SaveLocalLegend();
        }

        public static GetLearnFeatureAppPath(feature: IFeature, appendRoot?: boolean): string {
            return ((appendRoot) ? '#' : '') + '/app/learn/' + feature.Id;
        }

        public ClearFilter = () => {
            this.FeatureFilter = '';
        };
	}

	cerebralhikeControllers.controller(FeatureListController.Alias, FeatureListController);
}