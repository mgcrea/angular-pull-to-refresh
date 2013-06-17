'use strict';
angular.module('mgcrea.pullToRefresh', []).directive('pullToRefresh', [
  '$compile',
  '$timeout',
  '$q',
  function ($compile, $timeout, $q) {
    var template = '' + '<div class="ptr" ng-class="\'ptr-\'+status">' + '<i class="icon-refresh" ng-class="{\'icon-arrow-down\':status===\'pull\', \'icon-arrow-up\':status===\'release\', \'icon-refresh icon-spin\':status===\'loading\'}"></i>' + '&nbsp;<span class="ptr-message">{{messages[status]}}</span>' + '</div>';
    var config = {
        debounce: 400,
        messages: {
          pull: 'pull to refresh',
          release: 'release to refresh',
          loading: 'refreshing...'
        }
      };
    return {
      restrict: 'A',
      scope: true,
      compile: function compile(tElement, tAttrs, transclude) {
        tElement.prepend(template);
        var pElement = tElement.find('.pull-to-refresh');
        return function postLink(scope, iElement, iAttrs, controller) {
          scope.$loading = false;
          scope.messages = config.messages;
          scope.status = 'pull';
          var height = 20;
          var pullMargin = -2 * height + 'px auto 0';
          $timeout(function () {
            $compile(pElement)(scope);
          });
          iElement.bind('touchstart', function (ev) {
            var top = iElement[0].scrollTop;
          });
          var reload = false;
          iElement.bind('touchmove', function (ev) {
            var top = iElement[0].scrollTop;
            if (top < -40 && !reload) {
              reload = true;
              scope.$apply(function () {
                scope.status = 'release';
              });
            } else if (top > -40 && reload) {
              reload = false;
              scope.$apply(function () {
                scope.status = 'pull';
              });
            }
          });
          iElement.bind('touchend', function (ev) {
            var top = iElement[0].scrollTop;
            if (!reload)
              return;
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