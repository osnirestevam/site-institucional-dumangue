
;(function( $, window, document ) {

	"use strict";

	var 

	_doc = $( document ), 
	
	_win = $( window ), 

	Hydrogen = {

		isHandheld: (function(a){return /(android|bb\d+|meego).+mobile|android|ipad|playbook|silk|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));})(navigator.userAgent||navigator.vendor||window.opera), 

		cssTransitions: (function(a,b){a=(new Image).style;b='ransition';return't'+b in a||'webkitT'+b in a||'MozT'+b in a})(), 

		cssAnimations: (function(a,b){a=(new Image).style;b='nimationName';return'a'+b in a||'webkitA'+b in a||'MozA'+b in a})(), 

		resizeCallbacks: [], 

		Project: {
			popupControls: $('<div class="project-controls"><ul><li><button class="mfp-prevent-close" data-action="prev"><i class="mfp-prevent-close fa fa-arrow-left"></i></button></li><li><button data-action="close"><i class="fa fa-times"></i></button></li><li><button class="mfp-prevent-close" data-action="next"><i class="mfp-prevent-close fa fa-arrow-right"></i></button></li></ul></div>'), 

			init: function() {
				var _t = this;

				$( '.projects' ).each(function() {
					$( '.items', this ).imagesLoaded(function() {
						$( this ).isotope({
							masonry: {
								columnSize: '.grid-sizer', 
								gutter: '.gutter-sizer'
							}, 
							itemSelector: '.project', 
							transitionDuration: '0.5s'
						})
						.closest( '.projects' )
							.addClass( 'loaded' );
					});
				});

				_doc.on( 'click', '.projects .filter a[data-filter]', function( e ) {

					$( this )
						.closest( 'li' )
							.siblings()
							.removeClass( 'active' )
							.end()
						.addClass( 'active' )
						.closest( '.projects' )
							.find( '.items' )
							.isotope({ filter: $( this ).data( 'filter' ) })
							.end().end()
						.closest( '.filter' )
							.find( '.active-label' )
							.html( this.innerHTML );
					e.preventDefault();

				}).on( 'click', '.projects .mfp-details a,.royalSlider .project-slide .mfp-details a', function( e ) {

					var currentProject = $( this ).closest( '.project,.project-slide' ), 
						projectCollection = $( this ).closest( '.items,.royalSlider' ).find( '.project,.project-slide' ), 
						projectIndex = projectCollection.index( currentProject );

					_t.openProjectPopup( _t.getProjectUrls( projectCollection ), projectIndex );
					e.preventDefault();

				});
			}, 

			openProjectPopup: function( urls, index ) {
				
				if( urls && urls.length && $.magnificPopup ) {

					var _t = this;

					if( $.fn.mfpFastClick && ! _t.fastClickInitialized && $.magnificPopup.instance ) {

						_t.fastClickInitialized = true;
						_t.popupControls.find( 'button' ).each(function() {
							var callback = $.magnificPopup.instance[ $( this ).data( 'action' ) ];
							( 'function' == typeof callback ) && $( this ).mfpFastClick( callback );
						});

					}

					$.magnificPopup.open({
						items: urls, 
						type: 'ajax', 
						gallery: {
							enabled: true, 
							arrows: false
						}, 
						ajax: {
							settings: {
								cache: false
							}
						}, 
						alignTop: true, 
						showCloseBtn: false, 
						mainClass: 'project-details-popup', 
						callbacks: {
							open: function() {
								_doc.off( 'keydown.mfp-gallery' );
							}, 
							parseAjax: function( response ) {
								var projectData = $( response.data ).find( '.section.project-details' ).first();
								if( projectData.length ) {
									projectData.find( '.project-title' ).before( _t.popupControls );
									response.data = projectData;
								} else {
									response.data = '';
								}
							}, 
							ajaxContentAdded: _t.initPopup, 
							beforeChange: _t.teardownPopup, 
							beforeClose: _t.teardownPopup
						}
					}, Math.max( 0, index ) );
				}
			}, 

			getProjectUrls: function( projects ) {
				return projects.find( '.mfp-details a' ).map(function() {
					var href = $( this ).attr( 'href' );
					if( href != '' && href != '#' ) {
						return {
							type: 'ajax', 
							src: href
						};
					}
				}).get();
			}, 

			initPopup: function() {
				if( this.content ) {
					Hydrogen.setup( this.content );
				}
			}, 

			teardownPopup: function() {
				if( this.content ) {
					Hydrogen.teardown( this.content );
					Hydrogen.Project.popupControls.detach();
				}
			}
		}, 

		init: function() {
			
			/* ==========================================================================
				Add Mobile Device class
			============================================================================= */
			( ! Hydrogen.isHandheld ) && $( 'html' ).addClass( 'desktop' );

			/* ==========================================================================
				Setup Listeners
			============================================================================= */
			Hydrogen.setupListeners();

			/* ==========================================================================
				Wait for Document.Ready
			============================================================================= */
			$( Hydrogen.ready );

		}, 

		ready: function() {

			/* ==========================================================================
				Add transition class
			============================================================================= */
			if( Hydrogen.cssTransitions ) {
				$( 'html' ).addClass( 'csstransitions' );
			}

			/* ==========================================================================
				Header
			============================================================================= */
			if( $.fn.affix ) {
				$( '.site-header' ).each(function() {
					var header = $( this );
					header.find( '.header-inner' ).affix({
						offset: {
							top: function() {
								return $( '.site-body' ).offset().top - header.outerHeight() - 1;
							}
						}
					});
				});
			}
			
			/* ==========================================================================
				Navigation
			============================================================================= */
			_doc.on( 'click', '.main-nav .nav-toggle', function(e) {
				$( this ).siblings( 'ul.nav' ).slideToggle();
				e.preventDefault();
			}).on( 'click', '.main-nav .sub-toggle', function(e) {
				if( e.target == this ) {
					$( this ).toggleClass( 'open' ).closest( 'li' ).find( '>ul' ).slideToggle();
					e.stopPropagation();
					e.preventDefault();
				}
			});

			Hydrogen.resizeCallbacks.push({
				callback: function() {
					$( '.main-nav ul' ).css( 'display', '' );
					$( '.main-nav .sub-toggle' ).removeClass( 'open' );
				}
			});

			/* ==========================================================================
				ScrollSpy
			============================================================================= */
			if( $.fn.scrollspy ) {
				$( document.body ).scrollspy({
					target: '.main-nav', 
					offset: $( '.site-header' ).outerHeight() + 1
				});
			}

			/* ==========================================================================
				Splash Text Slider
			============================================================================= */
			if( $.fn.cycle ) {
				$( '.splash-slider' ).on( 'cycle-initialized', function() {
					$( this ).addClass( 'active' );
				}).cycle({
					fx: ( Hydrogen.isHandheld || ! Hydrogen.cssTransitions ) ? 'fade' : 'none', 
					log: false, 
					slides: '>.splash-content', 
					pauseOnHover: '.splash-text'
				});
			}

			/* ==========================================================================
				Smooth Scrolling
			============================================================================= */
			_doc.on( 'click', '.main-nav ul a[href^="#"],.splash-text .splash-intro a[href^="#"]', function(e) {
				var href = $( this ).attr( 'href' ), 
					target = ( '#' == href ) ? 0 : document.getElementById( href.split(/#/).pop() );

				if( null !== target ) {
					target = ( 0 == target ) ? 0 : $( target ).offset().top - $( '.site-header' ).outerHeight() + 1;
					$( 'html, body' ).stop().animate({ scrollTop: target }, Hydrogen.isHandheld ? 0 : 750 );
					e.preventDefault();
				}
			});

			/* ==========================================================================
				Media Elements
			============================================================================= */
			if( $.fn.mediaelementplayer ) {

				if( ! Hydrogen.isHandheld && !! _doc[0].createElement( 'video' ).canPlayType ) {

					(function() {
						var mejsSetPlayerSize = mejs.MediaElementPlayer.prototype.setPlayerSize;
						mejs.MediaElementPlayer.prototype.setPlayerSize = function( width, height ) {
							var t = this, 
								videoWrap = t.container.closest( '.aligned-video-wrapper' ), 
								wrapContainer = videoWrap.parent();

							if( t.isVideo && videoWrap.length && wrapContainer.length ) {

								var nativeWidth = (t.media.videoWidth && t.media.videoWidth > 0) ? t.media.videoWidth : t.options.defaultVideoWidth, 
									nativeHeight = (t.media.videoHeight && t.media.videoHeight > 0) ? t.media.videoHeight : t.options.defaultVideoHeight, 
									nativeRatio = nativeWidth / nativeHeight, 
									videoWrapWidth = wrapContainer.outerWidth(), 
									videoWrapHeight = wrapContainer.outerHeight(), 
									css = { 'width': '100%', 'height': '100%', 'marginTop': 'auto', 'marginLeft': 'auto' };

								if( nativeRatio > videoWrapWidth / videoWrapHeight ) {
									css.width = Math.round( nativeRatio * videoWrapHeight );
									css.marginLeft = ( videoWrapWidth - css.width ) / 2;
								} else {
									css.height = Math.round( videoWrapWidth / nativeRatio );
									css.marginTop = ( videoWrapHeight - css.height ) / 2;
								}

								videoWrap.css( css );
							}

							mejsSetPlayerSize.apply( t, arguments );
						}

						$( 'video', '.splash-media-video,.section-media-video' )
						.wrap( '<div class="aligned-video-wrapper"></div>' )
							.mediaelementplayer({
								defaultVideoWidth: 1920, 
								defaultVideoHeight: 1080, 
								enableKeyboard: false, 
								features: [], 
								pauseOtherPlayers: false, 
								canBePausedByOtherPlayers: false, 
								success: function( media ) {
									media.addEventListener( 'playing', function() {
										media.setMuted( true );
									}, false);
								}
							});
					})();

				} else {
					$( 'video', '.splash-media-video,.section-media-video' ).remove();
				}

				$( 'audio,video', '.media' ).mediaelementplayer({
					audioWidth: '100%', 
					defaultVideoWidth: 1920, 
					defaultVideoHeight: 1080, 
					enableKeyboard: false
				});

			}

			/* ==========================================================================
				Parallax Sections
			============================================================================= */
			if( $.fn.parallax ) {
				$( '[data-background]' ).each(function() {
					$( this ).parallax( $.extend( true, {
						lazyLoad: true, 
						mode: Hydrogen.isHandheld ? 'none' : 'parallax', 
						activeClass: 'has-bg', 
						fixedBgClass: 'bg-fixed', 
						parallaxClass: 'bg-fixed', 
						speedFactor: 0.3
					}, $( this ).data() ) );
				});
			}

			/* ==========================================================================
				Touch Events
			============================================================================= */
			$( document ).on( 'touchstart', function(e) {
				$( '.touch' ).removeClass( 'touch' );
			}).on( 'touchstart', '.icon-box,.team,.media,.recent-post-body,.slider-media,.project-image', function(e) {
				$( '.touch' ).not( this ).removeClass( 'touch' );
				$( this ).toggleClass( 'touch' );
				e.stopPropagation();
			});

			/* ==========================================================================
				Counter Animation
			============================================================================= */
			if( 'function' == typeof countUp ) {
				$( '.counter' ).each(function() {
					var el = $( this ).find( '.number' ), 
						counter, countTo = parseInt( el.text(), 10 );

					if( el.length && $.isNumeric( countTo ) ) {
						el.html( 0 );
						counter = new countUp( el[0], 0, countTo, 0, 2 );
						el.waypoint(function() { counter.start(function() { counter = null; }); }, { offset: '75%', triggerOnce: true });
					}
				});
			}

			/* ==========================================================================
				Magnific Popup
			============================================================================= */
			if( $.fn.magnificPopup ) {
				$.each({
					'.media .mfp-zoom a': false, 
					'.royalSlider': '.slider-media .mfp-zoom a', 
					'.projects .items': '.mfp-zoom a'
				}, function( selector, delegate ) {
					$( selector ).each(function() {
						$( this ).magnificPopup({
							delegate: delegate, 
							type: 'image', 
							gallery: delegate ? { enabled: true } : false
						});
					});
				});
			}

			/* ==========================================================================
				Team Popup
			============================================================================= */
			if( $.fn.magnificPopup ) {

				var tpl = new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"row\"><div class=\"col-md-12\"><h2 class=\"team-name\">");_.b(_.v(_.f("name",c,p,0)));if(_.s(_.f("role",c,p,1),c,p,0,79,102,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<small>");_.b(_.v(_.f("role",c,p,0)));_.b("</small>");});c.pop();}_.b("</h2></div></div><div class=\"row\">");if(_.s(_.f("photo",c,p,1),c,p,0,155,305,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("<div class=\"col-md-4 col-md-push-8\"><figure class=\"team-photo\"><img src=\"");_.b(_.v(_.f("photo",c,p,0)));_.b("\" alt=\"");_.b(_.v(_.f("name",c,p,0)));_.b("\"></figure></div><div class=\"col-md-8 col-md-pull-4\">");});c.pop();}if(!_.s(_.f("photo",c,p,1),c,p,1,0,0,"")){_.b("<div class=\"col-md-12\">");};_.b("<div class=\"team-content\">");_.b(_.t(_.f("content",c,p,0)));_.b("</div></div></div>");return _.fl();;});

				_doc.on( 'click', '.team .team-photo a', function( e ) {

					var el = $( this ), 
						team = el.closest( '.team' ), 
						teamContainer = team.closest( '.section-row' ), 
						teamCollection = teamContainer.find( '.team' ), 
						teamIndex = teamCollection.index( team ), 
						teamData = $.data( teamContainer[0], 'team-data' );

					if( ! teamData ) {
						teamData = teamCollection.map(function() {
							var data = $( this ).find( '.team-data' );
							if( data.length ) {
								return $.extend( true, {}, data.data(), { content: data.html() } );
							}
						}).get();

						$.data( teamContainer[0], 'team-data', teamData );
					}

					$.magnificPopup.open({
						items: teamData, 
						type: 'inline', 
						gallery: {
							enabled: true
						}, 
						inline: { markup: '<div class="team-popup"><div class="container"><div class="row"><div class="col-md-12"><div class="mfp-close"></div><div class="team-popup-content"></div></div></div></div></div>' }, 
						mainClass: 'team-popup-container', 
						callbacks: {
							markupParse: function( template, values, item ) {
								template.find( '.team-popup-content' ).empty().html( tpl.render( values ) );
							}
						}
					}, teamIndex > 0 ? teamIndex : 0 );

					e.preventDefault();
				});
			}

			/* ==========================================================================
				Twitter Feed
			============================================================================= */
			(function() {
				if( $.fn.tweet ) {

					var selectors = {
						'.tweet-slider': {
							template: '<div class="tweet">{text}{time}<a class="tweet_user" href="{user_url}">@{screen_name}</a></div>', 
							callback: function() {
								$( this ).find( '.tweet_list' ).addClass( 'owl-carousel' ).owlCarousel({
									singleItem: true, 
									autoHeight: true, 
									theme: 'hydrogen-theme', 
									navigationText: false
								});
							}
						}, 
						'.tweet-list': {
							template: '<div class="tweet-list-item">{text}{time}</div>'
						}
					};

					$.each( selectors, function( selector, options ) {

						$( selector ).each(function() {

							var username = $( this ).data( 'username' ), 
								count = $( this ).data( 'count' ) || 1, 
								loadingText = $( this ).data( 'loading-text' ) || 'Loading Tweets...';

							if( username ) {
								$( this ).tweet({
									modpath: 'php/twitter/index.php', 
									username: username, 
									template: options.template || '', 
									count: count, 
									loading_text: loadingText
								}, options.callback );
							}
						});
					});

				}
			})();

			/* ==========================================================================
				Progressbar
			============================================================================= */
			if( $.fn.waypoint ) {
				$( '.progress' ).waypoint(function( direction ) {
					var value = $( this ).data( 'value' ) || 100;
					$( this ).find( '.progress-bar' ).css({ 'width': value + '%' });
				}, {
					triggerOnce: true, 
					offset: function() {
						return $.waypoints( 'viewportHeight' ) - 1;
					}
				});
			}

			/* ==========================================================================
				Placeholder
			============================================================================= */
			$.fn.placeholder && $( '[placeholder]' ).placeholder();

			/* ==========================================================================
				Contact Form
			============================================================================= */
			if( $.validator && $.fn.ajaxSubmit ) {

				(function() {
					var formSelector = '.form-group,[class*="col-xs-"],[class*="col-sm-"],[class*="col-md-"],[class*="col-lg-"]';

					// override jquery validate plugin defaults
					$.validator.setDefaults({
						highlight: function( el ) {
							$( el ).closest( formSelector ).addClass( 'has-error' );
						},
						unhighlight: function( el ) {
							$( el ).closest( formSelector ).removeClass( 'has-error' );
						},
						errorElement: 'span',
						errorClass: 'help-block',
						errorPlacement: function( error, el ) {
							error.insertAfter( el );
						}
					});

					$( '.contact-form' ).each(function() {
						$( this ).validate({
							submitHandler: function( form ) {
								$( form ).ajaxSubmit(function( response ) {
									response = $.parseJSON( response );
									$( _doc[0].createElement( 'div' ) )
										.addClass( 'alert' )
										.toggleClass( 'alert-danger', ! response.success )
										.toggleClass( 'alert-success', response.success )
										.html( response.message )
										.prepend( '<button type="button" class="close" data-dismiss="alert">&times;</button>' )
										.hide().prependTo( form ).slideDown();

									if( response.success ) {
										$( form ).resetForm();
									}
								});
							}
						});
					});
				})();

			}

			/* ==========================================================================
				Waypoints Entry Animation
			============================================================================= */
			if( ! Hydrogen.isHandheld && Hydrogen.cssAnimations && $.fn.youxiAnimate ) {
				$( '.section-row .row' ).filter(function() {
					// Prevent nested row animations
					return $( this ).parents( '.row' ).length == 0;
				}).youxiAnimate();
			}

			/* ==========================================================================
				Initialize Projects
			============================================================================= */
			Hydrogen.Project.init();

			/* ==========================================================================
				Contextual Setups
			============================================================================= */
			Hydrogen.setup();

			/* ==========================================================================
				Fire initial window resize callbacks
			============================================================================= */
			_win.triggerHandler( 'resize' );

		}, 

		setupListeners: function() {

			/* ==========================================================================
				Monitor Document Height Changes
			============================================================================= */
			(function( callback ) {
				var db = document.body, 
					dd = document.documentElement, 
					docHeight = Math.max(
						db.scrollHeight, dd.scrollHeight,
						db.offsetHeight, dd.offsetHeight,
						db.clientHeight, dd.clientHeight
					);

				function domChangeListener() {
					var currDocHeight = Math.max(
						db.scrollHeight, dd.scrollHeight,
						db.offsetHeight, dd.offsetHeight,
						db.clientHeight, dd.clientHeight
					);

					if( currDocHeight != docHeight ) {
						docHeight = currDocHeight;
						callback();
					}
					setTimeout( domChangeListener, 1000 );
				}

				domChangeListener();
			})( Hydrogen.onDocHeightChange );

			/* ==========================================================================
				Window.Resize
			============================================================================= */
			var resizeTimer, n;
			_win.on( 'resize orientationchange', function() {
				if( resizeTimer ) clearTimeout( resizeTimer );
				resizeTimer = setTimeout(function() {
					for( n = 0; n < Hydrogen.resizeCallbacks.length; n++ ) {
						var cb = Hydrogen.resizeCallbacks[n];
						'function' == typeof cb.callback && cb.callback.apply( cb.context || window );
					}
				}, 50);
			});
		}, 

		setup: function( context ) {
			context = $( context );

			if( ! context.length )
				context = $( document.body );

			/* ==========================================================================
				Tooltips
			============================================================================= */
			if( $.fn.tooltip ) {
				context.find( '[rel="tooltip"]' ).tooltip();
			}

			/* ==========================================================================
				Carousels
			============================================================================= */
			if( $.fn.owlCarousel ) {
				context.find( '.owl-carousel' ).each(function() {
					$( this ).owlCarousel( $.extend( true, {}, {
						items: 3, 
						itemsDesktop: [1199,3], 
						itemsDesktopSmall: [991,2], 
						itemsTablet: [767,1], 
						itemsMobile: false, 
						itemsScaleUp: true, 
						theme: 'hydrogen-theme', 
						navigationText: false, 
						paginationNumbers: false, 
						afterUpdate: function( el ) {
							el.find( '.royalSlider' ).each(function() {
								var api = $( this ).data( 'royalSlider' );
								api && api.updateSliderSize();
							});
						}
					}, $( this ).data() ));
				});
			}

			/* ==========================================================================
				Royal Slider
			============================================================================= */
			if( $.fn.royalSlider ) {
				var options = {
					'.iphone-slider .royalSlider': {
						options: {
							controlNavigation: 'none', 
							imageScaleMode: 'fill'
						}
					}, 
					'.ipad-slider .royalSlider': {
						options: {
							controlNavigation: 'none', 
							imageScaleMode: 'fill'
						}
					}, 
					'.macbook-slider .royalSlider': {
						options: {
							controlNavigation: 'none', 
							imageScaleMode: 'fill'
						}
					}, 
					'.standard-slider .royalSlider': {
						options: {
							controlNavigation: 'none', 
							imageScaleMode: 'fill'
						}
					}, 
					'.recent-post-slider .royalSlider': {
						options: {
							navigateByClick: false, 
							sliderDrag: false, 
							sliderTouch: false, 
							controlNavigation: 'none', 
							imageScaleMode: 'fill'
						}
					}, 
					'.nearby-slider .royalSlider': {
						options: {
							keyboardNavEnabled: true, 
							imageScaleMode: 'fill', 
							visibleNearby: {
								enabled: true, 
								centerArea: 0.5, 
								center: true, 
								breakpoint: 992, 
								breakpointCenterArea: 0.7, 
								navigateByCenterClick: true
							}
						}
					}
				}, 
				royalSliders = context.find( '.royalSlider' );

				$.each( options, function( filter, opt ) {
					royalSliders = royalSliders
						.filter( filter )
							.each(function() {
								if( 'function' == typeof opt.beforeInit ) {
									opt.beforeInit.apply( this );
								}
								$( this ).royalSlider( $.extend( true, opt.options, $( this ).data(), {
									addActiveClass: true, 
									imageScalePadding: 0, 
									slidesSpacing: 0, 
									fadeinLoadedSlide: false
								}));
								if( 'function' == typeof opt.afterInit ) {
									opt.afterInit.apply( this );
								}
							})
							.end()
						.not( filter );
				});

				royalSliders.each(function() {
					$( this ).royalSlider( $( this ).data() );
				});
			}

			/* ==========================================================================
				Justified Grids Photoset
			============================================================================= */
			if( $.fn.justifiedGrids ) {
				context.find( '.photoset' ).each(function() {
					$( this ).imagesLoaded(function() {
						$( this ).addClass( 'loaded' ).justifiedGrids({
							selector: '.photo', 
							margin: 10, 
							minRowHeight: 240
						});
					});
				});
			}

			/* ==========================================================================
				FitVids
			============================================================================= */
			if( $.fn.fitVids ) {
				context.find( '.media' ).fitVids();
			}

		}, 

		teardown: function( context ) {
			context = $( context );

			if( ! context.length )
				context = $( document.body );

			/* ==========================================================================
				Tooltips
			============================================================================= */
			if( $.fn.tooltip ) {
				context.find( '[rel="tooltip"]' ).tooltip( 'destroy' );
			}
						
			/* ==========================================================================
				Owl Carousel
			============================================================================= */
			if( $.fn.owlCarousel ) {
				context.find( '.owl-carousel' ).each(function() {
					var api = $( this ).data( 'owlCarousel' );
					api && api.destroy();
				});
			}

			/* ==========================================================================
				Royal Slider
			============================================================================= */
			if( $.fn.royalSlider ) {
				context.find( '.royalSlider' ).each(function() {
					var api = $( this ).data( 'royalSlider' );
					api && api.destroy();
				});
			}

			/* ==========================================================================
				Justified Grids Photoset
			============================================================================= */
			if( $.fn.justifiedGrids ) {
				context.find( '.photoset' ).justifiedGrids( 'destroy' );
			}

		}, 

		windowLoad: function() {
			/* ==========================================================================
				Remove Site Loader
			============================================================================= */
			$( '.site-loader' ).remove();

			/* ==========================================================================
				Flickr Widget
			============================================================================= */
			if( $.fn.jflickrfeed ) {
				$( '.flickr-stream' ).each(function() {
					var flickrId = $( this ).data( 'flickr-id' ), 
						limit = $( this ).data( 'limit' ) || 9;
					$( _doc[0].createElement( 'ul' ) )
						.prependTo( this ).jflickrfeed({
							qstrings: {
								id: flickrId
							}, 
							limit: limit, 
							itemTemplate: '<li><a href="{{link}}" title="{{title}}" target="_blank"><img src="{{image_s}}" alt="{{title}}"></a></li>'
						});
				});
			}

			/* ==========================================================================
				Google Maps
			============================================================================= */
			if( $.fn.youxiGoogleMaps ) {
				$( '.google-maps' ).youxiGoogleMaps();
			}
		}, 

		onDocHeightChange: function() {
			if( $.fn.scrollspy ) {
				$( document.body ).scrollspy( 'refresh' );
			}

			if( $.waypoints ) {
				$.waypoints( 'refresh' );
			}

			if( $.fn.parallax ) {
				$( '[data-background]' ).parallax( 'refresh' );
			}
		}
	};

	Hydrogen.init();

	/* ==========================================================================
		Window.Load
	============================================================================= */
	_win.load( Hydrogen.windowLoad );

	/* EOF */

}) ( jQuery, window, document );