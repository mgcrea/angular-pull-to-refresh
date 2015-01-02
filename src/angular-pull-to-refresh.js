'use strict';

angular.module('mgcrea.pullToRefresh', [])

  .constant('pullToRefreshConfig', {
    threshold: 20,
    debounce: 400,
    text: {
      pull: 'pull to refresh',
      release: 'release to refresh',
      loading: 'refreshing...'
    },
    icon: {
      pull: 'fa fa-arrow-down',
      release: 'fa fa-arrow-up',
      loading: 'fa fa-refresh fa-spin'
    }
  })

  .directive('pullToRefresh', function($compile, $timeout, $q, pullToRefreshConfig) {

    return {
      scope: true,
      restrict: 'A',
      transclude: true,
      templateUrl: 'angular-pull-to-refresh.tpl.html',
      compile: function compile(tElement, tAttrs, transclude) {

        return function postLink(scope, iElement, iAttrs) {

          var config = angular.extend({}, pullToRefreshConfig, iAttrs);
          var scrollElement = iElement.parent();
          var ptrElement = window.ptr = iElement.children()[0];

          // Initialize isolated scope vars
          scope.text = config.text;
          scope.icon = config.icon;
          scope.status = 'pull';

          var setStatus = function(status) {
            shouldReload = status === 'release';
            scope.$apply(function() {
              scope.status = status;
            });
          };

          var shouldReload = false;
          var top = 0;
          iElement.bind('touchmove', function(ev) {
            if(top > config.threshold && !shouldReload) {
              setStatus('release');
            } else if(top < config.threshold && shouldReload) {
              setStatus('pull');
            }
          });

          iElement.bind('touchend', function(ev) {
            top = 0;

            if(!shouldReload) return;

            ptrElement.style.webkitTransitionDuration = 0;
            ptrElement.style.margin = '0 auto';
            setStatus('loading');

            var start = +new Date();
            $q.when(scope.$eval(iAttrs.pullToRefresh))
            .then(function() {
              var elapsed = +new Date() - start;
              $timeout(function() {
                ptrElement.style.margin = '';
                ptrElement.style.webkitTransitionDuration = '';
                scope.status = 'pull';
              }, elapsed < config.debounce ? config.debounce - elapsed : 0);
            });
          });

          scope.$on('$destroy', function() {
            iElement.unbind('touchmove');
            iElement.unbind('touchend');
          });

        };
      }
    };

  });
