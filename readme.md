# [ngPullToRefresh](http://mgcrea.github.com/angular-pull-to-refresh) [![Build Status](https://secure.travis-ci.org/mgcrea/angular-pull-to-refresh.png?branch=master)](http://travis-ci.org/#!/mgcrea/angular-pull-to-refresh)


`mgcrea.pullToRefresh` is a module providing a simple css-only pull-to-refresh component, it can use native style momentum scrolling `-webkit-overflow-scroll: touch`, or use javascript event data to create touch movement animation.

The directive has a configurable built-in debounce system (400ms treshold by default) and can leverage angular `$q` promises.



## Quick start

+ Install the module with [bower](http://bower.io/)

``` bash
$ bower install angular-pull-to-refresh --save
```

+ Include the required libraries:

``` html
<link rel="stylesheet" href="bower_components/angular-pull-to-refresh/dist/angular-pull-to-refresh.min.css">
<script src="bower_components/angular-pull-to-refresh/dist/angular-pull-to-refresh.min.js"></script>
```

+ Inject the `mgcrea.pullToRefresh` module into your app:

``` javascript
angular.module('myApp', ['mgcrea.pullToRefresh']);
```



## Examples

[![Demo](http://mgcrea.github.io/angular-pull-to-refresh/demo.gif)](https://rawgit.com/freefri/angular-pull-to-refresh/master/demo/index.html)

You can check out a working demo there (only works on touch devices, with Firefox, you can switch to "Responsive Design View" and enable "Simulate Touch Events"):

+ **https://rawgit.com/freefri/angular-pull-to-refresh/master/demo/index.html**

You can include an optional attribute with some configurarion details pull-to-refresh-config:

``` html
<div class="content">
  <ul class="list-group list-group-table" pull-to-refresh="onReload()" pull-to-refresh-config="pullConfig">
    <li class="list-group-item" ng-repeat="state in states" ng-bind="state"></li>
  </ul>
</div>
```

``` javascript
angular.module('myApp')

  .controller('AppCtrl', function($scope, $q) {

    $scope.pullConfig = {
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
    }
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    $scope.onReload = function() {
      console.warn('reload');
      var deferred = $q.defer();
      setTimeout(function() {
        deferred.resolve(true);
      }, 1000);
      return deferred.promise;
    };

  });
```



## Contributing

Please submit all pull requests the against master branch. It would be nice if we include relevant unit tests. Thanks!



## Authors

**Freefri**

+ http://github.com/freefri

**Olivier Louvignes**

+ http://olouv.com
+ http://github.com/mgcrea

## Tested devices

+ Firefox desktop 42.0 (under "Responsive Design View" and enabling "Simulate Touch Events")
+ Firefox 37.0 on Android
+ Android stock browser Android 5.1.1 on Samsung Galaxy S7
+ Chrome 46 on Android 5.1.1
+ Safari on iPhone 5 (iOS 8.1)


## Copyright and license

    The MIT License

    Copyright (c) 2012 Olivier Louvignes

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
