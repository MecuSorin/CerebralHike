module cerebralhike {
    export class Set<T> {
        constructor() { }
        private Selection: T[] = [];

        public Add = (value: T): boolean => {
            if (0 <= this.Selection.indexOf(value)) return false;
            this.Selection.push(value);
            return true;
        }

        public GetItems = (): T[] => {
            return this.Selection;
        }

        public Length = () => {
            return this.Selection.length;
        }
    }
}