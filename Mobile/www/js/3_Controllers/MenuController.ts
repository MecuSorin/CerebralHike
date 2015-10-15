/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class MenuController {
        public static Alias ="MenuController";
        constructor() {
        }

        public IsLogVisible: boolean = false;

        public ExitApp = () => {
            chLogger.log("Exit application");
            ionic.Platform.exitApp();
        }

        public ShowLogs = () => {
            this.IsLogVisible = true;
            console.log((<ErrorsService>angular.injector(['cerebralhike.services']).get(ErrorsService.Alias)).Errors.length);

        }
	}

	cerebralhikeControllers.controller(MenuController.Alias, MenuController);
}