angular.module('mat')
.controller('MainCtrl',
	function($scope, $firebaseArray) {

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

		$scope.todayDate = (new Date()).yyyymmdd();

		var ref = new Firebase('https://kholm-mat.firebaseio.com/mat');
		$scope.weeks = $firebaseArray(ref);
		$scope.days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'];
	}
)