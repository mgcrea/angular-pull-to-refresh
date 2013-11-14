'use strict';

angular.module('mgcrea.pullToRefresh').run(['$templateCache', function($templateCache) {

  $templateCache.put('angular-pull-to-refresh.tpl.html',
    '<div class=\'pull-to-refresh\'>\n' +
    '  <i ng-class=\'icon[status]\'></i>&nbsp;\n' +
    '  <span ng-bind=\'text[status]\'></span>\n' +
    '</div>\n' +
    '<div ng-transclude></div>\n'
  );

}]);
