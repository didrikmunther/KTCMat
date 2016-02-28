angular.module('mat')
.controller('MainCtrl',
	function($scope, $firebaseArray, $ionicPopup, $timeout) {

		$scope.version = '1.0';
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
			window.open(link, '_system', 'location=yes');
			return false;
		}

		Date.prototype.yyyymmdd = function() {
			var yyyy = this.getFullYear().toString();
			var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
			var dd  = this.getDate().toString();
			return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
		};

		$scope.isDatePast = function(date1, date2) { // if date2 is past date1
			var y1 = date1.substr(0, 4);
			var m1 = date1.substr(0, 7).substr(5);
			var d1 = date1.substr(-2);
			var y2 = date2.substr(0, 4);
			var m2 = date2.substr(0, 7).substr(5);
			var d2 = date2.substr(-2);

			if(y2 < y1) {
				return false;
			} else if(m2 < m1) {
				return false;
			} else if(d2 < d1 || d2 == d1) {
				return false;
			}
			return true;
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
			var comparison = $scope.versionCompare($scope.realVersion, $scope.version);
			if(comparison == 1) { // There is a newer version
				console.log('this is an old version');
				$scope.isOldVersion = true;
			}
		});
	}
)