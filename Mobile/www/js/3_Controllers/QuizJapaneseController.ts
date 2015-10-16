/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
    export class QuizJapaneseController extends QuizBaseController {
        public static Alias = "QuizJapaneseController";
        public static NumberOfAnswers = 7;
        constructor(downloadService: DownloadService, scoreService: ScoreService) {
            super(downloadService, scoreService);
            this.Setup();
        }

        public Question: string = '';
        public LastQuestionText: string = '';
        public IsJapanQuestion: boolean = true;
        private Features: IFeature[] = [];
        // overrides
        public ResetQuestion = (): void => {
            this.LastQuestionText = this.Question;
            this.Question = '';
        };
        public CreateQuestion = (feature: IFeature): void => {
            this.Question = new GlossaryAnswer(feature, !this.IsJapanQuestion, true).Text;
        };
        public IsSameQuestion = (): boolean => {
            return this.Question == this.LastQuestionText;
        };
        public CreateAnswerAndAppend = (answers: Answer[], feature: IFeature, isCorrect: boolean): void => {
            var answer = new GlossaryAnswer(feature, this.IsJapanQuestion, isCorrect);
            answers.push(answer);
        };
        public OnAnswer = (isCorrect: boolean): void => { this.scoreService.NewJapaneseAnswer(isCorrect); };

        public Setup = (): void => {
            this.downloadService.ReadDictionary().then(features => {
                this.Features = <IFeature[]>features;       // just for convenience
                this.PrepaireQuestion();
            });
        };

        public GetData = (): IFeature[] => {
            return this.Features;
        }
        public GetNumberOfAnswers(): number { return QuizJapaneseController.NumberOfAnswers; }
	}

    cerebralhikeControllers.controller(QuizJapaneseController.Alias, QuizJapaneseController);
}