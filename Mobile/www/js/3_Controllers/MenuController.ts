/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class MenuController {
        public static Alias ="MenuController";
        constructor() {
        }

        public ExitApp = () => {
            console.log("Exit application");
            ionic.Platform.exitApp();
        }
	}

	cerebralhikeControllers.controller(MenuController.Alias, MenuController);
}