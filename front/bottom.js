

var Baynav_Theme = (function($) {
	"use strict";
	
	var hasTouch = false,
	    responsive_menu = false,
	    mobile_head_init = false;
	
	// module
	return {
		
		init: function() 
		{
			
			
			
			// setup mobile header and navigation
			this.mobile_header();
			this.responsive_nav();
			this.touch_nav();
			
			
			
			// use sticky navigation if enabled
			this.sticky_nav();
			
			/**
			 * Nav Search
			 */
			$('.search-overlay .search-icon').on('click', function() {
				
				$(this).parent().toggleClass('active');
				return false;
				
			});
			
			$(document).on('click', function(e) {
				if (!$(e.target).is('.search-overlay') && !$(e.target).parents('.search-overlay').length) {
					$('.search-overlay').removeClass('active');
				}
			});
			
			// nav icons class if missing
			$('.navigation i.only-icon').each(function() {
				
				var el = $(this).closest('li');
				if (!el.hasClass('only-icon')) {
					el.addClass('only-icon');
					
					// reflow bug fix for webkit
					var nav = $('.navigation .menu ul').css('-webkit-box-sizing', 'border-box');
					requestAnimationFrame(function() {
						nav.css('-webkit-box-sizing', '');
					});
				}

			});
			
			

			// safari 5.x fix
			if (!!navigator.userAgent.match('Safari/') && !!navigator.userAgent.match('Version/5.')) {
				$('.navigation .menu ul, .navigation .mega-menu').css('-webkit-transition', 'none');
			}
			
			// add android class
			if (navigator.userAgent.match(/android/i)) {
				$('body').addClass('android');
			}
			
		},
		
		
		/**
		 * Configure mobile header
		 */
		mobile_header: function() {
			
			// register resize event
			var that = this;
			
			// place in separate method to prevent mem leaks
			$(window).on('resize orientationchange', (function() {
				that.init_mobile_header();
			})());
		},
		
		init_mobile_header: function() {
			
			if (mobile_head_init || $(window).width() > 799 || !$('body').hasClass('has-mobile-head')) {
				return;
			}
			
			// copy search form
			var search = $('.top-bar .search');
			search = (search.length ? search : $('.nav-search .search'));

			if (search.length) {
				$('.mobile-head .search-overlay').append(search.clone());
			}
			
			mobile_head_init = true;
		},
		
		/**
		 * Setup the responsive nav events and markup
		 */
		responsive_nav: function() {
			
			// detect touch capability dynamically
			$(window).on('touchstart', function() {
				hasTouch = true;
				$('body').addClass('touch');
			});
			
			this.init_responsive_nav();
			var that = this;

			$(window).on('resize orientationchange', function() {
				that.init_responsive_nav();
			});		
		},

		init_responsive_nav: function() {
			
			if ($(window).width() > 799 || responsive_menu) {
				return;
			}
			
			// set responsive initialized
			responsive_menu = true;
			
			var off_canvas = ($('.navigation .mobile').data('type') == 'off-canvas'),
			    mobile_search = false,
			    menu;
			
			/**
			 * Create the mobile menu from desktop menu
			 */
			if (!$('.navigation .mobile-menu').length) {
				
				// clone navigation for mobile
				var menu = $('.navigation div[class$="-container"]').clone().addClass('mobile-menu-container');
				
				// add category mega menu links
				menu.find('div.mega-menu .sub-cats').each(function() {
					var container = $(this).closest('.menu-item');
					
					container.append($(this).find('.sub-nav'));
					container.find('.sub-nav').replaceWith(function() {
						return $('<ul />', {html: $(this).html()});
					});
				});
				
				menu.find('.menu').addClass('mobile-menu');
				
				// append inside wrap for full width menu
				menu.appendTo(($('.navigation > .wrap').length ? '.navigation > .wrap' : '.navigation'));
			}
			else {
				menu = $('.navigation .mobile-menu-container');
			}
			
			// off-canvas setup?
			if (off_canvas) {
				menu.addClass('off-canvas');
				menu.find('.menu').prepend($('<li class="close"><a href="#"><span>' + $('.navigation .selected .text').text()  + '</span> <i class="fa fa-times"></i></a></li>'));
				$('body').addClass('nav-off-canvas');
			}
			
			// mobile search?
			if ($('.navigation .mobile').data('search')) {
				mobile_search = true;
			}
			
			// register click handlers for mobile menu
			$('.navigation .mobile .selected').click(function(e) {
				
				// search active?
				if ($(e.target).hasClass('hamburger') || !mobile_search  || !$(this).find('.search .query').is(':visible')) {
                   
                    if (off_canvas) {
                        $('.navigation .mobile-menu').addClass('active');
                    	$('body').toggleClass('off-canvas-active');
                    }
                    else {
                        $('.navigation .mobile-menu').toggleClass('active');
                    }
                    
                    return false;
				}
			});
			
			$('.mobile-head .menu-icon a').on('click', function() {
             	$('body').toggleClass('off-canvas-active');
			});
			
			
			// have custom retina mobile logo? set dimensions
			var logo_mobile = $('.logo-mobile');
			if ($('.logo-mobile').length) {
				
				// order maters - attach event first
				$('<img />').on('load', function() {
					logo_mobile.prop('width', $(this)[0].naturalWidth / 2).prop('height', $(this)[0].naturalHeight / 2);
				}).attr('src', logo_mobile.attr('src'));
			}
			
			// Fix: Retina.js 2x logo on tablets orientation change
			$(window).on('resize orientationchange', function() {
				var logo = $('.logo-image');
				if (logo.prop('width') == 0) {
					logo.prop('width', logo[0].naturalWidth / 2).prop('height', logo[0].naturalHeight / 2);
				}
			});
			
			// off-canvas close
			$('.off-canvas .close').click(function() {
				$('body').toggleClass('off-canvas-active');
			});
			
			
			// add mobile search
			if (mobile_search) {
				
				var search = $('.top-bar .search');
				search = (search.length ? search : $('.nav-search .search'));
				
				// copy from top bar or nav search
				if (search.length) {
				
					$('.navigation .mobile .selected').append(search[0].outerHTML);
					$('.mobile .search .search-button').click(function() {
		
						if (!$('.mobile .search .query').is(':visible')) {
								$('.navigation .mobile .selected .current, .navigation .mobile .selected .text').toggle();              
								$('.mobile .search').toggleClass('active');
		
								return false;
						}
					});
				}
			}
			
			// setup mobile menu click handlers
			$('.navigation .mobile-menu li > a').each(function() {
				
				if ($(this).parent().children('ul').length) {
					$('<a href="#" class="chevron"><i class="fa fa-angle-down"></i></a>').appendTo($(this));
				}
			});
			
			$('.navigation .mobile-menu li .chevron').click(function() {
					$(this).closest('li').find('ul').first().toggle().parent().toggleClass('active item-active');
					return false;
			});
			
			// add active item
			var last = $('.mobile-menu .current-menu-item').last().find('> a');
			if (last.length) {
				
				var selected = $('.navigation .mobile .selected'),
					current  = selected.find('.current'),
					cur_text = selected.find('.text').text();
				
				if (cur_text.slice(-1) !== ':') {
					selected.find('.text').text(cur_text + ':');
				}
				
				current.text(last.text());
			}
		},
		
		/**
		 * Setup touch navigation for larger touch devices
		 */
		touch_nav: function() {
			
			var targets = $('.menu:not(.mobile-menu) a'),
				open_class = 'item-active',
				child_tag = 'ul, .mega-menu';
			
			targets.each(function() {
				
				var $this = $(this),
					$parent = $this.parent('li'),
					$siblings = $parent.siblings().find('a');
				
				$this.click(function(e) {
					
					if (!hasTouch) {
						return;
					}
					
					var $this = $(this);
					e.stopPropagation();
					
					$siblings.parent('li').removeClass(open_class);
					
					// has a child? open the menu on tap
					if (!$this.parent().hasClass(open_class) && $this.next(child_tag).length > 0 && !$this.parents('.mega-menu.links').length) {
						e.preventDefault();
						$this.parent().addClass(open_class);
					}
				});
			});
			
			// close all menus
			$(document).click(function(e) {
				if (!$(e.target).is('.menu') && !$(e.target).parents('.menu').length) {
					targets.parent('li').removeClass(open_class);
				}
			});
		},
		
		/**
		 * Setup sticky navigation if enabled
		 */
		sticky_nav: function()
		{
			var nav = $('.navigation-wrap'),
			    nav_top  = nav.offset().top,
			    smart = (nav.data('sticky-type') == 'smart'),
			    is_sticky = false,
			    prev_scroll = 0,
			    cur_scroll;
			
			// not enabled?
			if (!nav.data('sticky-nav')) {
				return;
			}
			
			if (nav.find('.sticky-logo').length) {
				nav.addClass('has-logo');
			}
			
			// disable the sticky nav
			var remove_sticky = function() {
				
				// check before dom modification 
				if (is_sticky) {
					nav.removeClass('sticky-nav'); 
				}
			}
			
			// make the nav sticky
			var sticky = function() {

				if (!nav.data('sticky-nav') || $(window).width() < 800) {
					return;
				}
				
				cur_scroll = $(window).scrollTop();
				is_sticky  = nav.hasClass('sticky-nav');
				
				// make it sticky when viewport is scrolled beyond the navigation
				if ($(window).scrollTop() > nav_top) {
					
					// for smart sticky, test for scroll change
					if (smart && (!prev_scroll || cur_scroll > prev_scroll)) {
						remove_sticky();
					}
					else {
						
						if (!nav.hasClass('sticky-nav')) {
							nav.addClass('sticky-nav no-transition');
						
							setTimeout(function() { 
								nav.removeClass('no-transition'); 
							}, 100);
						}
					}
					
					prev_scroll = cur_scroll;
					
				} else {
					remove_sticky();
				}
			};

			sticky();

			$(window).scroll(function() {
				sticky();
			});
			
		},
		
		
		
			
	
		
		
		
		
		
		
		/**
		 * Setup prettyPhoto
		 */
		lightbox: function() {
			
			// disabled on mobile screens
			if (!$.fn.prettyPhoto || $(window).width() < 700) {
				return;
			}
			
			var filter_images = function() {
				
				if (!$(this).attr('href')) {
					return false;
				}
				
				return $(this).attr('href').match(/\.(jpe?g|png|bmp|gif)$/); 
			};
			
			(function() {
				var gal_id = 1;
				
				$('.post-content a, .main .featured a').has('img').filter(filter_images).attr('rel', 'prettyPhoto');
				
				$('.gallery-slider, .post-content .gallery, .post-content .tiled-gallery').each(function() {
					gal_id++; // increment gallery group id
					
					$(this).find('a').has('img').filter(filter_images)
						.attr('rel', 'prettyPhoto[gal_'+ gal_id +']');
				});
				
				$("a[rel^='prettyPhoto']").prettyPhoto({social_tools: false});
				
			})();
			
			// WooCommerce lightbox
			$('a[data-rel^="prettyPhoto"], a.zoom').prettyPhoto({hook: 'data-rel', social_tools: false});
			
		}
	}; // end return
	
})(jQuery);

// load when ready
jQuery(function($) {
		
	Baynav_Theme.init();
});

/**
 * Live Search Handler
 */
var Baynav_Live_Search = (function($) {
	"use strict";
	
	var cache = {}, timer, element;
	
	return {
		
		init: function() {
			
			var self = this,
			    search = $('.live-search-query');

			if (!search.length) {
				return;
			}
			
			// turn off browser's own auto-complete
			$('.live-search-query').attr('autocomplete', 'off');
			
			// setup the live search on key press
			$('.live-search-query').on('keyup', function() {
				
				element = $(this).parent();
				
				var query = $(this).val(), result;
				
				
				// clear existing debounce
				clearTimeout(timer);
				
				// minimum of 1 character
				if (query.length < 1) {
					self.add_result('');
					return;
				}
				
				// debounce to prevent excessive ajax queries
				timer = setTimeout(function() {
					self.process(query);
				}, 250);
			});
			
			// setup hide 
			$(document).on('click', function(e) {
				
				var results = $('.live-search-results');
				
				if (results.is(':visible') && !$(e.target).closest('.search').length) {
					results.removeClass('fade-in');
				}
			});
		},
		
		/**
		 * Process the search query
		 */
		process: function(query) {
			
			var self = this;
			
			// have it in cache?
			if (query in cache) {
				self.add_result(cache[query]);
			}
			else {
				$.get(Baynav.ajaxurl, {action: 'Baynav_live_search', 'query': query}, function(data) {
					
					// add to cache and add results
					cache[query] = data;
					self.add_result(data);
				});
			}
		},
		
		/**
		 * Add live results to the container
		 */
		add_result: function(result) {
			
			if (!element.find('.live-search-results').length) {
				element.append($('<div class="live-search-results"></div>'));
			}
			
			var container = element.find('.live-search-results');

			if (!result) {
				container.removeClass('fade-in');
				return;
			}
			
			// add the html result
			container.html(result);
			
			requestAnimationFrame(function() {
				container.addClass('fade-in');
			});
			
		}
	};
	
})(jQuery);

// fire up when ready
jQuery(function() {
	Baynav_Live_Search.init();
});








var pending_sections = [];
var section_threshold = 500;
var suffixPdfCanvas = 1;

$(document).ready(function() {
    if ($('.slider').length > 0 ) {
    	$('.slider').slick({
            dots : true,
            infinite : true,
            speed : 500,
            slidesToShow : 1,
            slidesToScroll : 1,
            arrows : true,
            autoplay : true,
            prevArrow : '<button class="slider-prev slick-arrow">Previous</button>',
            nextArrow : '<button class="slider-next slick-arrow">Next</button>'
        });
    }
    
    function ntd_get_date() {
		var today = new Date();
		var weekday = new Array("日", "一", "二", "三", "四", "五", "六");
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		weekday = weekday[today.getDay()];
		today = yyyy + '年' + mm + '月' + dd + '日 星期' + weekday;
		return today;
	}
    $('#ntd_date').empty().append(ntd_get_date());
    
	if ($('.four_per_slide').length > 0 ) {
		$('.four_per_slide').slick({
			dots : false,
			infinite : true,
			speed : 500,
			slidesToShow: 4,
			slidesToScroll: 4,
			arrows : false,
			autoplay : false
		});
	}

    if ($.fn.laziestloader) {
        $("img.lazy").laziestloader({
            threshold : 500
        });
        $("iframe.lazy").laziestloader({
            threshold : 500
        });
        $(window).trigger('scroll');
    }

  

  

	

	function ntdGUID() {
		function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	$('header .menu_icon, header .search_icon').click(function() {
		$('header #nav_pannel').slideToggle();
	});
	
	function switch_instant_news() {
		var current = $('.main .instant_news .one_post a.active');
		var next = current.next();
		if (next.length == 0) {
			next = $('.main .instant_news .one_post a').first();
		}
		current.hide();
		next.slideDown();
		next.addClass("active");
		current.removeClass("active");
	}
	setInterval(switch_instant_news, 6000);
	
    if ($('.slider-for').length > 0 && $(".slider-nav").length > 0) {
        $(".slider-for").slick({
            slide : ".slide",
            autoplay : true,
            speed: 500,
            fade: true,
            infinite: true,
            cssEase: 'linear',
            asNavFor : ".slider-nav",
            prevArrow : '<button class="slider-prev">Previous</button>',
            nextArrow : '<button class="slider-next">Next</button>'
        });

        $(".slider-nav").slick({
            slidesToShow : 8,
            asNavFor : ".slider-for",
            dots : false,
            focusOnSelect : true,
        });
    }
//    // switch channel for live iframe
//    $(".live-channels li").click(function() {
//        $(this).addClass("active").siblings().removeClass("active");
//        $("#live-box h2").text($(this).attr("data-channel"));
//
//        var link = $('#livesteam').attr("src");
//        var data = $(this).attr("data-src");
//        $("#live-box .video").empty().append(
//            '<iframe id="livesteam" src="' + link + '" allowfullscreen data="' + data + '" marginheight="0" marginwidth="0" ></iframe>'
//        );
//        var schedule_link = $("#live-box .intro .detail").attr('href');
//        $("#live-box .intro .detail").attr('href', schedule_link + '?channel=' + $(this).attr("data-code"));
//    });

    // breaking news
    if ($('body.single').length > 0 || $('body.home').length > 0) {
        if ($('#breaking_news').length > 0) {
            $.ajax({
                type : 'GET',
                url : '/assets/uploads/html/breaking_news.html',
                success : function(data) {
                    var breaking = jQuery('<div>').html(data).find('.container');
                    $('#breaking_news').empty().append(breaking);
                }
            });
        }

        $(function() {
            if (!$.cookie) {
                return;
            } else {
                if ($.cookie('none_breaking') == 'yes') {
                    $('#breaking_news').css('display', 'none');
                }
            }
        });

        $(document).on('click', '#breaking_news .close', function() {
            $('#breaking_news').css('display', 'none');
            if (!$.cookie) {
                return;
            } else {
                $.cookie('none_breaking', 'yes', {
                    expires : 1
                });
            }
        });
    }

   
    






 




	
	
	
	$("#backtotop").hide();
	$("#backtotop a").click(function() {
		$("body,html").animate({
			scrollTop: 0
		}, 800);
		return false;
	})

	$('#change_size').click(changeArticleFont);
	
	

	


	if ($('.category .election').length > 0) {
		
	

		if ($('.top_slider').length > 0 && $('.top_slider_nav').length > 0) {
			$('.top_slider').slick({
				slide : '.slide',
				autoplay : $('.top_slider .slide.video').length < 1,
				speed: 500,
				fade: true,
				infinite: true,
				cssEase: 'linear',
				asNavFor : '.top_slider_nav',
				prevArrow : '<button class="slider-prev">Previous</button>',
				nextArrow : '<button class="slider-next">Next</button>'
			});

			$('.top_slider_nav').slick({
				slidesToShow : 5,
				asNavFor : '.top_slider',
				dots : false,
				focusOnSelect : true,
			});
		}

		election_countdown();

		if ($('.picture_slide').length > 0) {
			$('.picture_slide').slick({
				lazyLoad: 'ondemand',
				slide : '.slide',
				autoplay : true,
				speed: 500,
				fade: true,
				infinite: true,
				cssEase: 'linear',
				prevArrow : '<button class="slider-prev">Previous</button>',
				nextArrow : '<button class="slider-next">Next</button>'
			});
		}

		

	
	}

	
	
});// end of document ready

function election_countdown() {
	var countDownDate = new Date("Nov 3, 2020 00:00:00").getTime();
	var timerElection = setInterval(function() {
		var now = new Date().getTime();
		var distance = countDownDate - now;
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		days = ('0' + days).slice(-2);
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		hours = ('0' + hours).slice(-2);
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		minutes = ('0' + minutes).slice(-2);
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		seconds = ('0' + seconds).slice(-2);

		$('#countdown .days').text(days);
		$('#countdown .hours').text(hours);
		$('#countdown .mins').text(minutes);
		$('#countdown .seconds').text(seconds);

		if (distance < 0) {
			clearInterval(timerElection);
		}
	}, 1000);
}

function switchScheduleTimeByTimezone() {
    var json_data = jQuery.parseJSON($('.json-data').attr('data-schedules'));
    var url = window.location.href;
    var channel_id = $('.channels .active').attr("data-code");
    var date_id = $('.days .active').attr("data-code");
    var timezone = parseFloat($('#time-zone option:selected').attr("data-offset"));

    $('.time-table .list-am').html('');
    $('.time-table .list-pm').html('');
    if (typeof json_data[channel_id] === 'undefined') {
    	return;
    }
	var channel_data = json_data[channel_id];
	if (!channel_data) return;
	$.each(channel_data, function (index, date_schedlue) {
		var sorted_value = sortJSON(date_schedlue, 'time_start', 'asc');
		var records = [];
		$.each(sorted_value, function (index_, value_) {
			var timestamp = (parseFloat(value_.time_start) + timezone) * 1000;
			if (records.indexOf(timestamp) > 0) return;
			records.push(timestamp);
			var timezone_date = new Date(timestamp).toISOString();
			var day = timezone_date.slice(0, 10).replace(/-/g, "/");
			if (date_id == day) {
				var html = '';
				var time = timezone_date.slice(11, 16);
				html = '<div class="program">' + html + '<span class="time">' + time + '</span><span class="title">' + value_.title + '</span></div>';
				if (time.slice(0, 2) < 12) {
					$('.time-table .list-am').append(html);
				} else {
					$('.time-table .list-pm').append(html);
				}
			}
		});
	});
}

function sortJSON(data, key, direction) {
    return data.sort(function(a, b) {
        var x = parseFloat(a[key]);
        var y = parseFloat(b[key]);
        if (direction === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        } else if (direction === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}




function check_sections_on_scroll() {
	var scroll = jQuery(window).scrollTop();
	pending_sections = pending_sections.filter(function(item) {
		var section_top = jQuery(item.selector).offset().top - jQuery(window).height();
		// Show the section if the user scrolls near or past the section.
		if (section_top - scroll < item.threshold || scroll > section_top) {
			item.callback();
			// Remove this section from the pending list.
			return false;
		}
		return true;
	});
}

function add_lazy_load_section(selector, callback, threshold) {
	var offset = jQuery(selector).offset();
	if (!offset)
		return;

	if (!threshold || threshold < 0)
		threshold = section_threshold;

	pending_sections.push({
		selector: selector,
		callback: callback,
		threshold: threshold
	});
}

// throttled scroll events
var didScroll = null;
jQuery(window).scroll(function() {
	didScroll = true;
});

setInterval(function() {
	if (didScroll) {
		didScroll = false;
		check_sections_on_scroll();
		ntd_back_to_top();
	}
}, 300);

function ntd_back_to_top() {
	if ($(window).scrollTop() > 800 && !$("#backtotop").is(':visible')) {
		$("#backtotop").fadeIn();
	} else if ($(window).scrollTop() < 800 && $("#backtotop").is(':visible')) {
		$("#backtotop").fadeOut();
	}
}


