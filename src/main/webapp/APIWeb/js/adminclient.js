
var apiadminclient  = Backbone.Router.extend({


	  options : {}, 

	  routes: {
        "registerApp" : "registerApp",
        "deleteApp" : "deleteApp",
        "*actions": "defaultRoute"
    },
      
    registerApp : function(formId) {

      var promise = $.ajax({
            type: 'POST',
            url: '/authz/apiapp?',
            data: $('#registerAppForm').serialize(),
            timeout : 75000});

      promise.done(function(data, textStatus, jqXHR) {     
          $('#newApp').modal('hide');
          location.reload();               
      });

      promise.fail(function (response, status, error) {
          alert(response.responseText);
      });

    },

    deleteApp : function ( appid ) {
    
    var promise = $.ajax({
            type: 'DELETE',
            url: '/authz/apiapp?',
            data: { id : appid },
            timeout : 75000});

      promise.done(function(data, textStatus, jqXHR) {     
          location.reload();               
      });

      promise.fail(function (response, status, error) {
          alert(response.responseText);
      });
    },

    updateApp : function ( appid, CorsUris ) {
    
    var promise = $.ajax({
            type: 'POST',
            url: '/authz/apiapp?',
            data: { id : appid, CorsUris : CorsUris },
            timeout : 75000});

      promise.done(function(data, textStatus, jqXHR) {     
          location.reload();               
      });

      promise.fail(function (response, status, error) {
          alert(response.responseText);
      });
    },

    defaultRoute : function (actions) {
    },

    initialize : function (options) {
          this.options = options;
    },
});