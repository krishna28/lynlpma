(function(){
	
'use strict'

angular.module('authService', [])

.factory('Auth', function($http, $q, AuthToken,config) {

	var authFactory = {};
     authFactory.roles = [];
	authFactory.isAdmin = false;
	
    var baseUrl = config.apiUrl;
	authFactory.login = function(username, password) {

		return $http.post(baseUrl+'login', {
			username: username,
			password: password
		})
		.then(function(serviceResponse) {
			if(serviceResponse.status == 200){
			  AuthToken.setToken(serviceResponse.data.token);
		    }

			return serviceResponse;
		}).catch(function(err){
			return err;
		})
	};
	
	

	authFactory.logout = function() {
		AuthToken.setToken();
	};

	authFactory.register = function(name, username,password){
		var registerUrl = baseUrl+'signup';
		 var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
            };
   return $http.post(registerUrl,{
   	        name: name,
			username: username,
			password: password
		})
		.then(function(serviceResponse) {
			if(serviceResponse.status == 200){
			  AuthToken.setToken(serviceResponse.data.token);
		    }
			return serviceResponse;
		})
		.catch(function(err){
           return err; 
		})
	};
	
	authFactory.isLoggedIn = function() {
		if(AuthToken.getToken())
				return true;
		else
			return false;
	};

	authFactory.getProjects = function(offSet,max) {

		if(AuthToken.getToken()){
			return $http({method:'GET',
				url:baseUrl+'api/project',
				 params:{offset:offSet,maxResultSet:max}
				});
		}
		else{
			return $q.reject({ message: "User has no token"});
		}

	};

	return authFactory;

})


.factory('AuthToken', function($window) {

	var authTokenFactory = {};

	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token) {

		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');

	}

	return authTokenFactory;

})


.factory('AuthInterceptor', function($q, $location, AuthToken,$window) {

	var interceptorFactory = {};


	interceptorFactory.request = function(config) {

		var token = AuthToken.getToken();

		if(token) {
			config.headers['x-access-token'] = token;
		}
		return config;

	};
	
	interceptorFactory.responseError = function(response){
		console.log("error response",response);
		if(response.status == 403){
			console.log("unauthorized error");
//			$location.path("/403.html");
			$window.location = '/403.html';
			$q.reject(response);
			
		}
		if(response.status == 401){
				return $q.reject(response);
			
		}
		
		if(response.status == -1){
			
				return $q.reject(response);
		}
		if(response.status == 500){
			$location.path("/500.html");
			return $q.reject(response);
			
		}
		
	}
	
	return interceptorFactory;
});
	
})();

