module cerebralhike.mocks {
    export class CordovaFile {
        constructor(public $q) {
            chLogger.log('Mocked the $cordovaFile')
            cordova = <Cordova>{
                file: { externalDataDirectory: '' }
            };
        }

        public checkDir = (): angular.IPromise<void> => {
            return this.$q.reject("mocked");
        }
    }

    export class CordovaFileTransfer {
        constructor() {
            chLogger.log('Mocked the $cordovaFileTransfer')
        }
    }

    angular.module('mocker', [])
        .config($provide=> {
            if (!ionic.Platform.isAndroid()) {
                $provide.service('$cordovaFile', CordovaFile);
                $provide.service('$cordovaFileTransfer', CordovaFileTransfer);
            }
        });

    export class Generator {
        public static GetFakeAchievementsHistory(days: number): IScoreEntry[] {
            var result = new Array<IScoreEntry>(days);
            var buffer = 0;
            for (var i = 0; i < days; i++) {
                result[i] = {
                    Date: '' + i,
                    Dictionary: {
                        Correct: buffer = 1+Utils.GetRandom(100),
                        Questions: 1 +Utils.GetRandom(buffer)
                    },
                    Glossary: {
                        Correct: buffer = 1 + Utils.GetRandom(100),
                        Questions: 1 + Utils.GetRandom(buffer)
                    },
                    Techniques: {
                        Correct: buffer = 1 + Utils.GetRandom(100),
                        Questions: 1 +Utils.GetRandom(buffer)
                    }
                };
            }
            return result;
        }
    }
}