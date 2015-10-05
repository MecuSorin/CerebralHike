/// <reference path="../0_typings/angularjs/angular.d.ts" />
/// <reference path="../0_typings/ionic/ionic.d.ts" />
/// <reference path="interfaces.d.ts" />

module cerebralhike {
	export var cerebralhikeServices = angular.module('cerebralhike.services', []);
    export var cerebralhikeControllers = angular.module('cerebralhike.controllers', ['cerebralhike.services']);
    
}
var cerebralhikeApp = angular.module('starter', ['ionic', 'cerebralhike.controllers', 'cerebralhike.services']);
