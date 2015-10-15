/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class ErrController {
        public static Alias = "ErrController";
        constructor(public ErrorsService: ErrorsService) { }
	}
    cerebralhikeControllers.controller(ErrController.Alias, ErrController);
}