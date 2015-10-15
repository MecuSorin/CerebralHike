/// <reference path="../4_models/logger.ts" />

module cerebralhike {
    export class Error {
        private static lastId: number = 0;
        constructor(public message: any) {
            this.Id = Error.lastId + 1;	// javascript is secvential so it is ok 
            Error.lastId += 1;			// no atomic wrapers are needed
        }
        public Id: number = 0;
    }

    export class ErrorsService {
        public static Alias = "ErrorsService";
        constructor($q: angular.Enhanced.IQService) {
            this.errorsNotifier = $q.defer<Error>();
            this.ErrorsPipe = this.errorsNotifier.promise;

        }
        private errorsNotifier: angular.IDeferred<Error>;

        public Errors: Error[] = [];
        public ErrorsPipe: angular.IPromise<Error>;

        public addError = (message: any) => {
            var newError = new Error(message);
            this.Errors.unshift(newError);
            this.errorsNotifier.notify(newError);
        }

        public clearLog = () => {
            this.Errors = [];
        }

        public static Register($q: angular.Enhanced.IQService): ErrorsService {
            var errorsService = new ErrorsService($q);
            chLogger.Setup(errorsService);
            return errorsService;
        }
    }

}