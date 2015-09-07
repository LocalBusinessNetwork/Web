
var apiclient  = Backbone.Router.extend({


	  options : {}, 

	  routes: {
        "members" : "members",
        "*actions": "defaultRoute"
      },
      
      members : function() {
      	RWire.authorize(function(status){
      		if( status == "OK") {
      	      	RWire.api( 	'GET', '/api/v1/members/csv',
      				function (status, data) {
                                    if  ( status < 400 ) {
                                          var csv = document.createElement('a');
                                          csv.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
                                          csv.setAttribute('download', "members.csv");
                                          csv.click();
                                    }
                                    else { 
                                          alert(data);
                                    }
      				}, 
      				{});
      		}
      	});
      },

      defaultRoute : function (actions) {
      },

      initialize : function (options) {
            this.options = options;
      },
});