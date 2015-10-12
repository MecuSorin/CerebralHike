/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class TestTechniquesController {
        public static Alias ="TestTechniquesController";

        private static NumberOfAnswers: number = 10;

        constructor(public downloadService: DownloadService, public scoreService: ScoreService, public $timeout: angular.ITimeoutService) {
            this.downloadService.LoadLegend().then(() => this.PrepaireQuestion());
        }

        public Question: Feature = null;
        public QuestionWasUsed: boolean = false;
        public Answers: Answer[] = [];
        public LastQuestionId: number = -1;
        public ShowNextQuestionButtonVisible: boolean = true;
        public QuestionImage: string = '';

        public PlayClip = () => {
            if (!this.Question) return;

            var clipLocation = Utils.GetSafe(this.Question.ClipMainLocal, this.Question.ClipMainCloud);
            console.log("Play clip: " + clipLocation)
            var host: any = window.plugins;
            host.videoPlayer.play(clipLocation);
        }


        public PrepaireQuestion = () => {
            if (!this.ShowNextQuestionButtonVisible) return;
            console.log('Prepaire next video question');
            this.ShowNextQuestionButtonVisible = false;
            this.QuestionWasUsed = false;
            this.LastQuestionId = (this.Question ? this.Question.Id : -1);
            this.Answers = [];
            this.Question = null;
            this.scoreService.NewQuestionWasMade();

            var chosenFeatures = Utils.GetRandomItems(this.downloadService.Files, TestTechniquesController.NumberOfAnswers);
            var questionIndex: number = -1;
            do {
                questionIndex = Utils.GetRandom(chosenFeatures.length);
                this.Question = chosenFeatures[questionIndex];
            }
            while (this.Question.Id == this.LastQuestionId);
            var answers = [];
            for (var i = 0, lngth = chosenFeatures.length; i < lngth; i++) {
                var answer = new Answer(chosenFeatures[i], questionIndex == i);
                answers.push(answer);
            }
            this.Answers = answers;
            this.QuestionImage = ApiVerbs.GetImagesRoot() + "funny.png";
            this.$timeout(700, true).then(()=>this.PlayClip());
        }

        public SelectedAnswer = (answer: Answer) => {
            if (this.QuestionWasUsed) return;
            this.QuestionWasUsed = true;

            console.log("User chosed the answer: " + answer.Text);
            var success = answer.Chose();
            if (success) {
                this.scoreService.NewCorrectAnswer();
            }
            this.ShowNextQuestionButtonVisible = true;
        }

        public RevealCorrectAnswer = () => {
            for (var i = 0; i < this.Answers.length; i++) {
                if (this.Answers[i].IsCorrect) {
                    this.Answers[i].Chose();
                }
            }
        }
	}

	cerebralhikeControllers.controller(TestTechniquesController.Alias, TestTechniquesController);
}