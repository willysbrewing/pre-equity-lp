'use strict';
(function() {

  const database = firebase.database();

    $(function(){

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

        // NAVBAR Toggle Bug
        //$('.navbar-toggle').on('click', function () {
        //  $($(this).data('target')).collapse('toggle');
        //});

        // Do not delay load of page with async functionality: Wait for window load
        window.addEventListener('load',function(){

            // init material
            $.material.init()

            /* IF INDEX PAGE */
            if(PAGE === 'index'){

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

              // Form
              var form = document.getElementById('register-form');
              if (form.attachEvent) {
                  form.attachEvent('submit', processForm);
              } else {
                  form.addEventListener('submit', processForm);
              }

              function processForm(e) {
                if (e.preventDefault) e.preventDefault();

                try{
                  var form = document.getElementById('register-form');
                  var name = form.querySelector('#inputName').value;
                  var email = form.querySelector('#inputEmail').value;
                  var stocks = form.querySelector('#selectStocks').value;
                  var policy = form.querySelector('#policy').checked;

                  if(name && email && stocks && policy){
                    var processing = document.getElementById('processing-form');
                    processing.style.display = 'block';

                    var data = {name:name, email:email, stocks:stocks};
                    firebase.auth().onAuthStateChanged(function(user) {
                      if (user) {
                        data.uid = user.uid;
                        sendRequest(data);
                        processing.style.display = 'none';
                        var success = document.getElementById('success-form');
                        success.style.display = 'block';
                        try{
                          dataLayer.push({'event': 'lead_real'});
                        }
                        catch(e){}
                      }
                    });
                    // Anonymous Sign In
                    firebase.auth().signInAnonymously();
                  }

                }
                catch(e){}
                return false;
              }

              function sendRequest(data){
                database.ref('preequity/leads/').push(data);
              }
            }

        }); // End of window load

    }); // End of jQuery context

})(); // End of use strict
