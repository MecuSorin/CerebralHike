/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
	export class QuizBaseController {
        private static DefaultNumberOfAnswers : number = 10;

        constructor(public downloadService: DownloadService, public scoreService: ScoreService) {
            this.downloadService.LoadLegend().then(() => this.PrepaireQuestion());
        }

        public QuestionWasUsed: boolean = false;
        public Answers: Answer[] = [];
        public ShowNextQuestionButtonVisible: boolean = true;
        // to be implemented by inheritors
        public ResetQuestion = (): void => { };
        public GetNumberOfAnswers(): number { return QuizBaseController.DefaultNumberOfAnswers; }
        public CreateQuestion = (feature: IFeature): void => { };
        public IsSameQuestion = (): boolean => { return false; };
        public CreateAnswerAndAppend = (answers: Answer[], feature: IFeature, isCorrect: boolean): void => { };
        public SetupQuestion = (): void => { };

        public PrepaireQuestion = () => {
            if (!this.ShowNextQuestionButtonVisible) return;
            console.log('Prepaire next question');
            this.ShowNextQuestionButtonVisible = false;
            this.QuestionWasUsed = false;
            this.Answers = [];
            this.ResetQuestion();

            var chosenFeatures = Utils.GetRandomItems(this.downloadService.Files, this.GetNumberOfAnswers());
            var questionIndex: number = -1;
            do {
                questionIndex = Utils.GetRandom(chosenFeatures.length);
                this.CreateQuestion(chosenFeatures[questionIndex]);
            }
            while (this.IsSameQuestion());
            var answers = [];
            for (var i = 0, lngth = chosenFeatures.length; i < lngth; i++) {
                this.CreateAnswerAndAppend(answers, chosenFeatures[i], i == questionIndex);
            }
            this.Answers = answers;
            this.SetupQuestion();
        }

        public SelectedAnswer = (answer: Answer) => {
            if (this.QuestionWasUsed) return;
            this.QuestionWasUsed = true;

            console.log("User chosed the answer: " + answer.Text);
            var success = answer.Chose();
            this.scoreService.NewQuestionWasAnsweredTo();
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
}