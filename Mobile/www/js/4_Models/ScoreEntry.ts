module cerebralhike {
    export enum QuizScoreType {Correct = 1, Total = 0};

    export class QuizChartData {
        public labels: string[] = [];
        public series: number[][] = [];
        constructor(fromScore?: IScoreEntry[], scoreProjection?: (score: IScoreEntry) => IQuizScore) {
            if (!fromScore || !scoreProjection)
                return;
            var lngth = fromScore.length;
            this.labels = new Array<string>(lngth);
            //this.series = new Array<number[]>(1);
            this.series = new Array<number[]>(2);
            this.series[QuizScoreType.Correct] = new Array<number>(lngth);
            this.series[QuizScoreType.Total] = new Array<number>(lngth);
            for (var i = 0; i < lngth; i++) {
                var score = fromScore[i];
                var quizScore = scoreProjection(score);
                this.labels[i] = score.Date;
                this.series[QuizScoreType.Correct][i] = quizScore.Correct;
                this.series[QuizScoreType.Total][i] = quizScore.Questions;
            }
        }
    }

    export class AchievementChartData {
        public Dictionary: QuizChartData = new QuizChartData();
        public Glossary: QuizChartData = new QuizChartData();
        public Techniques: QuizChartData = new QuizChartData();

        constructor(fromScore?: IScoreEntry[]) {
            if (!fromScore)
                return;
            this.Dictionary = new QuizChartData(fromScore, score=> score.Dictionary);
            this.Glossary = new QuizChartData(fromScore, score=> score.Glossary);
            this.Techniques = new QuizChartData(fromScore, score=> score.Techniques);
        }
    }

    
    //export interface IQuizScore {
    //    public Correct: number;
    //    public Questions: number;
    //}

    //export interface IScoreEntry {
    //    public Date: string;
    //    public Dictionary: IQuizScore;
    //    public Glossary: IQuizScore;
    //    public Techniques: IQuizScore;
    //}
}