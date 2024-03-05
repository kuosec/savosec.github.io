jQuery(document).ready(oxygen_content_timeline);
function oxygen_content_timeline($) {

function toggleTimeLineClass(oxyTimeLineItem) {
        let scrollPositionAttr = $(oxyTimeLineItem).attr('data-scroll-position');
        let scrollPosition;

        if (typeof scrollPositionAttr !== typeof undefined && scrollPositionAttr !== false ) {
            scrollPosition = (100 / parseInt($(oxyTimeLineItem).data('scroll-position')));
        } else if ( $(oxyTimeLineItem).closest('[data-content-timeline]').find('[data-scroll-position]').length ){
            scrollPosition = (100 / parseInt($(oxyTimeLineItem).closest('[data-content-timeline]').find('[data-scroll-position]').data('scroll-position')));
        } else {
            scrollPosition = 2;
        }

       if ($(oxyTimeLineItem).offset().top < (window.pageYOffset + window.innerHeight/scrollPosition - $(oxyTimeLineItem).height()/2)) {
            $(oxyTimeLineItem).addClass("oxy-content-timeline_active");
        } else {
            $(oxyTimeLineItem).removeClass("oxy-content-timeline_active");
        }
    };

    function timelinePosition(oxyTimeLineLine) {
        $(oxyTimeLineLine).find('.oxy-content-timeline_line').css({
                "opacity": '0'
        });
        let firstItem = $(oxyTimeLineLine).hasClass('oxy-dynamic-list') ? $(oxyTimeLineLine).children('.ct-div-block:first-of-type').find('.oxy-content-timeline') : $(oxyTimeLineLine).children('.oxy-content-timeline:first-of-type');
        let lastItem =  $(oxyTimeLineLine).hasClass('oxy-dynamic-list') ? $(oxyTimeLineLine).children('.ct-div-block:last-of-type') : $(oxyTimeLineLine).children('.oxy-content-timeline:last-of-type');
            $(oxyTimeLineLine).find('.oxy-content-timeline_line').css({
                "top": firstItem.innerHeight()/2 + 'px',
                "bottom": lastItem.innerHeight()/2 + 'px',
                "left": firstItem.find('.oxy-content-timeline_marker').offset().left + (firstItem.find('.oxy-content-timeline_marker').width()/2) - $(oxyTimeLineLine).offset().left + 'px',
                "opacity": '1'
            });
    };

    function animateTimeline(oxyTimeLineLine) {

        let scrollPositionAttr = $(oxyTimeLineLine).find('.oxy-content-timeline_inner[data-scroll="true"]').attr('data-scroll-position');
        let scrollPosition;

        if (typeof scrollPositionAttr !== typeof undefined && scrollPositionAttr !== false) {
            scrollPosition = (100 / parseInt($(oxyTimeLineLine).find('.oxy-content-timeline_inner[data-scroll="true"]').data('scroll-position')));
        } else {
            scrollPosition = 2
        }
        
        let timelineActive = $(oxyTimeLineLine).find('.oxy-content-timeline_line-active');
        let firstItemHeight = $(oxyTimeLineLine).hasClass('oxy-dynamic-list') ? $(oxyTimeLineLine).children('.ct-div-block:first-of-type').innerHeight() : $(oxyTimeLineLine).children('.oxy-content-timeline:first-of-type').innerHeight();
        let lastItemHeight = $(oxyTimeLineLine).hasClass('oxy-dynamic-list') ? $(oxyTimeLineLine).children('.ct-div-block:last-of-type').innerHeight() : $(oxyTimeLineLine).children('.oxy-content-timeline:last-of-type').innerHeight();
        let firstItemTop = $(oxyTimeLineLine).offset().top + (firstItemHeight/2) - (window.innerHeight/scrollPosition);
        let lastItemBottom = $(oxyTimeLineLine).offset().top + $(oxyTimeLineLine).outerHeight() - (lastItemHeight/2) - (window.innerHeight/scrollPosition);

        var scrolltop = window.pageYOffset;

        var scaleValue = 1 / (lastItemBottom - firstItemTop);
        var startScale = scrolltop - firstItemTop;
        var lineScale = startScale * scaleValue;

            if (lineScale < 0) {
                timelineActive.css({
                    transform: "scaleY(0)"
                });
            } else if (0 <= lineScale && lineScale <= 1) {
                timelineActive.css({
                    transform: "scaleY(" + (startScale * scaleValue) + ")"
                }); 
            } else {
                timelineActive.css({
                    transform: "scaleY(1)"
                });
            }   
    };

    $('.oxy-content-timeline_inner').each(function(i, oxyTimeLineItem){

        if ( $(oxyTimeLineItem).parents('.oxy-dynamic-list').length && !$(oxyTimeLineItem).parents('.oxy-dynamic-list[data-content-timeline]').length ) {
            $(oxyTimeLineItem).parents('.oxy-dynamic-list').attr('data-content-timeline','active');
            $(oxyTimeLineItem).parents('.oxy-dynamic-list[data-content-timeline="active"]').prepend('<span class="oxy-content-timeline_line"><span class="oxy-content-timeline_line-active"></span></span>');
        }

        if ( !$(oxyTimeLineItem).parents('.oxy-dynamic-list').length && $(oxyTimeLineItem).parents('[data-content-timeline]').length && !$(oxyTimeLineItem).parents('[data-content-timeline="active"]').length ) {
            $(oxyTimeLineItem).parents('[data-content-timeline]').attr('data-content-timeline','active');
            $(oxyTimeLineItem).parents('[data-content-timeline="active"]').prepend('<span class="oxy-content-timeline_line"><span class="oxy-content-timeline_line-active"></span></span>');
        }

        if ( true === $(oxyTimeLineItem).data('scroll') ) {
            toggleTimeLineClass(oxyTimeLineItem);
        }
    });
    
    $('[data-content-timeline]').each(function(i, oxyTimeLineLine){

        let firstItem = $(oxyTimeLineLine).hasClass('oxy-dynamic-list') ? $(oxyTimeLineLine).children('.ct-div-block:first-of-type').find('.oxy-content-timeline') : $(oxyTimeLineLine).children('.oxy-content-timeline:first-of-type');
        let timelineLine = $(oxyTimeLineLine).find('.oxy-content-timeline_line');

        timelineLine[0].style.setProperty("--timeline-line-color", window.getComputedStyle(firstItem[0]).getPropertyValue('--timeline-line-color'));
        timelineLine[0].style.setProperty("--timeline-line-colora", window.getComputedStyle(firstItem[0]).getPropertyValue('--timeline-line-colora'));
        timelineLine[0].style.setProperty("--timeline-line-width", window.getComputedStyle(firstItem[0]).getPropertyValue('--timeline-line-width'));

        timelinePosition(oxyTimeLineLine);
        $( window ).on('load', function() {
            timelinePosition(oxyTimeLineLine);
            clearTimeout(window.resizedFinished);
            window.resizedFinished = setTimeout(function(){
                window.dispatchEvent(new Event('resize'));
            }, 150);
        });

        
        $( window ).on('resize orientationchange', function() {
            timelinePosition(oxyTimeLineLine);
            clearTimeout(window.resizedFinished);

            window.resizedFinished = setTimeout(function(){
                timelinePosition(oxyTimeLineLine);
            }, 150);

        });


    });

    if ( $('.oxy-content-timeline_inner[data-scroll="true"]').length ) {

        var lastScrollY,
            scheduledAnimationFrame = false,
            isScrolling, 
            startedScrolling = false;

        $('[data-content-timeline="active"]').has('.oxy-content-timeline_inner[data-scroll="true"]').each(function(i, oxyTimeLineLine){
            animateTimeline(oxyTimeLineLine);
        });    

        function onScroll( e ) {
            
            lastScrollY = window.scrollY;
            if( scheduledAnimationFrame ) {
                return;   
            }        
            scheduledAnimationFrame = true;
            requestAnimationFrame( updatePage );
            
        }

        function updatePage( ) {

            scheduledAnimationFrame = false;

            $('.oxy-content-timeline_inner[data-scroll="true"]').parents('[data-content-timeline]').find('.oxy-content-timeline_inner').each(function(i, oxyTimeLineItem){
                toggleTimeLineClass(oxyTimeLineItem);
            });

            $('[data-content-timeline="active"]').has('.oxy-content-timeline_inner[data-scroll="true"]').each(function(i, oxyTimeLineLine){
                animateTimeline(oxyTimeLineLine);

                if(!startedScrolling) {
                    timelinePosition(oxyTimeLineLine);
                    startedScrolling = true;
                }

                window.clearTimeout(isScrolling);

                isScrolling = setTimeout(function() {
                    startedScrolling = false;
                }, 1000);
            });
            
        }

        window.addEventListener( 'scroll', onScroll, false );

    }
    
};    