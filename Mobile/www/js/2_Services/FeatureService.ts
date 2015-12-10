/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class FeatureService {
		public static Alias = "FeatureService";
		//public static $inject = ['$q', ErrorsService.Alias, DeviceStatusService.Alias, '$timeout'];

        constructor(public downloadService: DownloadService, public $q: angular.Enhanced.IQService)
		{ }

        public FilteredFeatures: IFeature[] = [];
        public IsNavigationAvailable: boolean = false;

        public GetNextFeature = (feature: IFeature): IFeature => {
            return this.GetFeatureFromFilteredFeaturesListWithOffsetFrom(feature, 1);
        };
       
        public GetPreviousFeature = (feature: IFeature): IFeature => {
            return this.GetFeatureFromFilteredFeaturesListWithOffsetFrom(feature, -1);
        };
        
        private GetFeatureFromFilteredFeaturesListWithOffsetFrom = (referenceFeature: IFeature, offset: number): IFeature => {
            if (angular.isUndefined(this.FilteredFeatures) || 2 > this.FilteredFeatures.length) {
                chLogger.log("Cannot navigate from feature " + feature.Japan);
                return feature;
            }

            for (var i = 0, lngth = this.FilteredFeatures.length; i < lngth; i++) {
                var feature = this.FilteredFeatures[i];
                if (feature.Id === referenceFeature.Id) {
                    return this.FilteredFeatures[(lngth + i + offset) % lngth];
                }
            }
        };

        public LoadFeatures = (): angular.IPromise<IFeature[]> => {
            return this.downloadService.LoadLegend()
                .then(n=> this.$q.when(this.downloadService.Files));
        };

        public GetFeature = (featureId: string): IFeature => {
            chLogger.log("Searching for feature with id: " + featureId);
            if (!this.downloadService.Files) throw "No features loaded yet";
            for (var i = 0, lngth = this.downloadService.Files.length; i < lngth; i++) {
                var feature = this.downloadService.Files[i];
                if (feature.Id === parseInt(featureId)) {
                    chLogger.log("Found feature: " + feature.Japan);
                    return feature;
                }
            }
            throw "Couldn't find feature with id: " + featureId;
        };

        public UserSwitchedToHideTo = (value: boolean) => {
            if (0 == this.FilteredFeatures.length) {
                return;
            }
            angular.forEach(this.FilteredFeatures, feature=> feature.ToHide = value);
            chLogger.log("Updated ToHide to " + value + " for " + this.FilteredFeatures.length + " techniques");
            this.downloadService.SaveLocalLegend();
        };

        public UpdateFilteredFeatures = (filteredFeatures: IFeature[], logMessage: string) => {
            this.FilteredFeatures = filteredFeatures;
            chLogger.log(logMessage);
            this.IsNavigationAvailable = (angular.isDefined(this.FilteredFeatures) && 1 < this.FilteredFeatures.length);
        };
	}

	cerebralhikeServices.service(FeatureService.Alias, FeatureService);
}

