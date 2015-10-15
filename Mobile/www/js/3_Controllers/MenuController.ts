/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class MenuController {
        public static Alias = "MenuController";
        constructor($scope: any, apiFactory: ApiFactory) {
            apiFactory.GetLatestDropboxLabelForTheBuild().then(label=> {
                chLogger.log("App label: " + AppVersion.DropboxLabelAtBuildTime + " Dropbox label: " + label);
                this.IsUpdateVersionVisible = (AppVersion.DropboxLabelAtBuildTime != label);
            });
        }

        public IsLogVisible: boolean = false;
        public IsUpdateVersionVisible: boolean = false;
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