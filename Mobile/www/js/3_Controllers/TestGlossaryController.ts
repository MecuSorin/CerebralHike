/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class TestGlossaryController {
        public static Alias = "TestGlossaryController";

        private static NumberOfAnswers : number = 10;

        constructor(public downloadService: DownloadService, public scoreService: ScoreService) {
            this.downloadService.LoadLegend().then(() => this.PrepaireQuestion());
        }

        public Question: string = '';
        public QuestionWasUsed: boolean = false;
        public Answers: Answer[] = [];
        public LastQuestionText: string = '';
        public IsJapanQuestion: boolean = true;

        public ShowNextQuestionButtonVisible: boolean = true;

        public PrepaireQuestion = () => {
            if (!this.ShowNextQuestionButtonVisible) return;
            console.log('Prepaire next question');
            this.ShowNextQuestionButtonVisible = false;
            this.QuestionWasUsed = false;
            this.LastQuestionText = this.Question;
            this.Answers = [];
            this.Question = '';
            this.scoreService.NewQuestionWasMade();

            var chosenFeatures = Utils.GetRandomItems(this.downloadService.Files, TestGlossaryController.NumberOfAnswers);
            var questionIndex: number = -1;
            do {
                questionIndex = Utils.GetRandom(chosenFeatures.length);
                this.Question = new GlossaryAnswer(chosenFeatures[questionIndex], !this.IsJapanQuestion, true).Text;
            }
            while (this.Question == this.LastQuestionText);
            var answers = [];
            for (var i = 0, lngth = chosenFeatures.length; i < lngth; i++) {
                var answer = new GlossaryAnswer(chosenFeatures[i], this.IsJapanQuestion, questionIndex == i);
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

	cerebralhikeControllers.controller(TestGlossaryController.Alias, TestGlossaryController);
}