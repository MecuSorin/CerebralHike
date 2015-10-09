/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class FeatureService {
		public static Alias = "FeatureService";
		//public static $inject = ['$q', ErrorsService.Alias, DeviceStatusService.Alias, '$timeout'];

        constructor(public downloadService: DownloadService, public $q: angular.Enhanced.IQService)
		{ }

        public LoadFeatures = (): angular.IPromise<IFeature[]> => {
            return this.downloadService.LoadLegend()
                .then(n=> this.$q.when(this.downloadService.Files));
        }

        //public Features: IFeature[] = null;

        //public LoadFeatures(): angular.IPromise<void> {
        //    if (this.Features) {
        //        return this.$q.when();
        //        console.log("Features is populated already");
        //    }
        //    var deferred = this.$q.defer<void>();
        //    var featureProviders = [this.apiFactory.GetFeaturesList, this.apiFactory.GetFeaturesList1,
        //        this.apiFactory.GetFeaturesList2, this.apiFactory.GetFeaturesList3,
        //        this.apiFactory.GetFeaturesList4,
        //        this.apiFactory.GetFeaturesList5, this.apiFactory.GetFeaturesList6];
        //    var validLink = false;
        //    var fpIndex = 0;
        //    var result;
        //    while (!validLink && fpIndex < featureProviders.length) {
        //        var fp = featureProviders[fpIndex++];
        //        var promise = fp();
        //        promise.then(a=> {
        //            validLink = true;
        //            console.log("ooooooooooooooooooooooooJackpot");
        //        });
        //    }
            
        //    this.Features = [];
        //    return this.$q.when();
        //}


        //public LoadFeatures(): angular.IPromise<void> {
        //    if (this.Features) {
        //        return this.$q.when();
        //    }
        //    var deferred = this.$q.defer<void>();
        //    this.apiFactory.GetFeaturesList()
        //        .then(features=> {

        //            throw 'Not implemented';
        //            //this.Features = features;
        //            //var videoPathComposer = this.apiFactory.GetVideoPathComposer();
        //            //var featureUpdater = (feature: IFeature, index:number) => {
        //            //    feature.Id = index;
        //            //    feature.ClipMain = videoPathComposer(feature.ClipMain);
        //            //    feature.ClipExtra = videoPathComposer(feature.ClipExtra);
        //            }
        //            this.Features.forEach((feature, index) => featureUpdater(feature, index + 1));
        //            deferred.resolve();
        //        })
        //        .catch(reason=> deferred.reject(reason));
        //    return deferred.promise;
        //}

        public GetFeature = (featureId: string): IFeature => {
            console.log("Searching for feature with id: " + featureId);
            if (!this.downloadService.Files) throw "No features loaded yet";
            for (var i = 0, lngth = this.downloadService.Files.length; i < lngth; i++) {
                var feature = this.downloadService.Files[i];
                if (feature.Id === parseInt(featureId)) {
                    console.log("Found feature: " + feature.Japan);
                    return feature;
                }
            }
            throw "Couldn't find feature with id: " + featureId;
        }
	}

	cerebralhikeServices.service(FeatureService.Alias, FeatureService);
}

