
/*
 * Get the value of a query string paramater by name, returns '' as default.
 */
function _GET( name )
{
	var qs = '';
	var query = window.location.href;
	if( query.indexOf('#') > -1 )
		query = query.substring( 0, query.indexOf('#') );
	var parts = query.split('?');
	if( parts.length > 1 )
	{
		qs = parts[1];
		var params = qs.split('&');
		var pair;
		for( p in params )
		{
			pair = params[p].split('=');
			if( pair[0] == name )
			{
				return pair[1];
			}
		}
	}
	return '';
}

$(document).ready(function (){
	
	/*
	 * Hide elements for print
	 */

	if( typeof _GLOBALS['phil'] !== 'undefined' && _GLOBALS['phil'] == true )
		$('#section-ballett').addClass('noprint');

	if( typeof _GLOBALS['ballett'] !== 'undefined' && _GLOBALS['ballett'] == true )
		$('#section-staatsorchester').addClass('noprint');

	if( typeof _GLOBALS['phil'] !== 'undefined' && (_GLOBALS['phil'] == true || _GLOBALS['ballett'] == true ) )
		$('#section-staatsoper').addClass('noprint');

	
	/*
	$('#section a, #programm-nav a, #page-nav a').on('touchend', function(e) {
		var el = $(this);
		var link = el.attr('href');
			var target = el.attr('target');
			if(typeof target != "undefined") {
					window.open(link);
		} else {
					window.location = link;
			}
			return false;
	});*/

	
	$("#page-nav li a, #programm-nav li a").each(function() {	
	   var _myHref = $(this).attr("href"); 
	   $(this).attr("href", _myHref + '#pagenav');
	});
	
	$(".popup-block img").bind("contextmenu",function(e) {
	   return false;
	});
	
	/* foldout content element*/
	$("span.foldout", this).css("display", "inline-block");
	$(".clickable").click(function (){
		var e = $( this ).next();
		if(e.is(":visible")) {
			e.slideUp();
			$("span.foldout", this).css("transform", "rotate(0deg)");
		} else {
			e.slideDown();
			$("span.foldout", this).css("transform", "rotate(180deg)");
		}
	});
	$(".extendable").hide();
	
	/*
	 * Whether or not to display the arrow "to top" on the current page.
	 */
	var display_toparrow = false;
	display_toparrow = ($("#spielplan").length > 0); // Display arrow on event list page
	if( typeof _GLOBALS['jung'] !== 'undefined' && _GLOBALS['jung'] === true )
	{
		// Get path without 'index.php' at the end
		var pathname = location.pathname;
		if( pathname.substr(-9) === 'index.php' )
			pathname = pathname.substr(0, pathname.length - 9);
		
		// Pages on which the top arrow shall be displayed on the JUNG website
		var pages_with_arrows = [
			"/de/ballett/",
			"/de/konzert/",
			"/de/oper/",
		];
		if( $.inArray(pathname, pages_with_arrows) >= 0 )
			display_toparrow = true;
	}
	
	if (display_toparrow) {
		$(window).scroll(function(){
			if ($(this).scrollTop() > 120) {
				$('.toTop').fadeIn();
			} else {
				$('.toTop').fadeOut();
			}
		});

		$('.toTop').click(function(){
			$('html, body').animate({scrollTop : 0},560);
			return false;
		});
	}

	initTooltipster();
	$('div[style~="text-align:right;font-size:10px;color:grey;"] a').css({ "color": "#191917", "margin-right": "5px", "text-decoration": "none" });
	$('div[style~="text-align:right;font-size:10px;color:grey;display:block"] a').css({ "color": "#191917", "margin-right": "5px", "text-decoration": "none" });
	$('div[style~="text-align:right;font-size:10px;color:grey;"]').css("background-color", "#ccc49a");
	$('div[style~="text-align:right;font-size:10px;color:grey;display:block"]').css("background-color", "#ccc49a");

	$('video.video-js').on('contextmenu', function(e) {
		e.preventDefault();
	});
	$('iframe.fullscreen').attr('allowfullscreen', 'allowfullscreen');
});

/**
 * Initialize rendering of tooltips.
 * 
 * @param element [optional] element or selector to render tooltips on
 */
function initTooltipster(element)
{
	var $element = typeof element !== 'undefined'
		? $(element).find('.tooltip:not(.tooltipstered)')
		: $('.tooltip:not(.tooltipstered)');
	
	$element.tooltipster({
		theme: ['tooltipster-shadow', 'tooltipster-shadow-customized'],
		animation: 'fade',
		delay: 200,
		trigger: 'custom',
		triggerOpen: {
			click: true,
			mouseenter: true
		},
		triggerClose: {
			click: true,
			scroll: true,
			mouseleave: true
		}
	});
}

function autoHideSliderArrows()
{
	if( $('.slider-arrow-left').length > 0 )
	{
		$(".slider-arrow-left").click(function (){
			$('.flexslider').flexslider("prev");
			return false;
		});
		$(".slider-arrow-right").click(function (){
			$('.flexslider').flexslider("next");
			return false;
		});
		
		if( $('#header-slider .slides li').length <= 1 )
		{
			$(".slider-arrow-left").hide();
			$(".slider-arrow-right").hide();
		}
	}
}

$(document).ready(function()
{
	if( $("#header-slider").length > 0 )
	{
		if( typeof $("#header-slider").attr('data-usehighlights') !== 'undefined' )
		{
			$("#header-slider").hide();
			$.get("/highlight_json.php", {typ: _GET('typ')}, function (json){
				var data;
				
				try {
					data = jQuery.parseJSON(json);
				} catch(e){
					console.log(e);
					return;
				}
				var txt_more = ( _GLOBALS['language'] == 'en' ) ? "more" : "mehr";
				var typ = _GET('typ');



				for(var i in data){
					var d = data[i];
					//noinspection HtmlUnknownTarget
					var alt = "";
					if(d.hl_alt_2011 != undefined && d.hl_alt_2011.length != 0)
						alt = ' alt="'+ d.hl_alt_2011+'"';

					var title = "";
					if(d.hl_title_2011 != undefined && d.hl_title_2011.length != 0)
						title = ' title="'+ d.hl_title_2011+'"';

					var sliderCaptionExtraClass = "";
					if (d.OriginalTitel.length > 20) {
						sliderCaptionExtraClass = " slider-caption-long";
						d.OriginalTitel = d.OriginalTitel.replace("Weihnachtsoratorium", "Weihnachts&shy;oratorium");
					}

					if( typeof d.title !== 'undefined' ) // stoper
					{
						d.titledisplay = d.title[_GLOBALS['language']];
						d.artist = d.artist[_GLOBALS['language']];
					}
					else // phil
					{
						if (_GLOBALS['language'] == "en") {
							d.titledisplay = d.OriginalTitelEng;
							d.artist = d.KomponistEng;
						} else {
							d.titledisplay = d.OriginalTitel;
							d.artist = d.Komponist;
						}	
					}

					if (d.titledisplay.length > 40) {
						console.log(d.titledisplay + " " + d.titledisplay.length );
						sliderCaptionExtraClass = " slider-caption-long slider-caption-long2";
					}

					if (d.suffixExt === undefined)
						d.suffixExt = "";
					
					var html = "" +
					"<a href='"+ _GLOBALS['spielplanLink'] +"?AuffNr="+ d.AuffNr+"'>" +
					"<img src='/imageCache/stueck_highlight-" + d.SNr + "-highlight.jpg" + d.suffixExt + "'" + alt + title + ">" + 
					"<div class='slider-caption" + sliderCaptionExtraClass + "'>" +
					"<p class='slider-caption-artist'>" + d.artist + "</p>" +
					"<p class='slider-caption-title'>" + d.titledisplay + "</p>" +
					"<p class='slider-caption-description'>" + d.shorttext[_GLOBALS['language']] + "</p>" +
					"<span class='slider-caption-more'>" +
						"<span>" + txt_more + "</span>" +
						"<img src='/img/programm-empfehlung-arrow.png' alt='" + txt_more + "'>" +
					"</span>" +
					"</div>" +
					"</a>";
					
					var li = $("<li>").html(html);
					$(".flexslider .slides").append(li);
				}
				var slider = $('.flexslider').flexslider({
					slideshowSpeed: 5000
				});
				$("#header-slider").show();
				autoHideSliderArrows();
			});
		}
		else
		{
			var slider = $('.flexslider').flexslider();
			autoHideSliderArrows();
		}
	}
	
	/*
	 * Append query string to language switcher link
	 */
	var parts = window.location.href.split('?');
	if( parts.length > 1 )
	{
		var qs = parts[1];
		$('.languageSwitcher').attr('href', $('.languageSwitcher').attr('href') + '?' + qs );
	}
	
	/*
	 * Duplicate language switcher from main menu to mobile menu
	 */
	var a = $('.languageSwitcher').clone();
	$(a).css('position', 'absolute');
	$('#mobile_navigation').prepend(a);
	
	
	/*
	 * Third level navigation for mobile
	 */
	if( $('#programm-nav, #page-nav').length > 0 ) {
		if (typeof _GLOBALS['phil'] !== 'undefined' && _GLOBALS['phil'] == true) {
			var st_moreinfo = {
				'de': "Auswahl",
				'en': "Further information"
			};
		} else {
			var st_moreinfo = {
				'de': "Weitere Informationen",
				'en': "Further information"
			};
		}
		var navi = document.createElement('div');
		$(navi).attr('id', 'programm-mobile-nav');
		$(navi).append(
			$(document.createElement('p'))
				.text( st_moreinfo[_GLOBALS['language']] )
		);
		$(navi).append(
			$(document.createElement('a'))
				.attr('href','#')
				.append(
					$(document.createElement('img'))
						.attr('src', '/img/weitere-infos-arrow.gif')
						.attr('alt',  st_moreinfo[_GLOBALS['language']]  )
				)
		);
		$(navi).on('click',
			function(){
				// $('#programm-mobile-nav-list').slideToggle();
				$('#programm-nav, #page-nav').slideToggle();
				return false;
			}
		);
		$('#programm-nav, #page-nav').before(navi);
	}
	
	
	var st_moreinfo_footer;
	if( typeof _GLOBALS['ballett'] !== 'undefined' && _GLOBALS['ballett'] == true )
		st_moreinfo_footer = {
			'de': "Mehr über das Hamburg Ballett",
			'en': "More about the Hamburg Ballet"
		};
	else if( typeof _GLOBALS['phil'] !== 'undefined' && _GLOBALS['phil'] == true )
		st_moreinfo_footer = {
			'de': "Mehr über das Philharmonische Staatsorchester Hamburg",
			'en': "More information"
		};
	else
		st_moreinfo_footer = {
			'de': "Mehr über die Staatsoper Hamburg",
			'en': "More about the Staatsoper Hamburg"
		};
	
	
	var last_ww = 0;
	function init_footer_navi()
	{
		var ww = $(window).width();
		if( ww == last_ww )
			return;
		last_ww = ww;
		
		var elm = $('footer ul:first-of-type');
		var navi = $('#mobile-footer-nav');
		
		if( ww < 480 )
		{
			if( $(elm).length > 0 )
			{
				if( $(navi).length == 0 )
				{
					navi = document.createElement('div');
					$(navi).attr('id', 'mobile-footer-nav');
					$(navi).append(
						$(document.createElement('p'))
							.text( st_moreinfo_footer[_GLOBALS['language']] )
					);
					$(navi).append(
						$(document.createElement('a'))
							.attr('href','#')
							.append(
								$(document.createElement('img'))
									.attr('src', '/img/calender_picker_arrow_down.png')
									.attr('width', '32')
									.attr('alt',  st_moreinfo_footer[_GLOBALS['language']]  )
							)
					);
					$(navi).on('click',
						function(){
							elm.slideToggle();
							$('html,body').stop().animate({'scrollTop': $(navi).offset().top + 'px'}, 500 );
							return false;
						}
					);
					elm.before(navi);
				}
				$(navi).show();
				elm.hide();
				elm.addClass('mobile-footer-nav');
			}
		}
		else if( $(navi).length > 0 )
		{
			$(navi).hide();
			elm.show();
			elm.removeClass('mobile-footer-nav');
		}
	}
	
	
	$(window).on('resize', init_footer_navi );
	init_footer_navi();
	
	
	$('.filter-select-2').remove();
		
	(function($){
		/*
		 * Make a JS HTML dropdown for prettier select boxes. Markup must be in the form of:
		 *
		 * <label for="{id_of_select}">
		 *   <span>{default_text}</span>
		 *   <select id="{id_of_select}">
		 *     <option>...
		 *   </select>
		 * </label>
		 *
		 * @params
		 *   optional string type 'filter' or ''
		 */
		$.fn.makeDropdown = function()
		{
			var type = '';
			if( typeof arguments !== 'undefined' && typeof arguments.length !== 'undefined' && arguments.length > 0 )
			{
				type = arguments[0];
			}
			
			var img_icon = "/img/filter-select-icon-gold.png";
			if( type == 'filter' )
				 img_icon = "/img/filter-select-icon.png";
			
			$(this).each(_makeDropdown);
			
			function _makeDropdown(i,e)
			{
				var title = $(e).find('span').text();
				var elm = document.createElement('div');
				$(elm).addClass('filter-select-box').addClass( $(e).attr('for') );
				$(elm).attr('data-name', $(e).attr('for') );
				var p = document.createElement('p');
				$(p).text( title );
				$(elm).append( p );
				
				var img = document.createElement('img');
				$(img).attr('src', img_icon);
				// $(img).attr('width', "46");
				// $(img).attr('height', "46");
				$(elm).append( img );
				
				var div = document.createElement('div');
				$(div).addClass('filter-select-list');
				$(div).css('display','none');
				var ul = document.createElement('ul');
				var options = $(e).find('option');
				var li;
				for( var i = 0; i < options.length; ++i )
				{
					li = document.createElement('li');
					$(li).attr('data-value', $(options[i]).attr('value') );
					$(li).text( $(options[i]).text() );
					$(ul).append(li);
				}
				$(div).append(ul);
				$(elm).append(div);
				
				$(e).after( elm );
				$(e).hide();
			}
		};
	}(jQuery));
	
	$('label.dropdown').makeDropdown('filter');
	$('label.dropdown2').makeDropdown();
	

	// Filter Optionen ein- und ausblenden

	$("#filter-title").click(function(){
		$("#filter-options").slideToggle(400);
		$("#filter-title-2").toggle();
		$("#filter-title").toggle();
	});

	$("#filter-title-2").click(function(){
		$("#filter-options").slideToggle(400);
		$("#filter-title-2").toggle();
		$("#filter-title").toggle();
	});
	

	// Filter Listen ein- und ausblenden

	//$(".filter-select-1").click(function(){
	//	$(".select-list-1").fadeToggle(100);
	//});
	//
	//$(".filter-select-2").click(function(){
	//	$(".select-list-2").fadeToggle(100);
	//});
	//
	//$(".filter-select-3").click(function(){
	//	$(".select-list-3").fadeToggle(100);
	//});
	//
	//$(".filter-select-4").click(function(){
	//	$(".select-list-4").fadeToggle(100);
	//});

	// Filter Select Selected bei Klick löschen

	$(".filter-select-selected-konzert").click(function(){
		$(".filter-select-selected-konzert").remove();
	});

	$(".filter-select-selected-ballett").click(function(){
		$(".filter-select-selected-ballett").remove();
	});


	// Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5
	// Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53
	// Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4
	
	// Search Overlay einblenden

	var w = $(window).width();
	var h = $(window).height();

	$(".search-icon").click(function(e){
		
		$("#search-overlay").fadeToggle(200);
		
		$("#search-overlay input").focus(); // focus() can't be used in callbacks on iPhone
		
		$("body").removeClass('mobileNavigation'); // hide mobile slide-in menu
		
		// alert(navigator.userAgent);

		// No User Agent:

		if ( w < 480 && h < 740 ) {
			$('html,body').animate({
				'scrollTop': ( $("#search-overlay").offset().top + 0 ) + "px"
			});
		}
		if ( h < 560 ) {
			$('html,body').animate({
				'scrollTop': ( $("#search-overlay").offset().top + 50 ) + "px"
			});
		}

		// User Agent:
		
		// if( /iPhone OS [8|9]/i.test(navigator.userAgent) ) // iPhone 5/6	! iPhone 4 as well
		// {
		// 	$('html,body').animate({
		// 		'scrollTop': ( $("#search-overlay").offset().top + 100 ) + "px"
		// 	});
		// }
		// else if( /iPhone OS [4|5]/i.test(navigator.userAgent) ) // iPhone 4	! iPhone 4 not working
		// {
		// 	$('html,body').animate({
		// 		'scrollTop': ( $("#search-overlay input").offset().top - 30 ) + "px"
		// 	});
		// }
	});

	$("#search-close").click(function(){
		$("#search-overlay").fadeOut(200);
	});

	// $(window).resize(function(){
	// 	$("#search-overlay").fadeOut(0);
	// });


	if ( w < 720 ) {
		$(".calendar-months").css("height", h - 222);
	}

	$(window).resize(function(){
		w = $(window).width();
		h = $(window).height();

		if ( w < 720 ) {
			$(".calendar-months").css("height", h - 222);
		}
		else {
			$(".calendar-months").css("height", "auto");
		}
	});

	
	// weitere Informationen Mobile Menu einblenden

	$(".spielplan-calendar-month").click(function(){
		$("#programm-mobile-nav-list").fadeToggle(200);
	});

	$( window ).resize(function() {
		$( "#programm-mobile-nav-list" ).fadeOut(0);
	});
	
	$(".filter-select-box, .filter-select").each(function (){
		var name = $(this).attr('data-name');
		var p = $(this).children("p");

		$(this).click(function (){
			var list = $(this).find('.filter-select-list')[0];
			var is_open = $(list).is(':visible');
			
			$(".filter-select-list").hide(); // hide all dropdow lists, to not overlap with others
			
			if( !is_open )
				$(list).show();
		});

		$(this).find("li").click(
			(function(that){
			return (function(){
				var name = $(that).attr('data-name');
				p.html($(this).html());
				var val = $(this).attr('data-value');

				if(!val){
					val = $(this).html();
				}
				
				$('#'+name).val(val).change(); // change() is needed to trigger onchange event
			});
		}(this)));
		
		var name = $(this).attr('data-name');
		if( typeof name !== 'undefined')
		{
			var val = $('#'+name).val()
			if( typeof val !== 'undefined' && val !== "" && val !== 0 )
			{
				// console.log(val);
				var sel = $(this).find('li[data-value="' + $('#'+name).val() + '"]');
				if(typeof sel !== 'undefined')
					p.html($(sel).html());
			}
		}
	});
	
	var CastInfo = {
		persons_at_once: 4,
		active_index: -1,
		locked: false
	};
	
	function initCastInfo()
	{
		var ww = $(window).width();
		CastInfo.persons_at_once = 4;
		if( ww <= 990 ) CastInfo.persons_at_once = 2;
		if( ww <= 720 ) CastInfo.persons_at_once = 2;
	}
	
	$(window).on('resize', initCastInfo);
	
	
	function closeCurrentBesetzung()
	{
		CastInfo.active_index = -1;
		CastInfo.locked = true;
		$('section.besetzung-info').stop().slideUp(500);;
		// $('section.besetzung-info').removeClass('show');
		setTimeout(function(){
			$('section.besetzung-info').remove();
			CastInfo.locked = false;
		}, 500);
		return;
	}
	
	/*
	 * Wrapper is a single element containing all cast member DIVs
	 */
	$(".programm-besetzung-wrapper").each(function(){
		
		initCastInfo();
		
		var children = $(".programm-besetzung-wrapper").children();
		
		$(this).find(".programm-besetzung").each(function(i,e){
			var par = $(this);
			var elm_index = i;
			var elm_row = Math.floor( i / CastInfo.persons_at_once );
			
			/*console.log( $($(e).find(".programm-besetzung-close")) );
			
			$(this).find(".programm-besetzung-close").click(function(){
				console.warn("click1");
			});*/
			
			$(this).find(".programm-besetzung-img").click(function(){
				
				if( CastInfo.locked === true )
					return;
				
				if( CastInfo.active_index == elm_index )
				{
					closeCurrentBesetzung();
					return;
				}
				else
				{
					CastInfo.locked = true;
					
					var animation_duration = 0;
					if( CastInfo.active_index > -1 )
					{
						$('section.besetzung-info').stop().slideUp(500);
						// $('section.besetzung-info').removeClass('show');
						animation_duration = 500;
					}
					
					$('.programm-besetzung-active').removeClass('programm-besetzung-active');
					$(e).find('.programm-besetzung-img').addClass('programm-besetzung-active');
					
					CastInfo.active_index = elm_index;
					
					setTimeout(function(){
						$('section.besetzung-info').remove();
						
						var index = -1;
						var infoCountBeforeElement = 0;

						for(var i = 0; i < children.length; i++){
							var c = children[i];

							if($(c).hasClass('programm-besetzung'))
								index++;
							 else
								infoCountBeforeElement++;

							if(c == par[0])
								break;

						}

						var pos = Math.floor((index / CastInfo.persons_at_once) + 1);
						
						var info = $("<section>").css('display','none').addClass('besetzung-info');
						info.html(par.children(".programm-besetzung-info").html());
						info.find('.programm-besetzung-close').on('click', closeCurrentBesetzung);

						var afterPos = (pos * CastInfo.persons_at_once) - 1 + infoCountBeforeElement;
						if((children.length - 1) < afterPos)
							afterPos = children.length - 1;

						var after = children[afterPos];


						info.insertAfter(after);
						setTimeout(function () {
							// info.addClass('show');
							info.stop().slideDown(500);
						}, 10);
						
						setTimeout(function(){
							CastInfo.locked = false;
							
							if( $(window).scrollTop() != $(e).position().top )
							{
								$("html, body").animate( {scrollTop: $(e).position().top +'px'} );
							}
						}, 500);

					}, animation_duration);
				}
				
			});
		});
	});


	$('#mobile_navigation > ul > li > ul').hide();
	$('#mobile_navigation > ul > li > a').on('click',function(){
		if( $(this).parent().children('ul').length > 0 )
		{
			$(this).parent().children('ul').slideToggle();
			return false;
		}
	});
	
	$(".trigger-mobile-menu").click(function(){
		//$("#mobile_navigation").toggle();
		$("body").toggleClass("mobileNavigation");
		$("#search-overlay").hide();
		return false;
	});



	//direction: right
	//
	//var jPM = $.jPanelMenu({
	//	menu: '#mobile_navigation',
	//	trigger: '.trigger-mobile-menu',
	//	direction: 'right'
	//});
	//
	//jPM.on();
	//
	//	click(function (e){
	//	//$.magnificPopup.open({
	//	//  items: {
	//	//    src: $(this).attr('src'), // can be a HTML string, jQuery object, or CSS selector
	//	//    type: 'image'
	//	//  }
	//	//});
	//
	//	console.log(e.target);
	//
	//
	//	return false;
	//});
});


jQuery.fn.extend({
	sliderGallery: function(elm) {
		var currentPos = 0;
		var total = 0;
		var that = $(this);
		
		// var imgwidth_with_margin = $(that.find('img')[0]).outerWidth(true);
		// var imgwidth_without_margin = $(that.find('img')[0]).width();
		
		var element_selector = elm;
		
		
		var ww = 0;
		var ww_last = 0;
		var imgwidth_with_margin = 0;
		var imgwidth_without_margin = 0;
		var images_at_once = 0;
		var defaultMargin = 0;
		var defaultPadding = 0;
		var height = 0;
		var _timeout;
		var initdone = false;
		function initSizes()
		{
			
			ww = $(window).width();
			if( ww == ww_last )
				return;
			ww_last = ww;
			
			clearTimeout( _timeout );
			
			/*
			 * Unless it's the initial page load, debounce the resize end
			 * event and let the margin css transition have time to finish,
			 * so that we're not reading out values in midst of the transition.
			 */
			if( initdone )
			{
				that.css('margin-left', '' );
				_timeout = setTimeout( __initSizes, 550 );
				return;
			}
			
			__initSizes();
			initdone = true;
			
			function __initSizes() {
				images_at_once = 3;
				if( ww <= 990 ) images_at_once = 2;
				if( ww <= 720 ) images_at_once = 1;
				
				if( ww < 480 )
				{
					var left = ( that.parent().width() - $(that.find(element_selector)[0]).outerWidth() ) / 2;
					left = Math.round(left);
					
					if( $(that.find(element_selector)[0]).prop("tagName") === 'IMG' )
					{
						that.find(element_selector).css('margin-left', left + 'px' );
						var img_height = $(that.find(element_selector)[0]).height();;
					}
					else if( $(that.find(element_selector)[0]).prop("tagName") === 'DIV' )
					{
						var margins = that.outerWidth() - that.width();
						that.find(element_selector).outerWidth( (that.parent().width() - margins) + 'px' );
					}
				}
				else
				{
					if( $(that.find(element_selector)[0]).prop("tagName") === 'DIV' )
					{
						that.find(element_selector).width('');
					}
				}
				
				imgwidth_with_margin    = $(that.find(element_selector)[0]).outerWidth(true);
				imgwidth_without_margin = $(that.find(element_selector)[0]).width();
				
				defaultMargin = imgwidth_with_margin - imgwidth_without_margin;
				defaultPadding = that.outerWidth(true) - that.width() + defaultMargin;
				
				total = 0;
				that.find(element_selector).each(function (){
					total++;
					var h = $(this).outerHeight(true);
					if(height < h)
						height = h;
				});
				
				/*
				 * Hide navigation arrows if not needed
				 */
				if( total <= images_at_once )
				{
					total = images_at_once;
					
					var par = that.parent().parent();
					par.find(".gallery-arrow-left").hide();
					par.find(".gallery-arrow-right").hide();
				}
				
				
				that.height(height);
				that.css('overflow', 'hidden');
				that.width(total * imgwidth_with_margin);
				that.parent().css('overflow', 'hidden');
				
				slideTo(0);
			}
		}
		$(window).on('resize', initSizes);
		initSizes();
		
		
		function slideTo(i)
		{
			currentPos = i;
			
			// var left = ( -1 * (imgwidth_with_margin * i) + ((defaultMargin - defaultPadding)/2)) + 'px';
			var left =  ( -1 * ((imgwidth_with_margin * i) + defaultMargin - defaultPadding) ) + 'px';
			that.css('margin-left', left);
		}
		
		function slideBy(i)
		{
			currentPos += i;
			if( currentPos < 0 )
				currentPos = 0;
			if( currentPos >= (total - images_at_once) )
				currentPos = (total - images_at_once);
			
			slideTo( currentPos );
		}
		
		var par = $(this).parent().parent();
		par.find(".gallery-arrow-left").on('click', function(){
			slideBy(-1);
			return false;
		});

		par.find(".gallery-arrow-right").on('click', function(){
			slideBy(1);
			return false;
		});
		
		/*
		 * Can't touch this :<
		 */
		var touchstart_x = 0;
		var touchstart_xref = 0;
		$(this).on('touchstart', function (e){
			if(e.originalEvent.targetTouches.length > 1 )
				return;
			touchstart_x = e.originalEvent.targetTouches[0].pageX;
			touchstart_xref = parseInt( that.css('margin-left') );
			that.addClass('no_animation');
		});
		$(this).off('touchmove').on('touchmove', function (e){
			if(e.originalEvent.targetTouches.length > 1 )
				return;
			
			x = touchstart_x - e.originalEvent.targetTouches[0].pageX;
			// console.log(x);
			
			that.css('margin-left',
				touchstart_xref - x
			);
			return;
		});
		$(this).on('touchend', function (e){
			if( e.originalEvent.changedTouches.length > 1 )
				return;
			x = touchstart_x - e.originalEvent.changedTouches[0].pageX;
			
			that.removeClass('no_animation');
			
			var count = Math.round( x / (imgwidth_with_margin - defaultMargin) );
			
			// if( Math.abs(x) + defaultMargin > imgwidth_with_margin/2 )
			if( count != 0 )
			{
				slideBy(count);
				return false;
			}
			that.css('margin-left', touchstart_xref );
			return;
		});
	}
});

$(window).load(function(){
	
	$('.slider-empfehlungen > div').sliderGallery('> div');
	
	$('.lightbox-gallery').sliderGallery('img');
	
	var lanClose = ( _GLOBALS['language'] == 'en' ) ? "close" : "Schließen";
	var lanPrev = ( _GLOBALS['language'] == 'en' ) ? "Previous (Left arrow key)" : "Zurück (Pfeiltaste links)";
	var lanNext = ( _GLOBALS['language'] == 'en' ) ? "Next (Right arrow key)" : "Weiter (Pfeiltaste rechts)";
	var lanCounter = ( _GLOBALS['language'] == 'en' ) ? "%curr% of %total%" : "%curr% von %total%";
	
	$('.lightbox-gallery').each(function (){
		$(this).magnificPopup({
			delegate: 'a', // the selector for gallery item
			type: 'image',
			tClose: lanClose,
			fixedContentPos: true, // forces "position: fixed" backdrop of the overlay, required to disable scrolling on touch devices
			gallery: {
				enabled:true,
				tPrev: lanPrev,
				tNext: lanNext,
				tCounter: lanCounter
			}
		});
	});
});