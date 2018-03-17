
;(function( $, window, document ) {
	
	function getImageRatio( node ) {
		if( node && 'img' == node.tagName.toLowerCase() ) {
			if( 'naturalWidth' in node && 'naturalHeight' in node ) {
				return node.naturalWidth / node.naturalHeight;
			}

			var img = new Image();
			img.src = node.src;

			return img.width / img.height;
		}
	}

	/* ==========================================================================
		Justified Image Grids. Thanks to Terry Mun
		https://medium.com/coding-design/7742e6f93d9e
	============================================================================= */
	(function() {
		var JustifiedGrids = function( element, options ) {
			this.element = $( element );
			return this.init( options );
		}, instanceId = 0;

		JustifiedGrids.prototype = {
			defaults: {
				selector: 'li', 
				minRowHeight: 240, 
				margin: 0, 
				justifyLastRow: true, 
				mainClass: 'justified-grids', 
				lastColumnClass: 'last-col', 
				lastRowClass: 'last-row'
			}, 

			imageData: [], 

			init: function( options ) {
				var t = this, img, ratio;

				t.eventNamespace = '.justified' + ( instanceId++ );

				t.options = $.extend( true, {}, t.defaults, options );

				t.items = t.element
					.addClass( t.options.mainClass )
					.children( t.options.selector )
					.css({
						marginTop: t.options.margin, 
						marginLeft: t.options.margin
					});

				// Image data are stored in an array with the index referencing the item index
				t.imageData = t.items.map(function() {
					img = $( this ).find( 'img' );

					if( ! img || ! img.length || ! ( ratio = getImageRatio( img[0] ) ) ) {
						return 0;
					}

					return {
						el: img[0], 
						ratio: ratio, 
						calculatedWidth: ratio * t.options.minRowHeight
					};
				});

				$( window ).on( 'resize' + t.eventNamespace + ' orientationchange' + t.eventNamespace, function() {
					if( t.resizeTimeout ) {
						clearTimeout( t.resizeTimeout );
					}
					t.resizeTimeout = setTimeout(function() {
						t.refresh();
					}, 50 );
				});
				t.refresh();
			}, 

			destroy: function() {
				this.element.removeClass( this.options.mainClass );
				this.items
					.css({ marginTop: '', marginLeft: '' })
					.removeClass( [this.options.lastRowClass, this.options.lastColumnClass].join( ' ' ) )

				$.each( this.imageData, function() { this.el.style.width = ''; this.el.style.height = ''; });

				if( this.resizeTimeout ) clearTimeout( this.resizeTimeout );
				$( window ).off( this.eventNamespace );
			}, 

			refresh: function() {
				var t = this, 
					imgData, 
					rowWidth = this.element.width(), 
					filledRowWidth = 0, 
					currentRow = [], 
					sumRatios = 0;

				t.items
					.removeClass( [t.options.lastRowClass, t.options.lastColumnClass].join( ' ' ) )
					.each(function( index ) {
						if( imgData = t.imageData[ index ] ) {

							// The row is full, generate the row and move the current item to the next row
							if( filledRowWidth + t.options.margin + imgData.calculatedWidth > rowWidth ) {
								t._processRow( currentRow, rowWidth, sumRatios );

								currentRow = [];
								filledRowWidth = 0;
								sumRatios = 0;
							}

							// Keep filling the row
							currentRow.push( imgData );

							// Push the current ratio
							sumRatios += imgData.ratio;

							// Accumulate the filled row width
							filledRowWidth += t.options.margin + imgData.calculatedWidth;
						}
					});

				// If we're reaching the end and we have items left
				if( currentRow.length ) {
					this._processRow( currentRow, this.options.justifyLastRow ? rowWidth : rowWidth - filledRowWidth, sumRatios, true );
				}
			}, 

			_processRow: function( row, rowWidth, sumRatios, isLastRow ) {
				if( ! row || ! row.length ) {
					return;
				}

				var t = this;
				height = ( rowWidth - ( row.length + 1 ) * t.options.margin ) / sumRatios;

				// Process the row
				$( row ).each(function() {
					$( this.el ).css({
						width: height * this.ratio, 
						height: height
					})

					if( isLastRow ) {
						$( this.el )
							.closest( t.options.selector )
							.addClass( t.options.lastRowClass );
					}
				});

				$( row.pop().el )
					.closest( t.options.selector )
					.addClass( t.options.lastColumnClass );
			}
		};

		$.fn.justifiedGrids = function( options ) {
			return this.each(function() {
				var data = $.data( this, 'justifiedGrids' ), 
					opts = typeof options == 'object' && options;

				if( ! data ) {
					$.data( this, 'justifiedGrids', ( data = new JustifiedGrids( this, opts ) ) );
					parallaxInstances.push( data );
				}
				if( typeof options == 'string' ) data[options]();
			});
		}
	})();
	
	/* ==========================================================================
		Youxi Animate
	============================================================================= */
	(function() {
		var validAnimationNames = [
			'flipInX', 
			'flipInY',
			'fadeInUp', 
			'fadeInDown', 
			'fadeInLeft', 
			'fadeInRight', 
			'fadeInUpBig', 
			'fadeInDownBig', 
			'fadeInLeftBig', 
			'fadeInRightBig', 
			'slideInDown', 
			'slideInLeft', 
			'slideInRight', 
			'bounceIn', 
			'bounceInUp', 
			'bounceInDown', 
			'bounceInLeft', 
			'bounceInRight', 
			'rotateIn', 
			'rotateInUpLeft', 
			'rotateInDownLeft', 
			'rotateInUpRight', 
			'rotateInDownRight'
		];

		var YouxiAnimate = function( element, options ) {
			this.element = $( element );
			return this.init( options );
		};

		YouxiAnimate.prototype = {
			defaults: {
				waypointOffset: '75%', 
				animationName: 'fadeIn', 
				animationDuration: 800, 
				animationChainDuration: 800, // only used when animationChainDelay is 'distribute'
				animationChainDelay: 'distribute' // 'distribute' or a fixed number
			}, 

			init: function( options ) {
				this.options = $.extend( true, {}, this.defaults, options );
				this.targets = this.element.find( '[data-animation-name]' );

				if( this.targets && this.targets.length ) {
					this.targets
						.css( 'visibility', 'hidden' )
						.on( 'webkitAnimationEnd oanimationend msAnimationEnd animationend', this._onAnimationEnd );

					if( $.fn.waypoint ) {
						this.element.waypoint( $.proxy( this._waypointCallback, this ), { offset: this.options.waypointOffset, triggerOnce: true } );
					}
				}
			}, 

			_onAnimationEnd: function() {
				$( this ).css({ 'visibility': '', 'animation': '' });
			}, 

			_waypointCallback: function() {
				var t = this, 
					delay = 'distribute' == t.options.animationChainDelay ? 
						Math.ceil( t.options.animationChainDuration / t.targets.length ) : 
						t.options.animationChainDelay;
				
				t.targets.each(function( index ) {
					var elOpts = $( this ).data(), 
						animDelay = elOpts.animationDelay || ( index * delay ), 
						animDuration = elOpts.animationDuration || t.options.animationDuration, 
						animName = ( validAnimationNames.indexOf( elOpts.animationName ) < 0 ? t.options : elOpts ).animationName;

					$( this )
						.css({
							'visibility': '', 
							'animation-name': animName, 
							'animation-delay': animDelay + 'ms', 
							'animation-duration': animDuration + 'ms', 
							'animation-fill-mode': 'both'
						});
				});
			}
		};

		$.fn.youxiAnimate = function( options ) {
			return this.each(function() {
				new YouxiAnimate( this, $.extend( true, options, $( this ).data() ) );
			});
		};
	})();

}) ( jQuery, window, document );