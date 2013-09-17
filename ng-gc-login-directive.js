/**
 * @license ng-gc-login-directive v0.1.0
 * (c) 2013-2013 GoCardless, Ltd.
 * https://github.com/gocardless-ng/ng-gc-login-directive.git
 * License: MIT
 */
(function(){
'use strict';

angular.module('login-template.html', []).run(function($templateCache) {
  $templateCache.put('login-template.html',
    '<div><dialog show="isVisible" ng-class="\'login-dialog\'" template-url="empty" options="{\n' +
    '      preventHideOnClick: true,\n' +
    '      preventHideOnEscape: true\n' +
    '    }"><form ng-submit="signIn()" name="loginForm"><div class="u-padding-Am"><div class="error-label u-margin-Bm" ng-show="signInError"><span>{{ signInError }}</span></div><label for="login-email" class="label label--stacked">Email</label><input type="email" id="login-email" name="loginEmail" ng-model="loginDetails.email" class="input input--stacked input--block"><div class="error-label" ng-show="loginForm.loginEmail.$dirty && form.loginEmail.$invalid"><span ng-show="loginForm.loginEmail.$error.required">Please provide a valid email</span></div><div class="u-cf"><div class="u-pull-start"><label for="login-password" class="label label--stacked">Password</label></div><div class="u-pull-end" ng-show="AppConfig.gocardless"><a href="{{ AppConfig.gocardless.host }}/users/password/new" class="label label--stacked u-link u-text-normal">Forgot your password?</a></div></div><input type="password" id="login-password" name="loginPassword" ng-model="loginDetails.password" class="input input--stacked input--block"><div class="error-label" ng-show="loginForm.loginPassword.$dirty && form.loginPassword.$invalid"><span ng-show="loginForm.loginPassword.$error.required">Please provide a password</span></div><input type="submit" class="btn btn--info btn--block" value="Sign in"></div></form></dialog></div>');
});

'use strict';

angular.module('gc.loginController', [
  'ngSecurityService'
]).controller('LoginController', [
  '$scope', '$window', 'SecurityService',
  function LoginController($scope, $window, SecurityService) {

    function findById(id) {
      return $window.document.getElementById(id);
    }

    // XXXXXXXXXXXXXX
    // This is so shit
    // but two way binding just doesn't happen with
    // autofilled/password managers
    function getLoginDetails() {
      var email = findById('login-email');
      var password = findById('login-password');

      return {
        email: email && email.value,
        password: password && password.value
      };
    }

    $scope.signIn = function signIn() {
      SecurityService.signIn(getLoginDetails())
        .then(function() {
          $scope.signInError = '';
        }, function(reason) {
          $scope.signInError = reason.data.error;
        });
    };

    $scope.$watch(function() {
      return SecurityService.isSignInVisible();
    }, function(isVisible) {
      $scope.isVisible = isVisible;
    });

    $scope.AppConfig = $window.AppConfig;

  }
]);

'use strict';

angular.module('gc.login', [
  'gc.dialog',
  'gc.loginController',
  'login-template.html'
]).directive('login', [
  function loginDirective() {

    return {
      restrict: 'E',
      templateUrl: 'login-template.html',
      replace: true,
      controller: 'LoginController',
      scope: {}
    };

  }
]);
})();