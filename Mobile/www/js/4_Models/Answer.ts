module cerebralhike {
    export class Answer {
        public static UnusedAnswer = 'unusedAnswer';
        public static CorrectAnswer = 'correctAnswer';
        public static InvalidAnswer = 'invalidAnswer';

        constructor(feature: IFeature, isCorrect: boolean) {
            this.Text = feature.Japan;
            this.IsCorrect = isCorrect;
        }

        public Text: string = '';
        public IsCorrect: boolean = false;
        public Class: string = Answer.UnusedAnswer;

        public Chose = (): boolean => {
            this.Class = (this.IsCorrect ? Answer.CorrectAnswer : Answer.InvalidAnswer);
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