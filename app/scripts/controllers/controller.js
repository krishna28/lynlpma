(function(){
	
'use strict'

angular.module('appController', [])
	.controller('MainCtrl', function (Auth, $rootScope, Notification, $state, config) {

		var mainVm = this;

		$rootScope.checkIfAdmin = false;
		$rootScope.userName = "";

		mainVm.login = function () {

			if(mainVm.username != undefined && mainVm.password != undefined){
              Auth.login(mainVm.username, mainVm.password).then(function successHandler(serviceResponse) {

				if (serviceResponse == undefined || serviceResponse.status == 401) {
					Notification.error('Invalid username and password!');
					return;
				}
				if (serviceResponse != undefined && serviceResponse.status == 200) {
					console.log("user data",serviceResponse);
					$rootScope.userName = serviceResponse.data.username;
					$rootScope.isUserLoggedIn = true;
					angular.forEach(serviceResponse.data.roles, function (val) {
						if (val.toString() == config.roles.admin.toString()) {
							$rootScope.checkIfAdmin = true
						}

					});
					$state.go('dashboard', {
						checkIfAdmin: $rootScope.checkIfAdmin
					});
				}
			}, function errorHandler(error) {
				Notification.error('Invalid username and password!');

			});
			}else{
              Notification.error('Username and password is required');
			  return;
			}

		};

		// mainVm.getProjects = function () {
		// 	Auth.getProjects().then(function successcallback(serviceResponse) {

		// 	}, function errorCallback(err) {
		// 		console.log(err);
		// 	});
		// }


		mainVm.register = function () { 
			Auth.register(mainVm.name,mainVm.username, mainVm.password).then(function (serviceResponse) {
                console.log("REGISTERED",serviceResponse);
				if (serviceResponse.status == 200) {
					Notification.success('User created');
					$rootScope.userName = serviceResponse.data.username;
					$rootScope.isUserLoggedIn = true;
					$state.go('dashboard');
				}

			});

		};

	})
	.controller('DashboardCtrl', function (Auth,$rootScope,$scope, $state, $stateParams, MainService, Notification) {
		var dashboardVm = this;
		dashboardVm.users = [];
		dashboardVm.projectId = null;
		dashboardVm.expiredProjects = []
		dashboardVm.newProjects = []
		dashboardVm.pending = []
		dashboardVm.newb = true

		
		if ($stateParams.id && $stateParams.projectInstance) {
			dashboardVm.id = $stateParams.id;
			dashboardVm.projectInstance = $stateParams.projectInstance;
			// return false;
		}

		if($stateParams.id && !$stateParams.projectInstance){
              MainService.getProject($stateParams.id)
                         .then(function(response){
                             dashboardVm.id = $stateParams.id;
			                 dashboardVm.projectInstance = response.data;

                         }).catch(function(ex){
                              console.log(ex);
                         })  
		    }

		
		dashboardVm.getProjects = function () {

			MainService.getProjects().then(function (response) {
				console.log("the project data is ", response);
                 var project = response.data;

                 //filter level

                                  		
                 	var newlist = project.filter(function(ex){
                 			return ex.status == "NEW"
                 	})
                 	var pendinglist = project.filter(function(ex){
                 			return ex.status == "PENDING"
                 	})
                 	var expiredList = project.filter(function(ex){
                 		var createdDate = new Date(ex.created);
                 		var dayafter3 = new Date(createdDate.setDate(createdDate.getDate() + 3))
                        var currentDate  = new Date(); 
                 		return (ex.status == "PENDING" && (currentDate > dayafter3))
                 	})
                 	dashboardVm.expiredProjects = expiredList
		            dashboardVm.newProjects = newlist
		            dashboardVm.pending = pendinglist

			})
		};
		dashboardVm.getProjects();

		dashboardVm.getUsers = function () {
			MainService.getUsers().then(function (usersResponse) {
				angular.forEach(usersResponse.data, function (val, key) {
					dashboardVm.users.push({
						 id: val['_id']
						,username: val.username
						,name: val.name
					});
				})
			})
		};
		dashboardVm.getUsers();
		dashboardVm.createProject = function () {
			MainService.createProject(dashboardVm.projectTitle, dashboardVm.description).then(function successHandler(serviceResponse) {
				console.log(serviceResponse);
				if (serviceResponse.status == 200) {
					Notification.success('Project created! ');
					dashboardVm.projectTitle = "";
					dashboardVm.getProjects();
				}
			}, function errorHnadler(err) {
				console.log(err);
			})
		}

		//
		dashboardVm.updateProject = function () {

          var expertList = [];

          var projectId= dashboardVm.projectInstance['_id']

          if(dashboardVm.projectInstance.expertUser != undefined){
               dashboardVm.projectInstance.expertUser.forEach(function(userid){
                expertList.push({
                	expert:userid,
                	status:"NEW"
                })
               })
          }

          if(dashboardVm.projectInstance.experts != undefined){
               dashboardVm.projectInstance.experts.forEach(function(expert){
               	console.log("Expert", expert);
                expertList.push({
                	expert:expert['expert']['_id'],
                	status:expert.status
                })
               })
          }
          var data = {
          	status:dashboardVm.projectInstance.status,
          	title: dashboardVm.projectInstance.title,
          	experts:expertList
          } 
          
          MainService.updateProject(projectId,data).then(function successHandler(serviceResponse) {
				console.log(serviceResponse);
				if (serviceResponse.status == 200) {
                   Notification.success("Updated");
                   dashboardVm.getProjects();
               }
			}, function errorHnadler(err) {
				console.log(err);
			})

		};


		dashboardVm.logout = function () {
			Auth.logout();
			$state.go('/')
		};


	})
	.controller('LogoutCtrl', ['Auth', '$rootScope'
    , function (Auth, $rootScope) {
			Auth.logout();
			$rootScope.isUserLoggedIn = false;
    }
  ])
	.directive('myModal', function () {
		return {
			restrict: 'A'
			, link: function (scope, element, attr) {
				scope.dismiss = function () {
					element.modal('hide');
				};
			}
		}
	})
	.filter("approvedExperts", function () {
    return function (fieldValueUnused, items) {
    	  if(Array.isArray(items.experts)){
    	  	var xpertAlist = items.experts.filter(function (item) {
               return item.status == "APPROVED";
            }).map(function (exprt) {
                return exprt.expert.name
            })
            return xpertAlist.join(",")
    	  }
    };
    })
	.filter("trimed", function () {
    return function (title,trimsize,trimS) {
         return title.substring(0,trimS);
    };
});
})();	