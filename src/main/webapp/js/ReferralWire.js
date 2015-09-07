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

  Backbone.ReferralWire = ReferralWire = (function(Backbone, _, $){
  var ReferralWire = {}; 
  var slice = Array.prototype.slice;

  ReferralWire.HomePageModel = Backbone.Model.extend({
		
		options : {
			success: function (model, status, xhr) {},
			error: function(request, status, error) {}
		},
		
	    urlRoot: function() {
	    	var strUrl = "/rwWebRequest?";
	    	return strUrl;
	    },

	    initialize : function (options) {
	    	this.options = options;
	    },
	    
	    sync: function(method, model,options) {

	    	var that = this;
	    	var dataout = {} ;
	    	var strUrl = this.urlRoot() ;

	    	if ( _.isUndefined(options) )
	    		options = that.options;
	    	
	    	dataout["module"] = 'HomePageMgr';
	    	dataout["act"] = 'read';

	    	if ( !_.isUndefined(that.options) && !_.isUndefined(that.options.PartyId)  )
	    		dataout["PartyId"] = that.options.PartyId;

	    	$.ajax({
		            type: "POST",
		            url: strUrl,
		            async: false,
		            cache: true,
		            dataType: "json",
		            data: dataout,
		            timeout: 25000,
		            beforeSend : function(jqXHR, settings) {
		            	$.mobile.loading('show');
  			            	return true;
  			         	},
		            success: function(data, textStatus, jqXHR) {
		            	$.mobile.loading('hide');
		            	 
		            	var userdata = JSON.parse(data.userdata.data);
		            	var keys = Object.keys(userdata);
		            	var item = {};
	            		for ( var i = 0; i < keys.length; i++) {
	            			 item[keys[i]] = userdata[keys[i]];
		            	}
	            		
	            		var idItem = userdata["_id"];
		            	if ( !_.isUndefined(idItem) && !_.isNull(idItem) ) {
		            		item['id'] = idItem["$oid"];
		            	}
		            	
		            	/*
		            	var LastTwoWeeksReferralsRcvd = JSON.parse(data.LastTwoWeeksReferralsRcvd.data);
		            	item['LastTwoWeeksReferralsRcvd'] = LastTwoWeeksReferralsRcvd.length > 0? LastTwoWeeksReferralsRcvd[0][LastTwoWeeksReferralsRcvd[0]["_id"]] : 0 ;

		            	var LastTwoWeeksReferralsSent = JSON.parse(data.LastTwoWeeksReferralsSent.data);
		            	item['LastTwoWeeksReferralsSent'] = LastTwoWeeksReferralsSent.length > 0? LastTwoWeeksReferralsSent[0][LastTwoWeeksReferralsSent[0]["_id"]] : 0 ;
		            	
		            	var NewReferralsRcvd = JSON.parse(data.NewReferralsRcvd.data);
		            	item['NewReferralsRcvd'] = NewReferralsRcvd.length > 0? NewReferralsRcvd[0][NewReferralsRcvd[0]["_id"]] : 0 ;

		            	var NewReferralsSent = JSON.parse(data.NewReferralsSent.data);
		            	item['NewReferralsSent'] = NewReferralsSent.length > 0? NewReferralsSent[0][NewReferralsSent[0]["_id"]] : 0 ;

		            	var LastTwoWeeksMembersInvitedByMe = JSON.parse(data.LastTwoWeeksMembersInvitedByMe.data);
		            	//item['LastTwoWeeksMembersInvitedByMe'] = (LastTwoWeeksMembersInvitedByMe.length > 0 && LastTwoWeeksReferralsRcvd.length > 0)? LastTwoWeeksMembersInvitedByMe[0][LastTwoWeeksReferralsRcvd[0]["_id"]]  : 0 ;
		            	item['LastTwoWeeksMembersInvitedByMe'] = (LastTwoWeeksMembersInvitedByMe.length > 0)? LastTwoWeeksMembersInvitedByMe[0][LastTwoWeeksMembersInvitedByMe[0]["_id"]]  : 0 ;
		            	*/

						var NewMembersLastSeven = JSON.parse(data.NewMembersLastSeven.data);
		            	item['NewMembersLastSeven'] = NewMembersLastSeven.length > 0? NewMembersLastSeven[0][NewMembersLastSeven[0]["_id"]] : 0 ;

		            	var NewPowerPartners = JSON.parse(data.NewPowerPartners.data);
		            	item['NewPowerPartners'] = NewPowerPartners.length > 0? NewPowerPartners[0][NewPowerPartners[0]["_id"]] : 0 ;
		            	//var ReferralsSent = JSON.parse(data.ReferralsSent.data);
		            	//item['ReferralsSent'] = ReferralsSent.length > 0? ReferralsSent[0].count : 0 ;
	            		
		            	//var ReferralsRecieved = JSON.parse(data.ReferralsRecieved.data);
		            	//item['ReferralsRecieved'] = ReferralsRecieved.length > 0? ReferralsRecieved[0].count : 0 ;
	            		
		            	//var NewUsers = data.NewUsersCount.data.NewUsers;
		            	//item['NewUsers'] = NewUsers;

		            	//var NewMsgs = data.NewMsgCount.data.NewMsgs;
		            	//item['NewMsgs'] = NewMsgs;

		            	//var PartnerInteractions = data.PartnerTransactions.data.PI_total;
		            	//item['PartnerInteractions'] = PartnerInteractions;

		            	//var PartnerInteractions_SameProf =data.PartnerTransactions.data.PI_sameprof;
		            	//item['PartnerInteractions_SameProf'] = PartnerInteractions_SameProf;

		            	//item['ReferralActivity'] = data.ReferralActivity.data;
		            	//item['ReferralsByProfession'] = JSON.parse(data.ReferralsByProfession.data);
		            	
		            	// TEST:
		            	//item['ReferralsByMyAssociation'] = JSON.parse(data.ReferralsByMyAssociation.data); 
		            	
		            	that.set(item);

            			rwFB.routes = JSON.parse(data.routes);
                  options.success(that, textStatus, jqXHR);
		            },
		            error: function (request, status, error) {
		            	$.mobile.loading('hide');
                  rwcore.showError(request, status, error);
		            }
		    });	
	    }
	 });
   
	
 	
	
	 
  
	  
  ReferralWire.HomePageView = Backbone.View.extend({
    tagName:'div',
    
    params:"",
    initialize:function (options) {
      this.params = options; 
    },    
    events:{
        // Add more events here 
          //"click #delete":function(){rwApp.FYI('delete');},
          "click [confirmation='true']":"updateField",
          "click [updateStatus='ACCEPTED']":"updatedClaimedStatus",
          "click [updateStatus='CONFIRMED']":"updatedContactedStatus",
          //"click #phoneTitleBar":function(){toggleMenu();},
 		  "tap #refer":"refer",
 		  "tap #inviteWizard":"inviteWizard",
 		  "tap [toggle]":"toggleNewFeed",
 		  "tap .checkin":"checkin",
 		  "click .gotoEvent":"gotoEvent",
 		  "click [toggleState]":"toggleListRow",
 		  "click [claimOrArchive]":"claimOrArchive",
 		  "tap .addGuest":"addGuest",
 		  "click #upsertBanner":"upsertBanner",
 		  "click #editmissingprofile":"editmissingprofile",
 		  "click #dismissHelp":"dismissWelcome",
 		  "click .searchDirectory":"searchDirectory",
 		  "click .addyourbiz-button":"addbiz",
 		  "click .dir-cat":"searchDirectoryCat",
    	  "click #postAMessage":function() {
    	  	  
    		  var that = this;
    		  var message = new rwcore.StandardModel({module: 'ActivityStreamMgr', type: 'MESSAGE', message : $('#message').val() });
    		  message.save({}, {
    			  success: function () {
    	 			  that.renderSection($('div [applet="ActivityList"]'));
    	 			 $('#message').val('');
    	 			$('#message').html('');
    	 			 
    	 			  
    			  },
    			  error : rwcore.showError});
    	  	}
    },
    dismissWelcome:function(event){
    	event.data = this.welcomeView;
    	rwFB.showWelComePage = 'HIDE';
    	this.welcomeView.dismiss(event);
    },
    
    toggleListRow:function(event){
    	
	    	var sourceSection = $(event.target).parents("[applet]");
	    	var sectionViewName = sourceSection.attr("applet");
	    	this[sectionViewName].toggleCollapse(event);
	    	console.log("homepageview");
	    	//HomePage
	    
    },

    addbiz:function(){

    	var upsertApplet = "BusinessCreateForm";
    	var that = this; 
    	var readView = new ReferralWireView.FormView({
			        	  applet: upsertApplet, 
			              templateHTML : 'StdForm',
			              parentView : this,
			              showConfirmOnSave:false,
			              showViewBar:false,
			              //refreshFunctionStatic:"that.parentView.renderSectionSelector('#bannerMessage')"
			              refreshFunction:function(model,formview){
			              	var id = model.get('id');
			              	rwFB.employerId = id;
			              	rwApp.navigate("#BusinessDirectoryDetails/"+id+"/none/none/none", {trigger: true});
			              }
			        });
    	readView.setDefaultModel();
	     readView.model.bo = readView.bo;
	     readView.model.bc = readView.bc;
	     //readView.model.set(defaultMap);			      
		 readView.editRecord(upsertApplet);

    },

	searchDirectoryCat:function(event){
		var target = event.target;
        var tagName = $(target).get(0).nodeName.toLowerCase();
        var elem = $(event.target);
        if (tagName != 'li'){
          elem = $(target).parents('li');
        }
        var cat = elem.attr('category');
        event.category = cat;
        this.searchDirectory(event);

	},

    searchDirectory:function(event){
		var zip = $(".directory-search-input-zip").attr("value");
		//if ($.hasVal(zip)){
	      	var keyWord = $(".directory-search-input-business").attr("value");
	      	keyWord = ($.hasVal(keyWord))?keyWord:"none";
	      	zip = ($.hasVal(zip))?zip:"none";
	      	var category = ($.hasVal(event.category))?event.category:"none";
	      	rwApp.navigate("#BusinessDirectoryMap/none/"+category+"/"+keyWord+"/"+zip, {trigger: true});
	      
      	//} else {
      	//	var t = "ConfirmBusSearchZip";
      	//	rwcore.showWaitDialog(t, {}, function(target){	          

	    //   	})
      	//}
    },
    //HomePageUpsertForm
    editmissingprofile: function(event){
    	var upsertApplet = "HomePageUpsertForm";
    	var dViewName = "PartyAppletForm";
    	var listModel = this[dViewName].model;
    	listModel.options.bo = "Party";
    	listModel.options.bc = "Party";
    	var readView = new ReferralWireView.FormView({
						        	  applet: upsertApplet, 
						        	  bo:"Party",
						        	  bc:"Party",
						              templateHTML : 'StdForm',
						              parentView : this,
						              showConfirmOnSave:false,
						              showViewBar:false,
						              //refreshFunctionStatic:"that.parentView.renderSectionSelector('#bannerMessage')"
						              refreshFunctionStatic:"rwApp.refreshTopView()"
						        });
    	readView.model = listModel;
    	readView.editRecord(upsertApplet);
    },
    upsertBanner: function(event){
    
    	
    	var clickRoute  = "home";
		var privCheck = {routeName:clickRoute,record:this.model,privilege:"upsertBanner"}
		if ($.hasAccess(privCheck)) {
    	
		    	var hasRecord = ($.hasVal(this.BannerForm.model))?true:false;
		
			    	var upsertApplet = "BannerForm";
			    	var that = this; 
			    	var readView = new ReferralWireView.FormView({
						        	  applet: upsertApplet, 
						              templateHTML : 'StdForm',
						              parentView : this,
						              showConfirmOnSave:false,
						              showViewBar:false,
						              //refreshFunctionStatic:"that.parentView.renderSectionSelector('#bannerMessage')"
						              refreshFunctionStatic:"rwApp.refreshTopView()"
						        });
					
			 	
				if (hasRecord){
				    this.BannerForm.model.options.bo = this.BannerForm.bo;
				    this.BannerForm.model.options.bc = this.BannerForm.bc;
				    readView.model = this.BannerForm.model;
					readView.editRecord(upsertApplet);
				} else {
				     readView.setDefaultModel();
				     readView.model.bo = readView.bo;
				     readView.model.bc = readView.bc;
				     //readView.model.set(defaultMap);			      
					 readView.editRecord(upsertApplet);
				} 
		}
		
    
    },
    
    renderSectionSelector: function(selector){
    	var section = $(selector);
    	this.renderSection(section);
    },
      
    renderSection: function(section) {
      //section.html("");
      var appletName = section.attr('applet');
      var progressiveRender = ($.hasVal(section.attr("progressiveRender")))?true:false;
      var templateName = section.attr('template');
      var rendererClass = section.attr('renderer');
      var modelClass = section.attr('model');
      var sortBy = section.attr('sortBy');
      var sortDir = section.attr('sortDir');
      var bobc = section.attr('bobc');
      var limit = section.attr('limit');
      var numRecords = ($.hasVal(section.attr('numRecords')))?section.attr('numRecords'):"many";
	    var act = section.attr('act');
  		var options = new Object();
		options.applet = 'appletName';
		options.template = "template";
		
		if ( !_.isUndefined(section.attr('options'))) {
			var rendererOptAry = section.attr('options').split(",");
			
			for(var i=0; i<rendererOptAry.length; i++){
				var optPair = rendererOptAry[i];
				var keyVal = optPair.split("=");
				var key = keyVal[0];
				var val = keyVal[1];
				options[key]=val;
			}
		}

      if ( !_.isUndefined(appletName)) {

        if(templateName.indexOf(".")>0){ //if template name is a function, then evaluate with a null model
        	
    		var template = templateName;
        } else {
	        var template = templateName;
		}

		var optString = JSON.stringify(options);
		var re = new RegExp('\"',"g");
		optString = optString.replace(re,"");
		//if ($.hasVal(appletName)){optString = optString.replace("appletName",appletName);}
        var view = eval("new Backbone.ReferralWireView."+ rendererClass + "(" + optString + ")");
        if ($.hasVal(template)){view.templateHTML = template;view.template = template}
        view.parentView = this;
  
        switch( modelClass ) {
        case "self":
          section.html(view.render(this.model).el).trigger('create');
          break;
        default:
          var dataOptionsStr = "new Backbone.rwcore." + modelClass + "({module : view.actor, bo:view.bo,bc:view.bc,searchSpec: view.searchSpec";
	  		if (!_.isUndefined(sortBy)) {
				dataOptionsStr += ", sortby : '" + sortBy +"', sortOrder : '" + sortDir + "'";
	  		}
	  		
	  		if (!_.isUndefined(limit)) {
				dataOptionsStr +=  ", limit :'" + limit + "'" ;
        	}
        	
        	//dataOptionsStr += ", bo : '" + view.bo +"', bc : '" + view.bc + "'";
	 
        if (!_.isUndefined(act)) {
           dataOptionsStr +=  ", act :'" + act + "'" ;
        }
    		
	  		dataOptionsStr += "})";

          //var data = eval("new ReferralWire." + modelClass + "({module : view.actor})");
        	var data = eval(dataOptionsStr);

          data.fetch( { 
            add : true,
            error: function (request,status,error) {
              var errorDiv = new rwcore.ErrorView({request : request,status : status, error : error});  
              errorDiv.render(status.responseText);
            },
            success : function (model, response, jqXHR) {
                // render
              
              if (numRecords == "one"){model = model.models[0]}  
             
             if (progressiveRender){
             	model.renderTo = section;
             	view.render(model);
             } else {
              
              section.html(view.render(model).el).trigger('create');
             }
              
              
              view.parentView[appletName] = view; //save the instantiated applet view as a property of the parent so we can call methods on it later
            	  
            }
          });
        }
      }
    },
    
	refer:function(event){
	  	  
		  event.dView = null;
		  event.refWizard = rwApp.ContactRefWizard_phoneHomeRefWizard(),
		  event.parentView = this;
		  //var refreshFunctionStatic = "that.parentView.renderSection($('#referralInboxView'));that.parentView.renderSection($('#HomePageStats'));";
		  var refreshFunctionStatic = "rwApp.refreshTopView()"; 
		  //refreshFunction = "rwApp." + refreshFunction;
		  event.refreshFunctionStatic = refreshFunctionStatic;
	 	  //event.toPartyId = this.options.detailview.model.get("partnerId");
	 	  //event.toFullName = this.options.detailview.model.get("fullName");
	 	  rwApp.referCustToSelectedPartner(event);
		  
	},
	  
	inviteWizard:function(event){
		  
  		  event.dView = null;
		  event.refWizard = rwApp.InviteWizard,
		  event.parentView = this;
		  //var refreshFunctionStatic = "that.parentView.renderSection($('#referralInboxView'));that.parentView.renderSection($('#HomePageStats'));";
		  var refreshFunctionStatic = "rwApp.refreshTopView()"; 
		  //refreshFunction = "rwApp." + refreshFunction;
		  event.refreshFunctionStatic = refreshFunctionStatic;
	 	  //event.toPartyId = this.options.detailview.model.get("partnerId");
	 	  //event.toFullName = this.options.detailview.model.get("fullName");
	 	  rwApp.referCustToSelectedPartner(event);
		
	},
	  
	toggleNewFeed:function(event){
		
		var target = event.target;
        var tagName = $(target).get(0).nodeName.toLowerCase();
        var anchorId = $(target).attr('id');
        if (tagName != 'a'){
          var anchor = $(target).parents('a');
          anchorId = anchor.attr('id');
        }
		var appletName = $("#"+anchorId).attr("toggle");
		$(".newsFeedList").hide();
		var identifier = "#"+appletName
		//identifier = identifier.replace("Zapplet",appletName);
		$(identifier).show();
	},
	
	checkin:function(event){
		
		var target = event.target;
        var checkInButtonId = ($.hasVal($(event.target).attr("checkInButtonId")))?$(event.target).attr("checkInButtonId"):$(event.target).parents("[checkInButtonId]").attr("checkInButtonId");
		var model = this.MyUpcomingEvents.model.get(checkInButtonId);
		model.options.bo = this.MyUpcomingEvents.bo;
		model.options.bc = this.MyUpcomingEvents.bc;
		
		var options = {model:model,checkInButtonId:checkInButtonId,validateTimePlace:true};
   		var buttonId = options.checkInButtonId;
		rwApp.eventCheckIn(options);
	},

	gotoEvent :function(event){
		rwApp.navigate("#EventExpected/" + event.currentTarget.id, {trigger:true});	
	},
	
	addGuest:function(event){
	
		var target = event.target;
        var recordId = ($.hasVal($(event.target).attr("recordId")))?$(event.target).attr("recordId"):$(event.target).parents("[recordId]").attr("recordId");
		var model = this.MyUpcomingEvents.model.get(recordId);
	
		event.refWizard = rwApp.AddGuestSelfServiceWizard;
		event.eventId = model.get('eventId');
		event.newMemberSrc_partyId = model.get('partyId'); //should be the same as the logged in user
		event.OrgId = model.get('OrgId');
		event.guestType = 'NEW_MEMBER';
		event.newMemberSrc_fullName = model.get('fullName');
		rwApp.addGuest(event);
	
	},

  claimOrArchive:function(event){
    var dViewName = "ReferralNewsFeed";
    var listModel = this[dViewName].model;
    var selectedModelId = $(event.target).parents("[stateCell]").attr("stateCell");
    var selectedModel = listModel.get(selectedModelId);
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
    var dViewName = "ReferralNewsFeed";
    var listModel = this[dViewName].model;
    var selectedModelId = $(event.target).attr("actionRecord");
    var selectedModel = listModel.get(selectedModelId);
    selectedModel.set({protoStatus:"CONFIRMED"});
  
    var wizardSpec = rwApp.updateClaimedReferralWizard;
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

  updatedContactedStatus:function(event){
    var dViewName = "ReferralNewsFeed";
    var listModel = this[dViewName].model;
    var selectedModelId = $(event.target).attr("actionRecord");
    var selectedModel = listModel.get(selectedModelId);
    selectedModel.set({protoStatus:"CONVERTED"});
  
    var wizardSpec = rwApp.getUpdateContactedReferralWizard();
      var wizard = new ReferralWireView.WizardUpsertView ( { 
        firstApplet:wizardSpec.firstApplet,
        nextAppletFunctions:wizardSpec.nextAppletFunctions,
        refreshFunction: function(){this.parentView.renderSection($('#referralInboxView'))},
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

    
    updateField:function(event){
      
      var dViewName = "ReferralNewsFeed"; //this is the default
      var refreshFunction = "that.parentView.renderSection($('#referralInboxView'))";//;that.parentView.renderSection($('#referralStreamView'))
      var overRideViewName = $(event.target).attr('applet');
      
      if ($.hasVal(overRideViewName)){
      	dViewName = overRideViewName;
      	refreshFunction = $(event.target).attr('refreshFunction');
      	refreshFunction = "rwApp." + refreshFunction;
      }
       
      event.dView = this[dViewName];
  	  event.refreshFunction = refreshFunction;  		  
      rwApp.updateKeyField(event);
      //referralStream
    },
    
    render:function () {
      // Homepage is made up of bunch of sections.
      // All these sections are keyed off of the logged-in user id
      // navbar should look like /rw.jsp/#home 
      // Start rendering each section.
      $(this.el).html(_.template(this.params.template, {}));
      var sections = this.el.querySelectorAll("div [section]"); // Can we use some smart selector ?
      
      for ( var i = 0; i < sections.length; i++ ) {
        var sectionDiv = $(sections[i]);
        this.renderSection(sectionDiv);
        $(rwApp.params.modules[1]).show();
      }
      return this;
    }
      
  });
  
  return ReferralWire;    
     
  })(Backbone, _, $, ReferralWireRouter || window.jQuery || window.Zepto || window.ender);
  
  return Backbone.ReferralWire; 

}));
