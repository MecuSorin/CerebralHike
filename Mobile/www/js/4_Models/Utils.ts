/// <reference path="../1_bootstrap/interfaces.d.ts" />
/// <reference path="set.ts" />

module cerebralhike {
    export class Utils {
        public static ToJson<T>(source: T): string {
            var jsonOutput = angular.toJson(source);
            //chLogger.log('Serialized object to: ' + jsonOutput);
            return jsonOutput;
        }

        public static PlayClip(clipLocation: string) {
            if (clipLocation && clipLocation.length > 1) {
                chLogger.log("Play clip: " + clipLocation)
                var host: any = window.plugins;
                try {
                    host.videoPlayer.play(clipLocation);
                } catch (err) {
                    chLogger.log("Play clip failed: " + err);
                }
            } else {
                chLogger.log("No clip to play");
            }
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

        public static GetRandomItems<T>(collection: T[], numberOfItemsToTake: number, getHash: (item: T) => number): T[] {
            if (collection.length < numberOfItemsToTake) {
                return collection;
            }
            var pickedItemsSet = new Set<number>();
            var duplicatesItemsIndexesSet = new Set<number>();
            var lngth = collection.length;
            var result: T[] = [];
            try {
                for (var i = Math.abs(numberOfItemsToTake); i > 0; i--) {
                    var newItem = false;
                    var chosen: number = -1;
                    do {
                        chosen = Utils.GetRandom(lngth);
                        var hash = getHash(collection[chosen]);
                        newItem = pickedItemsSet.Add(hash);
                        if (!newItem) {
                            duplicatesItemsIndexesSet.Add(chosen);
                        }
                    }
                    while (!newItem && (duplicatesItemsIndexesSet.Length() + pickedItemsSet.Length() < collection.length));
                    if (newItem) {
                        result.push(collection[chosen]);
                    }
                }
            }
            catch (err) {
                chLogger.log(err);
            }
            return result;
        }

        public static HaveAnyNetworkConnection(network: ngCordova.INetworkService): boolean {
            chLogger.log("Connection check: " + network.isOnline() + " type: "+ network.getNetwork().type);
            return network.isOnline();
        }

        public static HaveCheapNetworkConnection(network: ngCordova.INetworkService): boolean {
            var networkType = network.getNetwork().type;
            chLogger.log('Network type is:' + networkType);
            return (networkType == Connection.WIFI) || (networkType == Connection.ETHERNET);
        }

        public static ParseTSV<T>(input: string, projection: (words: string[]) => T, separator?: string):T[] {
            if (!separator) {
                separator = "\t";
            }
            var rows = input.split('\n');
            var result:T[] = [];
            angular.forEach(rows, function (val) {
                if (!val || 0 == val.length) return;
                var o = val.split(separator);
                try {
                    result.push(projection(o));
                    chLogger.log("Readed dictionary entry: " + val);
                } catch (err) {
                    chLogger.log("Failed to understand the row: " + val);
                }
            });
            return result;
        };

        public static ParseDictionaryEntry(words: string[]): IDictionaryEntry {
            if (!words || words.length != 2) throw 'Bad structure for dictionary entry';
            return { Japan: words[0], Ro: words[1] };
        }

        public static GetHashCode(text:string):number {
            var hash = 0;
            if (text.length == 0) return hash;
            for (var i = 0; i < text.length; i++) {
                var character = text.charCodeAt(i);
                hash = ((hash << 5) - hash) + character;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        }

        public static ParseBoolean(text: string): boolean {
            return text === "true";
        }
    }
} 