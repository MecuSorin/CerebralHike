/// <reference path="../0_typings/angularjs/angular.d.ts" />

declare var cerebralhikeApp: angular.IModule;
declare var VideoPlayer: any;
declare var ionic: any;

declare module angular.Enhanced {
    interface IQService extends angular.IQService {
        Reject<T>(reason?: any): angular.IPromise<T> | T
    }
}

declare module cerebralhike {
	interface IIdentified {
		Id: string;
	}

    interface IFeature {
        Id: number;
		Japan: string;
		Ro: string;
		ClipMain: string;
		ClipExtra: string;
	}
}

declare module cerebralhike.mocks {
}

//declare var bluetoothSerial: blueclient.mocks.IBluetoothSerialMock;
//declare var myVeryOwnDebuggingSpace: any;
