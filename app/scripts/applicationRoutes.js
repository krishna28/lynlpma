(function(){
	
'use strict';

angular.module("appRoutes",['ui.router','ui-notification'])

.config(function($stateProvider,$urlRouterProvider,NotificationProvider,$httpProvider){
	
	NotificationProvider.setOptions({
			delay: 10000
			, startTop: 20
			, startRight: 10
			, verticalSpacing: 20
			, horizontalSpacing: 20
			, positionX: 'left'
			, positionY: 'bottom'
		});
	$stateProvider
	        .state('home', {
				url: '/'
				, templateUrl: 'views/main.html'
				, controller: 'MainCtrl'
			})
	        .state('login', {
				url: '/login'
				, templateUrl: 'views/login.html'
				, controller: 'MainCtrl'
			})
		    .state('logout', {
				url: '/logout'
				, templateUrl: 'views/main.html'
				, controller: 'LogoutCtrl'
			})
	       .state('register', {
				url: '/register'
				, templateUrl: 'views/register.html'
				, controller: 'MainCtrl'
			})
			.state('dashboard', {
				url: '/dashboard',
		        params: {
					isAdmin: null
				}
				, templateUrl: 'views/dashboard.html'
				, controller: 'DashboardCtrl'
			})
	      .state('dashboard.createProject', {
				url: '/createPost'
				, templateUrl: 'partials/createProject.html'
				, controller: 'DashboardCtrl'
			})
	      .state('dashboard.viewProject', {
				url: '/viewPost'
				, templateUrl: 'partials/viewProject.html'
				, controller: 'DashboardCtrl'
			})
	      .state('dashboard.project', {
				url: '/project/:id',
		        params:{
		          id:null,
		          projectInstance:null	
		        }
				, templateUrl: 'partials/projectdetail.html'
				, controller: 'DashboardCtrl'
			})
	$urlRouterProvider.otherwise('/');
	
	$httpProvider.interceptors.push('AuthInterceptor');
})
.run(['$state', '$rootScope','Auth',function($state, $rootScope,Auth){

	
	$rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams, options){ 
		$rootScope.isUserLoggedIn = Auth.isLoggedIn();
		if(toState.name === "home"){
             return;
          }
		// this should not be commented
        //event.preventDefault();
        // because here we must stop current flow.. .

		if(toState.name === "login" || toState.name === "register"){
			return;
		}
		console.log("State changes outside",toState.name);
		if(!Auth.isLoggedIn() && toState.name!="login"){
			 event.preventDefault();
			 $state.transitionTo("login", null, {notify:false});
             $state.go('login');
		}
       
		
});
}]);
})();
