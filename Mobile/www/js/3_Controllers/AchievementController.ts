/// <reference path="../1_Bootstrap/app.bootstrap.ts" />

module cerebralhike {
   

    export class AchievementController {
        public static Alias: string = "AchievementController";

        constructor(public downloadService: DownloadService, public scoreService: ScoreService) {
            this.scoreService.LoadData().then(savedHistory=> this.ChartData = new AchievementChartData(savedHistory));
        }
        public ChartData: AchievementChartData = new AchievementChartData();
        public AreaChartOptions = {
            low: 0,
            showArea: true,
            lineSmooth: false,
            axisX: {
                showGrid: false,
                showLabel: true
            }
        };

    }

    cerebralhikeControllers.controller(AchievementController.Alias, AchievementController);
}