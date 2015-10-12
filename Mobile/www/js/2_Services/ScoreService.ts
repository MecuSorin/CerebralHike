/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
    export class ScoreService {
		public static Alias = "scoreService";
    
        public CorrectAnswers: number = 0;
        public QuestionsMade: number = 0;

        public NewQuestionWasMade = () => {
            this.QuestionsMade = 1 + this.QuestionsMade;
        }

        public NewCorrectAnswer = () => {
            this.CorrectAnswers = 1 + this.CorrectAnswers;
        }
	}

	cerebralhikeServices.service(ScoreService.Alias, ScoreService);
}

