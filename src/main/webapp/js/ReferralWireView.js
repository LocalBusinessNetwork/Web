(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
	var templatecache = require('templatecache');
    var babysitter = require('babysitter');
    var csvparser = require('csvparser');
	var ReferralWireBase = require('ReferralWireBase');

  
    module.exports = factory(jquery, underscore, backbone, templatecache, babysitter, csvparser, ReferralWireBase);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone', 'templatecache', 'babysitter',  'csvparser', 'ReferralWireBase'], factory);

  } 
}(this, function ($, _, Backbone, templatecache, babysitter, csvparser, ReferralWireBase) {

	Backbone.ReferralWireView = ReferralWireView = (function(Backbone, _, $,templatecache, babysitter, csvparser, ReferralWireBase){
	var ReferralWireView = {} ; 

	ReferralWireView.ChildViewContainer = new Backbone.ChildViewContainer();
  
	ReferralWireView.FormView = Backbone.View.extend({
		  actor: "",
		  tagName:'div',
		  applet: "",
		  templateHTML: function () { return 'StdForm';},
	    template: "",
	    metaApplet: null,
	    error: null,
	    success: null,
	    parentView: null,
	    showViewBar:false,
	    viewBarTemplate:"",
	    events:{
	      "change select":"changeItem",
	      "change input":"changeItem",
	      "change textarea":"changeItem",
	      "click #save":"saveItem",
	      //"click #menuButtonSave":function(){alert('save');},
	      "click #editProfile":"editRecord",
	      //"click #delete":function(){rwApp.FYI('delete');},
			  "click #cancel":"cancelUpdate",
			  "click [pickApplet]":"launchPick",
		
	      "click [multicheckbox_search]":function(event){ this.addToMultiCheckSearchBox(event); },
		  "click .removeSelectedMCS":function(event){ this.removeMultiCheckSearchBox(event); },
		  "click .multicheck-search-container":function(event){this.setMCSFocus(event);}
		  
			  

		  //"click #refer":"refer"
	      	  
	    },

	    initialize:function (options) {

	    	this.applet = options.applet;
	    	this.error = ($.hasVal(options.error))?options.error:rwcore.showError;
	    	this.success = options.success;
	    	this.viewBarTemplate = options.viewBarTemplate;
	    	this.refreshFunctionStatic = options.refreshFunctionStatic;
	    	this.refreshFunction = options.refreshFunction;

	    	if (!_.isUndefined(options.templateHTML) && !_.isNull(options.templateHTML))
	    		this.templateHTML = options.templateHTML;
	    	if (!_.isUndefined(options.parentView) && !_.isNull(options.parentView))
	    		this.parentView = options.parentView;
	    	if (!_.isUndefined(options.showViewBar) && !_.isNull(options.showViewBar) && options.showViewBar){
	    		this.showViewBar = true;
	    		
	    	}
	    	var dynamicApplet = this.applet;
	    	var m = (!_.isUndefined(this.model))?this.model:undefined;
	    	if (_.isFunction(this.applet))
	    		
	    		dynamicApplet = this.applet(m);

	    	var dynamicViewBarTemplate = this.viewBarTemplate;
	    	if (_.isFunction(this.viewBarTemplate))
	    		dynamicViewBarTemplate = this.viewBarTemplate(m);
	    		
	    	this.metaApplet = new ReferralWireBase.AppletView({applet: dynamicApplet, template: this.templateHTML,showViewBar:this.showViewBar,viewBarTemplate:dynamicViewBarTemplate,clickRoute:options.clickRoute});
	    	this.actor = this.metaApplet.actor;
	    	this.bc = this.metaApplet.bc;
	    	this.bo = this.metaApplet.bo;
	    	this.class = options.class;
	    	this.options = options;
	    	
	    	//this.template = this.metaApplet.render({data:options.data}).el; 
	    },
	    
	    setDefaultModel : function (model_in) {
	     	// get a dummy model
	       	this.model = new rwcore.StandardModel({"module" : this.actor,"bo":this.bo,"bc":this.bc});
	       	
	      	// set the default values
	       	ReferralWireBase.setDefaultValues(this.model, this.metaApplet, model_in);
	    },


	    launchPick:function(event){
	    	var fieldName;
	    	if (event.target.tagName == 'A'){
	    		fieldName = $(event.target).attr('id');
	    	} else {
	    		var elem = $(event.target).parents('a');
	    		fieldName = elem.attr('id');
	    	}
	    	var fields = this.metaApplet.model.attributes.field;
	    	
	       	if (_.isUndefined(fields)) {
	    		return "";
	    	}
		
	    	// if there is one field in the applet, then convert it to an array
	    	if ( _.isArray(fields) == false ) {
	    		fields = [fields];
	    	}

	    	
	    	var thisField = _.find(fields, function(f){ return f["fldname"] == fieldName; });
	    	
	    	var pickAppletName = thisField['pickApplet'];
	    	var pickAppletFilter = thisField['pickAppletFilter'];
	    	var pickCreateApplet = thisField['pickCreateApplet'];
	    	var usePaging = ($.hasVal(thisField['pickUsePaging']) && thisField['pickUsePaging'])?true:null;
	    	var listItemClass = ($.hasVal(thisField['listItemClass']))?thisField['listItemClass']:undefined;

	    	var pickListTemplate = null;
	    	
			
			if($.hasVal(thisField.pickListTemplate) && thisField.pickListTemplate.indexOf("rwApp.")>-1){ //if template name is a function, then evaluate with a null model

		        	pickListTemplate = eval(thisField.pickListTemplate);
		        	//pickListTemplate = templateFunction(null);
		    		
	        } else {
				pickListTemplate = ($.hasVal(thisField.pickListTemplate))?thisField.pickListTemplate:'StdDynamicPickList';
			}

	    	var pickMaps = rwApp.getCopyPickMaps(thisField.pickMap);
	    	
	    	
	    	var template = 'StdList';
	    	
	       	if (_.isUndefined(pickMaps)) {
	    		return "";
	    	}
	    	
	    	
	        //upsertRecord : function(el, appletName, templateHTML,filter,model, success) {
	        	// get the rendering template
	        

	    	var pickView = new ReferralWireView.ListView({ 
	    		applet: pickAppletName, 
	    		setFilter:true, 
	    		listItemClass:listItemClass,
	    		template: pickListTemplate, 
	    		parentView: this, 
	    		ulClass:"pickID",
	    		batchSize:12,
	    		usePaging:usePaging,
	    		pickMap : pickMaps});
	    	
	    	var constraints = rwApp.addConstraintPickMapExpressions(thisField.pickMap,this.model,pickView.searchSpec);
	    	
	    	var pickAppletfields = pickView.listItem.metaApplet.model.attributes.field;
	    	if (!_.isUndefined(pickView.sortBy) && !_.isNull(pickView.sortBy))
	    		var sortByField = pickView.sortBy;
	    	else if ($.isArray(pickAppletfields))
	    		var sortByField = pickAppletfields[0]['fldname'];
	    	else
	    		var sortByField = pickAppletfields['fldname'];
	    	
	    	var that = this;
	    	
	      	var data = new rwcore.StandardCollection({
		      	"module" : pickView.actor, 
		      	bc:pickView.bc,
		      	bo:pickView.bo,
		      	searchSpec: constraints, 
		      	"sortby" :sortByField,
		      	limit: _.isNull(usePaging) ? undefined : rwcore.pagingSize,
		      	shape : 'Skinny'
	      	});
	    	data.fetch(
    			 {     	
    				 	add : true,

    		            error: function (request, status, error) {
    		                var errorDiv = new rwcore.ErrorView ({request : request,status : status, error : error});	
    		                errorDiv.render(status.responseText);
    		    		},
    		    		success : function (model, response, jqXHR) {
    		    			pickView.model = model;
    		    	    	// render
    		    	    	pickView = that.insertPickNull(thisField.pickMap,pickView);
    		    	    	var rHtml = pickView.render().el; 
    		    	    	
    		    	    	var pickTitle = pickView.listItem.metaApplet.model.attributes['pickTitle'];
    		    	    	
    		    	    	var pickCreateApplet = pickView.listItem.metaApplet.model.attributes['pickCreateApplet'];
    		    	    	$('#pickTitle').html(pickTitle);
    		    	    	if ($.hasVal(pickCreateApplet))
    		    	    		$("#pickCreate").show();
    		    	    	else
    		    	    		$("#pickCreate").hide();
    		    	    	
    		    	    	
    		    	    	$('#pickListContents').html(rHtml).trigger('create');
    		    	    	
							if ($.hasVal(usePaging) && usePaging) {
								$('#'+ pickView.id + '.pickID').on( "listviewbeforefilter", pickView, pickView.textSearchHandler);
								$('#'+ pickView.id + '.pickID').on( "scroll", pickView, pickView.scrollHandler);
							}
								
    		    	    	
    		    	    	$("#pickBackground").show(50);
    		    	    	//$('#picklistContainer').show(250,function(){$("#picklistContainer ul").listview('refresh');});
    		    	    	$('#picklistContainer').show(250);
    		    	    	$('#picklistContainer').one("click","#cancelPick",function(){
    		    	    		pickView.cancelPick()
    		    	    		$('#picklistContainer').off("click","#pickCreate");
    		    	    	});
    		    	    	
    		    	    	$('#picklistContainer').one("click","#pickCreate",function(){
    		    	    		var upsertApplet = "ContactUpsertForm";
    		    	    		var templ = 'PickCreateForm';
    		    	    		
    		    	    		var upsertView = pickView.pickCreate(upsertApplet,templ);
    		    	    		$('#picklistContainer').off("click","#cancelPick");  //unbind cancel pick since it's not shown after user choose to create a new record
    		    	    		$('#picklistContainer').one("click","#savePickCreate",function(event){
    		    	    			
    		    	    		    	var that = upsertView;
    		    	    		    	var requireFields = ReferralWireBase.validateRequired(that.model, that.metaApplet);
    		    	    		    	//requireFields = null; //temporary
    		    	    		    	if ( _.isNull(requireFields) ) { 
    		    	    			    	upsertView.model.save({}, {
    		    	    		        		success : function (model, response, jqXHR) {
    		    	    	    	    			pickView.execPickMap(upsertView.model);
    		        		    	    			//pickView.cancelPick();
    		        		    	    			$("#pickCreateMode").hide();
    		        		    	    			$("#pickMode").show();
    		        		    	    			$("#pickMode").css("left","5px");
    		        		    	    			$("#pickCreateMode").css("left","500px");
    		        		    	    			$('#picklistContainer').off("click","#cancelPickCreate");
    		        		    	    			
    		    	    		        			
    		    	    		        		},
    		    	    		        		error : function(request,status,error) {
    		    	    		        			if ( !_.isUndefined(that.error)) {
    		    	    		        				that.error(request,status,error);
    		    	    		        			}
    		    	    		        		},
    		    	    		        		done : function(model, response, jqXHR) {}
    		    	    		        });
    		    	    		       } else { // Validaton failed
    		    	    		     			if ( !_.isUndefined(that.error)) {
    		    	    			   				var status = {}
    		    	    			   				status['responseText'] = requireFields;
    		    	    			   				status['status'] = 99999;
    		    	    							that.error(null,status,null);
    		    	    						}
    		    	    		       }
    		    	    		    	
    		    	    		    	
    		    	    		       
    		    	    		   // },

    		    	    		});
    		    	    		$("#picklistContainer").one("click","#cancelPickCreate",function(){
    		    	    			pickView.cancelPick();
    		    	    			$("#pickCreateMode").hide();
    		    	    			$("#pickMode").show();
    		    	    			$('#picklistContainer').off("click","#savePickCreate");
    		    	    			$("#pickMode").css("left","5px");
    		    	    			$("#pickCreateMode").css("left","500px");
    		    	    			
    		    	    		});
    		    	    		
    		    	    	});	
    			 }
    			 });

	           		        	
	        	
	        },
	    insertPickNull:function(pickMaps, pickView){
	    	var vals = _.where(pickMaps, {type:"pickNone"});
	    	if (vals.length > 0){
		    	var items = {};
		    	_.each(vals, function(val) {	    	
	    		  items[val.fldname] = val.value;
	    		});

	    		var m = new rwcore.StandardModel({"module" : pickView.model.options.module});
	    		m.set(items);
	    		pickView.model.add([m],{at:0})
	    		pickView.model.models[0].id = m.get("id");
	    	}
    		return pickView;
    		//this.options.listview.model.options
	    },

	    
	    getActionsBarHTML:function(){
	    	var results = this.metaApplet.renderActionsBar();
	    	return results;
	    },
	    
	    render:function (record) {
	    	try {
	    		rwcore.spinOn();

	    		if ( _.isUndefined(record) || _.isNull(record) )
	    				record = this.model;
	    		else 
	    			this.model = record;
	    		/*	
	    		if ($.hasVal(this.parentView) && $.hasVal(this.parentView.clickRoute)){
		    			this.model.clickRoute = this.parentView.clickRoute;			
		    	}
		    	*/
	    		
	    		if (!$.hasVal(this.metaAppletHasRadioModels) || !this.metaAppletHasRadioModels){
	    			// at this time if radio buttons based on a dynamic picklist are used, their fetched at attached to the 
	    			// the corresponding fields of the metaApplet.  
	    			// Therefore the meta applet can't be dynamically re-rendered without wiping these out 
		    		var dynamicTemplate = this.templateHTML;
		    		var dynamicViewBarTemplate = this.viewBarTemplate;
		    		var dynamicApplet = this.applet;

		    		if (_.isFunction(this.templateHTML)) {
		    			dynamicTemplate = this.templateHTML(this.model);
					} 
		
					if (_.isFunction(this.applet)){
						dynamicApplet = this.applet(this.model);
					}
					
					if (_.isFunction(this.viewBarTemplate))
			    		dynamicViewBarTemplate = this.viewBarTemplate(this.model);
			    		
					this.metaApplet = new ReferralWireBase.AppletView({applet: dynamicApplet, template: dynamicTemplate,showViewBar:this.showViewBar,viewBarTemplate:dynamicViewBarTemplate,clickRoute:this.options.clickRoute});			
				}
				//this.template = this.metaApplet.render({data:this.options.data}).el;
				this.template = this.metaApplet.render().el;
				var appletTemplate = this.template;
				
	    		var appletType = this.metaApplet.model.get('type');
	    		if ( (_.isUndefined(this.model) || _.isNull(this.model)) && (_.isUndefined(this.options.htmlOnly) || this.options.htmlOnly == false)){
	    			if (appletType == 'form'){
	    				appletTemplate = _.template('NoRecordForm')();
	    			}
	    			if (appletType == 'formPlain' ){//for these we don't show the No Records Msg
	    				appletTemplate = "";
	    			}
	    			if (appletType == 'viewbar' ){
	    				this.metaApplet.template = 'NoRecordViewBar';
	    				appletTemplate = this.metaApplet.render().el; 
	    			}
	    			if (this.applet == "ReferralInboxMenu")
	    				appletTemplate = "";
	    		}
	    		
	    			
	    		
	    		var results = ReferralWireBase.recordBinder(appletTemplate, this.model);

	    		$(this.el).html(results);
	    		
	    		switch (this.tagName) {
		    		case 'ul':{
		        		$(this.el).attr("data-role","listview");
		        		$(this.el).attr("data-inset","true");
		        		$(this.el).addClass("formfields");
		        		break;
		    		}
	    		}
	    		rwcore.spinOff();
	    		
    		}
    		catch(e) {
    			rwcore.spinOff();
    		}
    	    return this;
	    },

	    mcsTextSearchHandler: function(event) {
	    	var $ul = $(this);
	    	var f = $ul.attr("fldname");
	    	var form = event.data;
	    	form.adjustDD(f);
	    	var that = this;
        	
        	var fd = form.MCSFields[f];
        	var m = form.radioModels[f].radioList;

	    	var $i = $("#"+f+".multicheck-search-container input");
	    	var v = $i.val();
	    	if (v.length > 1){
	    		
	    		if (_.isUndefined(form.mcsHtml)){form.mcsHtml = new Object()}
	    		if (_.isUndefined(form.mcsHtml[f])) {
	    			form.mcsHtml[f] = $ul.html();	
	    		} 
	    		//$ul.html("");
	    		//adding the constraints here has the effect of screening out items that have already been picked -
	        	//since a constraint pickmap has been configured on the applet to do;
	        	//other types of constraints will be applied as well if they've been configured on the applet
	        	var pam = new ReferralWireBase.AppletView({applet:fd.pickApplet,template:""});
	    		var ss = rwApp.addConstraintPickMapExpressions(fd.pickMap,form.model,pam.model.get('searchSpec'));
	    		m.options.searchText = v;
	    		m.reset();
	    		m.options.searchSpec = ss;

	    		var p = rwApp.fetchList(m.options);
	    		p.done(function(model){
	    			
	    			var pl = new ReferralWireBase.PickList({ 
	    				model: model,  
	    				fldname: f,
	    				order:fd.order,
	    				key:fd.lookupKeyField,
	    				display:fd.lookupDisplayField,
	    				displayListField: fd.displayListField,
	    				//radioField:radioField,
		 				pickTemplate:fd.pickListTemplate
	 		    	});
	 		    	fldHtml = pl.render(false).el.innerHTML;
	 		    	var $ul2 = $($.parseHTML(fldHtml)).find("ul")
	 		    	$ul.html($ul2.html());
	 		    	$ul.listview( "refresh" );
		    		
		  		})
	 		    			// Attach Picklist

	    	}

        // reset it back to orignal list 
	        if ( v.length == 0 ) {
	        	if (!_.isUndefined(form.mcsHtml) && !_.isUndefined(form.mcsHtml[f])) {
	        			var h = form.mcsHtml[f];
		    			var fv = form.model.get(f);
		    			if ($.hasVal(fv)){
		    				var fva = fv.split(",");
		    				var $fp = $($.parseHTML("<div>"+form.mcsHtml[f]+"</div>"));
		    				for (var j =0; j < fva.length; j++){
		    					var id = "#" + f + "-" + fva[j].replace(/\s/g,'') + "-typeahead";
		    					$fp.find(id).hide();
		    				}
		    				h = $fp.html();
		    			}
		    		
		    			$ul.html(h);
		    	}
	        }
	    },

	    updateCommaDelimitedVal: function(options) {//used for updating multicheck and multicheck_search fields
	    	   var fieldName = options.fieldName;
	    	   var fieldValue = options.fieldValue;
	    	   var newVal = "";
		       var previousVal = this.model.get(fieldName);
		       if ($.hasVal(previousVal)){
		       		var prevAry = previousVal.split(",");
		       		var newVal = "";
		       		var append = true;
		       		for (var i = 0; i < prevAry.length; i++){
		       			var thisVal = prevAry[i];
		       			if (thisVal != fieldValue){
		       				newVal += (newVal != "")?","+thisVal:thisVal;
		       			} else{
		       				append = false; //user has unchecked the box
		       			}
		       		}
		       		if (append) {
		       			newVal +=","+fieldValue;


		       		}
	       		} else {
	       			newVal = fieldValue;
	       		}
	       		return newVal;
	    },

	    renderSelectedMultiCheckSearch:function(options){
	    	var commaList = options.commaList;
	    	var fieldName = options.fieldName;
	    	var displayField = options.displayField;
	    	var dispList = options.dispList;
	    	var dispListFld = options.dispListFld;
	    	var html = "";
	    	var selector = "#"+fieldName+"-selected.multicheck-selected-items";
	    	var fd = this.MCSFields[fieldName];
	    	
		    if ($.hasVal(commaList) && $.hasVal(fieldName)){
		    	var selectedItems = commaList.split(",");
		    	var displayItems = dispList.split(",");
	    		var itemHTML = $(_.template('Snippets')()).find("#selectedMultiCheckSearch").html();
		    	for (var i = 0; i < selectedItems.length; i++){
		    		var thisGlobalVal = selectedItems[i];

		    		//var thisDisplayVal = (lkpLov)?rwcore.getLovDisplayVal(lovType,thisGlobalVal):thisGlobalVal; 
		    		var thisDisplayVal = displayItems[i];
		    		var thisItemHtml = itemHTML.replace(/ZfieldName/g,fieldName);
		    		thisItemHtml = thisItemHtml.replace(/ZglobalVal/g,thisGlobalVal);
		    		thisItemHtml = thisItemHtml.replace(/ZdisplayVal/g,thisDisplayVal);
		    		thisItemHtml = thisItemHtml.replace(/ZdisplayField/g,thisDisplayVal);
		    		thisItemHtml = thisItemHtml.replace(/ZdisplayListField/g,dispListFld);
		    		
		    		var typeAheadId = "#" + fieldName + "-" + thisGlobalVal.replace(/\s/g,'') + "-typeahead";
		    		var tileId = "#" + fieldName + "-" + thisGlobalVal.replace(/\s/g,'') + "-tile";
		    		$(typeAheadId).hide();
		    		$(tileId).hide();
		    		html += thisItemHtml;
		    	}
		    	
		    	if (!($(selector).length)) {
		    		var containerHTML = $(_.template('Snippets')()).find("#selectedMCSGroup").html();
		    		containerHTML = containerHTML.replace(/ZfieldName/g,fieldName);
		    		containerHTML = containerHTML.replace(/ZglobalVal/g,thisGlobalVal);
		    		$("#"+fieldName+" .ui-listview-filter .ui-input-search").prepend(containerHTML);//"<div class='multicheck-selected-items'></div>");
		    		this.addedSelectedDiv = true;	
		    	}
		    	//html += ""
		    	
		    }
		    $(selector).html(html);
	    	
	    },

	    renderAllMultiCheckSearchControls:function(){
	    	
	    	var MCSControls = $(this.el).find(".multicheck-search-container").toArray();
	    	var mFields = this.metaApplet.model.attributes.field;
	    	if (!_.isArray(mFields)){
	    		mFields = [mFields];
	    	}
	    	if (MCSControls.length > 0){
	    		this.MCSFields = new Object();
	    	}
	    	for (var i=0;i<MCSControls.length;i++){
	    		var thisMCS = MCSControls[i];
	    		var fieldName = thisMCS.id;

	    		var lovType = $("#"+fieldName+".multicheck-search-container").attr("lovType");
	    		var order = $("#"+fieldName+".multicheck-search-container").attr("order");
	    		this.MCSFields[fieldName] = mFields[order-1];
	    		var usePaging = this.MCSFields[fieldName].pickUsePaging;

				if ($.hasVal(usePaging) && usePaging) {
						$("#"+fieldName+".multicheck-search-container ul").on( "listviewbeforefilter", this, this.mcsTextSearchHandler);
						//$('#'+ pickView.id + '.pickID').on( "scroll", pickView, pickView.scrollHandler);
				}
				
				var commaList = this.model.get(fieldName);
				var dispFld = this.MCSFields[fieldName].lookupDisplayField;
	    		var dispListFld = this.MCSFields[fieldName].displayListField;
	    		var dispList = (dispFld == fieldName)?commaList:this.model.get(dispListFld);

	    		this.renderSelectedMultiCheckSearch({
	    			commaList:commaList,
		    		fieldName:fieldName,
		    		lovType:lovType,
		    		dispList:dispList,
		    		displayField:dispFld,
		    		dispListFld:dispListFld
	    		});
	    		
	    		this.adjustDD(fieldName);
	    	}

	    },

	    adjustDD:function(fieldName){
	    	var containerSelector =  "#"+fieldName + ".multicheck-search-container";
			var containerLeftOffset = $(containerSelector).offset().left;
	    	
	    	var dropDownOffset = $(containerSelector + " input.ui-input-text").offset();
	    	var marginAdjust = dropDownOffset.left - containerLeftOffset;
	    	$("#"+fieldName+" ul").css("margin-left",marginAdjust);

	    },

	    addToMultiCheckSearchBox:function(event){
	    	
	    	var target = event.target;
	    	var elem=(_.isUndefined($("#"+target.id).attr("multicheckbox_search")))?$("#"+target.id).parents("[multicheckbox_search]"):$("#"+target.id);
	    	var fieldName = elem.attr("multicheckbox_search");

	    	var fieldValue = elem.attr("name");
	    	//var lovType = $("#"+fieldName+".multicheck-search-container").attr("lovType");
	    	var commaList = this.updateCommaDelimitedVal({fieldName:fieldName,fieldValue:fieldValue});
	    	var dispFld = elem.attr("displayField");
	    	var dispVal = elem.attr("displayVal");
	    	var dispListFld = elem.attr("displayListField");
	    	var dispList = (dispFld == fieldName)?commaList:this.updateCommaDelimitedVal({fieldName:dispListFld,fieldValue:dispVal});

    		this.renderSelectedMultiCheckSearch({
    			commaList:commaList,
	    		fieldName:fieldName,
	    		dispList:dispList,
	    		displayField:dispFld,
	    		dispListFld:dispListFld
    		});
	    	this.model.set(fieldName,commaList);
	    	this.model.set(dispListFld,dispList);
	    	//this.adjustDD(fieldName);
	    	$("#"+fieldName + ".multicheck-search-container input").val("")
	    	$("#"+fieldName + ".multicheck-search-container input").trigger('keyup')
	    	$("#"+fieldName + ".multicheck-search-container input").focus();
	    	
	    },

	    removeMultiCheckSearchBox:function(event){
	    	var target = event.target;
	    	var elem=(_.isUndefined($(event.target).attr("multicheckbox_search_selected")))?$(event.target).parents("[multicheckbox_search_selected]"):$(event.target);
	    	var fieldName = elem.attr("multicheckbox_search_selected");
	    	var fieldValue = elem.attr("name");
	    	var lovType = $("#"+fieldName+".multicheck-search-container").attr("lovType");
	    	var commaList = this.updateCommaDelimitedVal({fieldName:fieldName,fieldValue:fieldValue});
	    	var dispFld = elem.attr("displayField");
	    	var dispVal = elem.attr("displayVal");
	    	var dispListFld = elem.attr("displayListField");
	    	var dispList = (dispFld == fieldName)?commaList:this.updateCommaDelimitedVal({fieldName:dispListFld,fieldValue:dispVal});

    		this.renderSelectedMultiCheckSearch({
    			commaList:commaList,
	    		fieldName:fieldName,
	    		dispList:dispList,
	    		displayField:dispFld,
	    		dispListFld:dispListFld
    		});
	    	var typeAheadId = "#" + fieldName + "-" + fieldValue.replace(/\s/g,'') + "-typeahead";
	    	$(typeAheadId).attr("style",null);
	    	this.model.set(fieldName,commaList);
	    	this.model.set(dispListFld,dispList);
	    	this.adjustDD(fieldName);

	    },

	    setMCSFocus:function(event){
	    	if ($(event.target).hasClass("ui-input-search")){
	    		//this might have to be made more specific if there are two more mcs controls on the form
	    		$(event.target).find("input").focus();
	    		
	    	}
	    },
	    
	    changeItem:function (event) {
	    	
	        var target = event.target;
	    	//var tagName = $(target).get(0).nodeName.toLowerCase();
	    	//var value = target.value;
	    	//if (tagName == "textarea")
	    	//	value = $(target).html();
	        
	        // You could change your model on the spot, like this:
	        var change = {};
	        var fieldName = target.id;
	        var fieldValue = target.value;
	        var hasPickMap = null;
	        var isDateTime = ($("#"+fieldName).hasClass("datetimepicker"))?true:false;
	        var isTime = ($("#"+fieldName).hasClass("timepicker"))?true:false;
	        var isDate = ($("#"+fieldName).hasClass("datepicker"))?true:false;
	        
	        if (target.type == 'date'){
	        	var newDateArray = target.value.split("-");
		        	
	        	var year = parseInt(newDateArray[0]);
	        	var month = parseInt(newDateArray[1]) -1;
	        	var date = parseInt(newDateArray[2]); 
	        	var hour = 0;
	        	var minute = 0;
	        	
	        	var oldFieldVal = this.model.get(fieldName);
	        	/*
	        	if ($.hasVal(oldFieldVal)){
	        		oldDate = new Date(oldFieldVal.$date);
	        		 	if (typeof(oldDate.getHours) === 'function'){	
	        				hour = oldDate.getHours();
	        				if (_.isNaN(hour)){hour = 0; minute = 0;}
	        				else {minute = oldDate.getMinute();}
	        				
	        			} else {
	        				hour = 0;
	        				minute = 0;
	        			}
	        	}
	        	*/
	        	
	        	var dateObj = new Date(year,month,date,hour,minute);
	        	dateObj = $.getGMTTimeFromLocal(dateObj.getTime());
	        	
	        	//change[fieldName] = {$date:dateObj.getTime()};
	        	change[fieldName] = dateObj.getTime();
	        	this.model.set(change);
	        	return;
	        }
	        
	        if (isDateTime || isDate){
	        	var localDateObj = new Date(target.value);
	        	change[fieldName] = localDateObj.getTime();
		        this.model.set(change);
		        $("#"+fieldName).attr("value",target.value);
		        if (!_.isUndefined(this.options.postChange)){
		        	this.options.postChange(this,fieldName,fieldValue);
		        }
	        	return;
	        }
	        
	        if (isTime){
	        	var today = new Date();
	        	var newTimeArray = target.value.split(":");
	        	var hour = parseInt(newTimeArray[0]);
	        	var minMeridianAry = newTimeArray[1].split(" ");
	        	var minute = parseInt(minMeridianAry[0]);
	        	if (minMeridianAry.length > 1){
	        		var meridian = minMeridianAry[1];
	        		if ((meridian == "pm" || meridian == "PM") && hour < 12) {
	        			hour = hour + 12;
	        		}
	        	}
	        	
	        	
	        	var year = today.getFullYear();
		        var month = today.getMonth();
		        var date = today.getDate();
	        	
	        	var dateObj = new Date(year,month,date,hour,minute);
	        	
	        	
		        	change[fieldName] = dateObj.getTime();
		        	this.model.set(change);
	        	return;
	        }

	        if (target.type == 'checkbox') {
	        	var isMultiCheck = !_.isUndefined($(target).attr("multicheckbox"));
	        	//var isMultiCheckSearch = !_.isUndefined($(target).attr("multicheckbox_search"));
	        	var isMultiCheckSearch =false;
	        	if(!isMultiCheck && !isMultiCheckSearch) {
			        if ( target.value =='') {target.value = 'true';fieldValue = 'true';}
			        else if (target.value == 'true') {target.value = 'false';fieldValue = 'false'}//$(target).attr("checked","")
			        else if (target.value == 'false') {target.value = 'true';fieldValue = 'true';}
			    } else {
			       fieldValue = target.getAttribute("name");;
			       fieldName = target.getAttribute("fldname");
			       fieldValue = this.updateCommaDelimitedVal({fieldValue:fieldValue,fieldName:fieldName})
				   var displayField = target.getAttribute("displayField");
				   var displayVal = target.getAttribute("displayVal");
		           displayVal = this.updateCommaDelimitedVal({fieldValue:displayVal,fieldName:displayField})
		           var displayChg = {};
		           displayChg[displayField] = displayVal;
		           this.model.set(displayChg); // we set the extra display val right here. the actual key val is set at the end of the change function
	        	}

		    }

	         if (target.type == 'radio') {
		       fieldValue = target.getAttribute("name");;
		       fieldName = target.getAttribute("fldname");
		       hasPickMap = target.getAttribute("hasPickMap");
		       $(target).parents('form').find("label").attr("data-icon","radio-off")
				$(target).parents('form').find("label").removeClass("ui-radio-on")
				$(target).parents('form').find("label").addClass("ui-radio-off")
				$(target).parents('form').find("span.ui-icon").removeClass("ui-icon-radio-on")
				$(target).parents('form').find("span.ui-icon").addClass("ui-icon-radio-off")
				$(target).siblings('label').addClass("ui-radio-on")
				$(target).siblings('label').attr("data-icon","radio-off")
				$(target).siblings('label').attr("data-icon","radio-off").find("span.ui-icon").removeClass("ui-icon-radio-off")
				$(target).siblings('label').attr("data-icon","radio-off").find("span.ui-icon").addClass("ui-icon-radio-on")
				
		        
	        }


			if ($.hasVal(hasPickMap) && (hasPickMap == "true" || hasPickMap == true)){
					
					var fromCollectionModel = this.radioModels[fieldName].radioList;
					var pickMap = this.radioModels[fieldName].radioPickMaps;
					var pickedId = target.getAttribute('pickedRecordId');
					var selectedModel = fromCollectionModel.get(pickedId);
					
					   rwApp.execPickMap({
					      	fromModel:selectedModel,
					      	pickMap:pickMap,
					      	toModel:this.model
				      	
				      	})
				      	
					
			} else {
		       change[fieldName] = fieldValue;
		        // console.log('changing ' + fieldName + ' from: ' + target.defaultValue + ' to: ' + fieldValue);
		        this.model.set(change);
	        }
	        
	        if (!_.isUndefined(this.options.postChange)){
	        	this.options.postChange(this,fieldName,fieldValue);
	        }
	    },
 
	    cancelUpdate:function(){
	    	var el2 = '#upsertRecord'
		    	  $(el2).animate({
		    		    top:1000
		    		  }, 500, function() {
		    			  $(this.el).hide(50);
		    		      $(".overlay-background").hide();
		    			  $(el2).css('bottom','auto');
		    			  $(el2).css('height','99%');
		    			  $(el2).css('top','100%');
		    			  $(el2).hide();
		    			  
		    			   //rwApp.refreshTopView(false);
		    			  
		    		  });
	    	rwApp.preventNavigation = false;
	    	
	    },


	    saveItem:function (event) {
	    	
	    	var that = this;
	    	var requireFields = ReferralWireBase.validateRequired(this.model, this.metaApplet);
	    	this.model.options.bo = this.metaApplet.bo;
	    	this.model.options.bc = this.metaApplet.bc;
	    	//requireFields = null; //temporary
	    	if ( _.isNull(requireFields) ) {
	    	
				var el2 = '#upsertRecord';
				$(el2).animate({
					top:1000
					}, 500, function(route) {
						$(this.el).hide(50);
						$(".overlay-background").toggle(00);
						$(el2).css('bottom','auto');
						$(el2).css('height','99%');
						$(el2).css('top','100%');
						$(el2).hide();
					}
				)
				
		    	ReferralWireBase.setPostDefaultValues(this.model, this.metaApplet);
	    	 	
		    	this.model.save({}, {
	        		success : function (model, response, jqXHR) {
	        					debugger;
	        						if (!_.isUndefined(model.get("powerpartner1"))){
	        							// if a new powerpartner1 value is saved by the user, 
	        							// we want to make sure the session variable is kept up to date
	        							// this. 
	        							 rwFB.powerpartner1 = model.get("powerpartner1");
	        						}
	        						var id = model.id;
        							if ($.hasVal(that.refreshFunction)){that.refreshFunction(model,that);}
        							else if ($.hasVal(that.refreshFunctionStatic)){eval(that.refreshFunctionStatic);}
        							else if ( !_.isUndefined(that.parentView) &&  !_.isNull(that.parentView) ) {
        								
        								//rwApp.refreshTopView(false);
        								var contextId = ($.hasVal(that.parentView.options.refreshModelView))?that.parentView.options.refreshModelView.model.get('id'):id;
        								
        								var route = that.parentView.options.route + "/" + contextId;
        								//route = that.parentView.options.route;
        								var currentRoute = Backbone.history.fragment;
        								if (currentRoute == route){
        									Backbone.history.fragment = null;
        								}

        								rwApp.navigate(route,{trigger: true,replace: true});
        								        								//if ( !_.isUndefined(that.parentView))  
        								//	that.parentView.render();
        							} else if (!_.isUndefined(that.options.showConfirmOnSave) &&  !_.isNull(that.options.showConfirmOnSave)) {
        									var popUpContainer = $("#PopupContainer");
        			          				popUpContainer.html(_.template(that.options.showConfirmOnSave)()); 
        			          				popUpContainer.addClass("confirmation");
        			          				$(".overlay-background").show();
        			          				popUpContainer.show();
        			          				popUpContainer.one("click", "[popEvent]", function() {
        			          				//popUpContainer.one("[popEvent]", "click", function() {
        			          					popUpContainer.hide();
        			          					$(".overlay-background").hide();
        			          				});		          			
        							} 

	        							

	        		//			});
			        			if ( !_.isUndefined(that.success)) {
			        				debugger;
			        				that.success(model, response,jqXHR);
			        			}
	        			
	        		},
	        		error : function(request,status,error) {
	        			if ( !_.isUndefined(that.error)) {
	        				that.error(request,status,error);
	        			}
	        		},
	        		done : function(model, response, jqXHR) {
	        			rwApp.preventNavigation = false; // this 
	        		}
	        });
	       } else { // Validaton failed
		   			if ( !_.isUndefined(that.error)) {
		   				var status = {};
		   				status['responseText'] = requireFields;
		   				status['status'] = 99999;
						that.error(null,status,null);
					}
	       }
	       
	    },
	    
			
	 			
	
		
		saveRecordPhone : function(event){
			
			
			rwApp.upsPhone(upModel,refreshRoute,routeIdField,confirmTemplate,this);
		
		},

	    
	    createRecord:function(upsertApplet){	    	
	    	rwApp.upsertRecord({
	      		  el:'#upsertRecord',
	      		  appletName:upsertApplet,
	      		  upsertTemplate:'upsertForm',
	      		  upsertModel:'',
	      		  parentView:this.parentView,
	      		  refreshFunction:function(model){rwApp.refreshAndSelect(model)},
	      		  success:null
	      	  });
	    	
	    },
	    
	    editRecord:function(upsertApplet){

	    	var upsertTemplate = ($.hasVal(this.options.upsertTemplate))?this.options.upsertTemplate:'upsertForm';

	    	if ($.hasVal(this.parentView) && $.hasVal(this.parentView.options.fixRecordApplet) && upsertApplet == this.parentView.options.fixRecordApplet){
	    		upsertTemplate = 'UpsertFormNarrow'
	    	}
	    	
	    	rwApp.upsertRecord({
	      		  el:'#upsertRecord',
	      		  appletName:upsertApplet,
	      		  upsertTemplate:upsertTemplate,
	      		  upsertModel:this.model,
	      		  parentView:this.parentView,
	      		  refreshFunctionStatic: this.refreshFunctionStatic,
	      		  refreshFunction:this.refreshFunction,
	      		  success:null
	      	  });
	    },
	 
	    close:function () {
	        $(this.el).unbind();
	        $(this.el).empty();

  	      
  	      //$(that.el).attr('data-autodividers','true');

  	      
  	      return that;
  		
  	}
  	
  	});
  	
  
		
	ReferralWireView.ListItemView = Backbone.View.extend({
      actor : "",
      tagName:"li",
      applet: "",
      htmlTemplate: "",
      template: "",
      metaApplet : null,
      initialize:function (options) {

        this.applet = options.applet;
        this.listItemClass = options.listItemClass;
        this.htmlTemplate = options.template;

        if (_.isFunction(this.htmlTemplate)) {
    		//var dynamicTemplate = this.htmlTemplate(null);
    		var dynamicTemplate = 'StdList';
			this.metaApplet = new ReferralWireBase.AppletView({applet: this.applet, template: dynamicTemplate});	
		} else {
			this.metaApplet = new ReferralWireBase.AppletView ({applet: this.applet, template: this.htmlTemplate});
		}
        
        
        this.actor = this.metaApplet.actor ;
        this.bc = this.metaApplet.bc;
	    this.bo = this.metaApplet.bo;
	    this.options = options;

        this.template = this.metaApplet.render().el; 
      },
      

      render:function (data) {
        var appletTemplate = this.template;
        
        if ( data == undefined )
        data = this.model;
        else 
          this.model = data;
          
          
          if (_.isFunction(this.htmlTemplate)) {
          	if ($.hasVal(this.options.clickRoute)) {this.model.clickRoute = this.options.clickRoute} 
    		var dynamicTemplate = this.htmlTemplate(this.model);
			this.metaApplet = new ReferralWireBase.AppletView({applet: this.applet, template: dynamicTemplate});
		    appletTemplate = this.metaApplet.render().el; 		
		  }
        
          $(this.el).html(ReferralWireBase.recordBinder(appletTemplate, this.model));
          $(this.el).addClass(this.listItemClass);
          $(this.el).attr("id",this.model.get("id"));
          if ($.hasVal(this.options.customRowAttr)){$(this.el).attr(this.options.customRowAttr.attrName,this.options.customRowAttr.attrVal);}

          if ($.hasVal(this.options.setFilter) && this.options.setFilter){ 
        	  
	          var hiddenFilters = $.getHiddenListFilters(this.metaApplet.model.attributes.field,this.model);
	          if ($.hasVal(hiddenFilters))
	        	  $(this.el).attr("data-filtertext",hiddenFilters);	
          }
      
          return this;
      }

	});

	
	ReferralWireView.MultiColumnListView = Backbone.View.extend({
	    options: "",
	    applet: null,
	    actor: "",
	    initialize: function (options) {
	    	this.options = options;
			this.applet = new ReferralWireBase.RepoObjectModel({ type: 'Applet', name : this.options.applet}); 
			this.actor = this.applet.get('actor');
	    },
	    render:function (data) {
	    	
	    	if ( _.isUndefined(data) )
	            data = this.model;
	        else 
	            this.model = data;
	    	
	   		$(this.el).html(_.template(this.options.template,
	   				{ 	cc: data, 
	   					applet: this.applet, 
	   					fieldRenderer: ReferralWireBase.fieldRenderer, 
	   					recordBinder: ReferralWireBase.recordBinder,
	   					_:_
	   				}
	   		));
	   		return this;
	    }
	});
  
ReferralWireView.ListView = Backbone.View.extend({

    actor: "",
    searchSpec: "",
    tagName:'ul',
    id: Math.random().toString(36).substr(2,16),
    params:"",
      applet:"",
      listItem : null,
      setFilter:true,
      noRecordsMsg:"No records!",
      listItemClass:"rw_listitem",
      backupModel : null,
      initialize:function (options) {

	      this.htmlTemplate = (!_.isUndefined(options.template) && !_.isNull(options.template) )?options.template:options.templateHTML;


	      this.applet = options.applet;
	      if (!_.isUndefined(options.filter) && !_.isNull(options.filter))
	        this.setFilter = options.filter;
	      if (!_.isUndefined(options.noRecordsMsg) && !_.isNull(options.noRecordsMsg))
	          this.noRecordsMsg = options.noRecordsMsg;
	      if (!_.isUndefined(options.listItemClass) && !_.isNull(options.listItemClass))
	        this.listItemClass = options.listItemClass;
	      this.listItem = new ReferralWireView.ListItemView({applet:this.applet, setFilter:this.setFilter, template: this.htmlTemplate,listItemClass:this.listItemClass,customRowAttr:this.customRowAttr,clickRoute:this.clickRoute});
	      this.actor = this.listItem.actor;
	      this.bc = this.listItem.bc;
	      this.bo = this.listItem.bo;
	      
	      this.searchSpec = this.listItem.metaApplet.model.get('searchSpec');
	      this.sortBy = this.listItem.metaApplet.model.get('sortBy');
	      this.sortDir = this.listItem.metaApplet.model.get('sortDir');
	      this.pageNumber = 1;
	      this.class = options.class;
	      this.params = options;
	      this.parentView = options.parentView;
	      this.numCharsToTriggerSearch = options.listMap?0:2;
	      this.batchSize = ($.hasVal(options.batchSize))?options.batchSize:2;
		  this.nextHandlerState = false;	      
		  this.ulClass = options.ulClass;
		  this.fillRemainder = options.fillRemainder;
	
	    },
    
      events:{
        "click .rw_listitem":"pick",
        "click .pickPhoneContact":"pickPhoneContact",
        "click #cancelPick": "cancelPick",
        "click #pickCreate":"pickCreate", // allows user to create a new record inline, instead of picking an existing one
        "click #showNextRecords":"showNextRecords",
        "click #showPreviousRecords":"showPreviousRecords",
        "scroll": "refreshList",
      },

      
      reDraw : function (model){
      	  var that = this;
      	    
          if ( model.models.length > 0 ) {
      	
      			var modelClone = _.clone(model);
      			if (_.isUndefined(this.modelClone)){this.modelClone = _.clone(this.model)};//this is a workaround
      			this.modelClone.models = new Array();
      			//modelClone.models = new Array();
				var batchSize = this.batchSize;
				//var selector = ($.hasVal(this.options.ulClass))?'#'+ that.id + "." + this.options.ulClass:'#'+ that.id;
				var selector = this.selector;
				var showMore = ($.hasVal(that.params.usePaging && that.model.models.length >= rwcore.pagingSize))?true:false;
				
				ReferralWireView.renderSet({
	  		 	
	  		 	models:modelClone.models,
	  		 	setSize:batchSize,
	  		 	selector:selector,
	  		 	el:that.el,
	  		 	template:this.htmlTemplate,
  				applet:this.applet,
  				listItemClass:this.listItemClass,
  				showMore:showMore,
  				pageNumber:that.pageNumber,
  				lastCategory:$(selector).attr("lastCategory"),
  				fillRemainder:true,
  				clickRoute:this.clickRoute
  				
	  		 });
      	  }
   
      }, 
      
      refreshList : function (){
      		
      		
      		if (!_.isUndefined(this.modelClone)){
	      		if (this.modelClone.models.length > this.batchSize){
	      				
	      			this.modelClone.models = _.rest(this.modelClone.models,(this.batchSize));
	      			
	      			this.reDraw(this.modelClone);
	      		} else {
	      			//var selector = ($.hasVal(this.options.ulClass))?'#'+ this.id + "." + this.options.ulClass:'#'+ this.id;
	      		 	
	      		 	$(this.selector).listview('refresh');
	      		}
	      	}
	      	
      		
      		
      },
      
      
      reDrawOld : function (model,firstRecordName) { //method is no longer used with progressive rendering
		  
          var that = this;

          if ( model.models.length > 0 ) {

              //that.model.add(model.models, {silent: true});
              
              var lastCategory;
              var catField = that.listItem.metaApplet.model.get('dividerField');
              var useWholeWord = that.listItem.metaApplet.model.get('divideWithWholeWord');
              var dividerTemplateClass =  that.listItem.metaApplet.model.get('divideTemplateClass');
      
              var selector = ($.hasVal(this.options.ulClass))?'#'+ that.id + "." + this.options.ulClass:'#'+ that.id;

              _.each(model.models, function (stdModel) {
                      
                      if (!_.isUndefined(catField) && !_.isNull(catField) && catField != ""){
                        
                        if (!_.isUndefined(useWholeWord) && !_.isNull(useWholeWord) && useWholeWord == true){
                          var catValue = stdModel.get(catField);
                        } else {
                          var catValue = stdModel.get(catField);
                          catValue = ($.hasVal(catValue))?catValue.substr(0,1).toUpperCase():"...";
                          
                        }
                      } 
                          
                      
                      if ((_.isUndefined(lastCategory) || _.isNull(lastCategory) || catValue != lastCategory) && (!_.isUndefined(catValue) && !_.isNull(catValue) && catValue!="")){
                        var dividerTemplateSelector = "."+dividerTemplateClass;
                        var separatorEl = $(_.template('Snippets')()).find(dividerTemplateSelector).html(catValue);
                        
                        $(selector).append(separatorEl);   
                        lastCategory = catValue;
                      }
                      
                      var listItemEl = that.listItem.render(stdModel).el;
                        $(selector).append(listItemEl.outerHTML); 
              }, that);
      


              $(selector).listview('refresh');

              that.pageNumber++;

            }
      },

      scrollHandler : function(event) {
      	
      	var s = "#"+event.data.id;
      	if (!_.isUndefined(event.data.ulClass)){
      		s+="."+event.data.ulClass;
      	}
      	var obj = $(s);
      	
      	var top = obj.scrollTop();
        var h = obj.height();
        var b = obj.prop('scrollHeight');

        if ( b - top < h+5  ) {
        		// restict fast scrolling
        		$(".fetchingPane").show();
        		if (event.data.nextHandlerState) return;
        		// rwcore.spinOn({top: obj.position().top + h / 2, left: obj.position().left + obj.width() / 2  });
        		rwcore.spinOn({top: obj.position().top + h / 2, left: obj.position().left + obj.width() / 2  });
        		event.data.nextHandlerState = true;
        		$.when(event.data.showNextRecords(event)).done ( function() {
        			$(".fetchingPane").hide();
        			event.data.nextHandlerState = false;
        			rwcore.spinOff({mode:'custom'});
        		}).fail(function() { event.data.nextHandlerState = false;rwcore.spinOff({mode:'custom'}); });
        }

      },

      showNextRecords:function(event){
      	var p = $.Deferred();

        $("#showNextRecords").find("h3").html("Fetching");
        var that = this;
        var moreRecords = new rwcore.StandardCollection(that.model.options);
        moreRecords.options['skip'] = that.model.models.length;
        moreRecords.dataout = {data: JSON.stringify(moreRecords.options)};
       
        var newModels = [] ;

        moreRecords.fetch({

          add:true,
          async: false,
          error : rwApp.showError, 
          success : function (model, response, jqXHR) {
           $("#nextRecordsListItem").remove();
	        var coll = new Backbone.Collection();
    	    _.each(model.models, function (stdModel) {
           		if ( _.isUndefined(that.model.get(stdModel.id) ) ) {
		           that.model.add(stdModel, {silent: true});//moved from redraw to here
		           coll.add(stdModel, {silent: true});
		        }
		    });

		    if ( coll.length > 0) {
	           that.reDraw(coll) ;
    	       that.pageNumber++;
    	   	}

           	p.resolve();
          
          }
          
        });

        return p;
      },

      showPreviousRecords:function(event){
      	this.pageNumber--;
      	//fetch previous set of records
      	//re-execute renderer
      	//inject rendered list into parent div in StdListDetailView (class="listViewListContainer")
      },
      
      pickPhoneContact:function(event){

    	  if ($.hasVal(rwApp.newReferralData)){
    	  
            
            var target = event.target;
            var tagName = $(target).get(0).nodeName.toLowerCase();
            var anchorId = $(target).attr('id');
            if (tagName != 'a'){
              var anchor = $(target).parents('a');
              anchorId = anchor.attr('id');
            }
            var contactName = anchor.find("h3").html();
            
            rwApp.newReferralData.contactId = anchorId;
            rwApp.newReferralData.contactName = contactName;
            var route = "createReferral2/" + rwApp.newReferralData.toPartyId;
            rwApp.navigate(route,{trigger: true,replace:true});
    	  }
      },
      
      cancelPick:function(){
    	// console.log('lview cancelPick');
        //currently the event handler isn't firing. Might work with delegate events
        $("#pickBackground").hide(50);
        $('#picklistContainer').hide(350);
      },
      
     
      setModel: function (model) {
    	  var that = this;
    	  if ( !_.isUndefined (that.params.clientSideSortAttr)) 
    		  model.models = _.sortBy (model.models, function(m) {return m.get(that.params.clientSideSortAttr);});
    		  if ( !_.isUndefined (that.params.clientSideSortDirection) && that.params.clientSideSortDirection == "DESC"){
    		  		model.models.reverse();
    		  } 
    	  this.model = model ;
      },
      
      pickCreate:function(upsertApplet,templ){
    	  
    	  //rwApp.upsertRecord('#upsertRecord',upsertApplet,ReferralWireView.Templatecache.upsertForm,'',this.parentView,function(){});
          var pView = new ReferralWireView.FormView({applet: upsertApplet, 
              templateHTML : templ,
              //parentView : parentView,
              /*success : function(model, response, jqXHR) {
                if (!_.isUndefined(success) || !_.isNull(success))
                  success(response);
              },
              */
              error : rwcore.showError 
        });
          pView.setDefaultModel();
          
          
          var el = "#pickCreateMode";
          var plist = "#pickMode";
          $(el).html(pView.render().el).trigger('create');
          
          $(el).show(0);
          
            $(el).animate({
                left:5
              }, 500, function() {
                //$(el).css('bottom','5px');
                //$(el).css('height','auto');
                    
              });
            
            $(plist).animate({
                left:-500
              }, 500, function() {
                  $(plist).hide();
              });
            
          return pView;
      },
      
      pick:function(event){
      	if (!_.isUndefined(this.params.ignorePick)) {
          return;
        }
        
        var target = event.target;
        var tagName = $(target).get(0).nodeName.toLowerCase();
        var anchorId = $(target).attr('id');
        if (tagName != 'a'){
          var anchor = $(target).parents('a');
          anchorId = anchor.attr('id');
        }
        var selectedModel = this.model.get(anchorId);
        this.execPickMap(selectedModel);
      
      },
              
      execPickMap:function(selectedModel){ // this used independently of a normal pick when there's an embedded create applet 
        
        rwApp.execPickMap({
	      	fromModel:selectedModel,
	      	pickMap:this.params.pickMap,
	      	toModel:this.params.parentView.model,
	      	form:this.params.parentView
      	
      	})
        
        
      },
      
      
      render:function(data) {
      		
      		var ulSelector = (!_.isUndefined(this.ulClass))?"#"+this.id+"."+this.ulClass:"#"+this.id;
      		$(ulSelector).html("");
      		
	  		var that = this;
	  		if ( data == undefined )
	          	data = that.model;
	        else {
	         	  if ( !_.isUndefined (that.params.clientSideSortAttr)) {
	        		  var sortedModels = _.sortBy (data.models, function(m) {return m.get(that.params.clientSideSortAttr);});
	        		  this.model.models = sortedModels;
	        		  if ( !_.isUndefined (that.params.clientSideSortDirection) && that.params.clientSideSortDirection == "DESC"){
	    		  		this.model.models.reverse();
	    		  	  } 
	         	  }
	         	  else {
	         		  that.model = data;
	         	  }
	    	}
			
	    	var timeStamp = "t"+new Date().getTime();
	    	this.selector = ($.hasVal(this.options.ulClass))?'#'+ that.id + "." + this.options.ulClass + "." + timeStamp:'#'+ that.id + "." + timeStamp;
	    	this.selector += ":visible";
	    	this.clickRoute = (!_.isUndefined(this.clickRoute))?this.clickRoute:(!_.isUndefined(this.params.clickRoute))?this.params.clickRoute:Backbone.history.fragment;
			var selector = this.selector;
			$(that.el).attr('data-role','listview'); 
	  	    if ($.hasVal(this.options.ulClass)){$(that.el).addClass(this.options.ulClass);}
	  	    $(that.el).addClass(timeStamp);
			
			
	    	if (that.model.models.length > 0){
	
				this.modelClone = _.clone(that.model);
				this.backupModel = _.clone(that.model);
				var batchSize = this.batchSize;
				
				var showMore = ($.hasVal(that.params.usePaging && that.model.models.length >= rwcore.pagingSize))?true:false;
				
				ReferralWireView.renderSet({
	  		 	
	  		 	models:this.modelClone.models,
	  		 	setSize:batchSize,
	  		 	selector:that.el,
	  		 	template:this.htmlTemplate,
  				applet:this.applet,
  				listItemClass:this.listItemClass,
  				totalRecords:that.model.models.length,
  				showMore:showMore,
  				pageNumber:that.pageNumber,
  				initial:true,
  				ulClass:this.options.ulClass,
  				fillRemainder:(!_.isUndefined(that.fillRemainder))?that.fillRemainder:false, //expect this to normally be false
  				clickRoute:this.clickRoute
  				
	  		 });
	  		 
	      	} 
	      	else {
	      		if (that.noRecordsMsg == 'hidden'){

	      			$(that.el).addClass('hidden');
	      		} else {
		      		var noRecordHTML = "<li class='noRecordsMsg'><h3 style='font-style:italic'>"+that.noRecordsMsg+"</h3></li>"
		      		$(that.el).append(noRecordHTML);
		      	}
	      	}
	      	  
	  	      $(that.el).attr('data-theme','c');
	  	      if (this.setFilter){
		  	      $(that.el).attr('data-filter','true');
		  	      $(that.el).attr('data-filter-placeholder','Keyword search (case sensitive)');
		  	  }

		  	  
	  	      /*	  
	  	      if ($.hasVal(that.params.usePaging && that.model.models.length >= rwcore.pagingSize ) ){
	             var showNext = "<li id='nextRecordsListItem'><a id='showNextRecords' currentPage=" + that.pageNumber + "><h3 style='font-style:italic'>Show More</h3></a></li>";
	             $(that.el).append(showNext);
		  	  }
		  	  */
	
	
		  	   //these lines will modify referral list items on the home page if they have  status value of "UNREAD"
		  	   

	        return that;
	 	
	 },
	 
      

      renderOld:function (data) { //no longer used with progressive rendering
      	var that = this;
	    
	    var useCachedHTML = false;
        var cacheKey = "nothing";
        var cacheOptimize = false;
        if ($.hasVal(that) && $.hasVal(that.model)){
        	if($.hasVal(that.model.options)){
        		cacheKey = "listHTML_"+that.model.options.module+rwFB.uId;
        		useCachedHTML = ($.hasVal(window.rwObjectCache) && $.hasVal(window.rwObjectCache[that.model.options.module + "_useCache"]))?window.rwObjectCache[that.model.options.module + "_useCache"]:false;
        		cacheOptimize = that.model.options.cacheOptimize;
        	}
        }
      	if ( data == undefined )
              data = that.model;
        else {
         	  if ( !_.isUndefined (that.params.clientSideSortAttr)) {
        		  var sortedModels = _.sortBy (data.models, function(m) {return m.get(that.params.clientSideSortAttr);});
        		  this.model.models = sortedModels;
        		  if ( !_.isUndefined (that.params.clientSideSortDirection) && that.params.clientSideSortDirection == "DESC"){
    		  		this.model.models.reverse();
    		  	  } 
         	  }
         	  else
         		  that.model = data;
        }
		        
		        
        that.backupModel = _.clone(that.model);

	      	if (that.model.models.length > 0){
	      		var lastCategory;
	      		var catField = that.listItem.metaApplet.model.get('dividerField');
	      		var useWholeWord = that.listItem.metaApplet.model.get('divideWithWholeWord');
	      		var dividerTemplateClass =  that.listItem.metaApplet.model.get('divideTemplateClass');
	  	    	_.each(that.model.models, function (stdModel) {
	  	    	
	  	    				
	                  
	        	    		if (!_.isUndefined(catField) && !_.isNull(catField) && catField != ""){
	        	    			
	        	    			if (!_.isUndefined(useWholeWord) && !_.isNull(useWholeWord) && useWholeWord == true){
	        	    				var catValue = stdModel.get(catField);
	        	    			} else {
	        	    				var catValue = stdModel.get(catField);
	        	    				catValue = ($.hasVal(catValue))?catValue.substr(0,1).toUpperCase():"...";
	        	    				
	        	    			}
	        	    		}	
	        	    				
	        	    		
	        	    		if ((_.isUndefined(lastCategory) || _.isNull(lastCategory) || catValue != lastCategory) && (!_.isUndefined(catValue) && !_.isNull(catValue) && catValue!="")){
	        	    			var dividerTemplateSelector = "."+dividerTemplateClass;
	        	    			var separatorEl = $(_.template('Snippets')()).find(dividerTemplateSelector).html(catValue);
	        	    			
	        	    			$(that.el).append(separatorEl);   
	        	    			lastCategory = catValue;
	        	    		}
	        	    		
	        	    		var listItemEl = that.listItem.render(stdModel).el;
	        		        $(that.el).append(listItemEl.outerHTML); 
	  		        }, that);
	  	     
	      	} 
	      	else {
	      		var noRecordHTML = "<li class='noRecordsMsg'><h3 style='font-style:italic'>"+that.noRecordsMsg+"</h3></li>"
	      		$(that.el).append(noRecordHTML);
	      	}
	      		
	  	      $(that.el).attr('data-role','listview'); 
	  	      if ($.hasVal(this.options.ulClass)){$(that.el).addClass(this.options.ulClass);}
	  	      
	  	      if (this.setFilter){
		  	      $(that.el).attr('data-filter','true');
		  	      $(that.el).attr('data-filter-placeholder','Keyword search...');
		  	  }
	  	    	  
	  	    /*if ($.hasVal(that.params.usePaging) && that.pageNumber > 1){
	  	      	 var showPrevious = "<li><a id='showPreviousRecords' currentPage=" + that.pageNumber + "><h3 style='font-style:italic'>Show Previous</h3></a></li>";
	      		$(that.el).prepend(showPrevious);
	  	    } */
				
			/*
  	    	if ($.hasVal(that.params.usePaging && that.model.models.length >= rwcore.pagingSize ) ){
             var showNext = "<li id='nextRecordsListItem'><a id='showNextRecords' currentPage=" + that.pageNumber + "><h3 style='font-style:italic'>Show More</h3></a></li>";
             $(that.el).append(showNext);
	  	    }
			*/

	  	   //these lines will modify referral list items on the home page if they have  status value of "UNREAD"
	  	    

	  	if($.hasVal(cacheOptimize)){
	  		var htm = $(that.el).html(); 
	  		$(that.el).html(htm).trigger('create');
	  		
            localStorage.setItem(cacheKey,$(that.el).html());
        }
 
        return that;
      },
    
      selectItem: function (modelId){
      	
        //assumes the list is rendered as a collection of list items <li>
        //this.model = model; 
        if (!_.isUndefined($('#'+modelId)[0])){
	        var tagName = $('#'+modelId)[0].nodeName;
	        var listItem = (tagName == "LI")?$('#'+modelId):$('#'+modelId).parents('li');
	
	          listItem.siblings().removeClass('ui-btn-active');
	          listItem.addClass('ui-btn-active');  
        }       
      },

      textSearchHandler : function(e, data) {

        var that = this;
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val();

        if ( value && value.length > e.data.numCharsToTriggerSearch ) {
            $ul.html( "" );
            $ul.listview( "refresh" );
            e.data.model.options['searchText'] = value;
            e.data.model.reset();
            e.data.pageNumber = 1;
            e.data.showNextRecords(e);
            
            if (e.data.options.listMap){
            	e.data.parentView.renderListMap();
            }
        }

        // reset it back to orignal list 
        if ( value.length == 0 ) {
            
            e.data.model.options['searchText'] = undefined;
            e.data.model.reset();
            e.data.pageNumber = 1;
      
            var p = rwApp.fetchList(e.data.model.options)
            p.done(function(model){
            	$ul.html( "" );
            	$ul.listview( "refresh" );
            	e.data.model = model;
            	e.data.reDraw(model);
            	if (e.data.options.listMap){
            		e.data.parentView.renderListMap();
            	}
            });
            /*
            e.data.model = _.clone(e.data.backupModel);
            e.data.reDraw(e.data.backupModel);
            if (e.data.options.listMap){
            	e.data.parentView.renderListMap();
            }
            */
        }

      }

    });
  	
	ReferralWireView.RadioList = ReferralWireView.ListView.extend({
    	
    	
        tagName:'fieldset',
        events:{
            "click .rw_listitem":"pick",
            "click #cancelPick": "cancelPick",
            "click [radiolabel]":"select"
          },
          
        select:function(event) {
        	  var target = event.target;
            var selectedId = $(target).parents('[radiolabel]').attr('for');
			var updateOptions = {
					dview:this.options.updateview,
					setFieldMap:{contactLNId:selectedId}
			}
			rwApp.showLinkedInProfile(selectedId);
			rwApp.updateKeyFieldSilent(updateOptions);
			
        },
        
        render:function (data) {
        	

        	if ( data == undefined )
                data = this.model;
                else 
                  this.model = data;
            
        	var that = this;


        	if (that.model.models.length > 0){
    	    	_.each(that.model.models, function (stdModel) {
    	        var listItemEl = that.listItem.render(stdModel).el;
    	        $(that.el).append(listItemEl.innerHTML); //changed from outerHTML	        
    	        }, that);
    	     
        	} 
        	else {
        		var noRecordHTML = "<h3 style='font-style:italic' class='noRecordsMsg'>"+that.noRecordsMsg+"</h3>"
        		$(that.el).append(noRecordHTML);
        	}

        	//$("div span:first-child")
    	      $(that.el).attr('data-role','controlgroup');
    	      
    	      if (!_.isUndefined(this.options.lnId) && !_.isNull(this.options.lnId) && this.options.lnId != ""){
    	    	  $(that.el).children('#'+this.options.lnId).attr('checked','checked');
    	      } else {
    	    	  $(that.el).children('fieldset input:first-child').attr('checked','checked');
    	      }
    	      
    	      //these lines will modify referral list items on the home page if they have  status value of "UNREAD"
          
          return that;
        },
        
    });
    
    
    ReferralWireView.AssociationView = ReferralWireView.ListView.extend({
    	
    	
    	events:{
    	//"click .assoc":function(){alert('yeah')}	
    	},
    	
        cancelUpdate:function(){
	    	var el2 = '#upsertRecord'
		    	  $(el2).animate({
		    		    top:1000
		    		  }, 500, function() {
		    			  $(this.el).hide(50);
		    		      $(".overlay-background").toggle(00);
		    			  $(el2).css('bottom','auto');
		    			  $(el2).css('height','99%');
		    			  $(el2).css('top','100%');
		    			  $(el2).hide();
		    			  
		    			   rwApp.refreshTopView(false);
		    			  
		    		  });
	    	rwApp.preventNavigation = false;
	    },
	    
	    removeAssociation:function(event){
	    	 var elem = null; 
    		 var tagName = event.target.nodeName;
    		 if (tagName != "LI"){
    		 	elem = $(event.target).parents("li");
    		 }
    		 else {
    		 	elem = $(event.target);
    		 } 
    		 var thisCartKey = elem.attr("key");
    		 var thisCID = this.cartIndex[thisCartKey];
    		 //this.model.remove(this.model.getByCid(thisCID));
    		 this.model.remove(this.model.get(thisCID));
    		 this.refresh(true);
	    },
    	
    	addAssociation:function(event){
    	
    		 
    		 var elem = null; 
    		 var tagName = event.target.nodeName;
    		 if (tagName != "LI"){
    		 	elem = $(event.target).parents("li");
    		 }
    		 else {
    		 	elem = $(event.target);
    		 }  
    		  
    		  var selectedId = elem.attr("id");
    		  var selectedModel = this.listModel.get(selectedId);
    		 
    		  var module = this.model.options.module
    		  var assocModel = new rwcore.StandardModel({"module" : module});
		 	  var assocMetaApplet = new ReferralWireBase.AppletView({applet: this.applet});
		 	  
		 	  ReferralWireBase.setDefaultValues(assocModel, this.toMetaApplet, null);
			  
			  var mapValues = new Object();
			  
			  for (item in this.associationMap) {
				  mapValues[item] = selectedModel.get(this.associationMap[item]);
				  
			  }
			  assocModel.set(mapValues);
			  /*
			  assocModel.set({
				  // need a metadata map here instead of hardcoding
				  	name:selectedModel.get("DisplayVal"),
				  	GlobalVal:selectedModel.get("GlobalVal"),
				  	category:selectedModel.get("Group"),
				  	DisplaySeq:selectedModel.get("DisplaySeq"),
		      });
		      */
		      this.model.add(assocModel);
		      this.refresh(false);
		      elem.hide();
		      

    	},
    	
    	refresh:function(reset){
    			$("#leftTitle").html(this.leftTitle);
           		$("#rightTitle").html(this.rightTitle);
           		var toListHTML = this.renderList({model:this.model,listItemView:this.toListItem,cartAction:"build",cartKey:this.toCartKey,clientSideSortAttr:this.toClientSideSortAttr});
           		if (reset){
	           		var fromListHTML =  this.renderList({model:this.listModel,listItemView:this.listItem,cartAction:"filter",cartKey:this.cartKey});
	           		$("#assocFrame").html(fromListHTML[0]).trigger("create");
           		}
           		$("#cartFrame").html(toListHTML[0]).trigger("create");
           		
    	},
    	
  	    render:function (paintFunction) {
  	    
  	    
	  	    	options = this.params;
	  	    	var that = this;
	  	   
           		
           		this.assocMetaApplet = new ReferralWireBase.AppletView({applet: this.applet});
           		this.cartKey = this.assocMetaApplet.model.get("assocKeyField");
           		this.leftTitle = this.assocMetaApplet.model.get("pluralTitle");	  	    	
	  	    	this.toApplet = options.assocOptions.toApplet;
	  	    	this.toMetaApplet = new ReferralWireBase.AppletView({applet: this.toApplet});
	  	    	this.toCartKey = this.toMetaApplet.model.get("assocKeyField");	  	  
	  	    	this.rightTitle = this.toMetaApplet.model.get("pluralTitle");
	  	    	this.toSetFilter = options.assocOptions.toSetFilter;
	  	    	this.toHtmlTemplate = options.assocOptions.toHtmlTemplate;
	  	    	this.toClientSideSortAttr = this.toMetaApplet.model.get("sortBy");
	  	    	this.toListItemClass = "cartItem";
	  	    	this.toListItem = new ReferralWireView.ListItemView({applet:this.toApplet, setFilter:this.toSetFilter, template: this.toHtmlTemplate,listItemClass:this.toListItemClass,customRowAttr:options.assocOptions.toCustomRowAttr});	  	    	
 	  	    	this.listItem.listItemClass = "assoc";  //this is used to generate the 'from' list; this.toListItem is used to generate the 'To' list
	  	    	this.associationMap=options.assocOptions.associationMap;
	  	    	
	  	    	var dDataOptions = {
	              		  	module : this.actor, 
	          				searchSpec: this.searchSpec, 
	          		        sortby : this.sortby,
	          		        sortOrder : _.isUndefined(options.sortOrder) ? "ASC" : options.sortOrder
	            };
	                  
	            if (!_.isUndefined(options.detailSearchSpec)) {
	                		var keys = Object.keys(options.detailSearchSpec);
	                		for ( var i = 0; i < keys.length; i++) {
	                			var thisKey = keys[i];
	                			var thisVal = options.detailSearchSpec[keys[i]];
	                			
	                			if ($.hasVal(options.parentKeyField) && options.parentKeyField == thisVal)
	                				thisVal = model.get(thisVal); //the search spec is a field value from the parent record
	                		
	                			dDataOptions[thisKey] = thisVal;
	                		}
	            }
	                  
	            var d_data = new rwcore.StandardCollection(dDataOptions);
	  	    	
	  	    	
	  	    	d_data.fetch( {
	                  //add : true,
	                  error : rwcore.showError, 
	                  success : function (model, response, jqXHR) {
	                  	that.listModel = model;
	                  	if (paintFunction == "renderContainer")
	                  		that.renderContainer();
	                  		
	                  	if (paintFunction == "refresh")
	                  		that.refresh(true);
	                  		
	                  	//that.renderContainer();
	                  	//parentView.renderExec(that)
	                  }
	             });
           },

           
           
           
           renderContainer: function(){
           		 
           		//this.assocMetaApplet = new ReferralWireBase.AppletView({applet: this.applet});
           		//this.cartKey = this.assocMetaApplet.model.get("assocKeyField");
           
           		var viewTitle = this.parentView.options.viewTitle;
           		var dynamicTitles = this.parentView.options.dynamicTitles;
           		var viewTemplate = this.parentView.viewTemplate;
				var toListHTML = this.renderList({model:this.model,listItemView:this.toListItem,cartAction:"build",cartKey:this.toCartKey,clientSideSortAttr:this.toClientSideSortAttr});
           		var fromListHTML =  this.renderList({model:this.listModel,listItemView:this.listItem,cartAction:"filter",cartKey:this.cartKey});
				 
				
				var sideBySideTempl = ReferralWire.getTemplate('Templates/Patterns/WizardAssocSnippet.html');
           		var fromHTML = fromListHTML[0].outerHTML;
           		var toHTML = toListHTML[0].outerHTML;
           		var sideBySideHTML = _.template(sideBySideTempl,{fromListHTML:fromHTML,toListHTML:toHTML,_:_});

				var titleStr = ($.hasVal(viewTitle))?viewTitle:($.hasVal(dynamicTitles))?dynamicTitles:"";
		    				    	
		    	var html = _.template(this.parentView.viewTemplate, {firstAppletHTML:sideBySideHTML,title:titleStr, stations:this.parentView.stations,_:_})		    	
		    	
		    	this.parentView.$el.html(html);
		    	$(this.parentView.container).html(this.parentView.$el).trigger("create");
		    	$("#leftTitle").html(this.leftTitle);
           		$("#rightTitle").html(this.rightTitle);
		    	this.parentView.showView();
           		
           },
           
           renderList: function(rOptions){
           				//note: this doesn't currently support a toggle template at the row level. i.e., the same list-item template is used for all rows.  
           				
           				var data = rOptions.model;
           				var cartKey = rOptions.cartKey;
           				var cartAction = rOptions.cartAction;
           				var resultingHTML = "";
             			that = this;
             			var lItem = rOptions.listItemView;      	  
               	        var clientSortAttr = rOptions.clientSideSortAttr;
               	        
				        
    
		     	        $(that.el).attr('data-role','listview'); 
		     		  
		     		    if ($.hasVal(this.options.ulClass)){$(that.el).addClass(this.options.ulClass);}
		     		  
			  	        if (this.setFilter){
			  	    	   $(that.el).attr('data-filter','true');
			  	    	   $(that.el).attr('data-filter-placeholder','Keyword search...');
			  	    	}
		
		         	    if ( !_.isUndefined (clientSortAttr)) {
		        		   var sortedModels = _.sortBy (data.models, function(m) {return m.get(clientSortAttr);});
		        		   data.models = sortedModels;
		         	    }
			         	
					    if (cartAction == "build"){
				        	this.cartIndex = new Object();          	  
				        }
					        
			            //that.backupModel = _.clone(that.model);
					 
				      	if (data.models.length > 0){
				      		var lastCategory;
				      		var catField = lItem.metaApplet.model.get('dividerField');
				      		var useWholeWord = lItem.metaApplet.model.get('divideWithWholeWord');
				      		var dividerTemplateClass =  lItem.metaApplet.model.get('divideTemplateClass');
				  	    	_.each(data.models, function (stdModel) {
				  	    		  
				                  var thisId = stdModel.get("id");
				                  var thisKeyVal = stdModel.get(cartKey);
				                  var thisCid = stdModel.cid;
				                  if (cartAction == "build"){
				                  	  
				                  	  this.cartIndex[thisKeyVal] = thisCid;
				                  }
				                  
				                  
				                  if ((cartAction == "filter" && !$.hasVal(that.cartIndex[thisKeyVal])) || cartAction != "filter"){ // exclude items that are in the shopping cart
				                  
				        	    		if (!_.isUndefined(catField) && !_.isNull(catField) && catField != ""){
				        	    			
				        	    			if (!_.isUndefined(useWholeWord) && !_.isNull(useWholeWord) && useWholeWord == true){
				        	    				var catValue = stdModel.get(catField);
				        	    			} else {
				        	    				var catValue = stdModel.get(catField);
				        	    				catValue = ($.hasVal(catValue))?catValue.substr(0,1).toUpperCase():"...";
				        	    				
				        	    			}
				        	    		}	
				        	    				
				        	    		
				        	    		if ((_.isUndefined(lastCategory) || _.isNull(lastCategory) || catValue != lastCategory) && (!_.isUndefined(catValue) && !_.isNull(catValue) && catValue!="")){
				        	    			var dividerTemplateSelector = "."+dividerTemplateClass;
				        	    			var separatorEl = $(_.template('Snippets')()).find(dividerTemplateSelector).html(catValue);
				        	    			
				        	    			$(that.el).append(separatorEl);
				        	    			//resultingHTML += separatorEl[0];   
				        	    			lastCategory = catValue;
				        	    		}
				        	    		
				        	    		var listItemEl = lItem.render(stdModel).el;
				        	    		$(listItemEl).attr("key",thisKeyVal);
				        	    		//resultingHTML += listItemEl.outerHTML;
				        		        $(that.el).append(listItemEl.outerHTML);
				        		  }      
				        		         
				  		  }, that);
				  	     
				      	} 
				      	else {
				      		var noRecordHTML = "<li class='noRecordsMsg'><h3 style='font-style:italic'>"+that.noRecordsMsg+"</h3></li>"
				      		$(that.el).append(noRecordHTML);
				      		//resultingHTML += noRecordHTML;
				      	}
    	  
					
		  	  	    	if ($.hasVal(that.params.usePaging && data.models.length >= rwcore.pagingSize ) ){
		                	var showNext = "<li id='nextRecordsListItem'><a id='showNextRecords' currentPage=" + that.pageNumber + "><h3 style='font-style:italic'>Show More</h3></a></li>";
		                 	$(that.el).append(showNext);
		                 	//resultingHTML += showNext;
				  	    }
						
					  	   //these lines will modify referral list items on the home page if they have  status value of "UNREAD"
						
			        	resultingHTML = $(that.el).clone();	
			        	
			        	$(that.el).empty();
			        	return resultingHTML;
			      }
    

    }); //closes association view
  	
  	ReferralWireView.TableChartView = Backbone.View.extend({

    tagName:'div',
    id: Math.random().toString(36).substr(2,16),
    params:"",
      applet:"",
      noRecordsMsg:"No records!",
      initialize:function (options) {

	      this.htmlTemplate = ($.hasVal(options.template))?options.template:options.templateHTML;

	      this.applet = options.applet;
	      if (!_.isUndefined(options.noRecordsMsg) && !_.isNull(options.noRecordsMsg))
	          this.noRecordsMsg = options.noRecordsMsg;
	      this.metaApplet = new ReferralWireBase.AppletView({applet: this.applet, template: this.htmlTemplate,showViewBar:false});
	      this.actor = this.metaApplet.actor;
	      this.bc = this.metaApplet.bc;
	      this.bo = this.metaApplet.bo;
	      this.parentView = options.parentView;
	      
	      this.searchSpec = this.metaApplet.model.get('searchSpec');
	      this.sortBy = this.metaApplet.model.get('sortBy');
	      this.sortDir = this.metaApplet.model.get('sortDir');
	
	    },
	    setModel:function(model){
	    	this.model = model;
	    },
  		render:function (data) {
  			that = this;
  			this.tagName='div';
  			
  			var columnIdentifier = 'datetime';
  			var rowIdentifier = 'fullName';
  			var tableData = $.tableTransform(that.model.models,rowIdentifier,columnIdentifier);

  			/*tableData contents:
  				indexes.colIndex = sorted array of unique column identifiers
				indexes.rowIndex = sorted array of unique row identifiers
				indexes.rowObjects = two dimensional map of rows and columns. Each cell contains the primary id of the original StdCollection
  			*/
  			var html = "";
  			if ($.hasVal(tableData.colIndex) && tableData.colIndex.length > 0){ 	 
	  			var html = _.template(this.htmlTemplate, {indexes:tableData,data:that.model});
	  		} 
			$(that.el).html(html);
        	return that;
  			
  		}
  	
  	});
  	
  	ReferralWireView.BasicChartView = Backbone.View.extend({

    tagName:'div',
    id: Math.random().toString(36).substr(2,16),
    params:"",
      applet:"",
      noRecordsMsg:"No records!",
      initialize:function (options) {

	      this.htmlTemplate = ($.hasVal(options.template))?options.template:options.templateHTML;
	      this.transformOptions = options.transformOptions;

	      this.applet = options.applet;
	      if (!_.isUndefined(options.noRecordsMsg) && !_.isNull(options.noRecordsMsg))
	          this.noRecordsMsg = options.noRecordsMsg;
	      this.metaApplet = new ReferralWireBase.AppletView({applet: this.applet, template: this.htmlTemplate,showViewBar:false});
	      this.actor = this.metaApplet.actor;
	      this.bc = this.metaApplet.bc;
	      this.bo = this.metaApplet.bo;
	      this.parentView = options.parentView;
	      
	      this.searchSpec = this.metaApplet.model.get('searchSpec');
	      this.sortBy = this.metaApplet.model.get('sortBy');
	      this.sortDir = this.metaApplet.model.get('sortDir');
	
	    },
	    setModel:function(model){
	    	this.model = model;
	    },
  		render:function (data) {
  			that = this;
  			this.tagName='div';
  			
  			
  			this.chartData = this.transformOptions.transformFunction(that.model.models,this.transformOptions);
  			
  			
  			var html = "";
			$(that.el).html(html);
        	return that;
  			
  		}
  	
  	});
  	
  	
  	ReferralWireView.ReferralMgmtListView = ReferralWireView.ListView.extend({
  		
        events:{
            //"click [toggleState]": "toggleCollapse",
            "click #acceptOrIngore":"updateItem",
          },
  	
  		
        toggleCollapse:function(event){
        	
        	// console.log("toggleCollapse");
        	
            var target = event.target;
            var tagName = $(target).get(0).nodeName.toLowerCase();
            var toggleCID = $(target).attr('toggleCID');
            var expandDuration = (_.isUndefined(event.expandDuration))?500:event.expandDuration;
            if (tagName != 'td'){
              var thisTD = $(target).parents('[toggleState]');
              toggleCID = thisTD.attr('toggleCID');
            }
            var selectedModelId = thisTD.attr('statecell');
            var toggleState = thisTD.attr('toggleState');
            var referralStatus = thisTD.attr('referralStatus');
            var inboxFlag = false
            if (!_.isUndefined(thisTD.attr('inboxToggle')) && !_.isNull(thisTD.attr('inboxToggle')))
            	inboxFlag = true;
            var recommendToggle = false;
            if (!_.isUndefined(thisTD.attr('recommendToggle')) && !_.isNull(thisTD.attr('recommendToggle')))
            	recommendToggle = true;
            var detailSectionId = toggleCID+"_details";//this naming convention is used in RefCollapsibleList.html
            var selectedModel = this.model.get(selectedModelId);
			var fromFullName = (!_.isUndefined(selectedModel))?selectedModel.get("from_fullName"):"";
            
            var referralType = (!_.isUndefined(selectedModel))?selectedModel.get("referralType"):thisTD.attr('referralType');
            
            //var selectedModelId = selectedModel.get('id');
            if (referralType == "PART_FOR_PART" && referralStatus == "WAITING" && !_.isUndefined(selectedModel)){
            	referralStatus = (selectedModel.get("waitingForId") == rwFB.uId)?"UNREAD":referralStatus;
            }            //var selectedModelId = selectedModel.get('id');
            
            var containerEL = event.containerEL;
            if (_.isUndefined(containerEL) || _.isNull(containerEL))
            	containerEL = "homePage";
            
            if (toggleState == "collapsed"){
            	if (referralStatus == "UNREAD" && inboxFlag){
            		//var accept = confirm('do you wish to accept?');
            		var popUpContainer = $("#PopupContainer");
            		that = this;
            		
	                    var confirmTemplate = (referralType == "PART_FOR_PART" || referralType == "PART_INVITE")?"AcceptInvitationConfirmation":"AcceptReferralConfirmation";
	                    
	                    var confirmHTML = _.template(confirmTemplate)();
			    		if (!_.isUndefined(fromFullName)){
			    			
			    			confirmHTML = confirmHTML.replace(/ZfromFullName/g,fromFullName)
			    		}
          		
          				popUpContainer.html(confirmHTML);
          				popUpContainer.addClass("confirmation");
          				$(".overlay-background").show();
          				popUpContainer.show();
          				popUpContainer.delegate("[popEvent]", "click", function() {
          				
          				  that.updateItem(
          				  	{eventId:this.id,
          				  	sModelId:selectedModelId,
          				  	pageContainer:containerEL,
          				  	popup:popUpContainer,
          				  	fromName:fromFullName,
          				  	});
          				  	popUpContainer.undelegate("[popEvent]", "click");
          				});

          				popUpContainer.delegate("[confirmevent]", "click", function(pEvent) {
          					
							pEvent.popUpContainer = popUpContainer;
          					rwApp.confirmationDialogResponse(pEvent);
					        
						});


            	} else {
            	
            	    //$("[detailnodestate]").hide(500);
                    //$("[detailnodestate]").attr("detailnodestate","hidden");  

                    //$('[togglestate = "expanded"]').attr("togglestate","collapsed");  
                    
                    var detailTemplateName = thisTD.attr("detailSnippetId");
                    if ($.hasVal(detailTemplateName)){
	                    //var referralDetailTemplate = $(ReferralWireBase.Templatecache.Snippets()).find("#"+detailTemplateName).html();
	                    var snippetsHTML = _.template('Snippets')();
	                    var referralDetailTemplate = $(snippetsHTML).find("#"+detailTemplateName).html();
	                    
	                    var doc = document.implementation.createHTMLDocument('refDetails');
	  					var detailDocShell = doc.createElement("div");
	  					detailDocShell.innerHTML = referralDetailTemplate;
	                    
	                    var detailHTML = ReferralWireBase.recordBinder(detailDocShell, selectedModel);
	                    $("[objid="+selectedModelId+"_details]").html(detailHTML);
	                 }
                    
                    
            		
                	$("#"+detailSectionId).show(expandDuration,function(){
                		//thisTD.find('img').attr('src','images/icons/closeIconBlueTall.png');
                		//thisTD.find('span').html('Collapse');
                		thisTD.toggleClass("expanded");
                        thisTD.attr('toggleState','expanded');
                        
                      
                        
                    });
                    
                    if(referralStatus == "UNREAD" && recommendToggle) {
	            		//thisTD.find('img').attr('src','images/icons/addIconBlueTall.png');
	            		//thisTD.find('span').css('color','#6C9EDA');
	            		thisTD.toggleClass("expanded");
	            		
	            		rwApp.updateKeyFieldSilent({
							dview:this,
							actionRecordId:selectedModelId,
							setFieldMap:{status:"PENDING"}
						});
            		}

            	}
            } else {
            	thisTD.attr('toggleState','collapsed');
            	//thisTD.removeClass("expanded");
	            //thisTD.addClass("collapsed");
	            thisTD.toggleClass("expanded");
            	$("#"+detailSectionId).hide(500);
               // thisTD.find('img').attr('src','images/icons/addIconBlueTall.png');
               //thisTD.find('span').html('Expand');
                
                
            }

          },
          
          
        updateItem: function(options) {
        	
        	if (options.eventId == "cancelPick"){
    			$("#PopupContainer").hide();
    			$("#PopupContainer").removeClass("confirmation");
    			$(".overlay-background").hide();
        	} else {
        		

	        	var selectedModel = this.model.get(options.sModelId);
	        	var referralType = selectedModel.get("referralType");
	        	var status = selectedModel.get("status");
	        	
	        	if (options.eventId=="archiveReferral"){
	        		selectedModel.set("archiveFlag","true");
	        	} else if (status == "UNREAD" && referralType == "PART_FOR_PART"){
	        		selectedModel.set("status","WAITING")  //user is first one to accept
	        		var toId = selectedModel.get("toId");
	        		var toId2 = selectedModel.get("toId2");
	        		if (toId == rwFB.uId){selectedModel.set("waitingForId",toId2)}; //set waitingForId to the other guy
	        		if (toId2 == rwFB.uId){selectedModel.set("waitingForId",toId)};
	        		
	        	} else if (status == "WAITING" && referralType == "PART_FOR_PART"){
	        		var waitingForId = selectedModel.get("waitingForId");
	        		if (waitingForId == rwFB.uId){
	        			selectedModel.set("status","ACCEPTED");
	        			
	        		}	
	        		
	        	}else if (status == "UNREAD"){
	        		selectedModel.set("status","ACCEPTED");
	        	} 

	    			
	    			
	    			$("#PopupContainer").hide();
	    			$("#PopupContainer").removeClass("confirmation");
	    			$(".overlay-background").hide();
	    			
	    			var that = this;
	    			selectedModel.save({}, {
		        		success : function (model, response, jqXHR) {
		        		
		        			
		        			if (options.pageContainer == "homePage"){
		        				//refresh the homepage	
		        				//var homePageEL = $('div [applet="ReferralInbox"]');
		        				var homePageEL = $('div [applet="ReferralNewsFeed"]');
		        				//rwApp.refreshTopView(true);
		        				that.parentView.renderSection(homePageEL);
		        				//var homePageEL = $('div [applet="ActivityList"]');		
		        				//that.parentView.renderSection(homePageEL);
		        				//var homePageEL = $('div [applet="gauges"]');		
		        				//that.parentView.renderSection(homePageEL);
		        			} else {
		        				
		        				$(options.pageContainer).html(that.render().el.outerHTML).trigger("create");


		        			}
		        			
		        			
		        			
		        		},
		        		error : function(request,status,error) {
		        			rwcore.FYI('save error')
		        		},
		        		done : function(model, response, jqXHR) { 
		        			options.popup.undelegate("[popEvent]", "click");
		        		}
	    			});
        	}
        },
		
		
		render:function(data){
		//alert('render ref list')
			if ($.hasVal(data) && $.hasVal(data.renderTo)){
				this.renderOptimized(data);
			} else {
				return this.renderLegacy(data);
			}
		},
  	
  		//original render
  	    renderLegacy:function (data) {
  	    	
  	    	 
  	    	if ( data == undefined )
  	            data = this.model;
  	            else 
  	              this.model = data;
  	        
  	    	var that = this;
			
			
			
  	    	$(that.el).empty();
  	    	if (that.model.models.length > 0){
  		    	_.each(that.model.models, function (stdModel) {
  		    	
  		    	//the list item template could be a regular template or a function that returns a template
  		    	//the later allow for the dynamic use of different templates depending a record val like referral status
  		    	
  		    	
				//var template = (_.isFunction(this.htmlTemplate))?this.htmlTemplate(stdModel):this.htmlTemplate; 
				if(!_.isFunction(this.htmlTemplate) && this.htmlTemplate.indexOf("rwApp.")>-1){ //if template name is a function, then evaluate with a null model

		        	var templateFunction = eval(this.htmlTemplate);
		        	var template = templateFunction(stdModel);
		    		
		        } else {
					var template = this.htmlTemplate
				}
				
				
				
				this.listItem = new ReferralWireView.ListItemView({applet:this.applet, template: template,listItemClass:this.listItemClass,clickRoute:this.clickRoute});  		    	
  		    	
  		        var listItemEl = that.listItem.render(stdModel).el;
  		        $(that.el).append(listItemEl.outerHTML);        
  		        }, that);
  		     
  	    	} 
  	    	else {
  	    		var noRecordHTML = "<li class='noRecordsMsg'><h3 style='font-style:italic'>"+that.noRecordsMsg+"</h3></li>"
  	    		$(that.el).append(noRecordHTML);
  	    	}
  	    	
  	    	
  		      $(that.el).attr('data-role','listview');  
  		      $(that.el).attr('appletUL',this.options.applet);  
  		      if (this.setFilter){
  		        $(that.el).attr('data-filter','true');
  		        $(that.el).attr('data-filter-placeholder','Keyword search...');
  		      }
  		      
  		      //these lines will modify referral list items on the home page if they have  status value of "UNREAD"
  		      
  		      $(that.el).find('[referralFlag="UNREAD"]').children('img').css('display','initial')
  		      $(that.el).find('[flagLabel="UNREAD"]').html('Unread');
  		      $(that.el).find('[toggleAction="UNREAD"] [inboxToggle]').html('Accept?');
  		      
  		      $(that.el).find('[inboxDetailNode="UNREAD"]').empty();
  		      $(that.el).find('[inboxDetailNode="UNREAD"]').remove();
  		      var parentLI = $(that.el).find('[inboxDetailNode="IGNORED"]').parent();
  		      parentLI.hide();
  	      

  	      
  	      //$(that.el).attr('data-autodividers','true');

  	      
  	      return that;
  		
  	},
  	
  	
  	
  	renderOptimized:function (data) {
  	    	
  	    	 
  	    	if ( data == undefined )
  	            data = this.model;
  	            else 
  	              this.model = data;
  	        
  	    	var that = this;
			
			
			
  	    	//$(that.el).empty();
  	    	if (that.model.models.length > 0){
  	    		$(that.el).attr('data-role','listview');  
	  		    $(that.el).attr('appletUL',this.options.applet);  
	  		      if (this.setFilter){
	  		        $(that.el).attr('data-filter','true');
	  		        $(that.el).attr('data-filter-placeholder','Keyword search...');
	  		    }
  	    		//data.renderTo.html(that.el.outerHTML).trigger('create');
  	    		//var selector = $(that.el).attr("id");
  	    		//var selector = "#" + data.renderTo.attr("id") + " ul";


  	    		var selector=that.el;
  	    		var clickRoute = Backbone.history.fragment.split("/")[0];
  		    	
/*  		    	
  		    	var html = ReferralWireView.renderSet({
  		    		models:that.model.models,
  		    		setSize:2,
  		    		selector:selector,
	  		 	    template:that.htmlTemplate,
  					applet:that.applet,
  					listItemClass:that.listItemClass,
  					clickRoute:clickRoute,
  					fillRemainder:true,
  					async:true
  		    	});
  		    	//data.renderTo.html(that.el.outerHTML).trigger('create');
  		    	if (!_.isUndefined(html)){
  		    		data.renderTo.html(html).trigger('create');	
  		    	} else {
  		    		data.renderTo.html(that.el.outerHTML).trigger('create');
  		    	}
 */		    	
 				var p = $.Deferred()
  		    	var s = ReferralWireView.renderSet({
  		    		models:that.model.models,
  		    		setSize:4,
  		    		selector:selector,
	  		 	    template:that.htmlTemplate,
  					applet:that.applet,
  					listItemClass:that.listItemClass,
  					clickRoute:clickRoute,
  					fillRemainder:true,
  					ulClass:this.options.ulClass,
  					async:true,
  					promise:p
  		    	});
  		    	//console.log("list html " +html);
  		    	//data.renderTo.html(html).trigger('create');	
  		    	var html = (_.isObject(s))?s.outerHTML:that.el.outerHTML;
  		    	data.renderTo.html(html).trigger('create');	
  		    	
		    	p.done(function(sel){
		    		//html = (_.isObject(sel))?sel.outerHTML:that.el.outerHTML;
		    		//if (_.isObject(sel)){console.log("sel is object2")} else{console.log("sel is string")}
		    		//data.renderTo.html(html).trigger('create');	
		    		return that;
		    		
		  		});	

  		     
  	    	} 
  	    	else {
  	    		var noRecordHTML = "<li class='noRecordsMsg'><h3 style='font-style:italic'>"+that.noRecordsMsg+"</h3></li>"
  	    		$(that.el).append(noRecordHTML);
  	    		data.renderTo.html(that.el.outerHTML).trigger('create');
  	    		return that;
  	    	}
  	    	
  	      
  	      //$(that.el).attr('data-autodividers','true');

  	      
  	      
  		
  	},
  	
  	
  	
  	
  	});
  	
  	ReferralWireView.addSeparator = function(domSelector,metaApplet,lastCategory,stdModel){
  	
  	 	      	
	      var catField = metaApplet.model.get('dividerField');
	      var useWholeWord = metaApplet.model.get('divideWithWholeWord');
	      var dividerTemplateClass = metaApplet.model.get('divideTemplateClass');
  	
    	   if (!_.isUndefined(catField) && !_.isNull(catField) && catField != ""){
    			
    			if (!_.isUndefined(useWholeWord) && !_.isNull(useWholeWord) && useWholeWord == true){
    				var catValue = stdModel.get(catField);
    			} else {
    				var catValue = stdModel.get(catField);
    				catValue = ($.hasVal(catValue))?catValue.substr(0,1).toUpperCase():"...";				
    			}
    		}			
    		if ((_.isUndefined(lastCategory) || _.isNull(lastCategory) || catValue != lastCategory) && (!_.isUndefined(catValue) && !_.isNull(catValue) && catValue!="")){
    			var dividerTemplateSelector = "."+dividerTemplateClass;
    			var separatorEl = $(_.template('Snippets')()).find(dividerTemplateSelector).html(catValue);
    			
    			$(domSelector).append(separatorEl);   
    			lastCategory = catValue;
    		}
    		return lastCategory;
  	
  	};
	                  
  	
  	
  	ReferralWireView.renderSet = function(options){
  		
  		var models = options.models;
  		var setSize = (!_.isUndefined(options.setSize))?options.setSize:4;
  		var selector = options.selector;
  		var template = options.template;
  		var applet = options.applet;
  		var pageNumber = options.pageNumber;
  		var listItemClass = options.listItemClass;
  		var clickRoute = options.clickRoute;
  		//if ($.hasVal(options.iter)){alert('second');}
  		var iterateLength = setSize;
  		var appendShowMore = false;
  		var fillRemainder = (!_.isUndefined(options.fillRemainder))?options.fillRemainder:true;
  		var currentRoute = Backbone.history.fragment;
  		var currentRouteBase = currentRoute.split("/")[0];
  		var p = options.promise;
  		if (currentRoute != clickRoute && currentRouteBase != clickRoute){fillRemainder = false;}
		

  		if (models.length <= setSize){
  			iterateLength = models.length;
  			if ($.hasVal(options.showMore) && options.showMore){
  				appendShowMore = true;
  			}
  		}
  		//var iterateLength = (models.length > setSize)?setSize:models.length;
  		var lastCategory = options.lastCategory;

  		that = this;
  		
  		//var iterateLength = models.length;
  			for (var i = 0; i < iterateLength; i++) {
  				var stdModel = models[i];
  		    	
  		    	//the list item template could be a regular template or a function that returns a template
  		    	//the later allow for the dynamic use of different templates depending a record val like referral status
  		    	
				if(_.isFunction(template) || template.indexOf("rwApp.")>-1){ //if template name is a function, then evaluate with a null model

		        	var templateFunction = eval(template);
		        	stdModel.clickRoute = (!_.isUndefined(clickRoute))?clickRoute.split("/")[0]:"undefined";
		        	var templateHTML = templateFunction(stdModel);
		    		
		        } else {
		        	var templateHTML = template;
		        }
		        
				
				var listItem = new ReferralWireView.ListItemView({applet:applet, template: templateHTML,listItemClass:listItemClass,clickRoute:clickRoute});  		    	
  		    	
  		        var listItemEl = listItem.render(stdModel).el;//
  		        
  		        lastCategory = ReferralWireView.addSeparator(selector,listItem.metaApplet,lastCategory,stdModel);
  		        $(selector).append(listItemEl.outerHTML);

  		                
  		    }
  		   	/* 
	  		if(appendShowMore){
	  			 var showNext = "<div><img style='left-margin:50px' height='30' width='100' src='/images/FetchAction.gif'/></div>";
      			 
	  		     //var showNext = "<li id='nextRecordsListItem'><a align='right' id='showNextRecords' currentPage=" + pageNumber + "><img style='left-margin:50px' height='30' width='100' src='/images/FetchAction.gif'/></a></li>";
		         $(selector).parent.append(showNext);
	  		}
			*/
			
  		 	if (_.isObject(selector) && options.async){
  		 	
	  			var selectorId = $(selector).attr("id");
	  			var selectorStr = ($.hasVal(options.ulClass))?'#'+ selectorId + "." + options.ulClass:'#'+ selectorId;
		    	
	  			if ($(selectorStr).parent().length > 0){
	  				$(selectorStr).listview('refresh');
	  				console.log("changing to string");
	  				selector = selectorStr;
	  			}
  			 
  		 	} else if ($(selector).parent().length > 0){ 
  		 		$(selector).listview('refresh');
  		 	}
  		 	
  		  	 
  		 if (fillRemainder && models.length > iterateLength){
	  		 models = _.rest(models,(iterateLength));
	  		 if ($.hasVal(options.async)){
		  		 setTimeout(function() { ReferralWireView.renderSet({
		  		 	models:models,
		  		 	setSize:setSize,
		  		 	selector:selector,
		  		 	template:template,
	  				applet:applet,
	  				listItemClass:listItemClass,
	  				lastCategory:lastCategory,
	  				showMore:options.showMore,
	  				initial:true,
	  				fillRemainder:true,
	  				clickRoute:clickRoute,
	  				promise:p,
	  				async:options.async
	  				
		  		 })} , 10);
	  		 } else {
	  		 
	  		 //this block should be removed to support progressive rendering
	  		 
	  		 ReferralWireView.renderSet({
	  		 	models:models,
	  		 	setSize:setSize,
	  		 	selector:selector,
	  		 	template:template,
  				applet:applet,
  				listItemClass:listItemClass,
  				lastCategory:lastCategory,
  				showMore:options.showMore,
  				initial:true,
  				fillRemainder:true,
  				clickRoute:clickRoute
  				
	  		 })
	  		}
	  		 
	  	 } else {
	  	 	$(selector).attr("lastCategory",lastCategory); //remembers the late category
	  	 	if (!_.isUndefined(p)){
	  	 		//alert('presolve');
	  	 		p.resolve(selector);
	  	 	}
	  	 	//listViewListContainer

	  	 }
	  	 
	  	 return selector;
  	};
  

  	ReferralWireView.ListDetailView = Backbone.View.extend({

    //detailDiv : ".rw_details", //replaced by "#form1" etc. in displaySelect function
    viewBarDiv: ".rw_ViewBar",
    menuDiv: ".rw_appletMenu",

    events:  {
        "click .rw_listitem":"handleSelect",
        "change select": function(event) { rwcore.spinOn(); this.options.detailview.changeItem(event); rwcore.spinOff(); },
        "change input": function(event) { this.options.detailview.changeItem(event); },
        "change textarea":function(event){ this.options.detailview.changeItem(event); },
        "click #save": function () { this.options.detailview.saveItem(event); event.preventDefault();},
        "click .savedSearchDisplay":"launchSavedSearch",
        //"click .savedSearchDesc":function(){$(".savedSearchDesc").hide(); $(".listViewListContainer.hasAdvancedSearch ul").css("top","40px")},
        //"click .ui-icon-searchfield:after":"launchSavedSearch",
        "click .editSearchButton":"showSearchView",
        "click #delete":"deleteItem",
        "click #enrich":"enrichItem",
        "click #new":"newRecord",
        "click #edit":"editRecord",
        "click #editRole":"editRole",
        "click #editSelf":"editSelf",
        "click #refer":"referCustToSelected",
        "click #invite":"invite",
        "click #inmail":"inmail",
        "click #org_announce":"org_announce",
        "click [editSection]":function(){this.options[$(event.target).attr('editSection')].editRecord();},
        "click [confirmation='true']":"updateField",
        "click [claimOrArchive]":"claimOrArchive",
        "click [updateStatus='ACCEPTED']":"updatedClaimedStatus",
        "click [updateStatus='CONFIRMED']":"updatedContactedStatus",
        "click [launchshow]":function(event){this.options.detailview.launchshow(event);},
        "click [nextphoto]":function(event){this.options.detailview.next(event);},
        "click [prevphoto]":function(event){this.options.detailview.previous(event);},
        "click [closeslideshow]":function(){$("#slideshowcontainer").hide();},
        "click #linkedIn":"showLinkedIn",
        //"click #googleMaps":"showMaps",
        "click #referralWire":function(){rwApp.refreshTopView(false)},
        "click #printprofile":"printProfile",
        "click #printpartner":"printProfile",
        "click #wizardEdit":"wizardEdit",
        "click #publish":"publish",
        "click #org_publish":"OrgPublish",
        "click #LinkedIn":"LinkedIn",
        "click #wizardNew":"wizardNew",
        "click [action = 'import']":function(){rwApp.importContacts('placebo');},
        "click #showNextRecords":function(){this.options.listview.showNextRecords()},
        "click #showPreviousRecords":function(){this.options.listview.showPreviousRecords()},   
        "click #fixRecord":"fixRecord",
        "click .addressbook":"prospectVals",
        "click .addressbook":"prospectVals",
        "click .joinChapter":"joinChapter",
        "click .joinMeeting":"joinMeeting",
        "click .leaveMeeting":"leaveMeeting",
        "click [actionone]": function(event) { 
            var dview = ReferralWireView.ChildViewContainer.findByCustom("FaceBookFriendsList");
            dview.actionone(event);
          },
        "click [actiontwo]": function(event) { 
            var dview = ReferralWireView.ChildViewContainer.findByCustom("LinkedInConnectionList");
            dview.actiontwo(event);
          },
        //"scroll":function(){alert('viewscroll')}
         "click #exportCSV":"exportCSV",

      },
      
      initialize:function (options) {

        this.options = options;
        this.clickRoute = options.route;
        this.searchModel = options.ssModel;
        this.refreshFunction = options.refreshFunction;
        this.editRefreshFunction = options.editRefreshFunction;
        if ( !_.isUndefined(this.options.detailview) && !_.isNull(this.options.detailview))
        	this.options.detailview.parentView = this;
        //these added for socialProfile view
        if ( !_.isUndefined(this.options.profileLinksView) && !_.isNull(this.options.profileLinksView))
        	this.options.profileLinksView.parentView = this;    
        if ( !_.isUndefined(this.options.profileChartView) && !_.isNull(this.options.profileChartView))
        	this.options.profileChartView.parentView = this; 
        
      },


      refreshInPlace:function(model) {

      		var cF = this.options.listview.params.calculatedFields;
      		if (!_.isUndefined(cF)){
    			for (var f in cF) {
    				var fVal = cF[f](model);
    				var keyVal = new Object();
    				keyVal[f] = fVal;
    				model.set(keyVal);
    					
    			}
    		}
   
      		model.clickRoute = this.clickRoute;
      		var modelId = model.get('id');
      		this.options.listview.model.set(model,{remove:false});

      		var listItem = this.options.listview.listItem;
      		var listItemEl = listItem.render(model).el;
      		$("li#"+modelId).replaceWith(listItemEl.outerHTML);
      		$(this.options.listview.selector).listview('refresh');
      		$("li#"+modelId+" a").click();


      },

      launchSavedSearch:function(){
      	var ssPicker = new ReferralWireView.SavedSearchPickView({searchGroup:this.options.savedSearch.searchGroup,parentView:this});
      	ssPicker.render();
      },

      showSearchView:function(){
      	var so = this.options.savedSearch; //these params are set in the route
      	so.parentView = this;
      	so.searchModel = this.searchModel;
      	var ssView = new ReferralWireView.SearchView(so);
      	ssView.render();
      	this.searchView = ssView;
      },

      

      applySavedSearch:function(searchModel){

      		var searchName = "";
      		if (searchModel.get('searchName') == ""){
      			searchName = "Ad Hoc Search";
      		} else  {
      			searchName = searchModel.get('searchName');
      			//searchModel.set("searchName",searchModel.get('searchName'));
      		}
      		this.searchModel = searchModel;
        	$(".savedSearchName").html(searchName);
        	$("#view-title-suffix").html("");
        	$("#viewTitle").html(searchName);
        	//if (!_.isUndefined(this.searchView)) {this.searchView.refreshSearchModel(searchModel);}
        	this.options.listview.model.options.searchModel = this.searchModel;
        	

        	this.options.listview.model.options.searchRequest = rwApp.parseSavedSearch(searchModel,this.options.savedSearch.searchAppletName);
        	this.options.listview.model.options.searchText = undefined;
        	this.options.listview.model.options.skip = undefined;
        	$(this.options.listview.selector).html("");
        	$(".hasAdvancedSearch .ui-input-search input").attr("value","")
      		
      		var promise = rwApp.fetchList(this.options.listview.model.options);	
      		var that = this;

      		if (searchModel.get("accessLevel") == "public"){

      		}
      		$(this.options.listview.selector).addClass("fetching");
      		if (!_.isUndefined(this.ChartView)){
      			if (!_.isUndefined(this.searchModel.get("noChartFilter"))){
      				this.searchModel.set({noChartFilter:undefined});
      			} else {
	      			this.ChartView.searchRequest = this.options.listview.model.options.searchRequest;
	      			this.ChartView.render();
	      		}
      		}
      		var that = this;

	    	promise.done(function(model){
	    		
	    		// that.options.listview.model.add(model.models, {silent: true});
	    		that.options.listview.model = model;
	    		that.options.listview.pageNumber = 1;
	    		that.options.listview.reDraw(model);
	    		$(that.options.listview.selector).removeClass("fetching");
	    		if (that.options.listMap){
            		that.renderListMap();
            	}
	  		})
		    

      },

      
      fixRecord:function(){
		
      	var upsertApplet = this.options.fixRecordApplet
    	this.options.detailview.editRecord(upsertApplet);
    	
      },
      
      prospectVals:function(){
      		var locString = new String(window.location);
      		var n=locString.indexOf("ReferralWireView.com");
			if (n == -1){
  				var route = "#prospectVals/" + this.options.detailview.model.get('id');
        		rwApp.navigate(route,{trigger: true,replace: false});
        	}
            		
      },

      claimOrArchive:function(event){
		    var selectedModel = this.options.detailview.model;
		    selectedModel.set({protoStatus:"ACCEPTED"});
		  
		    var wizardSpec = rwApp.getUpdateUnreadReferralWizard();
		      var wizard = new ReferralWireView.WizardUpsertView ( { 
		        firstApplet:wizardSpec.firstApplet,
		        refreshFunction: function(){this.parentView.renderSection($('#referralInboxView'))},
		        nextAppletFunctions:wizardSpec.nextAppletFunctions,
		        //appletTemplates:wizardSpec.appletTemplates,
		        viewTemplate: wizardSpec.viewTemplate,
		        upsertmodel: selectedModel,
		        stations:wizardSpec.stations,
		        saveFunction:wizardSpec.saveFunction,
		        parentView: this,
		        showConfirmOnSave: wizardSpec.showConfirmOnSave,
		        wizardSpec:wizardSpec,
		        wizardViewClass:"noTrain"
		      });
		      wizard.render();

		},

      updatedClaimedStatus:function(event){
	    
	    
	    var selectedModel = this.options.detailview.model;
	    selectedModel.set({protoStatus:"CONFIRMED"});
	  
	    var wizardSpec = rwApp.updateClaimedReferralWizard;
	      var wizard = new ReferralWireView.WizardUpsertView ( { 
	        firstApplet:wizardSpec.firstApplet,
	        refreshFunction: function(){rwApp.refreshTopView()},
	        nextAppletFunctions:wizardSpec.nextAppletFunctions,
	        //appletTemplates:wizardSpec.appletTemplates,
	        viewTemplate: wizardSpec.viewTemplate,
	        upsertmodel: selectedModel,
	        stations:wizardSpec.stations,
	        saveFunction:wizardSpec.saveFunction,
	        parentView: this,
	        showConfirmOnSave: wizardSpec.showConfirmOnSave,
	        wizardSpec:wizardSpec,
	        wizardViewClass:"noTrain"
	      });
	      wizard.render();
	  
	  },

	  updatedContactedStatus:function(event){
	    var selectedModel = this.options.detailview.model;
	    selectedModel.set({protoStatus:"CONVERTED"});
	  
	    var wizardSpec = rwApp.getUpdateContactedReferralWizard();
	      var wizard = new ReferralWireView.WizardUpsertView ( { 
	        firstApplet:wizardSpec.firstApplet,
	        nextAppletFunctions:wizardSpec.nextAppletFunctions,
	        refreshFunction: function(){rwApp.refreshTopView()},
	        //appletTemplates:wizardSpec.appletTemplates,
	        viewTemplate: wizardSpec.viewTemplate,
	        upsertmodel: selectedModel,
	        stations:wizardSpec.stations,
	        saveFunction:wizardSpec.saveFunction,
	        parentView: this,
	        showConfirmOnSave: wizardSpec.showConfirmOnSave,
	        wizardSpec:wizardSpec,
	        wizardViewClass:"noTrain"
	      });
	      wizard.render();
	  },
      
      showLinkedIn:function(){
    	  
	    	var firstName = this.options.listview.model.get('firstName');
	  		var lastName = this.options.listview.model.get('lastName');
	  		var zipCode = this.options.listview.model.get('postalCodeAddress');
	  		var contactLNId = this.options.listview.model.get('LNProfileId');
    	  
    	  
    	  var LIOptions = {
    		firstName:(!_.isUndefined(firstName) && !_.isNull(firstName))?firstName:"",
    		lastName : (!_.isUndefined(lastName) && !_.isNull(lastName))?lastName:"",
    		zipCode : (!_.isUndefined(zipCode) && !_.isNull(zipCode))?zipCode:"",
    		contactLNId : (!_.isUndefined(contactLNId) && !_.isNull(contactLNId))?contactLNId:"",
    		dview : this.options.listview
    	  }
    	  

        	  
    	  rwApp.showLinkedInList(LIOptions);
      },
      
      renderInLineClock: function(timeField){
        var timeVal = this.options.detailview.model.get("timeField");
        timeVal = ($.hasVal(timeVal))?timeVal:0;
        var hour = new Date(timeVal).getHours();
        var minutes = new Date(timeVal).getMinutes();
        
      	var clockOptions = {
      		renderTo:"clockTarget",
      		hours:hour,
      		minutes:minutes,
      		seconds:0
      	}
      	// $.renderClock(clockOptions);
      },
      
      renderInLineMap:function(){
      	  var recordArray = [this.options.detailview.model]; //function written for array of markers but we just have one
    	  var markers = rwApp.getMapMarkerArray(recordArray,".mapPopUpSelector",{businessName:"ZfullName",establishmentName:"Zbusiness",logoUrl: rwFB.CDN + "/images/emptyPic.png"});
    	  var centerAddress = (!_.isUndefined(markers.markerArray[0].address))?markers.markerArray[0].address:(!_.isUndefined(markers.markerArray[0].latLng))?markers.markerArray[0].latLng:undefined;
    	  rwApp.renderMap({mArray:markers.markerArray,targetSelector:"#mapTarget",zoom:13,centerAddress:centerAddress});
      },

      renderListMap:function(){
      	  var recordArray = this.options.listview.model.models; //function written for array of markers but we just have one
      	  var lmo = this.options.listMapOptions;
    	  var markers = rwApp.getMapMarkerArray(recordArray,lmo.popTemplateSelector,lmo.fieldMap);
    	  this.isMapView = true;
    	  rwApp.renderMap({mArray:markers.markerArray,targetSelector:"#listMap",bounds:markers.latlngbounds,centerAddress:markers.centerAddress,parentView:this});
      },
      
      
      
      showMaps:function(){
    	  var recordArray = [this.options.listview.model]; //function written for array of markers but we just have one
    	  var markers = rwApp.getMapMarkerArray(recordArray,".mapPopUpSelector",{fullName:"ZfullName",business:"Zbusiness",photoUrl: rwFB.CDN + "/images/emptyPic.png"});
    	  // $("#linkedInSelector").hide();
    	  //$(".profilePlatter").html('<div id="mapTarget" style="height:500px"></div>');
    	  
    	  rwApp.renderMap({mArray:markers.markerArray,targetSelector:"#mapTarget"});
      },
      

      printProfile:function(event){
       	  var profileId = this.options.listview.model.get('id');
       	
       	  $("#printPage").css("top",1500); // need to show the div otherwise charts won't render
          $("#printPage").show();
          rwApp.actor = this.options.listview.model.options.module;
		  rwApp.printProfileViewDef.selectedId = profileId
    	  rwApp.GenericSummaryDetailPattern(rwApp.printProfileViewDef);

      },
      
	 

      
      newRecord:function(){
          var upsertApplet = ($.hasVal(this.options.upsertApplet))?this.options.upsertApplet:this.options.detailview.applet;
          this.options.detailview.createRecord(upsertApplet);
    	  
      },
      
      inmail:function(){
      	var m = this.options.detailview.model;
        var module = m.options.module;
        if (module == "PartnerMgr"){
	      	var firstName = m.get("firstName_pub");
	      	var toFullName = m.get("fullName_pub");
	      	var toPartyId = m.get("partnerId");
	      	var toPartyType = m.get("partytype");
	      	var toEmail = m.get("emailAddress_pub");
	      	if (!$.hasVal(toEmail)){
	      		toEmail = m.get("emailAddress2");
	      	}
	     } else {
	      	var firstName = m.get("firstName");
	      	var toFullName = m.get("fullName");
	      	var toPartyId = m.get("id");
	      	var toPartyType = m.get("partytype");
	      	var toEmail = m.get("emailAddress");
	      	if (!$.hasVal(toEmail)){
	      		toEmail = m.get("emailAddress2");
	      	}
	      	
	    }
      	
      	rwApp.newInMail({
      		toFirstName:firstName,
      		toFullName:toFullName,
      		toPartyId:toPartyId,
      		toPartyType:toPartyType,
      		toEmail:toEmail,
      		parentView:this
      	});
      	
      },

      org_announce :function(){
      	var m = this.options.detailview.model;
        rwApp.newAnnouncement({
      		chapter : m,
      		parentView : this
      	});
      	
      },


      invite:function(){
        
        
        var m = this.options.detailview.model;
        var module = m.options.module;
        if (module == "PartnerMgr"){
	      	var firstName = m.get("firstName_pub");
	      	var toFullName = m.get("fullName_pub");
	      	var toPartyId = m.get("partnerId");
	      	var toPartyType = m.get("partytype");
	      	var toEmail = m.get("emailAddress_pub");
	      	if (!$.hasVal(toEmail)){
	      		toEmail = m.get("emailAddress2");
	      	}
	     } else {
	      	var firstName = m.get("firstName");
	      	var toFullName = m.get("fullName");
	      	var toPartyId = m.get("id");
	      	var toPartyType = m.get("partytype");
	      	var toEmail = m.get("emailAddress");
	      	if (!$.hasVal(toEmail)){
	      		toEmail = m.get("emailAddress2");
	      	}
	      	
	     }
      	
      	rwApp.newInvitation({
      		toFirstName:firstName,
      		toFullName:toFullName,
      		toPartyId:toPartyId,
      		toPartyType:toPartyType,
      		toEmail:toEmail,
      		parentView:this
      	});
      	
      	
      	
      },
      editSelf:function(event){
      	//var model = new rwcore.StandardModel({module: 'UserMgr', id: rwFB.uId});
      	debugger;
      	var that = this;	
      	var p = rwApp.fetchList({
	            	module : "UserMgr",
		            //id : options.id,
	            })
      	
		p.done(function(model){
			var m = model.models[0];
			var upsertApplet = ($.hasVal(that.options.upsertApplet))?that.options.upsertApplet:that.options.detailview.applet;
	      	that.options.detailview.refreshFunction = function(){rwApp.refreshTopView(false)}
	      	that.options.detailview.model = m;
	      	that.options.detailview.editRecord(upsertApplet);
		})
      	
      },

      editRecord:function(event){
    	 
	      var upsertApplet = ($.hasVal(this.options.upsertApplet))?this.options.upsertApplet:this.options.detailview.applet;
	      this.options.detailview.refreshFunction = this.editRefreshFunction;
    	  this.options.detailview.editRecord(upsertApplet);
    	  this.options.detailview.refreshFunction = undefined;
      },
      
      editRole:function(event){
    	  
    	  if (event.target.tagName == 'A'){
	    		var elem = $(event.target);
	    	} else {
	    		var elem = $(event.target).parent('a');
	    		
	    	}
	      
	      var upsertApplet = elem.attr("upsertApplet");
	      var m = this.options.detailview.model;
	      this.options.detailview.model.set({
	      	pre_OrgId:m.get("OrgId"),
	      	pre_isPrimaryAmbassador:m.get('isPrimaryAmbassador')
	      });
    	  this.options.detailview.editRecord(upsertApplet);
      },
      
      exportCSV : function(event) {
      	rwcore.showWaitDialog("CSVExportProgress");
      	var csvFile = rwcore.JSONServerRequest('/csv?type=members','GET','application/octet-stream');
      	if ( csvFile ) {
	      	var csv = document.createElement('a');
    	  	csv.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvFile));
      		csv.setAttribute('download', 'members');
      		csv.click();
      	}
      	rwcore.hideWaitDialog(true);
      },

      wizardEdit:function(event){
      	
      	var wizard = new ReferralWireView.WizardUpsertView ( { 
	    	firstApplet:this.options.upsertWizard.firstApplet,
	    	nextAppletFunctions:this.options.upsertWizard.nextAppletFunctions,
	    	viewTemplate: this.options.upsertWizard.viewTemplate,
	    	upsertmodel: this.options.detailview.model,
	    	stations:this.options.upsertWizard.stations,
	    	saveFunction:this.options.upsertWizard.saveFunction,
	    	parentView: this,
	    	wizardSpec:this.options.upsertWizard,
	    	refreshFunction:this.editRefreshFunction
        });
        wizard.render();
      	
      },
      
      publish : function (event) {
      	rwcore.spinOn();
      	var model = new rwcore.StandardModel({module: 'UserMgr', id: rwFB.uId, publicProfile : $('.rw_details').html() });
      	var promise = model.call("publicProfile", model, {async : false});
      	$.when(promise).done( function (data) {
      			rwcore.spinOff();
				window.open(data.publicProfile, 'popup');      							
	      }); 
      },

      OrgPublish : function (event) {
      	var orgId = this.options.detailview.model.id;
      	var model = new rwcore.StandardModel({module: 'OrgMgr', id: orgId, publicProfile : $('.profilePlatter').html() });
      	var promise = model.call("publicProfile", model, {async : false});
   
      	rwcore.spinOn();
      	$.when(promise).done( function (data) {
      			rwcore.spinOff();
				window.open(data.publicProfile, 'popup');      							
	      }); 
      },

	  LinkedIn : function (event) {

	  	var that = this ;
	  	if ( _.isNull(rwcore.SocialNetworkLogin.value) )
            rwcore.SocialNetworkLogin.value = rwcore.JSONServerRequest(rwcore.SocialNetworkLogin.location,'GET', 'html');
		
		//rwcore.showWaitDialog(rwcore.SocialNetworkLogin.value, { title: 'Looking up LinkedIn Information' } );
		$.when(rwcore.LNAuthenticate()).done(function(response) {

			var photoUrl = that.options.detailview.model.get("photoUrl");
			var profilePhotoUrl = that.options.detailview.model.get("profilePhotoUrl");
			var jobTitle = that.options.detailview.model.get("jobTitle");

			var model = new rwcore.StandardModel({module: 'UserMgr', id: rwFB.uId, 
					bio :  response.summary, 
					jobTitle : _.isUndefined(jobTitle) ? response.headline : undefined, 
					profilePhotoUrl : _.isUndefined(profilePhotoUrl)  ? response.pictureUrl : undefined,
					photoUrl : _.isUndefined(photoUrl) ?  response.pictureUrl : undefined 
				});

      		model.save({},  {async : false, 
      						success : function() {
      							rwcore.FYI("Your LinkedIn Information has been imported");
			  					//rwcore.hideWaitDialog();
			  					rwApp.refreshTopView();
 	    					}
      		});
		}).fail(function() { rwcore.FYI("There was connection issue with LinkedIn, please try again later."); 
					/*rwcore.hideWaitDialog(); */ });

      },

      wizardNew:function(event){
      	var wizard = new ReferralWireView.WizardUpsertView ( { 
	    	firstApplet:this.options.upsertWizard.firstApplet,
	    	nextAppletFunctions:this.options.upsertWizard.nextAppletFunctions,
	    	refreshFunction:this.options.upsertWizard.refreshFunction,
	    	viewTemplate: this.options.upsertWizard.viewTemplate,
	    	upsertmodel: null,
	    	stations:this.options.upsertWizard.stations,
	    	saveFunction:this.options.upsertWizard.saveFunction,
	    	parentView: this,
	    	wizardSpec:this.options.upsertWizard
        });
        wizard.render();
      },
      
      updateField:function(event){
    	  
    	  event.dView = this.options.detailview;
    	  var resetContext = $(event.target).attr("refreshlist");
    	  
    	  event.refreshFunction = (resetContext)?"rwApp.refreshTopView(true)":"rwApp.refreshTopView(false)";
    	  rwApp.updateKeyField(event);
      },
      
      joinChapter:function(event){
      	  
      	  var options = new Object();
 		  options.refreshRoute = "#OrgList/"+ this.options.detailview.model.get("id");
 		  options.OrgId = this.options.detailview.model.get("id");
 		  rwApp.joinChapter(options);
 			
      },

      joinMeeting:function(event){
      	  
      	  var options = new Object();
 		  options.refreshFunction = function(model,listdetailview){listdetailview.refreshInPlace(model);}, 
 		  options.eventId = this.options.detailview.model.get("id");
 		  options.OrgId = this.options.detailview.model.get("OrgId");
 		  options.htmlTemplate = "ConfirmJoinMeeting";
 		  options.parentView = this;
 		  options.operation = "add";
 		  rwApp.toggleMeetingAttendence(options);
 			
      },

      leaveMeeting:function(event){
      	  
      	  var options = new Object();
 		  options.refreshFunction = function(eventId){rwApp.refreshTopView();}, 
 		  options.eventId = this.options.detailview.model.get("eventId");
 		  options.attendeeId = this.options.detailview.model.get("attendeeId");
 		  options.OrgId = this.options.detailview.model.get("OrgId");
 		  options.htmlTemplate = "ConfirmLeaveMeeting";
 		  options.parentView = this;
 		  options.operation = "remove";
 		  rwApp.toggleMeetingAttendence(options);
 			
      },
      
 	 
	  deleteItem:function (event) {
	  	  
	  	  var that = this;
		  event.dView = that.options.detailview;
		  var m =  that.options.detailview.model;
		  var id = m.get("id");
    	  event.refreshFunction = function () {

    	  	var this_li = $('.rw_listitem#' + id );
    	  	var prev_li = this_li.prev();
    	  
    	  	var next_li = this_li.next();

    	  	this_li.remove();
    	  	if ( prev_li.attr('role') == 'heading' && next_li.attr('role') == 'heading' )
    	  	{	
    	  		var pprev = prev_li.prev();
    	  		prev_li.remove();
    	  	}

    	  	if( next_li.attr('role') == 'heading' ) {
    	  		next_li = next_li.next();
    	  	}

    	  	var lm = that.options.listview.model;
    	  	lm.remove(m);

    	  	if ( !_.isUndefined(next_li) ) {
    	  	 	var aItem = next_li.find('a'); 
    	  	 	aItem.click();
    	  	}
    	  	else if ( !_.isUndefined(pprev) ) {
    	  	    var aItem = pprev_li.find('a'); 
    	  		aItem.click();
    	  	}
    	  	// else the list is empty. nothing to click on

    	  }

    	  rwApp.updateKeyField(event);
	  },
	  
	  enrichItem:function(event){
	  		event.dView = this.options.detailview;
 			event.refreshFunction = "rwApp.refreshTopView(true)";
 	    	rwApp.updateKeyField(event);
 	    	  //rwApp.navigate(currentRoute,{trigger: true,replace: true});
 	  },
      
      referCustToSelected:function(event){
      	  
    	  event.dView = this.options.detailview;
    	  event.refWizard = this.options.refWizard;
    	  event.parentView = this;
     	  //event.toPartyId = this.options.detailview.model.get("partnerId");
     	  //event.toFullName = this.options.detailview.model.get("fullName");
     	  rwApp.referCustToSelectedPartner(event);
    	  
      },
      
      centerAndPopMapLocation:function(model){
      	 
      	 var mapSelector = "#listMap";
      	 var lat = ($.hasVal(model.get('latitude_work')))?parseFloat(model.get('latitude_work')):undefined;
	     var lng = ($.hasVal(model.get('longitude_work')))?parseFloat(model.get('longitude_work')):undefined;
      	 var id = model.get('id');
      	 var map = $(mapSelector).gmap3("get");
      	 
      	 
      	 setTimeout(function(){
		    var markers = $(mapSelector).gmap3({
		      get: {
		        name:"marker",
		        tag: id,
		        all: true
		      }
		    });
		     
		    $.each(markers, function(i, marker){
		      //marker.setIcon("http://maps.google.com/mapfiles/marker_green.png");
		      map.panTo(marker.getPosition());
		      if (map.getZoom() < 9){
			      //map.setZoom(9);
			  }
		      google.maps.event.trigger(markers[i], 'click');
		      //map.event.trigger(marker, 'click');
		    });
		  }, 0);

			this.setNavContext(id);		  
      },
      
      setNavContext:function(id){
      		  var model = this.options.listview.model.get(id);
      		  this.options.listview.selectItem(id);
			  if ($.hasVal(this.options.secondTierNav)){
	        	secondTierNavHTML = _.template('SecondTierNavBar',{model:model,secondTierNav:this.options.secondTierNav});
	        	$(".secondTierNav").html(secondTierNavHTML).trigger("create");
	          }
	          this.options.viewBar.model = model;
	          var viewBarHTML = this.options.viewBar.render().el.outerHTML;
	          $(this.viewBarDiv).html(viewBarHTML).trigger("create");
      		
      },

      handleSelect:function (event){
      	
      	rwcore.spinOn();
      	try {
        var target = event.target;
        var tagName = $(target).get(0).nodeName.toLowerCase();
        var anchorId = $(target).attr('id');
        if (tagName != 'a'){
          var anchor = $(target).parents('a');
          anchorId = anchor.attr('id');
        }
        
        //
        var selectedModel = this.options.listview.model.get(anchorId);
        
        var address = "#" + this.options.route + "/" + anchorId;
	        
	    var stateObj = { foo: "bar" };
	
        if(window.history.replaceState) {
            //Your code
        	history.replaceState(stateObj, "Contacts", address);
        }

        if (!_.isUndefined(this.searchView)){
        	this.searchView.closeView();
    	}
        
        if ($.hasVal(this.isMapView) && this.isMapView){
        	this.centerAndPopMapLocation(selectedModel)
        } else {
        
	        this.displaySelected(selectedModel);
        }

        rwcore.spinOff();
      	}
      	catch(e) {
	      	rwcore.spinOff();	
      	}
         
      },
   
      displaySelected: function (model) {
      	if (!_.isUndefined(model)){
	      	if ( model.get('_regualarSize') ) {

				model.clickRoute = (!_.isUndefined(this.options.route))?this.options.route:Backbone.history.fragment;
	        	
	        	this.options.listview.selectItem(model.id);
	          	this.options.detailview.model = model;
	          	this.options.viewBar.model = model;
	          	this.options.appletMenu.model = model;
	          	
	          	if($.hasVal(this.options.appletMenuRight)){this.options.appletMenuRight.model = model;}
	          

	        	var formHTML =  this.options.detailview.render().el.outerHTML;
	        	var viewBarHTML = this.options.viewBar.render().el.outerHTML;
	        	var menuHTML = this.options.appletMenu.render().el.outerHTML;
	        
	        	var rightMenuHTML = "";
	        	if($.hasVal(this.options.appletMenuRight))
	        		{rightMenuHTML = this.options.appletMenuRight.render().el.outerHTML;}
	        
	        	if ($.hasVal(this.options.secondTierNav)){
	        		secondTierNavHTML = _.template('SecondTierNavBar',{model:model,secondTierNav:this.options.secondTierNav});
	        	}
	        
	        	$("#form1").html(formHTML).trigger("create");
	        
	        	if($.hasVal(this.options.detailview2)) {
		        	this.options.detailview2.model = model;
		        	formHTML =  this.options.detailview2.render().el.outerHTML;
		        	$("#form2").html(formHTML).trigger("create");
		        }
	    
	        	if($.hasVal(this.options.detailview3)) {
		        	this.options.detailview3.model = model;
		        	formHTML =  this.options.detailview3.render().el.outerHTML; 
		        	$("#form3").html(formHTML).trigger("create");
	        	}

	        	if($.hasVal(this.options.detailview4)) {
		        	this.options.detailview4.model = model;
		        	formHTML =  this.options.detailview4.render().el.outerHTML;
		        	; 
		        	$("#form4").html(formHTML).trigger("create");
	        	}

	        	if (!_.isUndefined(this.options.ChartWizardView)){
	       		 	this.options.ChartWizardView.render(model);
	        	}

	        	$(this.viewBarDiv).html(viewBarHTML).trigger("create");
	        	$(this.menuDiv).html(menuHTML).trigger("create");
	        	$(".rightMenu").html(rightMenuHTML).trigger("create");
	       
		      	if ($.hasVal(this.options.inlineMap)){
		      		this.renderInLineMap();
		      	}
		      
		      	if ($.hasVal(this.options.inlineClock)){
		      		this.renderInLineClock(this.options.inlineClock);
		      	}
	        	rwApp.removeEmptyFields();

	        	return false;
	        }
	    	else {
	    		var that = this;
	    		var regularRow = new rwcore.StandardModel( { module : this.options.listview.actor, id: model.id } );
	          	regularRow.fetch( {
	                async : false,
	                error : rwcore.showError, 
	                success : function (m, r, jqXHR) {
	                	model.set(m.attributes);
						model.set( {'_regualarSize' : true } );
	    				that.displaySelected (model) ;
	                }
	          	}); 
	    	}

	    } //close !_.isUndefined(model)

      },
      
      renderDetailView : function (index) {
        return displaySelected(this.options.listview.model.models[index]);
        // this.options.detailview.model = this.options.listview.model.models[index];
		// return this.options.detailview.render().el.outerHTML;
      },
      
      renderAdditionalDetailView : function (formIndex,recordIndex) {
      	var formView = null;
      	switch (formIndex){
      		case 2:formView = this.options.detailview2;
      		break;
      		case 3:formView = this.options.detailview3;
      		break;
      		case 4:formView = this.options.detailview4;
      		break;
      		default:formView = this.options.detailview2;
      		
      	}
        formView.model = this.options.listview.model.models[index];
        return formView.outerHTML;
      },
      
      renderDetailBody : function (index) {
        //this.options.detailview.model = this.options.listview.model.models[index];
        var h = "";
        try {        	
        	rwcore.spinOn();      	
        	h = this.options.detailview.render().el.outerHTML;
        	rwcore.spinOff();
      	
        }
        catch(e) {
        	// Skinny model may throw this exception..due to lack of data.
        	// but thats okay..immediately after, we are going to get the regular size model to 
        	// render 
        	// console.log(e);
        	// do nothing;
        	rwcore.spinOff();
      	
        }
        return h;
      },
      
      renderViewBar : function (index){
        return this.options.viewBar.render().el.outerHTML;
      },
      
      
      render:function (eventName) {
		
		rwcore.spinOn();
      	try {
		if ($.hasVal(this.options.appletMenuRight)){
			this.options.appletMenuRight = new ReferralWireView.FormView({
	    	 applet:this.options.appletMenuRight,
	    	 templateHTML : 'StdForm', //This is ignored at the time of rendering
	    	 showViewBar:true, 
	    	 viewBarTemplate:'AppletMenuTemplate',
	    	 model: this.options.detailview.model
	  		});	  
	  	}
		
		
		
        var list = this.options.listview.render().el.outerHTML;
        
	        
        var titleStr = "";
        if ( !_.isUndefined(this.options.viewTitle) && !_.isNull(this.options.viewTitle)){
        	titleStr = this.options.viewTitle;
        } else if ( !_.isUndefined(this.options.dynamicTitles) && !_.isNull(this.options.dynamicTitles) && this.options.dynamicTitles.length > 0){
        	var dTitle = this.options.dynamicTitles[0];
        	titleStr = ( !_.isUndefined(dTitle) && !_.isNull(dTitle))?dTitle:"";
        } else {
        	titleStr = this.options.detailview.metaApplet.model.attributes['pluralTitle'];
        }
        
        var secondTierNavHTML = "";
		        
        if ($.hasVal(this.options.secondTierNav)){
        		
        	var thisModel = ($.hasVal(this.options.listview.model.models))?this.options.listview.model.models[0]:this.options.listview.model;
        	secondTierNavHTML = _.template('SecondTierNavBar',{model:thisModel,secondTierNav:this.options.secondTierNav});
        }
        
        
        var detailBody = ($.hasVal(this.options.detailview))?this.renderDetailBody(0):"";
        var html = _.template(this.options.templateHTML, {listview: list, secondTierNav:secondTierNavHTML,render : this, title:titleStr,detailBody:detailBody,_:_});
        //$(this.el).css('height','100%');
        //$(this.el).html(html).trigger("create");
        
        
        if (_.isUndefined(this.printContainer) || _.isNull(this.printContainer)){
	        $(this.el).css('height','100%');
	        $(this.el).html(html);

	        //$(this.el).html(html).trigger("create");
	        //this.options.listview.refreshList();
	         
	        
        } else {
        	$(this.printContainer).html(html).trigger("create");
        }

        if (!_.isUndefined(this.options.reportMeta)){
        	this.options.ChartWizardView = new ReferralWireView.ChartWizardView(this.options.reportMeta);
        	this.options.ChartWizardView.render(this.options.reportMeta);
        }
        
        rwcore.spinOff();
      	}
      	catch(e) {
	      	rwcore.spinOff();	
      	}
        return this;

      },
	  });

	ReferralWireView.MasterDetailView = Backbone.View.extend({
			
			leafApplet: "",
		    initialize:function (options) {
		    	this.options = options;
		    },
		    events:{
		       // "click .rw_listitem":"displayRecord"
		    	"click .mainList [toggleState]":function(event){event.containerEL = ".mainList";this.displayRecord(event);},
				"click .secondList [toggleState]":function(event){event.containerEL = ".secondList";this.displayRecord(event);},
		    	"click [confirmation='true']":"updateField",
		        "click #refer":"referCustToSelected",
		        "click #wizardUpsert":"wizardUpsert",
		        "click #share":"share",
		        "click [action='ignoreMyRec']":"ignore",
            	"click #paynow":"paynow",
            	"click [action='invite']":"contextInvite",
            	"click [action='refer']":"contextRefer",
            	"click #new":"newRecord",
            	"click #edit":"editMaster",
            	"click .checkin":"checkin",
            	"click .checkout":"checkout",
            	"click .contextEdit":"editItem",
            	"click .contextDelete":"deleteItem",
            	"click #delete": "deleteMaster",
            	"click #deleteEvent": "deleteEvent",
            	"click #nextRec":"nextRecord",
            	"click #prevRec":"previousRecord",
            	"click #addGuest":"addGuest"
            			    		
		    },
		    
		    nextRecord: function(event){
		    	var thisModel = this.options.masterview.model;
		    	var index = this.options.allOptions.nextPrevListView.model.indexOf(thisModel);
		    	var length = this.options.allOptions.nextPrevListView.model.length;
		    	if (index <  (length - 1)){
		    		var selModel = this.options.allOptions.nextPrevListView.model.at(index+1);
		    		var nextRecordId = selModel.get('id');
		    		var currentRoute = window.location.hash.replace("#","");
				   if (currentRoute.indexOf("/") != -1){
					   var contextId = currentRoute.substr(currentRoute.lastIndexOf('/'));
					   currentRoute = currentRoute.replace(contextId,"");
				   }
				   var nextRoute = currentRoute+'/'+nextRecordId;
				   Backbone.history.fragment = null;
	   			   rwApp.navigate(nextRoute,{trigger: true,replace: false});
		    	} else {
		    		rwcore.FYI('This is the last record');
		    	}		    
		    },
		    
		    previousRecord: function(event){
		    	
		    	var thisModel = this.options.masterview.model;
		    	var index = this.options.allOptions.nextPrevListView.model.indexOf(thisModel);
		    	//var length = this.options.allOptions.nextPrevListView.model.length;
		    	if (index > 0){
		    		var selModel = this.options.allOptions.nextPrevListView.model.at(index-1);
		    		var nextRecordId = selModel.get('id');
		    		var currentRoute = window.location.hash.replace("#","");
				   if (currentRoute.indexOf("/") != -1){
					   var contextId = currentRoute.substr(currentRoute.lastIndexOf('/'));
					   currentRoute = currentRoute.replace(contextId,"");
				   }
				   var nextRoute = currentRoute+'/'+nextRecordId;
				   Backbone.history.fragment = null;
	   			   rwApp.navigate(nextRoute,{trigger: true,replace: false});
		    	} else {
		    		rwcore.FYI('This is the first record');
		    	}	    
		    },
		    
		    addGuest: function(event){
		    	
		    	event.OrgId = this.options.masterview.model.get("OrgId");
		    	event.eventId = this.options.masterview.model.get("id");
		    	event.refWizard = rwApp.AddGuestWizard;
		    	event.parentView = this;
		    	rwApp.addGuest(event);
		    },
		    
		    editMaster: function(){
		    	var upsertApplet = ($.hasVal(this.options.upsertApplet))?this.options.upsertApplet:this.options.d1view.applet;
		    	
    	  		var upsertOptions = {
					el:"#upsertRecord",
					appletName:upsertApplet,
					upsertModel:this.options.masterview.model,
					parentView:this,
					//refreshFunction:rwApp.refreshTopView
				}
				
				rwApp.upsertRecord(upsertOptions);    	  		
		    
		    },

		    deleteEvent: function(){
		    	  event.dView = this.options.masterview;
		    	  var OrgId = this.options.masterview.model.get("OrgId");
		    	  event.refreshFunction = function () { rwApp.navigate("#OrgEvents/" + OrgId , { trigger: true,replace: true})} 
		    	  rwApp.updateKeyField(event);
		    },
		    
		    deleteItem: function(event){
		    
				  event.dView = this.options.d1view;
		    	  event.refreshFunction = function () { rwApp.refreshTopView(false) };
		    	  rwApp.updateKeyField(event);
			  
		    },
		    
		    editItem: function(event){
        		var target = event.target;
        		var recordId = $(event.target).attr("actionRecord");
        		var model = this.options.d1view.model.get(recordId);
        		var upsertApplet = this.options.upsertApplet;
        	
        		var upsertTemplate = ($.hasVal(this.options.upsertTemplate))?this.options.upsertTemplate:'upsertForm';		    	
		    	
		    	rwApp.upsertRecord({
		      		  el:'#upsertRecord',
		      		  appletName:upsertApplet,
		      		  upsertTemplate:upsertTemplate,
		      		  upsertModel:model,
		      		  parentView:this,
		      		  success:null
		      	  });
		      	  
	        },
		    
		    checkin:function(event){
				
				var checkInButtonId = ($.hasVal($(event.target).attr("checkInButtonId")))?$(event.target).attr("checkInButtonId"):$(event.target).parents("[checkInButtonId]").attr("checkInButtonId");
		    	var model = this.options.d1view.model.get(checkInButtonId);
				model.options.module = "AttendeeMgr";
				model.options.bo = "Attendee";
				model.options.bc = "Attendee";
				
				var options = { model:model, changeToStatus : 'CHECKEDIN' };
		   		var checkInApi = rwApp.eventCheckIn(options);

				$.when(checkInApi).done(function() {
					$("#" + checkInButtonId).hide();
				});

			},
			
			checkout:function(event){

				var checkInButtonId = ($.hasVal($(event.target).attr("checkInButtonId")))?$(event.target).attr("checkInButtonId"):$(event.target).parents("[checkInButtonId]").attr("checkInButtonId");
		    	var model = this.options.d1view.model.get(checkInButtonId);
				model.options.module = "AttendeeMgr";
				model.options.bo = "Attendee";
				model.options.bc = "Attendee";
				
				var options = { model:model, changeToStatus : 'INVITED' };
		   		var checkInApi = rwApp.eventCheckIn(options);

				$.when(checkInApi).done(function() {
					$("#" + checkInButtonId).hide();
				});
				
			},
		    
		    referCustToSelected:function(event){
		    	  event.dView = this.options.masterview;
		    	  event.refWizard = this.options.refWizard;
		     	  event.parentView = ( !_.isUndefined(this.options.d2view) && !_.isNull(this.options.d2view))?this:null;
		     	  //event.parentView = this;
		     	  rwApp.referCustToSelectedPartner(event);
		    },
		    
		    contextRefer:function(event){
		    	  var recordId = $(event.target).attr("recId");
      		 	  event.dViewModel = ($.hasVal(recordId))?this.options.d1view.model.get(recordId):null;
      		 	  event.refWizard = this.options.refWizard;
		     	  event.parentView = ( !_.isUndefined(this.options.d2view) && !_.isNull(this.options.d2view))?this:null;
		     	  //event.parentView = this;
		     	  rwApp.referCustToSelectedPartner(event);
		    },
		    
		    contextInvite:function(event){
		    	       
        			var recordId = $(event.target).attr("recId");
			        var m = ($.hasVal(recordId))?this.options.d1view.model.get(recordId):null;
			        
			        var email1 = m.get(this.options.inviteFields.toEmailField[0]);
			        var email2 = m.get(this.options.inviteFields.toEmailField[1]);
			        var useEmail = null;
			        if ($.hasVal(email1)){useEmail = email1;}
			        else if($.hasVal(email2)){useEmail = email2;}
			        else {rwcore.FYI("The contact must have a valid email in order to receive an invitation");} //this is placeholder for a more appropriate notification
			        	
			        if ($.hasVal(useEmail) && useEmail.indexOf("@") > -1){
				        rwApp.newInvitation({
				      		toFirstName:m.get(this.options.inviteFields.toFirstNameField),
				      		toFullName:m.get(this.options.inviteFields.toFullNameField),
				      		toPartyId:m.get(this.options.inviteFields.toPartyIdField),
				      		toPartyType:m.get(this.options.inviteFields.toPartyTypeField),
				      		toEmail:useEmail,
				      		parentView:this
				      	});
			        }

		    },
		    
			newRecord:function(){
				
		          var upsertApplet = this.options.upsertApplet;
		          
		          var defaultMap = new Object();
		          for (var item in this.options.parentDefaultVals) {
		          	var value = this.options.parentDefaultVals[item];
		          	/*
						Normallly a default map is an object where the properties are names of child fields and the values are the 
						name of parent fields whose values should be propagated to the new child record. This function collects the
						parent values and sticks them in the new child record.  
						
						If a member of the defaults maps is an object -- it's so the parent fields values can be put into
						a function that generates the child default values -- e.g., the default time for a new chapter meeting is 
						based on values from the chapter record that indicate the day and time of the weekly meeting.
						
						In this case this.options.parentDefaultVals[item] = {functionName:$.calcNextMeeting(),functionArg:[meetingDayOfWeek,meetingHour]}
					*/	
		          	if (_.isObject(value)){ 
		          		var arguments = new Object();
		          		for (var j = 0; j < value.functionArg.length; j++){
		          			var thisArg = value.functionArg[j];
		          			arguments[thisArg] = this.options.masterview.model.get(thisArg);
		          		}
		          		var defaultVal = value.functionName(arguments);
		          		defaultMap[item] = defaultVal; 
		          	} else {
			          	defaultMap[item] = this.options.masterview.model.get(value)
			        }
		          }
		          
		           var readView = new ReferralWireView.FormView({
			        	  applet: upsertApplet, 
			              templateHTML : 'StdForm',
			              parentView : this,
			              showConfirmOnSave:false,
			              showViewBar:false,  
			        });
			      readView.setDefaultModel();
			      readView.model.set(defaultMap);
			      
		          readView.editRecord(upsertApplet);
		    },
		    
		    wizardUpsert:function(event){
		    
		      	var wizard = new ReferralWireView.WizardUpsertView ( { 
			    	firstApplet:this.options.upsertWizard.firstApplet,
			    	nextAppletFunctions:this.options.upsertWizard.nextAppletFunctions,
			    	viewTemplate: this.options.upsertWizard.viewTemplate,
			    	upsertmodel: this.options.d1view.model,
			    	stations:this.options.upsertWizard.stations,
			    	saveFunction:this.options.upsertWizard.saveFunction,
			    	parentView: this,
			    	wizardSpec:this.options.upsertWizard
		        });
		        wizard.render();
		      	
		      },
		    
		      wizardEdit:function(event){
		      	var wizard = new ReferralWireView.WizardUpsertView ( { 
			    	firstApplet:this.options.upsertWizard.firstApplet,
			    	nextAppletFunctions:this.options.upsertWizard.nextAppletFunctions,
			    	viewTemplate: this.options.upsertWizard.viewTemplate,
			    	upsertmodel: this.options.detailview.model,
			    	stations:this.options.upsertWizard.stations,
			    	saveFunction:this.options.upsertWizard.saveFunction,
			    	parentView: this,
			    	wizardSpec:this.options.upsertWizard
		        });
		        wizard.render();
		      	
		      },


		      
		      wizardNew:function(event){
		      
		      
		      	var wizard = new ReferralWireView.WizardUpsertView ( { 
			    	firstApplet:this.options.upsertWizard.firstApplet,
			    	nextAppletFunctions:this.options.upsertWizard.nextAppletFunctions,
			    	refreshFunction:this.options.upsertWizard.refreshFunction,
			    	viewTemplate: this.options.upsertWizard.viewTemplate,
			    	upsertmodel: null,
			    	stations:this.options.upsertWizard.stations,
			    	saveFunction:this.options.upsertWizard.saveFunction,
			    	parentView: this,
			    	wizardSpec:this.options.upsertWizard
		        });
		        wizard.render();
		      },
		    
    	  
      		share:function(event){
      		  var recordId = $(event.target).attr("recId");
      		  var detailRecord = ($.hasVal(recordId))?this.options.d1view.model.get(recordId):null;
      		  var shareOptions = {model:this.options.masterview.model,detailRecord:detailRecord};
      		  if ($.hasVal(this.options.shareFunction)){
      		  	this.options.shareFunction(shareOptions);
      		  } else {
		      	rwApp.sharePartnerInfo({model:this.options.masterview.model});
		      }
		    },
		    
		    ignore:function(event){
				var recordId = $(event.target).attr("recId");
				var ignoreOptions = {
					dview:this.options.d1view,
					actionRecordId:recordId,
					refreshFunction:rwApp.refreshTopView(false),
					setFieldMap:{status:"IGNORED"},
				}
				rwApp.updateKeyFieldSilent(ignoreOptions);      
		    },
		    

        paynow:function(event){
          // var userModel = this.options.masterview.model
          // var billingHisory = this.options.d1view.model
          alert("paynow");
        },
		    
		    updateField: function (event){
		    	event.dView = this.options.d1view; //only need to worry about the main view for now
		    	event.refreshFunction = "$('.mainList').html(that.render().el.outerHTML).trigger('create');"
		    	rwApp.updateKeyField(event);
		    },

		    displayRecord: function (event) {
		    	
		    	this.options.d1view.toggleCollapse(event);
		    	/*
		    	var target = event.target;
		       

		        var contactdetails = this.options.detailview.model.getByCid(target.id);

		        // get meta data for rendering master applet
		    	var cview = new ReferralWireView.FormView({ model: contactdetails, applet: this.options.leafApplet, templateHTML : this.options.detailview.templateHTML });

		        var htmlSnippet =  cview.render().el.outerHTML;
		    	// Do a popup here
		    	
		     	return false;
		     	*/
		    },
		    

		    render:function (eventName) {
		    	
		    	try {
		    	rwcore.spinOn();
      			
		    	var master = this.options.masterview.render().el.outerHTML;
		    	
		    	if ($.hasVal(this.options.appletMenuRight)){
					this.options.appletMenuRight = new ReferralWireView.FormView({
			    	 applet:this.options.appletMenuRight,
			    	 templateHTML : 'StdForm', //This is ignored at the time of rendering
			    	 showViewBar:true, 
			    	 viewBarTemplate:'AppletMenuTemplate',
			    	 model: this.options.masterview.model
			  		});	  
			  	}
			  	
		    	this.primaryChildListView = this.options.d1view; 
		    	
		    	var d1html = this.primaryChildListView.render().el.outerHTML;
		    	if ( !_.isUndefined(this.options.d2view) && !_.isNull(this.options.d2view))
		    		var d2html = this.options.d2view.render().el.outerHTML;
		    	else
		    		var d2html = "";
		    	
		    	//var vBar = this.options.viewBar.render();
		    	var vBar = this.options.viewBar.render().el.outerHTML;
		    	var titleStr =""
		    	
		    	
		        if ( !_.isUndefined(this.options.viewTitle) && !_.isNull(this.options.viewTitle)){
		        	titleStr = this.options.viewTitle;
		        } else if ( !_.isUndefined(this.options.dynamicTitles) && !_.isNull(this.options.dynamicTitles) && this.options.dynamicTitles.length > 0){
		        	
		        	//var appletTitle = this.options.d1view.metaApplet.model.attributes['pluralTitle'];
		        	var dTitle = this.options.dynamicTitles[0];
		        	titleStr = ( !_.isUndefined(dTitle) && !_.isNull(dTitle))?dTitle:"";
		        }
		        
		        var secondTierNavHTML = "";
		        
		        if ($.hasVal(this.options.secondTierNav)){
		        	secondTierNavHTML = _.template('SecondTierNavBar',{model:this.options.masterview.model,secondTierNav:this.options.secondTierNav});
		        }
		    	
		    	
		    	var html = _.template(this.options.templateHTML, {masterview: master, d1:d1html,d2:d2html, viewBar:vBar,render : this,title:titleStr, secondTierNav:secondTierNavHTML,_:_})
		    	
		    	$(this.el).css('height','100%');

		    	$(this.el).html(html);	

		    	rwcore.spinOff();
      			}
      			catch(e) {
      				rwcore.spinOff();
      			}
		        return this;

		    }
		 
		});

	  ReferralWireView.SavedSearchPickView = Backbone.View.extend({
	  		initialize:function(options){
	  			this.options = options;
	  			this.parentView = options.parentView;
	  			this.container = "#pickListContents";
	  			this.searchGroup = options.searchGroup;
	  		},
	  		events:{
	  			"click .rw_listitem":"pickSavedSearch",
	  		},
	  		pickSavedSearch:function(event){
	  			
	  			var target = event.target;
        		var tagName = $(target).get(0).nodeName.toLowerCase();
       		 	var anchorId = $(target).attr('id');
		        if (tagName != 'a'){
		          var anchor = $(target).parents('a');
		          anchorId = anchor.attr('id');
		        }
        		var selectedModel = this.pickView.model.get(anchorId);
        		var searchDefModel = rwApp.xformSS(selectedModel); //this function transforms the stored SS model into something that can be rendered by FormView
        		if (!_.isUndefined(this.parentView.searchView)) {this.parentView.searchView.refreshSearchModel(searchDefModel);} //if the searchform is visible when the user picks a new SS then update the form to show the selected ss
        		this.parentView.applySavedSearch(searchDefModel);
	  			this.pickView.cancelPick()
		    	$("#picklistContainer").removeClass("bookMarks");
		    	$('#picklistContainer').off("click","#pickCreate");
		    	this.remove();
	  		},

	  		fetchSavedSearch:function(options){
	  			var searchGroup = options.searchGroup;
	  			var ss = {filter:[{
	                            ftype:"expr", 
	                            expression:{"searchGroup":searchGroup}
	                           },
	                           {ftype:"expr", 
	                            expression:{$or: [{ ownerId:rwFB.uId},{accessLevel:"public"}]}
	                           }]
	                    };
	            return rwApp.fetchList({
	            	module : "GenericMgr",
		            bc:"SavedSearch",
		            bo:"SavedSearch",
		            sortby:"name",
		            searchSpec: ss,
		            //id : options.id,
	            })

	  		},

    		render:function(){
    			var that = this;
    			var pickAppletName = "SavedSearchList";
    			var pickListTemplate = "StdDynamicPickList";
    			var usePaging = false;

				this.pickView = new ReferralWireView.ListView({ 
		    		applet: pickAppletName, 
		    		setFilter:true, 
		    		//listItemClass:listItemClass,
		    		template: pickListTemplate, 
		    		parentView: this.parentView, 
		    		ulClass:"pickID",
		    		batchSize:12,
		    		usePaging:usePaging,
		    		//pickMap : pickMaps
		    	});
		    	
		    	//var constraints = rwApp.addConstraintPickMapExpressions(thisField.pickMap,this.model,pickView.searchSpec);
		    	var promise = this.fetchSavedSearch({searchGroup:this.searchGroup});
	    		promise.done(function(model){
		    		that.pickView.model = model;
		    		
		    		var rHtml = that.pickView.render().el.outerHTML; 
		    		that.$el.html(rHtml).trigger('create');
		    		$(that.container).html(that.$el).trigger("create")
		    		$("#pickTitle").html("Pick Saved Search");
		    		$("#picklistContainer").addClass("bookMarks");


		    		if ($.hasVal(usePaging) && usePaging) {
						$('#'+ pickView.id + '.pickID').on( "listviewbeforefilter", pickView, pickView.textSearchHandler);
						$('#'+ pickView.id + '.pickID').on( "scroll", pickView, pickView.scrollHandler);
					}


					$("#pickBackground").show(50);
	    		    	    	//$('#picklistContainer').show(250,function(){$("#picklistContainer ul").listview('refresh');});
	    		    $('#picklistContainer').show(250);
	    		    $('#picklistContainer').one("click","#cancelPick",function(){
	    		    	that.pickView.cancelPick()
	    		    	$("#picklistContainer").removeClass("bookMarks");
	    		    	$('#picklistContainer').off("click","#pickCreate");
	    		    	that.remove();
	    		    });
				}) //close promise.done
	    	},


	  });
	  

	  ReferralWireView.SearchView = Backbone.View.extend({
	  		initialize:function (options) {
	  			this.options = options;
	  			this.parentView = options.parentView;
	  			this.container = "#SavedSearchContainer";
	  			this.searchGroup = options.searchGroup;
	  			this.actor = options.actor;
	  			this.bo = options.bo;
	  			this.bc = options.bc;
	  		},
	  		events:{
	  			"click #cancelSearch":"cancel",
	  			"click #execSearch":"exec",
	  			"click #deleteSearch":function(){this.showConfirmation({confirmTemplate:"ConfirmSS_Delete"})},//"deleteFilter",
	  			"click #saveSearch":function(){this.showConfirmation({confirmTemplate:"ConfirmSS_Save_Prompt",selectedSSModel:this.searchFormView.model})},
	  			"click #clearSearch":"clearSearch",
	  			"click [pickApplet]":function(event){ this.searchFormView.launchPick(event);},
	  			"change select": function(event) { this.searchFormView.changeItem(event); },
	          	"change input": function(event) { this.searchFormView.changeItem(event); },
	          	"change textarea":function(event){ this.searchFormView.changeItem(event); },
	          	"click [multicheckbox_search]":function(event){ this.searchFormView.addToMultiCheckSearchBox(event); },
	          	"click .removeSelectedMCS":function(event){ this.searchFormView.removeMultiCheckSearchBox(event); },
	          	"click .multicheck-search-container":function(event){this.searchFormView.setMCSFocus(event);}
	        },

	  		fetchSavedSearch:function(searchName){
	  			var searchGroup = this.searchGroup;
	  			var ss = {filter:[{
	                            ftype:"expr", 
	                            expression:{searchGroup:searchGroup}
	                           },{
	                            ftype:"expr", 
	                            expression:{searchName:searchName}
	                           },{
	                           ftype:"expr", 
	                            expression:{$or: [{ ownerId:rwFB.uId},{accessLevel:"public"}]}
	                           }]
	                    };
	            return rwApp.fetchList({
	            	module : "GenericMgr",
		            bc:"SavedSearch",
		            bo:"SavedSearch",
		            sortby:"name",
		            searchSpec: ss,
		            //id : options.id,
	            })

	  		},

	  		cancel: function (event){
	    		this.closeView();
		    },
		    /*
		    getSearchDefinition: function() {//
		    	var searchFields = this.searchFormView.metaApplet.model.attributes.field;

	        	var searchDefinition = new Array()

	        	for (var i = 0; i < searchFields.length; i++){
	        		var thisField = searchFields[i];
	        		var thisFieldName = thisField.fldname;
	        		var thisVal = this.searchFormView.model.get(thisFieldName);
	        		var searchOperator = thisField.searchOperator;
	        		if (($.hasVal(thisVal) || searchOperator == "DISTANCE_FROM") && thisFieldName != "searchName" && thisFieldName != "isDefaultSearch" ){
	        			
	        			if (searchOperator == "DISTANCE_FROM"){
	        				var parts =  $.toArray(thisField.part);
	        					var that = this;
				        	  		_.each(parts,function(part){
				        	  			thisFieldName = part.fldname;
				        	  			thisVal = that.searchFormView.model.get(thisFieldName);
				        	  			if ($.hasVal(thisVal)){
					        	  			thisElement = part.element;
					        	  			var term = {fldname:thisElement,value:thisVal};
					        	  			searchDefinition[searchDefinition.length]= term;
					        	  		}
				        	  	});

	        			} else {
		        			var term = {fldname:thisFieldName,value:thisVal};
		        			searchDefinition[searchDefinition.length]= term;
		        		}
	        			//searchDefinition.add({fldname:thisFieldName,value:thisVal});
	        		}
	        	}
	        	
	        	
	        	return JSON.stringify(searchDefinition);
	        	

		    },
		    */

		    showConfirmation: function(options){
		    	var popUpContainer = $("#PopupContainer");
			      popUpContainer.html(_.template(options.confirmTemplate)());
			      popUpContainer.addClass("confirmation");
			      $(".overlay-background").show();
			      popUpContainer.show();
			      var selectedSSModel = options.selectedSSModel;
			      if (!_.isUndefined(selectedSSModel)){
				      var currentSearchName = selectedSSModel.get("searchName"); 
				      $("#ssName").attr("value",currentSearchName);
				  }

			      //popUpContainer.one(options.clickSelector,"click",options.execFunction(selectedSSModel,this))
			      

			      popUpContainer.one("click","[confirmsave]", this, function(event) {
			      		
			      		var searchName = $("#ssName").attr("value");
			      		var searchView = event.data;
			      		if ($.hasVal(searchName)){
			      			searchView.save({searchName:searchName})
				      	} else {
							rwcore.FYI("You must give your filter a name to save it");

				      	}

			      });
			      
			      popUpContainer.one("click","[confirmCancel]", function(pEvent) {
			      		popUpContainer.hide();
			            $(".overlay-background").hide();
			            popUpContainer.removeClass("confirmation");
			      });

			      popUpContainer.one("click","[confirmDelete]", this, function(event) {
			      		var searchView = event.data;
			      		searchView.deleteFilter();
			      		popUpContainer.hide();
			            $(".overlay-background").hide();
			            popUpContainer.removeClass("confirmation");
			      });
			      
		    },
		    hideConfirmation: function(){
		    	popUpContainer.hide();
			    $(".overlay-background").hide();
			    popUpContainer.removeClass("confirmation");
		    },

		    save:function(options){
				that = this;
		    	var thisSearchName = options.searchName;
			    var promise = this.fetchSavedSearch(thisSearchName);
		    		promise.done(function(model){


		    		if (model.length > 0) {
		    			var selectedSSModel = model.models[0];
		    			var accessLevel = selectedSSModel.get("accessLevel");
		    			var ownerId = selectedSSModel.get("ownerId");
		    			var isAdmin = $.hasAccess({record:selectedSSModel,routeName:"any",privilege:"editPublicSavedSearch"}) 	
		    			var isOwner = (ownerId == rwFB.uId);

		    			if (accessLevel == "public" && !isAdmin){
		    				rwcore.FYI("Only an administrator can change a public filter.  Rename it to save a private copy.");
		    				return;
		    			} else {
			    			if (isAdmin || ownerId == rwFB.uId) {
			    				//var definition = that.getSearchDefinition();
			    				var definition = rwApp.getSearchDefinition(this.searchFormView.model,this.options.searchAppletName,false)
			    				selectedSSModel.set({searchName:thisSearchName})
					      		selectedSSModel.set({definition:definition})
					      		// does this have the right bc, bo, module?
					      		var savePromise = rwApp.saveModel(selectedSSModel);
					      		savePromise.done(function(model){
					      			that.showConfirmation({confirmTemplate:"ConfirmSS_Save"});
					      		})
								
				    		} 
				    	}

		    		} else {
		    			var newSavedSearchModel = new rwcore.StandardModel({module: "SavedSearchMgr",bo:"SavedSearch",bc:"SavedSearch"});
		    			var isAdmin = $.hasAccess({record:newSavedSearchModel,routeName:"any",privilege:"editPublicSavedSearch"}) 	
		    			var accessLevel = isAdmin?"public":"personal";
		    			newSavedSearchModel.set({
		    				ownerId:rwFB.uId,
		    				accessLevel:accessLevel,
		    				sActor:that.actor,
		    				sBO:that.bo,
		    				sBC:that.bc,
		    				searchName:thisSearchName,
		    				searchGroup:that.searchGroup
		    			})
		    			//var definition = that.getSearchDefinition();
		    			var definition = rwApp.getSearchDefinition(that.searchFormView.model,that.options.searchAppletName,false)
	    				newSavedSearchModel.set({searchName:thisSearchName})
			      		newSavedSearchModel.set({definition:definition})
			      		//alert('save call new')
			      		var savePromise = rwApp.saveModel(newSavedSearchModel);
			      		savePromise.done(function(model){
			      			that.showConfirmation({confirmTemplate:"ConfirmSS_Save"})
			      			that.enableDelete();
			      		})
		    		}
	    		})	
		    },

		    exec:function(event){
		    	this.parentView.applySavedSearch(this.searchFormView.model);
		    },

		    deleteFilter:function(event){//
		    	var savedSearchId = this.searchFormView.model.get("savedSearchId");
		    	var savedSearchProxyModel = new rwcore.StandardModel({module: "SavedSearchMgr",bo:"SavedSearch",bc:"SavedSearch"});
		    	savedSearchProxyModel.set({id:savedSearchId});
		    	var promise = rwApp.deleteModel(savedSearchProxyModel);
		    	promise.done(function(){
		    		///post delete confirmation?
		    	})
		    },

		    enableSave:function() {
		    	$("#saveSearch").show();
		    	$("#hideSearch").hide();
		    	$("#deleteSearch").hide();
		    	this.searchFormView.model.set({accessLevel:"personal"});
		    },

		    enableDelete:function() {
		    	$("#saveSearch").hide();
		    	$("#hideSearch").hide();
		    	$("#deleteSearch").show();
		    },

		    clearButtons:function() {
		    	$("#deleteSearch").hide();
		    	$("#saveSearch").hide();
		    },

		    enableRemove:function() {
		    	/*
		    	$("#saveSearch").hide();
		    	$("#hideSearch").show();
		    	$("#deleteSearch").hide();
		    	*/
		    },

		    clearSearch:function() {
		    	var module = this.actor;
        		var bo = this.bo;
        		var bc = this.bc;
        		
        		this.searchFormView.setDefaultModel();
        		this.searchFormView.model.set({searchName:"None"});
        		this.parentView.applySavedSearch(this.searchFormView.model);
        		this.refreshSearchModel(this.searchFormView.model);
		    },

	  		render:function(){

	  			this.searchFormView = new ReferralWireView.FormView({
			    	applet: this.options.searchAppletName, 
	            	templateHTML : this.options.searchAppletTemplate,
	            	parentView : this,
	            	postChange : function(formView,fieldName,fieldValue){formView.parentView.enableSave()}
	            	//class: appletViewClass,
	            	//data:this.options.searchModel,
	  				//setFilter:appletOptions.setFilter,
	            	//assocOptions:appletOptions	            	
			     });
	  			var noSearchModel = (_.isUndefined(this.options.searchModel))?true:false;
	  			if (noSearchModel){
	  				this.searchFormView.setDefaultModel();	
	  			} else {
	  				this.searchFormView.model = this.options.searchModel;
	  			}
	  			var fields = this.searchFormView.metaApplet.model.attributes.field;	
	  			if ( _.isArray(fields) == false ) {fields = [fields]};
			    var fieldList = _.clone(fields);
			    rwApp.FetchRadioButtonModels({
			    	view:this.searchFormView,
			    	fieldList:fieldList,
			    	done:function(options){
			    		options.view.parentView.renderFinish();
			    	},
			    	wizardView:null});
			   
	  		},

	  		renderFinish:function(){
	  			var noSearchModel = (_.isUndefined(this.options.searchModel))?true:false;
	  			var formHTML = this.searchFormView.render().el.outerHTML;
	  			var viewHtml = _.template('SearchView',{title:this.options.title,formHTML:formHTML});
				this.$el.html(viewHtml);
				$(this.container).html(this.$el).trigger("create");

				if (noSearchModel){this.enableSave();}
				else {
					if (this.options.searchModel.get("accessLevel") == "personal"){
						this.enableDelete();
					}
					
				}
				this.searchFormView.renderAllMultiCheckSearchControls();
				$("[altTimeVal]").attr("value",$("[altTimeVal]").attr("altTimeVal")); 
       			$("[altDateVal]").attr("value",$("[altDateVal]").attr("altDateVal"));
				$(".datepicker" ).datepicker({dateFormat: "mm/dd/yy"});
			    $(".datetimepicker" ).datetimepicker({dateFormat: "mm/dd/yy", timeFormat: "hh:mm tt"});
			    $(".timepicker").timepicker({timeFormat: "hh:mm tt"});	

	  			this.showView();
	  			return this;
	  		},


		    refreshSearchModel:function(model){
		    		var formHTML = this.searchFormView.render(model).el.outerHTML;
		      		this.$el.find("#appletFrame").html(formHTML).trigger("create");
				    if (model.get("accessLevel") == "personal"){
		      			this.enableDelete();
		      		} 
		      		if (_.isUndefined(model.get("accessLevel"))){
		      			this.clearButtons();
		      		} 
		      		this.searchFormView.renderAllMultiCheckSearchControls();
		      		$("[altTimeVal]").attr("value",$("[altTimeVal]").attr("altTimeVal")); 
       				$("[altDateVal]").attr("value",$("[altDateVal]").attr("altDateVal"));
		      		$(".datepicker" ).datepicker({dateFormat: "mm/dd/yy"});
					$(".datetimepicker" ).datetimepicker({dateFormat: "mm/dd/yy", timeFormat: "hh:mm tt"});
					$(".timepicker").timepicker({timeFormat: "hh:mm tt"});

		  			//var viewHtml = _.template('SearchView',{title:this.options.title,formHTML:formHTML});
					//this.$el.html(viewHtml);
					//$(this.container).html(this.$el).trigger("create");

		    },

	  		showView:function(){
		  			$(this.container).show(50);
				    //$(".overlay-background").toggle(00);
				    if ($.hasVal(this.options.SearchViewClass)){
		  				$(this.el).addClass(this.options.SearchViewClass)	
		  			}
				    
			        $(this.container).animate({
			            top:15
			          }, 500, function() {
			            $(this.container).css('bottom','5px');
			            $(this.container).css('height','auto');
			                
			          });
			        
			        //rwApp.preventNavigation = true; // this is checked by code on rw.jsp that fires on the window.changehash event.  It's here so users don't accidentally navigate away while editting.
			    	
			    	var titleStr =""
			},
			closeView:function(){
				var el2 = this.container;
		    	  $(el2).animate({
		    		    top:1000
		    		  }, 500, function() {
		    			  $(this.el).hide(50);
		    		      //$(".overlay-background").hide();
		    			  $(el2).css('bottom','auto');
		    			  $(el2).css('height','99%');
		    			  $(el2).css('top','100%');
		    			  $(el2).hide();
		    			  
		    			   //rwApp.refreshTopView(false);
		    			  
		    		  });
	    		rwApp.preventNavigation = false;
	    		this.parentView.searchView = undefined;
	    		this.remove();
			}

	  });


  	  ReferralWireView.WizardUpsertView = Backbone.View.extend({

		    initialize:function (options) {
		    
		    	this.options = options;
		    	this.firstApplet = options.firstApplet;
		    	this.previousApplets = new Array();
		    	this.previousApplets[0] = this.firstApplet;
		    	this.nextAppletFunctions = options.nextAppletFunctions;
		    	this.refreshFunctionStatic = options.refreshFunctionStatic;
		    	this.currentAppletInt = 0;
		    	this.model = options.upsertmodel;
		    	this.currentAppletView = null;
		    	this.parentView = options.parentView;
		    	this.viewTemplate = options.viewTemplate;
		    	this.container = "#upsertRecord";
		    	this.appletFrameEL = "#appletFrame";
		    	this.stations = options.stations;
		    	this.appletTemplates = options.appletTemplates;
		    	this.saveFunction = options.saveFunction;
		    	this.showConfirmOnSave = options.showConfirmOnSave;
		    	this.refreshFunction = options.refreshFunction;
		    	this.cartFrameEL = "#cartFrame";
		    	this.isCreateRecord = (_.isUndefined(options.upsertmodel))?true:false;//gets set to true 
		    	this.initializedApplets = {};
		    	this.helpUrl = options.helpUrl;


		    },
		    events:{
			    "change select": function(event) { this.currentAppletView.changeItem(event); },
	          "change input": function(event) { this.currentAppletView.changeItem(event); },
	          "change textarea":function(event){ this.currentAppletView.changeItem(event); },
		    	"click #next":"next",
				"click #back":"back",
		    	"click #cancel":"cancel",
		        "click #save":"save",
		        "click [pickApplet]":function(event){ this.currentAppletView.launchPick(event);},
		        "click .assoc":"addAssociation",
		        "click .cartItem":"removeAssociation",
		        "click [multicheckbox_search]":function(event){ this.currentAppletView.addToMultiCheckSearchBox(event); },
	          	"click .removeSelectedMCS":function(event){ this.currentAppletView.removeMultiCheckSearchBox(event); },
	          	"click .multicheck-search-container":function(event){this.currentAppletView.setMCSFocus(event);}
		        
		    },
		    
		    addAssociation: function(event){
		    	this.currentAppletView.addAssociation(event)
		    },
		    
		    removeAssociation: function(event){
		    	this.currentAppletView.removeAssociation(event)
		    },

		    
		    updateTrain: function(){
		    	//update the train
		    	
		    	var stationNumber = ($.hasVal(this.currentAppletOptions.stationNumber))?this.currentAppletOptions.stationNumber:this.currentAppletInt;
		    	
		    	var stepLabel = "Step "+(this.currentAppletInt + 1)+": " + this.stations[stationNumber];
		    	//var stepLabel = "Step "+(stationNumber + 1)+": " + this.stations[stationNumber]; 
		    	$(".stationTitle").html(stepLabel);
		    	
		    	
		    	var nextStation = $($("#train div.trainStation")[stationNumber])
		    	$("div.trainCircle.active").removeClass("active");
		    	nextStation.find(".trainCircle").addClass("active");
		    	
    			if (stationNumber == (this.stations.length - 1)){
		    		$("#next").hide()
		    		$("#save").show()
		    	}
		    },
		    
		    next: function (event){
		    	
		    	

		    	
	    		var requireFields = (this.currentAppletView.class==ReferralWireView.AssociationView)?null:ReferralWireBase.validateRequired(this.model, this.currentAppletView.metaApplet);
		    	
		    	if ( _.isNull(requireFields) ) {
	 
	 		    	this.previousApplets[this.currentAppletInt] = this.currentAppletOptions;
	 		    	
			    	this.currentAppletInt++;


			    	$("#back").show();
				    
				    this.getCurrentAppletView();
				    /*
			    	var nextAppletView = this.getCurrentAppletView();
			    	
			    	if (nextAppletView.class == ReferralWireView.AssociationView){
			    		nextAppletView.parentView = this;
			  			nextAppletView.render("refresh"); // this includes a callback that will execute nextExec() after the association list data is fetched.
			  		} else {
			  			
				    	$(this.appletFrameEL).html(nextAppletView.render(this.model).el.outerHTML).trigger("create");
				    	
					}
					*/
			    	
		        } else { // Validaton failed
					if ( !_.isUndefined(this.currentAppletView.error)) {
						var status = {}
						
						status['responseText'] = requireFields;
						status['status'] = 99999;
						this.currentAppletView.error(null,status,null);
					}
				
				}

		    },
		    
		    renderStep: function (event) {
		    		
		    		//var nextAppletView = this.getCurrentAppletView();
			    	var nextAppletView = this.currentAppletView;
			    	
			    	if (nextAppletView.class == ReferralWireView.AssociationView){
			    		nextAppletView.parentView = this;
			  			nextAppletView.render("refresh"); // this includes a callback that will execute nextExec() after the association list data is fetched.
			  		} else {
			  				
		    
				    	$(this.appletFrameEL).html(nextAppletView.render(this.model).el.outerHTML).trigger("create");
				    	$("[altTimeVal]").attr("value",$("[altTimeVal]").attr("altTimeVal")); 
				        $("[altDateVal]").attr("value",$("[altDateVal]").attr("altDateVal")); 
					   $(".datepicker" ).datepicker({dateFormat: "mm/dd/yy"});
					   $(".datetimepicker" ).datetimepicker({dateFormat: "mm/dd/yy", timeFormat: "hh:mm tt"});
					   $(".timepicker").timepicker({timeFormat: "hh:mm tt"});
					   nextAppletView.renderAllMultiCheckSearchControls();
				    	
					}
		    },
		    
		    renderFirstStep: function (event) {
		    		var view = this.currentAppletView;
		    		
		    		 if (view.class == ReferralWireView.AssociationView){
					  		view.parentView = this;
					  		view.render("renderContainer"); // this includes a callback that will execute renderExec after the association list data is fetched.
					  } else{
					  			var titleStr = "";
							  	if ( !_.isUndefined(this.options.viewTitle) && !_.isNull(this.options.viewTitle)){
						        	titleStr = this.options.viewTitle;
						        } else if ( !_.isUndefined(this.options.dynamicTitles) && !_.isNull(this.options.dynamicTitles) && this.options.dynamicTitles.length > 0){
						        	
						        	//var appletTitle = this.options.d1view.metaApplet.model.attributes['pluralTitle'];
						        	var dTitle = this.options.dynamicTitles[0];
						        	titleStr = ( !_.isUndefined(dTitle) && !_.isNull(dTitle))?dTitle:"";
						        }
						    					    	
						    	var firstAppletHTML = view.render().el.outerHTML				    	
						    	var html = _.template(this.viewTemplate, {firstAppletHTML:firstAppletHTML,title:titleStr, 
						    			stations:this.stations, cart:this.cartView,_:_, helpUrl:this.helpUrl})		    	
						    	//$(this.el).css('height','100%');
						    	
						    	this.$el.html(html);
						    	$(this.container).html(this.$el).trigger("create");
						    	$("[altTimeVal]").attr("value",$("[altTimeVal]").attr("altTimeVal")); 
						        $("[altDateVal]").attr("value",$("[altDateVal]").attr("altDateVal")); 
						    	$(".datepicker" ).datepicker({dateFormat: "mm/dd/yy"});
							   $(".datetimepicker" ).datetimepicker({dateFormat: "mm/dd/yy", timeFormat: "hh:mm tt"});
							   $(".timepicker").timepicker({timeFormat: "hh:mm tt"});
							   view.renderAllMultiCheckSearchControls();
				
						        
							    this.showView();
						    	
						}
		    },
		    
		    back: function (event){
		    	
		    	this.currentAppletInt--;
		    	var previousApplet = this.previousApplets[this.currentAppletInt];
		    	previousApplet.postFetchRadio = "wizardNextApplet";
		    	//var nextAppletView = this.getCurrentAppletView(previousApplet);
		    	this.getCurrentAppletView(previousApplet);
	    		$("#next").show();
		    	$("#save").hide()
		    	if (this.currentAppletInt == 0){
		    		$("#back").hide()
		    	}					    	
		    	this.updateTrain();
		    	
		    	if (this.currentAppletView.class == ReferralWireView.AssociationView){
			  		this.currentAppletView.parentView = this;
			  		this.currentAppletView.render("refresh");
			  	} 
			  	/*else {
	  				$(this.appletFrameEL).html(nextAppletView.render(this.model).el.outerHTML).trigger("create");


			  	}*/
			  	
		    	
		    },
		    


					    
		    cancel: function (event){
	    		this.currentAppletView.cancelUpdate();
	    		
		    },
		    
		    save: function (event){
 				
		    	if ($.hasVal(this.saveFunction)) {
		    		this.saveFunction({model:this.model,currentAppletView:this.currentAppletView,parentView:this.parentView,wizardSpec:this.options.wizardSpec});
		    		
		    	} else {
		    		if ($.hasVal(this.showConfirmOnSave)){
		    			this.currentAppletView.options.showConfirmOnSave = this.showConfirmOnSave;
		    			if (!$.hasVal(this.refreshFunctionStatic)){this.currentAppletView.parentView = null}; // this is a little bit of a hack but it allows confirmation to show when wizard launches on home page,AND for the newsfeed applet to refresh 
		    		}
		    		if ($.hasVal(this.refreshFunction))
		    			this.currentAppletView.refreshFunction = this.refreshFunction;
		    			
		    		if ($.hasVal(this.refreshFunctionStatic))
		    			this.currentAppletView.refreshFunctionStatic = this.refreshFunctionStatic;
		    		
			    	this.currentAppletView.saveItem();
			    }
		    },
		    		    
		    updateField: function (event){
		    	event.dView = this.options.d1view; //only need to worry about the main view for now
		    	event.refreshFunction = "$('.mainList').html(that.render().el.outerHTML).trigger('create');"
		    	rwApp.updateKeyField(event);
		    },
		    
		    getCurrentAppletView: function(aOptions){
		  	var appletOptions = null;
		    	if ($.hasVal(aOptions)){appletOptions = aOptions}
		    	else {
		    		var previousApplet = this.previousApplets[this.currentAppletInt - 1];
		    		var getNextFunction = this.nextAppletFunctions[previousApplet.name];
		    		appletOptions = getNextFunction(this.model,this.options.wizardSpec);
	    		}
	    		this.currentAppletOptions = appletOptions;
	    		var appletName = appletOptions.name;
				this.updateTrain();	    		
				
	    		var appletTemplate = ($.hasVal(appletOptions.template))?appletOptions.template:'WizardUpsertFormNarrow';	    		
	    		var appletViewClass = ($.hasVal(appletOptions.renderer))?appletOptions.renderer:ReferralWireView.FormView;
	    		
			    var view = new appletViewClass({
			    	applet: appletName, 
	            	templateHTML : appletTemplate,
	            	parentView : this.parentView,
	            	class: appletViewClass,
	            	data:this.model,
	  				setFilter:appletOptions.setFilter,
	            	assocOptions:appletOptions,
	            	refreshFunction:this.refreshFunction
			        });
			        
			        
		        if (!$.hasVal(this.model)){
		        	view.setDefaultModel();
		        	this.model = view.model;
		        	this.isCreateRecord = true;
		        	this.initializedApplets[appletName] = true;
		        } 
		        else {
		        	if (this.isCreateRecord && !this.initializedApplets.hasOwnProperty(appletName)) {
		        		ReferralWireBase.setDefaultValues(this.model, view.metaApplet,undefined);
		        		this.initializedApplets[appletName] = true;
		        	}
		        	view.model = this.model
		        };
		        this.currentAppletView = view;
		        //return view;
		        
		        if (view.class == ReferralWireView.AssociationView){
		        	if (this.firstApplet.postFetchRadio == "initializeWizard"){
		        		this.firstApplet.postFetchRadio = "wizardNextApplet";
		        		this.renderFirstStep();
		        	} else {
		        		this.renderStep();
		        	}
			  			
			  	} else{
				  	var fields = view.metaApplet.model.attributes.field;
					if ( _.isArray(fields) == false ) {
			    		fields = [fields];
			    	}
			        var fieldList = _.clone(fields);
			        var done = ($.hasVal(appletOptions.postFetchRadio))?appletOptions.postFetchRadio:"wizardNextApplet";
			        rwApp.FetchRadioButtonModels({view:view,fieldList:fieldList,done:done,wizardView:this});
			  	}
			  
		        		
		    },

		    render: function (event) {
		     
			 this.firstApplet.postFetchRadio = "initializeWizard";
			 this.getCurrentAppletView(this.firstApplet);
			 //rwApp.FetchRadioButtonModels({view:view,fieldList:fieldList,done:"initializeWizard",wizardView:this});
			 
			 /* 
			  var view = this.getCurrentAppletView(this.firstApplet);
			  
			  if (view.class == ReferralWireView.AssociationView){
			  		view.parentView = this;
			  		view.render("renderContainer"); // this includes a callback that will execute renderExec after the association list data is fetched.
			  } else{
			  			var titleStr = "";
					  	if ( !_.isUndefined(this.options.viewTitle) && !_.isNull(this.options.viewTitle)){
				        	titleStr = this.options.viewTitle;
				        } else if ( !_.isUndefined(this.options.dynamicTitles) && !_.isNull(this.options.dynamicTitles) && this.options.dynamicTitles.length > 0){
				        	
				        	//var appletTitle = this.options.d1view.metaApplet.model.attributes['pluralTitle'];
				        	var dTitle = this.options.dynamicTitles[0];
				        	titleStr = ( !_.isUndefined(dTitle) && !_.isNull(dTitle))?dTitle:"";
				        }
				    					    	
				    	var firstAppletHTML = view.render().el.outerHTML				    	
				    	var html = _.template(this.viewTemplate, {firstAppletHTML:firstAppletHTML,title:titleStr, stations:this.stations, cart:this.cartView,_:_})		    	
				    	//$(this.el).css('height','100%');
				    	
				    	this.$el.html(html);
				    	$(this.container).html(this.$el).trigger("create");
		
				        
					    this.showView();
				    	
						return this;
				}
				*/
			  },
			  
			  showView:function(){
			  			$(this.container).show(50);
					    $(".overlay-background").toggle(00);
					    if ($.hasVal(this.options.wizardViewClass)){
			  				$(this.el).addClass(this.options.wizardViewClass)	
			  			}
					      
				        $(this.container).animate({
				            top:0
				          }, 500, function() {
				            $(this.container).css('bottom','5px');
				            $(this.container).css('height','auto');
				                
				          });
				        rwApp.preventNavigation = true; // this is checked by code on rw.jsp that fires on the window.changehash event.  It's here so users don't accidentally navigate away while editting.
				    	
				    	var titleStr =""
			  }

		   		 
	});
    
	ReferralWireView.PopupView = Backbone.View.extend({
		initialize:function (options) {
			this.params = options;
		},
	    events:{
	    	"click #pickOutlook": "pickOutlook",
	    	"click #pickVCF":"pickVCF",
	    	"click #pickCSV":"pickCSV",
	    	"click #cancelImport": "cancel",
	    	"change #vCard_Pick":"importFile",
	    	"change #csv_Pick" : "importCSVFile"
	    },
	    
	    cancel:function(event){
	    	//currently the event handler isn't firing. Might work with delegate events
	    	$("#PopupContainer").hide(50);
	    	$("#PopupContainer").html("");
	    	$("#pickBackground").hide(50);
			//rwApp.navigate('#partnerList',{trigger: true});
			event.preventDefault();
	    },
	    
	    pickVCF:function(event){
	    	$('#vCard_Pick').click();
	    	event.preventDefault();
	    },

	    pickCSV:function(event){
	    	$('#csv_Pick').click();
	    	event.preventDefault();
	    },

		importCSVFile : function(event){
	    	var that = this;	    	
	    	
	    	var promise = $.Deferred();
	    	var f = undefined;

            try {
 	         	if ( $.browser.msie ) {
	          		var fso = new ActiveXObject("Scripting.FileSystemObject");
	        		var textStream = fso.OpenTextFile(event.target.value);
	        		f = textStream.ReadAll();
	         	}
	         	else  {
	              	f = event.target.files[0];
	         	}
		    
	         	if ( f != undefined ) {
	             	var reader = new FileReader();
	             	debugger;
	             	reader.onload = (function(theFile) {
	               		return function(e) {
	               		 			var contents = $.csv.toObjects(e.target.result);  
	               		 			promise.resolve(contents);
	               				}		            
	             	})(f);
	             	reader.readAsText(f);;
	         	}
	         	else { promise.reject('csv reader failed'); }
   		 	}
   		 	catch (e) {
               	promise.reject(e);
            }

         	$.when(promise).done( function(csvData) {
         		// TODO : kick off the wizrd

         		console.log(csvData);
         		that.cancel(event);
         	}).fail( function(e) { alert( e ); that.cancel(event); });

	    },

/*
	    pickOutlook:function(event){
	    	var that = this;
			if ( $.browser.msie ) {
				var cc = ReferralWireBase.GetOutlookContactsCollection();				
				if ( cc != false ) { 
					ReferralWireBase.ExportContactsToServer(cc)
	    			.done( function (response) { $.mobile.loading('hide'); 
	    				alert(response.total + " records imported in " + response.time + " milli secords"); 
	    				that.cancel(event); 
	    				// rwApp.refreshTopView(true);
	    				} 
	    			);
				}
			}
			else { 
				ReferralWireView.FYI("Outlook Contacts Import is available on Windows & Internet Explorer Browser Only");
	    	}
	    	event.preventDefault();
	    },
*/
	    importFile:function(event){
	    	$.rwVCFUpload(event);

	    	/*
	    	var that = this;	    	
	    	var promise = ReferralWireBase.vCard_fileimport(event);
	    	promise.done( function (data) { 
	    		$.mobile.loading('show');
	    		ReferralWireBase.ExportContactsToServer(data)
	    		.done( function (response) { $.mobile.loading('hide'); 
		    			var message = response.Imported + " out of " + response.Requested + " contacts have been imported. ";
		    			if (response.Scheduled != '0') {
		    				var additionalMessage = 'Remaining ' + response.Scheduled + " will be imported shortly";
		    				message += additionalMessage;
		    			}
		    			alert(message);
		    			that.cancel(event);	
			    		rwApp.refreshTopView(true);
			    		} 

	    			);
  			});
			*/
	    },

  		
		render:function (data) {
    		$(this.el).html(_.template(this.params.template));
			  return this;
		}
	});

	ReferralWireView.TilesView = Backbone.View.extend({
        tagName:'ul',
        options: null,
        className: 'tileList', 
        attributes: { datarole :  'listview' , style: 'list-style: none;'},
        initialize:function (options) {
        	 this.options = options;
        	 this.options['offset'] = 0;
        	 this.id = options.id;
        	 this.nextHandlerState = false;
        },
        events:{
            "click [actionone]": "actionone",
            "click [actiontwo]": "actiontwo",
            "click [actionthree]": "actionthree",
        },

        scrollHandler : function (event) {
        	var top = $(".mainPanelBody").scrollTop();
        	var h = $(".mainPanelBody").height();
        	var b = $(".mainPanelBody").prop('scrollHeight');
        	//console.log(b - top + ":" + h);
        	if ( b - top < h + 5 ) {
        		// restict fast scrolling
        		if (event.data.nextHandlerState) return;
        		event.data.nextHandlerState = true;
        		$.when(event.data.NextHandler(event)).done ( function() {
        			event.data.nextHandlerState = false;
        		}).fail(function() { event.data.nextHandlerState = false; });
        	}
        },

        render:function (data) {
          var that = this;

          if ( !_.isUndefined(data) )  {
          	that.model.set(data.models);	
          }
          else 
    	  	data = that.model;	  	

          var metaApplet = new ReferralWireBase.AppletView({applet: that.options.applet, template: this.options.templateHTML});
          var appletTemplate = metaApplet.render().el;     

          if ( data.length > 0){
		 	_.each(data.models, function (stdModel) {
				    $( that.options.offset ? 'ul#'+that.id : that.el ).append(ReferralWireBase.recordBinder(appletTemplate, stdModel));         
	      	}, that);

	      	if ( that.options.offset == 0) {
	    		$('ul#'+that.id).listview('refresh'); 
	      	}    		
    		that.options.offset = that.options.offset + rwcore.pagingSize;
	      } 
          else {
          	if( that.options.offset == 0 ) {
		        var noRecordHTML = "<h3 style='font-style:italic'> No records! </h3>"
    	        $(that.el).append(noRecordHTML);
    	    }
          }          

          return that;
        },    	
    	
    	NextHandler: function(event) {    
    		var p = $.Deferred();
    		var that = event.data;
    		if ( that.id == 'FaceBookRegionSelector' )
    		{	
    			rwcore.spinOn();
    			var promise = rwcore.FBMatch({offset:that.options.offset});
    			promise.done( function(data) {
    				data && that.render(data);
    				rwcore.spinOff();
    				p.resolve();
    			}).fail(function(response) {rwcore.spinOff(); p.reject()});
    		}  else if (that.id == 'LinkedIdRegionSelector' ) {
    			rwcore.spinOn();
    			var promise = rwcore.LNMatch({offset:that.options.offset});
    			promise.done( function(data) {
    				data && that.render(data);
    				rwcore.spinOff();
    				p.resolve();
    			}).fail(function(response) {rwcore.spinOff(); p.reject();});
    		}
    		return p;
    	},		
		
        actionone: function(event) {
            var that = this;
            var target = event.target;

            if ($(target).html() == 'Invited') return;

            var selectedId = $(target).attr('for');

            FB.api('/' + selectedId, function(response) {

	  			var data = new rwcore.StandardModel({module: 'RfrlMgr'});
			    
				data.set( { 'socialId': rwFB.fbUserID});
				data.set( { 'socialConnectionId':selectedId});
				data.set( {	'invitationType': 'FB'});
				data.set( { 'to_firstName' : response.first_name });
				data.set( { 'to_lastName':  response.last_name });
				data.set( { 'to_middleName' : response.middle_name });
				data.set( { 'to_emailAddress' : response.username });
				
				data.call("SocialInvitaton", data,
		    			 {     	
				 			add : true, error : rwcore.showError,
				 			raw : true,
		    				success : function (model, response, jqXHR) {
								var link  = rwFB.rwTenantURL + '/register.jsp?invitation=' + model.token ;
								FB.ui({
					                method: 'send',
					                name : rwFB.rwTenantName,
					                to: selectedId,
					                link: link,
					                picture: rwFB.rwTenantLogo,
					                description: rwFB.rwTenantInvitation,
					                display:  'popup'
					            },
					            function(response) {
					            	var status = 'FAILED';
					            	if (response) {
								      	$(target).attr("class","");
									  	$(target).html("Invited");
									  	status = 'SUCCESS';
									}

									var data2 = new rwcore.StandardModel({module: 'RfrlMgr'});
									data2.set( { 'status': status});
									data2.set( { 'socialConnectionId':selectedId});
									data2.set( { 'invitationType': 'FB'});
									data2.set( { 'details' : model } );
						
								  	data2.call("SocialInvitatonSent", data2, 
								  		{add : true, error : rwcore.showError, success : function (model, response, jqXHR) {}});
					        	}	
					            );
	 	    				}		
		    			});
        	});
            
            /*  
              This is the API for requests. This API takes more than one address to prefill, but limited to
              very basis content. Suitable for open network invitations such at Klout. But not for identify 
              tracking invitation only applications like ReferralWireView.
              
            FB.ui({
                method: 'apprequests',
                message: link,
                to: ['sudhakar.kaki', '627160' ],
                data: link
            });
            */
            
            
        },

        actiontwo: function(event) {
            var target = event.target;

            if ($(target).html() == 'Invited') return;

            var selectedId = $(target).attr('for');
            

            IN.API.Profile(selectedId).fields(["firstName","lastName"]).
            result(function(result) {

            	var connectionDetails = result.values[0];
	  			var data = new rwcore.StandardModel({module: 'RfrlMgr'});
			    
				data.set( { 'socialId': rwFB.lnUserID});
				data.set( { 'socialConnectionId':selectedId});
				data.set( {	'invitationType': 'LN'});
				data.set( { 'to_firstName' : connectionDetails.firstName });
				data.set( { 'to_lastName':  connectionDetails.lastName });
				data.set( { 'to_emailAddress' :  connectionDetails.firstName + "." + connectionDetails.lastName});
				
				data.call("SocialInvitaton", data,
		    			 {     	
				 			add : true, error : rwcore.showError,
				 			raw : true,
		    				success : function (model, response, jqXHR) {
				        		var link  = rwFB.rwTenantURL + '/register.jsp?invitation=' + model.token ;
				        		var BODY = {
				        			  "recipients": {
				        				    "values": [
				        				    {
				        				      "person": {
				        				        "_path": "/people/" + selectedId,
				        				       }
				        				    }]
				        				  },
				        				  "subject": rwFB.rwTenantInvitation,
				        				  "body": link
				        		};

				        		IN.API.Raw("/people/~/mailbox") 
				        		  .method("POST")
				        		  .body(JSON.stringify(BODY))
				        		  .result( function(result) { 

				        		  	  $(target).attr("class","");
									  $(target).html("Invited");

									  var data2 = new rwcore.StandardModel({module: 'RfrlMgr'});
										data2.set( { 'status': 'SUCCESS'});
										data2.set( { 'socialConnectionId':selectedId});
										data2.set( { 'invitationType': 'LN'});
							
									  	data2.call("SocialInvitatonSent", data2, 
									  		{add : true, error : rwcore.showError, success : function (model, response, jqXHR) {}});
									  	rwcore.FYI(connectionDetails.firstName + ' has been invited.' );
							
								  })
				        		  .error(  function(error)  { 
				        			  var data2 = new rwcore.StandardModel({module: 'RfrlMgr'});
										data2.set( { 'status': 'FAILED'});
										data2.set( { 'socialConnectionId':selectedId});
										data2.set( { 'invitationType': 'LN'});
							
									  	data2.call("SocialInvitatonSent", data2, 
									  		{add : true, error : rwcore.showError, success : function (model, response, jqXHR) {}});
								  		rwcore.FYI(error.message); 
				        		  } );
							}		
		    			});
        	});
        },

        actionthree: function(event) {
            var target = event.target;
            // var selectedId = $(target).attr('for');
           alert('ActionThree');
        },
    });
    
	ReferralWireView.PhotoGallery = ReferralWireView.FormView.extend({
   		events:{
  	      "click [next]":"next"
   		},
   		
	    next: function(event){
	    	
	    	var activePhoto = $(".activePhoto");
	    	var nextPhoto = activePhoto.next('li'); 
	    	if (nextPhoto.length > 0){
	    		
	        var nextPhotoId = nextPhoto.attr("id");
	    	
	    	activePhoto.animate({
               left:'-=2000',
                //right:'+=150%'
                
                
              }, 500, function() {
            	  activePhoto.hide();
            	  activePhoto.removeClass("activePhoto");
            	  
            	  $("[prevphoto]").show();
              });
	    	
	    	nextPhoto.show();
	    	nextPhoto.animate({
                //left:-1000,
                right:'+=2000'
	    	},500,function(){
	    		nextPhoto.addClass("activePhoto");
	    		var afterThis = nextPhoto.next('li');
	    		
	    		
	    		if (afterThis.length == 0){
	    			$("[nextphoto]").hide();
	    		}
	    		else{
	    			var afterThisImg = afterThis.find('img').attr('src');
	    			if (_.isUndefined(afterThisImg) || _.isNull(afterThisImg) || afterThisImg == "" || afterThisImg == "undefined")
	    				$("[nextphoto]").hide();	
	    		}
	    	});
	    	} else {
	    		$("[nextphoto]").hide();
	    	}
	    	
	    	
	    	
	    },
   		
	    previous: function(event){

	    	var activePhoto = $(".activePhoto");
	    	var previousPhoto = activePhoto.prev('li'); 
	    	
	    	activePhoto.animate({
               right:'-=2000'
                //right:'+=150%'
                
                
              }, 500, function() {
            	  activePhoto.hide();
            	  activePhoto.removeClass("activePhoto");
 	    		 $("[nextphoto]").show();
              });
	    	
	    	previousPhoto.show();
	    	previousPhoto.animate({
                //left:-1000,
                left:'+=2000'
	    	},500,function(){
	    		previousPhoto.addClass("activePhoto");
  	    		var beforeThis = previousPhoto.prev('li'); 
  	    		if (beforeThis.length == 0){
	    			$("[prevphoto]").hide();
	    		}


	    		

	    	});
	    	
	    },
	    
	    
	    launchshow:function(event){
	    	
	    	var clickedPhotoId = event.target.id;
            var galleryview = new ReferralWireView.PhotoGallery({
                model: this.model, 
                applet: this.applet, 
                templateHTML : 'PhotoGalleryShow',
                showViewBar:false});
            
            $("#slideshowcontainer").html(galleryview.render(galleryview.model).el);
            
            var notfound = true;
            $('.pGallery').children('li').each(function () {
                if (notfound){
	            	var thisId = $(this).attr("id");
	                
	                if (thisId == clickedPhotoId){
	                	if ($(this).hasClass("activePhoto") == false){
	
		                	$(this).addClass("activePhoto");
		                	$(this).css('right','0');
		                	$(this).show();
		                	var afterThis = $(this).next(); 
			    	    		if (afterThis.length == 0){
			    	    			$("[nextphoto]").hide();
			    	    		}
			    	    		else{
			    	    			var afterThisImg = afterThis.find('img').attr('src');
			    	    			if (_.isUndefined(afterThisImg) || _.isNull(afterThisImg) || afterThisImg == "" || afterThisImg == "undefined")
			    	    				$("[nextphoto]").hide();	
			    	    		}
	                	}
	                	notfound = false;
	                	
	                } else {
	                	$(this).removeClass("activePhoto");
	                	//var lft = parseInt($(this).attr('left'));
	                	//lft = lft - 2000;
	                	$(this).css('left','-2000px');
	                	$(this).css('right','');
	                	$(this).hide();
	                	$("[prevphoto]").show();
	    	    		
	    	    		
	                }
                }
            });
            
 
            
            $("#slideshowcontainer").show();
	    }
 	});

	ReferralWireView.SimpleView = Backbone.View.extend({
	  		tagName:'div',
	  		options : null,
	  		initialize:function (options) {
	  			this.options = options;
	  		},
	  		render:function (data) {
	  			$(this.el).html(_.template(this.options.template, { model : _.isUndefined(data) ? this.model : data, options: this.options}));				
	  			return this;
	  		}
	  	});

	ReferralWireView.ChartView = Backbone.View.extend({
    	tagName:'div',
    	id: Math.random().toString(36).substr(2,16),
    	options: null,
    	initialize:function (options) {
    		this.options = options;
    		var seriesName = undefined;
    		if (!_.isUndefined(options.chartName)){
    			this.metaApplet = new ReferralWireBase.RepoObjectModel({ type: 'ChartApplet', name : options.chartName});
    			seriesName = this.metaApplet.get('series');
    			this.catLovType = this.metaApplet.get('LOVType');
    			this.clientSort = this.metaApplet.get('clientSort');
				this.plotformat = this.metaApplet.get('plotformat');
				this.cType = this.metaApplet.get('type')
				this.seriesItemXlabel = this.metaApplet.get('series-item-xlabel');
				this.seriesLabel = this.metaApplet.get('series-label');
				this.title = this.metaApplet.get('Title');
				this.catformat = options.catformat;
	  			var cType = this.cType; //DELTA
	  			this.contextVars = options.contextVars; //this is an object with named context variable values
	  			this.pointSelectFunction = options.pointSelectFunction;

    		} else {
    			seriesName = options.seriesName;
    			this.cType = options.chartType;
    			this.title = (!_.isUndefined(options.title))?options.title:"";
    			this.seriesItemXlabel = (!_.isUndefined(options.seriesItemXlabel))?options.seriesItemXlabel:"";
    			this.seriesLabel = (!_.isUndefined(options.seriesLabel))?options.seriesLabel:"";

    		}
    		
    		this.metaSeries = new ReferralWireBase.RepoObjectModel({ type: 'ChartData', name : seriesName});
    		this.chartContainer = options.containerEl;

    		
	    },
	    events: {
	    	"click #showchart" : "showchart",
	    },
	    showchart : function () {
	    	alert("1");
	    },
	    formatDataRequest:function(){
	    	  var inputParams = {};
	    	  var chart = {};
	          chart.name =  (!_.isUndefined(this.metaApplet))?this.metaApplet.name:this.metaSeries.name;
	          chart.dataclass =  this.metaSeries.get('dataclass');
	          chart.clientSort = this.clientSort;
	          //subTitle =  subTitle + "," + $('#groupby option:selected').text();	  
 
		      chart['filter'] = this.metaSeries.get('filter');
		      this.addContextVars(chart,inputParams);
	          chart['groupby'] = this.metaSeries.get('groupby');
	          var clientSort = this.clientSort;
	          if ($.hasVal(clientSort)){
	          		var order = (clientSort == 'CHRON' || clientSort == 'ALPHA')?1:-1;
	          		var sort = {};
	          		sort["_id"] = order;
	          		chart['sort'] = sort;
	          }
	          chart['sort'] = this.metaSeries.get('sort');
	          inputParams['chart'] = chart;
	          inputParams['module'] = 'AnalyticsMgr';
	          inputParams['act'] = 'getChart';//this.meta.get('actName');getTrackerChart
	          inputParams['name'] = this.metaSeries.get('name');
	          inputParams.searchRequest = this.searchRequest;
	          return inputParams;
	    },
	    addContextVars:function(chart,inputParams){
	    	var filters = chart.filter;
	    	if ( _.isArray(filters) == false ) {
	    		filters = [filters];
	    	}
	    	if (!_.isUndefined(this.contextVars) && !_.isUndefined(filters)){
	    		for (var item in this.contextVars){
	    			for (var j = 0; j < filters.length; j++){
	    				thisF = filters[j];
	    				if (thisF.hasOwnProperty("contextVar") && thisF.contextVar == item){
	    					inputParams[item] = this.contextVars[item]; // if we've passed in contextVar value an as input to the chart view
	    					// -- and it corresponds to the name of a context var in the series metadata, then add it as a property of the chart
	    				}
	    			}
	    		}
	    	}
	    },

	    getData:function(){  
	    	  
	    	  var promise = $.Deferred();
	          var chart = {};
	          var inputParams = this.formatDataRequest();
	       	  var groupby = inputParams.chart.groupby;
	          
	          var that = this;
	          var data = new rwcore.StandardCollection(inputParams);

          
          	$.when(data.sync()).done( function( c ) { 
          	  var jName = ($.hasVal(groupby.joinfield) && $.hasVal(groupby.joinfield.name))?groupby.joinfield.name:undefined;
          	  var hasJ = $.hasVal(jName);
          	  if (hasJ){
          	  	var jArray = jName.split(",");
          	  	if (jArray.length > 1) {
          	  		jName = {};
          	  		for (var i = 0; i < jArray.length; i++){
          	  			jName[jArray[i]] = undefined;
          	  		}
          	  	} else {
          	  		jName = jArray[0];
          	  	}
          	  }
          	  var hasJ = $.hasVal(jName);

          	  var u = groupby.unit;
          	  var hasU = $.hasVal(u);
          	  var gpDisp = catDisplay;
          	  var catDisplay = (hasJ)?jName:groupby.field.name;
          	  
          	  var isCum = (!_.isUndefined(groupby.aggregate.isCumulative))?true:false;// hasn't been used yet in chart.xml
          	  
          	  
          	  if ($.hasVal(that.clientSort) && that.clientSort == 'ALPHA'){//joined fields are sorted on client
          	  		c.models = _.sortBy (c.models, function(m) {return m.get(catDisplay);});
          	  }

          	  if ($.hasVal(that.clientSort) && that.clientSort == 'DESC') {//sorts categories in descending order of their values
          	  		c.models = _.sortBy (c.models, function(m) {return m.get(groupby.aggregate.name);});
          	  		c.models.reverse();
          	  }

	          var series = [];
	          var cumTot = 0;
	          for (var i = 0; i < c.length; i++) {
	          	    var seriesItem = {};
		            var a = c.models[i].get('_id')[groupby.aggregate.name];
		            if (_.isUndefined(a))
		              a = c.models[i].get('_id');
		              if (_.isObject(a)){a = a[groupby.field.name]};
		            seriesItem['name'] = a;
		            var display = a;
		            if (hasJ && _.isObject(jName) && !_.isUndefined(that.catformat)) {
		            	display = {};
		            	for (var j in jName){
		            		display[j] = c.models[i].get(j);
		            	}
		            	display.id = a;
		            } else {
		            	if (hasJ){display = c.models[i].get(jName);}
		            }
		            
		            if (display == "No Value" || display == "" || (_.isObject(display) && _.isUndefined(that.catformat))) {display = "No "+gpDisp}
		            if ($.hasVal(that.catLovType)){display = rwcore.getLovDisplayVal(that.catLovType,display)}; 
		            if (hasU){//format the series labels with additional descriptors
		            	if (u == 'week'){
			            	//display = 'Week ' + a[u] + ' ' + a['year']//rwcore.getLovDisplayVal(u,display);
			            	display = $.getFirstDayOfWeek(a['year'],a[u],0);
			            } 
			            if (u == 'month'){
			            	display = rwcore.getLovDisplayVal('MONGO_MONTH',a[u]) + ' ' + a['year']//rwcore.getLovDisplayVal(u,display);	$$
			            }
		            } 
		            seriesItem['display'] = display;
		            
		            cumTot+= c.models[i].get(groupby.aggregate.name);
		            seriesItem['y'] = (isCum)?cumTot:c.models[i].get(groupby.aggregate.name);
		            series[i] = seriesItem;
		            
	          }
	          //that.renderFinish(series);
	          promise.resolve(series);
	    	}).fail(function(){promise.reject()});
	    	return promise;
	    	
		},
	  	render:function () {

  			//if($.hasVal(metaModel)) {this.meta = metaModel;}
  			var that = this;
  			var dHeight = ($.hasVal(that.options.defaultHeight))?that.options.defaultHeight:600;
  			$.when(that.getData()).done(function(series){
	  			var m = that.metaApplet
	  			var pFormat = that.plotformat; 
	  			var cType = that.cType; //DELTA
	  			var t = (cType == 'column')?'bar':cType;
	  			//var cT  = _.clone($.wizardChartTemplates[t]);
	  			var cT = JSON.parse(JSON.stringify($.wizardChartTemplates[t])); //this createa a deep clone. Note: _.clone only does a shallow clone
	  			if (cType == 'pie' && !_.isUndefined(that.pointSelectFunction)) {
	  				cT.plotOptions.pie.point.events.click = that.pointSelectFunction;
	  			}
	  			cT.title.text = that.title; //DELTA
	  			cT.chart.renderTo = that.chartContainer

	  			$("#"+that.chartContainer).height(dHeight);
	  			if (cType == 'bar' || cType == 'column'){
	  				cT.xAxis.title.text = that.seriesItemXlabel; //DELTA
	  				cT.xAxis.categories = _.map(series, function (item) { return item.display });
	  				cT.yAxis.title.text = that.yAxisTitle;
	  				cT.series[0].data = series;
	  				cT.series[0].name = that.seriesLabel; //DELTA
	  				if (!_.isUndefined(that.catformat)){cT.xAxis.labels.formatter = that.catformat}
	  				if ($.hasVal(pFormat)){cT.plotOptions.bar.dataLabels.format = '{point.y:.2f}'};
	  			}
	  			if (cType == 'pie'){
	  				//cT.series[0].data = series;
	  				cT.series[0].data = _.map(series, function (item) {return {name:item.display,y:item.y,id:item.name}});
	  				cT.series[0].name = that.seriesLabel; //DELTA
	  			}
	  			if (cType == 'column'){
	  				cT.chart.type = 'column';
	  				cT.series[0].pointWidth = 40;
	  			}
	  			if (cType == 'bar'){
	  				cT.chart.type = 'bar';
	  				cT.series[0].pointWidth = 30;
	  				if (cT.series[0].data.length > 6) {
	  					var extraHeight = (cT.series[0].data.length - 9) * 70;
	  					var currHeight = $("#"+that.chartContainer).height();
	  					$("#"+that.chartContainer).height(currHeight + extraHeight);

	  				}
	  			}
	  			chart = new Highcharts.Chart(cT); //end chart
        	return that;
  			});
  		},
  	});





















	ReferralWireView.ChartWizardView = Backbone.View.extend({
    	tagName:'div',
    	id: Math.random().toString(36).substr(2,16),
    	options: null,
    	initialize:function (options) {
    		this.options = options;
    		this.meta = options.meta;
    		this.chartContainer = "chartContainer";
    		this.yAxisTitle = "Total";
	    },
	    events: {
	    	"click #showchart" : "showchart",
	    },
	    showchart : function () {
	    	alert("1");
	    },

	    getData:function(){  
	    	  var promise = $.Deferred();
	          var chart = {};
	          var inputParams = {};
	       //format meta data   
	          chart.name =  this.meta.get('dataclass') + "Chart";
	          chart.dataclass =  this.meta.get('dataclass');
	          //subTitle =  subTitle + "," + $('#groupby option:selected').text();
	          var groupby = {field:{name:''},aggregate:{name:'',fn:''}};
	          groupby.field.name = this.meta.get('groupByField');
	          groupby.aggregate.name = this.meta.get('groupByField');
	          groupby.aggregate.label = this.meta.get('groupByDisplay');	
	          groupby.aggregate.fn = this.meta.get('fn');
	          groupby.aggregate.value = this.meta.get('fnField');
	          if($.hasVal(this.meta.get('unit') && this.meta.get('unit') != 'nothing')) {groupby.aggregate.unit = this.meta.get('unit')};
	          if ($.hasVal(this.meta.get('joinName'))){
		          var joinfield = {};
		          joinfield.name = this.meta.get('joinName');
		          joinfield.onKey = this.meta.get('joinOn');
		          joinfield.toKey = this.meta.get('joinTo');
		          joinfield.toCollection = this.meta.get('joinColl');
		          groupby.joinfield = joinfield;

		      }

		      var sApplet = this.meta.get("searchapplet");
		      var searchFormView = new ReferralWireView.FormView({applet:sApplet});
		      chart.admin = 'true';
		      chart['filter'] = (!_.isUndefined(searchFormView.metaApplet.model.get('searchSpec')))?searchFormView.metaApplet.model.get('searchSpec').filter:undefined;
	          chart['groupby'] = groupby;
	          if ($.hasVal(this.meta.get('orderBy')) && !$.hasVal(this.meta.get('joinName'))){
	          		var order = (this.meta.get('orderBy') == 'CHRON' || this.meta.get('orderBy') == 'ALPHA')?1:-1;
	          		var sort = {};
	          		sort["_id"] = order;
	          		chart['sort'] = sort;
	          }
	          if ($.hasVal(this.meta.get('limit'))){chart['limit'] = this.meta.get('limit')}
	          	//groupby.aggregate.limit = this.meta.get('limit');
	          inputParams['chart'] = chart;
	     //end format meta     
	          this.meta = rwApp.getReportModel({baseModel:this.meta,sActor:this.meta.get('sActor'),sBC:this.meta.get('sBC'),sBO:this.meta.get('sBO')});
	          inputParams.searchRequest = rwApp.parseSavedSearch(this.meta,sApplet);
	          //inputParams.searchRequest = this.meta.get('fExecDef');
	          inputParams['module'] = this.meta.get('actor');
	          inputParams['act'] = 'getChart2';//this.meta.get('actName');getTrackerChart
	          inputParams['name'] = this.meta.get('series');

	          var catDisplay = ($.hasVal(this.meta.get('joinName')))?this.meta.get('joinName'):groupby.field.name;
	          var that = this;
	          var data = new rwcore.StandardCollection(inputParams);
          
          	$.when(data.sync()).done( function( c ) { 
          	  var jName = that.meta.get('joinName');
          	  var hasJ = $.hasVal(jName);
          	  var u = that.meta.get('unit');
          	  var hasU = $.hasVal(u);
          	  var gpDisp = that.meta.get('groupByDisplay');
          	  var isCum = (that.meta.get('isCumulative') == 'true')?true:false;
          	  
          	  if (that.meta.get('orderBy') == 'ALPHA' && $.hasVal(that.meta.get('joinName'))){//joined fields are sorted on client
          	  		c.models = _.sortBy (c.models, function(m) {return m.get(catDisplay);});
          	  }

          	  if (that.meta.get('orderBy') == 'DESC'){//joined fields are sorted on client
          	  		c.models = _.sortBy (c.models, function(m) {return m.get(groupby.aggregate.name);});
          	  		c.models.reverse();
          	  }

	          var series = [];
	          var cumTot = 0;
	          for (var i = 0; i < c.length; i++) {
		            var seriesItem = {};
		            var a = c.models[i].get('_id')[groupby.aggregate.name];
		            if (_.isUndefined(a))
		              a = c.models[i].get('_id');
		            
		            seriesItem['name'] = a;
		            var display = a;
		            if (hasJ){display = c.models[i].get(jName);}
		            if (display == "No Value" || display == "" || _.isObject(display) ){display = "No "+gpDisp}
		            if (hasU){//format the series labels with additional descriptors
		            	if (u == 'week'){
			            	//display = 'Week ' + a[u] + ' ' + a['year']//rwcore.getLovDisplayVal(u,display);
			            	display = $.getFirstDayOfWeek(a['year'],a[u],0);
			            } 
			            if (u == 'month'){
			            	display = rwcore.getLovDisplayVal('MONGO_MONTH',a[u]) + ' ' + a['year']//rwcore.getLovDisplayVal(u,display);	$$
			            }
		            } 
		            seriesItem['display'] = display;
		            
		            cumTot+= c.models[i].get(groupby.aggregate.name);
		            seriesItem['y'] = (isCum)?cumTot:c.models[i].get(groupby.aggregate.name);
		            series[i] = seriesItem;
		            
	          }
	          //that.renderFinish(series);
	          promise.resolve(series);
	    	}).fail(function(){promise.reject()});
	    	return promise;
		},

	    
	  	render:function (metaModel) {
	  		if($.hasVal(metaModel)) {this.meta = metaModel;}
  			var that = this;

  			$.when(that.getData()).done(function(series){
	  			var m = that.meta;
	  			var cType = m.get('chartType');
	  			var t = (cType == 'column')?'bar':cType;
	  			var cT  = $.wizardChartTemplates[t];
	  			cT.title.text = m.get('reportName');
	  			cT.chart.renderTo = that.chartContainer
	  			$("#"+that.chartContainer).height(600);
	  			if (cType == 'bar' || cType == 'column'){
	  				cT.xAxis.title.text = m.get('groupByDisplay');
	  				cT.xAxis.categories = _.map(series, function (item) { return item.display });
	  				cT.yAxis.title.text = that.yAxisTitle;
	  				cT.series[0].data = series;
	  				cT.series[0].name = m.get('metricName');
	  			}
	  			if (cType == 'pie'){
	  				//cT.series[0].data = series;
	  				cT.series[0].data = _.map(series, function (item) {return {name:item.display,y:item.y,id:item.name}});
	  				cT.series[0].name = m.get('metricName');
	  			}
	  			if (cType == 'column'){
	  				cT.chart.type = 'column';
	  				cT.series[0].pointWidth = 40;
	  			}
	  			
	  			if (cType == 'bar'){
	  				cT.chart.type = 'bar';
	  				cT.series[0].pointWidth = 30;
	  				if (cT.series[0].data.length > 6) {

	  					var extraHeight = (cT.series[0].data.length - 6) * 30;
	  					var currHeight = $("#chartContainer").height();
	  					that.defChartHeight = currHeight;
	  					$("#chartContainer").height(currHeight + extraHeight);
	  				}
	  			}
	  			chart = new Highcharts.Chart(cT); //end chart
        	return that;
  			});
  		},

  	});
  
	return ReferralWireView;   
  })(Backbone, _, $, templatecache, babysitter, csvparser, ReferralWireBase || window.jQuery || window.Zepto || window.ender);
  return Backbone.ReferralWireView; 
}));

