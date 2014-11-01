angular
	.module(APPNAME)
	.service('CanvasService', [function()
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
			createjs.Ticker.addEventListener("tick", this.stage);

			this.container = container;

			this.window = jQuery(window).on('resize', onResizeHandler.bind(this));
			this.refresh();
			this.create();
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
			var r  = new createjs.Shape();
			r.graphics.beginFill( '#0f0' );
			r.graphics.rect( 0, 0, 100, 100 );
			r.graphics.endFill();

			this.stage.addChild(r);
		}

		/**
		 *	The value have change, needs to adapt to the new values
		 *	
		 *	@param options Object
		 **/
		this.update = function( options )
		{
			this.setSize( options.stageWidth, options.stageHeight );
		}

		/**
		 *	Define the size of the canvas
		 *
		 *	@param width Number %
		 *	@param height Number %
		 **/	
		this.setSize = function( width, height )
		{
			console.log('size %sx%s', width, height);

			this.width = width;
			this.height = height;

			var offset = 70;
			var pixelWidth = this.windowWidth * (width*.01) - offset;
			var pixelHeight = this.windowHeight * (height*.01);

			this.container.css({
				width: "calc("+width+"% - 70px)",
				height: height +'%'
			})

			this.canvas.attr({
				width: pixelWidth,
				height: pixelHeight
			});
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

	}]);