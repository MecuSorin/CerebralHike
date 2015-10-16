/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
    export class QuizTechniquesController extends QuizBaseController {
        public static Alias ="QuizTechniquesController";

        constructor(public $timeout: angular.ITimeoutService, downloadService: DownloadService, scoreService: ScoreService) {
            super(downloadService, scoreService);
            this.Setup();
        }

        public Question: Feature = null;
        public LastQuestionId: number = -1;
        public QuestionImage: string = '';

        public PlayClip = () => {
            if (!this.Question) return;
            this.downloadService
                .GetClipSafe(this.Question.ClipMainLocal, this.Question.ClipMainCloud)
                .then(clipLocation => Utils.PlayClip(clipLocation));
        }

        // overrides
        public ResetQuestion = (): void => {
            this.LastQuestionId = (this.Question ? this.Question.Id : -1);
            this.Question = null;
        };
        public CreateQuestion = (feature: IFeature): void => {
            this.Question = feature;
        };
        public IsSameQuestion = (): boolean => {
            return this.Question.Id == this.LastQuestionId;
        };
        public CreateAnswerAndAppend = (answers: Answer[], feature: IFeature, isCorrect: boolean): void => {
            var answer = new Answer(feature, isCorrect);
            answers.push(answer);
        };
        public SetupQuestion = (): void => {
            this.QuestionImage = ApiVerbs.GetImagesRoot() + "funny.png";
            this.$timeout(700, true).then(() => this.PlayClip());
        };
        public OnAnswer = (isCorrect: boolean): void => { this.scoreService.NewTechniqueAnswer(isCorrect); };
	}

	cerebralhikeControllers.controller(QuizTechniquesController.Alias, QuizTechniquesController);
}