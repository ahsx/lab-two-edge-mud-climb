angular
	.module( APPNAME )
	.directive('switch', [function(){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {
				labelon: 	'@',
				labeloff: 	'@',
				on: 		'@',
				title: 		'@',
				value: 		"=model"
			}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: getPartial('directives/switch.html'),
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				$scope.value = iAttrs.on === 'true';
			}
		};
	}]);