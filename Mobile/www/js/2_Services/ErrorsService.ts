/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class Error {
		private static lastId :number = 0;
		constructor(public message: any) {
			this.Id = Error.lastId+1;	// javascript is secvential so it is ok 
			Error.lastId += 1;			// no atomic wrapers are needed
		}
		public Id:number = 0;
	}

	export class ErrorsService {
        public static Alias = "ErrorsService";
        constructor($q: angular.Enhanced.IQService) {
            this.errorsNotifier = $q.defer<Error>();
            this.ErrorsPipe = this.errorsNotifier.promise;

        }
        private errorsNotifier: angular.IDeferred<Error>;
        public ErrorsPipe: angular.IPromise<Error>;

        public addError = (message: any) => {
            this.errorsNotifier.notify(new Error(message));
            console.log(message);
		}
	}

    cerebralhikeServices.service(ErrorsService.Alias, ErrorsService);
}

