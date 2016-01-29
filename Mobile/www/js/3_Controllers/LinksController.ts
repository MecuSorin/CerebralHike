/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class LinksController {
        public static Alias = "LinksController";

        constructor(public LinksService: LinksService) {
        }

        public ShowVideo = (link: ILink) => {
            if(link.Link.length>0)
                Utils.PlayClip(link.Link);
        };
	}
    cerebralhikeControllers.controller(LinksController.Alias, LinksController);
}