(function() {
  var app = angular.module('project', ['ngRoute']);

  app.config(function($routeProvider, $httpProvider, $locationProvider) {

    $httpProvider.defaults.useXDomain = true;
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);

    $routeProvider.
      when('/', {
        controller: StartCtrl,
        templateUrl: './pages/index.html'
      }).
      when('/videos', {
        controller: VideosCtrl,
        templateUrl: './pages/videos.html',
        resolve : {
          slow : function() {
            return false;
          }
        }
      }).
      when('/videos/slow', {
        controller: VideosCtrl,
        templateUrl: './pages/videos.html',
        resolve : {
          slow : function() {
            return true;
          }
        }
      }).
      when('/article/:article*', {
        controller: ArticleCtrl,
        templateUrl: './pages/article.html'
      }).
      when('/:name*', {
        controller: FullCtrl,
        templateUrl: './pages/article.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  });

  function StartCtrl () {
  }

  function VideosCtrl($scope, $http, slow) {
    var callbackToken = 'JSON_CALLBACK';
    var url = 'https://gdata.youtube.com/feeds/api/standardfeeds/top_rated?time=today&alt=json&callback=' + callbackToken;
    var timeout = slow ? 2500 : 1;
    $scope.isSlow = slow;
    $http.jsonp(url)
    .success(function(data) {
      console.log(data, timeout);
      setTimeout(function() {
        var feed = data['feed'];
        var entries = feed['entry'];
        $scope.videos = [];
        for(var i=0;i<entries.length;i++) {
          var entry = entries[i];
          var title = entry['title']['$t'];
          $scope.videos.push({
            title : title
          });
        };
        if(!$scope.$$phase) $scope.$apply();
      }, timeout);
    })
    .error(function (data, status) {
      console.log(data, status);
    });
  }

  function ArticleCtrl($scope, $routeParams) {
    $scope.article = $routeParams.article;
    $scope.catchAll = false;
  }

  function FullCtrl($scope, $routeParams) {
    $scope.article = $routeParams.name;
    $scope.catchAll = true;
  }
})();
