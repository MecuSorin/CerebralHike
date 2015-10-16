/// <reference path="../1_Bootstrap/app.bootstrap.ts" />
/// <reference path="../4_models/answer.ts" />
/// <reference path="../4_models/scoreentry.ts" />

module cerebralhike {
    export class ScoreService {
		public static Alias = "scoreService";

        constructor(public downloadService: DownloadService, public $q: angular.Enhanced.IQService) {
        }

        public CorrectAnswers: number = 0;
        public QuestionsAnswered: number = 0;
        public Achievement: IScoreEntry[] = [];

        private GetDateLabel(): string {
            return '' + (new Date().getDate());
        }

        private GetEmptyScore(label?: string):IScoreEntry {
            if (!label) {
                label = this.GetDateLabel();
            }
            return {
                Date: label,
                Dictionary: {
                    Correct: 0,
                    Questions:0
                },
                Glossary: {
                    Correct: 0,
                    Questions:0
                },
                Techniques: {
                    Correct: 0,
                    Questions:0
                }
            }
        }
        public OnAnswer = (isCorrect: boolean, projection: (a:IScoreEntry)=>IQuizScore):void => {
            var label = this.GetDateLabel();
            if (!this.Achievement || this.Achievement.length == 0)
                this.Achievement = [this.GetEmptyScore(label)];
            this.NewQuestionWasAnsweredTo();
            if (isCorrect)
                this.NewCorrectAnswer();
            var scoreToUpdate: IScoreEntry = null;
            if (this.Achievement[this.Achievement.length - 1].Date == label) {
                scoreToUpdate = this.Achievement[this.Achievement.length - 1];
            } else {
                scoreToUpdate = this.GetEmptyScore(label);
                this.Achievement.push(scoreToUpdate);
            }

            var quizScore = projection(scoreToUpdate);
            quizScore.Correct += (isCorrect ? 1 : 0);
            quizScore.Questions += 1;
            this.downloadService.SaveAchievements(this.Achievement);
        }

        public NewJapaneseAnswer = (isCorrect: boolean): void => {
            this.OnAnswer(isCorrect, score=> score.Dictionary);
        }

        public NewGlossaryAnswer = (isCorrect: boolean): void => {
            this.OnAnswer(isCorrect, score=> score.Glossary);

        }

        public NewTechniqueAnswer = (isCorrect: boolean): void => {
            this.OnAnswer(isCorrect, score=> score.Techniques);
        }

        private NewQuestionWasAnsweredTo = () => {
            this.QuestionsAnswered = 1 + this.QuestionsAnswered;
        };

        private NewCorrectAnswer = () => {
            this.CorrectAnswers = 1 + this.CorrectAnswers;
        };

        public LoadData = (): angular.IPromise<IScoreEntry[]> => {
            if (this.Achievement && this.Achievement.length > 0) {
                return this.$q.when(this.Achievement);
            }
            var deferred = this.$q.defer<IScoreEntry[]>();
            this.downloadService.ReadAchievement()
                .then(result=> this.Achievement = result)
                .catch(reason=> this.Achievement = [this.GetEmptyScore()])
                .finally(() => deferred.resolve(this.Achievement));
            return deferred.promise;

            //this.Achievement = mocks.Generator.GetFakeAchievementsHistory(10);
            //return this.$q.when(this.Achievement)
        };
	}

	cerebralhikeServices.service(ScoreService.Alias, ScoreService);
}

