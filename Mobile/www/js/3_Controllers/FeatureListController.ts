/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class FeatureListController {
        public static Alias ="FeatureListController";

        public Features: IFeature[] = [];
        public FailedToLoadFeatures: string = "Loading ...";

        constructor(public $scope: IFilteredScope, public FeatureService: FeatureService, public filterFilter: angular.IFilterFunc) {
            FeatureService.LoadFeatures()
                .then(()=>this.ShowFeatures())
                .catch(reason=>this.ShowErrorLoadingFeatures(reason))
                .finally(() => this.RefreshScope());
        }

        public FeatureFilter: string = '';

        public UpdateFilter = () => {
            try {
                var logMessage = "Showing " + this.FeatureService.FilteredFeatures.length + "/" + this.Features.length + " filtered features by [" + this.FeatureFilter + "]";
                this.FeatureService.UpdateFilteredFeatures(this.filterFilter(this.Features, this.FeatureFilter), logMessage);
            }
            catch (err) {
                chLogger.log(err);
            }
        }

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
                    this.UpdateFilter();
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

        public static GetLearnFeatureAppPath(feature: IFeature, allowNextPreviousNavigation: boolean, appendRoot?: boolean): string {
            return ((appendRoot) ? '#' : '') + '/app/learn/' + feature.Id + '/' + allowNextPreviousNavigation;
        }

        public ClearFilter = () => {
            this.FeatureFilter = '';
            this.UpdateFilter();
        };

        public UserChecked = () => {
            this.FeatureService.UserSwitchedToHideTo(false);
        }

        public UserUnchecked = () => {
            this.FeatureService.UserSwitchedToHideTo(true);
        }

     
	}

	cerebralhikeControllers.controller(FeatureListController.Alias, FeatureListController);
}