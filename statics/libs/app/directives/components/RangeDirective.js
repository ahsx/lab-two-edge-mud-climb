/**
 *	Range directive
 *	
 *	Display a range component. 
 *
 *	Parameters:
 * 		- min {Number} Minimun value allowed
 * 		- max {Number} Maximum value allowed
 * 		- title {String} Title displayed in the label
 * 		- step {Number}	Each time we click on + and - how much do we add or retract
 * 		- precision {Number} What is the precision of the display
 * 		- value {Number} The initial value
 * 		- movel {String} Where do we store the value (which scope variable)
 *
 *	@author Alexandre Masy
 *	@version 1.2
 **/
angular
	.module( APPNAME )
	.directive('range', [function(){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {
				min: 		'@',
				max: 		'@',
				title: 		'@',
				step: 		'@',
				precision: 	'@',
				value: 		'=model'
			}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: '^', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: getPartial('directives/range.html'),
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, $element, $attrs, controller) 
			{
				$scope.value = $attrs.value || 0;
				$scope.step = parseFloat($attrs.step) || 1;
				$scope.precision = $attrs.precision || 1;

				$scope.plus = function()
				{
					var n = parseFloat($scope.value) + $scope.step;
					$scope.value = Math.min( n, $attrs.max );
				}

				$scope.minus = function()
				{
					var n = parseFloat($scope.value) - $scope.step;
					$scope.value = Math.max( n, $attrs.min );
				}
			}
		};
	}]);