MDLY = {};
MDLY.overlay = (function(){
    var overlay = {};
    var current = false;
    var firstLoad = false;
    var logActive = false;
    var init = false;
    
    // elements
    var backdrop = '<div id="overlay__backdrop" class="overlay__backdrop"></div>';
    var modal = '<div id="overlay__modal"><a id="overlay__close-link" class="overlay__close" href="#">close</a><div id="overlay__content"></div></div>';
    var css = jQuery('<link>', {rel: "stylesheet", type: "text/css", href: 'modalocity.css'});
    
    overlay.init = function(doLog){ 
      if(init) return;
      init = true;
      logActive = doLog;
      
      jQuery('body').append(backdrop); 
      jQuery('body').append(modal);
      css.appendTo('head');  
       
      jQuery('body').on('click','.overlay__close',function(e){
          overlay.close('click');
          return false;
        });
      jQuery('.overlay__backdrop').bind('click', function(e) {
          var obj = jQuery(e.target);
          if(obj.hasClass('overlay__backdrop')) 
          { 
            overlay.close('backdrop');
            return false;
          }
        });    
      jQuery('body').bind('keydown', function(e) {
        if(!current) return;
        if(e.which == 27) overlay.close('esc');
      });  
    }
    
    // add triggers
    overlay.addTrigger = function(settings){
        overlay.log('adding: ' + settings.binding + ' trigger');
        if(settings.open && !firstLoad) 
        {
          overlay.open(settings);
          firstLoad = true;    
        }
        jQuery('body').on('click','.'+settings.binding+'__trigger', function(){
          settings.trigger = jQuery(this);
          overlay.open(settings);
          return false;
        });
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
      jQuery(overlay.opts.target).show();
      overlay.center();
      
      if(typeof overlay.opts.openCallback == 'function') overlay.opts.openCallback(overlay.opts);
      
      jQuery(window).bind('resize.modal', overlay.center);
      current = overlay;
    };
   
    // Center the modal in the viewport
    overlay.center = function (){
      var t, l;
      t = Math.max(jQuery(window).height() - jQuery('#overlay__modal').outerHeight(), 0) / 2;
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
      jQuery('#overlay__backdrop').hide();
      jQuery('body').append(jQuery(current.opts.target));
      jQuery(current.opts.target).hide();
      if(typeof current.opts.closeCallback == 'function') current.opts.closeCallback(current.opts);
      jQuery(window).unbind('resize.modal');
      current = false;
    };
    
    //simple logger
    overlay.log = function(msg){
      if(logActive  && typeof console == 'object') console.log(msg); 
    };
    
    return overlay;
  }());