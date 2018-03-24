(function() {
  'use strict'

  angular.module('mainService', [])
    .factory('MainService', function($http, $q, AuthToken, config) {

      var mainFactory = {};

      var baseUrl = config.apiUrl;

      mainFactory.getUsers = function() {
        return $http.get(baseUrl + 'api/users', config.contentTypeConfig)
          .then(function(serviceResponse) {
            return serviceResponse;
          }).catch(function(err){
            return err;
          })

      };


      mainFactory.getProjects = function() {
        // var data = {
        //   projectId: pId,
        //   offset: offSet,
        //   maxResultSet: max
        // };

        var url = baseUrl.concat("api/project/");
        return $http({
          method: 'GET',
          url: url
        })
        .then(function(serviceResponse) {
            return serviceResponse;
          }).catch(function(err){
            return err;
          })

      };

      mainFactory.getProject = function(projectId){

        var url = baseUrl.concat("api/project/").concat(projectId);
        console.log("url", url);
        return $http.get(url)
        .then(function(serviceResponse) {
          console.log("ss",serviceResponse);
            return serviceResponse;
          }).catch(function(err){
            return err;
          })
      }

      mainFactory.getTaskComments = function(data) {

        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task/").concat(data.taskId).concat("/comment");
        return $http.put(url,data)
        .then(function(serviceResponse) {
            return serviceResponse;
          });

      };



      mainFactory.createProject = function(projectTitle, description) {
        return $http.post(baseUrl + 'api/project',{
          title: projectTitle
        })
          .then(function(serviceResponse) {
            return serviceResponse;
          })

      }

     mainFactory.updateProject = function(projectId,data) {
        return $http.put(baseUrl + 'api/project/'.concat(projectId),data)
          .then(function(serviceResponse) {
            return serviceResponse;
          })

      }

      mainFactory.deleteProject = function() {


      }

      mainFactory.saveTask = function(data) {
        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task");

        return $http.post(url, $.param(data), config.contentTypeConfig)
          .then(function(serviceResponse) {
            return serviceResponse;
          })

      }

      mainFactory.deleteTask = function(projectId, taskId) {
        var url = baseUrl.concat("api/project/").concat(projectId).concat("/task/").concat(taskId);

        return $http.delete(url, config.contentTypeConfig)
          .then(function(serviceResponse) {
            return serviceResponse;
          })

      }

      mainFactory.updateTask = function() {

      }

      mainFactory.saveComment = function(data) {

        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task/").concat(data.taskId).concat("/comment")

        return $http.post(url, $.param(data), config.contentTypeConfig)
          .then(function(serviceResponse) {
            return serviceResponse;
          })
      }

      mainFactory.deleteComment = function(data) {
        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task/").concat(data.taskId).concat("/comment/").concat(data.commentId);

        return $http.delete(url, config.contentTypeConfig)
          .then(function(serviceResponse) {
            return serviceResponse;
          });

      }

      mainFactory.updateComment = function() {

      }

      return mainFactory;

    });
})();
