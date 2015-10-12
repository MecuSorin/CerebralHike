/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class TestGlossaryController {
        public static Alias = "TestGlossaryController";

        private static NumberOfAnswers : number = 9;

        constructor(public $scope: angular.IScope, public downloadService: DownloadService) {
            this.downloadService.LoadLegend().then(() => this.PrepaireQuestion());
        }

        public Question: string = '';
        public QuestionWasUsed: boolean = false;
        public Answers: Answer[] = [];
        public LastQuestionText: string = '';
        public IsJapanQuestion: boolean = true;
        public CorrectAnswers: number = 0;
        public QuestionsMade: number = 0;
        public ShowNextQuestionButtonVisible: boolean = true;

        public PrepaireQuestion = () => {
            if (!this.ShowNextQuestionButtonVisible) return;
            console.log('Prepaire next question');
            this.ShowNextQuestionButtonVisible = false;
            this.QuestionWasUsed = false;
            this.LastQuestionText = this.Question;
            this.Answers = [];
            this.Question = '';
            this.QuestionsMade = 1 + this.QuestionsMade;

            var chosenFeatures = Utils.GetRandomItems(this.downloadService.Files, TestGlossaryController.NumberOfAnswers);
            var questionIndex: number = -1;
            do {
                questionIndex = Utils.GetRandom(chosenFeatures.length);
                this.Question = new Answer(chosenFeatures[questionIndex], !this.IsJapanQuestion, true).Text;
            }
            while (this.Question == this.LastQuestionText);
            var answers = [];
            for (var i = 0, lngth = chosenFeatures.length; i < lngth; i++) {
                var answer = new Answer(chosenFeatures[i], this.IsJapanQuestion, questionIndex == i);
                answers.push(answer);
            }
            this.Answers = answers;
        }

        public SelectedAnswer = (answer: Answer) => {
            if (this.QuestionWasUsed) return;
            this.QuestionWasUsed = true;

            console.log("User chosed the answer: " + answer.Text);
            var success = answer.Chose();
            if (success) {
                this.CorrectAnswers = 1 + this.CorrectAnswers;
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

	cerebralhikeControllers.controller(TestGlossaryController.Alias, TestGlossaryController);
}