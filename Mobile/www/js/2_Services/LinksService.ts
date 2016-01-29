/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
module cerebralhike {
	export class LinksService {
		public static Alias = "LinksService";

        constructor(public apiFactory: ApiFactory, public $q: angular.Enhanced.IQService)
        {
            this.LoadLinks();
        }

        private Links: ILink[] = null;

        public LoadLinks = () : angular.IPromise<ILink[]> => {
            if(angular.isArray(this.Links)) {
                return this.$q.when(this.Links);
            }
            var deferredPromise = this.$q.defer<ILink[]>();
            this.apiFactory.GetLinksList()
                .then(links=> this.Links = links)
                .catch(reason => this.Links = [{ Text: "Failed to download the links", Link: "" }])
                .finally(() => deferredPromise.resolve(this.Links));
            return deferredPromise.promise;
        }
	}

	cerebralhikeServices.service(LinksService.Alias, LinksService);
}

