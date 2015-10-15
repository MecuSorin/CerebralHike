module cerebralhike {
    export class chLogger {
        private static errorsService: ErrorsService = null;
        private static ErrorsServiceAlias = "ErrorsService";
        public static log(value: any): void {
            console.log(value);
            if (chLogger.errorsService) {
                chLogger.errorsService.addError(value);
            }
        }

        public static Setup(errorsService: ErrorsService) {
            chLogger.errorsService = errorsService;
            chLogger.log("Bootstraped the log service");
        }

        public static isString(o) {
            return typeof o == "string" || (typeof o == "object" && o.constructor === String);
        }

        private static StringifyTuple(first: string, second: any): string {
            return first + ': ' + second;
        }

        public static Plain(something: any): string {
            if (!something) { return '' + something; }
            if (chLogger.isString(something)) { return something; }
            var result = '';
            if (something.code) {
                result = result + chLogger.StringifyTuple('code', something.code);
            }
            if (something.message) {
                result = result + chLogger.StringifyTuple('message', something.message);
            }
            if (something.error) {
                result = result + chLogger.StringifyTuple('error', something.error);
            }
            return result;
        }
    }
}
