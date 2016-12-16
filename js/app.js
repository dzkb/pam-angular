var ngApp = angular.module('ngApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'restangular']).config(function($routeProvider) {
  $routeProvider

            // route for the home page
            .when('/', {
              templateUrl : './pages/home.html',
              controller  : 'MainCtrl'
            })

            // route for the about page
            .when('/add', {
              templateUrl : './pages/add.html',
              controller  : 'addController'
            })

            // route for the contact page
            .when('/contact', {
              templateUrl : './pages/contact.html',
              controller  : 'contactController'
            });
          });

ngApp.controller('MainCtrl', function($scope, $uibModal, Restangular) {
  'use strict';

  var rest =Restangular.oneUrl('projects', 'http://localhost/my-site/db');
  rest.getList('projects').then(function(project) {
    $scope.projects = project.plain();
  });
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
      console.log(row);

      for (var k in row.plain()) { // property check
        if (k != "keywords" && k != "mainImage" && k != "images") {
          if (approxMatching(query[i], row[k].toString())) {
            contains_query[i] = true;
          }
        }
      }
    }

    return contains_query.reduce(function(acc, v) { return (acc && v); });
  }

  //$scope.editMode = false;

}); 

ngApp.controller('addController', function($scope, Restangular) {
  $scope.message = 'Look! I am an add page.';
  $scope.save = function(keywords) {
    console.log(keywords);

    var test = {
      "id":"2",
      "projectName":"Green2Day",
      "keywords":"office green day",
      "completionYear":"2017",
      "location":"Wroc\u0142aw",
      "projectType":"implementation",
      "contractor":"Skanska",
      "architect":"Ma\u0107k\u00f3w Pracownia Projektowa Sp. Z O.O",
      "buildingType":"office",
      "buildingStyle":"modern",
      "totalArea":"17000","price":"3000000",
      "mainImage":"http:\/\/placehold.it\/64x64",
      "images":"[\"http:\/\/placehold.it\/900x300\",\"http:\/\/placehold.it\/900x300\",\"http:\/\/placehold.it\/900x300\"]"
    }
    var rest =Restangular.all('/my-site/db/projects');
    rest.post(test);
  }
});