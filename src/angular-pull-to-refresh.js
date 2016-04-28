'use strict';

angular.module('mgcrea.pullToRefresh', [])

  .constant('pullToRefreshConfig', {
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
  })

  .directive('pullToRefresh', function($compile, $timeout, $q, pullToRefreshConfig, $injector) {

    return {
      scope: true,
      restrict: 'A',
      transclude: true,
      templateUrl: 'angular-pull-to-refresh.tpl.html',
      compile: function compile(tElement, tAttrs, transclude) {

        return function postLink(scope, iElement, iAttrs) {

          var customConfig = scope.$eval(iAttrs.pullToRefreshConfig);
          var config = angular.extend({}, pullToRefreshConfig, customConfig, iAttrs);
          var scrollElement = iElement.parent();
          var ptrElement = window.ptr = iElement.children()[0];

          // Initialize isolated scope vars
          scope.text = config.text;
          scope.icon = config.icon;
          scope.status = 'pull';

          var translateStates = function ($translate) {
            var translateKey = 'PULL2REF.';
            var states = {
              pull: $translate(translateKey + 'PULL'),
              release: $translate(translateKey + 'RELEASE'),
              loading: $translate(translateKey + 'LOADING')
            };
            if (typeof states.pull === 'string') {
              scope.text = states;
            }
            var deferTraslate = function (name) {
              if (states[name].then) {
                states[name].then(function (translated) {
                  scope.text[name] = translated;
                });
              }
            };
            deferTraslate('pull');
            deferTraslate('release');
            deferTraslate('loading');
            if (typeof states.pull === 'string') {
              scope.text = states;
            }
          };
          try {
            // add optional dependency $translate
            translateStates($injector.get('$translate'));
          } catch (e) {}

          var setStatus = function(status) {
            shouldReload = status === 'release';
            scope.$apply(function() {
              scope.status = status;
            });
          };

          var shouldReload = false;
          function getTransformStyle(translate) {
            if (isUsingOverflowScroll) {
              return {};
            }
            var translateFn = 'translateY(' + translate + 'px)';
            return {
              '-webkit-transform': translateFn,
              'transform': translateFn
            };
          }
          function getDrag(evt) {
            var event = evt;
            if (event.originalEvent) {
              event = event.originalEvent;
            }
              return (event.touches && event.touches.length > 0) ? event.touches[0] : event;
          }
          var isUsingOverflowScroll = true;
          var startY;
          var isTracking = false;
          iElement.bind('touchstart mousedown', function (ev) {
            startY = getDrag(ev).pageY;
            isTracking = true;
            ev.preventDefault()
          });
          iElement.bind('touchmove mousemove', function (ev) {
            if (!isTracking) {
              return;
            }
            ev.preventDefault()
            var top = scrollElement[0].scrollTop;
            var currentY = getDrag(ev).pageY;
            if (top === 0) {
              isUsingOverflowScroll = false;
              top = startY - currentY;
            }
            iElement.css(getTransformStyle(currentY - startY));
            if (top < -config.treshold && !shouldReload) {
              setStatus('release');
            } else if(top > -config.treshold && shouldReload) {
              setStatus('pull');
            }
          });
          iElement.bind('touchend mouseup', function (ev) {
            isTracking = false;
            if (!shouldReload) {
              return;
            }
            iElement.css(getTransformStyle(0));
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
              iElement.unbind('touchstart');
            iElement.unbind('touchmove');
            iElement.unbind('touchend');
          });

        };
      }
    };

  });
