angular.module('ngApp', ['ngAnimate', 'ui.bootstrap']).controller('MainCtrl', function($scope, $uibModal) {
  'use strict';

  $scope.projects = [{
    "projectName": "Green2Day",
    "keywords": "office green day",
    "completionYear": 2017,
    "location": "Wrocław",
    "projectType": "implementation",
    "contractor": "Skanska",
    "architect": "Maćków Pracownia Projektowa Sp. Z O.O",
    "buildingType": "office",
    "buildingStyle": "modern",
    "totalArea": 17000,
    "price": 3000000,
    "mainImage": "https://unsplash.it/64?image=69",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  },
  {
    "projectName": "Polaka 14",
    "keywords": "loft",
    "completionYear": 2015,
    "location": "Wrocław",
    "projectType": "project",
    "contractor": "Toscom",
    "architect": "Janusz Ratajczak",
    "buildingType": "mdu",
    "buildingStyle": "industrial",
    "totalArea": 5000,
    "price": 200000,
    "mainImage": "https://unsplash.it/64?image=42",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  },
  {
    "projectName": "Residential Tower",
    "keywords": "złota 44",
    "completionYear": 2015,
    "location": "Warszawa",
    "projectType": "visualization",
    "contractor": "BBI Development NFI, Amstar",
    "architect": "Zdzisław Spławski",
    "buildingType": "house",
    "buildingStyle": "deconstructivism",
    "totalArea": 79000,
    "price": 25000,
    "mainImage": "https://unsplash.it/64?image=420",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  },
  {
    "projectName": "Piwna 25/1",
    "keywords": "beer",
    "completionYear": 2020,
    "location": "Wrocław",
    "projectType": "project",
    "contractor": "Urząd Miasta Wrocław",
    "architect": "Donat Orski",
    "buildingType": "flat",
    "buildingStyle": "minimalistic",
    "totalArea": 60,
    "price": 2000,
    "mainImage": "https://unsplash.it/64?image=95",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  },
  {
    "projectName": "Politechnika Rzeszowska - V-4",
    "keywords": "university",
    "completionYear": 2018,
    "location": "Rzeszów",
    "projectType": "implementation",
    "contractor": "Politechnika Rzeszowska",
    "architect": "Mariusz Fraś",
    "buildingType": "mdu",
    "buildingStyle": "modern",
    "totalArea": 30000,
    "price": 2500000,
    "mainImage": "https://unsplash.it/64?image=55",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  },
  {
    "projectName": "Grunwaldzka 69",
    "keywords": "city centre",
    "completionYear": 2016,
    "location": "Gdańsk",
    "projectType": "project",
    "contractor": "Jan Kowalski",
    "architect": "Hanna Mazur",
    "buildingType": "house",
    "buildingStyle": "scandinavian",
    "totalArea": 120,
    "price": 3000,
    "mainImage": "https://unsplash.it/64?image=12",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  },
  {
    "projectName": "Wielka C",
    "keywords": "obscene communism",
    "completionYear": 1974,
    "location": "Rzeszów",
    "projectType": "implementation",
    "contractor": "PZPR",
    "architect": "Władysław Kruczek",
    "buildingType": "mdu",
    "buildingStyle": "rustic",
    "totalArea": 500,
    "price": 750000,
    "mainImage": "https://unsplash.it/64?image=96",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  },
  {
    "projectName": "Burj Khalifa",
    "keywords": "skyscraper",
    "completionYear": 2009,
    "location": "Dubai",
    "projectType": "implementation",
    "contractor": "Samsung Constructions, BESIX, Arabtec",
    "architect": "Adrian Smith",
    "buildingType": "mdu",
    "buildingStyle": "modern",
    "totalArea": 309473,
    "price": 9000000000,
    "mainImage": "https://unsplash.it/64?image=74",
    "images": ["https://unsplash.it/900/300",
               "https://unsplash.it/901/300",
               "https://unsplash.it/902/300"]
  }];

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
        return b.includes(a.substring(i));
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
    var query = $scope.query.trim().replace(/\s+/g, " ").replace(/,/g, '').split(" ");
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
