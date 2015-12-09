module cerebralhike {
    export class Answer {
        public static UnusedAnswer = 'answer-unused';
        public static UsedAnswer = 'answer-used';
        public static CorrectAnswer = 'ion-checkmark-circled answer-correct-color';
        public static InvalidAnswer = 'ion-close-circled answer-invalid-color';

        constructor(feature: IFeature, isCorrect: boolean) {
            this.Text = feature.Japan;
            this.IsCorrect = isCorrect;
            this.Class = isCorrect ? Answer.CorrectAnswer : Answer.InvalidAnswer;
        }

        public Text: string = '';
        public IsCorrect: boolean = false;
        public WasUsed: boolean = false;
        public Class: string = '';
        public UsedClass: string = Answer.UnusedAnswer;

        public Chose = (): boolean => {
            this.WasUsed = true;
            this.UsedClass = Answer.UsedAnswer;
            return this.IsCorrect;
        }
    }

    export class GlossaryAnswer extends Answer {
        constructor(feature: IFeature, isJapanQuestion: boolean, isCorrect: boolean) {
            super(feature, isCorrect);
            this.Text = isJapanQuestion ? feature.Ro : feature.Japan;
        }
    }
}