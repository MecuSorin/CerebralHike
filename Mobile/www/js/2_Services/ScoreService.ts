/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
/// <reference path="../4_models/answer.ts" />

module cerebralhike {
    export class ScoreService {
		public static Alias = "scoreService";
    
        public CorrectAnswers: number = 0;
        public QuestionsAnswered: number = 0;

        public NewQuestionWasAnsweredTo = () => {
            this.QuestionsAnswered = 1 + this.QuestionsAnswered;
        }

        public NewCorrectAnswer = () => {
            this.CorrectAnswers = 1 + this.CorrectAnswers;
        }
	}

	cerebralhikeServices.service(ScoreService.Alias, ScoreService);
}

