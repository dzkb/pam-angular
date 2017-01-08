var ngApp = angular.module('ngApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'restangular']).config(function($routeProvider, $locationProvider) {
  $routeProvider

            // route for the home page
            .when('/', {
              templateUrl : './pages/home.html',
              controller  : 'MainCtrl'
            })

            .when('/add', {
              templateUrl : './pages/add.html',
              controller  : 'addController'
            })

            ;
            $locationProvider.html5Mode(true);
          });

ngApp.controller('MainCtrl', function($scope, $uibModal, Restangular, $route) {
  'use strict';

  var rest = Restangular.oneUrl('projects', 'db');

  var refreshList = function(){
    rest.getList('projects').then(function(project) {
      $scope.projects = project.plain();
      for (var i = 0; i < $scope.projects.length; i++) {
        $scope.projects[i].images = JSON.parse($scope.projects[i].images);
      // ^ get images
    }
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
        toastr["success"]("Project removed!");
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
      toPut.images = project.images;
      toPut.put();
      toastr["success"]("Project saved!");
    });
  }

}); 

ngApp.controller('addController', function($scope, Restangular, $route) {
 function save(data) {
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
    "images": data.images
  }
  var rest =Restangular.all('pam-angular/db/projects');
    // var rest =Restangular.all('my-site/db/projects');
    rest.post(result);
    toastr["success"]("Project added!");
  }
  $scope.keywords = [""];
  $scope.addKeyword = function() {
    $scope.keywords.push("");
  }
  $scope.images = [""];
  $scope.addImage = function() {
    $scope.images.push("");
  }

  //variable for selected image
  $scope.mainImage = 0;

  $scope.selectAsMain = function (index) {
    $scope.mainImage = index;
  }

  //remove image 
  $scope.removeImage = function (index) {
    $scope.files.splice(index, 1);
    if($scope.mainImage === index) {
      $scope.mainImage = index - 1;
    }
  }
//upload images
var dropbox = document.getElementById("dropbox")
$scope.dropText = 'Drop files here...'

    // init event handlers
    function dragEnterLeave(evt) {
      evt.stopPropagation()
      evt.preventDefault()
      $scope.$apply(function(){
        $scope.dropText = 'Drop files here...'
        $scope.dropClass = ''
      })
    }
    dropbox.addEventListener("dragenter", dragEnterLeave, false)
    dropbox.addEventListener("dragleave", dragEnterLeave, false)
    dropbox.addEventListener("dragover", function(evt) {
      evt.stopPropagation()
      evt.preventDefault()
      var clazz = 'not-available'
      var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0
      $scope.$apply(function(){
        $scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
        $scope.dropClass = ok ? 'over' : 'not-available'
      })
    }, false)

    dropbox.addEventListener("drop", function(evt) {
      console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
      evt.stopPropagation()
      evt.preventDefault()
      $scope.$apply(function(){
        $scope.dropText = 'Drop files here...'
        $scope.dropClass = ''
      })
      var files = evt.dataTransfer.files
      if (files.length > 0) {
        $scope.$apply(function(){
          $scope.filesURLs = [];
          $scope.files = [];
          for (var i = 0; i < files.length; i++) {
            $scope.files.push(files[i]);
            reader = new FileReader();
            reader.onload = function(event) {
              $scope.filesURLs.push(event.target.result);
            };
            reader.readAsDataURL(files[i]);
          }
        })
      }
    }, false)
    //============== DRAG & DROP =============

    $scope.setFiles = function(element) {
      $scope.$apply(function(scope) {
        console.log('files:', element.files);
      // Turn the FileList object into an Array
      $scope.files = []
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i])
      }
      $scope.progressVisible = false
    });
    };

    $scope.uploadFile = function() {
      var fd = new FormData()
      for (var i in $scope.files) {
        fd.append("uploadedFile[]", $scope.files[i])
      }
      var xhr = new XMLHttpRequest()
      xhr.upload.addEventListener("progress", uploadProgress, false)
      xhr.addEventListener("load", uploadComplete, false)
      xhr.addEventListener("error", uploadFailed, false)
      xhr.addEventListener("abort", uploadCanceled, false)
      xhr.open("POST", "db/fileupload")
      $scope.progressVisible = true
      xhr.send(fd)
    }

    function uploadProgress(evt) {
      $scope.$apply(function(){
        if (evt.lengthComputable) {
          $scope.progress = Math.round(evt.loaded * 100 / evt.total)
        } else {
          $scope.progress = 'unable to compute'
        }
      })
    }

    function uploadComplete(evt) {
      /* This event is raised when the server send back a response */
      console.log('dududududupa', JSON.parse(evt.target.response).created_files);
      var data = $scope.data;
      data.mainImage = JSON.parse(evt.target.response).created_files[0];
      data.images = JSON.parse(evt.target.response).created_files;
      console.log('data', data.images);
      console.log('data', typeof data.images[$scope.mainImage]);
      save(data);
    }

    function uploadFailed(evt) {
      alert("There was an error attempting to upload the file.")
    }

    function uploadCanceled(evt) {
      $scope.$apply(function(){
        $scope.progressVisible = false
      })
      alert("The upload has been canceled by the user or the browser dropped the connection.")
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