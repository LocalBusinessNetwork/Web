$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.mobile.ignoreContentEnabled = true;
    $.mobile.loader.prototype.options.text = "loading";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.textOnly = false;
    //$.mobile.loader.prototype.options.html = "<h1>Loading...</h1>";
    // Remove page from DOM when it's being replaced
   $('div[data-role="page"]').live('pagehide', function (event, ui) {

        $(event.currentTarget).remove();
    });
    
});
