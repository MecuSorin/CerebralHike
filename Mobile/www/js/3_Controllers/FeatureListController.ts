/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class FeatureListController {
        public static Alias ="FeatureListController";

        public Features :IFeature[] = [];
        public FailedToLoadFeatures: string = "Loading ...";
        constructor(public $scope: IFilteredScope, public FeatureService: FeatureService) {
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

        public UserChecked = () => {
            this.UserSwitchedToHideTo(true, this.$scope.myFilteredFeatures);
        }

        public UserUnchecked = () => {
            this.UserSwitchedToHideTo(false, this.$scope.myFilteredFeatures);
        }

        public UserCheckedItems = (features:IFeature[]) => {
            this.UserSwitchedToHideTo(false, features);
        }

        public UserUncheckedItems = (features: IFeature[]) => {
            this.UserSwitchedToHideTo(true, features);
        }

        private UserSwitchedToHideTo = (value: boolean, filteredFeatures: IFeature[]) => {
            if (!filteredFeatures) {
                chLogger.log("User checked/unchecked on undefined collection");

                var aaaa: any = this.$scope;
                chLogger.log(aaaa);
                return;
            }
            if (0 == filteredFeatures.length) {
                chLogger.log("Unable to peform change because no feature was filtered");
                return;
            }
            angular.forEach(filteredFeatures, feature=> feature.ToHide = value);
            chLogger.log("Updated ToHide to "+value+" for " + filteredFeatures.length + " techniques");
            this.FeatureService.downloadService.SaveLocalLegend();
        }
	}

	cerebralhikeControllers.controller(FeatureListController.Alias, FeatureListController);
}