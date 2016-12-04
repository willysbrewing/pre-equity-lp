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



        (function(){
          function showPolicy(){
            $('.cookies').show();
          }
          if(parseInt(getCookie('wb_p')) !== 1){
            showPolicy();
            setCookie('wb_p', 1, 365);
            $('.cookies .close').click(function() {
              $('.cookies').fadeOut();
            })
          }
          var leads = database.ref("preequity/leads");
          leads.once('value').then(function(s){
            var counter = Object.keys(s.val()).length;
            $(".family-boost .number").html(counter);
          });
        })();

        // init material
        $.material.init();

        // init nav
        var myElement = document.querySelector('#main-nav');
        Headroom.options.offset = 70;
        var headroom  = new Headroom(myElement);
        headroom.init();

        // init header typewriter
        // $('#header #header-title').typed({
        //   stringsElement: $('#header #header-typed-title'),
        //   typeSpeed: 100,
        //   startDelay: 50,
        //   callback: function(){
        //     $('#header #header-subtitle').typed({
        //       stringsElement: $('#header #header-typed-subtitle'),
        //       typeSpeed: 100,
        //       callback: boostHeader
        //     });
        //   }
        // });

        // Do not delay load of page with async functionality: Wait for window load
        window.addEventListener('load',function(){

            // Real Time listener
            var leads = database.ref("preequity/leads");
            leads.on('value', function(s){
              var counter = Object.keys(s.val()).length;
              $(".family-boost .number").html(counter);
            });

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
                var policy = form.querySelector('#policy').checked;

                if(name && email && policy){
                  var processing = document.getElementById('processing-form');
                  processing.style.display = 'block';

                  firebase.auth().signInAnonymously().then(function(user){
                    var data = {name:name, email:email};
                    if (user) {
                      data.uid = user.uid;
                    }
                    database.ref('preequity/leads/').push(data).then(function(){
                      processing.style.display = 'none';
                      form.style.display = 'none';
                      var success = document.getElementById('success-form');
                      success.style.display = 'block';
                      try{
                        // SendMail
                        sendEmail(data);

                        // Track Event
                        dataLayer.push({'event': 'lead_real'});
                      }
                      catch(e){}
                    });
                  });
                }
              } catch(e){}
              return false;
            }

            function sendEmail(data){
              var url = 'https://notifications.api.willysbrewing.com/mail/send';
              var q = new XMLHttpRequest();
              q.open('POST', url, true);
              q.setRequestHeader('Content-Type', 'application/json');
              q.onreadystatechange = function(){
                if(this.readyState === 4){
                  if(this.status.toString()[0] == '2'){
                    // ok
                  }
                  else if(this.status.toString()[0] == '4' || this.status.toString()[0] == '5'){
                    // error
                  }
                  else{
                    // foo
                  }
                }
              };
              var payload = {
                'recipient': data.email,
                'subject': '',
                'content': '',
                'template':{
                  'id': 'c348a464-4240-4cf4-9c88-7b2c892070d7',
                  'data':{
                    'name': data.name
                  }
                }
              };
              q.send(JSON.stringify(payload));
            }

        }); // End of window load

    }); // End of jQuery context

})(); // End of use strict
