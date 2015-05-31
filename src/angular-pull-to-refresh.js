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

          var notIOS = function() {
  			  	var pan = {
  					  enabled: false,
  					  distance: 0,
  					  startingPositionY: 0
  			  	};
  			  
  			  /**
  				 * Determine whether pan events should apply based on scroll position on panstart
  				 * 
  				 * @param {object} e - Event object
  				 */
  				var _panStart = function(e) {
  					pan.startingPositionY = document.body.scrollTop;
  					if ( pan.startingPositionY === 0 ) {
  						pan.enabled = true;
  					}
  				};

  				/**
  				 * Handle element on screen movement when the pandown events is firing.
  				 * 
  				 * @param {object} e - Event object
  				 */
  				var _panDown = function(e) {
  					if ( ! pan.enabled ) {
  						return;
  					}

  					e.preventDefault();
  					pan.distance = e.distance / 2.5;

  					_setContentPan();
//  					_setBodyClass();
  				};

  				/**
  				 * Handle element on screen movement when the pandown events is firing.
  				 * 
  				 * @param {object} e - Event object
  				 */
  				var _panUp = function(e) {
  					if ( ! pan.enabled || pan.distance === 0 ) {
  						return;
  					}

  					e.preventDefault();

  					if ( pan.distance < e.distance / 2.5 ) {
  						pan.distance = 0;
  					} else {
  						pan.distance = e.distance / 2.5;
  					}

  					_setContentPan();
//  					_setBodyClass();
  				};

  				/**
  				 * Set the CSS transform on the content element to move it on the screen.
  				 */
  				var _setContentPan = function() {
  					// Use transforms to smoothly animate elements on desktop and mobile devices
  					iElement[0].style.transform = iElement[0].style.webkitTransform = 'translateY(' + pan.distance + 'px)';
  				};

  				/**
  				 * Determine how to animate and position elements when the panend event fires.
  				 * 
  				 * @param {object} e - Event object
  				 */
  				var _panEnd = function(e) {
  					if ( ! pan.enabled ) {
  						return;
  					}

  					e.preventDefault();
  					iElement[0].style.transform = iElement[0].style.webkitTransform = '';

  					pan.distance = 0;
  					pan.enabled = false;
  				};

            	var h = new Hammer( iElement[0] );
  			  	h.get( 'pan' ).set( { direction: Hammer.DIRECTION_VERTICAL } );
  			  	h.on( 'panstart', _panStart );
  			  	h.on( 'pandown', _panDown );
  			  	h.on( 'panup', _panUp );
  			  	h.on( 'panend', _panEnd );
            };
            if (!navigator.userAgent.match(/iOS/i)) {
            	notIOS();
            };
            

          var shouldReload = false;
          iElement.bind('touchmove', function(ev) {
            var top = scrollElement[0].scrollTop;
            if (!navigator.userAgent.match(/iOS/i)) {
            	var transform = iElement[0].style.transform;
            	if (transform) {
            	  top = -transform.replace(/translateY\(['"]?([\d.]+)px['"]?\)/i, "$1");
            	}
            }
            if(top < -config.treshold && !shouldReload) {
              setStatus('release');
            } else if(top > -config.treshold && shouldReload) {
              setStatus('pull');
            }
          });

          iElement.bind('touchend', function(ev) {
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
