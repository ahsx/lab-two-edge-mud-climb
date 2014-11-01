angular
	.module( APPNAME )
	.controller('AppController', ['$rootScope', '$scope', function($rootScope, $scope)
	{
		$rootScope.open = false;
		$rootScope.openSide = 'options';
		$rootScope.options = {};

		/**
		 *	Save to clipboard
		 *
		 *	@param text {String}
		 **/
		$scope.saveToClipboard = function( text )
		{
			window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
		}

		/**
		 *	Track the social information into Google Analytics
		 *	
		 *	@param network {String}
		 *	@param action {String}
		 **/
		$scope.trackSocial = function( network, action )
		{
			ga('send', 'social', network, action, window.location.href);
		}
	}]);