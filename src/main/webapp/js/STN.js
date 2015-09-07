(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
    var rwcore = require('rwcore');
    var ReferralWireBase = require('ReferralWireBase');
    var ReferralWireView = require('ReferralWireView');
    var ReferralWirePattern = require('ReferralWirePattern');
    var ReferralWire = require('ReferralWireRouter');
    var ReferralWire = require('ReferralWirePhoneRouter');
    var ReferralWire = require('ReferralWire');

    module.exports = factory(jquery, underscore, backbone, rwcore,ReferralWireBase,ReferralWireView,ReferralWirePattern, ReferralWireRouter,ReferralWirePhoneRouter, ReferralWire );

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone', 'rwcore', 'ReferralWireBase','ReferralWireView','ReferralWirePattern', 'ReferralWireRouter', 'ReferralWirePhoneRouter', 'ReferralWire'], factory);

  } 
}(this, function ($, _, Backbone, ReferralWireRouter, ReferralWirePhoneRouter) {

  Backbone.ReferralWireSTN = ReferralWireSTN = (function($, _, Backbone ){
    var ReferralWireSTN = {} ; 
    
    ReferralWireSTN.showWelcomePage = function() {
    	var welcomePageTemplate = rwcore.getTemplate('/STN/Templates/Views/STN_welcomePage.html');
    	var hv = new rwcore.HelpView({msg: Backbone.ReferralWireBase.Templatecache.origTemplateFn(welcomePageTemplate)(), hide:'skip', title:'Welcome',id:"#WelcomePage",backgroundSelector:"#HomeModalBackground"});

		$.when(hv.render()).done( function(choice) {
			if (choice ) {
				var userdata = new rwcore.StandardModel({module:'UserMgr'});
				userdata.set({'id' : rwFB.uId});
				userdata.set({'welcomePage' : 'HIDE'});	
				userdata.save();
			}
		});
		return hv;
    };
    
    ReferralWireSTN.Router  = Backbone.ReferralWireRouter.extend({
        initialize: function(options) {
          // this is how you would create custom route for this module
          this.route('rw/test/:id', 'rwtest', this.rwTest);
          this.constructor.__super__.initialize.call(this,options);
          Backbone.ReferralWireBase.Templatecache.StdFormContactPartner = Backbone.rwcore.getTemplate('/STN/Templates/Forms/STN_StdFormContactPartner.html');
          //ReferralWireBase.Templatecache.HomePageTitleSummary = requirejs('text!/STN/Templates/Forms/STN_HomePageTitleSummary.html');

        },

        // this is the new route on this router
        STNBlah : function(id) {

          // this is the new way to get the template definition
          // You don't need to go thru template cache any more..
          // You can just reference the STN templates from any directory 
          // However, if a template is referenced frequently, you would then
          // want to put it in the templatecache so that it gets loaded only once.

          var ChapterHouseTemplate = Backbone.rwcore.getTemplate('/Templates/STN/STNStandardForm.html');
          alert(id);
        },
        
        
        
        		  	
      	home: function() {

	    	  var that = this;
			  var homeTemplate = Backbone.rwcore.getTemplate('/STN/Templates/Views/STN_HomePageView.html');
			  //var menu = ReferralWire.getTemplate('/STN/Templates/Other/STN_WebNavPanel.html');
			  //var homeTemplate = ReferralWireBase.Templatecache.STN_HomePageView;
		      var hpModel = new Backbone.ReferralWire.HomePageModel();
		      hpModel.fetch({
		          error : Backbone.rwcore.showError, 
		          success : function (model, response, jqXHR) {

		              var homeview = new Backbone.ReferralWire.HomePageView ({model: model, template: homeTemplate});    
		              rwFB.uId = model.get('id');
		        	  rwFB.OrgId = model.get('OrgId');
		        	  rwFB.emailAddress = model.get('emailAddress');
		        	  rwFB.isSpeaker = model.get('isSpeaker');
		        	  rwFB.isAmbassador = model.get('isAmbassador');
		              rwFB.iconDirectory = rwFB.CDN + "/STN/Images/";
		              //rwFB.postalCode = model.get('postalCodeAddress');
		              rwApp.zip = model.get('postalCodeAddress');
		              rwApp.welcomePage = model.get('welcomePage');              
		              //rwApp.tenant = "STN"
		              rwFB.HeaderName = "Successful Thinkers";
		              $(rwApp.params.modules[1]).html(homeview.render().el)//.trigger('create');
		              var client = $("#left-panel").attr("client");
		               
				 	  if ($.hasVal(client) && client == "web"){
				 	  		
				 	  		
				 	  		//$("#left-panel").html(ReferralWireBase.Templatecache.STN_WebNavPanel()).trigger("create");
				 	  		$("#left-panel").html(_.template('STN_WebNavPanel')).trigger("create");
				 	  		//$("[group]").hoverIntent(hoverToggleMenu);
				 	  		//$(".menuPull").hoverIntent(panelOpen);
				 	  }


				 	  if (!$.hasAccess({record:model,routeName:"home",privilege:"vspeaker"})){
		              	$("[route='#speakerList']").remove();
		              	$("#speakerList").remove();
		              }
		              if (!$.hasAccess({record:model,routeName:"home",privilege:"adminscreen"})){
		              	$("[route='#reports_admin']").remove();
		              }

	              
				 	  
				 	 if (rwFB.showWelComePage == 'SHOW') {
				 		 // TODO: Show welcome page	
				 		homeview.welcomeView = ReferralWireSTN.showWelcomePage();

				 		 //rwFB.showWelComePage = 'HIDE';
				 	  }

				 	  $.when(that.getNotifications()).done( function(items) { 
				 	  		$('#notifications').html(items);
				 	  });
					
				 	  $.when(facebookReady).done( function() {
				 	  			FB.XFBML.parse();
				 	  			
				 	  });

				 	  $.when(linkedInReady).done( function() {
				 	  			IN.parse();
				 	  });
				 	  $.when(googleplusReady).done( function() {
				 	  			gapi.plusone.go("'SocialBar'");
				 	  });
				 	  
				 	  $.when(twitterReady).done( function() {
					 	    twttr.widgets.load()
				 	  });

				 	  
					  // TODO : login into smash

		          }
		      });
		 },
		 
	   OrgListDetail : function(selectedId){
         
		       Backbone.ReferralWirePattern.GenericListDetailPattern ( {
		        listapplet : "OrganizationAppletList",
		        usePaging:true,
		        sortby : "businessName",
		        formapplet : "OrganizationAppletForm",
		        viewBarApplet : "OrgViewBar",
		        clickRoute : "OrgList",
		        selectedId : selectedId,
		        appletMenu: rwApp.getAppletMenu,
		        viewTitle:"Chapters",
		        viewTemplate:'STN_ChapterListDetailView',
		        //viewTemplate:'ChapterDisplayView',
		        listTemplate : 'ChapterList',
		      	formTemplate : 'ChapterHomeForm',
		      	inlineMap:true,
		      	upsertApplet:"OrganizationAppletForm",
		      	inlineClock:"meetingHour",
		      	secondTierNav:[{label:"Chapter Info",state:"selected",iconId:"ChapterHome_sm_sel",route:"",key:""},
		    	 					{label:"Map",state:"",iconId:"MapIcon_black",route:"OrgListMap",key:""}],
		    	savedSearch: {
                  searchGroup:"chapters",
                  actor:"OrgMgr",
                  bo:"Organization",
                  bc:"Organization",
                  searchAppletName:"OrgSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Chapter Search",
                  //dssName:dssName,
                  //dssModel:dssModel
        		},
        		editRefreshFunction: function(model,thisView){//$$
                            thisView.parentView.refreshInPlace(model);
                },
		      });
      
       
     },
		 


    });

    ReferralWireSTN.PhoneRouter  = Backbone.ReferralWirePhoneRouter.extend({
        initialize: function(options) {
          // this is how you would create custom route for this module
          this.route('rw/test/:id', 'rwtest', this.rwTest);
          this.constructor.__super__.initialize.call(this,options);
        },

        // This is how you override the base router route
        // home : function() { alert('test')},

        // this is the new route on this router
        rwTest : function(id) {

          // this is the new way to get the template definition
          // You don't need to go thru template cache any more..
          // You can just reference the STN templates from any directory 
          // However, if a template is referenced frequently, you would then
          // want to put it in the templatecache so that it gets loaded only once.

      
          alert(id);
        },
        
        home : function() {
			
			//alert($.hasVal(window.device) + " " + window.device.version == "7.0");
			
		  	    var lastView = ReferralWireView.ChildViewContainer.findByCustom("phoneView");
		        	
		        	var contentEL = "<div id='ContentSection' data-role='content' style='position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;min-height:initial'></div>";
        
		        	if (!_.isUndefined(lastView)  && typeof(lastView) == "object"){
		          		ReferralWireView.ChildViewContainer.remove (lastView);
		          		$("#ContentSectionOuter").html(contentEL);
		        	}


		  	
	        var that = this;
	        var hpModel = new Backbone.ReferralWire.HomePageModel();
	        var that = this;
	        var homeTemplate = Backbone.rwcore.getTemplate('/STN/Templates/Phone/STN_phonehome.html');
	        //var menuTemplate = ReferralWire.getTemplate('Templates/phone/PhoneNavPanel.html');
	        
	        $.getOS();

	        hpModel.fetch({
	          error : Backbone.rwcore.showError, 
	          success : function (model, response, jqXHR) {
	        	    rwFB.uId = model.get('id');
	        	    rwFB.OrgId = model.get('OrgId');
	        	    rwFB.emailAddress = model.get('emailAddress');
	        	    rwFB.isSpeaker = model.get('isSpeaker');
	        	    rwFB.isAmbassador = model.get('isAmbassador');
	        	    rwFB.fullName = model.get('fullName');
	        	    rwFB.business = model.get('business');
	        	    rwFB.jobTitle = model.get('jobTitle');
	        	    var pagingSize = 10;
	        	    ReferralWire.pagingSize = pagingSize;
	        	    ReferralWireView.pagingSize = pagingSize;
	        	    ReferralWirePattern.pagingSize = pagingSize;
	        	    rwcore.pagingSize = pagingSize;
	        	    //rwApp.profileModel = model;
	                //that.StartGeoLocationTracking(rwApp.uId);
					rwFB.HeaderName = "Successful Thinkers";
          	        rwApp.zip = model.get('postalCodeAddress');
	                var homeview = new Backbone.ReferralWire.HomePageView ({model: model, template: homeTemplate});    
		            $('#backBtn').hide(10);
		            $("#loginBackdrop").hide();
		            //$("#frame").html(homeview.render().el).trigger('create');
		            $("#ContentSection").html(homeview.render().el).trigger('create');
		            //that.loadPhonePage(homeview);
		            $("#title").html(rwFB.HeaderName);
		            var homeMenu = [
							{	id:"homeMenu",
								route:"#home",
								label:"Home",
								iconSrc:"homeIconSmall.png",},
							{	id:"peopleGroup",
								label:"My Address Book",
								route:"#contacts",
								iconSrc:"contactCardsSmall.png"},
							{	id:"members",
								route:"#membersalt",
								iconSrc:"allMembers.png",
								label:"All Members"},
							{	id:"profile",
								route:"#phoneMemberQualifications/" + rwFB.uId,
								iconSrc:"myProfileWhite.png",
								label:"My Profile"},
							{	id:"nearMe",
								route:"#nearMeAlt",
								label:"Members Near Me",
								iconSrc:"nearMeIconWhite.png"},
							{	id:"chaptersMenu",
								route:"#phoneOrgList",
								label:"Chapters",
								iconSrc:"chaptersWhite.png"},
							{	id:"upcomingevents",
								route:"#phoneUpcomingEvents",
								label:"Nearby Events",
								iconSrc:"calendarSmall.png"},
							/*{	id:"mychapterevents",
								route:"#phoneOrgEvents/" + rwFB.OrgId,
								label:"My Chapter Events",
								iconSrc:"mychapterevents.png"},*/
							{	id:"logoffMenu",
								route:"#signout",
								label:"Log out",
								iconSrc:"logoff.png"},
							]
					var homeMenuHTML = _.template('PhoneNavPanel',{model:model,menuNav:homeMenu});
		            
		        
		            
		            $("#left-panel").html(homeMenuHTML);

		            ReferralWireView.ChildViewContainer.add(homeview,"phoneView");
                 	
                 	$("#singlePageWeb").addClass("GPS-active");
		            that.StartGeoLocationTracking( {partyId: rwFB.uId, track: true, 
	            			success: function (position) {
								//$("#singlePageWeb").addClass("GPS-active");
	            			},
	            			error: function(error) {
	            				//$("#singlePageWeb").removeClass("GPS-active");
	            			}
	            	});
		            
	            }
	        });
	    
	    },

    });

    return ReferralWireSTN;   
  })($, _, Backbone || window.jQuery || window.Zepto || window.ender);
  return Backbone.ReferralWireSTN; 
}));
