'use strict';
angular.module('mgcrea.pullToRefresh', []).constant('pullToRefreshConfig', {
  treshold: 40,
  debounce: 400,
  messages: {
    pull: 'pull to refresh',
    release: 'release to refresh',
    loading: 'refreshing...'
  }
}).directive('pullToRefresh', [
  '$compile',
  '$timeout',
  '$q',
  'pullToRefreshConfig',
  function ($compile, $timeout, $q, pullToRefreshConfig) {
    var template = '' + '<div class="ptr" ng-class="\'ptr-\'+status">' + '<i class="icon-refresh" ng-class="{\'icon-arrow-down\':status===\'pull\', \'icon-arrow-up\':status===\'release\', \'icon-refresh icon-spin\':status===\'loading\'}"></i>' + '&nbsp;<span class="ptr-message">{{messages[status]}}</span>' + '</div>';
    return {
      restrict: 'A',
      scope: true,
      compile: function compile(tElement, tAttrs, transclude) {
        tElement.prepend(template);
        var pElement = tElement.find('.pull-to-refresh');
        return function postLink(scope, iElement, iAttrs, controller) {
          var config = angular.extend({}, pullToRefreshConfig, iAttrs);
          scope.$loading = false;
          scope.messages = config.messages;
          scope.status = 'pull';
          $timeout(function () {
            $compile(pElement)(scope);
          });
          var shouldReload = false;
          iElement.bind('touchmove', function (ev) {
            var top = iElement[0].scrollTop;
            if (top < -config.treshold && !shouldReload) {
              shouldReload = true;
              scope.$apply(function () {
                scope.status = 'release';
              });
            } else if (top > -config.treshold && shouldReload) {
              shouldReload = false;
              scope.$apply(function () {
                scope.status = 'pull';
              });
            }
          });
          iElement.bind('touchend', function (ev) {
            if (!shouldReload)
              return;
            shouldReload = false;
            scope.$apply(function () {
              scope.$loading = true;
              scope.status = 'loading';
              var start = +new Date();
              $q.when(scope.$eval(iAttrs.pullToRefresh)).then(function () {
                var elapsed = +new Date() - start;
                $timeout(function () {
                  scope.$loading = false;
                  scope.status = 'pull';
                }, elapsed < config.debounce ? config.debounce - elapsed : 0);
              });
            });
          });
          scope.$on('$destroy', function () {
            iElement.unbind('touchstart');
            iElement.unbind('touchmove');
            iElement.unbind('touchend');
          });
        };
      }
    };
  }
]);