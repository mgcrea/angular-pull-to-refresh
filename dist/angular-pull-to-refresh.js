/**
 * angular-pull-to-refresh
 * @version v0.3.0 - 2015-11-26
 * @link https://github.com/mgcrea/angular-pull-to-refresh
 * @author Olivier Louvignes <olivier@mg-crea.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (window, document, undefined) {
  'use strict';
  // Source: src/angular-pull-to-refresh.js
  angular.module('mgcrea.pullToRefresh', []).constant('pullToRefreshConfig', {
    treshold: 60,
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
  }).directive('pullToRefresh', [
    '$compile',
    '$timeout',
    '$q',
    'pullToRefreshConfig',
    function ($compile, $timeout, $q, pullToRefreshConfig) {
      return {
        scope: { pullToRefreshConfig: '=' },
        restrict: 'A',
        transclude: true,
        templateUrl: 'angular-pull-to-refresh.tpl.html',
        compile: function compile(tElement, tAttrs, transclude) {
          return function postLink(scope, iElement, iAttrs) {
            var config = angular.extend({}, pullToRefreshConfig, scope.pullToRefreshConfig, iAttrs);
            var scrollElement = iElement.parent();
            var ptrElement = window.ptr = iElement.children()[0];
            // Initialize isolated scope vars
            scope.text = config.text;
            scope.icon = config.icon;
            scope.status = 'pull';
            var setStatus = function (status) {
              shouldReload = status === 'release';
              scope.$apply(function () {
                scope.status = status;
              });
            };
            var shouldReload = false;
            function getTransformStyle(translate) {
              var translateFn = 'translateY(' + translate + 'px)';
              return {
                '-webkit-transform': translateFn,
                'transform': translateFn
              };
            }
            function getTouch(evt) {
              var event = evt;
              if (event.originalEvent) {
                event = event.originalEvent;
              }
              return event.touches[0];
            }
            var startY;
            iElement.bind('touchstart', function (ev) {
              startY = getTouch(ev).pageY;
            });
            iElement.bind('touchmove', function (ev) {
              var top = scrollElement[0].scrollTop;
              var currentY = getTouch(ev).pageY;
              iElement.css(getTransformStyle(currentY - startY));
              if (top === 0) {
                top = startY - currentY;
              }
              if (top < -config.treshold && !shouldReload) {
                setStatus('release');
              } else if (top > -config.treshold && shouldReload) {
                setStatus('pull');
              }
            });
            iElement.bind('touchend', function (ev) {
              if (!shouldReload)
                return;
              iElement.css(getTransformStyle(0));
              ptrElement.style.webkitTransitionDuration = 0;
              ptrElement.style.margin = '0 auto';
              setStatus('loading');
              var start = +new Date();
              $q.when(scope.$eval(iAttrs.pullToRefresh)).then(function () {
                var elapsed = +new Date() - start;
                $timeout(function () {
                  ptrElement.style.margin = '';
                  ptrElement.style.webkitTransitionDuration = '';
                  scope.status = 'pull';
                }, elapsed < config.debounce ? config.debounce - elapsed : 0);
              });
            });
            scope.$on('$destroy', function () {
              iElement.unbind('touchmove');
              iElement.unbind('touchend');
            });
          };
        }
      };
    }
  ]);
  // Source: src/angular-pull-to-refresh.tpl.js
  angular.module('mgcrea.pullToRefresh').run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('angular-pull-to-refresh.tpl.html', '<div class="pull-to-refresh">\n' + '  <i ng-class="icon[status]"></i>&nbsp;\n' + '  <span ng-bind="text[status]"></span>\n' + '</div>\n' + '<div ng-transclude></div>\n');
    }
  ]);
}(window, document));