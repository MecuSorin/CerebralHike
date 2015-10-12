﻿module cerebralhike {
    export class Utils {
        public static ToJson<T>(source: T): string {
            var jsonOutput = angular.toJson(source);
            console.log('Serialized object to: ' + jsonOutput);
            return jsonOutput;
        }

        public static GetSafe(text: string, defaultValue: string): string {
            if (!text) {
                console.log("Fallback to: " + defaultValue);
                return defaultValue;
            }
            console.log("--------- using: [" + text + "]");
            return text;
        }

        public static GetDateMarker(): string {
            var current = new Date();
            var mnth = (current.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = current.getDate().toString();
            var hh = current.getHours().toString();
            var mnts = current.getMinutes().toString();
            var scnds = current.getSeconds().toString();
            return mnth + Utils.PadString(dd) + Utils.PadString(hh) + Utils.PadString(mnts) + Utils.PadString(scnds);
        }

        public static PadString(text: string, paddingText?: string, count?: number): string {
            if (!paddingText) {
                paddingText = "0";
            }
            if (!count) {
                count = 2;
            }
            if (text.length < count) {
                return Array(count + 1 - text.length).join(paddingText) + text;
            }
            return text;
        }

        public static GetRandom(upToValue: number): number {
            return Math.floor(Math.random() * Math.abs(upToValue));
        }

        public static GetRandomItems<T>(collection: T[], numberOfItemsToTake: number): T[] {
            if (collection.length < numberOfItemsToTake) {
                return collection;
            }
            var set = new Set();
            var lngth = collection.length;
            var result: T[] = [];
            for (var i = Math.abs(numberOfItemsToTake); i > 0; i--) {
                var newItem = false;
                var chosen: number = -1;
                do {
                    chosen = Utils.GetRandom(lngth);
                    newItem = set.Add(chosen);
                }
                while (!newItem);
                result.push(collection[chosen]);
            }
            return result;
        }
    }

} 