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
        public Japan: string;
        public Ro: string;
        public ClipMainCloud: string;
        public ClipMainLocal: string;
        public ClipExtraCloud: string;
        public ClipExtraLocal: string;
        public ToBeDownloaded: boolean;
        public ToBeDeleted: boolean;
        public ToHide: boolean;

        public static AreEqual(first: IFeature, second: IFeature) {
            return first && second && first.Book == second.Book && first.Japan == second.Japan;
        }

        public static UpdateLocalFromCloud(first: IFeature, second: IFeature) {
            first.ClipMainCloud = second.ClipMainCloud;
            first.ClipExtraCloud = second.ClipExtraCloud;
        }

        private static FromLocal(source: IFeature, featureVerifier: IFeatureVerifier) {
            var result = new Feature();
            result.Book = source.Book;
            result.Japan = source.Japan;
            result.Ro = source.Ro;
            result.ClipMainCloud = source.ClipMainCloud;
            result.ClipMainLocal = source.ClipMainLocal;
            result.ClipExtraCloud = source.ClipExtraCloud;
            result.ClipExtraLocal = source.ClipExtraLocal;
            result.ToBeDownloaded = source.ToBeDownloaded;
            result.ToBeDeleted = source.ToBeDeleted;
            result.ToHide = source.ToHide;
            featureVerifier.UpdateLocalClipsStatus(result);
            return result;
        }

        private static FromCloud(source: ICloudFeature) {
            var result = new Feature();
            result.Book = source.Book;
            result.Japan = source.Japan;
            result.Ro = source.Ro;
            result.ClipMainCloud = source.ClipMain;
            result.ClipMainLocal = null;
            result.ClipExtraCloud = source.ClipExtra;
            result.ClipExtraLocal = null;
            result.ToBeDownloaded = false;
            result.ToBeDeleted = false;
            result.ToHide = false;
            return result;
        }
    }
}