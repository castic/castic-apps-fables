var app = angular.module('casticApp');

app.service('AuthService', ['$http', 'AppConfig', '$rootScope', function ($http, AppConfig, $rootScope) {
	var loggedIn = false;

	return {
		login: function (user) {
			return $http.post(AppConfig.apiPath+'/login', user)
				.then(function (user) {
					loggedIn = true;
					return user;
				});
		},
		logout: function () {
			return $http.get(AppConfig.apiPath+'/logout')
				.then(function (result) {
					loggedIn = false;
					$rootScope.$broadcast('logged out');
					return result;
				});
		},
		isLoggedIn: function () {
			return loggedIn;
		}
	}
}]);