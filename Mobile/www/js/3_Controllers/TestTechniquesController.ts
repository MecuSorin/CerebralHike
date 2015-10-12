/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class TestTechniquesController {
        public static Alias ="TestTechniquesController";

        constructor(public $scope: angular.IScope, public downloadService: DownloadService) {
        }
	}

	cerebralhikeControllers.controller(TestTechniquesController.Alias, TestTechniquesController);
}