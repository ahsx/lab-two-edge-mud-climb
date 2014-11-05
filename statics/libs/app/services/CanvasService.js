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
			var n = this.nColors;
			while( n-- )
			{
				this.list[n].setComposite( value )
			}
		}

		/**
		 *	Define the number of points
		 *
		 *	@param value Number
		 **/
		this.setNPoints = function( value )
		{
			value = value|0;
			if ( value == this.npoints || value == 0 )
				return;

			this.npoints = value;
			var n = this.nColors;
			while( n-- )
			{
				this.list[n].setNPoints( value )
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
			// createjs.Ticker.useRAF = true;
			// createjs.Ticker.setFPS(60);

			// this.colors = ['#FDF2E0', '#F0C7B3', '#DA9681', '#765047', '#423837'];
			// this.colors = ['#423837', '#765047', '#DA9681', '#F0C7B3', '#FDF2E0'];
			
			this.colors = getColors('#F0C7B3', 3);
			this.list = [];
			this.nColors = this.colors.length;

			var k = klr.fromHex(this.colors[this.nColors-1]);
			k.setBrightness(250);
			k.setSaturation(10);
			this.bgColor = '#'+k.format('string');

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
			var n = this.nColors;
			var m;
			var h;
			while( n-- )
			{
				m = new Mud( this.colors[n], 6, 100, .25);
				m.setUtils( Utils );
				this.stage.addChild( m.getDisplayObject() );
			
				this.list.push( m );
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
			this.setNPoints( options.npoints );
		}

		/**
		 *	Called every frame
		 **/
		this.draw = function()
		{
			// muds
			var n = this.nColors;
			while( n-- )
			{
				this.list[n].draw();
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

			if ( width == this.width && height == this.height )
				return;

			this.width = width;
			this.height = height;

			var offset = 70;
			this.pixelWidth = this.windowWidth * (width*.01) - offset;
			this.pixelHeight = this.windowHeight * (height*.01);

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
			var n = this.nColors;
			var s;
			var m;
			var avgh = (this.pixelHeight*.3*2) / (this.nColors);
			var h = 0;
			var y = 0;
			while( n-- )
			{
				m = this.list[n];
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
			while( i++ < n )
			{
				k = l[i];
				ret.push( '#'+k.format('string') );
			}

			console.log(ret);
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