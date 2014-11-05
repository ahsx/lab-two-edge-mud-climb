angular
	.module( APPNAME )
	.service('Utils', [function(){
		
		/**
		 *	Return a random value between min and max
		 *
		 *	@param min {Number}
		 *	@param max {Number}
		 *	@return {Number}
		 **/
		this.range = function( min, max )
		{
			return Math.floor(Math.random() * (max - min + 1) + min);
		}

		/**
		 *	Convert a degree angle to a radian
		 *
		 *	@param value {Number}
		 *	@return {Number}
		 **/
		this.toRadian = function( value )
		{
			return value * (Math.PI/180);
		}
	}])	
