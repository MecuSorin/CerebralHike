/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
    export class QuizGlossaryController extends QuizBaseController {
        public static Alias = "QuizGlossaryController";

        constructor(downloadService: DownloadService, scoreService: ScoreService, public $location: angular.ILocationService) {
            super(downloadService, scoreService);
            this.Setup();
        }

        public Question: string = '';
        private QuestionSource: IFeature = null;
        public LastQuestionText: string = '';
        public IsJapanQuestion: boolean = true;
        
        // overrides
        public ResetQuestion = (): void => {
            this.LastQuestionText = this.Question;
            this.Question = '';
            this.QuestionSource = null;
        };
        public CreateQuestion = (feature: IFeature): void => {
            this.Question = new GlossaryAnswer(feature, !this.IsJapanQuestion, true).Text;
            this.QuestionSource = feature;
        };
        public IsSameQuestion = (): boolean => {
            return this.Question == this.LastQuestionText;
        };
        public CreateAnswerAndAppend = (answers: Answer[], feature: IFeature, isCorrect: boolean): void => {
            var answer = new GlossaryAnswer(feature, this.IsJapanQuestion, isCorrect);
            answers.push(answer);
        };
        public OnAnswer = (isCorrect: boolean): void => { this.scoreService.NewGlossaryAnswer(isCorrect); };

        public PlayClip = () => {
            if (!this.QuestionSource) return;
            this.downloadService
                .GetClipSafe(this.QuestionSource.ClipMainLocal, this.QuestionSource.ClipMainCloud)
                .then(clipLocation => Utils.PlayClip(clipLocation));
        }

        public NavigateToFeature = () => {
            if (!this.QuestionSource) return;
            var featurePath = FeatureListController.GetLearnFeatureAppPath(this.QuestionSource);
            chLogger.log('Loading path: ' + featurePath);
            this.$location.path(featurePath);
        }
	}

	cerebralhikeControllers.controller(QuizGlossaryController.Alias, QuizGlossaryController);
}