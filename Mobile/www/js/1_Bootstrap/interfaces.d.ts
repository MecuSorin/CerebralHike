/// <reference path="../0_typings/angularjs/angular.d.ts" />

declare var cerebralhikeApp: angular.IModule;
declare var VideoPlayer: any;
declare var ionic: any;

//declare var bluetoothSerial: blueclient.mocks.IBluetoothSerialMock;
//declare var myVeryOwnDebuggingSpace: any;
//declare var cordova:Cordova;

declare module cerebralhike.mocks {

}



declare module angular.Enhanced {
    interface IQService extends angular.IQService {
        Reject<Tp>(reason?: any): angular.IPromise<Tp>; //|Tp nu mai merge ???
    }
}

declare module cerebralhike {
	interface IIdentified {
		Id: string;
	}

    interface IDictionaryEntry {
        Japan: string;
        Ro: string;
    }

    interface ICloudFeature {
        Book: string;
        Attack: string;
        Front: string;
        Position: string;
        Japan: string;
        Ro: string;
        ClipMain: string;
        ClipExtra: string;
        ThumbMain: string;
        ThumbExtra: string;
    }

    interface IFeature {
        Id: number;
        Book: string;
        Attack: string;
        Front: string;
        Position: string;
        Japan: string;
        Ro: string;
        ClipMainCloud: string;
        ThumbMainCloud: string;
        ClipMainLocal: string;
        ThumbMainLocal: string;
        ClipExtraCloud: string;
        ThumbExtraCloud: string;
        ClipExtraLocal: string;
        ThumbExtraLocal: string;
        ToBeDownloaded: boolean;
        ToBeDeleted: boolean;
        ToHide: boolean;
    }

    interface IFeatureVerifier {
        UpdateLocalClipsStatus(feature: IFeature);
    }


    interface IQuizScore {
        Correct: number;
        Questions: number;
    }

    interface IScoreEntry {
        Date: string;
        Dictionary: IQuizScore;
        Glossary: IQuizScore;
        Techniques: IQuizScore;
    }
}


declare module ngCordova {

    interface RemovedItem<T> {
        success: boolean;
        fileRemoved: T;
    }

    interface IFile {
        getFreeDiskSpace(): angular.IPromise<number>;
        checkDir(path: string, dir: string): angular.IPromise<Entry>;   //
        checkFile(path: string, fileName: string): angular.IPromise<Entry>; //
        createDir(path: string, dirName: string, replaceBool: boolean): angular.IPromise<DirectoryEntry>;
        createFile(path: string, fileName: string, replaceBool: boolean): angular.IPromise<FileEntry>;
        removeDir(path: string, dir: string): angular.IPromise<RemovedItem<DirectoryEntry>>;
        removeFile(path: string, fileName: string): angular.IPromise<RemovedItem<FileEntry>>;
        removeRecursively(path: string, dir: string): angular.IPromise<RemovedItem<DirectoryEntry>>;
        writeFile(path: string, fileName: string, text: string, replaceBool: boolean): angular.IPromise<ProgressEvent>;
        writeExistingFile(path: string, fileName: string, text: string): angular.IPromise<ProgressEvent>;
        readAsText(path: string, fileName: string): angular.IPromise<string>; //?
        readAsDataURL(path: string, fileName: string): angular.IPromise<string>; //?
    }

    interface IFileTransfer {
        download(source: string, filePath: string, options: any, trustAllHosts: boolean): angular.IPromise<FileEntry>;
    }

    interface INetworkService {
        getNetwork(): Connection;
        isOnline(): boolean;
    }
}
