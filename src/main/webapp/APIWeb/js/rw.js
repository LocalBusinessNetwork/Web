
try { window.RWire || (function(window) {

	if ( !window.jQuery ) {
		throw 'JQuery is a dependency for Referralwire Module';
	}

	var self = window, document = window.document;
	
	// Here "addEventListener" is for standards-compliant web browsers and "attachEvent" is for IE Browsers.
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];

	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	window.RWire = {
			options : null, 
			authCallback : function() {} 	
	};

	
	window.RWire.init = function(options) {
		RWire.options = options;
	};
	
	window,RWire.getToken = function() {
		return localStorage.getItem('_rw_auth_token_');
	};

	window.RWire.saveToken = function(token) {
		localStorage.setItem ('_rw_auth_token_', token);
	};

	eventer(messageEvent, function (e) {
		var token = e.data;
		var if1 =  document.getElementById(window.location.origin);
		if1.style.display = 'block';

		if ( token === "CANCELED") {
			RWire.authCallback ("CANCELED");
		}	
		else {
		    RWire.saveToken(token);
		    RWire.authCallback ("OK");
		}
		if1.parentNode.removeChild(if1);
		
	}, false);

	window.RWire.authorize = function (callback) {
		if ( !RWire.getToken() ) {
			var if1 = $('<iframe>');
			if1.attr('id', window.location.origin);
			if1.css({
			  'width':'400px',
			  'height':'330px',
			  'position':'absolute',
			  'top': $('body').scrollTop() + 20,
			  'left': '300px'
			});
			if1.attr('src', RWire.options.url + '/authz/authorize' + '?response_type=token&client_id=' + RWire.options.appId + 
	 				'&redirect_uri=%2Ftoken');
			if1.appendTo($('body'));
			RWire.authCallback = callback;
		}
		else
			callback("OK"); 
	};


	window.RWire.api = function ( verb, resource, callback, options) {
		if ( RWire.getToken() ) { 	

			var xmlHttp = new XMLHttpRequest();
			var ep = RWire.options.url + resource;
		  	xmlHttp.open(verb,ep,false);
		  	xmlHttp.setRequestHeader("Authorization", "Bearer " + RWire.getToken() );

		  	try {
		  		xmlHttp.send();
		  	}
		  	catch(e) {
				callback(400,e);	
		  	}

		  	if ( xmlHttp.status == 400 || xmlHttp.status == 500 )
		  	{
		  		callback(xmlHttp.status, xmlHttp.response);
		  	}
		  	else callback(xmlHttp.status, xmlHttp.responseText);
		}
		else 
			callback(401,'not authorized');	
	};

}).call({}, window.inDapIF ? parent.window : window);

} catch (e) {
	alert(e);
}	