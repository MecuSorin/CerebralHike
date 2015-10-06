/// <reference path="../0_typings/angularjs/angular.d.ts" />
/// <reference path="../0_typings/ionic/ionic.d.ts" />
/// <reference path="interfaces.d.ts" />

module cerebralhike {
    var dependinces = [];
    if (ionic.Platform.isAndroid()) {
        dependinces = ['ngCordova', 'ngCordova.plugins.file', 'ngCordova.plugins.fileTransfer'];
    }

    export var cerebralhikeServices = angular.module('cerebralhike.services', dependinces);
    export var cerebralhikeControllers = angular.module('cerebralhike.controllers', ['cerebralhike.services']);
    
}
var cerebralhikeApp = angular.module('starter', ['ionic', 'cerebralhike.controllers', 'cerebralhike.services']);
