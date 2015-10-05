/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
/// <reference path="../0_typings/ionic/ionic.d.ts" />
/// <reference path="../0_typings/jquery/jquery.d.ts" />

module cerebralhike {

    export class ApiVerbs {
        private static root = 'appdata/';
        private static images = "img/";
        public static FeaturesList = "legend.json";

        public static GetRoot(): string {
            var url = ApiVerbs.root;
            if (ionic.Platform.isAndroid()) {
                url = "/android_asset/www/" + ApiVerbs.root;
            }
            return url;
        }

        public static GetImagesRoot(): string {
            var url = ApiVerbs.root;
            if (ionic.Platform.isAndroid()) {
                url = "/android_asset/www/" + ApiVerbs.images;
            }
            return url;
        }
    }

    export class ApiFactory {
        public static Alias = "apiFactory";
        constructor(public $http: angular.IHttpService, public $q: angular.Enhanced.IQService, public ErrorsService: ErrorsService) {
        }

        public GetFeaturesList = (): angular.IPromise<IFeature[]> => {
            return this.GetResponse<IFeature[]>(ApiVerbs.GetRoot()+"legend.json");
        }

        public GetVideoPathComposer(): ((clip: string) => string) {
            return (clipName: string) => ApiVerbs.GetRoot() + clipName;
        }

        public GetResponse<T>(url: string): angular.IPromise<T> {
            var result = this.$http.get<T>(url);
            console.log(url);
            return this.WrapResponse<T>(result);
        }

        public WrapResponse<T>(promise: angular.IHttpPromise<T>): angular.IPromise<T> {
            var deferred = this.$q.defer<T>();
            promise.then(response=> {
                deferred.resolve(response.data)
            }, reason=> {
                var reasonContent = "";
                try {
                    reasonContent = ApiFactory.ExtractContent(reason.data, "#content");
                }
                catch (exc) {
                    reasonContent = reason.data;
                }
                var errorMessage = reason.config.url + " === " + reason.statusText + " === " + reasonContent;
                this.ErrorsService.addError(errorMessage);
                deferred.reject(reason)
            });
            return deferred.promise;
        }

        public static ExtractContent(html: string, elementId: string): string {
            return jQuery(html).filter(elementId).html();
        }
    }

    cerebralhikeServices.factory(ApiFactory.Alias, ($http: angular.IHttpService, $q: angular.Enhanced.IQService, ErrorsService: ErrorsService) => new ApiFactory($http, $q, ErrorsService));
} 

