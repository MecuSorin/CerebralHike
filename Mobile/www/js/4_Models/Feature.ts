module cerebralhike {
    export class Feature implements IFeature  {
        private static lastIdUsed:number = 0;
        constructor() {
            this.Id = Feature.lastIdUsed + 1;
            Feature.lastIdUsed += 1;
        }

        public static ToLocal(cloudFeatures: ICloudFeature[]): IFeature[] {
            var result: IFeature[] = [];
            for (var i = 0, lngth = cloudFeatures.length; i < lngth; i++) {
                result.push(Feature.FromCloud(cloudFeatures[i]));
            }
            return result;
        }

        public static ToLocalInstance(cloudFeatures: IFeature[], featureVerifier: IFeatureVerifier): IFeature[] {
            var result: IFeature[] = [];
            for (var i = 0, lngth = cloudFeatures.length; i < lngth; i++) {
                result.push(Feature.FromLocal(cloudFeatures[i], featureVerifier));
            }
            return result;
        }

        public Id: number;          // sould be ignored on deserialization
        public Book: string;
        public Attack: string;
        public Front: string;
        public Position: string;
        public Japan: string;
        public Ro: string;
        public ClipMainCloud: string;
        public ClipMainLocal: string;
        public ClipExtraCloud: string;
        public ClipExtraLocal: string;
        public ThumbMainCloud: string;
        public ThumbMainLocal: string;
        public ThumbExtraCloud: string;
        public ThumbExtraLocal: string;
        public ToBeDownloaded: boolean;
        public ToBeDeleted: boolean;
        public ToHide: boolean;

        public static AreEqual(first: IFeature, second: IFeature) {
            return first && second && first.Book == second.Book && first.Japan == second.Japan;
        }

        public static UpdateLocalFromCloud(first: IFeature, second: IFeature) {
            if (first.ClipMainCloud != second.ClipMainCloud) {
                console.log('updated [' + first.Japan + '] main clip url from:' + first.ClipMainCloud + ' to:' + second.ClipMainCloud);
            }
            first.ClipMainCloud = second.ClipMainCloud;
            first.ClipExtraCloud = second.ClipExtraCloud;
            first.ThumbMainCloud = second.ThumbMainCloud;
            first.ThumbExtraCloud = second.ThumbExtraCloud;
            first.Book = second.Book;
            first.Attack = second.Attack;
            first.Front = second.Front;
            first.Position = second.Position;
        }

        private static FromLocal(source: IFeature, featureVerifier: IFeatureVerifier) {
            var result = new Feature();
            result.Book = source.Book;
            result.Attack = source.Attack;
            result.Front = source.Front;
            result.Position = source.Position;
            result.Japan = source.Japan;
            result.Ro = source.Ro;
            result.ClipMainCloud = source.ClipMainCloud;
            result.ClipMainLocal = source.ClipMainLocal;
            result.ClipExtraCloud = source.ClipExtraCloud;
            result.ClipExtraLocal = source.ClipExtraLocal;
            result.ThumbMainCloud = source.ThumbMainCloud;
            result.ThumbMainLocal = source.ThumbMainLocal;
            result.ThumbExtraCloud = source.ThumbExtraCloud;
            result.ThumbExtraLocal = source.ThumbExtraLocal;
            result.ToBeDownloaded = source.ToBeDownloaded;
            result.ToBeDeleted = source.ToBeDeleted;
            result.ToHide = source.ToHide;
            featureVerifier.UpdateLocalClipsStatus(result);
            return result;
        }

        private static FromCloud(source: ICloudFeature) {
            var result = new Feature();
            result.Book = source.Book;
            result.Attack = source.Attack;
            result.Front = source.Front;
            result.Position = source.Position;
            result.Japan = source.Japan;
            result.Ro = source.Ro;
            result.ClipMainCloud = source.ClipMain;
            result.ClipMainLocal = null;
            result.ClipExtraCloud = source.ClipExtra;
            result.ClipExtraLocal = null;
            result.ThumbMainCloud = source.ThumbMain;
            result.ThumbMainLocal = null;
            result.ThumbExtraCloud = source.ThumbExtra;
            result.ThumbExtraLocal = null;
            result.ToBeDownloaded = true;
            result.ToBeDeleted = false;
            result.ToHide = false;
            return result;
        }

        public static UpdateToDownloadAfterResourceDownload(feature: IFeature) {
            feature.ToBeDownloaded = (feature.ClipMainLocal && feature.ClipExtraLocal) ? true : false;
            if (!feature.ToBeDownloaded) {
                console.log("Feature " + feature.Japan + " have both clips now");
            }
        }

        public static HasLocalMainClip(feature: IFeature): boolean {
            return feature.ClipMainLocal ? true : false;
        }

        public static HasLocalExtraClip(feature: IFeature): boolean {
            return feature.ClipExtraLocal ? true : false;
        }
    }
}