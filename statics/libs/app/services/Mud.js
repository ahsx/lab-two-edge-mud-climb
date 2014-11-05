(function(window) {
	'use strict';

	
	/**
	 *	El constructor
	 *
	 *	@param color uint
	 *	@param amplitude int
	 *	@param npoints int
	 **/
	function Mud( color, npoints, amplitude, frequency )
	{
		this.color = color;
		this.nPoints = npoints;
		this.amplitude = amplitude;
		this.frequency = frequency;
		this.maxPoints = 30;
		this.needDraw = false;
		this.active = true;

		var k = klr.fromHex( this.color );
		this.rgba = "rgba({red},{green},{blue}, .4)"
						.replace('{red}', k.getRed() )
						.replace('{green}', k.getGreen() )
						.replace('{blue}', k.getBlue() )



		this.shape = new createjs.Shape();
	}

	/**
	 * 	prototype
	 **/
	var p = Mud.prototype;
	
	/**
	 *	Return the display object
	 *	
	 *	@return DisplayObject
	 **/
	p.getDisplayObject = function()
	{
		return this.shape;
	}

	/**
	 *	Define the utility methods
	 *
	 *	@param utils Utils
	 **/
	p.setUtils = function( utils )
	{
		this.utils = utils;
	}

	/**
	 *	Define the size of the layer
	 *
	 *	@param width Number
	 *	@param height Number
	 *	@return Mud
	 **/
	p.setSize = function( width, height )
	{
		this.width = width;
		this.height = height;

		this.reset();
		this.compute();

		return this;
	}

	/**
	 *	Define the frequency of the mud wave
	 *
	 *	@param value Number
	 * 	@return Mud
	 **/
	p.setFrequency = function( value )
	{
		this.frequency = value;

		this.reset();
		this.compute();

		return this;
	}

	/**
	 *	Define the composite operation
	 *
	 *	@param value String
	 *	@return Mud
	 **/
	p.setComposite = function( value )
	{
		this.composite = value;
		this.shape.compositeOperation = value;

		return this;
	}

	/**
	 *	Define the n points
	 *
	 *	@param value uint
	 *	@return Mud
	 **/
	p.setNPoints = function( value )
	{
		this.nPoints = value;
		this.compute();

		return this;
	}

	/**
	 *	Activate or deactivate the mud
	 *	
	 *	@param value Boolean
	 **/
	p.setActive = function( value )
	{
		this.active = value == true;

		this.compute();
	}

	/**
	 *	Compute all the available points
	 */
	p.reset = function()
	{
		this.list = [];

		var n = this.maxPoints;
		var i = -1;
		var avg = this.width / n;
		var increase = Math.PI / this.maxPoints;
		var counter = 0;
		var x, y = 0;

		var maxx = avg * (1+this.frequency);
		var minx = avg / (1+this.frequency);

		var miny, maxy;
		var px = 0;

		while( i++ < n )
		{
			x = i * avg;
			px += this.utils.range( minx, maxx );
			px = Math.min( px, this.width );

			y = Math.sin( counter ) * this.amplitude;
			miny = y * (1+this.frequency);
			maxy = y / (1+this.frequency);
			y = this.utils.range( miny, maxy );

			counter += increase;

			p = {x:px|0, y:-y|0}
			this.list.push(p);
		}
	}

	/**
	 *	Select the points to be drawn and animate them
	 **/
	p.compute = function ()
	{
		console.log('compute');

		var old = this.points;
		this.points = [];
		var n = this.list.length-1;
		var c = this.nPoints;
		var a = n / c | 0;
		var i = -a;
		var j = -1;
		var p;
		var x = 0, y = 0;
		var index;

		while ( i < n )
		{
			i += a;
			i = Math.min( i, n );
			j++;
			
			if ( this.active )
			{
				p = this.list[i];
				x = p.x;
				y = p.y;
				p = {x:x, y:y};
				
				// 
				if ( old && old.length > j )
				{
					p.x = old[j].x;
					p.y = old[j].y;
				}
				else
				{
					p.x = this.width;
					p.y = 0;
				}
			}
			else if ( old && old.length > j )
			{
				p = {
					x:old[j].x,
					y:old[j].y
				};
			}

			TweenMax.to( p, 1, {x:x, y:y});
			this.points.push( p );
		}
	}

	/**
	 *	Draw the layer
	 *
	 *	@return Layer
	 **/
	p.draw = function()
	{
		this.shape.graphics.clear();

		// debug
		var stroke = 1;
		this.shape.graphics
					.beginStroke( this.color )
					.setStrokeStyle( stroke )
					.beginFill( this.rgba )
					.moveTo( stroke, this._height )

		var n = this.nPoints;
		var i = -1;
		var p;

		while( i++ < n )
		{
			p = this.points[i];
			this.shape.graphics
						.lineTo( p.x-stroke, p.y )
		}

		this.shape.graphics
					// .endStroke()
					.lineTo( this.width, p.y )
					.lineTo( this.width, 0 )
					.lineTo( this.width, this.height )
					.lineTo( 0, this.height )
					.endFill()
					;
		

		return this;
	}

	window.Mud = Mud;

})(window);