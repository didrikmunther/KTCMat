angular.module('mat')
.controller('MainCtrl',
	function($scope, $firebaseArray, $ionicPopup, $timeout) {

		$scope.version = {};
		$scope.version.number = '1.2';
		$scope.isOldVersion = false;
		$scope.realVersion = '';

		$scope.infoPopup = function() {
			$ionicPopup.alert({
				template: '<ion-list>\
								<ion-item ng-click="openLink(\'http://ktcteknik.se/ktcdimu/ktcmat.apk\');">\
									<a ng-class="{\'old-version-popup\': isOldVersion, \'current-version-popup\': !isOldVersion}">Update App (apk-file)</a>\
									</ion-item>\
								<ion-item ng-click="openLink(\'https://github.com/Malaxiz/KTCMat\');">\
									<a>Source Code</a>\
								</ion-item>\
							</ion-list>',
				title: 'App Info',
				scope: $scope,
			});
		}

		// openLink('https://github.com/Malaxiz/KTCMat');

		$scope.openLink = function(link) {
			window.open(encodeURI(link), '_system', 'location=yes');
			return false;
		}

		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = this.getDate().toString();
			return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
		};

		$scope.isDatePast = function(date1, date2) { // if date2 is past date1
			return (new Date(date1)).getTime() < (new Date(date2)).getTime();
		};

		$scope.range = function(start, end) {
			tmp = [];
			for(var i = start; i <= end; i++) tmp.push(i);
			return tmp;
		}

		$scope.versionCompare = function(a, b) {
		    if (a === b) {
		       return 0;
		    }
		    var a_components = a.split(".");
		    var b_components = b.split(".");
		    var len = Math.min(a_components.length, b_components.length);

		    for (var i = 0; i < len; i++) {
		        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
		            return 1;
		        }
		        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
		            return -1;
		        }
		    }
		    if (a_components.length > b_components.length) {
		        return 1;
		    }
		    if (a_components.length < b_components.length) {
		        return -1;
		    }
		    return 0;
		}

		$scope.todayDate = (new Date()).yyyymmdd();

		var ref = new Firebase('https://kholm-mat.firebaseio.com/mat');
		$scope.weeks = $firebaseArray(ref);
		$scope.days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'];

		$scope.weeks.$loaded(function() {
			$scope.realVersion = $scope.weeks[0]['version'];
			var comparison = $scope.versionCompare($scope.realVersion, $scope.version.number);
			if(comparison == 1) { // There is a newer version
				console.log('this is an old version');
				$scope.isOldVersion = true;
			}
		});
	}
)
.filter('orderByWeek', function(){
  return function(input, attribute) {
	if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
    	if(angular.isObject(input[objectKey]) && input[objectKey]['Onsdag']) {
    		array.push(input[objectKey]);
    		input[objectKey]['weekname'] = objectKey;
    	}
	}

	console.log(array);
	return array.sort(function(a, b) {
		return parseInt(a['weekname'].substr(6, 3).slice(0, -1)) - parseInt(b['weekname'].substr(6, 3).slice(0, -1));
	});
  }
});