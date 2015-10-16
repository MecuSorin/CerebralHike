/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
/// <reference path="../0_typings/ionic/ionic.d.ts" />
/// <reference path="../0_typings/jquery/jquery.d.ts" />
/// <reference path="../0_typings/cordova/plugins/filesystem.d.ts" />

module cerebralhike {

    export class ApiVerbs {
        private static root = 'appdata/';
        private static images = "img/";
        public static FeaturesList = "legend.json";
        public static LegendSource = "https://www.dropbox.com/s/b6nglf3fo770auy/legend.json?dl=1";
        public static LatestBuild = "https://www.dropbox.com/s/d983ozfk63ug1en/CerebralHikeApp.apk?dl=1";
        public static GetRoot(): string {
            var url = ApiVerbs.root;
            if (ionic.Platform.isAndroid()) {
                url = "/android_asset/www/" + ApiVerbs.root;
            }
            return url;
        }

        public static GetImagesRoot(): string {
            var url = ApiVerbs.images;
            if (ionic.Platform.isAndroid()) {
                url = "/android_asset/www/" + ApiVerbs.images;
            }
            return url;
        }
    }

    export class LocalVerbs {
        public static GetStorage(): string { return cordova.file.externalDataDirectory; }//cordova.file.dataDirectory;// 'externalDataDirectory'; 
        public static legend = 'legend.json';
        public static achievement = 'achievement.json';

        public static GetDictionary(): string { return ApiVerbs.GetRoot() + "dictionary.txt"; }

        public static GetNewFile(suggestedName: string): string {
            var name = LocalVerbs.GetStorage() + suggestedName;
            chLogger.log("Creating file: " + name);
            return name;
        }
    }

    export class ApiFactory {
        public static Alias = "apiFactory";
        constructor(public $http: angular.IHttpService,
            public $q: angular.Enhanced.IQService,
            public $timeout: angular.ITimeoutService,
            public ErrorsService: ErrorsService) {
        }

        public GetLatestDropboxLabelForTheBuild(): angular.IPromise<string> {
            var headerPromise = this.$timeout(400).then(() => this.$http.head(ApiVerbs.LatestBuild));
            headerPromise.then(response=> chLogger.log("Received the header for latestbuild"));
            return headerPromise.then((response: any) => <string>response.headers("etag"));
        }

        public GetDictionary(): angular.IPromise<string> {
            var dictionaryPath = LocalVerbs.GetDictionary();        
            return this.$http.get<string>(dictionaryPath).then(response => response.data);      // reading from the file with $cordovaFile.readAllText is not working
        }

        public GetOriginalLegend(): angular.IPromise<ICloudFeature[]> {
            return this.GetResponse<ICloudFeature[]>(ApiVerbs.LegendSource);
        }

        public GetAchievement(achievementPath: string): angular.IPromise<IScoreEntry[]> {
            return this.GetResponse<IScoreEntry[]>(achievementPath);
        }

        public GetLegend(filePath: string): angular.IPromise<IFeature[]> {
            return this.GetResponse<IFeature[]>(filePath);
        }


        public GetFeaturesList = (): angular.IPromise<IFeature[]> => {
            return this.GetResponse<IFeature[]>(ApiVerbs.GetRoot()+"legend.json");
        }

        public GetVideoPathComposer(): ((clip: string) => string) {
            return (clipName: string) => ApiVerbs.GetRoot() + clipName;
        }

        public GetResponse<T>(url: string): angular.IPromise<T> {
            var result = this.$http.get<T>(url);
            chLogger.log('Request made for: ' +url);
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
            chLogger.log('Extracting json from: ' + html);
            return jQuery(html).filter(elementId).html();
        }
    }

    cerebralhikeServices.factory(ApiFactory.Alias, ($http: angular.IHttpService, $q: angular.Enhanced.IQService, $timeout: angular.ITimeoutService, ErrorsService: ErrorsService) => new ApiFactory($http, $q, $timeout, ErrorsService));
} 

