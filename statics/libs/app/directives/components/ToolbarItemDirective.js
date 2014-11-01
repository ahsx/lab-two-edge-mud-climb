angular
	.module( APPNAME )
	.directive('toolbaritem', ['$rootScope', function($rootScope){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: true, // {} = isolate, true = child, false/undefined = no change
			controller: function($scope, $element, $attrs, $transclude) 
			{
				$scope.active = false;
				$scope.title = $attrs.title;
				$scope.href = $attrs.href;
				$scope.icon = $attrs.icon;
				$scope.side = $attrs.href.substr(1);

				$rootScope.$watch('openSlide', function(newVal, oldVal)
				{
					$scope.active = $rootScope.openSlide == $scope.side;
				});

				$scope.itemClick = function( $event, side )
				{
					$event.preventDefault();

					ga('send', 'event', 'Toolbar', 'Click', side);

					if ( $scope.side == $scope.openSlide )
					{
						$rootScope.open = !$rootScope.open;
					}
					else
					{
						$rootScope.open = true;
						$rootScope.openSlide = $scope.side;
					}

					if ( !$rootScope.open )
						$rootScope.openSlide = null;
				}
			},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: getPartial('directives/toolbar-item.html'),
			replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				
			}
		};
	}]);