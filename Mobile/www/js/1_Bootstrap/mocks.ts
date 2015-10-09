﻿module cerebralhike.mocks {
    export class CordovaFile {
        constructor(public $q) {
            console.log('Mocked the $cordovaFile')
            cordova = <Cordova> {
                file: { externalDataDirectory: '' }
            };
        }

        public checkDir = (): angular.IPromise<void> => {
            return this.$q.reject("mocked");
        }
    }

    export class CordovaFileTransfer {
        constructor() {
            console.log('Mocked the $cordovaFileTransfer')
        }
    }

    angular.module('mocker', [])
        .config($provide=> {
            if (!ionic.Platform.isAndroid()) {
                $provide.service('$cordovaFile', CordovaFile);
                $provide.service('$cordovaFileTransfer', CordovaFileTransfer);
            }
        });
}