var ngApp = angular.module('ngApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'restangular']).config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : './pages/home.html',
                controller  : 'MainCtrl'
            })

            // route for the about page
            .when('/about', {
                templateUrl : './pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/contact', {
                templateUrl : './pages/contact.html',
                controller  : 'contactController'
            });
    });

ngApp.controller('MainCtrl', function($scope, $uibModal, Restangular) {
  'use strict';

 $scope.projects =Restangular.oneUrl('projects', 'http://localhost/my-site/db/project.php').get();
 console.log($scope.projects);

  $scope.openModal = function(project) {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: function($scope) {
        $scope.project = project;
        $scope.close = $scope.$close;
        $scope.saneProject = {
          "Project name": project.projectName,
          "Keywords": project.keywords.split(" ").join(", "),
          "Completion Year": project.completionYear,
          "Location": project.location,
          "Project type": project.projectType,
          "Contractor": project.contractor,
          "Architect": project.architect,
          "Building type": project.buildingType,
          "Building style": project.buildingStyle,
          "Total area": project.totalArea,
          "Price": project.price
        };
      },
      controllerAs: '$ctrl',
      size: 'lg',
      resolve: {
        project: function () {
          return project;
        }
      }
    });
  }


  function approxMatching(a, b) {
    if (a.length > b.length) {
      return false;
    }
    var errors = 0;
    for (var i = 0; i < a.length; i++) {
      if (errors > 0) {
        // return b.includes(a.substring(i));
        return b.substring(i).startsWith(a.substring(i));
      }
      if (a[i] != b[i]) {
        errors++;
      }
    }
    return true;
  }

  $scope.search = function(row) {
    if (typeof $scope.query == "undefined" || $scope.query.length == 0)
      return true;
    var query = $scope.query.trim().replace(/,/g, " ").replace(/\s+/g, " ").split(" ");
    var contains_query = query.map(function() {return false;} )
    for (var i=0; i < query.length; i++) {
      query[i] = query[i].trim();

      var keywords = row.keywords.split(" "); // keyword check
      for (var j = 0; j < keywords.length; j++) {
        if (approxMatching(query[i], keywords[j].toString())) {
          contains_query[i] = true;
        }
      }

      for (var k in row) { // property check
        if (k != "keywords" && k != "mainImage" && k != "images") {
          if (approxMatching(query[i], row[k].toString())) {
            contains_query[i] = true;
          }
        }
      }
    }

    return contains_query.reduce(function(acc, v) { return (acc && v); });
  }

}); 

ngApp.controller('editController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });

ngApp.controller('addController', function($scope) {
        $scope.message = 'Look! I am an about page.';
    });