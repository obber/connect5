(function() {

  var app = angular.module('app', ['ui.router']);

  app.config(routes);
  app.run(onReady);

  function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('play', {
        url: "/play",
        templateUrl: "views/play.html"
      })
      .state('loading', {
        url: "/",
        templateUrl: "views/loading.html"
      });
  }

  function onReady($state) {
    socket.on('ready', function(black) {
      setTimeout(function() {
        $state.go('play');
      }, 1000);
    });

    socket.on('disconnectAll', function() {
      console.log('disconnecting myself');
      socket.disconnect();
    })
  }

})();
