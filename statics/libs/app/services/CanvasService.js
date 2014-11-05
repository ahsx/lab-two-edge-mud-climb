angular
	.module(APPNAME)
	.service('CanvasService', ['Utils', function(Utils)
	{
		/**
		 *	Return the url of the image of the canvas
		 *
		 *	@return {String}
		 **/
		this.getURL = function()
		{
			return this.canvas[0].toDataURL('image/png').replace("image/png", "image/octet-stream");;
		}

		/**
		 *	Define the composite operation
		 *	
		 *	@param value String
		 **/
		this.setComposite = function( value )
		{
			if ( value == this.composite && !value )
				return;

			this.composite = value;
			var n = this.maxLayers;
			while( n-- )
			{
				this.layers[n].setComposite( value )
			}
		}

		/**
		 *	Define the number of points
		 *
		 *	@param value uint
		 **/
		this.setNPoints = function( value )
		{
			value = value|0;
			if ( value == this.npoints || value == 0 )
				return;

			this.npoints = value;
			var n = this.maxLayers;
			while( n-- )
			{
				this.layers[n].setNPoints( value )
			}	
		}

		/**
		 *	Define the number of layer
		 *
		 *	@param value uint
		 **/
		this.setNLayers = function( value )
		{
			value = value|0;
			if ( value == this.nLayers || value == 0 )
				return;

			this.nLayers = value;

			// muds
			var n = this.maxLayers;
			var avg = this.maxLayers/this.nLayers | 0;
			var avgh = (this.pixelHeight*.1*8.5) / (this.maxLayers);
			var m, s, a, h = 0;
			var i = 0, y = 0;
			while( n-- )
			{
				m = this.layers[n];
				s = m.getDisplayObject();
				a = n % avg == 0;
				if ( a ) 
					i++;

				h += avgh;

				m.setActive( a );
				y = a ? this.pixelHeight - h + Utils.range(-10, 20) : this.pixelHeight - i*10;
				TweenMax.to( s, 1, {y:y});
			}
		}

		/**
		 *	Init the canvas
		 *
		 *	@param canvas JQueryElement
		 *	@param container JQueryElement
		 *	@param value Window
		 **/
		this.init = function( canvas, container, window )
		{
			this.canvas = jQuery(canvas);
			this.context = canvas[0].getContext('2d');
			this.stage = new createjs.Stage( canvas[0] );
			createjs.Ticker.addEventListener("tick", onTickHandler.bind(this));
				
			var c = new klr( Utils.range(0, 255),Utils.range(0, 255),Utils.range(0, 255) );
			c = '#'+c.format('string');

			this.maxLayers = 30;
			this.nLayers = 6;
			this.colors = getColors( c, this.maxLayers+2 );
			this.layers = [];

			var k = klr.fromHex(this.colors[this.maxLayers-1]);
			k = k.toMonochrome();
			this.bgColor = '#'+k.getList()[1].format('string');

			this.container = container;
			this.background = null;

			this.window = jQuery(window).on('resize', onResizeHandler.bind(this));
			this.create();
			this.refresh();
		}

		/**
		 *	Refresh the value // on resize window
		 **/
		this.refresh = function()
		{
			this.windowWidth = this.window.width();
			this.windowHeight = this.window.height();
		}

		/** 
		 *	Create the objects
		 **/
		this.create = function()
		{
			// background
			this.stage.addChild( this.background = new createjs.Shape() );

			// muds
			var n = this.maxLayers;
			var m;
			var h;
			while( n-- )
			{
				m = new Mud( this.colors[n], 6, 100, .25);
				m.setUtils( Utils );

				if ( n > this.nLayers )
					m.setActive( false );

				this.stage.addChild( m.getDisplayObject() );
			
				this.layers.push( m );
			}
		}

		/**
		 *	The value have change, needs to adapt to the new values
		 *	
		 *	@param options Object
		 **/
		this.update = function( options )
		{
			this.setSize( options.stageWidth, options.stageHeight );
			this.setComposite( options.composite );
			this.setNPoints( options.nPoints );
			this.setNLayers( options.nLayers );
		}

		/**
		 *	Called every frame
		 **/
		this.draw = function()
		{
			// muds
			var n = this.maxLayers;
			while( n-- )
			{
				this.layers[n].draw();
			}

		}

		/**
		 *	Define the size of the canvas
		 *
		 *	@param width Number %
		 *	@param height Number %
		 **/	
		this.setSize = function( width, height )
		{
			if ( width == undefined || height == undefined )
				return;

			this.width = width;
			this.height = height;

			var offset = 70;
			var pw = this.windowWidth * (width*.01) - offset;
			var ph = this.windowHeight * (height*.01);
			
			if ( pw == this.pixelWidth && ph == this.pixelHeight )
				return;

			this.pixelWidth = pw;
			this.pixelHeight = ph;

			console.group('CanvasService::SetSize');
			console.log('% 	- %s 	x 	%s', width, height);
			console.log('px 	- %s 	x 	%s', this.pixelWidth, this.pixelHeight);
			console.groupEnd();

			this.container.css({
				width: "calc("+width+"% - 70px)",
				height: height +'%'
			})

			this.canvas.attr({
				width: this.pixelWidth,
				height: this.pixelHeight
			});

			// muds
			var n = this.maxLayers;
			var s;
			var m;
			var avgh = (this.pixelHeight*.1*8.5) / (this.maxLayers);
			var h = 0;
			var y = 0;
			while( n-- )
			{
				m = this.layers[n];
				s = m.getDisplayObject();
				h += avgh;

				m.setSize( this.pixelWidth, h );
				s.y = this.pixelHeight - h + Utils.range(-10, 20);
			}

			// bg
			this.background.graphics
								.clear()
								.beginFill( this.bgColor )
								.drawRect( 0, 0, this.pixelWidth, this.pixelHeight )
								.endFill();
		}

		
		/**
		 *	Return a color list based on a color
		 *
		 *	@param color String
		 *	@param qty uint
		 **/
		function getColors( color, qty )
		{
			var k = klr.fromHex(color);
			var l = k.toLight(qty);
			l.sortBySaturation();
			l = l.getList();
			var ret = [];
			var n = l.length-1;
			var i = -1;
			while( n-- )
			{
				k = l[n];
				ret.push( '#'+k.format('string') );
			}

			return ret;
		}

		/**
		 *	Resize handler
		 *
		 *	@param event
		 **/
		function onResizeHandler(event)
		{
			this.refresh();
			this.width !== null && this.setSize( this.width, this.height );
		}

		/**
		 *	Tick handler
		 *	
		 *	@param event TickEvent
		 **/
		function onTickHandler(event)
		{
			this.draw();
			this.stage.update();
		}
	}]);