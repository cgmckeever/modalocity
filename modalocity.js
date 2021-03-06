MDLY = {};
MDLY.css = 'modalocity.css';
MDLY.overlay = (function(){
    var overlay = {};
    overlay.logging = false;
    var cssLoaded = false;
    var current = false;
    var init = false;
    var openInt = false;
    
    // elements
    var backdrop = '<div id="overlay__backdrop" class="overlay__backdrop"></div>';
    var modal = '<div id="overlay__modal"><a id="overlay__close-link" class="overlay__close" href="#">close</a><div id="overlay__content"></div></div>';
    
    overlay.cssInit = function(){
        cssLoaded = true;
      }
    
    overlay.init = function(settings){ 
      if(init) return;
      init = true;
      overlay.logging = (typeof settings.doLog != 'undefined') ? settings.doLog : false;
      
      jQuery('body').append(backdrop); 
      jQuery('body').append(modal);
      if(typeof settings.useCSS == 'undefined' || settings.useCSS) 
      {
        var css = (typeof settings.css != 'undefined') ? settings.css : MDLY.css;
        var cssObj = jQuery('<link>', {rel:'stylesheet', type:'text/css', href:css, onLoad:overlay.cssInit()});
        cssObj.appendTo('head');  
      }else cssLoaded = true;
      
      jQuery('body').on('click','.overlay__close',function(e){
          overlay.close('click');
          return false;
        });

      var backdropClose = (typeof settings.backdropClose != 'undefined') ? settings.backdropClose : true;  
      if(backdropClose)
      {   
        jQuery('.overlay__backdrop').bind('click', function(e) {overlay.log(overlay.opts);
            var obj = jQuery(e.target);
            if(obj.hasClass('overlay__backdrop') && (typeof overlay.opts.backdropClose == 'undefined' || overlay.opts.backdropClose) ) 
            { 
              overlay.close('backdrop');
              return false;
            }
          });
      }
          
      var escClose = (typeof settings.escClose != 'undefined') ? settings.escClose : true;  
      if(escClose)
      {
        jQuery('body').bind('keydown', function(e) {
          if(!current) return;
          
          if(e.which == 27 && (typeof overlay.opts.escClose == 'undefined' || overlay.opts.escClose) ) overlay.close('esc');
        });  
      }
    }
    
    // add triggers
    overlay.addTrigger = function(settings){
        overlay.log('adding: ' + settings.binding + ' trigger');
        jQuery('body').on('click','.'+settings.binding+'__trigger', function(){
          settings.trigger = jQuery(this);
          overlay.open(settings);
          return false;
        });
        if(!openInt && settings.openNow && !current)
        {
          overlay.log('auto-open: ' + settings.binding);
          openInt = setInterval(function(){
              if(cssLoaded)
              {
                clearInterval(openInt);
                overlay.open(settings);    
              }
            },300);          
        }
      };
    
    // Open the modal
    overlay.open = function(settings) {
      overlay.close('cleanup');
      overlay.opts = settings; 
      overlay.opts.target = '#'+overlay.opts.binding+'__content';
      overlay.log('loading: ' + overlay.opts.target);
      overlay.log(overlay.opts);
      
      jQuery('#overlay__content').empty().append(jQuery(overlay.opts.target));
      
      jQuery('#overlay__modal').css({
        width: settings.width || 'auto', 
        height: settings.height || 'auto'
      });

      jQuery('#overlay__backdrop').show();
      jQuery('#overlay__modal').show();
      if(overlay.opts.fixed) jQuery('#overlay__modal').css('position','fixed');
      (typeof overlay.opts.hideClose == 'undefined' || !overlay.opts.hideClose) ? jQuery('.overlay__close').show() : jQuery('.overlay__close').hide();
      overlay.center();
      
      if(typeof overlay.opts.openCallback == 'function') overlay.opts.openCallback(overlay.opts);
      
      jQuery(window).bind('resize.modal', overlay.center);
      current = overlay;
    };
   
    // Center the modal in the viewport
    overlay.center = function (){
      var t, l;
      t = Math.max(window.innerHeight - jQuery('#overlay__modal').outerHeight(), 0) / 2;
      l = Math.max(jQuery(window).width() - jQuery('#overlay__modal').outerWidth(), 0) / 2;

      jQuery('#overlay__modal').css({
        top:t + jQuery(window).scrollTop(), 
        left:l+ jQuery(window).scrollLeft()
      });
    };     
    
    // Close the modal
    overlay.close = function(eType) {
      if(!current) return;
      overlay.log(eType+' dismiss: ' + current.opts.target);
      jQuery('#overlay__modal').hide();
      jQuery('#overlay__modal').css('position','');
      jQuery('#overlay__backdrop').hide();
      jQuery('#'+overlay.opts.binding+'__parent').append(jQuery(current.opts.target));
      if(typeof current.opts.closeCallback == 'function') current.opts.closeCallback(current.opts);
      jQuery(window).unbind('resize.modal');
      current = false;
    };
    
    //simple logger
    overlay.log = function(msg){
      if(overlay.logging  && typeof console == 'object') console.log(msg); 
    };
    
    return overlay;
  }());