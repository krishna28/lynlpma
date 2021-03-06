(function(){
'use strict';

/**
 * @ngdoc overview
 * @name projectManagementApplicationApp
 * @description
 * # projectManagementApplicationApp
 *
 * Main module of the application.
 */
angular.module('projectManagementApplicationApp', ['appRoutes','authService','mainService','appController','trNgGrid'])
 .constant('config',{
	       appName: 'Project Management Application',
		   apiUrl:'https://blooming-plains-81544.herokuapp.com/',
	       roles:{
	       	admin:'ROLE_ADMIN',
			user:'ROLE_USER'   
	       },
	       contentTypeConfig:{
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
       }
});
	
})();
