cerebralhikeApp
.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function ($http) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'MenuController as MenuCtrl'
        })
        .state('app.learn', {
            url: '/learn',
            views: {
                'menuContent': {
                    templateUrl: 'templates/learn_list.html',
                    controller: 'FeatureListController as FeatureListCtrl'
                }
            }
        })
        .state('app.learn-feature', {
            url: '/learn/:featureId',
            views: {
                'menuContent': {
                    templateUrl: 'templates/learn_feature.html',
                    controller: 'FeatureDetailController as FeatureDetailCtrl'
                }
}
        })
        .state('app.download', {
            url: '/download',
            views: {
                'menuContent': {
                    templateUrl: 'templates/download.html',
                    controller: 'DownloadController as DownloadCtrl'
                }
            }
        })
        .state('app.testglossary', {
            url: '/testglossary',
            views: {
                'menuContent': {
                    templateUrl: 'templates/test_glossary.html',
                    controller: 'TestGlossaryController as TestGlossaryCtrl'
                }
            }
        })
        .state('app.testtechniques', {
            url: '/testtechniques',
            views: {
                'menuContent': {
                    templateUrl: 'templates/test_techniques.html',
                    controller: 'TestTechniquesController as TestTechniquesCtrl'
            }
        }
    })
    //.state('app.search', {
    //  url: '/search',
    //  views: {
    //    'menuContent': {
    //      templateUrl: 'templates/search.html'
    //    }
    //  }
    //})

    //.state('app.browse', {
    //    url: '/browse',
    //    views: {
    //      'menuContent': {
    //        templateUrl: 'templates/browse.html'
    //      }
    //    }
    //  })
    //  .state('app.playlists', {
    //    url: '/playlists',
    //    views: {
    //      'menuContent': {
    //        templateUrl: 'templates/playlists.html',
    //        controller: 'PlaylistsCtrl'
    //      }
    //    }
    //  })

    //.state('app.single', {
    //  url: '/playlists/:playlistId',
    //  views: {
    //    'menuContent': {
    //      templateUrl: 'templates/playlist.html',
    //      controller: 'PlaylistCtrl'
    //    }
    //  }
    //})
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/testglossary');
    //$urlRouterProvider.otherwise('/app/download');
});

window.ionic.Platform.ready(function () {
    var ddddoc = document.getElementsByTagName('body')[0];
    console.log('Ionic is ready, bootstraping on ' + ddddoc.outerHTML);
    angular.bootstrap(ddddoc, ['mocker', 'starter'])
});