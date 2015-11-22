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

    cerebralhikeLogger.filter('toArray', function () {
        return function (items) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            return filtered;
        };
    });

    export var cerebralhikeServices = angular.module('cerebralhike.services', dependinces);
    export var cerebralhikeControllers = angular.module('cerebralhike.controllers', ['cerebralhike.services', 'angular-chartist']);
    
}
var cerebralhikeApp = angular.module('starter', ['ionic', 'cerebralhike.controllers']);