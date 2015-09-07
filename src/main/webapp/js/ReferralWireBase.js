(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
    var rwcore = require('rwcore');
    var templatecache = require('templatecache');
    
 
    module.exports = factory(jquery, underscore, backbone, rwcore, templatecache);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone', 'rwcore','templatecache'], factory);

  } 
}(this, function ($, _, Backbone, rwcore, templatecache) {

	Backbone.ReferralWireBase = ReferralWireBase = (function(Backbone, _, $, rwcore, templatecache){
		var ReferralWireBase = {} ; 

		var slice = Array.prototype.slice;
 		ReferralWireBase.extend = Backbone.Model.extend;
		ReferralWireBase.Templatecache = templatecache ;
 	
		ReferralWireBase.init = function(options) {
			ReferralWireBase.options = options;
			var currentVersion = localStorage.getItem("rwAppVersion");
			if (!$.hasVal(currentVersion)  || (currentVersion != options.AppVer) ) {
				localStorage.clear();
				localStorage.setItem("rwAppVersion", options.AppVer);
			}
		};


 		ReferralWireBase.FullContact = {
  			findByEmail : function(email) {
  					var data = rwcore.getJSON ("/rwWebRequest?module=ContactsMgr&act=FullContact&emailAddress=" + email);
  					return jQuery.parseJSON(data.data);
  			}
  		};
		

		ReferralWireBase.setDefaultValues = function(model, metaapplet,model_in) {
			
			if (!$.hasVal(metaapplet.model.attributes.field)) {  return ""; }
		    var fields = $.toArray(metaapplet.model.attributes.field);
	     	var items = {};
			_.each(fields, function(field) {	    	
    		  items[field["fldname"]] = "";
        	  if ($.hasVal(model_in))  items[fields["fldname"]] = model_in.get(field["fldname"]);
        	  if ( !$.hasVal(items[field["fldname"]]) && $.hasVal(field["defaultValue"])) {
        	  	var defaultVal = field["defaultValue"];

        	  	if ( typeof(defaultVal) == "string" && defaultVal.indexOf("[") > -1){
        	  		
        	  		defaultVal = defaultVal.replace("[","");
        	  		defaultVal = defaultVal.replace("]","");
        	  		defaultVal = rwFB[defaultVal];
        	  	}

	       	  	if ( defaultVal  == 'RANDOM_NUMBER' )
	  				defaultVal = Math.random() * 100000000;
	  			else if ( defaultVal  == 'RANDOM_STRING' ) {
  					defaultVal = Math.random() * 100000000;
  					defaultVal = 'STR' + defaultVal.toString();
	  			}
      
			   	items[field["fldname"]] = defaultVal;
        	  	if (field.dataType == "address"){
        	  		var parts =  $.toArray(field.part);
        	  		_.each(parts,function(part){
        	  			if ( !$.hasVal(items[part["fldname"]]) ) {
        	  				defaultVal = part["defaultValue"];

			        	  	if (defaultVal.indexOf("[") > -1){
			        	  		
			        	  		defaultVal = defaultVal.replace("[","");
			        	  		defaultVal = defaultVal.replace("]","");
			        	  		defaultVal = rwFB[defaultVal];
			        	  	}
			        	  	items[part["fldname"]] = defaultVal;
        	  			}
        	  		});
        	  	}
        	  }
 		    });

	  		try {
		        model.set(items);
    	  	} catch (e) {
    	  		// ignore this exception;
    	  	}

	    	return true;
		};

		ReferralWireBase.setPostDefaultValues = function(model, metaapplet) {
			
			if (!$.hasVal(metaapplet.model.attributes.field)) {  return ""; }
		 
		    var fields = $.toArray(metaapplet.model.attributes.field);
		    var items = {} ;

	     	_.each(fields, function(field) {	    	

				if ( $.hasVal(field["postDefaultValue"])) {
	
	        	  	var defaultVal = field["postDefaultValue"];

					if ( typeof(defaultVal) == "string" && defaultVal.indexOf("[") > -1){
        	  			defaultVal = defaultVal.replace("[","");
        	  			defaultVal = defaultVal.replace("]","");
        	  			defaultVal = model[defaultVal];
        	  		}
        	  		
        	  		if ( defaultVal  == 'RANDOM_NUMBER' )
        	  			defaultVal = Math.random() * 100000000;
        	  		else if ( defaultVal  == 'RANDOM_STRING' ) {
        	  			defaultVal = Math.random() * 100000000;
        	  			defaultVal = 'STR' + defaultVal.toString();
        	  		}
        	
        	  		items[field["fldname"]] = defaultVal;
	         	}
        	});  		

			try {
		        model.set(items);
    	  	} catch (e) {
    	  		// ignore this exception;
    	  	}
	     	
	    	return true;
		};

		ReferralWireBase.fieldRenderer = function(field, roflag) {
	  		var f = new ReferralWireBase.FieldView({field:field});
	  		return f.render(roflag).el.innerHTML;
		};
	
		ReferralWireBase.validateRequired = function (model, metaapplet) {
		
		var fields = metaapplet.model.attributes.field;
		
    	if (_.isUndefined(fields)) {
    		return null;
    	}
	
    	// if there is one field in the applet, then convert it to an array
    	if ( _.isArray(fields) == false ) {
    		fields = [fields];
    	}

		var affenders = {};
 	
    	for (var i = 0; i < fields.length; i++) {
    		  var required = fields[i]["required"];
    		  
    		  if ( !_.isUndefined(required) && required == true) {
    	   		  var name = fields[i]["fldname"];
    	   		  var value = model.get(name);
    	   		  var label = fields[i]["label"];
    	   		  
    	   		  //DON'T USE "_.isEmpty" -- IT PRODUCES THE WRONG BEHAVIOR FOR NUMERIC VALUES!!!!! :-)  
    	   		  if ( _.isUndefined(value) || _.isNull(value) || value=="") {
    	   			  
    	   			var re = new RegExp(/\[(.*?)\]/g);
    				var fieldNameAry = label.match(re);
    				
    				if ($.hasVal(fieldNameAry) && fieldNameAry.length > 0){

    					for (j=0;j<fieldNameAry.length;j++){
    						var field = fieldNameAry[j];
    						var fieldName = field.replace("[","");
    						fieldName = fieldName.replace("]","");
    						var getFieldExp = model.get(fieldName);
    						label = label.replace(field,getFieldExp);
    					}
    				}
    	   			  
    	   			 
    	   			  affenders[name] = '"'+label+'"<p>'// + " <span class='isRequired'>is required</span>"; 
    	   		  }    			  
    		  }
    	}
    	return _.isEmpty(affenders) ? null : affenders ;
  		};
  		
	
		ReferralWireBase.recordBinder = function (appletTemplate, data) {
	  	
			// there is nothing to bind when server resturns empty results.
			if ( !$.hasVal(data)) return appletTemplate;
		
			var that = this;
			
			// bind all text boxes - INPUT
			var inputEls = appletTemplate.querySelectorAll("input");
			
			for ( var i = 0; i < inputEls.length; i++ ) {
				
				// Don't bother Idless items
				if (_.isEmpty(inputEls[i].id)) continue;

				var databind = $(inputEls[i]).attr("databind");
				if (!_.isEmpty(databind) || databind == 'false') continue;


				var value = data.attributes[inputEls[i].id];
				inputEls[i].setAttribute('value', '');
				if ( !_.isUndefined(value) && !_.isNull(value))
				{	
					
					var type = inputEls[i].type;
					var rName = (!_.isUndefined(inputEls[i].name))?inputEls[i].name:"";
					inputEls[i].setAttribute('value', value);
					
					/*
					if ( type === 'password' || type === 'text' || type === 'tel' || type === 'url' || type === 'number' || 
							type == 'checkbox' || type == 'radio' || type == 'email' || type == 'datetime' || type == 'date' || type == 'time') {
						inputEls[i].setAttribute('value', value);
					}
					*/

					if (type == 'checkbox'){
						var isMulti = (!_.isUndefined(inputEls[i].attributes['multicheckbox'])||(!_.isUndefined(inputEls[i].attributes['multicheckbox_search'])))?true:false;
						if (value == "true" & !isMulti){inputEls[i].setAttribute('checked', 'checked');}
						
						
						var valStr = (typeof value == "string")?value:new String(value);
						if (isMulti && valStr.indexOf(rName)>-1){
							inputEls[i].setAttribute('checked', 'checked');
						}
						
					}
					else if (type == 'radio' && rName == value){
						inputEls[i].setAttribute('checked','true');
					}
				}
			}

			// bind pickable lovs - SELECT
			var selects = appletTemplate.querySelectorAll("select");

			for (var i = 0 ; i < selects.length ; i++) {

				// Don't bother Idless items
				if (_.isEmpty(selects[i].id)) continue;

				var value = data.attributes[selects[i].id];
				var options = selects[i].options;
				// cleanup
				for (var j = 0; j < options.length; j ++) {
						options[j].removeAttribute('selected');
				}
				// set
				if ( !_.isUndefined(value) && !_.isNull(value) && !_.isEmpty(value))
				{	
					for (var j = 0; j < options.length; j ++) {
						if (options[j].value === value )
							options[j].setAttribute('selected','true');
					}
				}
				// set default
				else {
					options[0].setAttribute('selected','true');
				}
			}
			
			// bind all images - IMG
			var imgEls = appletTemplate.querySelectorAll("img");

			for ( var i = 0; i < imgEls.length; i++ ) {
				
				// Don't bother Idless items
				if (_.isEmpty(imgEls[i].id)) continue;
				
				var value = data.attributes[imgEls[i].id];
				
				if (!_.isUndefined(value) && !_.isNull(value) && value !="")
					imgEls[i].setAttribute('src',value);
			}

			// bind all text areas
			var textareaEls = appletTemplate.querySelectorAll("textarea");

			for ( var i = 0; i < textareaEls.length; i++ ) {
				
				// Don't bother Idless items
				if (_.isEmpty(textareaEls[i].id)) continue;

				var value = data.attributes[textareaEls[i].id];
				//textareaEls[i].setAttribute('value','');
				if ( !_.isUndefined(value) && !_.isNull(value))
					textareaEls[i].innerHTML = value;
					//textareaEls[i].setAttribute('value',value);
					
			}
			
			// bind bulleted Lists
			
			var bulletEls = appletTemplate.querySelectorAll("[bulletlist]");
			var listTemplate = $(_.template('Snippets')()).find(".profileBulletList");
			var listItemTemplate = $(_.template('Snippets')()).find(".profileBulletItem");
			var bulletGroup = $(_.template('Snippets')()).find(".bulletGroupContainer");
			
			for ( var i = 0; i < bulletEls.length; i++ ) {
				
				// Don't bother Idless items
				if (_.isEmpty(bulletEls[i].id)) continue;
				var thisListTemplate = listTemplate.clone();
				$(bulletEls[i]).show();
				$(bulletEls[i]).find('ul').remove();
				
				var value = data.attributes[bulletEls[i].id];
				if ( !_.isUndefined(value) && !_.isNull(value) && value!=""){
					
					
					var itemArray = value.split("\n");
					var retVal;
					
				    for (j=0;j<itemArray.length;j++) {	
				    	var thisItem = listItemTemplate.clone();
				    	thisItem.html(itemArray[j]);
				    	thisListTemplate.append(thisItem);
				    }
					
					
					$(bulletEls[i]).append(thisListTemplate);
					
				}
				else {
					$(bulletEls[i]).hide();
				}
					
			}
			
			// bind all read-only spans
			var spanEls = appletTemplate.querySelectorAll("span");

			for ( var i = 0; i < spanEls.length; i++ ) {
				
				// Don't bother Idless items
				if (_.isEmpty(spanEls[i].id)) continue;
				
				var value = data.attributes[spanEls[i].id];
				if ( !_.isUndefined(value) && !_.isNull(value))
					
				
					spanEls[i].innerHTML = value;
			}
			
			// this replaces empty values in dynamic pick applet launch buttons with "Choose One"
			
			
			var emptyPickSpans = appletTemplate.querySelectorAll("[pickapplet] span");
			
			for ( var i = 0; i < emptyPickSpans.length; i++ ) {
				
				// Don't bother Idless items
				if (_.isEmpty(emptyPickSpans[i].id)) continue;
				
				var value = data.attributes[emptyPickSpans[i].id];
				if ($.hasVal(value) == false)
					emptyPickSpans[i].innerHTML = "Choose One";
			}
			
		
			// after all these substitutions, there will still be some cases for dynamic substitution.
			// Examples are: List ap
			
			var re = new RegExp("Zlhs","g");
			var str = appletTemplate.innerHTML;
			
			str = str.replace(re,"<%=");
			
			re = new RegExp("Zrhs","g");
			str = str.replace(re,"%>");
			
			try {
				var boundEl = _.template(str, {model: data, _:_, getLovDisplayVal: rwcore.getLovDisplayVal});
			}
			catch (e) {
				// log any template errors
				console.log(e);
			}

			return boundEl;
		};
	
	 	ReferralWireBase.PickList = Backbone.View.extend({
	 		initialize:function (options) {
	 				this.options = options;
	 				this.pickListTemplate = ($.hasVal(options.pickTemplate))?options.pickTemplate: requirejs('text!/Templates/Lists/StdPicklistTemplate.html');
	 		},
	 		render:function (eventName) {

	 			$(this.el).html(_.template(this.pickListTemplate, {model : this.model,key:this.options.key,display:this.options.display,displayListField:this.options.displayListField,radioField:this.options.radioField,fldname:this.options.fldname, order:this.options.order,readonly : eventName, _:_}));	
	 			return this;
	 		}
	 	});
	   
	 	ReferralWireBase.FieldModel = Backbone.Model.extend();

	 	ReferralWireBase.FieldView = Backbone.View.extend({
	 		initialize:function (options) {
	     		this.model = options.field;
	 		},
		    
	 		render:function (roflag) {
	 	    	var that = this;
	 	    	var type = that.model["dataType"];
	 	    	//var template = ReferralWireBase.Templatecache.fields[type](); // TODO: () this eventually go away..
	 	    	var template = ReferralWireBase.Templatecache.fields[type];
	 	    	//if (!_.isFunction(template))
	 	    	//template = ReferralWireBase.Templatecache[template]();
	 	    		
	 	    	var CaptchaURL =  (type == "Captcha" && roflag == false) ? rwcore.GetCaptcha() : "";
	     		var fldHtml = _.template(template, {readonly : roflag, attributes: this.model, url: CaptchaURL, _:_ });
	     		var lovType = that.model["lovType"];
	     		var lovGroup = that.model["lovGroup"];
	     		var pickApplet = that.model["pickApplet"];
	     		var plTmplt = that.model["pickListTemplate"];
	     		var mcsKey = that.model["lookupKeyField"];
	     		var mcsDisp = that.model["lookupDisplayField"];

	     		if ($.hasVal(lovType) && type == 'multicheckbox' && roflag){
	     			fldHtml = _.template('MultiCheckBoxes', {readonly : roflag, attributes: this.model, url: CaptchaURL, _:_ });
	     		} else {
	  
		     		if ($.hasVal(lovType) && _.isUndefined(pickApplet)) {
		     			
		     			var filterValue = this.model.dynamicFilterValue;
		     			var applyToField = this.model.applyFilterToLovField;
		     			var skipCache = false;
		     			var searchSpec = null;
		     			if ($.hasVal(filterValue) && $.hasVal(applyToField)){
		     				searchSpec = new Object();
		     				searchSpec[applyToField] = filterValue;
		     				skipCache = true;
		     			}
		     			var plColl = new rwcore.LOVCollection ( { 
		     				module : "LovMgr", 
		     				LovType : lovType, 
		     				Locale : "ENU", 
		     				Group : _.isNull(lovGroup) ? undefined : lovGroup,
		     				constraint: _.isNull(searchSpec) ? undefined : searchSpec ,
		     				skipCache:skipCache
		     			});
		     			
		     	    	plColl.fetch({
		 				 	  add : true,
		 				 	  async : false,
		 				 	  error : rwcore.ShowError, 
		 				 	  success : function (model, response, jqXHR) {
		 				 		var pickTemplate = 'StdPickList';
		 				 		if (type=="radio"){pickTemplate = "RadioButtons"};
		 				 		if (type=="multicheckbox"){pickTemplate = "MultiCheckBoxes"};
		 				 		if (type=="multicheckbox_search"){pickTemplate = "MultiCheckBoxes_Search"};
		 				 		
		 		    			var pl = new ReferralWireBase.PickList({ 
		 		    				model: model,  
		 		    				fldname: that.model["fldname"],
		 		    				displayListField: that.model["displayListField"],
		 			 				pickTemplate:pickTemplate,
		 			 				key:mcsKey,
		 			 				display:mcsDisp
		 		    			});
		 		    			// Attach Picklist
		 		    			
		 		    			fldHtml = pl.render(roflag).el.innerHTML;
		 		    		}		
		     	    	});
		     		}
		     	}
	     		
	     		if (_.contains(["radio","multicheckbox_search"],type) && $.hasVal(pickApplet)){
	     			var pickTemplate = null;
	     			if (type=="radio"){pickTemplate = "RadioButtonsDynamic"};
			 		if (type=="multicheckbox"){pickTemplate = "MultiCheckBoxes"};
			 		if (type=="multicheckbox_search"){pickTemplate = plTmplt};

	     			var radioModel = this.model.radioList;
	     			var radioField = ($.hasVal(that.model.radioField))?that.model.radioField:that.model.fldname;
	     			var pl = new ReferralWireBase.PickList({ 
	 		    				model: radioModel,  
	 		    				fldname: that.model.fldname,
	 		    				displayListField: that.model["displayListField"],
	 		    				order:that.model.order,
	 		    				radioField:radioField,
	 			 				pickTemplate:pickTemplate,
	 			 				key:mcsKey,
	 			 				display:mcsDisp
	 		    			});
	 		    			// Attach Picklist
	 		    	fldHtml = pl.render(roflag).el.innerHTML;
	     		}
	     		
	     		
	     		if (roflag == false ) {
	     			if ($.hasVal(pickApplet) && !_.contains(["radio","multicheckbox_search"],type)) {
	     				fldHtml = _.template('pickLaunchButton', {insideHtml : fldHtml, model:that.model });
	     			}
	     		}
	     		
	     		else {
	     			var drilldown = that.model["drilldown"];
	     			if (!_.isUndefined(drilldown) && !_.isNull(drilldown) && drilldown.length > 0 ) {
	     				fldHtml = _.template('drilldownTemplate', {insideHtml : fldHtml, model:that.model });
	     			}
	     		}
	     		$(this.el).html(fldHtml);
	     		
	  	        return this;
	 	    }
	 	});

		ReferralWireBase.RepoObjectModel = Backbone.Model.extend({
	 		options : null,
		   	sync: function() {
		   		var that = this;
		   		var cachedCopy = localStorage.getItem(that.options.type + "." + that.options.name);
		   		if (!_.isUndefined(cachedCopy) && !_.isNull(cachedCopy))
		   			this.set(JSON.parse(cachedCopy));
		   		else {
		   			var data = rwcore.getJSON("/rwWebRequest?module=RepoMgr&act=" + that.options.type + "&name=" + that.options.name); 
		   			if ( !_.isUndefined(data) && !_.isNull(data)) {
		   				this.set(data);
		       			localStorage.setItem (that.options.type + "." + that.options.name, JSON.stringify(this));
		   			}
		   		}
		   	},
		   	initialize : function (options) {
		   	  this.options = options; 
		 	  _.isUndefined(options) ? rwcore.FYI('Repo Data is missing'): this.sync();
		   	}
	 	});

	 	ReferralWireBase.AppletView =  Backbone.View.extend({
			actor: "",
			applet: "",
			template: "",
			showViewBar: false,
			viewBarTemplate:null,
		    initialize:function (options) {
		    	this.applet = options.applet;
		    	this.template = options.template;
		    	this.model = new ReferralWireBase.RepoObjectModel({ type: 'Applet', name : this.applet});
		    	// this.model = new ReferralWireBase.AppletModel({params: this.applet});
		    	this.actor = this.model.get("actor");
		    	this.bc = this.model.get("bc");
		    	this.bo = this.model.get("bo");
		    	this.clickRoute = options.clickRoute; //used by navbar applets
		    	this.viewBarTemplate = 'ActionBarTemplate';
		    	if (!_.isUndefined(options.viewBarTemplate) && !_.isNull(options.viewBarTemplate))
		    		this.viewBarTemplate = options.viewBarTemplate;
		    	if (!_.isUndefined(options.showViewBar) && !_.isNull(options.showViewBar) && options.showViewBar)
		    		this.showViewBar = true;
		    	this.options = options;
		    },
		    renderFields : function(options) {
	    		var fields = this.model.attributes.field;
		    	if (_.isUndefined(fields)) return ""; 
	 			var data = ($.hasVal(options) && $.hasVal(options.data))?options.data:null;
	 			fields = $.toArray(fields);
	 			fields = _.sortBy(fields, function(field) {	return parseInt(field["order"]); });
	 			
	 			return 	_.template(this.options.template, {attributes: fields, _:_, applet:this.model.attributes, 
	        					data: data, fieldRenderer:ReferralWireBase.fieldRenderer, metaApplet:this.model.attributes});	
	 	    },
		    renderActionsBar : function() {
		    	var actions = this.model.attributes.action;
		    	if (_.isUndefined(actions)) return ""; 
		    	actions = $.toArray(actions);
	 			actions = _.sortBy(actions, function(action) {	return parseInt(action["order"]); });
	        	return _.template(this.viewBarTemplate, {attributes: actions, _:_, applet:this.model.attributes,clickRoute:this.clickRoute}); 
	        },
		   
		    render:function (options) {
		    	var clickRoute = _.isUndefined(this.clickRoute) ? "" :  this.clickRoute;
		    	var cacheKey = this.applet + this.template + clickRoute ;
	    		var content = rwcore.cacheout(cacheKey);
	    		if ( _.isUndefined(content) || _.isNull(content) ) { 
		    		content = this.showViewBar ? this.renderFields(options) + this.renderActionsBar() : this.renderFields(options);
	    			if( _.isUndefined(this.model.get("caching")) ) 
	    				rwcore.cachein(cacheKey, content);
			    }
			  	$(this.el).html(content);
	            return this;
		    }

		});

	    
	  	ReferralWireBase.vCard_fileimport = function (evt) {

	  	 var promise = $.Deferred();

         var f = undefined;

         if ( $.browser.msie ) {
          	var fso = new ActiveXObject("Scripting.FileSystemObject");
        	var textStream = fso.OpenTextFile(evt.target.value);
        	f = textStream.ReadAll();
         }
         else  {
              f = evt.target.files[0];
         }

         if ( f != undefined ) {
             var reader = new FileReader();
             reader.onload = (function(theFile) {
               return function(e) {
               		
                   	var cc = new rwcore.StandardCollection({module:"ContactsMgr"});
                   	cc.comparator = function (person) { return person.get('firstName');}
           			cc.reset();
                 	var contents = e.target.result;  
                 	var vCards = contents.split(/END:VCARD/);
                 	for (n in vCards) {
                     	vCard = vCards[n];
                   		var fields = {};
                     
                   		$.vcard_parse(vCard, fields);
                     
                     if ( !_.isEmpty(fields.fn) ) {
                       var nameParts = fields.fn.trim().split(" "); 
                       var firstName = "", lastName = "", jobTitle = "", company = "", emailAddress = "", 
                       workPhone = "", mobilePhone = "";
                       if (!_.isUndefined(nameParts[0]) ) firstName = nameParts[0];
                       //if ( fields.version == "3.0")
                       
                        if (!_.isUndefined(nameParts[2]) ) lastName = nameParts[2];
                       else 
                           if (!_.isUndefined(nameParts[1]) ) lastName = nameParts[1];
                       
                       if (!_.isUndefined(fields.title) ) jobTitle = fields.title;                 
                       
                       if (!_.isUndefined(fields.org) )   company = fields.org;
                       if ( fields.version == "2.1" ) { // eg. Linkedin Contacts
                         if (!_.isUndefined(fields.email) && !_.isUndefined(fields.email.internet[0]) )
                             emailAddress = fields.email.internet[0]
                       }
                       else if ( fields.version == "3.0")  { // eg ;google contacts
                       // vCards have different flavours, apple has it owns way   
                      if (!_.isUndefined(fields.email) && _.isUndefined(fields.email['type=work']) && _.isUndefined(fields.email.work)){
                           emailAddress = fields.email[0];
                      } else {
	                      if (!_.isUndefined(fields.email) && !_.isUndefined(fields.email['type=work']) )
	                           emailAddress = fields.email['type=work'][0];
	                      
	                      if (!_.isUndefined(fields.email) && !_.isUndefined(fields.email.work) )
	                           emailAddress = fields.email.work[0];
                      }     
                      
                      if (!_.isUndefined(fields.tel) && _.isUndefined(fields.tel['type=work']) && _.isUndefined(fields.tel.work) ){
                          workPhone = fields.tel[0];
                      } else {
	                      if (!_.isUndefined(fields.tel) && !_.isUndefined(fields.tel['type=work']) )
	                          workPhone = fields.tel['type=work'][0];
	                      
	                      if (!_.isUndefined(fields.tel) && !_.isUndefined(fields.tel.work) )
	                          workPhone = fields.tel.work[0];
	                      
	                  }
                      if (!_.isUndefined(fields.tel) && !_.isUndefined(fields.tel['type=cell']) )
                          mobilePhone = fields.tel['type=cell'][0];

                      if (!_.isUndefined(fields.tel) && !_.isUndefined(fields.tel.voice) )
                          mobilePhone = fields.tel.voice[1];
                          
                      var street1, city, state, zip, photoUrl, notes;
                          
                      if (!_.isUndefined(fields.adr) && _.isUndefined(fields.adr['type=work']) && _.isUndefined(fields.adr.work) ){
                          
                          street1 = fields.adr['default'][0][2];
                          city = fields.adr['default'][0][3];
                          state = fields.adr['default'][0][4];
                          zip = fields.adr['default'][0][5];
                      } else {
	                      if (!_.isUndefined(fields.adr) && !_.isUndefined(fields.adr['type=work']) ){
	                          street1 = fields.adr['type=work'][0][2];
	                          city = fields.adr['type=work'][0][3];
	                          state = fields.adr['type=work'][0][4];
	                          zip = fields.adr['type=work'][0][5];
	                      }    
	                      
	                      if (!_.isUndefined(fields.adr) && !_.isUndefined(fields.adr.work) ){
	                          street1 = fields.adr.work[0][2];
	                          city = fields.adr.work[0][3];
	                          state = fields.adr.work[0][4];
	                          zip = fields.adr.work[0][5];
	                      }
	                      
	                  }
	                  if (!_.isUndefined(fields.url) && !_.isUndefined(fields.url.home)){
	                  		notes = fields.url.home[0];
	                  }
	                  /*
	                  if (!_.isUndefined(fields.note)){
	                  		notes = fields.note[0];
	                  }
	                  */
	                  
                    }
                       var cm = new rwcore.StandardModel({module:"ContactsMgr"});
                       cm.set({firstName : firstName,
                               lastName :  lastName,
                               jobTitle : jobTitle,
                               business : company,
                               workPhone : workPhone,
                               mobilePhone : mobilePhone,
                               emailAddress : emailAddress,
                               streetAddress1_work : street1,
                               cityAddress_work : city,
                               stateAddress_work:state,
                               postalCodeAddress_work:zip,
                               photoUrl:photoUrl,
                               note:notes,
                       });
                       cc.add(cm, {silent: true});
                     }
               }
               promise.resolve(cc);
	           };
             })(f);
             reader.readAsText(f);
           }

           return promise;
    };

	ReferralWireBase.ExportContactsToServer = function ( data ) {
			var thisRequest = $.Deferred();
			var importableData =  {module : 'ContactsMgr', act : 'importContacts', contacts : data };
	    	var serverCall  = $.ajax({ type: "POST", url: "/rwWebRequest?", async: true, cache: true, dataType: "json",
              data: { data : JSON.stringify(importableData) } });
          	serverCall.done( function(model, response, jqXHR) { thisRequest.resolve(model); });
          	serverCall.fail ( function (request, status, error) { rwcore.showError(request, status, error); thisRequest.resolve(); } ); 
          	return thisRequest;
	} ;
    
    /*
    c.Birthday, c.BusinessAddress, c.BusinessAddressCity, c.BusinessAddressCountry
    c.BusinessAddressPostalCode, c.BusinessAddressState, c.BusinessHomePage
    c.BusinessTelephoneNumber,c.CompanyName, c.Email1Address, c.FirstName
	c.FullName, c.HomeTelephoneNumber, c.LastName, c.MobileTelephoneNumber
	c.WebPage
	  
	There are more : google Outlook Object Model
    */

    ReferralWireBase.GetOutlookContactsCollection = function () {
	    if ( $.browser.msie ) {
	        try {
	            var objOutlook = new ActiveXObject( "Outlook.Application" );
		        var ns = objOutlook.GetNamespace("MAPI");
		        if( ns )
		        {
		          var olcs = ns.GetDefaultFolder(10); // 10 is for Contacts
		          var cc = new rwcore.StandardCollection({module:"ContactsMgr"});
		          cc.comparator = function (person) { return person.get('firstName');}
		          for (var tmpi = 1; tmpi <= olcs.items.count; tmpi++) {
		            var olc = olcs.items(tmpi);
		            var cm = new rwcore.StandardModel({module:"ContactsMgr"});

		            if ($.hasVal(olc.FirstName) && $.hasVal(olc.LastName)) {
		              cm.set({firstName : olc.FirstName,
		                    lastName :  olc.LastName,
		                    workPhone : olc.BusinessTelephoneNumber,
		                    mobilePhone : olc.MobileTelephoneNumber,
		                    emailAddress : olc.Email1Address,
		                    streetAddress1 : olc.BusinessAddress,
		                    cityAddress : olc.BusinessAddressCity,
		                    stateAddress : olc.BusinessAddressState,
		                    business : olc.CompanyName,
		                    postalCodeAddress : olc.BusinessAddressPostalCode });
		              cc.add(cm, {silent: true});
		            }
		          }
		          return cc;
		        }
	        }
	        catch(e){
	          rwcore.FYI("Outlook needs to be installed on this computer for importing contacts.");
	          return null;
	        }
	   	}
    };

    ReferralWireBase.enrichParty = function(event){
        var model = new rwcore.StandardModel({"module" : "ContactsMgr"});
        model.sync("EnrichAll",model,{
          success:function(model, textStatus, jqXHR){
              },
            error: rwcore.showError
        });
    };
    
 	return ReferralWireBase;   
  })(Backbone, _, $, rwcore, templatecache || window.jQuery || window.Zepto || window.ender);
  return Backbone.ReferralWireBase; 
}));

