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

ngApp.controller('MainCtrl', function($scope, $uibModal, Restangular, $route) {
  'use strict';

  var rest = Restangular.oneUrl('projects', 'db');

  var refreshList = function(){
    rest.getList('projects').then(function(project) {
    $scope.projects = project.plain();
    }, function (result) {
      console.log(result);
    });
  }
  refreshList();

  $scope.openModal = function(project) {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: function($scope) {
        project.images = JSON.parse(project.images);
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

  $scope.delete = function (project) {
    rest.getList('projects').then(function(elem) {
      var toDelete = null;
      for (var i = 0; i < elem.length && toDelete == null; i++) {
        if (elem[i].id == project.id) {
          toDelete = elem[i];
        }
      }
      toDelete.remove().then(function(result) {
        refreshList();
      });
      
  });
  }

  $scope.save = function (project) {
    rest.getList('projects').then(function(elem) {
      var toPut = null;
      for (var i = 0; i < elem.length && toPut == null; i++) {
        if (elem[i].id == project.id) {
          toPut = elem[i];
        }
      }
      toPut.projectName = project.projectName;
      toPut.keywords = project.keywords;
      toPut.completionYear = project.completionYear;
      toPut.location = project.location;
      toPut.projectType = project.projectType;
      toPut.contractor = project.contractor;
      toPut.architect = project.architect;
      toPut.buildingType = project.buildingType;
      toPut.buildingStyle = project.buildingStyle;
      toPut.totalArea = project.totalArea;
      toPut.price = project.price;
      toPut.put();
  });
  }

}); 

ngApp.controller('addController', function($scope, Restangular, $route) {
  $scope.save = function(data) {

    var result = {
      "projectName": data.projectName,
      "keywords": $scope.keywords.slice(0, $scope.keywords.length-1).join(" "),
      "completionYear": data.completionYear,
      "location": data.location,
      "projectType": data.projectType,
      "contractor": data.contractor,
      "architect": data.architect,
      "buildingType": data.buildingType,
      "buildingStyle": data.buildingStyle,
      "totalArea": data.totalArea,
      "price": data.price,
      "mainImage": data.mainImage,
      "images": $scope.images.slice(0, $scope.images.length-1)
    }
    var rest =Restangular.all('pam-angular/db/projects');
    rest.post(result);
    toastr["success"]("Dodano projekt!");
  }
  $scope.keywords = ["add keyword"];
  $scope.addKeyword = function() {
    $scope.keywords.push("add keyword");
  }
  $scope.images = ["add image"];
  $scope.addImage = function() {
    $scope.images.push("add image");
  }
});

ngApp.directive('once', function() {
  return {
    require: 'ngModel',
    scope: {
      fn: '&once'
    },
    link: function($scope, $element, $attrs, ngModel) {
      // add a listener and save the index for removal
      var idx = ngModel.$viewChangeListeners.push(function() {
        // user typed, run the function
        $scope.fn();
        // remove the listener
        ngModel.$viewChangeListeners.splice(idx, 1);
      }) - 1;
    }
  };
})
;

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}