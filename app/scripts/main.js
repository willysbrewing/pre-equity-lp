'use strict';
(function() {

    $(function(){
        console.log = function() {}

        /* Functions */
        function getCookie(cname) {
            var name = cname + '=';
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)===' ') {c = c.substring(1);}
                if (c.indexOf(name) === 0) {return c.substring(name.length,c.length);}
            }
            return '';
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = 'expires='+d.toUTCString();
            document.cookie = cname + '=' + cvalue + '; ' + expires;
        }

        function boostHeader(){
          //$('#header').addClass("gradient");
          $('#header').addClass('changed');
          $('#header .cta').css('opacity', '1');
          //$('#header .countdown').css('opacity', '1');
        }

        // NAVBAR Toggle Bug
        //$('.navbar-toggle').on('click', function () {
        //  $($(this).data('target')).collapse('toggle');
        //});

        // Do not delay load of page with async functionality: Wait for window load
        window.addEventListener('load',function(){

            // init material
            $.material.init()

            // init nav
            var myElement = document.querySelector('#main-nav');
            Headroom.options.offset = 70;
            var headroom  = new Headroom(myElement);
            headroom.init();

            // init smooth links
            $('a.smooth').click(function(e) {
                e.preventDefault();
                var $link = $(this);
                var anchor = $link.attr('href');
                $('html, body').stop().animate({
                    scrollTop : $(anchor).offset().top
                }, 500);
                return false;
            });

            // init header typewriter
            $('#header #header-title').typed({
              stringsElement: $('#header #header-typed-title'),
              typeSpeed: 100,
              startDelay: 50,
              callback: function(){
                $('#header #header-subtitle').typed({
                  stringsElement: $('#header #header-typed-subtitle'),
                  typeSpeed: 100,
                  callback: boostHeader
                });
              }
            });

            // countdown
            /*$("#promo .countdown").countdown("2016/11/01", function(event) {
              $(this).text(
                event.strftime('%D days %H:%M:%S')
              );
            });*/

        }); // End of window load

    }); // End of jQuery context

})(); // End of use strict
