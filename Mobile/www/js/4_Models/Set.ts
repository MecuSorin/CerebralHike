module cerebralhike {
    export class Set {
        constructor() { }
        private Selection: number[] = [];

        public Add = (value: number): boolean => {
            if (0 <= this.Selection.indexOf(value)) return false;
            this.Selection.push(value);
            return true;
        }

        public GetItems = (): number[] => {
            return this.Selection;
        }
    }
}