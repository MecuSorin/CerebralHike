/// <reference path="../0_typings/angularjs/angular.d.ts" />
/// <reference path="../0_typings/ionic/ionic.d.ts" />
/// <reference path="interfaces.d.ts" />
/// <reference path="../2_services/errorsservice.ts" />

module cerebralhike {
    var dependinces = [];
    if (ionic.Platform.isAndroid()) {
        dependinces = ['cerebralhike.logs', 'mocker', 'ngCordova', 'ngCordova.plugins.file', 'ngCordova.plugins.fileTransfer', 'ngCordova.plugins.network'];
    }

    export var cerebralhikeLogger = angular.module('cerebralhike.logs', []);
    cerebralhikeLogger.service(ErrorsService.Alias, ErrorsService.Register);

    export var cerebralhikeServices = angular.module('cerebralhike.services', dependinces);
    export var cerebralhikeControllers = angular.module('cerebralhike.controllers', ['cerebralhike.services']);
    
}
var cerebralhikeApp = angular.module('starter', ['ionic', 'cerebralhike.controllers']);