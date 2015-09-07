(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
 
    module.exports = factory(jquery, underscore, backbone);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone'], factory);

  } 
}(this, function ($, _, Backbone) {

	Backbone.rwcore = rwcore = (function(Backbone, _, $){
		var rwcore = {};

		var rct = {

			EL_ErrorMsgContainer : "#ErrorMsgContainer",
			EL_pickBackground : "#pickBackground",
			CL_overlay_background : ".overlay-background",
			EL_dismissHelp : "#dismissHelp",
			EL_FYIContainer : "#FYIContainer",
			JSP_LOGIN : "/login.jsp",
			EL_PopupContainer : "#PopupContainer" 

		};

		rwcore.pagingSize = 20;
		rwcore.errorHandlerTemplate = { location: '/Templates/Patterns/errorHandlerTemplate.html?version=6.0',value : null };
		rwcore.SocialNetworkIdentity = { location: '/Templates/SocialProfile/SocialNetworkIdentity.html?version=6.0',value : null };
		rwcore.SocialNetworkLogin = { location: '/Templates/SocialProfile/SocialNetworkLogin.html?version=6.0',value : null };
		rwcore.staticHelpTemplate = { location: '/Templates/Patterns/staticHelpTemplate.html?version=6.0',value : null };
		
		rwcore.init = function(options) {
			rwcore.options = options;
		};

		rwcore.cachein = function(key,value) {
			localStorage.setItem (key, value);
		}
		
		rwcore.cacheout = function(key) {
			return localStorage.getItem(key);
		}

		rwcore.JSONServerRequest  = function (url, verb, contentType) {
		  	var xmlHttp = new XMLHttpRequest()
		  	xmlHttp.open(verb,url,false);
		  	xmlHttp.send();
		  	if ( xmlHttp.status == 400 )
		  	{
		  		rwcore.FYI(xmlHttp.response);
		  		return null;
		  	}	

		  	return _.isUndefined(contentType) ? jQuery.parseJSON(xmlHttp.responseText) : xmlHttp.responseText ;
		};

		rwcore.getJSON  = function (url) {
		  	return rwcore.JSONServerRequest(url, "GET");
		};

		rwcore.getTemplate  = function (url) {
			// console.log(url + '?version=' + localStorage.getItem('rwAppVersion'));
		  	return rwcore.JSONServerRequest(url, 'GET', 'html');
		};

		rwcore.validEmail = function (email){      
			var emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?:com|net|org|biz|edu|gov|mobi|aero|museum|name)$/;
			return emailReg.test(email); 
		};

		rwcore.GetCaptcha = function () {
			return JSONServerRequest("/rwWebRequest?Captcha=GET", "GET")["Captcha"];
		};

		rwcore.Peek = function (item) {
			var xmlHttp = new XMLHttpRequest()
		  	xmlHttp.open("GET","/rwWebRequest?Peek=" + item,false);
		  	xmlHttp.send();
		  	if ( xmlHttp.status == 400 )
		  	{
		  		return null;
		  	}	
		  	return jQuery.parseJSON(xmlHttp.responseText);
		};
		
		rwcore.vmSnippet = Backbone.Model.extend({
			options : null,
		    initialize : function (options) {
		    	this.options = options;
		    },	   
			get: function (dataout, options){
				var thisRequest = $.Deferred();
				var promise = $.ajax({
			            type: 'POST',
			            url: '/rwWebRequest?',
  			            async: _.isUndefined(options) || _.isUndefined(options.async) ? true : options.async, 
			            cache: true,
			            dataType: 'json',
			            data: dataout,
			            timeout : 75000});
			    promise.done(function(data, textStatus, jqXHR) {			 	            
			 	          	thisRequest.resolve(data.snippet);
			        	});
			    promise.fail(function (response, status, error) {
			   	        	thisRequest.reject(response,status,error);
			        	});
			    return thisRequest;
			}
		});

		rwcore.StandardModel = Backbone.Model.extend({
			idAttribute : "id",
			options : null,
		    initialize : function (options) {
		    	this.options = options;
		    },	   
		    call: function( method, model,options) {
		    	return this.sync(method, model,options);
		    },	     
		    sync: function(method, model,options) {

			    var that = this;
			    var dataout = {} ;
			    if ( method == 'read' )	{
			    	dataout = that.options;
			    }
			    else {
			    	dataout = model.toJSON();
			    	dataout["module"] = that.options.module;
			    	dataout["bo"] = that.options.bo;
			    	dataout["bc"] = that.options.bc;
			    }
		
			    dataout["act"] = method;
				return that.doAjax('POST', dataout, options);
		    },
		    doAjax: function (verb, dataout, options){
				var that = this;
				var thisRequest = $.Deferred();
				var promise = $.ajax({
			            type: verb,
			            url: '/rwWebRequest?',
  			            async: _.isUndefined(options) || _.isUndefined(options.async) ? true : options.async, 
			            cache: true,
			            dataType: 'json',
			            data: dataout,
			            timeout : 75000});
			    promise.done(function(data, textStatus, jqXHR) {			 	            
			 	            var data_in = {};
			 	            if ( $.hasVal(data) && $.hasVal(data.data)) { 
			 	            	data_in = _.isUndefined(options) ? JSON.parse(data.data) : _.isUndefined(options.raw) ? JSON.parse(data.data) : data.data ;
				            	that.clear();
				            	if (!_.isUndefined(data_in["_id"])) {
				            		data_in['id'] = data_in["_id"]["$oid"];
			            		}
			            	}
			            	if ( !_.isUndefined(options)) {
			    				_.isFunction(options.success) && options.success(data_in, textStatus, jqXHR);
			        			_.isFunction(options.done) &&	options.done(that, textStatus,jqXHR);
			        		}
			        		thisRequest.resolve(data_in);
			        	});
			    promise.fail(function (response, status, error) {
			   	        	if ( !_.isUndefined(options)) {
			    				_.isFunction(options.error) && options.error(response,status,error);
			        			_.isFunction(options.done) && options.done();
			        		}
			        		thisRequest.reject(response,status,error);
			        	});
			    return thisRequest;
			}
	 	});

	  	rwcore.StandardModel.extend = Backbone.Model.extend;

	  	rwcore.StandardCollection = Backbone.Collection.extend({
	  		    model: rwcore.StandardModel,
		  		initialize : function (options) {
			    	this.options = options;
			    },
			   	
			   	setRawData: function(rawdata) {
					var that = this;
			    	if ( !_.isUndefined(rawdata)) {
			    			_.each(rawdata, function(elem) {
			    				that.create(elem);
			    			});
			    	}
			   	},

			    call : function( method, model,options) {
			    	return this.sync(method, model,options);
			    },
		    
	  		    sync: function(method, model,options) {
	  		    	var that = this;
   					var dataout = {} ;
	             	if( !$.hasVal(this.options.act) ){
	             		this.options.act = "read";
	             		dataout = {data: JSON.stringify(this.options)};
	             	} else if(this.options.act == "associate"){
	             		//dataout = model.toJSON();
	             		dataout = model.dataout;
	             	} else {
	             		dataout = {data: JSON.stringify(this.options)};
	             	}             	
	             	
	             	return that.doAjax('POST', dataout, options);	  			    	
	  			},
	  			doAjax: function(verb, dataout, options) {
	  				var that = this;
	  				var thisRequest = $.Deferred();
	  				var promise = $.ajax({
	  			            type: 'POST',
	  			            url: '/rwWebRequest?',
	  			            async: _.isUndefined(options) || _.isUndefined(options.async) ? true : options.async, 
	  			            cache: true,
	  			            dataType: 'json',
	  			            data: dataout,
				            timeout : 75000});
 	  			    promise.done(function(data, textStatus, jqXHR) {
		  			            var coll = new Backbone.Collection();
		  			            if ( $.hasVal(data) && $.hasVal(data.data)) { 
			    					var data_array_in = JSON.parse(data.data);
			    					data_array_in = $.toArray(data_array_in);
		  			            	_.each(data_array_in, function(data_in) {
		  			            		data_in['id'] = !_.isNull(data_in["_id"]) ? data_in["_id"]["$oid"] : 0;	
		  		            			var mod = new rwcore.StandardModel({module:that.options.module});
		  			            		mod.set(data_in);
		  			            		if (!_.isUndefined(that.options.calculatedFields)){
		  			            			for (var f in that.options.calculatedFields) {
		  			            				var fVal = that.options.calculatedFields[f](mod);
		  			            				var keyVal = new Object();
		  			            				keyVal[f] = fVal;
		  			            				mod.set(keyVal);
		  			            					
		  			            			}
		  			            		}

		  				            	coll.add(mod, {silent: true});
	  			            		});
		  			            }
					   	 		that.reset();
					   	 		
					   	 		if ( !_.isUndefined(options)) {
			  			            _.isFunction(options.success) && options.success(coll.models, textStatus, jqXHR);
					        		_.isFunction(options.done) &&	options.done(that.models, textStatus,jqXHR);
					        	}

				        		thisRequest.resolve(coll);
	  			    });
 	  			    promise.fail(function (response, status, error) {
 	  			    		if ( !_.isUndefined(options)) {
			    				_.isFunction(options.error) && options.error(response,status,error);
			        			_.isFunction(options.done) && options.done();
			        		}
			        		thisRequest.reject(response, status, error);
	  			    });
 	  			    return thisRequest;
	  			}
	  	});
	 
	  	rwcore.StandardCollection.extend = Backbone.Collection.extend;

	  	rwcore.LOVCollection = rwcore.StandardCollection.extend({
  		  	doCache : function (options) {
  		  		if( $.hasVal(options.skipCache) && options.skipCache ) return false;
 		    	var cachedCopy = rwcore.cacheout("LOV_" + this.options.LovType);
 		  		if ( !$.hasVal(cachedCopy)) return false;
	  			var data_array_in = JSON.parse(cachedCopy);
	  			var that = this;
            	that.reset();
            	var coll = new Backbone.Collection();
		  		_.each(data_array_in, function(data_in) {
            		if ( data_in ) {
	            		data_in['id'] = data_in["_id"]["$oid"];	
            			var mod = new rwcore.StandardModel({module:that.options.module});
	            		mod.set(data_in);
	            		coll.add(mod, {silent: true});
	            	}
            	});
				_.isFunction(options.success) && options.success(coll.models, null, null);
	    		return true;
  		  	},
		    sync: function(method, model,options) {
		    	var that = this;
	    		if  ( !this.doCache(options) ) {
	    			that.options.act = 'read';
	    		  	var promise = that.doAjax('POST', that.options, options );
	    		  	$.when(promise).done( function () {
	    		  		rwcore.cachein("LOV_" + that.options.LovType, JSON.stringify(that.models));
	    			}); 
	    		}
	    	}
	  	});

		rwcore.getLovDisplayVal = function(lovType, GlobalVal) {
			var plColl = new rwcore.LOVCollection ( { module : 'LovMgr', LovType : lovType, Locale : 'ENU'});
			plColl.fetch({ add : true, async : false, error : rwcore.showError }); // this is a sync call
			var item = _.find(plColl.models, function(model) {  return model.get('GlobalVal') == GlobalVal; });
	        return $.hasVal(item)? item.get('DisplayVal'): '';
		};

		rwcore.ErrorView = Backbone.View.extend({
			options : null,
		    initialize : function (options) {
		    	this.options = options;
		    },

		    events:{
		    	"click #cancelError": "cancel"
		    },
		    
		    cancel:function(event){
		    	//currently the event handler isn't firing. Might work with delegate events
		    	$(rct.EL_ErrorMsgContainer).hide(50);
		    	$(rct.EL_ErrorMsgContainer).html("");
		    	$(rct.EL_pickBackground).hide(50);
		    	event.preventDefault();
		    },

		    render:function () {
		    	var status = null;
		    	if ( $.hasVal(this.options.status) && $.hasVal(this.options.status.status)){
		    		status = this.options.status.status;
		    	}
		    	else if($.hasVal(this.options.request) && $.hasVal(this.options.request.status)){
		    		status = this.options.request.status;
		    	}
		    	var responseText = null;
				
				if ( !status ) { // these are client orginated errors
			    	responseText = this.options.status.statusText;
			    }
			    else { // these are system orignated errors
			    	responseText = !$.hasVal(this.options.status.responseText) ? this.options.request.responseText : this.options.status.responseText;
			    }		

			    if ( _.isNull(rwcore.errorHandlerTemplate.value) )
		                rwcore.errorHandlerTemplate.value = rwcore.getTemplate(rwcore.errorHandlerTemplate.location);
		        
			    $(this.el).html(_.template(rwcore.errorHandlerTemplate.value,{msg: responseText, status: status, _:_}));
				return this;
		    }
		});
		

	rwcore.HelpView = Backbone.View.extend({
			options : null,
			id : '#ErrorMsgContainer',
			backgroundSelector:".overlay-background",
			promise : null,
			initialize : function (options) {
		    	this.options = options;
		    	this.id = ($.hasVal(options.id))?options.id:this.id;
		    	this.backgroundSelector = ($.hasVal(options.backgroundSelector))?options.backgroundSelector:this.backgroundSelector;
		    	this.promise =  $.Deferred();
		    },
		    
		    dismiss:function(event){
			    event.data.promise.resolve($('#DONTSHOW:checked').length);
				$('#dismissHelp').off( "click");
		    	$(this.id).hide();
		    	$(this.id).html("");
		    	$(this.backgroundSelector).hide();
		    	event.preventDefault();
		    },

		    render:function () {

		    	if ( _.isNull(rwcore.staticHelpTemplate.value) )
		                rwcore.staticHelpTemplate.value = rwcore.JSONServerRequest(rwcore.staticHelpTemplate.location,'GET', 'html');
		     
  				$(this.id).html(_.template(rwcore.staticHelpTemplate.value, this.options)).trigger('create');;
		    	$(this.backgroundSelector).show();
				$(this.id).show(50);

				$('#dismissHelp').on("click", this, this.dismiss);
				
		    	return this.promise;
		    }

		});

		rwcore.FYI = function(message) {
				var FYIContainer = $(rct.EL_FYIContainer);
				FYIContainer.html("<table style='bakcground-color:yellow'>" + 
						"<tr><td align='right'><img id='closeAction' height='16px' width='16px' src='" + rwFB.CDN + "/images/icons/closeIconBlack.png'/></td></tr>" +
						"<tr><td align='left'><div style='font-size:14pt;color:blue'>" + 
						message + 
						"</div>" +
						"</td></tr></table>");
				FYIContainer.show();
				FYIContainer.on("click", FYIContainer, 
						function (event) { 
							var FYIContainer = $(rct.EL_FYIContainer);
							FYIContainer.hide();} 
				);
	    };
	     
	    rwcore.showError = function (request,status,error) {

	     	if ( status && (status.status == 401) ) {
	     		window.location = rct.JSP_LOGIN;
	     		return;
	     	}

	     	if( request &&  (request.status == 401 )) {
	     		window.location = rct.JSP_LOGIN;
	     		return;
			}

 	        var eView = new rwcore.ErrorView ({request:request,status:status,error:error}); 
 	        $(rct.EL_ErrorMsgContainer).html(eView.render().el).trigger('create');
 	        $(rct.EL_pickBackground).show(50);
 	        $(rct.EL_ErrorMsgContainer).show(50);
    	};

	    rwcore.showWaitDialog = function (htmlTemplate, options, callback) {
			var popUpContainer = $(rct.EL_PopupContainer);
			popUpContainer.html(_.template(htmlTemplate, {options: options}));
			popUpContainer.addClass("confirmation");
			$(rct.CL_overlay_background).show();
			popUpContainer.show();
			popUpContainer.one("click", "[popEvent]", options,function(target) {
				$(rct.CL_overlay_background).hide();
				popUpContainer.hide();
				_.isFunction(callback) && callback(target);
					//window.history.back();
			});
	    },

		rwcore.hideWaitDialog = function (status) {
			var popUpContainer = $(rct.EL_PopupContainer);
			$(rct.CL_overlay_background).hide();
			popUpContainer.hide();
			if ( !status )
					window.history.back();
	    },

		rwcore.FBLogout = function(options) {
			var promise = $.Deferred();
			$.when(facebookReady).done( function() {
          		FB.getLoginStatus(function(response) {
	              if (response.status === 'connected') {
            		if ( _.isNull(rwcore.SocialNetworkIdentity.value) )
    	    		    rwcore.SocialNetworkIdentity.value = rwcore.getTemplate(rwcore.SocialNetworkIdentity.location);	

	              		rwcore.showWaitDialog(rwcore.SocialNetworkIdentity.value, { title: "Facebook Identity",  
	              					src : "https://graph.facebook.com/" + response.authResponse.userID + "/picture"},
	              		function (target) {
	              			if ( target.currentTarget.id == "SocialYes") {
	              			        promise.resolve(response);
	              			}
	              			else {
	              				console.log(target);
								FB.logout(function(response) {
									rwFB.fbUserID = undefined;
						            promise.resolve(response);
					       	    });
	              			}
	              		}
	              	);
				  }
				  else 
				  	promise.resolve(response);
		      	});
			}).fail(function(response) { rwcore.FYI(response); promise.reject(response); });;
       	    return promise;
	  	};

		rwcore.FBLogin = function(options) {
        
        	var promise = $.Deferred();
        	$.when(facebookReady).done( function() {
        		try {
	          		FB.getLoginStatus(function(response) {
		              if (response.status === 'connected') {
							rwFB.fbUserID = response.authResponse.userID;
		                    promise.resolve(response.status);
		              } else if (response.status === 'not_authorized' ) {
		                  promise.reject("Facebook Interface has not been authorized. Please clear your browser cache, logout all your facebook sessions from all browsers. Connect again");
		              } else {
		                  FB.login(function(response) {
		                       if (response.authResponse) {
		                       		rwFB.fbUserID = response.authResponse.userID;
		                          	promise.resolve('Welcome! Facebook Logged you in.');
		                       }
		                       else { 
				                    promise.reject("Facebook Interface has not been authorized. Please connect again");
		                       }
		                  }); 
		              }
		      	  	}, true);
	          	}
	          	catch( e ) {
	          		console.log(e.message);
	          		promise.reject("An error occured connecting to Facebook Interface. Please clear your browser cache. logout all your facebook sessions from all browsers. connect again. Details: " + e.message );
		      	}

        	}).fail(function(response) { 
        			promise.reject("Facebook Interface has not been connected. Please clear your browser cache. logout all your facebook sessions from all browsers. Connect again.");
        	});

        	return promise;
      	};

      	rwcore.FBGetFriends = function(options) {
      	    var  promise = $.Deferred();
	    	$.when(facebookReady).done( function() {
		    	rwcore.FBLogin().done( function (fbResponse) { 
					var requestStr = '/me/friends';
			        var offset = _.isUndefined(options.offset)?'0':options.offset; 
		        	var pageSizeStr =  '?offset=' + offset + '&limit=' + rwcore.pagingSize;
		        	requestStr += pageSizeStr;
			        // console.log(requestStr);
			        FB.api(requestStr, 
			            function(response) {
			              if( !response || response.error ) {
			              	rwcore.FYI('An error occurred looking up facebook friends');
			              	promise.reject(response);
			              }
			              else {
				              promise.resolve(response.data);
			              }
			            }, 
			            {scope: 'publish_actions, status_update, manage_pages'}
			        );
		    	}).fail( function (response) { promise.reject(response);} );
		  	}).fail(function(response) { promise.reject(response); });
      	    return promise;
	    };

      	rwcore.LNLogin = function (options) {
     	    var promise = $.Deferred();
			$.when(linkedInReady).done( function() {
	          	IN.User.authorize(function() {
	               IN.API.Profile('me')
	                .fields(['id', 'pictureUrl','summary','headline'])
	                .result(function(me_data){
	                    rwFB.lnUserID = me_data.values[0].id;
	                	promise.resolve(me_data.values[0]);
	   				})
	   				.error(function(error){ promise.reject(error)});
	   			})
	        });
			return promise; 
      	};

		rwcore.LNAuthenticate = function (options) {
     	    var promise = $.Deferred();
			$.when(linkedInReady).done( function() {
				try {
					IN.API.Profile('me')
	                	.fields(['id', 'pictureUrl','summary','headline'])
	                	.result(function(me_data){
	                		 promise.resolve(me_data.values[0]);
	   				})
	   				.error(function(error){ if ( error.status == '401') IN.User.refresh(); promise.reject(error) });
	   			}
	   			catch(e) {
	   				$.when(rwcore.LNLogin()).done(function(response) { promise.resolve(response);} ); 
	   			}
	        });
			return promise; 
      	};

		rwcore.LNGetConnections = function (options) {
	        var promise = $.Deferred();
	        $.when(linkedInReady).done( function() {      
		        $.when(rwcore.LNAuthenticate())
		        	.done( function(myData) {
				          rwFB.lnUserID = myData.id;

	                      var params = {} ;
					  	  params['start'] = _.isUndefined(options.offset)?'0':options.offset; 
			        	  params['count'] = rwcore.pagingSize;
			        	  //console.log(params);
	                      IN.API.Connections('me')
	                          .fields(['id', 'firstName', 'lastName', 'pictureUrl'])
	                          .params(params)
	                          .result(function(result) {
	                          	// rwFB.lnConnections = result.values;
	                          	// console.log(result.values);
	                          	if ( !_.isUndefined(result.values) )
	                          	  promise.resolve(myData, result.values);
	                          	else
	                          	  promise.reject("NO RECORDS"); 
	                          })
	                          .error( function(msg) { 
	                          		if ( msg.status == '401') IN.User.refresh();
	                          		rwcore.FYI('Status : ' + msg.status + ' Error: ' +  msg.message); 
	                          		promise.reject(msg);
	                          });
	             	})
	            	.fail( function(error) { 
	            		if ( error.status == '401') IN.User.refresh();
	            		promise.reject(error); 
	            	});
	      	}).fail(function(response) { promise.reject(response); });
          	return promise;
      	};

    	rwcore.FBMatch =  function(options) {

			var promise = $.Deferred();
			
			$.when(facebookReady).done( function() {
		    
			    if ( _.isNull(rwcore.SocialNetworkLogin.value) )
		            rwcore.SocialNetworkLogin.value = rwcore.getTemplate(rwcore.SocialNetworkLogin.location);
		
			  	var promise1 = rwcore.FBGetFriends(options);
		      	promise1.done(function(data) {

		      		if (!data) {
		      			 promise.fail();
		      		}
					
		          	var cc = new rwcore.StandardCollection();
		      		
		          	cc.setRawData(data);
	          		var dataout = {act: 'getFBFriends',
	             		FaceBookId : rwFB.fbUserID,
	             		data: JSON.stringify(data) };
	          		var promise2 = $.ajax({
		                    type: "POST",
		                    url: "/fbhook?",
		                    async:  true , 
		                    cache: false,
		                    dataType: "json",
		                    data: dataout,
		                    timeout : 25000});

		          	promise2.done(function (data, textStatus, jqXHR) {
				            for ( var i = 0; i < data.length; i++ ) {
				                  var data_in = data[i];
				                  var socialId = data_in.substr(1, data_in.length);	
				                  var type = data_in.substr(0, 1);
				                  var found_models = cc.where({id:socialId});
				                  if ( !_.isUndefined(found_models) && (found_models.length > 0) ) {
				                  	 if ( type == 'm' )
				                      	found_models[0].set({rwmember : true});
				                     else 	
				                      	found_models[0].set({rwinvited : true});
				                  }
				            }
				            promise.resolve(cc);

		          	}).fail(function(response) { promise.reject(response.status); });
					
		      	}).fail(function(response) { promise.reject(response); });
			}).fail(function(response) {  promise.reject(response); });
	      	return promise;
	    }

		rwcore.LNMatch =  function(options) {
			var promise = $.Deferred();
			$.when(linkedInReady).done( function() {
				if ( _.isNull(rwcore.SocialNetworkLogin.value) )
		            rwcore.SocialNetworkLogin.value = rwcore.getTemplate(rwcore.SocialNetworkLogin.location);
			  	var promise1 = rwcore.LNGetConnections (options);
				promise1.done(function(mydata, myconnectionsdata) {
					var cc = new rwcore.StandardCollection();
		          	cc.setRawData(myconnectionsdata);
	          		var dataout = {act: 'getINConnections',
	             		LNProfileId : rwFB.lnUserID,
	             		data: JSON.stringify(myconnectionsdata) };
	          		var promise2 = $.ajax({
		                    type: "POST",
		                    url: "/fbhook?",
		                    async:  true , 
		                    cache: false,
		                    dataType: "json",
		                    data: dataout,
		                    timeout : 25000});
		          	promise2.done(function (data, textStatus, jqXHR) {
				            for ( var i = 0; i < data.length; i++ ) {
				                  var data_in = data[i];
				                  var found_models = cc.where({id:data_in});
				                  if ( !_.isUndefined(found_models) && (found_models.length > 0) )
				                      found_models[0].set({rwmember:true});
				            }
				            promise.resolve(cc);

		          	}).fail(function(response) { promise.reject(response); });
					
		      	}).fail(function(response) { promise.reject(response); });
			}).fail(function(response) { promise.reject(response); });

	      	return promise;
	    }

	    rwcore.spinOn = function (mode) { 
	    	if( _.isUndefined(mode)) {
			    $.mobile.loading( 'show', {
				text: rwFB.rwTenantName,
				textVisible: true,
				theme: 'b',
				html: ""
				});
			}
			else {
				$('#rwSpinner').css("top", mode.top); 
				$('#rwSpinner').css("left", mode.left); 
				$('#rwSpinner').css("z-index", 10000);				
				$('#rwSpinner').show();
			}
		}

		rwcore.spinOff = function (mode) { 
			if( _.isUndefined(mode)) {
				$.mobile.loading( 'hide');
			}
			else {
				$('#rwSpinner').hide();
			}
		}


		return rwcore;   
  	})(Backbone, _, $ || window.jQuery || window.Zepto || window.ender);
	return Backbone.rwcore; 
}));
