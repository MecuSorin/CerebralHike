/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
    export class QuizGlossaryController extends QuizBaseController {
        public static Alias = "QuizGlossaryController";

        constructor(downloadService: DownloadService, scoreService: ScoreService) {
            super(downloadService, scoreService);
        }

        public Question: string = '';
        public LastQuestionText: string = '';
        public IsJapanQuestion: boolean = true;
        
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
	}

	cerebralhikeControllers.controller(QuizGlossaryController.Alias, QuizGlossaryController);
}