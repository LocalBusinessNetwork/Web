

(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
    var ReferralWireRouterBase = require('ReferralWireRouterBase');
 
    module.exports = factory(jquery, underscore, backbone, ReferralWireRouterBase);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone', 'ReferralWireRouterBase'], factory);

  } 
  
}(this, function ($, _, Backbone, ReferralWireRouterBase) {

  Backbone.ReferralWireRouter = ReferralWireRouter = (function(Backbone, _, $, ReferralWireRouterBase){

  var slice = Array.prototype.slice;

  var rct = {
    home : "home",
    profile : "Profile",
    public_profile : "PublicProfile",
    prospectVals : "prospectVals",
    contactList : "ContactListDetail",
    MemberListDetail : "MemberListDetail",
    MemberListDetailDemo : "MemberListDetailDemo",
    MemberListDetailAdmin : "MemberListDetailAdmin",

  };

  var ReferralWireRouter  = ReferralWireRouterBase.extend({
    routes: {
        "home" : rct.home,
        "Profile": rct.profile,
        "Profile/:profileId" : rct.profile,
        "PublicProfile": rct.public_profile,
        "PublicProfile/:profileId" : rct.public_profile,
        "prospectVals/:partnerId": rct.prospectVals,
        "contactList" : rct.contactList,
        "contactList/:contactId" : rct.contactList,
        "memberList" : rct.MemberListDetail,
        "memberList/:PartnerId" : rct.MemberListDetail,
        "PowerPartnerCenter" : "PowerPartnerCenter",
        "PowerPartnerCenter/:id" : "PowerPartnerCenter",
        "PowerPartnerCenterByPro" : "PowerPartnerCenterByPro",
        "PowerPartnerCenterByPro/:id" : "PowerPartnerCenterByPro",
        "memberListDemo" : rct.MemberListDetailDemo,
        "memberListDemo/:PartnerId" : rct.MemberListDetailDemo,
        "memberListAdmin" : rct.MemberListDetailAdmin,
        "memberListAdmin/:PartnerId" : rct.MemberListDetailAdmin,
        "partnerList" : "PartnerListDetail",
        "partnerList/:PartnerId" : "PartnerListDetail",
        "partnerListDrill/:partyId":"PartnerListDrill",
        "partnerStats" : "partnerStats",
        "partnerStats/:PartnerId" : "partnerStats",
        "partnerProfile/:PartnerId" : "PartnerSocial",
        "memberProfile/:PartnerId" : "MemberSocial",
        "memberPhotos/:PartnerId" : "MemberPhotos",
        "MemberOnlineInvites/:PartnerId":"MemberOnlineInvites",
        "MemberGuestInvites/:PartnerId":"MemberGuestInvites",
        "MemberMap/:PartnerId" : "MemberMap",
        "PartnerMap/:PartnerId" : "PartnerMap",
        "BusinessDirectorySearch":"BusinessDirectorySearch",
        "BusinessDirectorySearch/:keyword/:zipCode":"BusinessDirectorySearch",
        "BusinessDirectorySearch/:id/:category/:keyword/:zipCode":"BusinessDirectorySearch",
        "BusinessDirectoryMap":"BusinessDirectoryMap",
        "BusinessDirectoryMap/:id":"BusinessDirectoryMap",
        "BusinessDirectoryMap/:id/:category/:keyword/:zipCode":"BusinessDirectoryMap",
        "BusinessDirectoryDetails":"BusinessDirectoryDetails",
        "BusinessDirectoryDetails/:id":"BusinessDirectoryDetails",
        "BusinessDirectoryDetails/:id/:category/:keyword/:zipCode":"BusinessDirectoryDetails",
        "speakerList" : "speakerList",
        "speakerList/:id" : "speakerList",
        "speakerMap" : "speakerMap",
        "speakerEngagements/:id" : "speakerEngagements",
        "speakerReport" : "speakerReport",
        "speakerReport/:id" : "speakerReport",
        "speakerRatingReport":"speakerRatingReport",
        "speakerRatingReport/:id":"speakerRatingReport",
        "partnerPhotos":"PartnerPhotos",
        "partnerPhotos/:PartnerId":"PartnerPhotos",
        "partnerTestimonials":"PartnerTestimonials",
        "partnerTestimonials/:PartnerId":"PartnerTestimonials",
        "partnerReferrals":"PartnerReferrals",
        "partnerReferrals/:PartnerId":"PartnerReferrals",
        "partnerRecommendations/:PartnerId":"PartnerRecommendations",
        "powerRecommendations/:PartnerId":"PowerPartnerRecommendations",
        "resourceRecommendations/:PartnerId":"ResourceRecommendations",
        "OrgList" : "OrgListDetail",
        "OrgList/:OrgId" : "OrgListDetail",
        "OrgListMap" : "OrgListMap", 
        "OrgMembers/:OrgId" : "OrgMembers",
        "OrgPhotos/:id" : "OrgPhotos",
        "OrgEvents/:id":"OrgEvents",
        "OrgDashboard/:id":"OrgDashboard",
        "OrgDashReferrals/:id":"OrgDashReferrals",
        "OrgDashGuests/:id":"OrgDashGuests",
        "OrgDashProspectRef/:id":"OrgDashProspectRef",
        "AllUpcomingEvents":"AllUpcomingEvents",
        "AllUpcomingEvents/:id":"AllUpcomingEvents",
        "MyEvents":"MyEvents",
        "MyEvents/:id":"MyEvents",
        "EventExpected/:id":"EventExpected",
        "EventCheckedIn/:id":"EventCheckedIn",
        "EventGuests/:id":"EventGuests",
        "AssocList" : "AssocListDetail",
        "AssocList/:AssocId" : "AssocListDetail",
        "offers" : "ReferralOffersList",
        "offers/:id" : "ReferralOffersList",
        "contactReferrals/:contactId" : "ContactReferrals",
        "referralLBMyProf":"referralLBMyProf",
        "referralLBMyProf/:id":"referralLBMyProf",
        "referralLBMyPowerPartners":"referralLBMyPowerPartners",
        "referralLBMyPowerPartners/:id":"referralLBMyPowerPartners",
        "referralLeaderBoardMade":"referralLeaderBoardMade",
        "referralLeaderBoardConverted":"referralLeaderBoardConverted",
        "referralLeaderBoardInvited":"referralLeaderBoardInvited",
        "referralLeaderBoardGuests":"referralLeaderBoardGuests",
        "referralInbox" : "ReferralInbox",
        "referralInbox/:selectedId" : "ReferralInbox",
        "ReferralInboxConnections" : "ReferralInboxConnections",
        "referralProspect/:selectedId":"ReferralProspect",
        "referralOutbox" : "ReferralOutbox",
        "ReferralOutboxConnections" : "ReferralOutboxConnections",
        "referralOutbox/:selectedId" : "ReferralOutbox",
        "referralArchive" : "ReferralArchive",
        "referralArchive/:selectedId" : "ReferralArchive",
        "requestReferrals" : "RequestReferrals",
        "requestReferrals/:id": "RequestReferrals",
        "recedeReferrals" : "RecedeReferrals",
        "recedeReferrals/:id" : "RecedeReferrals",
        "MostPRefInChapterDrill/:id":"MostPRefInChapterDrill",
        "importContacts/:id" : "importContacts",
        "showError": "showError",
        "help/:page" : "help",
        "profileSocial/:id":"profileSocial",
        "speakerBio/:id":"speakerBio",
        "profileSocial":"profileSocial",
        "profilePhotos":"profilePhotos",
        "profileTarget":"profileTarget",
        "profileTarget/:id":"profileTarget",
        "profilePhotos/:id":"profilePhotos",
        "profileTestimonials":"profileTestimonials",
        "profileTestimonials/:id":"profileTestimonials",
        "myRecommendations":"myProspectRecs",
        "myRecommendations/:id":"myProspectRecs",
        "targetAnalysis/:id":"myTargetAnalysis",
        "stats":"stats",
        "stats/:id":"stats",
        "enrichResults/:id":"enrichedRecords",
        "incompleteRecords/:id":"incompleteRecords",
        "preferences":"preferences",
        "preferences/:id":"preferences",
        "Pay":"Paypaldialog",
        "signout": "signout",
        "billing/:id" : "billingMD",
        "receipts/:id" : "receiptsMD",
        "lookupPartnerProfile/:partyId":"lookupPartnerProfile",
        "lookupContactProfile/:partyId":"lookupContactProfile",
        "lookupPartnerProfile/:partyId/:partyType":"lookupPartnerProfile_P2P",
        "passwordReset" : "passwordReset",
        "password/:id" : "passwordChange",
        "paypalSetup/:id" : "paypalIdChange",
        "facebook" : "facebook",
        "facebook/:id" : "facebook",
        "invite_linkedin/:id" : "invite_linkedin",
        "invite_linkedin" : "invite_linkedin",
        "professionList":"professionList",
        "professionList/:id":"professionList",
        "professionTarget/:id":"professionTarget",
        "professionRefReason/:id":"professionRefReason",
        "infoConnectList":"infoConnectList",
        "infoConnectList/:id":"infoConnectList",
        "infoConCriteria/:id":"infoConCriteria",
        "infoConParty/:id":"infoConParty",
        "criteriaList":"criteriaList",
        "criteriaList/:id":"criteriaList",
        "criteriaRefReason/:id":"criteriaRefReason",
        "criteriaInfoConnect/:id":"criteriaInfoConnect",
        "criteriaCategories/id":"criteriaCategories",
        "PowerPartners/:id":"PowerPartners",
        "BusinessList":"BusinessListDetail",
        "BusinessList/:id":"BusinessListDetail",
        "awardList":"awardList",
        "awardList/:id":"awardList",
        "metricList_admin":"metricList_admin",
        "metricList_admin/:id":"metricList_admin",
        "emailTemplateList_admin":"emailTemplateList_admin",
        "emailTemplateList_admin/:id":"emailTemplateList_admin",
        "imageList_admin":"imageList_admin",
        "imageList_admin/:id":"imageList_admin",
        "reports_admin":"reports_admin",
        "reports_admin/:id":"reports_admin",
        "listadmin":"listadmin",
        "listadmin(/:type)(/:id)":"listadmin",
        "accountadmin(/:id)":"accountadmin",
        "tenant(/:id)":"tenant",
        "*actions": "defaultRoute"
    },
    
    home: function() {
      var that = this;
      var hpModel = new ReferralWire.HomePageModel();
      rwcore.spinOn();
   
      hpModel.fetch({
          error : function () { rwcore.spinOff(); window.location = '/login.jsp';}, 
          success : function (model, response, jqXHR) {
              var homeview = new ReferralWire.HomePageView ({model: model, template: 'home'});    
              rwApp.uId = model.get('id');
              rwApp.zip = model.get('postalCodeAddress');
              rwFB.iconDirectory = rwFB.CDN + "/images/icons/";
              rwFB.HeaderName = "ReferralWire";
              $.renderGaugeChart("givenGauge",model.get('LastTwoWeeksReferralsSent'));////LastTwoWeeksReferralsSent
              $.renderGaugeChart("receivedGauge",model.get('LastTwoWeeksReferralsRcvd'));////LastTwoWeeksReferralsRcvd
              
              var client = $("#left-panel").attr("client"); 
        
              if ($.hasVal(client) && client == "web"){

                  $("#left-panel").html(_.template('WebNavPanel')()).trigger("create");
                  $("[group]").hoverIntent(hoverToggleMenu);
                  $(".menuPull").hoverIntent(panelOpen);
              }
              rwcore.spinOff();
   
          }
      });
    },

    
    
    importContacts: function (parentId) {
      var cview = new ReferralWireView.PopupView ({template: 'ImpConTemplate'});
      $('#PopupContainer').html(cview.render().el).trigger('create');
      $("#pickBackground").show(50);
      $("#PopupContainer").show(50);
    },
    

    
    printProfile: function(fullName){
      var printableContent = document.getElementById("printcontent").outerHTML;
    var windowTitle = '<html><head><title>ZName ReferralWire Profile</title>';
    windowTitle = windowTitle.replace('ZName',fullName);

      var mywindow = window.open('', 'printPage', 'height=1400,width=685');
      mywindow.document.write(windowTitle);
      mywindow.document.write('<link rel="stylesheet" href="/style/jquery.mobile120.min.css" type="text/css" />');
      mywindow.document.write('<link rel="stylesheet" href="/style/ss_style.css" type="text/css" />');
      

      mywindow.document.write('</head><body style="font-family: Helvetica, Arial, sans-serif;">');
      mywindow.document.write(printableContent);
      mywindow.document.write('</body></html>');


    },
    
  
    sharePartnerInfo:function(options){
      var model = options.model;
      
      var sendTo = ($.hasVal(options.sendTo))?options.sendTo:"";
    var spaceChar = "%20";
      var fullName = model.get('fullName_pub');
      var bizTitle = $.getPosition(model.get('jobTitle_pub'),model.get('business_pub'));
      var intro = model.get('bio');
      var email = model.get('emailAddress_pub');
      var work = model.get('workPhone_pub');
      var mobile = model.get('mobilePhone_pub');
    
    var body =  fullName + "%0D%0A";
    body += bizTitle + "%0D%0A %0D%0A";
    body += ($.hasVal(intro))?encodeURI(intro) + "%0D%0A %0D%0A":"";
    body += ($.hasVal(email))?email + "%0D%0A":"";
    body += ($.hasVal(work))?work + " (work) %0D%0A":"";
    body += ($.hasVal(mobile))?mobile + " (mobile)":"";
  
    var subject = "Contact Information for " + fullName + (($.hasVal(bizTitle))?": " + bizTitle:"")
    var templ = "mailto:ZSendTo?subject=ZSubject&body=ZBody"
    templ = templ.replace("ZSendTo",sendTo);
    templ = templ.replace("ZSubject",subject);
    templ = templ.replace("ZBody",body);
    templ = templ.replace(" ",spaceChar);
      
    window.location.href = templ;
      
    },    
    
    
    //encodeURI()
    
    removeEmptyFields: function(){
      
        $(".remove").remove(); 
        $("ul.formfields li:last-child").addClass("ui-corner-bottom");
        $("ul.formfields li:last-child").addClass("ui-li-last");
        $("ul.formfields li:first-child").addClass("ui-first-child");
        $("div.cPanel.std:not(:has(li))").remove();
    },
    
    addAdvancedSearch: function(){
      alert('add advancedSearch')
    /*
      var matchSummary = $(_.template('Snippets')()).find("#advancedSearchIconSnippet").html();
      $(".listViewListContainer").addClass("advancedSearch");
      $(".listViewListContainer").append(matchSummary);
     */ 
      
    },
    
    
  
  getAddrHistoryViewBarApplet:function(model){
    var retVal = "ContactHistoryViewBar";
    if ($.hasVal(model)){
          var type = model.get("type");
          //var pType = model.get("partytype");
          //if (pType == "PARTNER"){
          if (type == "REFERRAL_PARTNER"){
          retVal = "PartnerReferralsViewBar";
        }
        }
        return retVal;
  },
  getAddrViewBarTemplate:function(model){
    
    var retVal = 'ActionBarTemplate';
    if ($.hasVal(model)){
          var type = model.get("type");
          if (type == "REFERRAL_CONTACT"){
          retVal = 'ContactActionBarTemplate';
        }
        }
        return retVal;
    
  },
  /*
  getContactProfessionalTemplate:function(model){
    var retVal = ReferralWire.Templatecache.StdFormContact;
    if ($.hasVal(model)){
          var type = model.get("type");
          var pType = model.get("partytype");
          if (pType == "PARTNER"){
          //if (type == "REFERRAL_PARTNER"){
          retVal = ReferralWire.Templatecache.StdFormContactPartner;
        }
        }
        return retVal;
  },
  */

  getEventsList:function(model){
      var retVal = "UpcomingEventListFuture";
      var clickRoute  = model.clickRoute;
        
      var privCheck = {routeName:clickRoute,record:model}
      privCheck.privilege = "add"; //rules are same for seeing all events as adding a new event
          if ($.hasAccess(privCheck)){
            retVal = "EventList"
       }
      return retVal;
  },
  
  getAppletMenu:function(model){
    var appletMenu = "EmptyMenu";
    if (!_.isUndefined(model)){
        var clickRoute  = model.clickRoute;
        
        var privCheck = {routeName:clickRoute,record:model}
        
        if (_.contains(['memberList','memberProfile','memberListDemo'],clickRoute)){  
          privCheck.privilege = "editFull";
          if ($.hasAccess(privCheck)) {
            appletMenu = "EditMemberRoleMenu";
          }else {
            privCheck.privilege = "designateAmbassador";
            if ($.hasAccess(privCheck)){
              appletMenu = "DesignateAmbassadorMenu";
            }
          } 
        }
        if (_.contains(['memberListAdmin'],clickRoute)){  
          privCheck.privilege = "editFull";
          if ($.hasAccess(privCheck)) {
            appletMenu = "ProfilePubMenu";
          }
        }
          
         
         if (clickRoute == 'OrgList'){
          privCheck.privilege = "editFull";
          if ($.hasAccess(privCheck)){
            appletMenu = "OrgListAppletMenu";
          } else {
            privCheck.privilege = "edit";
            if ($.hasAccess(privCheck)){
              appletMenu = "OrgListEditMenu"
            }
          }
         }
         
         if (clickRoute == 'OrgPhotos'){
          privCheck.privilege = "edit";
          if ($.hasAccess(privCheck)){
              appletMenu = "OrgListEditMenu"
          }
         }
         
         if (clickRoute == 'OrgEvents'){
          privCheck.privilege = "add";
          if ($.hasAccess(privCheck)){
            appletMenu = "OrgEventsMenu";
          }
         }
         
         if (_.contains(["EventExpected","EventCheckedIn","EventGuests"],clickRoute)){
          privCheck.privilege = "editFull";
          if ($.hasAccess(privCheck)){
            appletMenu = "EventFullEditMenu" 
          } else {
            privCheck.privilege = "addGuest";
            if ($.hasAccess(privCheck)){
              appletMenu = "EventAddGuestMenu"
            } 
          } 
          
         }
         
         if (clickRoute == "speakerBio"){
          privCheck.privilege = "edit";
          if ($.hasAccess(privCheck)){
            appletMenu = "ProfileMenu";
          }
         }
         if (clickRoute == "BusinessDirectoryDetails"){
            var bizId = model.get('id');
            var employerId = rwFB.employerId;
            if (bizId == employerId || rwFB.emailAddress == "admin.user@referralwire.com"){
              appletMenu = "ProfileMenu";
            }
         }
    }
    
    return appletMenu;
  },
  
  

  
  

  
  criteriaAssociationMap:{ //describes how LOV values should be copied into Criteria during an association gesture.  Property
  //names correspond to destination fields -- i.e., the 'to' fields.  Property values referrence the source attributes into which
  // the former should be copied
    GlobalVal:"GlobalVal",
    name:"DisplayVal",
    DisplaySeq:"DisplaySeq",
    category:"Group"
  },
  
  professionCriteriaAssociationMap:{ //describes how LOV values should be copied into Criteria during an association gesture.  Property
  //names correspond to destination fields -- i.e., the 'to' fields.  Property values referrence the source attributes into which
  // the former should be copied
    child_GlobalVal:"GlobalVal",
    child_DisplayVal:"DisplayVal",
    child_DisplaySeq:"DisplaySeq",
    child_LovType:"LovType",
    childId:"id",
    child_Group:"Group"
    //name:"DisplayVal",
    //DisplaySeq:"DisplaySeq",
    //category:"Group"
  },
  
  
  
  refreshContactAfterInsert:function(model){
      
      var contactPartyId = model.get("id");
      
      var route = "lookupContactProfile" + "/" + contactPartyId;
      var currentRoute = Backbone.history.fragment;
      if (currentRoute == route){
        Backbone.history.fragment = null;
      }
      rwApp.navigate(route,{trigger: true,replace: true});
  },
    
    refreshEventInvite:function(){
      alert('refresh');
    },
    
    
    
    /*
    updateKeyField:function (event) {
      //alert('updateKeyField');
      //this function was created to support buttons that change a referral status. 
      //It takes parameters on which fields are updated by button click and what values they should be set to
      //passed from an html tag with confirmTemplate, setFields and setVals attributes. See ReferralMenuTemplate for example
    
    if (!_.isUndefined(event.target)){      
          var target = ($.hasVal($(event.target).attr("confirmtemplate")))?event.target:$(event.target).parents("[confirmtemplate]");
          var confirmTemplate = $(target).attr("confirmtemplate");
          
          var confirmTemplate = ($.hasVal(event.confirmtemplate))?event.confirmtemplate:$(target).attr("confirmtemplate");
          var setFields = $(target).attr("setfieldlist");
          var setVals = $(target).attr("setvallist");
          var actionRecordId = $(target).attr("actionRecord");
          var refreshList = $(target).attr("refreshlist");
      } else {
        var confirmTemplate = event.confirmTemplate;
        var setFields = event.setFields;
        var setVals = event.setVals;
        var actionRecordId = event.actionRecordId;
        var refreshList = event.refreshlist;
      }
        var setFieldAry = setFields.split(",");
        var setValAry = setVals.split(",");
        
        
         
        
      var popUpContainer = $("#PopupContainer");
      popUpContainer.html(_.template(confirmTemplate)());
      popUpContainer.addClass("confirmation");
      $(".overlay-background").show();
      popUpContainer.show();
      var that = event.dView; //this applet instance holds the model to be updated -- and in some cases is the focus of refresh
      var thatModel = null;
    
      if ($.hasVal(that))
         thatModel = (that.model.hasOwnProperty('models') && $.hasVal(actionRecordId))?that.model.get(actionRecordId):that.model;
        
         thatModel.options.bo = that.bo;
         thatModel.options.bc = that.bc;

      var selectedId = ($.hasVal(thatModel))?thatModel.get('id'):null;
      
      popUpContainer.delegate("[confirmevent]", "click", function(pEvent) {
          pEvent.popUpContainer = popUpContainer;
          pEvent.thatModel = thatModel;
          pEvent.event = event;
          rwApp.confirmationDialogResponse(pEvent);
      //return false;
            
            
      });
        
   },
    
   
  confirmationDialogResponse:function(pEvent){

            var popUpContainer = pEvent.popUpContainer;
            var pTarget = pEvent.target;
            var thatModel = pEvent.thatModel;
            var event = pEvent.event;
        
            popUpContainer.undelegate("[confirmevent]", "click"); //if we don't undelegate THEN after 3 invocations a single click will trigger the event handler 3 times
            
            var action = $(pTarget).attr('confirmevent');
            if (action == 'save'){
                
                // var lViewModel = lview.model.get(options.selectedId);
          
                  for (i=0;i<setFieldAry.length;i++){

                    thatModel.set(setFieldAry[i],setValAry[i]);
                    if (setFieldAry[i] == "OrgId"){rwFB.OrgId = setValAry[i]};
                  } 
                
              
              
                  thatModel.save({}, {
                    success : function (model, response, jqXHR) {
                    popUpContainer.hide();
                    popUpContainer.removeClass("confirmation");
                    
                    $(".overlay-background").hide();
                    
                    eval(event.refreshFunction);
                                
                      },
                      error : function(request,status,error) {
                        if ( !_.isUndefined(that.error)) {
                          that.error(request,status,error);
                        }
                      },
                      done : function(model, response, jqXHR) {
                        
                      }
                  });
            }
            if (action == 'cancel'){
                popUpContainer.hide();
                $(".overlay-background").hide();
                popUpContainer.removeClass("confirmation");
            }
            
            if (action == 'delete'){
            

              thatModel.destroy({
                  success:function () {
                    popUpContainer.hide();
                
                    $(".overlay-background").hide();
                    popUpContainer.removeClass("confirmation");
                    eval(event.refreshFunction);
                  }
              });
            //window.rwApp.refresh();
              return false;
            }
            
            if (action == 'importPhoneContacts'){
              popUpContainer.html(_.template('ImportProgress')());
              $(".ui-loader").find("H1").html("loading...");
              $.mobile.loading('show');
              rwApp.getPhoneContacts({
                success: function(data){
                  ReferralWireBase.ExportContactsToServer(data)
                    .done( function (response) { 
                      $.mobile.loading('hide');
                      alert(response.Imported + " records imported in " + response.time + " milli secords"); 
                      popUpContainer.hide();                  
                      $(".overlay-background").hide();
                      Backbone.history.fragment = null;
                      eval(event.refreshFunction);
                    });
                } 
              });
            }//close if action == 'importPhoneContacts'

            if (action == 'confirmPayPal'){
                  var data = new rwcore.StandardModel({module:'UserMgr'});
                
                  data.set({billing_day : event.billing_day});
                  data.set({paypalId : event.paypalId});
                
                  data.call("setupPaypal", data,
                     {  add : true, error : rwcore.showError,
                        success : function (model, response, jqXHR) {
                          rwcore.FYI("Paypal Id Saved");
                              popUpContainer.hide();
              
                              $(".overlay-background").hide();
                              eval(event.refreshFunction);
                        }   
                  });
                  

            }//close if action == 'confirmPayPal'
           
        
            if (action == 'EnrichAll'){
                ReferralWireBase.enrichParty(event);
                popUpContainer.hide();
                $(".overlay-background").hide();
            }   //close if action == 'Enrich All'
  },
   */
   
  updateKeyFieldSilent:function (options) {
      var actionRecordId = options.actionRecordId;
    var that = options.dview; //this applet instance holds the model to be updated -- and in some cases is the focus of refresh
    var thatModel = (that.model.hasOwnProperty('models'))?that.model.get(actionRecordId):that.model;
    var selectedId = thatModel.get('id');
    var refreshFunction = (options.hasOwnProperty('refreshFunction'))?options.refreshFunction:"";

          // var lViewModel = lview.model.get(options.selectedId);
    
      for (item in options.setFieldMap){

        thatModel.set(item,options.setFieldMap[item]);
      }   
      thatModel.save({}, {
        success : function (model, response, jqXHR) {
        if ($.hasVal(refreshFunction))
          refreshFunction();
              
        },
        error : function(request,status,error) {
          if ( !_.isUndefined(that.error)) {
            that.error(request,status,error);
          }
        },
        done : function(model, response, jqXHR) {
          
        }
    });
      
   },

 


   
   SaveCriteria : function (options){
      
      var model = options.model;
      var currentAppletView = options.currentAppletView;
      var partyId = options.parentView.options.masterview.model.id;
      model.query.act = "associate";
      model.query.partyId = partyId;
      model.query.partyRelation = "TARGET";
      var jsonModel = model.toJSON();
      model.query.data = jsonModel;
      
      

      
      model.dataout = {data:JSON.stringify(model.query)};
      
        model.sync("associate",model,{
        success:function(model, textStatus, jqXHR){
          
          currentAppletView.cancelUpdate(); // will hide upsert wizard
        },
        error: rwcore.showError
      })
   
   },
   
   SaveGenericAssociation : function (options){
      
      var model = options.model;
      var parentKey = "eventId";
      var parentKeyVal = options.parentView.options.masterview.model.id;
      var currentAppletView = options.currentAppletView;
      
      if(!$.hasVal(model.query)){
        model.query = new Object();
        model.query.module = "LOVMapMgr"; //would have to change for other objects
      } 
      model.query.act = "associate";
      model.query.parentKey = parentKey;
      model.query.parentKeyVal = parentKeyVal;
      model.query.defaultVals = [{foo:"bar"},{bada:"bing"}];
      var jsonModel = model.toJSON();
      model.query.data = jsonModel;   
      
      model.dataout = {data:JSON.stringify(model.query)};
      model.options.act = "associate";
      
        model.sync("associate",model,{
        success:function(model, textStatus, jqXHR){
          
          currentAppletView.cancelUpdate(); // will hide upsert wizard
        },
        error: rwcore.showError
      })
   },
   
   SaveLovAssociation : function (options){
        
      var model = options.model;
      var currentAppletView = options.currentAppletView;
      var parentId = options.parentView.options.masterview.model.id;
      var parent_GlobalVal = options.parentView.options.masterview.model.get("GlobalVal");
      var parent_DisplayVal = options.parentView.options.masterview.model.get("DisplayVal");
      var parent_LovType = options.parentView.options.masterview.model.get("LovType");
      var child_LovTypeList = options.wizardSpec.saveAssociationLovTypes;
      
    if(!$.hasVal(model.query)){model.query = new Object();} 
          
      model.query.act = "associate";
      model.query.parentId = parentId;
      model.query.module = "LOVMapMgr";
      model.query.childLovTypes = child_LovTypeList;
      model.query.parent_GlobalVal = parent_GlobalVal;
      model.query.parent_DisplayVal = parent_DisplayVal;
      model.query.parent_LovType = parent_LovType;
      var jsonModel = model.toJSON();
      model.query.data = jsonModel;
      
      

      
      model.dataout = {data:JSON.stringify(model.query)};
      model.options.act = "associate";
      
        model.sync("associate",model,{
          act:"associate",
        success:function(model, textStatus, jqXHR){
          
          currentAppletView.cancelUpdate(); // will hide upsert wizard
        },
        error: rwcore.showError
      })
   
   }, 
   

/*           
   execPickMap:function(options){
        
        var selectedModel = options.fromModel;
        var pickMap = options.pickMap;
        
        for ( var i = 0; i < pickMap.length; i++) {
          var pickItem = pickMap[i];
          var item = {};
              item[pickItem["toField"]] = selectedModel.get(pickItem["fromField"]);
          options.toModel.set(item);
          var toFieldName= pickItem["toField"];
          var selector = ".upsertContainer span#"+toFieldName;
          var fromValue = selectedModel.get(pickItem["fromField"]);
          $(selector).html(fromValue);
          var selector = ".upsertContainer input#"+toFieldName;
          $(selector).html(fromValue);
        }
        
        $("#pickBackground").hide(50);
        $('#picklistContainer').hide(350);
   
   },
*/
      

   OONReferral : function (model){
      
  
  
      model.save({},{
        success:function(model, textStatus, jqXHR){
        
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
          
          var popUpContainer = $("#PopupContainer");
          popUpContainer.html(_.template('ReferralSentConfirmation')());
          popUpContainer.addClass("confirmation");
          $(".overlay-background").show();
          popUpContainer.show();
          popUpContainer.one("click", "[popEvent]", function() {
            popUpContainer.hide();
            $(".overlay-background").hide();
            popUpContainer.removeClass("confirmation");
            rwApp.preventNavigation = false; // this 
          });
        }
      )
        
        
          
      },
            
          error: rwcore.showError
      })
   
   },
   
   
   
   
   
   
   
   /*
   getCopyPickMaps:function(pickMaps){
      
      var retVal = new Array(); 
    if ( _.isArray(pickMaps) == false ) {
        pickMaps = [pickMaps];
      }
      
      for (i=0;i<pickMaps.length;i++){
        var thisPickMap = pickMaps[i];
        if (thisPickMap.type == "pick"){
          retVal[retVal.length] = thisPickMap;
        } 
      }
      return retVal;
   
   },
   
   addConstraintPickMapExpressions:function(pickMaps,model,appletFilters){
      
    if ( _.isArray(pickMaps) == false ) {
        pickMaps = [pickMaps];
      }
      
      if (!$.hasVal(appletFilters)){
        appletFilters = {filter:new Array()}
      }
      
      if ( _.isArray(appletFilters.filter) == false ) {
        appletFilters.filter = [appletFilters.filter];
      }
      
      for (i=0;i<pickMaps.length;i++){
        var thisPickMap = pickMaps[i];
        if (thisPickMap.type == "constraint"){
          var modelVal = model.get(thisPickMap.toField);
          var ftype = thisPickMap.ftype;
          
          if(ftype =="expr"){
            if (!$.hasVal(modelVal)){modelVal = "";}  
            var cExpression = thisPickMap.constraintExpr.replace("ZtoFieldValue",modelVal);
            appletFilters.filter[appletFilters.filter.length] = {
              ftype:"expr",
              expression:cExpression
            }   
          }
          if($.hasVal(modelVal) && _.contains(["objectId","fieldVal","fieldVal_list"], ftype) ){
            var operator = thisPickMap.operator;
            var field = thisPickMap.fromField;
            appletFilters.filter[appletFilters.filter.length] = {
              ftype:ftype,
              operator:operator,
              fieldname:field,
              //objectId:modelVal
            }
            if (ftype == "objectId"){appletFilters.filter[appletFilters.filter.length-1].objectId=modelVal}
            if (ftype == "fieldVal" || ftype == "fieldVal_list"){appletFilters.filter[appletFilters.filter.length-1].fieldVal=modelVal}   
          }
          
          
        } 
      }
      
      return appletFilters;
   
   },
   */
   /*
   checkin:function(options){
      var eventId = options.eventId;
      var userId = rwFB.uId;
      var attendeeModel = new rwcore.StandardModel({module:'GenericMgr',bo:'Attendee',bc:'Attendee'});
      attendeeModel.set({partyId:userId,eventId:eventId});

      
   },
   */
   
   
   /*
    newInvitationWizard:function(options){
    
    upsertWizard:{
          viewTemplate: 'WizardUpsertView',
          stations: ["Existing Contact","Who","Message"],
          firstApplet:{name:"PicturesAndLinksUpsert"},
          nextAppletFunctions:{
            PicturesAndLinksUpsert:function(model,wizSpec){return {name:"QualificationsUpsert"}},
            QualificationsUpsert:function(model,wizSpec){return {name:"Testimonials"}},
          }
          //the nextAppletFunctions object is a list of functions that return the next applet in the wizard
          //these functions enable the wizard to branch down different paths from a given node as needed
          //the function name is the applet user is currently looking at when they hit the Next button
          //the function uses the current model to decide what applet to show next
        }
    
    
    var wizard = new ReferralWire.WizardUpsertView ( { 
        firstApplet:refWizardSpec.firstApplet,
        nextAppletFunctions:refWizardSpec.nextAppletFunctions,
        appletTemplates:refWizardSpec.appletTemplates,
        viewTemplate: refWizardSpec.viewTemplate,
        upsertmodel: refModel,
        stations:refWizardSpec.stations,
        saveFunction:refWizardSpec.saveFunction,
        parentView: event.parentView,
        showConfirmOnSave: refWizardSpec.showConfirmOnSave,
        wizardSpec:refWizardSpec
      });
      //var firstAppletView = wizard.getCurrentAppletView(wizard.firstApplet);//this will initialize the wizard model

    
    wizard.render();
  },
  */
   
   
   
   
   newInvitationWizard:function(options){
    
    


   },

   
    PublicProfile : function(profileId) {

      this.GenericSummaryDetailPattern({
        selectedId : profileId,
        summaryapplet : "PartnerProfileViewBar",
        summaryTemplate : 'ProfileNavigation',
        viewBarApplet:"PartnerProfileViewBar",
        profileNavigation:true,
        // detailapplet : "ProfileSocialForm",
        detailapplet : "Qualifications",
        detailTemplate : 'PublicProfileForm',
        clickRoute : "PublicProfile",
        appletMenu: "PublishProfileMenu",
        viewTitle:"My Public Profile",
        viewTemplate:'LeftNavSummaryDetailView'    
        });
    },
    
    Profile : function(profileId) {

      this.GenericSummaryDetailPattern ( {
          summaryapplet : "PartnerProfileViewBar",
          summaryTemplate : 'ProfileNavigation',
          viewTemplate:'LeftNavSummaryDetailView',
          detailapplet : "PartyAppletForm",
          upsertApplet : "PartyUpsertForm",
          viewBarApplet:"PartnerProfileViewBar",
          clickRoute : "Profile",
          appletMenu: "ProfileMenu",
          viewTitle:"My Contact Information",
          selectedId : profileId,
          profileNavigation:true,
          detailTemplate : 'StdForm'

        });
    },
    
    speakerBio : function(profileId) {

      this.GenericSummaryDetailPattern ( {
          summaryapplet : "PartnerProfileViewBar",
          summaryTemplate : 'ProfileNavigation',
          viewTemplate:'LeftNavSummaryDetailViewIFrame',
          detailapplet : "PartySpeakerForm",
          //detailTemplate: rwApp.getTemplate,
          detailTemplate:"STN_speakerInviteMessage",
          upsertApplet : "PartySpeakerUpsertForm",
          viewBarApplet:"PartnerProfileViewBar",
          clickRoute : "speakerBio",
          //appletMenu: rwApp.getAppletMenu,
          appletMenu : "ProfileMenu",
          viewTitle:"My Speaking Qualifications",
          selectedId : profileId,
          profileNavigation:true,
          //detailTemplate : 'StdForm'

        });
    },
    
    profileSocial : function(profileId){

      this.GenericSummaryDetailPattern({
        profileId:profileId,
              summaryapplet : "PartnerProfileViewBar",
              summaryTemplate : 'ProfileNavigation',
        viewBarApplet:"PartnerProfileViewBar",
        profileNavigation:true,
        detailapplet : "Qualifications",
        detailTemplate : 'QualificationsForm',
        viewTemplate:'ProfileEditorView',
        clickRoute:"profileSocial",
        appletMenu:"ProfileWizardEdit",
        viewTitle:"About Me",
        upsertWizard:{
          viewTemplate: 'WizardUpsertView',
          stations: ["Pictures and Web Links","Introduction & Specialties","Testimonials"],
          firstApplet:{name:"PicturesAndLinksUpsert"},
          nextAppletFunctions:{
            PicturesAndLinksUpsert:function(model,wizSpec){return {name:"QualificationsUpsert"}},
            QualificationsUpsert:function(model,wizSpec){return {name:"Testimonials"}},
          }
          //the nextAppletFunctions object is a list of functions that return the next applet in the wizard
          //these functions enable the wizard to branch down different paths from a given node as needed
          //the function name is the applet user is currently looking at when they hit the Next button
          //the function uses the current model to decide what applet to show next
        }
    });
            
      
    },
    
    printProfileViewDef:{
          //profileId:profileId,
        summaryapplet:"PartyAppletForm",
        summaryTemplate:'StdForm',
        detailapplet : "Qualifications",
        detailTemplate : 'QualificationsForm',
        viewBarApplet:"PartnerSocialViewBar",
        appletMenu: "PartnerMenu",
        //viewTemplate:ReferralWire.Templatecache.ProfilePrintView,
        viewTemplate:'ProfilePrintView',
        clickRoute:"partnerSocial",
        showProfileViewBar:true,
        viewTitle:"Partner Profile",
        viewEL:"#printPage",
        done:function(ldview){
          
           $("#printPage").hide();
           var fullName = ldview.options.listview.model.get('fullName')
           rwApp.printProfile(fullName);
        }
     },
     

    preferences : function(profileId) {
      
        this.GenericSummaryDetailPattern ( {
            summaryapplet : "PartnerProfileViewBar",
            summaryTemplate : 'ProfileNavigation',
            viewTemplate:'LeftNavSummaryDetailView',
        profileNavigation:true,
            viewBarApplet:"PartnerProfileViewBar",
            detailapplet : "ProfilePreferences",
            clickRoute : "preferences",
            selectedId : profileId,
            appletMenu: "ProfileMenu",
            viewTitle:"My Preferences",
            detailTemplate : 'PreferencesForm',
            tooltipSource:"preferences"
          });
      },
      
      profilePhotos: function(profileId){
          this.GenericSummaryDetailPattern ( {
              summaryapplet : "PartnerProfileViewBar",
              summaryTemplate : 'ProfileNavigation',
              viewTemplate:'LeftNavSummaryDetailView',
              profileNavigation:true,
              detailapplet : "ProfileImages",
              viewBarApplet:"PartnerProfileViewBar",
              clickRoute : "profilePhotos",
              viewTitle:"My Photos",
              selectedId : profileId,
              appletMenu: "ProfileMenu",
              detailTemplate : 'PhotoGalleryThumbs'
            });
        
      },
      
      profileTarget: function(profileId){
        
        
          this.GenericMasterDetailPattern ({          
          masterApplet: "ProfileSocialForm",
          masterTemplate : 'SpecialtiesMasterUser',
          //profileNavigation:true,
          //masterRecordId:profileId,
          usePaging:true,
          detailListApplet:"TargetCriteriaList",
          viewBarApplet:"MyCriteriaViewBar",
          detailListTemplate : 'StdList',
          detailRenderer : ReferralWireView.ListView,
          MDTemplate: 'StdMasterDetailView',
          searchSpec: {filter:[
              {
                ftype:"expr", 
                expression:"{partyRelation : 'TARGET'}"
              },
            ]},
      parentKeyField:"id",
        detailSearchSpec: { partyId : "id" },
          viewTitle : "My Target Customer Profile",
          appletMenu: "ProfileTargetMenu",
          //appletMenu: "BillingMenu",
          sortby: "DisplaySeq",
          //sortOrder: "DESC",
          //tooltipSource:"billingMD"
          upsertWizard:{

                    saveFunction:rwApp.SaveCriteria,
                viewTemplate: 'WizardUpsertView',
                stations: ["Household","Wealth and Property","Professional"],
                //firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
                firstApplet:{
                  name:"HouseHoldCriteria",
                  renderer:ReferralWireView.AssociationView,
                  template:'StdList',
                  setFilter:false,
                  toApplet:"TargetCriteriaList",
                    toSetFilter:false,
                    toHtmlTemplate:'StdList',
                    toClientSideSortAttr:"DisplaySeq",
                    toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                    associationMap:rwApp.criteriaAssociationMap
                },
                nextAppletFunctions:{
                  HouseHoldCriteria:function(model,wizSpec){return {
                    name:"WealthAndPropertyCriteria",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"TargetCriteriaList",
                      toSetFilter:false,
                      toHtmlTemplate:'StdList',
                      toClientSideSortAttr:"DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.criteriaAssociationMap
                  }},
                  WealthAndPropertyCriteria:function(model,wizSpec){return {
                    name:"BusinessCriteria",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"TargetCriteriaList",
                      toSetFilter:false,
                      toHtmlTemplate:'StdList',
                      toClientSideSortAttr:"DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.criteriaAssociationMap
                  }}
                },
                
              }
          
         });
         
      
      },
      
      
      prospectVals: function(partnerId){
      
          this.GenericMasterDetailPattern ({          
          masterApplet:"PartnerSocialForm",
        masterTemplate:'SpecialtiesMasterPartner',
          //profileNavigation:true,
          masterRecordId:partnerId,
          detailListApplet:"TargetCriteriaList",
          viewBarApplet:"MyCriteriaViewBar",
          detailListTemplate : 'StdList',
          detailRenderer : ReferralWireView.ListView,
          MDTemplate: 'StdMasterDetailView',
          viewTitle : "Prospect Profile",
          appletMenu: "ProfileTargetMenu",
          clientSideSortAttr : "child_DisplaySeq",
          parentKeyField:"partnerId",
        searchSpec: {filter:[
              {
                ftype:"expr", 
                expression:"{partyRelation : 'DESCRIPTOR'}"
              },
            ]},
        detailSearchSpec: { partyId : "partnerId" },
          //appletMenu: "BillingMenu",
          sortby: "category",
          //sortOrder: "DESC",
          //tooltipSource:"billingMD"
          upsertWizard:{

                    saveFunction:rwApp.SaveCriteria,
                viewTemplate: 'WizardUpsertView',
                stations: ["Wealth and Property","Household","Professional"],
                //firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
                firstApplet:{
                  name:"WealthAndPropertyCriteria",
                  renderer:ReferralWireView.AssociationView,
                  template:'StdList',
                  setFilter:false,
                  toApplet:"TargetCriteriaList",
                    toSetFilter:false,
                    toHtmlTemplate:'StdList',
                    toClientSideSortAttr:"name",
                    toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"}
                },
                nextAppletFunctions:{
                  WealthAndPropertyCriteria:function(model,wizSpec){return {
                    name:"HouseHoldCriteria",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"TargetCriteriaList",
                      toSetFilter:false,
                      toHtmlTemplate:'StdList',
                      toClientSideSortAttr:"name",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"}
                  }},
                  HouseHoldCriteria:function(model,wizSpec){return {
                    name:"BusinessCriteria",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"TargetCriteriaList",
                      toSetFilter:false,
                      toHtmlTemplate:'StdList',
                      toClientSideSortAttr:"name",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"}
                  }}
                },
                
              }
          
         });
      
      
      },
      
      
      profileTestimonials: function(profileId){
          this.GenericSummaryDetailPattern ( {
              summaryapplet : "ProfileTestimonialsViewBar",
              summaryTemplate : 'ProfileNavigation',
              viewTemplate:'LeftNavSummaryDetailView',
              profileNavigation:true,
              detailapplet : "Testimonials",
              viewBarApplet:"ProfileTestimonialsViewBar",
              clickRoute : "profileTestimonials",
              viewTitle:"My Testimonials",
              selectedId : profileId,
              appletMenu: "ProfileMenu",
              viewTitle: "Testimonials",
              detailTemplate : 'Testimonials'
            });
    },
    
    myProspectRecs: function(){
      var refWiz = rwApp.ContactRefWizard_Recommendation();
      this.GenericMasterDetailPattern({ 
        masterApplet:"ProfileSocialForm",
        masterTemplate:'SpecialtiesMasterUser',
        //masterRecordId:rwFB.uId,//use this to find the parent record by its id
        parentKeyField:"credId",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"RecommendedProspects",
        detailListTemplate:'RecommendationsListUser',
        searchSpec: {filter:[
                    {
                          ftype:"expr", 
                          expression:"{type : 'CUST_FOR_USER'}"
                        },
                        {
                          ftype:"expr", 
                          expression:"{status : {$ne:'IGNORED'}}"
                        },
                ]},
        detailSearchSpec: { memberId : "credId" },
            dynamicTitles:[
               {template:"Best Prospects Among my Contacts",
                  fields:[
                          {fullName:"ZValue"}
               ]}
            ],
        viewBarApplet:"MyRecommendationsViewBar",
        MDTemplate:'MasterDetailViewNarrow',
        sortby : "score",
        sortOrder : "DESC",
        limit:6,
        shareFunction:function(options){
                var sendTo = options.detailRecord.get('contact_emailAddress'); 
                rwApp.sharePartnerInfo({model:options.model,sendTo:sendTo});
                },        
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            refWizard:refWiz,
            inviteFields:{
                  toFirstNameField:"contact_firstName",
              toFullNameField:"contact_fullName",
                toPartyIdField:"contactPartyId",
                toPartyTypeField:"contact_partyType",
                toEmailField:["contact_emailAddress","contact_emailAddress"]
                }
                
     });
    },
    
    myTargetAnalysis : function(){
       this.GenericSummaryDetailPattern ( {
              summaryapplet : "ProfileSocialForm",
              summaryTemplate : 'SpecialtiesMasterUser',
              viewTemplate: 'StdSummaryChartView',
              detailapplet : "Testimonials",  //placebo
              viewBarApplet:"MyTargetAnalysisViewBar",
              viewTitle:"Market Analysis of My Contacts",
              appletMenu: "EmptyMenu",
              done:function(){
                var matchSummary = $(_template('Snippets')()).find("#CriteriaMatchSummary").html();
                $("#chart1").html(matchSummary);
                $.renderContactMarketSummaryChart({renderTo:"chart2"});
              }
              //detailTemplate : ReferralWire.Templatecache.Testimonials
            });
            
          
    
    },

    
    stats : function(){
    /*
      var that = this;
      var statsModel = new ReferralWire.HomePageModel();
      statsModel.fetch({
        error : ReferralWire.showError, 
        success : function (model, response, jqXHR) {
              var homeview = new ReferralWire.HomePageView ({model: null, template: ReferralWire.Templatecache.DashBoard});    
              $(that.params.modules[1]).html(homeview.render().el).trigger('create');
              
              
              //$.renderGaugeChart("givenGauge",model.get('LastTwoWeeksReferralsSent'));////LastTwoWeeksReferralsSent
              //$.renderGaugeChart("receivedGauge",model.get('LastTwoWeeksReferralsRcvd'));////LastTwoWeeksReferralsRcvd
          }
      });
    },
    */
        this.GenericSummaryDetailPattern ( {
              summaryapplet : "StatsDuplicatesViewBar",
              summaryTemplate : 'ProfileNavigation',
              viewTemplate:'LeftNavSummaryChartView',
              profileNavigation:true,
              detailapplet : "Testimonials",
              viewBarApplet:"StatsDuplicatesViewBar",
              //clickRoute : "profileTestimonials",
              //selectedId : profileId,
              appletMenu: "EmptyMenu",
              viewTitle: "Merged Duplicates",
              detailTemplate : 'Testimonials',
              done:function(){$.renderDeDupPieChart({renderTo:"chart1"});$.renderDeDupChart({renderTo:"chart2"});}
              
            });
            
    
    },
    
    incompleteRecords : function(){

        this.GenericSummaryDetailPattern ( {
              summaryapplet : "StatsIncompleteViewBar",
              summaryTemplate : 'ProfileNavigation',
              viewTemplate:'LeftNavSummaryChartView',
              profileNavigation:true,
              detailapplet : "Testimonials",
              viewBarApplet:"StatsIncompleteViewBar",
              viewTitle:"Incomplete Records",
              appletMenu: "EmptyMenu",
              detailTemplate : 'Testimonials',
              done:function(){$.renderIncompleteRecordsChart({renderTo:"chart3"}); $("#detailRecords").html('filtered list goes here');}
              
            });
            
    
    },
    
    enrichedRecords : function(){

        this.GenericSummaryDetailPattern ( {
              summaryapplet : "StatsEnhancementViewBar",
              summaryTemplate : 'ProfileNavigation',
              viewTemplate:'LeftNavSummaryChartView',
              profileNavigation:true,
              detailapplet : "Testimonials",
              viewBarApplet:"StatsEnhancementViewBar",
              viewTitle:"Enhancement Results",
              appletMenu: "EmptyMenu",
              detailTemplate : 'Testimonials',
              done:function(){$("#chart3").css("height","800px");$.renderEnrichmentResultsChart({renderTo:"chart3"})}
              
            });
            
    
    },
    
    billingMD : function(profileId){

      var that = this;
      this.GenericMasterDetailPattern ({
          masterApplet: "ProfileBillingViewBar",
          masterTemplate : 'ProfileNavigation',
          profileNavigation:true,
          masterRecordId:profileId,
          detailListApplet:"BillingAppletList",
          viewBarApplet:"ProfileBillingViewBar",
          detailListTemplate : 'MultiColumnList',
          detailRenderer : ReferralWireView.MultiColumnListView(),
          MDTemplate: 'LeftNavMDMCView',
          viewTitle : "Billing",
          appletMenu: "BillingMenu",
          sortby: "rw_created_on",
          sortOrder: "DESC",
          tooltipSource:"billingMD"
         });
     }, 


    receiptsMD : function(profileId){

      this.GenericMasterDetailPattern ({
          masterApplet: "ProfileReceiptsViewBar",
          masterTemplate : 'ProfileNavigation',
          profileNavigation:true,
          masterRecordId:profileId,
          detailListApplet:"ReceiptsAppletList",
          viewBarApplet:"ProfileReceiptsViewBar",
          detailListTemplate : 'MultiColumnList',
          detailRenderer : ReferralWireView.MultiColumnListView,
          MDTemplate: 'LeftNavMDMCView',
          viewTitle : "Receipts",
          appletMenu: "EmptyMenu",
          sortby: "rw_created_on",
          sortOrder: "ASC",
          tooltipSource:"receiptsMD",
         });
    }, 
    
    passwordChange : function(profileId) {
      
      var that = this;
        this.GenericSummaryDetailPattern ( {
            summaryapplet : "PartnerProfileViewBar",
            summaryTemplate : 'ProfileNavigation',
            viewTemplate:'LeftNavSummaryDetailView',
        profileNavigation:true,
            viewBarApplet:"PartnerProfileViewBar",
            detailapplet : "ChangePasswordForm",
            clickRoute : "password",
            selectedId : profileId,
            appletMenu: "shortUpdate",
            viewTitle:"Change Password",
            tooltipSource:"passwordChange",
            detailTemplate : 'changePasswordTemplate',
            done: function () {
                $(rwApp.params.modules[1]).off('click', '#Submit');
              $(rwApp.params.modules[1]).on('click', '#Submit', that, function(event) {
                var newPassword_1 = $('#newPassword_1').val();
                var newPassword_2 = $('#newPassword_2').val();
                var currentPassword = $('#currentPassword').val();
              
                if (_.isEmpty(currentPassword) ) {
                  rwcore.FYI("Current Password Can't be empty");
                  return;
                }
                
                if (_.isEmpty(newPassword_1) ) {
                  rwcore.FYI("New Password Con't be empty");
                  return;
                }

                if (newPassword_1.length < 6 ) {
                  rwcore.FYI("New Password need to be 6 letters minimum");
                  return;
                }

                if ( newPassword_1 != newPassword_2 ) {
                  rwcore.FYI('Please verify new password');
                  return;
              }
              var data = new rwcore.StandardModel({module:'SecMgr'});
              
              data.set({password : currentPassword});
              data.set({newPassword : newPassword_2});
              
              data.call("changePassword", data,
                 {  add : true, error : rwcore.showError,
                    success : function (model, response, jqXHR) {
                        rwcore.FYI('Your Password Changed successfully');
                        rwApp.navigate('#home', {trigger: true});
                    }   
                 });
              });
            }
          });
        
   },

   
  facebook : function(profileId) {

      var that = this;
      var promise = rwcore.FBMatch({offset: '0'});
      promise.done(function(cc) {
          
          that.GenericSummaryTilesPattern ( {
              summaryapplet : "PartnerProfileViewBar",
              summaryTemplate : 'ProfileNavigation',
              viewTemplate:'LeftNavTilesDetailView',
              detailapplet : "FaceBookFriendsList",
              upsertApplet : "FaceBookFriendsList",
              viewBarApplet:"PartnerProfileViewBar",
              clickRoute : "facebook",
              appletMenu: "EmptyMenu",
              viewTitle:"Invite Facebook Friends <font class='titlehighlight'>(limit to 5 per day)</font>",
              selectedId : profileId,
              profileNavigation:true,
              detailTemplate : 'StdTiles',
              regionId : 'FaceBookRegionSelector',
              noRecordsMsg:"We were unable to access your Facebook friends",
              data: cc,
            });

      }).fail(function(response) { rwcore.FYI(response);});
    },

    invite_linkedin : function(profileId) {

      var that = this;
      var promise = rwcore.LNMatch({offset: '0'});

      promise.done(function(cc) {

      that.GenericSummaryTilesPattern ( {
            summaryapplet : "PartnerProfileViewBar",
            summaryTemplate : 'ProfileNavigation',
            viewTemplate:'LeftNavTilesDetailView',
            detailapplet : "LinkedInConnectionList",
            upsertApplet : "LinkedInConnectionList",
            viewBarApplet:"PartnerProfileViewBar",
            clickRoute : "invite_linkedin",
            appletMenu: "EmptyMenu",
            viewTitle:"Invite LinkedIn Connections <font class='titlehighlight'>(limit to 25 per day)</font>",
            selectedId : profileId,
            profileNavigation:true,
            detailTemplate : 'LinkedInTiles',
            regionId : 'LinkedIdRegionSelector',
            data: cc,

          });

      });

    },
    /*
     BusinessListDetail : function(selectedId){
      var dssName = "Financial and Technology Pros"; //this is name of the default saved search
      var ssGroup = "businesses"; //this is name of the saved search group
      var p = rwApp.fetchSavedSearch({searchName:dssName,searchGroup:ssGroup});
      var that = this;
      p.done(function(model){
            var dssModel = ($.hasVal(model) && model.models.length > 0)?model.models[0]:undefined;
            that.GenericListDetailPattern ( {
                listapplet : "MemberAppletList",
                usePaging:true,
                sortby : "fullName",
                formapplet : rwApp.getPublicMemberApplet,
                upsertApplet : "PartyUpsertForm",
                appletMenu: rwApp.getAppletMenu,
                appletMenuRight: "MemberMenu",
                viewBarApplet : "MembersViewBar",
                clickRoute : "memberList",
                actor:"PartyMgr",
                viewTitle:"All Members",
                searchSpec:{filter:[
                    {
                      expression:{partytype:"PARTNER"},
                      ftype:"expr"
                    },
                    {
                      expression:{business:{$ne:""},
                      ftype:"expr"
                    }
                ]},
                selectedId : selectedId,
                listTemplate : 'AllMembersList',
                formTemplate : 'StdFormMember',
                clientSideSortAttr : 'fullName',
                savedSearch: {
                  searchGroup:ssGroup,
                  actor:"PartyMgr",
                  bo:"Party",
                  bc:"Party",
                  searchAppletName:"BusinessSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Member Search",
                  dssName:dssName,
                  dssModel:dssModel
                }
            });
        });
    
      //refWizard:rwApp.partnerRefWizard
     

     },   
     */
  
     MemberListDetail : function(selectedId){
      var dssName = "All";//this is name of the default saved search
      if (selectedId == "AllNewMembers"){
        dssName = "All New Members";
        selectedId = undefined;
      }
      if (selectedId == "NewPowerPartners"){
        dssName = "New Power Partners";
        selectedId = undefined;
      }
      if (selectedId == "WhosLookingForMe"){
        dssName = "New Members Looking for Me";
        selectedId = undefined;
      }
      var ssGroup = "members"; //this is name of the saved search group
      var p = rwApp.fetchSavedSearch({searchName:dssName,searchGroup:ssGroup});
      var that = this;
      p.done(function(model){
            var dssModel = ($.hasVal(model) && model.models.length > 0)?model.models[0]:undefined;
            that.GenericListDetailPattern ( {
                listapplet : "MemberAppletList",
                usePaging:true,
                sortby : "memberRankScore",
                sortOrder:"DESC",
                formapplet : rwApp.getPublicMemberApplet,
                upsertApplet : "PartyUpsertForm",
                appletMenu: rwApp.getAppletMenu,
                appletMenuRight: "MemberMenu",
                viewBarApplet : "MembersViewBar",
                clickRoute : "memberList",
                actor:"PartyMgr",
                viewTitle:"All Members",
                searchSpec:{filter:[{
                  expression:{partytype:"PARTNER"},
                  ftype:"expr"
                  }]},
                selectedId : selectedId,
                listTemplate : 'AllMembersListBadges',
                formTemplate : 'StdFormMemberBadges',
                listItemClass:"rw_listitem hasBadges",
                refWizard:rwApp.ContactRefWizard,
                savedSearch: {
                  searchGroup:ssGroup,
                  actor:"PartyMgr",
                  bo:"Party",
                  bc:"Party",
                  searchAppletName:"MemberSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Member Search",
                  dssName:dssName,
                  dssModel:dssModel
                }

            });
        });
    
      //refWizard:rwApp.partnerRefWizard
     //

     },

      PowerPartnerCenter : function(selectedId){  
      var dssName = "My New Power Partners - Last 4 Weeks";//this is name of the default saved search

      if (selectedId == "NewPowerPartners"){
        dssName = "My New Power Partners - Last 4 Weeks";
        selectedId = undefined;
      }
      
      var ssGroup = "powerpartners"; //this is name of the saved search group
      var p = rwApp.fetchSavedSearch({searchName:dssName,searchGroup:ssGroup});
      var that = this;
      p.done(function(model){
          var dssModel = ($.hasVal(model) && model.models.length > 0)?model.models[0]:undefined;
          that.GenericListDetailPattern ( {
          listapplet : "MemberAppletList",
          usePaging:true,
          sortby : "memberRankScore",
          sortOrder:"DESC",
          formapplet : "EmptyMenu",//rwApp.getContactProfessionalApplet,
          formTemplate: 'EmptyMenu',
          viewBarApplet : "MembersViewBar",
          clickRoute : "PowerPartnerCenter",
          selectedId : selectedId,
          appletMenu:"EditPowerPartnerProfessions",
          viewTemplate:"PowerCenterListDetailView",
          upsertApplet:"PowerPartnerUpsertForm",
          viewTitle: "My Power Partners",
          listTemplate : 'MembersDrillList',

          /*
          searchSpec:{
                filter:[
                  {
                    ftype:"fieldVal_list", 
                    fieldname:"profession",
                    operator:"$in",
                    fieldVal:rwFB.powerpartner1
                  },
              ]
          },
          */
          secondTierNav:[{label:"By Chapter",state:"selected",iconId:"ChapterHome_sm_sel",route:"",key:""},
                {label:"By Profession",state:"",iconId:"MapIcon_black",route:"PowerPartnerCenterByPro",key:""}],
          savedSearch: {
                  searchGroup:ssGroup,
                  actor:"PartyMgr",
                  bo:"Party",
                  bc:"Party",
                  searchAppletName:"MemberSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Member Search",
                  notUserConfigurable:true,
                  dssName:dssName,
                  dssModel:dssModel
                },

           done:function(ldview){

                if ($.hasVal(rwFB.powerpartner1)){
                  var cView = new ReferralWireView.ChartView({
                    chartName:'PowerPartnerChapters',
                    containerEl:'chartContainer',
                    defaultHeight:500,
                    pointSelectFunction:function(e){

                      var sm = ldview.searchModel;
                      sm.set({"OrgId":e.point.id,"org_businessName":e.point.name,noChartFilter:true,});
                      ldview.applySavedSearch(sm)
                      var sname = e.point.name.replace("Successful","");
                      var sname = sname.replace("Thinkers","");

                      $(".savedSearchName").html(sname);
                      $("#view-title-suffix").html(" -- " + sname);
                    }
                  });
                  cView.searchRequest=ldview.options.listview.model.options.searchRequest;
                  ldview.ChartView = cView;
                  cView.render();
                }
                else {
                  $(".leaderboard-need-details").removeClass("hidden");
                  $(".powerPartnerFrame").remove();
                }
              
           }

            
         });
      });
    //AddressBookSearchForm
    },

    PowerPartnerCenterByPro : function(selectedId){  
      var dssName = "My New Power Partners - Last 4 Weeks";//this is name of the default saved search
      
      var ssGroup = "powerpartners"; //this is name of the saved search group
      var p = rwApp.fetchSavedSearch({searchName:dssName,searchGroup:ssGroup});
      var that = this;
      p.done(function(model){
          var dssModel = ($.hasVal(model) && model.models.length > 0)?model.models[0]:undefined;
          that.GenericListDetailPattern ( {
          listapplet : "MemberAppletList",
          usePaging:true,
          sortby : "memberRankScore",
          sortOrder:"DESC",
          formapplet : "EmptyMenu",//rwApp.getContactProfessionalApplet,
          formTemplate: 'EmptyMenu',
          viewBarApplet : "MembersViewBar",
          clickRoute : "PowerPartnerCenter",
          selectedId : selectedId,
          appletMenu:"EditPowerPartnerProfessions",
          viewTemplate:"PowerCenterListDetailView",
          upsertApplet:"PowerPartnerUpsertForm",
          viewTitle: "My Power Partners",
          listTemplate : 'MembersDrillList',

          /*
          searchSpec:{
                filter:[
                  {
                    ftype:"fieldVal_list", 
                    fieldname:"profession",
                    operator:"$in",
                    fieldVal:rwFB.powerpartner1
                  },
              ]
          },
          */
          secondTierNav:[{label:"By Chapter",state:"",iconId:"ChapterHome_sm_sel",route:"PowerPartnerCenter",key:""},
                {label:"By Profession",state:"selected",iconId:"MapIcon_black",route:"",key:""}],
          savedSearch: {
                  searchGroup:ssGroup,
                  actor:"PartyMgr",
                  bo:"Party",
                  bc:"Party",
                  searchAppletName:"MemberSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Member Search",
                  notUserConfigurable:true,
                  dssName:dssName,
                  dssModel:dssModel
                },

           done:function(ldview){

                if ($.hasVal(rwFB.powerpartner1)){
                  var cView = new ReferralWireView.ChartView({
                    chartName:'PowerPartnerProfessions',
                    containerEl:'chartContainer',
                    defaultHeight:500,
                    pointSelectFunction:function(e){

                      var sm = ldview.searchModel;
                      sm.set({"profession":e.point.name,noChartFilter:true,});
                      ldview.applySavedSearch(sm)
                      var sname = e.point.name.replace("Successful","");
                      //var sname = sname.replace("Thinkers","");

                      $(".savedSearchName").html(sname);
                      $("#view-title-suffix").html(" -- " + sname);
                    }
                  });
                  cView.searchRequest=ldview.options.listview.model.options.searchRequest;
                  ldview.ChartView = cView;
                  cView.render();
                }
                else {
                  $(".leaderboard-need-details").removeClass("hidden");
                  $(".powerPartnerFrame").remove();
                }
              
           }

            
         });
      });
    //AddressBookSearchForm
    },
     
   MemberListDetailDemo : function(selectedId){
     
     this.GenericListDetailPattern ( {
      listapplet : "MemberAppletList",
      usePaging:true,
      sortby : "firstName",
      formapplet : "PartyAppletForm",
      upsertApplet : "PartyUpsertForm",
      appletMenu: rwApp.getAppletMenu,
      appletMenuRight: "MemberMenu",
      viewBarApplet : "MembersViewBar",
      clickRoute : "memberListDemo",
      actor:"PartyMgr",
      viewTitle:"All Members",
      searchSpec:{filter:[{
        expression:{partytype:"PARTNER_DEMO"},
        ftype:"expr"
        }]},
      selectedId : selectedId,
      listTemplate : 'AllMembersList',
      formTemplate : 'StdFormMember',
      clientSideSortAttr : 'fullName',
      //refWizard:rwApp.partnerRefWizard
     });

     },   
     
    MemberListDetailAdmin : function(selectedId){
     //MemberAdminSearchForm
     this.GenericListDetailPattern ( {
      listapplet : "MemberAppletList",
      usePaging:true,
      sortby : "firstName",
      formapplet : "PartyAppletFormAdmin",
      //upsertApplet : "PartyAppletFormAdmin",
      upsertApplet : "PartyUpsertFormAdmin",
      appletMenu: rwApp.getAppletMenu,
      appletMenuRight: "MemberMenu",
      viewBarApplet : "MembersViewBar",
      clickRoute : "memberListAdmin",
      actor:"PartyMgr",
      viewTitle:"All Members",
      searchSpec:{filter:[{
        expression:{partytype:"PARTNER"},
        ftype:"expr"
        }]},
      selectedId : selectedId,
      listTemplate : 'AllMembersList',
      formTemplate : 'StdFormMember',
      clientSideSortAttr : 'fullName',
      savedSearch: {
                  searchGroup:"members_admin",
                  actor:"PartyMgr",
                  bo:"Party",
                  bc:"Party",
                  searchAppletName:"MemberAdminSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Member Search",
                }
      //refWizard:rwApp.partnerRefWizard
     });

     }, 


     BusinessDirectorySearch:function(keyword,zipCode){

      
      var that = this;
      var hpModel = new ReferralWire.HomePageModel();
      hpModel.fetch({
          error : function () { window.location = '/login.jsp';}, 
          success : function (model, response, jqXHR) {
              var homeview = new ReferralWire.HomePageView ({model: model, template: 'BusinessDirectoryHome'}); 

              $(rwApp.params.modules[1]).html(homeview.render().el).trigger('create');
              if ($.hasVal(rwFB.employerId)){
                $(".mainPanelBody").addClass("hasEmployer");
              } else {
                $(".mainPanelBody").addClass("noEmployer");
              }
              if ($.hasVal(keyword) && keyword !="none" && keyword != "undefined"){$(".directory-search-input-business").attr("value",keyword);}
              if ($.hasVal(zipCode) && zipCode !="undefined" && zipCode !="none" ){$(".directory-search-input-zip").attr("value",zipCode);}
          }
      });


     },

     BusinessDirectoryMap:function(selectedId,category,keyword,zipCode){

      if (!$.hasVal(selectedId) || selectedId =="none"){selectedId = undefined;}
      var f = new Array();
      if ($.hasVal(category) && category !="none"){f[f.length] = {ftype:"expr",expression:"{category:'"+category+"'}"};};
      if ($.hasVal(zipCode) && zipCode !="none"){f[f.length] = {ftype:"proximity",from:zipCode,distance:20};};

       this.GenericListDetailPattern ( {
        listapplet : "BusinessList",
        usePaging:true,
        sortby : "businessRankScore",
        sortOrder:"DESC",
        formapplet : "BusinessForm",
        appletMenu: "EmptyMenu",//"EmptyMenu",
        viewBarApplet : "MembersViewBar",
        clickRoute : "BusinessDirectoryMap",
        selectedId : selectedId,
        act:"readAll",
        searchText : ($.hasVal(keyword) && keyword !="none")?keyword:undefined,
        viewTitle:"Search Results",
        viewTemplate:'ListMapViewBizDirectory',
        searchSpec:(f.length > 0)?{filter:f}:undefined,
        listTemplate : 'BusinessDirectoryList',
        formTemplate : 'StdFormMember',
        setFilter:false,
        listMap:true,
        calculatedFields: {
              categoryDisplay:function(model){
                return rwcore.getLovDisplayVal('PROFCAT', model.get('category'));
              }
        },
        secondTierNav:[{label:"Map",state:"",iconId:"",route:"BusinessDirectoryMap",key:"id",routeParams:{category:category,keyword:keyword,zipCode:zipCode}},
                {label:"Details",state:"",iconId:"",route:"BusinessDirectoryDetails",key:"id",routeParams:{category:category,keyword:keyword,zipCode:zipCode}},
                {label:"New Search",state:"",iconId:"",route:"BusinessDirectorySearch",key:"",routeParams:{keyword:keyword,zipCode:zipCode}}
                ],
        done:function(ldview){
            ldview.options.listMapOptions = {
            popTemplateSelector:".mapPopUpSelectorBusiness",
            fieldMap:{businessName:"ZBizName",about:"ZAbout",workPhone:"ZWorkPhone",workEmail:"ZEmail",logo: rwFB.CDN +  "/images/emptyPic.png"}
          },
            ldview.renderListMap();
            var count = ldview.options.listview.model.models.length;
            var txt = (count != 1)?count + " Results":"1 Result";
            $(".resultCount").html(txt);
            $(".resultsSummary-detail").html($.getSearchResultDesc(category,keyword,zipCode));
        },
        
        //refWizard:rwApp.partnerRefWizard
       });


     },

     BusinessDirectoryDetails: function(selectedId,category,keyword,zipCode){
      
      if (!$.hasVal(selectedId) || selectedId =="none"){selectedId = undefined;}
      var f = new Array();
      if ($.hasVal(category) && category !="none"){f[f.length] = {ftype:"expr",expression:"{category:'"+category+"'}"};};
      if ($.hasVal(zipCode) && zipCode !="none"){f[f.length] = {ftype:"proximity",from:zipCode,distance:20};};

      this.GenericListDetailPattern ( {
        listapplet : "BusinessList",
        usePaging:true,
        sortby : "businessRankScore",
        sortOrder:"DESC",
        formapplet : "BusinessForm",
        appletMenu: rwApp.getAppletMenu,//"EmptyMenu",
        viewBarApplet : "MembersViewBar",
        clickRoute : "BusinessDirectoryDetails",
        upsertApplet: "BusinessForm",
        selectedId : selectedId,
        act:"readAll",//explicity avoids using the selectedId as a search spec. We need selectedId to keep focus on the right record, but want to show all the recs that conform to th search spec
        searchText : ($.hasVal(keyword) && keyword !="none")?keyword:undefined,
        viewTitle:"Search Results",
        viewTemplate:'ListViewBizDirectory',
        searchSpec:(f.length > 0)?{filter:f}:undefined,
        listTemplate : 'BusinessDirectoryList',
        formTemplate : 'BusDirectoryDetailForm',
        setFilter:false,
        inlineMap:true,
        calculatedFields: {
              categoryDisplay:function(model){
                return rwcore.getLovDisplayVal('PROFCAT', model.get('category'));
              }
        },
        secondTierNav:[{label:"Map",state:"",iconId:"",route:"BusinessDirectoryMap",key:"id",routeParams:{category:category,keyword:keyword,zipCode:zipCode}},
                {label:"Details",state:"",iconId:"",route:"BusinessDirectoryDetails",key:"id",routeParams:{category:category,keyword:keyword,zipCode:zipCode}},
                {label:"New Search",state:"",iconId:"",route:"BusinessDirectorySearch",key:"",routeParams:{keyword:keyword,zipCode:zipCode}}
                ],
        done:function(ldview){
            var count = ldview.options.listview.model.models.length;
            var txt = (count != 1)?count + " Results":"1 Result";
            $(".resultCount").html(txt);
            $(".resultsSummary-detail").html($.getSearchResultDesc(category,keyword,zipCode));
        },
        //refWizard:rwApp.partnerRefWizard
       });
     },

   speakerList : function(selectedId){
     
     this.GenericListDetailPattern ( {
      listapplet : "SpeakerAppletList",
      usePaging:true,
      sortby : "memberRankScore",
      sortOrder:"DESC",
      formapplet : "PartySpeakerForm",
      //upsertApplet : "PartyUpsertForm",
      appletMenu: "EmptyMenu",//"EmptyMenu",
      //appletMenuRight: "MemberMenu",
      viewBarApplet : "SpeakersViewBar",
      clickRoute : "speakerList",
      actor:"PartyMgr",
      viewTitle:"Speakers",
      selectedId : selectedId,
      //listTemplate : 'AllMembersList',
      listTemplate : 'SpeakersList',
      formTemplate : 'SpeakerForm',

      //clientSideSortAttr : 'fullName',
      savedSearch: {
                  searchGroup:"speakers",
                  actor:"PartyMgr",
                  bo:"Party",
                  bc:"Party",
                  searchAppletName:"SpeakerSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Speaker Search",
                  //dssName:dssName,
                  //dssModel:dssModel
       }
      //refWizard:rwApp.partnerRefWizard
     });

     },  


   speakerMap : function(selectedId){
    var dssName = "Speakers within 50 Miles"; //this is name of the default saved search
      var ssGroup = "speakers"; //this is name of the saved search group
      var p = rwApp.fetchSavedSearch({searchName:dssName,searchGroup:ssGroup});
      var that = this;
      p.done(function(model){
            var dssModel = ($.hasVal(model) && model.models.length > 0)?model.models[0]:undefined;
     
             that.GenericListDetailPattern ( {
              listapplet : "MemberAppletList",
              //usePaging:true,
              sortby : "memberRankScore",
              sortOrder:"DESC",
              formapplet : "PartyAppletForm",
              upsertApplet : "PartyUpsertForm",
              appletMenu: "EmptyMenu",
              //appletMenuRight: "MemberMenu",
              viewBarApplet : "SpeakersViewBar",
              clickRoute : "speakerMap",
              actor:"PartyMgr",
              viewTitle:"Speakers",
              searchSpec:{filter:[
              {
                expression:{partytype:"PARTNER"},
                ftype:"expr"
              },
              {
                expression:{isSpeaker:"true"},
                ftype:"expr"
              },
                ]},
              selectedId : selectedId,
              listTemplate : 'SpeakersList',
              formTemplate : 'StdFormMember',
              viewTemplate:'ListMapView',
              savedSearch: {
                          searchGroup:"speakers",
                          actor:"PartyMgr",
                          bo:"Party",
                          bc:"Party",
                          searchAppletName:"SpeakerSearchForm", //replacehardcode
                          searchAppletTemplate:"SearchForm",
                          title:"Speaker Search",
                          dssName:dssName,
                          dssModel:dssModel
               },
              shape:"",
              listMap:true,
              done:function(ldview){
                  ldview.options.listMapOptions = {
                  popTemplateSelector:".mapPopUpSelectorSpeaker",
                  fieldMap:{fullName:"ZfullName",speakerTravelMiles:"ZMaxMiles",speakerBio:"ZBio",speakerPhone:"ZWorkPhone",speakerEmail:"ZEmail",photoUrl: rwFB.CDN +  "/images/emptyPic.png"}
                },
                  ldview.renderListMap();
              },
             });//close GenericListDetailPattern
          }); //close p.done
     },
     
      speakerEngagements : function(selectedId){
      
        this.GenericMasterDetailPattern({ 
        masterApplet:"PartySpeakerShortForm",
        masterTemplate: 'SpeakerFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"EventList",
        detailRenderer : ReferralWire.ListView,
        clientSideSortAttr : "datelong",
        clientSideSortDirection: "DESC",
        clickRoute : "speakerEngagements",
        selectedId:selectedId,
        //clientSideSortAttr : "child_DisplaySeq",
        detailListTemplate: 'speakerEventList',
        detailSearchSpec: { Speaker1_Id : "id" },
            dynamicTitles:[
               {template:"ZValue Speaking Engagements",
                  fields:[
                          {fullName:"ZValue"}
               ]}
            ],
        viewBarApplet:"SpeakersViewBar",
        clientFKFilter:true,
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
                
       });
        
     },        


   speakerReport: function(selectedId){
     
     this.GenericSummaryDetailPattern ( {

          summaryapplet : "PartnerProfileViewBar",
          summaryTemplate : 'SpeakerStatsFormNarrow',
          viewTemplate:'SpeakerSummaryChartView',
          detailapplet : "EmptyMenu",
          //upsertApplet : "PartyUpsertForm",
          viewBarApplet:"SpeakersViewBar",
          clickRoute : "speakerReport",
          appletMenu: "EmptyMenu",
          viewTitle:"Speaker Stats",
          selectedId:selectedId,
          detailTemplate : 'BasicForm',
          secondTierNav:[
            {label:"Speaker Engagements",state:"",iconId:"CalendarColorIcon_sm",route:"speakerReport",key:"id"},
            {label:"Speaker Ratings",state:"",iconId:"SingleStar_sm",route:"speakerRatingReport",key:"id"},
          ],
          
          done:function(ldview){
            
            var cView = new ReferralWireView.ChartView({
              chartName:'SpeakerEngagementsChart',
              containerEl:'chart1',
            });
            cView.render();

          }
          
        });


   },     

   speakerRatingReport: function(selectedId){
     
     this.GenericSummaryDetailPattern ( {

          summaryapplet : "PartnerProfileViewBar",
          summaryTemplate : 'SpeakerStatsFormNarrow',
          viewTemplate:'SpeakerSummaryChartView',
          detailapplet : "EmptyMenu",
          //upsertApplet : "PartyUpsertForm",
          viewBarApplet:"SpeakersViewBar",
          clickRoute : "speakerReport",
          appletMenu: "EmptyMenu",
          viewTitle:"Speaker Stats",
          selectedId : selectedId,
          detailTemplate : 'BasicForm',
          secondTierNav:[
            {label:"Speaker Engagements",state:"",iconId:"CalendarColorIcon_sm",route:"speakerReport",key:"id"},
            {label:"Speaker Ratings",state:"",iconId:"SingleStar_sm",route:"speakerRatingReport",key:"id"},
          ],
          
          done:function(ldview){
            
            var cView = new ReferralWireView.ChartView({
              chartName:'AllSpeakerRatingsChart',
              containerEl:'chart1',
            });
            cView.render();

          }
          
        });


   },     

   PartnerListDetail : function(selectedId){  
     this.GenericListDetailPattern ( {
      listapplet : "ContactAppletList",
      usePaging:true,
      sortby : "fullName",
      formapplet : rwApp.getContactProfessionalApplet,
      formapplet2 : "PersonalContact",
      upsertApplet : "PersonalContact",
      formTemplate: rwApp.getContactProfessionalTemplate,
      viewBarApplet : rwApp.getAddrListViewBarApplet,//"ContactListViewBar",
      viewBarTemplate:rwApp.getAddrViewBarTemplate,
      fixRecordApplet: "FixEnhancementMultipleForm",
      clickRoute : "partnerList",
      selectedId : selectedId,
      appletMenu:"ContactListAppletMenu",
      appletMenuRight:"ContactReferInviteMenu",
      viewTitle: "My Address Book",
      listTemplate:rwApp.getContactListTempl,//ReferralWire.Templatecache.ContactList,
      viewTemplate:'ListSectionDetailView',
      upsertWizard:rwApp.ContactUpsertWizard(),
      refWizard:rwApp.ContactRefWizard,
        savedSearch: {
                  searchGroup:"addressbook",
                  actor:"PartnerMgr",
                  bo:"Partner",
                  bc:"Partner",
                  searchAppletName:"AddressBookSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Addressbook Search",
                  //dssName:dssName,
                  //dssModel:dssModel
       },
       editRefreshFunction: function(model,thisView){//$$
             thisView.parentView.refreshInPlace(model);
       },
       /*      fixRecordWizard:{
          viewTemplate: 'WizardUpsertView',
          stations: ["Pick Profile","Edit Composite"],
          firstApplet:{name:"FixEnhancementMultipleForm"},
          nextAppletFunctions:{
            FixEnhancementMultipleForm:function(model,wizSpec){
              return {name:"FixEnhancementMultipleForm"}//change this
            }
          }
        },
        */ 
        
     });
//AddressBookSearchForm
},

  partnerStats : function(selectedId){  
     this.GenericListDetailPattern ( {
      listapplet : "ContactAppletList",
      usePaging:true,
      sortby : "fullName",
      formapplet : rwApp.getContactProfessionalApplet,
      formTemplate: 'EmptyMenu',
      viewBarApplet : rwApp.getAddrListViewBarApplet,//"ContactListViewBar",
      viewBarTemplate:rwApp.getAddrViewBarTemplate,
      clickRoute : "partnerStats",
      selectedId : selectedId,
      appletMenu:"EmptyMenu",
      
      viewTitle: "My Address Book Statistics",
      listTemplate:rwApp.getContactListTempl,//ReferralWire.Templatecache.ContactList,
        savedSearch: {
                  searchGroup:"addressbook",
                  actor:"PartnerMgr",
                  bo:"Partner",
                  bc:"Partner",
                  searchAppletName:"AddressBookSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Addressbook Search",
                  //dssName:dssName,
                  //dssModel:dssModel
       },
       done:function(ldview){
            var cView = new ReferralWireView.ChartView({
              chartName:'AddressBookChart',
              containerEl:'chartContainer',
            });
            ldview.ChartView = cView;
            cView.render();
            $("#form1").remove();
          }

        
     });
//AddressBookSearchForm
},
    awardList_admin: function(selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      this.GenericListDetailPattern ( {
      listapplet : "AwardList",
      //usePaging:true,
      sortby : "awardName",
      formapplet : "AwardForm",
      upsertApplet : "AwardUpsertForm",
      formTemplate: 'StdForm',
      viewBarApplet : "AwardViewBar",//"ContactListViewBar",
      clickRoute : "awardList_admin",
      selectedId : selectedId,
      appletMenu:"OrgListAppletMenu",
      viewTitle: "Awards Administration",
      listTemplate:"AwardList",//ReferralWire.Templatecache.ContactList,
      //viewTemplate:'ListSectionDetailView',
      //tooltipSource:"referralInbox",
      // cacheOptimize:'yes'
      //upsertWizard:rwApp.ContactUpsertWizard(),
      //refWizard:rwApp.ContactRefWizard,
     });
    },

    metricList_admin: function(selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      this.GenericListDetailPattern ( {
      listapplet : "MetricList",
      //usePaging:true,
      sortby : "metricName",
      formapplet : "MetricForm",
      //upsertApplet : "AwardUpsertForm",
      formTemplate: 'BasicForm',
      viewBarApplet : "MetricViewBar",//"ContactListViewBar",
      clickRoute : "metricList_admin",
      selectedId : selectedId,
      appletMenu:"OrgListAppletMenu",
      viewTitle: "Metrics Administration",
      listTemplate:"SimpleList",//ReferralWire.Templatecache.ContactList,
      //viewTemplate:'ListSectionDetailView',
      //tooltipSource:"referralInbox",
      // cacheOptimize:'yes'
      //upsertWizard:rwApp.ContactUpsertWizard(),
      //refWizard:rwApp.ContactRefWizard,
     });
    },

    imageList_admin: function(selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      this.GenericListDetailPattern ( {
      listapplet : "ImageList",
      //usePaging:true,
      sortby : "metricName",
      formapplet : "ImageForm",
      upsertApplet : "ImageUpsertForm",
      formTemplate: 'BasicForm',
      viewBarApplet : "MetricViewBar",//"ContactListViewBar",
      clickRoute : "imageList_admin",
      selectedId : selectedId,
      appletMenu:"OrgListAppletMenu",
      viewTitle: "Images Administration",
      listTemplate:"ImageList",//ReferralWire.Templatecache.ContactList,
      calculatedFields: {
            location:function(model){
              return model.get('photoUrl');
            }
      },
      //viewTemplate:'ListSectionDetailView',
      //tooltipSource:"referralInbox",
      // cacheOptimize:'yes'
      //upsertWizard:rwApp.ContactUpsertWizard(),
      //refWizard:rwApp.ContactRefWizard,
     });
    },

    
     emailTemplateList_admin: function(selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      this.GenericListDetailPattern ( {
      listapplet : "EmailTemplateList",
      //usePaging:true,
      sortby : "templateName",
      formapplet : "EmailTemplateForm",
      //upsertApplet : "AwardUpsertForm",
      formTemplate: 'EmailTemplateForm',
      //formTemplate: 'BasicForm',
      viewBarApplet : "EmailTemplateViewBar",//"ContactListViewBar",
      clickRoute : "emailTemplateList_admin",
      selectedId : selectedId,
      appletMenu:"OrgListAppletMenu",
      viewTitle: "Email Template Administration",
      listTemplate:"SimpleList",//ReferralWire.Templatecache.ContactList,
      //viewTemplate:'ListSectionDetailView',
      //tooltipSource:"referralInbox",
      // cacheOptimize:'yes'
      //upsertWizard:rwApp.ContactUpsertWizard(),
      //refWizard:rwApp.ContactRefWizard,
     });
    }, 

    reports_admin: function(selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      var dssName = "System"; //this is name of the default saved search
      var ssGroup = "reports"; //this is name of the saved search group
      var p = rwApp.fetchSavedSearch({searchName:dssName,searchGroup:ssGroup});
      var that = this;
      p.done(function(model){
            var dssModel = ($.hasVal(model) && model.models.length > 0)?model.models[0]:undefined;

            that.GenericListDetailPattern ( {
            listapplet : "ReportList",
            //usePaging:true,
            sortby : "templateName",
            formapplet : "ReportForm",
            //upsertApplet : "AwardUpsertForm",
            formTemplate: 'BasicForm',
            //formTemplate: 'BasicForm',
            viewBarApplet : "ReportViewBar",//"ContactListViewBar",
            clickRoute : "reports_admin",
            selectedId : selectedId,
            appletMenu:"ReportsMenu",
            viewTitle: "Reports Administration",
            listTemplate:"StdList",//ReferralWire.Templatecache.ContactList,
            shape:"",
            //viewTemplate:'ListSectionDetailView',
            //tooltipSource:"referralInbox",
            // cacheOptimize:'yes'
            //metricDisplayName
            calculatedFields: {
                  metricDisplayName:function(model){
                    var gVal = model.get('metricName');
                    return rwcore.getLovDisplayVal('FACT',gVal); 
                  },
                  groupByDisplay:function(model){
                    var gVal = model.get('groupBy');
                    return rwcore.getLovDisplayVal('GROUP_BY',gVal); 
                  },
                  orderByDisplay:function(model){
                    var gVal = model.get('orderBy');
                    return rwcore.getLovDisplayVal('ORDER_BY',gVal); 
                  },
            },
            upsertWizard: { 
                //showConfirmOnSave:'ReferralSentConfirmation',
                viewTemplate: 'WizardUpsertView',
                stations: ["Select Metric","Filter","Group and Sort"],
                firstApplet:{name:"ReportWizard1"},
                //saveFunction:function(model){rwApp.saveChart(model)}
                
                nextAppletFunctions:{
                    ReportWizard1:function(model,wizSpec){
                      model = rwApp.getReportModel({baseModel:model},{sActor:"PartyMgr"},{sBO:"Party"},{sBC:"Party"});
                      var sApplet = model.get("searchapplet");
                      return {name:sApplet,template:"SearchForm"}
                    },
                    MemberSearchForm:function(model,wizSpec){
                      model = rwApp.rWizSetModel(model);
                      return {name:"ReportWizard3"}
                    },
                    PartySearchForm:function(model,wizSpec){
                      model = rwApp.rWizSetModel(model);
                      return {name:"ReportWizard3"}
                    },
                    InvitationSearchForm:function(model,wizSpec){
                      model = rwApp.rWizSetModel(model);
                      return {name:"ReportWizard3"}
                    },
                    ReferralSearchForm:function(model,wizSpec){
                      model = rwApp.rWizSetModel(model);
                      return {name:"ReportWizard3"}
                    },
                    AttendeeSearchForm:function(model,wizSpec){
                      model = rwApp.rWizSetModel(model);
                      return {name:"ReportWizard3"}
                    },
                    EventSearchForm:function(model,wizSpec){
                      model = rwApp.rWizSetModel(model);
                      return {name:"ReportWizard3"}
                    },
                }
            },
            savedSearch: {
                        searchGroup:"reports",
                        actor:"ReportMgr",
                        bo:"Report",
                        bc:"Report",
                        searchAppletName:"ReportSearchForm", //replacehardcode
                        searchAppletTemplate:"SearchForm",
                        title:"Report Search",
                        dssName:dssName,
                        dssModel:dssModel
             },
            editRefreshFunction: function(model,thisView){//$$
                   thisView.parentView.refreshInPlace(model);
             }, 
            isReport:true
            //refWizard:rwApp.ContactRefWizard,
           });
      })
    }, 
     
     
     
     
     
    MemberSocial : function(profileId){
    var refWiz = rwApp.ContactRefWizard_partnerRefWizard(); 
    
      this.GenericSummaryDetailPattern({
    selectedId:profileId,
    summaryapplet:rwApp.getPublicMemberApplet,
    summaryTemplate:'StdFormNarrow',
    actor:"PartyMgr",
    detailapplet : "Qualifications",
    detailTemplate : 'QualificationsFormDisplay',
    viewBarApplet:"MembersViewBar",
    appletMenu: rwApp.getAppletMenu,
    appletMenuRight:"MemberMenu",
    viewTemplate:'ProfileDisplayView',
    clickRoute:"memberProfile",
    showProfileViewBar:true,
    /*
    secondTierNav:[{label:"Profile",state:"selected",iconId:"recProspectIcon_sel",route:"",key:""},
                {label:"Map",state:"",iconId:"googleMaps",route:"MemberMap",key:"id"}],
      */
    viewTitle:"Member Profile",
         refWizard:refWiz
    });
     },
     
     MemberMap : function(profileId){
    var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
    
      this.GenericSummaryDetailPattern({
    selectedId:profileId,
    summaryapplet:"PartyAppletForm",
    summaryTemplate:'StdFormNarrow',
    actor:"PartyMgr",
    detailapplet : "Qualifications",
    detailTemplate : 'QualificationsFormDisplay',
    viewBarApplet:"MembersViewBar",
    appletMenu: "PartnerPrintMenu",
    appletMenuRight:"MemberMenu",
    viewTemplate:'ProfileDisplayMapView',
    clickRoute:"partnerSocial",
    showProfileViewBar:true,
    secondTierNav:[{label:"Profile",state:"",iconId:"recProspectIcon_sel",route:"memberProfile",key:"id"},
                {label:"Map",state:"selected",iconId:"googleMaps",route:"",key:""}],
    viewTitle:"Member Profile",
         refWizard:refWiz,
        done:function(ldview){ldview.showMaps()}
    });
     },
     
     MemberPhotos : function(profileId){
    var refWiz = rwApp.ContactRefWizard_partnerRefWizard(); 
    
       this.GenericSummaryDetailPattern ( {
             summaryapplet : "PartyAppletForm",
             summaryTemplate:'StdFormNarrow',
             detailapplet : "PartnerImages",
             actor:"PartyMgr",
             viewBarApplet:"MembersViewBar",
             clickRoute : "memberPhotos",
             selectedId : profileId,
         appletMenu: "EmptyMenu",
         appletMenuRight:"MemberMenu",
             detailTemplate : 'PhotoGalleryThumbsNoEdit',
             refWizard:refWiz,
             viewTitle:"Member Photos",
           });
    
    
     },
     
     MemberOnlineInvites: function(profileId){
        
      this.GenericMasterDetailPattern({ 
        masterApplet:"PartyAppletForm",
        masterTemplate:"StdFormNarrow",
        masterRecordId:profileId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"MemberAppletList",
        detailRenderer : ReferralWireView.ListView,
        sortBy:"fullName",
        clickRoute : "MemberOnlineInvites",
        //clientSideSortAttr : "child_DisplaySeq",
        searchSpec: {filter:[
            {
              ftype:"time",
              fieldname:"joinedFullDate", 
              period:"80640"
            },
            {
              ftype:"expr",
              expression:"{partytype : 'PARTNER'}"
            },
          ]},
        detailListTemplate: 'InvitedMemberList',
        listItemClass:"invitedMember",
        detailSearchSpec: {invitedBy_Id : "id" },
        viewBarApplet:"MembersViewBar",
        dynamicTitles:[
               {template:"Members Invited Online by ZValue - Last Eight Weeks",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        clientFKFilter:true,
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
                
       });
     },

     MostPRefInChapterDrill: function(profileId){
        
      this.GenericMasterDetailPattern({ 
        masterApplet:"PartyAppletForm",
        masterTemplate:"StdFormNarrow",
        masterRecordId:profileId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        act:"readAll",
        detailListApplet:"BasicReferralList",
        detailRenderer : ReferralWireView.ListView,
        sortBy:"fullName",
        clickRoute : "MostPRefInChapterDrill",
        //clientSideSortAttr : "child_DisplaySeq",
        searchSpec: {filter:[
            {
              ftype:"time",
              fieldname:"rw_created_on", 
              period:"80640"
            },
            {
              ftype:"expr",
              expression:"{referralType : 'CUST_FOR_PART'}"
            },
          ]},
        detailListTemplate:  'OutBox3rdPartnerList',
        
        detailSearchSpec: {fromId : "id" },
        viewBarApplet:"MembersViewBar",
        dynamicTitles:[
               {template:"Prospect Referrals Given by ZValue - Last Eight Weeks",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        clientFKFilter:true,
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
                
       });
     },
     
     MemberGuestInvites: function(profileId){
        
      this.GenericMasterDetailPattern({ 
        masterApplet:"PartyAppletForm",
        masterTemplate:"StdFormNarrow",
        masterRecordId:profileId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"AttendeeGuestList",
        detailRenderer : ReferralWireView.ListView,
        sortBy:"fullName",
        clickRoute : "MemberGuestInvites",
        //clientSideSortAttr : "child_DisplaySeq",
        searchSpec: {filter:[
            {
              ftype:"time",
              fieldname:"denorm_datetime", 
              period:"80640"
            },
            {
              ftype:"expr",
              expression:"{partytype : {$ne:'PARTNER_DEMO'}}"
            },
            
          ]},
        detailListTemplate: 'ChapterMeetingAttendeeListNoAct',
        //listItemClass:"invitedMember",
        detailSearchSpec: {newMemberSrc_partyId : "id" },
        viewBarApplet:"MembersViewBar",
        dynamicTitles:[
               {template:"Meeting Guests Invited by ZValue - Last Eight Weeks",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        clientFKFilter:true,
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
                
       });
     },
     
     
     PartnerSocial : function(profileId){

    var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
    
    this.GenericSummaryDetailPattern({
    selectedId:profileId,
    summaryapplet:"PartnerAppletForm",
    summaryTemplate:'StdFormNarrowPub',
    detailapplet : "Qualifications",
    detailTemplate : 'QualificationsFormDisplay',
    viewBarApplet:rwApp.getAddrListViewBarApplet,
    appletMenu: "EmptyMenu",
    appletMenuRight:"PartnerMenu",
    viewTemplate:'ProfileDisplayView',
    clickRoute:"partnerProfile",
    showProfileViewBar:true,
    /*
    secondTierNav:[{label:"Profile",state:"selected",iconId:"recProspectIcon_sel",route:"",key:""},
                {label:"Map",state:"",iconId:"googleMaps",route:"PartnerMap",key:"id"}],
      */
    viewTitle:"Partner Profile",
         refWizard:refWiz
    });
     },
     
     PartnerMap : function(profileId){
    var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
    
      this.GenericSummaryDetailPattern({
    selectedId:profileId,
    summaryapplet:"PartnerAppletForm",
    summaryTemplate:'StdFormNarrowPub',
    detailapplet : "Qualifications",
    detailTemplate : 'QualificationsFormDisplay',
    viewBarApplet:rwApp.getAddrListViewBarApplet,
    appletMenu: "PartnerPrintMenu",
    appletMenuRight:"MemberMenu",
    viewTemplate:'ProfileDisplayMapView',
    clickRoute:"partnerSocial",
    showProfileViewBar:true,
    secondTierNav:[{label:"Profile",state:"",iconId:"recProspectIcon_sel",route:"partnerProfile",key:"id"},
                {label:"Map",state:"selected",iconId:"googleMaps",route:"",key:""}],
    viewTitle:"Member Profile",
         refWizard:refWiz,
        done:function(ldview){ldview.showMaps()}
    });
     },
     
     PartnerPhotos : function(profileId){
     
      var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
         this.GenericSummaryDetailPattern ( {
             summaryapplet : "PartnerAppletForm",
             summaryTemplate:'StdFormNarrowPub',
             detailapplet : "PartnerImages",
             viewBarApplet:rwApp.getAddrListViewBarApplet,
             clickRoute : "partnerPhotos",
             selectedId : profileId,
         appletMenu: "EmptyMenu",
         appletMenuRight: "PartnerMenu",
             detailTemplate : 'PhotoGalleryThumbsNoEdit',
             refWizard:refWiz,
           });
     },
    /*
     PartnerTestimonials:function(profileId){
      var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
         this.GenericSummaryDetailPattern ( {
             summaryapplet : "PartnerAppletForm",
             detailapplet : "PartnerTestimonials",
             viewBarApplet:"PartnerTestimonialsViewBar",
             clickRoute : "partnerTestimonials",
             selectedId : profileId,
             appletMenu: "EmptyMenu",
       appletMenuRight:"PartnerMenu",
             viewTitle: "Testimonials",
             summaryTemplate : ReferralWire.Templatecache.StdFormNarrow,
             detailTemplate : ReferralWire.Templatecache.TestimonialsDisplay,
             refWizard:refWiz,
           });
     }, 
     */

     
     PartnerReferrals:function(partnerId){
      
      var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
      this.ReferralsMasterTwoDetail({ 
        masterApplet:"PartnerAppletForm",
        masterRecordId:partnerId,
        appletMenu: "EmptyMenu",
        appletMenuRight:"PartnerMenu",
        refWizard:refWiz,
        clickRoute:"partnerReferrals",
        detail1ListApplet:"ReferralInboxUnlimited",
        detail2ListApplet:"ReferralOutboxUnlimited",
        detail1ListTemplate:rwApp.getPartnerReferralReceivedTempl,
        detail2ListTemplate:rwApp.getPartnerReferralGivenTempl,
        //detail2ListTemplate:ReferralWire.Templatecache.PartnerReferralOutBox,PartnerReferralOutbox
        viewBarApplet:rwApp.getAddrListViewBarApplet,
        viewBarTemplate:rwApp.getAddrViewBarTemplate,
        tooltipSource:"partnerReferrals",
        sortby:"rw_created_on",
        sortOrder:"DESC"
       });
       
     },
     //partnerRecommendations
     PartnerRecommendations:function(partnerId){
     
      var refWiz = rwApp.ContactRefWizard_Recommendation();
      
      this.GenericMasterDetailPattern({ 
        masterApplet:"PartnerSocialForm",
        masterTemplate:'SpecialtiesMasterPartner'(),
        masterRecordId:partnerId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"RecommendedProspects",
        detailListTemplate: 'RecommendationsList',
        searchSpec: {filter:[
                    {
                          ftype:"expr", 
                          expression:"{type : 'CUST_FOR_PART'}"
                        },
                        {
                          ftype:"expr", 
                          expression:"{status : {$ne:'IGNORED'}}"
                        },
                ]},
        detailSearchSpec: { partnerId : "id" },
            dynamicTitles:[
               {template:"Recommendations for <span class='partnerName light'>ZValue</span>",
                  fields:[
                          {fullName:"ZValue"}
               ]}
            ],
        viewBarApplet:rwApp.getAddrRecViewBarApplet, //"PartnerRecommendationsViewBar" 
        viewBarTemplate:rwApp.getAddrViewBarTemplate,
        MDTemplate:'MasterDetailViewNarrow'(),
        sortby : "score",
        sortOrder : "DESC",
        limit:3,
        secondTierNav:[{label:"Prospects",state:"selected",iconId:"recProspectIcon_sel",route:"",key:""},
                {label:"Power Partners",state:"",iconId:"recPowerPartner",route:"powerRecommendations",key:"id"},
                {label:"Service Providers",state:"",iconId:"recResources",route:"resourceRecommendations",key:"id"}],
        shareFunction:function(options){
                var sendTo = options.detailRecord.get('contact_emailAddress'); 
                rwApp.sharePartnerInfo({model:options.model,sendTo:sendTo});
                },        
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            refWizard:refWiz
                
     });
       
     },
     
     PowerPartnerRecommendations:function(partnerId){
      var refWiz = rwApp.ContactRefWizard_P2PRecommendation();
      this.GenericMasterDetailPattern({ 
        masterApplet:"PartnerSocialForm",
        masterTemplate:'SpecialtiesMasterPartner'(),
        masterRecordId:partnerId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"RecommendedProspects",
        detailListTemplate: 'RecommendationsList',
        searchSpec: {filter:[
                    {
                          ftype:"expr", 
                          expression:"{type : 'PART_FOR_PART'}"
                        },
                ]},
        detailSearchSpec: { partnerId : "id" },
            dynamicTitles:[
               {template:"Recommendations for <span class='partnerName light'>ZValue</span>",
                  fields:[
                          {fullName:"ZValue"}
               ]}
            ],
        viewBarApplet:rwApp.getAddrRecViewBarApplet,
        viewBarTemplate:rwApp.getAddrViewBarTemplate,
        MDTemplate:'MasterDetailViewNarrow'(),
        sortby : "score",
        sortOrder : "DESC",
        limit:3,
        secondTierNav:[{label:"Prospects",state:"",iconId:"recProspectIcon",route:"partnerRecommendations",key:"id"},
                {label:"Power Partners",state:"selected",iconId:"recPowerPartner_sel",route:"",key:""},
                {label:"Service Providers",state:"",iconId:"recResources",route:"resourceRecommendations",key:"id"}],
        shareFunction:function(options){
                var sendTo = options.detailRecord.get('contact_emailAddress'); 
                rwApp.sharePartnerInfo({model:options.model,sendTo:sendTo});
                },    
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            refWizard:refWiz
                
     });
       
     },
     
     ResourceRecommendations:function(partnerId){
      var refWiz = rwApp.ContactRefWizard_ServProvRecommendation();
      this.GenericMasterDetailPattern({ 
        masterApplet:"PartnerSocialForm",
        masterTemplate:'SpecialtiesMasterPartner'(),
        masterRecordId:partnerId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"RecommendedProspects",
        detailListTemplate:'RecommendationsList',
        searchSpec: {filter:[
            {
              ftype:"expr", 
              expression:"{type : 'PART_FOR_CUST'}"
            },
          ]},
        detailSearchSpec: { partnerId : "id" },
            dynamicTitles:[
               {template:"Recommendations for <span class='partnerName light'>ZValue</span>",
                  fields:[
                          {fullName:"ZValue"}
               ]}
            ],
        viewBarApplet:rwApp.getAddrRecViewBarApplet,
        viewBarTemplate:rwApp.getAddrViewBarTemplate,
        MDTemplate:'MasterDetailViewNarrow'(),
        sortby : "score",
        sortOrder : "DESC",
        limit:3,
        secondTierNav:[{label:"Prospects",state:"",iconId:"recProspectIcon",route:"partnerRecommendations",key:"id"},
                {label:"Power Partners",state:"",iconId:"recPowerPartner",route:"powerRecommendations",key:"id"},
                {label:"Service Providers",state:"selected",iconId:"recResources_sel",route:"",key:""}],
        shareFunction:function(options){
                var sendTo = options.detailRecord.get('partner_emailAddress'); 
                rwApp.sharePartnerInfo({model:options.detailRecord,sendTo:sendTo});
                },    
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            refWizard:refWiz
                
     });
       
     },
     
  
     OrgListDetail : function(selectedId){
          
       this.GenericListDetailPattern ( {
        listapplet : "OrganizationAppletList",
        //usePaging:false,
        sortby : "businessName",
        formapplet : "OrganizationAppletForm",
        viewBarApplet : "OrgViewBar",
        clickRoute : "OrgList",
        selectedId : selectedId,
        appletMenu: rwApp.getAppletMenu,
        viewTitle:"Chapters",
        //viewTemplate:'ChapterDisplayView',
        listTemplate : 'ChapterList',
        formTemplate : 'ChapterHomeForm',
        inlineMap:true,
        upsertApplet:"OrganizationAppletForm",
        inlineClock:"meetingHour",
        secondTierNav:[{label:"Chapter Info",state:"selected",iconId:"ChapterHome_sm_sel",route:"",key:""},
                {label:"Map",state:"",iconId:"MapIcon_black",route:"OrgListMap",key:""}],
        savedSearch: {
                  searchGroup:" ",
                  actor:"OrgMgr",
                  bo:"Organization",
                  bc:"Organization",
                  searchAppletName:"OrgSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Chapter Search",
                  //dssName:dssName,
                  //dssModel:dssModel
        }
      });
      //OrgSearchForm
      
       
     },
    
     
     OrgListMap : function(selectedId){
         
       this.GenericListDetailPattern ( {
        listapplet : "OrganizationAppletList",
        //usePaging:false,
        sortby : "businessName",
        formapplet : "OrganizationAppletForm",
        viewBarApplet : "OrgViewBar",
        clickRoute : "OrgListMap",
        selectedId : selectedId,
        appletMenu:"EmptyMenu",
        viewTitle:"Chapters",
        viewTemplate:'ChapterDisplayView',
        listTemplate : 'ChapterList',
        formTemplate : 'ChapterHomeForm',
        listMap:true,
        secondTierNav:[{label:"Chapter Info",state:"",iconId:"ChapterHome_sm",route:"OrgList",key:"id"},
                {label:"Map",state:"selected",iconId:"MapIcon_sm",route:"",key:""}],
      viewTemplate:'ListMapView',
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
        shape:"",
      listMap:true,
        done:function(ldview){
          ldview.options.listMapOptions = {
          popTemplateSelector:".mapPopUpSelectorChapter",
          //fieldMap:{businessName:"ZfullName",establishmentName:"Zbusiness",photoUrl:"Zpicture"},
          fieldMap:{photoUrl: rwFB.CDN + "/images/emptyPic.png",businessName:"Zbusiness",ambassador_fullName:"ZAmbassador",greeting:"Zgreeting",meetingDayOfWeek:{placeHolder:"ZDayOfWeek",transform:function(val){return $.getDayOfWeek(val)}},meetingHour:{placeHolder:"ZTime",transform:function(val){return $.getTimeStringVal(val)}},streetAddress1_work:"ZStreet",cityAddress_work:"ZCity",establishmentName:"ZEstablishment"},
        },
          ldview.renderListMap();
        },        
      });
      
       
     },
     
     
     OrgMembers : function(selectedId){
      
        this.GenericMasterDetailPattern({ 
        masterApplet:"OrganizationShortForm",
        masterTemplate: 'ChapterFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"MemberAppletList",
        detailRenderer : ReferralWireView.ListView,
        sortby:"fullName",
        clickRoute : "OrgMembers",
        //clientSideSortAttr : "child_DisplaySeq",
        detailListTemplate: 'ChapterMemberList',
        detailSearchSpec: { OrgId : "id" },
            dynamicTitles:[
               {template:"ZValue Members",
                  fields:[
                          {businessName:"ZValue"}
               ]}
            ],
        viewBarApplet:"OrgViewBar",
        clientFKFilter:true,
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
                
       });
        
     },
     
     OrgPhotos: function(profileId){
          this.GenericSummaryDetailPattern ( {
              summaryapplet : "OrganizationShortForm",
              summaryTemplate: 'ChapterFormNarrow',
              //viewTemplate:ReferralWire.Templatecache.LeftNavSummaryDetailView,
              //profileNavigation:true,
              detailapplet : "ProfileImages",
              viewBarApplet:"OrgViewBar",
              clickRoute : "OrgPhotos",
              viewTitle:"Chapter Photos",
              selectedId : profileId,
              appletMenu: rwApp.getAppletMenu,
              detailTemplate : 'PhotoGalleryThumbs'
            });
        
      },
     
     OrgEvents : function(selectedId){
        // this is a visiblity hack:  if user isn't an ambassador - show them upcoming Events
        

        this.GenericMasterDetailPattern({ 
        masterApplet:"OrganizationShortForm",
        masterTemplate:'ChapterFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: rwApp.getAppletMenu,
        detailListApplet: rwApp.getEventsList,// "EventList",
        detailRenderer : ReferralWireView.ListView,
        upsertApplet:"EventNewForm",
        parentDefaultVals:{
          OrgId:"id",
          locationName:"establishmentName",
          locationImageUrl:"logoUrl",
          datetime:{functionName:$.calcNextMeeting,functionArg:['meetingDayOfWeek','meetingHour']},
          //time:{functionName:$.calcNextMeeting,functionArg:['meetingDayOfWeek','meetingHour']},
          date:{functionName:$.calcNextMeetingDate,functionArg:['meetingDayOfWeek']},
          day:{functionName:$.calcNextMeetingDay,functionArg:['meetingDayOfWeek']},
          title:'businessName',
          streetAddress1_work:"streetAddress1_work",
          cityAddress_work:"cityAddress_work",
        stateAddress_work:"stateAddress_work",
        postalCodeAddress_work:"postalCodeAddress_work"
        },
        clickRoute:"OrgEvents",
        //sortBy:"datelong",
        clientSideSortAttr : "datelong",
        clientSideSortDirection: "DESC",
        detailListTemplate:'EventList',
        detailSearchSpec: { OrgId : "id" },
            dynamicTitles:[
               {template:"ZValue Events",
                  fields:[
                          {businessName:"ZValue"}
               ]}
            ],
        viewBarApplet:"OrgViewBar",
        clientFKFilter:true,
        listItemClass:"childList",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            done:function(view){
              $(".masterDetailListFrame").addClass("eventList");
              var OrgId = view.options.masterview.model.get('id');
              var ambassadorId = view.options.masterview.model.get('ambassadorId');
              if (!(rwFB.isAmbassador == "true" && rwFB.OrgId == OrgId) && ambassadorId != rwFB.uId){
                  $(".viewtitle").html("Upcoming " + $(".viewtitle").html());
              } 
            }
                
       });
        

     },
     
     OrgDashboard : function(selectedId){

        
        this.GenericMasterDetailPattern({ 
        masterApplet:"OrganizationShortForm",
        masterTemplate:'ChapterFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        detailListApplet:"AttendeeInvitedOrCheckedInList",
        detailRenderer : ReferralWireView.TableChartView,
        //clientSideSortAttr : "fullName",
        detailListTemplate: 'AttendenceChart',
        detailSearchSpec: { OrgId : "id" },
            viewTitle:"Dashboard",
            MDTemplate: 'ChapterDashBoardView',
        viewBarApplet:"OrgViewBar",
        clientFKFilter:true,
        clickRoute : "OrgDashboard",
        secondTierNav:[{label:"Attendance",state:"selected",iconId:"EventCheckedIn_sm",route:"",key:""},
                {label:"Online Invitations",state:"",iconId:"OnlineInvites_sm",route:"OrgDashReferrals",key:"id"},
                {label:"Meeting Guests",state:"",iconId:"EventGuest_sm_black",route:"OrgDashGuests",key:"id"},
                {label:"Referrals",state:"",iconId:"EventGuest_sm_black",route:"OrgDashProspectRef",key:"id"}],

            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
                
       });

     },
     
     OrgDashReferrals : function(selectedId){

        this.GenericMasterDetailPattern({ 
        masterApplet:"OrganizationShortForm",
        masterTemplate:'ChapterFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        act:"mostOnlineInvitesInChapter",
        detailListApplet:"MostInvitesInChapter",
        detailRenderer : ReferralWireView.BasicChartView,
        //clientSideSortAttr : "fullName",
        detailListTemplate: 'AttendenceChart',
        detailSearchSpec: { invitedBy_OrgId : "id" },
            viewTitle:"Dashboard - New Members Invited Online",
            MDTemplate: 'ChapterDashBoardViewChart',
        viewBarApplet:"OrgViewBar",
        //clientFKFilter:true,
        clickRoute : "OrgDashboard",
        secondTierNav:[{label:"Attendance",state:"",iconId:"EventCheckedIn_sm_black",route:"OrgDashboard",key:"id"},
                {label:"Online Invitations",state:"selected",iconId:"OnlineInvites_sm_sel",route:"",key:""},
                {label:"Meeting Guests",state:"",iconId:"EventGuest_sm_black",route:"OrgDashGuests",key:"id"},
                {label:"Referrals",state:"",iconId:"EventGuest_sm_black",route:"OrgDashProspectRef",key:"id"}],
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            transformOptions:{
              transformFunction:$.formatGroupBy,
              categoryField:'fullName',
              drillDownString:'#MemberOnlineInvites/ZIdentifier',
              ZIdentifier:"_id",
              series:[{name:'numNewMembers',field:'count',label:'New Members'}],
            },
            
            done:function(masterDetailView){
              var summaryData = masterDetailView.primaryChildListView.chartData;
              
              chartData = {
                topMembers:summaryData.categoryAry,
                title:"Last Eight Weeks",
                topMemberValues:summaryData.series.numNewMembers.values,
                unitLabel:"",
                renderTo:"chart1"
              }

          
              $.renderStandardBarChart(chartData);
              $("#chartTitle").html("Top 5 All Stars: Most New Online Invitations Accepted");
              /*
              var OrgId = masterDetailView.options.masterview.model.get('id');
              var ambassadorId = masterDetailView.options.masterview.model.get('ambassadorId');
              if (!(rwFB.isAmbassador == "true" && rwFB.OrgId == OrgId) && ambassadorId != rwFB.uId){
                  $(".secondTier").addClass("noattendance");
              } 
              */
            }
              
      
       });

     },
     OrgDashProspectRef : function(selectedId){

        this.GenericMasterDetailPattern({ 
        masterApplet:"OrganizationShortForm",
        masterTemplate:'ChapterFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        act:"mostPRefInChapter",
        detailListApplet:"MostInvitesInChapter",
        detailRenderer : ReferralWireView.BasicChartView,
        //clientSideSortAttr : "fullName",
        detailListTemplate: 'AttendenceChart',
        detailSearchSpec: { fromId : "id" },
            viewTitle:"Dashboard - Prospect Referrals Given",
            MDTemplate: 'ChapterDashBoardViewChart',
        viewBarApplet:"OrgViewBar",
        //clientFKFilter:true,
        clickRoute : "OrgDashboard",
        secondTierNav:[{label:"Attendance",state:"",iconId:"EventCheckedIn_sm_black",route:"OrgDashboard",key:"id"},
                {label:"Online Invitations",state:"",iconId:"OnlineInvites_sm",route:"OrgDashReferrals",key:"id"},
                {label:"Meeting Guests",state:"",iconId:"EventGuest_sm_black",route:"OrgDashGuests",key:"id"},
                {label:"Referrals",state:"selected",iconId:"EventGuest_sm_black",route:"OrgDashProspectRef",key:"id"}],
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            transformOptions:{
              transformFunction:$.formatGroupBy,
              categoryField:'fullName',
              drillDownString:'#MostPRefInChapterDrill/ZIdentifier',
              ZIdentifier:"_id",
              series:[{name:'numNewMembers',field:'count',label:'New Members'}],
            },
            
            done:function(masterDetailView){
              var summaryData = masterDetailView.primaryChildListView.chartData;
              
              chartData = {
                topMembers:summaryData.categoryAry,
                title:"Last Eight Weeks",
                topMemberValues:summaryData.series.numNewMembers.values,
                unitLabel:"",
                renderTo:"chart1"
              }

          
              $.renderStandardBarChart(chartData);
              $("#chartTitle").html("Top 5 All Stars: Most New Prospect Referrals Given");
              /*
              var OrgId = masterDetailView.options.masterview.model.get('id');
              var ambassadorId = masterDetailView.options.masterview.model.get('ambassadorId');
              if (!(rwFB.isAmbassador == "true" && rwFB.OrgId == OrgId) && ambassadorId != rwFB.uId){
                  $(".secondTier").addClass("noattendance");
              } 
              */
            }
              
      
       });

     },
     
     OrgDashGuests : function(selectedId){
     
        this.GenericMasterDetailPattern({ 
        masterApplet:"OrganizationShortForm",
        masterTemplate:'ChapterFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "EmptyMenu",
        act:"mostGuestInvitesInChapter",
        detailListApplet:"MostInvitesInChapter",
        detailRenderer : ReferralWireView.BasicChartView,
        //clientSideSortAttr : "fullName",
        //detailListTemplate: 'AttendenceChart',
        detailSearchSpec: { fromBusinessId : "id" },
            viewTitle:"Dashboard - New Members Invited to Meetings",
            MDTemplate:'ChapterDashBoardViewChart',
        viewBarApplet:"OrgViewBar",
        clientFKFilter:true,
        clickRoute : "OrgDashboard",
        secondTierNav:[{label:"Attendance",state:"",iconId:"EventCheckedIn_sm_black",route:"OrgDashboard",key:"id"},
                {label:"Online Invitations",state:"",iconId:"OnlineInvites_sm",route:"OrgDashReferrals",key:"id"},
                {label:"Meeting Guests",state:"selected",iconId:"EventGuest_sm",route:"",key:""},
                {label:"Referrals",state:"",iconId:"EventGuest_sm_black",route:"OrgDashProspectRef",key:"id"}],
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",

            transformOptions:{
              transformFunction:$.formatGroupBy,
              categoryField:'fullName',
              drillDownString:'#MemberGuestInvites/ZIdentifier',
              ZIdentifier:"_id",
              series:[{name:'numGuests',field:'count',label:'New Members'}],
            },
                
              
            done:function(masterDetailView){
              var summaryData = masterDetailView.primaryChildListView.chartData;
              
        chartData = {
                topMembers:summaryData.categoryAry,
                title:"Last Eight Weeks",
                topMemberValues:summaryData.series.numGuests.values,
                unitLabel:"",
                renderTo:"chart1"
              }
          
              $.renderStandardBarChart(chartData);
              $("#chartTitle").html("Top 5 All Stars: Most New Meeting Guests");
              /*
              var OrgId = masterDetailView.options.masterview.model.get('id');
              var ambassadorId = masterDetailView.options.masterview.model.get('ambassadorId');
              if (!(rwFB.isAmbassador == "true" && rwFB.OrgId == OrgId) && ambassadorId != rwFB.uId){
                  $(".secondTier").addClass("noattendance");
              } 
              */
              
      }       
       });

     },
     
      // doesn't support paging (and may never). Doesn't support saved search either, but probably could with a significant amount 
    AllUpcomingEvents : function(selectedId) {
      var f = new Array();
      var z = rwFB.postalCode;
      f[0] = {ftype:"time",period:"120",max:"10080",fieldname:"datetime"};

      if ($.hasVal(z)){f[1] = {ftype:"proximity",from:z,distance:50};};

        this.GenericListDetailPattern({
          listapplet : "UpcomingEventList",
          usePaging:true,
          sortby : "datelong",
          //sortOrder : "DESC",
          bo:"Event",
          bc:"Event",
          searchSpec:{filter:f},
          calculatedFields: {
            dayName:function(model){
              var dateVal = (_.isObject(model.get('datetime')))?model.get('datetime').$date:model.get('datetime');
              var date = new Date(dateVal);
              var retVal = rwcore.getLovDisplayVal('WEEKDAY',date.getDay());
              retVal += ", " + dateFormat(new Date(dateVal),'mmm d'); 
              return retVal;
            },
            orgPhotoUrl:function(model){
              return model.get('photoUrl');
            },
          },
          formapplet : "EventMasterForm",
          viewBarApplet : "EventsViewBar",
          clickRoute : "AllUpcomingEvents",
          selectedId : selectedId,
          appletMenu: rwApp.getAppletMenu,
          viewTitle:"All Upcoming Meetings - Next 7 Days",
          //viewTemplate:'ChapterDisplayView',
          listTemplate : 'AllEventList',
          formTemplate : 'EventFormAll',
          inlineMap:true,
            done:function(lview){
              $(".rw_details").addClass("event")
            }
          
        });
    },
     
    MyEvents : function(selectedId){
    var myexpr = "{partyId:'myid'}";
    myexpr = myexpr.replace('myid',rwFB.uId);
        this.GenericListDetailPattern ( {
        listapplet : "MyEvents",
        usePaging:true,
        searchSpec:{
                filter:[
                  {
                    ftype:"expr", 
                    expression:"{status:'CHECKEDIN'}",
                  },
                  {
                    ftype:"expr", 
                    expression:myexpr,
                  }
              ]
        },
        sortby : "denorm_datetime",
        sortOrder : "DESC",
        bo:"Attendee",
        bc:"Attendee",
        formapplet : "EventMasterForm",
        viewBarApplet : "EventsViewBar",
        clickRoute : "MyEvents",
        //selectedId : selectedId,
        appletMenu: "EmptyMenu",
        viewTitle:"My Events",
        //viewTemplate:'ChapterDisplayView',
        listTemplate : 'MyEventList',
        formTemplate : 'EventFormAll',
        inlineMap:true,
        calculatedFields: {
            
        orgPhotoUrl:function(model){
                    return model.get('Org_photoUrl');
            },

          },
        done:function(lview){
              $(".rw_details").addClass("event")
            }
        });

     },

     EventExpected : function(selectedId){
        
        this.GenericMasterDetailPattern({ 
        masterApplet:"EventNewForm",
        masterTemplate:'EventFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: rwApp.getAppletMenu,
        detailListApplet:"AttendeeExpectedList",
        detailRenderer : ReferralWireView.ListView,
        MDTemplate: 'MasterDetailSearchListView',
        sortby : "fullName_denorm",
        detailListTemplate:rwApp.getTemplate,
        detailSearchSpec: { eventId : "id" },
        viewTitle:"Expecting",
        viewBarApplet:"AttendeeViewBar",
        clientFKFilter:true,
        clickRoute : "EventExpected",
        upsertApplet:"EventEditForm",
        filter:true,
        usePaging:true,
        listItemClass:"rw_listitem buttonright",
        //inlineClock:"datetime",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"EventAttendeeRightMenu",
                
       });

     },
     
      EventCheckedIn : function(selectedId){
        
        this.GenericMasterDetailPattern({ 
        masterApplet:"EventNewForm",
        upsertApplet:"EventNewForm",
        masterTemplate:'EventFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: rwApp.getAppletMenu,
        detailListApplet:"AttendeeCheckedInList",
        detailRenderer : ReferralWireView.ListView,
        searchSpec:{
                  filter:[
/*                    {
                          ftype:"expr", 
                          expression:"{guestType : 'MEMBER'}"
                        },
*/
                        {
                          ftype:"expr", 
                          expression:"{status : 'CHECKEDIN'}"
                        },
                ]
            },
        MDTemplate: 'MasterDetailSearchListView',
        sortby : "fullName_denorm",    
        detailListTemplate:rwApp.getTemplate,
        detailSearchSpec: { eventId : "id" },
        clientFKFilter:true,
        clickRoute : "EventCheckedIn",
        viewTitle:"Checked In",
        viewBarApplet:"AttendeeViewBar",
        filter:true,
        usePaging:true,
        listItemClass:"rw_listitem buttonright",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"EventAttendeeRightMenu",
                
       });

     },
     
     EventGuests : function(selectedId){
        
        this.GenericMasterDetailPattern({ 
        masterApplet:"EventNewForm",
        masterTemplate:'EventFormNarrow',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: rwApp.getAppletMenu,
        detailListApplet:"AttendeeCheckedInList",
        //detailRenderer : ReferralWire.ListView,
        clientSideSortAttr : "fullName",
        detailListTemplate:rwApp.getTemplate,
        detailSearchSpec: { eventId : "id" },
        clientFKFilter:true,
        searchSpec:{
                  filter:[
                    {
                          ftype:"expr", 
                          expression:"{guestType : {$in:['FLOATER','NEW_MEMBER']}}"
                        },
                        {
                          ftype:"expr", 
                          expression:"{status : 'CHECKEDIN'}"
                        },
                ]
            },
        clickRoute : "EventGuests",
            viewTitle:"Guests",
        viewBarApplet:"AttendeeViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"EventAttendeeRightMenu",
                
       });

     },
     

     
     professionList : function(selectedId){  
        this.GenericListDetailPattern ( {
        listapplet : "ProfessionPickApplet",
        //usePaging:true,
        sortby : "DisplaySeq",
        formapplet : "LOVFormApplet",
        //upsertApplet : "PersonalContact",
        formTemplate: 'PlainForm',
        viewBarApplet : "ProfessionListViewBar",
        clickRoute : "professionList",
        selectedId : selectedId,
        appletMenu:"EmptyMenu",
        viewTitle: "Professions",
        listTemplate:'SimpleList',
        listItemClass:"rw_listitem shortRow",
        //viewTemplate:'StdListDetailView',
        // cacheOptimize:'yes'
        //upsertWizard:rwApp.ContactUpsertWizard(),
        //refWizard:rwApp.ContactRefWizard,
        
     });

     },
     
     professionTarget : function(selectedId){
        
        this.MasterDetailWithNextPrev({ 
          nextPrev:{listapplet : "ProfessionPickAppletOld",sortby : "DisplaySeq"},
        masterApplet:"LOVFormApplet",
        masterTemplate:'PlainForm',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "ProfileTargetMenu",
        detailListApplet:"SelectedLOVs",
        detailRenderer : ReferralWireView.ListView,
        clientSideSortAttr : "child_DisplaySeq",
        detailListTemplate:'SimpleList',
        detailSearchSpec: { parentId : "id" },
        searchSpec:{
                  filter:[
                    {
                          ftype:"expr", 
                          expression:"{child_LovType : 'CONSUMER_CHAR'}"
                        }
                ]
            },
            dynamicTitles:[
               {template:"Default Target Criteria",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        viewBarApplet:"ProfessionTargetViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            upsertWizard:{
                    saveFunction:rwApp.SaveLovAssociation,
                    saveAssociationLovTypes:['CONSUMER_CHAR','CONSUMER_EVENT','BUSINESS_CHAR','BUSINESS_EVENT'],
                viewTemplate: 'WizardUpsertView',
                stations: ["Consumer Profile","Consumer Events","Business Profile","Business Events"],
                //firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
                firstApplet:{
                  name:"ConsumerCharCriteria",
                  renderer:ReferralWireView.AssociationView,
                  template:'StdList',
                  setFilter:false,
                  toApplet:"SelectedLOVs",
                    toSetFilter:false,
                    toHtmlTemplate:'SimpleList',
                    toClientSideSortAttr:"child_DisplaySeq",
                    toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                    associationMap:rwApp.professionCriteriaAssociationMap
                },
                nextAppletFunctions:{
                  ConsumerCharCriteria:function(model,wizSpec){return {
                    name:"ConsumerEventsCriteria",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"SelectedLOVs",
                      toSetFilter:false,
                      toHtmlTemplate:'SimpleList',
                      toClientSideSortAttr:"child_DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.professionCriteriaAssociationMap
                  }},
                  ConsumerEventsCriteria:function(model,wizSpec){return {
                    name:"BusinessCharCriteria",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"SelectedLOVs",
                      toSetFilter:false,
                      toHtmlTemplate:'SimpleList',
                      toClientSideSortAttr:"child_DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.professionCriteriaAssociationMap
                  }},
                  BusinessCharCriteria:function(model,wizSpec){return {
                    name:"BusinessEventsCriteria",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"SelectedLOVs",
                      toSetFilter:false,
                      toHtmlTemplate:'SimpleList',
                      toClientSideSortAttr:"child_DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.professionCriteriaAssociationMap
                  }}
                },
                
              }
                
       });
        

     },
     
     professionRefReason : function(selectedId){
        
        this.MasterDetailWithNextPrev({ 
          nextPrev:{listapplet : "ProfessionPickAppletOld",sortby : "DisplaySeq"},
        masterApplet:"LOVFormApplet",
        masterTemplate:'PlainForm',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "ProfileTargetMenu",
        detailListApplet:"SelectedLOVs",
        detailRenderer : ReferralWireView.ListView,
        sortby : "child_DisplaySeq",
        detailListTemplate:'SimpleList',
        detailSearchSpec: { parentId : "id" },
        searchSpec:{
                  filter:[
                    {
                          ftype:"expr", 
                          expression:"{child_LovType : 'C2P_REF_REASON'}"
                        }
                ]
            },
            dynamicTitles:[
               {template:"Referral Reasons",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        viewBarApplet:"ProfessionReasonViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            upsertWizard:{

                    saveFunction:rwApp.SaveLovAssociation,
                    saveAssociationLovTypes:['C2P_REF_REASON'],
                viewTemplate: 'WizardUpsertView',
                stations: ["Reasons","Skip"],
                //firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
                firstApplet:{
                  name:"ReferralReasons",
                  renderer:ReferralWireView.AssociationView,
                  template:'StdList',
                  setFilter:false,
                  toApplet:"SelectedLOVs",
                    toSetFilter:false,
                    toHtmlTemplate:'SimpleList',
                    toClientSideSortAttr:"child_DisplaySeq",
                    toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                    associationMap:rwApp.professionCriteriaAssociationMap
                },
                nextAppletFunctions:{
                  ReferralReasons:function(model,wizSpec){return {
                    name:"ReferralReasons",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"SelectedLOVs",
                      toSetFilter:false,
                      toHtmlTemplate:'SimpleList',
                      toClientSideSortAttr:"child_DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.professionCriteriaAssociationMap
                  }}
                },
                
              }
                
       });
        

     },
     
     PowerPartners : function(selectedId){
        
        this.MasterDetailWithNextPrev({ 
          nextPrev:{listapplet : "ProfessionPickAppletOld",sortby : "DisplaySeq"},
        masterApplet:"LOVFormApplet",
        masterTemplate:'PlainForm',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        appletMenu: "ProfileTargetMenu",
        detailListApplet:"SelectedLOVs",
        detailRenderer : ReferralWireView.ListView,
        sortby : "child_DisplaySeq",
        detailListTemplate:'SimpleList',
        detailSearchSpec: { parentId : "id" },
            dynamicTitles:[
               {template:"Default Power Partners",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        viewBarApplet:"ProfessionReasonViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            upsertWizard:{

                    saveFunction:rwApp.SaveCriteria,
                viewTemplate: 'WizardUpsertView',
                stations: ["Wealth and Property","Household","Professional"],
                //firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
                firstApplet:{
                  name:"ReferralReasons",
                  renderer:ReferralWireView.AssociationView,
                  template:'StdList',
                  setFilter:false,
                  toApplet:"SelectedLOVs",
                    toSetFilter:false,
                    toHtmlTemplate:'SimpleList',
                    toClientSideSortAttr:"child_DisplaySeq",
                    toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                    associationMap:rwApp.professionCriteriaAssociationMap
                },
                nextAppletFunctions:{
                  ReferralReasons:function(model,wizSpec){return {
                    name:"ReferralReasons",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"SelectedLOVs",
                      toSetFilter:false,
                      toHtmlTemplate:'SimpleList',
                      toClientSideSortAttr:"child_DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.professionCriteriaAssociationMap
                  }}
                },
                
              }
                
       });
        

     },
     
     criteriaList : function(selectedId){  
        this.GenericListDetailPattern ( {
        listapplet : "CriteriaListApplet",
        //usePaging:true,
        sortby : "DisplaySeq",
        formapplet : "LOVFormApplet",
        //upsertApplet : "PersonalContact",
        formTemplate: 'PlainForm',
        viewBarApplet : "CriteriaViewBar",
        clickRoute : "criteriaList",
        selectedId : selectedId,
        appletMenu:"EmptyMenu",
        viewTitle: "Criteria",
        listTemplate:'SimpleList',
        listItemClass:"rw_listitem shortRow",
        viewTemplate:'StdListDetailView',
        // cacheOptimize:'yes'
        //upsertWizard:rwApp.ContactUpsertWizard(),
        //refWizard:rwApp.ContactRefWizard,
        
     });

     },
     
     criteriaRefReason : function(selectedId){
      
        this.MasterDetailWithNextPrev({ 
        masterApplet:"LOVFormApplet",
        masterTemplate:'PlainForm',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        nextPrev:{listapplet : "CriteriaListApplet",sortby : "DisplaySeq"},
        appletMenu: "ProfileTargetMenu",
        detailListApplet:"SelectedLOVs",
        detailRenderer : ReferralWireView.ListView,
        clientSideSortAttr : "child_DisplaySeq",
        detailListTemplate:'SimpleList',
        detailSearchSpec: { parentId : "id" },
        clientFKFilter:true,
        searchSpec: {filter:[
              {
                ftype:"expr", 
                expression:"{child_LovType : 'C2P_REF_REASON'}"
              },
            ]},
            dynamicTitles:[
               {template:"Criteria <-> Referral Reasons Map",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        viewBarApplet:"CriteriaReasonViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            upsertWizard:{
                    saveFunction:rwApp.SaveLovAssociation,
                    saveAssociationLovTypes:['C2P_REF_REASON'],
                viewTemplate: 'WizardUpsertView',
                stations: ["Referral Reasons","Same"],
                //firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
                firstApplet:{
                  name:"ReferralReasons",
                  renderer:ReferralWireView.AssociationView,
                  template:'StdList',
                  setFilter:false,
                  toApplet:"SelectedLOVs",
                    toSetFilter:false,
                    toHtmlTemplate:'SimpleList',
                    toClientSideSortAttr:"child_DisplaySeq",
                    toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                    associationMap:rwApp.professionCriteriaAssociationMap
                },
                nextAppletFunctions:{
                  ReferralReasons:function(model,wizSpec){return {
                    name:"ReferralReasons",
                    renderer:ReferralWireView.AssociationView,
                    template:'StdList',
                    setFilter:false,
                    toApplet:"SelectedLOVs",
                      toSetFilter:false,
                      toHtmlTemplate:'SimpleList',
                      toClientSideSortAttr:"child_DisplaySeq",
                      toCustomRowAttr:{attrName:"data-icon",attrVal:"delete"},
                      associationMap:rwApp.professionCriteriaAssociationMap
                  }}
                },
                
              }
                
       });
        

     },
     
     criteriaInfoConnect : function(selectedId){
      
        this.MasterDetailWithNextPrev({ 
        masterApplet:"LOVFormApplet",
        masterTemplate:'PlainForm',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        nextPrev:{listapplet : "CriteriaListApplet",sortby : "DisplaySeq"},
        appletMenu: "MasterDetailNewMenu",
        detailListApplet:"SelectedLOVs",
        detailRenderer : ReferralWireView.ListView,
        clientSideSortAttr : "child_DisplaySeq",
        clickRoute:"criteriaInfoConnect",
        detailListTemplate:'SimpleList',
        detailSearchSpec: { parentId : "id" },
        clientFKFilter:true,
        searchSpec: {filter:[
              {
                ftype:"expr", 
                expression:"{child_LovType : 'INFOCONNECT'}"
              },
            ]},
            dynamicTitles:[
               {template:"Criteria :: InfoConnect Map",
                  fields:[
                          {firstName:"ZValue"}
               ]}
            ],
        viewBarApplet:"CriteriaInfoConnectViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            upsertApplet:"CriteriaInfoConnectMap",
            parentDefaultVals:{ parentId : "id",parent_GlobalVal:"GlobalVal",parent_DisplayVal:"DisplayVal",parent_LovType:"LovType" },
            
                
       });
        

     },
     
     
     infoConnectList : function(selectedId){  
        this.GenericListDetailPattern ( {
        listapplet : "GenericLovList",
          searchSpec: {filter:[
        {
              ftype:"expr", 
              expression:"{LovType : 'INFOCONNECT'}"
            },
        ]},
        //usePaging:true,
        sortby : "DisplaySeq",
        formapplet : "LOVFormApplet",
        //upsertApplet : "PersonalContact",
        formTemplate: 'PlainForm',
        viewBarApplet : "InfoConnectViewBar",
        clickRoute : "infoConnectList",
        selectedId : selectedId,
        appletMenu:"EmptyMenu",
        viewTitle: "InfoConnect Values",
        listTemplate:'SimpleList',
        listItemClass:"rw_listitem shortRow",
        viewTemplate:'StdListDetailView',
        // cacheOptimize:'yes'
        //upsertWizard:rwApp.ContactUpsertWizard(),
        //refWizard:rwApp.ContactRefWizard,
        
        });
     
     },
     
         
     infoConCriteria : function(selectedId){
      
        this.MasterDetailWithNextPrev({ 
        masterApplet:"LOVFormApplet",
        masterTemplate:'PlainForm',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        nextPrev:{listapplet : "GenericLovList",
                searchSpec: {filter:[
              {
                    ftype:"expr", 
                    expression:"{LovType : 'INFOCONNECT'}"
                  },
              ]},
            },
        appletMenu: "MasterDetailNewMenu",
        detailListApplet:"IC_CriteriaMap",
        searchSpec: {filter:[
              {
                ftype:"expr", 
                expression:"{parent_LovType : {$in:['CONSUMER_CHAR','CONSUMER_EVENT','BUSINESS_CHAR','BUSINESS_EVENT']}}"
              },
            ]},
        //detailRenderer : ReferralWire.ListView,
        clientSideSortAttr : "parent_DisplaySeq",
        clickRoute:"infoConCriteria",
        detailListTemplate:'StdExpandableChildList',
        detailSearchSpec: { childId : "id" },
        clientFKFilter:true,
            viewTitle:"InfoConnect::Criteria Map",
        viewBarApplet:"InfoConnectCriteriaViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            upsertApplet:"InfoConnectCriteriaMap",
            parentDefaultVals:{ childId : "id",child_GlobalVal:"GlobalVal",child_DisplayVal:"DisplayVal",child_LovType:"LovType"},                
       });
        

     },
     
     infoConParty : function(selectedId){
      
        this.MasterDetailWithNextPrev({ 
        masterApplet:"LOVFormApplet",
        masterTemplate:'PlainForm',
        masterRecordId:selectedId,//use this to find the parent record by its id
        parentKeyField:"id",//use this to find the child records
        nextPrev:{listapplet : "GenericLovList",
                searchSpec: {filter:[
              {
                    ftype:"expr", 
                    expression:"{LovType : 'INFOCONNECT'}"
                  },
              ]},
            },
        appletMenu: "MasterDetailNewMenu",
        detailListApplet:"IC_CriteriaMap",
        searchSpec: {filter:[
        {
              ftype:"expr", 
              expression:"{parent_LovType : 'CONTACT_ATTRIB'}"
            },
        ]},
        //detailRenderer : ReferralWire.ListView,
        clientSideSortAttr : "parent_DisplaySeq",
        clickRoute:"infoConParty",
        detailListTemplate:'StdExpandableChildList',
        detailSearchSpec: { childId : "id" },
        clientFKFilter:true,
            viewTitle:"InfoConnect::Contact Attributes Map",
        viewBarApplet:"InfoConnectPartyViewBar",
            //tooltipSource:"contactReferrals",
            //appletMenuRight:"ContactReferInviteMenu",
            upsertApplet:"InfoConnectPartyMap",
            parentDefaultVals:{ childId : "id",child_GlobalVal:"GlobalVal",child_DisplayVal:"DisplayVal",child_LovType:"LovType"},                
       });
        

     },
       
    AssocListDetail : function(selectedId){
         
       this.GenericListDetailPattern ( {
        listapplet : "AssociationAppletList",
        sortby : "businessName",
        formapplet : "AssociationAppletForm",
        viewBarApplet : "AssocViewBar",
        clickRoute : "AssocList",
        selectedId : selectedId
      });
       
     },


    referralLBMyProf: function(selectedId){// this view has sample chart data it is - and is currently just a mockup
       this.GenericSummaryDetailPattern ( {

          summaryapplet : "PartyAppletForm",
          summaryTemplate : 'LeaderBoardFormLikeMe',
          viewTemplate:'LeaderBoardSummaryDetailView',
          detailapplet : "PartyAppletForm",
          upsertApplet : "LeaderboardUpsertForm",
          viewBarApplet:"ReferralViewBar",
          clickRoute : "referralLBMyProf",
          appletMenu: "EmptyMenu",
          dynamicTitles:[
               {template:"Most Valuable Professionals",
                  fields:[
                          {profession:"Professional"},
               ]}
             ],
          selectedId:selectedId,
          detailTemplate : 'LeaderBoardMissingData',
          secondTierNav:[
            {label:"Top Power Partners",state:"",iconId:"Partner_sm",route:"referralLBMyPowerPartners",key:"id"},
            {label:"Leaders in my Profession",state:"",iconId:"Profession_sm_sel",route:"referralLBMyProf",key:"id"},
          ],

          
          done:function(ldview){
            
            var prof = ldview.options.listview.model.get('profession');
            var zip = ldview.options.listview.model.get('postalCodeAddress_work');
            var pp = ldview.options.listview.model.get('powerpartner1');
            //var powerp = 
            if ($.hasVal(prof) && $.hasVal(zip) && $.hasVal(pp) ){
              var cView = new ReferralWireView.ChartView({
                chartName:'ConvRefMyProf',//ConvRefMyProf
                containerEl:'chart1',
                contextVars:{myprofession:prof},
                catformat:$.formatThumbnailCat,
                //<div class='chartLabelFrame'><img class='chartLabelImg' src='photoUrl'><div class='chartLabelName'>fullName</div></div>"
              });
              cView.render();
            } else {
              $("#form1").show();
            }
            

          }
          
        });


   },     

   referralLBMyPowerPartners: function(selectedId){// this view has sample chart data it is - and is currently just a mockup
       this.GenericSummaryDetailPattern ( {

          summaryapplet : "PartyAppletForm",
          summaryTemplate : 'LeaderBoardFormPowerPartners',
          viewTemplate:'LeaderBoardSummaryDetailView',
          detailapplet : "PartyAppletForm",
          upsertApplet : "LeaderboardUpsertForm",
          viewBarApplet:"ReferralViewBar",
          clickRoute : "referralLBMyPowerPartners",
          appletMenu: "EmptyMenu",
          viewTitle: "Most Valuable Power Partners",
          /*
          dynamicTitles:[
               {template:"Most Valuable Power Partners",
                  fields:[
                          {profession:"Professional"},
               ]}
             ],
          */
          selectedId:selectedId,
          detailTemplate : 'LeaderBoardMissingData',
          secondTierNav:[
            {label:"Top Power Partners",state:"",iconId:"Partner_sm",route:"referralLBMyPowerPartners",key:"id"},
            {label:"Leaders in my Profession",state:"",iconId:"Profession_sm_sel",route:"referralLBMyProf",key:"id"},
          ],
          
          done:function(ldview){
            var prof = ldview.options.listview.model.get('profession');
            var zip = ldview.options.listview.model.get('postalCodeAddress_work');
            var pp = ldview.options.listview.model.get('powerpartner1');
            //var powerp = 
            if ($.hasVal(prof) && $.hasVal(zip) && $.hasVal(pp) ){
              var cView = new ReferralWireView.ChartView({
                chartName:'ConvRefMyPowerPartners',//ConvRefMyProf
                containerEl:'chart1',
                contextVars:{mypowerpartners:pp},
                catformat:$.formatThumbnailCat,
                //<div class='chartLabelFrame'><img class='chartLabelImg' src='photoUrl'><div class='chartLabelName'>fullName</div></div>"
              });
              cView.render();
            } else {
              $("#form1").show();
            }

          }
          
        });


   },  
    


     leaderBoardViewMeta: {
          summaryapplet : "PartnerProfileViewBar",
          summaryTemplate : 'ProfileNavigation',
          viewTemplate:'LeftSecondTierNavSummaryDetailView',
          detailapplet : "PartyAppletForm",
          upsertApplet : "PartyUpsertForm",
          viewBarApplet:"ReferralViewBar",
          clickRoute : "referralLeaderBoardMade",
          appletMenu: "EmptyMenu",
          viewTitle:"Leaderboard",
          selectedId : rwFB.uId,
          detailTemplate : 'LeaderboardMade',
          viewBarTemplate:'ReferralViewBarTemplate',
          secondTierNav:[
            {label:"All Prospect Referrals Made",state:"",iconId:"referralSent_sm",route:"referralLeaderBoardMade",key:""},
            {label:"Prospect Referrals Converted",state:"",iconId:"referralSentConverted_sm",route:"referralLeaderBoardConverted",key:""},
            {label:"New Members Invited",state:"",iconId:"referralNewInvitations_sm",route:"referralLeaderBoardInvited",key:""},
            {label:"Guests Invited to Meetings",state:"",iconId:"meetinGuestColor_sm",route:"referralLeaderBoardGuests",key:""}
          ],
          done:function(ldview){}
     }, 

    referralLeaderBoardMade: function(){// this view has sample chart data it is - and is currently just a mockup
       rwApp.leaderBoardViewMeta.done = function (ldview) {
        rwApp.renderReferralleaderBoardChart('prospects', ldview, 'chapter');
       }
       this.GenericSummaryDetailPattern (
          rwApp.leaderBoardViewMeta
       );
    },

    referralLeaderBoardConverted: function(){// this view has sample chart data it is - and is currently just a mockup
        rwApp.leaderBoardViewMeta.done = function (ldview) {
            rwApp.renderReferralleaderBoardChart('converted', ldview, 'chapter');
        }  
        this.GenericSummaryDetailPattern (
          rwApp.leaderBoardViewMeta
        );  
    },

    referralLeaderBoardInvited: function(){      
        rwApp.leaderBoardViewMeta.done = function (ldview) {
            rwApp.renderReferralleaderBoardChart('invited'. ldview, 'chapter');
        }  
        this.GenericSummaryDetailPattern (
          rwApp.leaderBoardViewMeta
        );           
    },

    referralLeaderBoardGuests: function(){
      
        var params = _.clone(this.leaderBoardViewMeta);
        params.viewTitle = "Leaderboard - Guests Invited"
        params.done = function(ldview){
          $(".metricHeader").html("similiar to the other leaderboards")
        }
        this.GenericSummaryDetailPattern (
          params
        );  
      
    },
       

    renderReferralleaderBoardChart : function( chart, ldview ) {
  
        var drawThis = function ( chart, ldview, dimension, weeks) { 
    
          var chartName =  'lbc_' + chart + dimension;
          console.log(chartName);

          var OrgId = ldview.options.detailview.model.get('OrgId');
          var profession = ldview.options.detailview.model.get('profession');

          var data = new rwcore.StandardCollection({ module : 'AnalyticsMgr', act : 'getChart', 
                name : chartName, since_date :  new Date(new Date().getTime() - 604800000*weeks), 
                  OrgId : OrgId, profession: profession });

          $.when(data.sync()).done( function( c ) { 
              var series = [];
              var chartType = 'bar';
              if( dimension == '_chapter') {
                for (var i = 0; i < c.length; i++) {
                  series[i] = { '_id' : c.models[i].get('_id')['fromId'], 'y' : c.models[i].get('total'), 
                        imgUrl : c.models[i].get('photoUrl'), name : c.models[i].get('fullName'), 
                            color: c.models[i].get('_id')['fromId'] ==  rwFB.uId ? 'green' : 'gray' };
                }
              }
              else if( dimension == '_self_professionAvg' || dimension == '_self_networkAvg' ) {
                series[0] = { '_id' : c.models[0].get('_id')['fromId'], 'y' : c.models[0].get('total'), 
                        imgUrl : c.models[0].get('photoUrl'), name : c.models[0].get('fullName'), 
                            color:  'gold' };
                series[1] = { '_id' : c.models[1].get('_id'), 'y' : c.models[1].get(c.models[1].get('_id')), 
                        imgUrl : rwFB.CDN + '/images/average.jpeg', name : c.models[1].get('_id'), 
                            color:  'green' };
                chartType = 'bar';
              }

              series = _.sortBy(series, function(item) { return item.y;});

              var mi = _.find(series, function(item) { return item._id == rwFB.uId });

              $('#myMetric1').text(mi.y);
              $('#lbc_header').html($('.metricNarrative#' + chartName).html());
              $('.metricNarrative #myMetric2').text(mi.y);
              $('.chartTitle#lbc_header').html($('.chartTitle#' + chartName).html());
              $('.chartSubTitle#lbc_header').html($('.chartSubTitle#' + dimension).html());

              var c1 = $('#lbc_header .distanceFromBoard #chapterName');
              if( !_.isUndefined(c1) ) 
                c1.text(ldview.options.detailview.model.get('org_businessName'));
              
              var c2 = $('.chartSubTitle #chapterName');
              if( !_.isUndefined(c2) ) 
                c2.text(ldview.options.detailview.model.get('org_businessName'));

              var cv = new ReferralWireView.ChartView( { 
                      containerEl : '#chart1',
                      chartType: chartType,
                      series : series,
                      pointWidth : 40,
                      seriesName : chartName,//chart,

                      formatter : 
                        function () {
                          var val = this.value;
                          var elem = _.find(series, function(item) { return item.name == val;} );
                          var htmlTemplate = "<div class='chartLabelFrame'><img class='chartLabelImg' src='Zsrc'><div class='chartLabelName'>ZfullName</div></div>";
                          var displayName = elem.name;
                          var imgUrl = _.isUndefined(elem.imgUrl) ? rwFB.CDN +  '/images/emptyPic.png' : elem.imgUrl;    
                          var html=htmlTemplate.replace("Zsrc",imgUrl);
                          html = html.replace("ZfullName",displayName);
                          return html;
                        }          
              });
              cv.render();  

          });
        }

        drawThis( chart, ldview, $("input[name*=dimension]:checked").val(), 8);
        $("input[name*=dimension]").change( function(event) { 
            drawThis( chart, ldview, $("input[name*=dimension]:checked").val(), 8);
        });

       // $('#weeks_slider').on('slidestop', function( event ) { alert(event.target.val(); });

    },

    
     ReferralInbox : function(selectedId){
       


         this.GenericListDetailPattern ( {
          listapplet : "ReferralInboxList",
          act:"InBox",
          listTemplate: 'InBoxList',
          //sortby : "rw_created_on",
          //sortOrder : "DESC",
          clientSideSortAttr: "statusCategory",
          calculatedFields: {
            statusCategory:function(model){
              return $.getProspectReferralStatusOrder(model);
            }
          },
          searchSpec: {filter:[
              {
                ftype:"expr",
                expression:"{referralType : 'CUST_FOR_PART'}" 
              },
              {
                ftype:"expr",
                expression:"{archiveFlag : { $ne: 'true' }}"
              }
            ]},
          formapplet : "ReferralInboxForm",
          formTemplate: rwApp.getReferralViewForm,
          viewBarApplet:"ReferralViewBar",
          viewTitle: "Received: Prospect Referrals",
          appletMenu:"ReferralInboxMenu",
          appletMenuTemplate:'ReferralMenuTemplate', //conditional confirm/convert content hardcoded in this template
          viewBarTemplate:'ReferralViewBarTemplate',
          clickRoute : "referralInbox",
          selectedId : selectedId,
          tooltipSource:"referralInbox",
          secondTierNav:[{label:"Connections",state:"",iconId:"recProspectIcon_sel",route:"ReferralInboxConnections",key:""},
            {label:"Prospects",state:"selected",iconId:"googleMaps",route:"",key:""}],

      })
     },

     ReferralInboxConnections : function(selectedId){
       
         this.GenericListDetailPattern ( {
          listapplet : "ReferralInboxList",
          act:"InBox",
          listTemplate: 'InBoxList',
          //sortby : "rw_created_on",
          //sortOrder : "DESC",
          clientSideSortAttr: "statusOrder",
          calculatedFields: {
            statusCategory:function(model){
              return $.getConnectionReferralStatus(model).msg;
            },
            statusOrder:function(model){
              return $.getConnectionReferralStatus(model).order;
            }
          },
          searchSpec: {filter:[
              {
                ftype:"expr",
                expression:"{referralType : {$in:['PART_FOR_PART','PART_INVITE']}}"
              },
              {
                ftype:"expr",
                expression:"{archiveFlag : { $ne: 'true' }}"
              }
            ]},
          formapplet : "ReferralInboxForm",
          formTemplate: rwApp.getReferralViewForm,
          viewBarApplet:"ReferralViewBar",
          viewTitle: "Received: Invitations and Connections",
          appletMenu:"ReferralInboxMenu",
          appletMenuTemplate:'ReferralMenuTemplate', //conditional confirm/convert content hardcoded in this template
          viewBarTemplate:'ReferralViewBarTemplate',
          clickRoute : "referralInbox",
          selectedId : selectedId,
          tooltipSource:"referralInbox",
          secondTierNav:[{label:"Connections",state:"selected",iconId:"recProspectIcon_sel",route:"",key:""},
            {label:"Prospects",state:"",iconId:"googleMaps",route:"referralInbox",key:""}],

      })
     },
     
     
     
     ReferralProspect : function (selectedId) {
       //find2
        this.GenericSummaryDetailPattern ( {
             summaryapplet : "ReferralProspect",
             detailapplet : "EmptyApplet",
             viewBarApplet:"ReferralProspectViewBar",
             clickRoute : "ReferralProspect",
             selectedId : selectedId,
         appletMenu: "ReferralInboxMenu",
         appletMenuTemplate:'ReferralMenuTemplate',
             viewTitle: "Prospect Background",
             dynamicTitles:[
               {template:"Not the right LinkedIn Member? Choose another <font class='contactName light'>ZValue YValue</font> here",
                  fields:[
                          {contact_firstName:"ZValue"},
                          {contact_lastName:"YValue"}
               ]}
             ],
             summaryTemplate : 'ReferralProspectSummaryForm',
             viewTemplate : 'MashupView',
             detailTemplate : 'NoRecordForm',
             showLinkedInProfile:true,
             tooltipSource:"referralProspect" 
             
           });
         
         
         
     },

     ReferralOutbox : function(selectedId){
         
         this.GenericListDetailPattern ( {
             listapplet : "ReferralOutboxList",
             act:"OutBox",
             listTemplate: 'OutBoxList',
             clientSideSortAttr: "statusCategory",
            calculatedFields: {
              statusCategory:function(model){
                return $.getProspectReferralStatusOrder(model);
              }
            },
            searchSpec: {filter:[
                {
                  ftype:"expr",
                  expression:"{referralType : 'CUST_FOR_PART'}" 
                },
              ]},
             sortby : "rw_created_on",
             sortOrder : "DESC",
             formapplet : "ReferralInboxForm",
             formTemplate: rwApp.getReferralViewOutForm,
             viewTitle: "Prospect Referrals from Me",
             viewBarApplet:"ReferralViewBar",
             appletMenu:"ReferralOutBoxMenu",
             appletMenuTemplate:'ReferralMenuTemplate', //conditional confirm/convert content hardcoded in this template
             viewBarTemplate:'ReferralViewBarTemplate',
             clickRoute : "referralOutbox",
             selectedId : selectedId,
             tooltipSource:"referralOutbox",
             secondTierNav:[{label:"Connections",state:"",iconId:"recProspectIcon_sel",route:"ReferralOutboxConnections",key:""},
                {label:"Prospects",state:"selected",iconId:"googleMaps",route:"",key:""}],
           });

     },

    ReferralOutboxConnections : function(selectedId){
         
         this.GenericListDetailPattern ( {
             listapplet : "ReferralOutboxList",
             act:"OutBox",
             listTemplate: 'OutBoxList',
             clientSideSortAttr: "statusOrder",
              calculatedFields: {
                statusCategory:function(model){
                  return $.getConnectionReferralOutStatus(model).msg;
                },
                statusOrder:function(model){
                  return $.getConnectionReferralOutStatus(model).order;
                }
              },
              searchSpec: {filter:[
                  {
                    ftype:"expr",
                    expression:"{referralType : {$in:['PART_FOR_PART','PART_INVITE']}}"
                  },
                ]},
             sortby : "rw_created_on",
             sortOrder : "DESC",
             formapplet : "ReferralInboxForm",

             formTemplate: rwApp.getReferralViewOutForm,
             viewTitle: "Referrals and Invitations From Me",
             viewBarApplet:"ReferralViewBar",
             appletMenu:"ReferralOutBoxMenu",
             appletMenuTemplate:'ReferralMenuTemplate', //conditional confirm/convert content hardcoded in this template
             viewBarTemplate:'ReferralViewBarTemplate',
             clickRoute : "referralOutbox",
             selectedId : selectedId,
             tooltipSource:"referralOutbox",
             secondTierNav:[{label:"Connections",state:"selected",iconId:"recProspectIcon_sel",route:"",key:""},
                {label:"Prospects",state:"",iconId:"googleMaps",route:"referralOutbox",key:""}],
           });

     },
     
     ReferralArchive : function(selectedId){
       
         this.GenericListDetailPattern ( {
              listapplet : "ReferralInboxArchive",
              act:"InBox",
              listTemplate: 'InBoxList',
            sortby : "rw_created_on",
            sortOrder : "DESC",
            formapplet : "ReferralInboxForm",
            formTemplate: rwApp.getReferralViewForm,
            viewBarApplet:"ReferralViewBar",
            viewTitle: "Referrals and Invitations Received",
            appletMenu:"ReferralArchiveMenu",
            //appletMenuTemplate:ReferralWire.Templatecache.ReferralMenuTemplate, //conditional confirm/convert content hardcoded in this template
            viewBarTemplate:'ReferralViewBarTemplate',
            clickRoute : "referralInbox",
            selectedId : selectedId,
            tooltipSource:"referralInbox"  
             });

     },
     
     
     ReferralOffersList : function(selectedId){
           this.GenericListDetailPattern ( {
            listapplet : "ReferralOfferList",
            listTemplate: 'StdList',
            //sortby : "timestamp",
            //sortOrder : "DESC",
            formapplet : "ReferralOfferForm",
            formTemplate: 'StdFormPlain',
            viewBarApplet:"ReferralOffersViewBar",
            clickRoute : "offers",
            viewTitle: "My Offers",
            selectedId : selectedId,
             });
      },
      
      

      

           
    
    
    renderMap : function (options){
      
    //var chapters = '[{"latLng":[37.79152699999999,-122.277433]},{"latLng":[38.5747954,-121.3814378]},{"latLng":[39.0319692,-121.0732576]},{"latLng":[39.7513277,-121.8552699]},{"latLng":[38.6782928,-121.2643037]},{"latLng":[37.8224087,-121.9988505]},{"latLng":[38.650861,-121.063847]},{"latLng":[38.4237575,-121.412741]},{"latLng":[38.655646,-121.125694]},{"latLng":[37.51057,-121.9510948]},{"latLng":[37.00835,-121.570197]},{"latLng":[39.9345913,-85.94902359999999]},{"latLng":[38.1341477,-121.2722194]},{"latLng":[37.7983446,-121.2179385]},{"latLng":[37.669132,-121.034392]},{"latLng":[36.5966382,-121.859075]},{"latLng":[39.2338422,-121.0363403]},{"latLng":[19.494246,-154.944561]},{"latLng":[38.7292042,-120.8007306]},{"latLng":[37.69173079999999,-121.8773783]},{"latLng":[40.4548823,-122.2959227]},{"latLng":[38.79871,-121.2931855]},{"latLng":[38.7494234,-121.2832601]},{"latLng":[38.6046579,-121.4321828]},{"latLng":[37.3208485,-121.9707129]},{"latLng":[37.5554733,-122.2929849]},{"latLng":[36.985079,-121.9557255]},{"latLng":[38.660111,-120.942335]},{"latLng":[37.9704501,-121.2994342]},{"latLng":[37.7534182,-121.4351442]},{"latLng":[38.347242,-121.998487]},{"latLng":[38.1099554,-122.2692013]},{"latLng":[34.263122,-119.2122185]},{"latLng":[37.8992511,-122.0618461]},{"latLng":[39.1412508,-121.644413]}]'
    //var mArray = jQuery.parseJSON(chapters);
    


      var mArray = options.mArray;
      var targetSelector = options.targetSelector;
      var zoom = ($.hasVal(options.zoom))?options.zoom:14;
      
      var centerAddress = ($.hasVal(options.centerAddress))?options.centerAddress:"330 Elati Ct. Danville CA 94526";
    $(targetSelector).gmap3('clear','markers');
    var that = this;
    that.options = options;
    
        if (mArray.length > 0){
              $(targetSelector).gmap3({
                map:{
                  options:{
                    center:centerAddress,
                    zoom: zoom,
                    maxZoom: 17
                  }
                },
                marker:{
                    values:mArray,
                    options:{
                      draggable: false
                    },
                    events:{
                      click: function(marker, event, context){
                        var id = context.tag;
                        // TODO: Peter, why do we need the following line.
                        // It is not working. parentView is coming up a undefined
                        
                        that.options.parentView.setNavContext(id);
                        var map = $(this).gmap3('get');
                        var infowindow = $(this).gmap3({get:{name:"infowindow"}});
                          if (infowindow){
                            infowindow.open(map, marker);
                            infowindow.setContent(context.data);
                          } else {
                            $(this).gmap3({
                                  'infowindow':{
                                    anchor:marker, 
                                    options:{content: context.data,maxWidth: 450}
                                  }
                                });
                          }
                      }  
                          },
                  
                },
                autofit:(mArray.length > 0)?{}:undefined
               });
        } else $(targetSelector).html("<div class='noresults'>0 results</div>");
      
    },

    getMapMarkerArray : function (lRecords,popUpTemplateSelector,fields,metaApplet){
      var retVal = new Object();
      var centerAddress = null;
      var latlngbounds;
      var markerArray = new Array();
      var i = 0;
      for (var rwRec in lRecords) {
        var model = lRecords[rwRec];
        
        if ($.hasVal(model.options) && model.options.module == "PartnerMgr"){
          var streetAddress1 = ($.hasVal(model.get('streetAddress1_work_pub')))?model.get('streetAddress1_work_pub'):"";
          var streetAddress2 = ($.hasVal(model.get('streetAddress2_work_pub')))?model.get('streetAddress2_work_pub'):"";
          var city = ($.hasVal(model.get('cityAddress_work_pub')))?model.get('cityAddress_work_pub'):"";
          var state = ($.hasVal(model.get('stateAddress_work_pub')))?model.get('stateAddress_work_pub'):"";
          var zip = ($.hasVal(model.get('postalCodeAddress_work_pub')))?model.get('postalCodeAddress_work_pub'):"";
          var lat = ($.hasVal(model.get('latitude_work_pub')))?model.get('latitude_work_pub'):"";
          var lng = ($.hasVal(model.get('longitude_work_pub')))?model.get('longitude_work_pub'):"";
        } else {
          var streetAddress1 = ($.hasVal(model.get('streetAddress1_work')))?model.get('streetAddress1_work'):"";
          var streetAddress2 = ($.hasVal(model.get('streetAddress2_work')))?model.get('streetAddress2_work'):"";
          var city = ($.hasVal(model.get('cityAddress_work')))?model.get('cityAddress_work'):"";
          var state = ($.hasVal(model.get('stateAddress_work')))?model.get('stateAddress_work'):"";
          var zip = ($.hasVal(model.get('postalCodeAddress_work')))?model.get('postalCodeAddress_work'):"";
          var lat = ($.hasVal(model.get('latitude_work')))?parseFloat(model.get('latitude_work')):undefined;
          var lng = ($.hasVal(model.get('longitude_work')))?parseFloat(model.get('longitude_work')):undefined;
        }
        if (lRecords.length == 1){
          //generating the map based on an address may be more accurate than using the saved lat lng (perhaps
          //because of some imprecision in how the lat lng is generated.) So if there's just one address - e.g.,
          //for an in-line map, we won't use the lat lng
          //
          lat = undefined;
          lng = undefined;
        }
        //lat = undefined;
        //lng = undefined;
        
        var address = streetAddress1 + " " + streetAddress2 +" "+city+" "+state+" "+zip;
        
        
        
        var snippetsHTML = _.template('Snippets')();
        //var popUpTemplate = $(ReferralWire.Templatecache.Snippets()).find(popUpTemplateSelector).html();
        var popUpTemplate = $(snippetsHTML).find(popUpTemplateSelector).html(); 
        for (item in fields){
          var fieldVal = ""
          var placeHolder = fields[item]; 
          if ($.hasVal(model.get(item))){
            modelVal = model.get(item);
            if (modelVal.length > 400){modelVal = modelVal.substr(0,400) + "..."} 
            if (_.isObject(placeHolder)){
              fieldVal = placeHolder.transform(modelVal);
              placeHolder = placeHolder.placeHolder;
              
            } else {
              fieldVal = modelVal;
            }   
          } 
          else {
            if (_.isObject(placeHolder)){
              placeHolder = placeHolder.placeHolder;
            }
          }

          popUpTemplate = popUpTemplate.replace(new RegExp(placeHolder, 'g'),fieldVal);
          
        }
        var popUpHTML = popUpTemplate;
        
        
        
        latlngbounds = new google.maps.LatLngBounds();
        

        if ($.hasVal(lat) && $.hasVal(lng)){
          var markerObj = {
            
            latLng:[lat,lng],
            tag:model.get('id'),
            data:popUpHTML,
            //options:{icon:record.iconImageFile}
          }
          if (centerAddress == null){centerAddress = [lat,lng];}
          markerArray[i] = markerObj;
          i++;
        }
        else {
          //if ($.hasVal(streetAddress1) && $.hasVal(zip)){
          if ($.hasVal(zip)){
            var markerObj = {
              address:address,
              tag:model.get('id'),
              data:popUpHTML,
              //options:{icon:record.iconImageFile}
            }
          markerArray[i] = markerObj;
          i++;  
          }
        }
        
        

      }
      retVal.markerArray = markerArray;
      retVal.latlngbounds = latlngbounds;
      retVal.centerAddress = centerAddress;
      return retVal;
    },
    
    showLinkedInList : function (options){
      $("#selectorPlaceholder").hide();
      $("#linkedInSelector").show();
    
  if ( !_.isUndefined(IN) ) {
    IN.User.authorize(function() {

      /*
      options.firstName = 'Sudhakar';
      options.lastName = 'Kaki';
      options.zipCode = '94526';
      */
      //options.contactLNId,
      
      var peopleList = ReferralWirePattern.lnPeopleSearch(options.firstName, options.lastName, options.zipCode,{
        success: function(models){
        
          var choiceView = new ReferralWireView.RadioList({
              applet:"LinkedInProfileList",
              template: 'LNRadioList',
              updateview:options.dview,
              model:models,
              lnId:options.contactLNId,
              htmlOnly:true,
              success : function(model, response, jqXHR) {
                //more stuff
              },
              //error : ReferralWire.showError
          });   
          var listel = ".choiceList"; 
            $(listel).html(choiceView.render(choiceView.model).el).trigger('create');
            
            //if we haven't previously
            var selectedId=options.contactLNId;
            if (_.isUndefined(options.contactLNId) || _.isNull(options.contactLNId) || options.contactLNId == "") {
              selectedId = models.models[0].get('LNProfileId');
              var updateOptions = {
                  dview:options.dview,
                  setFieldMap:{contactLNId:selectedId}
              }
              rwApp.updateKeyFieldSilent(updateOptions);
            }
            
            rwApp.showLinkedInProfile(selectedId);
                      
        }
        
      });
    
    });
  }
    },
 
  showLinkedInProfile : function (linkedInId){
  
    
    if ($.hasVal(linkedInId) && $.hasVal(localStorage) && $.hasVal(localStorage.getItem(linkedInId))){
      var cachedModelStr = localStorage.getItem(linkedInId);
      var cachedModel = jQuery.parseJSON(cachedModelStr);
      
      var cm = new rwcore.StandardModel({module:"UserMgr"});
      
      for (item in cachedModel){
        cm.set(item,cachedModel[item])
      }
      
      rwApp.renderLinkedInProfile(cm)
    } else if ( !_.isUndefined(IN) ) {
      IN.User.authorize(function() {
        ReferralWirePattern.GetUserLinkedInProfile(linkedInId, {
            success: function(model) {  
              
              if ($.hasVal(localStorage)){
                var modelStr = JSON.stringify(model);
                localStorage.setItem(linkedInId,modelStr);
                
              }
                
              rwApp.renderLinkedInProfile(model);
                
            },
            error: function(payload){
              var msg = payload.message;
              if (msg == "Throttle limit for calls to this resource is reached."){
                var friendlyMsg = "<font style='color:red;font-style:italic'>The number of LinkedIn profiles that can be viewed through ReferralWire in this 24 period has been reached. To view more prospect profiles, please visit <a href='http://www.linkedin.com' target='_blank'>LinkedIn</a> directly, or check back later.</font>";
                var el = ".profilePlatter";
                $(el).html(friendlyMsg);
              }
            }
          });
      });
    }
   
  },
  
  
  renderLinkedInProfile : function(model){
    var view = new ReferralWireView.FormView({ 
          applet: "LinkedInProfileForm", 
              templateHTML : 'LinkedInProfile',
              model:model,
              //htmlOnly : true,
              success : function(model, response, jqXHR) {
                  //rwApp.navigate('#home', {trigger: true,replace: true});
              },
              error : rwcore.showError
          });           
        var el = ".profilePlatter";
          $(el).html(view.render(view.model).el);
          $("#positions").replaceWith($.getFormattedLinkedInPositions(model.get('positions').values));
  },
     
    regLNProfile : function () {
        // ReferralWire.lnPeopleSearch('Anil','Advani','94306'); //TEST
      if ( !_.isUndefined(IN) ) {
        IN.User.authorize(function() {
          ReferralWirePattern.GetUserLinkedInProfile("me", {
            success: function(model) {
              var view = new ReferralWireView.FormView({ applet: "RegistrationForm", 
                      templateHTML : 'RegistrationTemplate',
                      success : function(model, response, jqXHR) {
                          rwApp.navigate('#home', {trigger: true});
                      },
                      error : rwcore.showError 
                  });
                  
                  view.setDefaultModel(model);
                  
                  // Save LNProfileId 
                  view.model.set({'LNProfileId': model.get('LNProfileId')});
                  view.model.set({'LNProfile': model.get('LNProfile')});

                  $('#regForm').html(view.render().el).trigger('create');
            }
          });
        });
        }
    },
       
    admin  : function ( page ) {
        
        $(rwApp.params.modules[1]).html(_.template('mainAdmin', {})).trigger('create'); 
        if (!_.isUndefined(page)) {
          if ( page === 'charts') 
                      ReferralWirePattern.ChartAdminPattern({containerEl : "#adminContainer"});
          else if ( page === 'metrics' )          
                      ReferralWirePattern.SystemMetricsReport({containerEl : "#adminContainer"});
          else if ( page === 'imageList' )          
                      ReferralWirePattern.SystemMetricsReport({containerEl : "#imageList"});
          else if ( page === 'tenant' )          
                      ReferralWirePattern.TenantAdmin({containerEl : "#adminContainer"});
        }

    },

    accountadmin: function(selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      this.GenericListDetailPattern ( {
      listapplet : "TenantList",
      listTemplate:"TenantList",
      formapplet : "TenantDetailsView",
      formTemplate: 'BasicForm',
      clickRoute : "accountadmin",
      selectedId : selectedId,
      appletMenu:"TenantUpdateMenu",
      viewTitle: "Account Administration",
      upsertApplet : "TenantDetailsEdit",
      viewBarApplet : "TenantViewBar"
     });

    }, 

    TenantReports : function(selectedId) {

        var drawMetrics = function ( title, event, unit, containerEl, since_date ) {      
          var inputParams = { module: 'AnalyticsMgr', act: 'getTrackerChart', name: 'EventSeries', 
                event: event, unit: unit, since_date: since_date };
          var data = new rwcore.StandardCollection(inputParams);
          
          $.when(data.sync()).done( function( c ) { 

              var series = [];

              for (var i = 0; i < c.length; i++) {
                var seriesItem = {};
                seriesItem['name'] = c.models[i].get('_id')[unit];
                seriesItem['y'] = c.models[i].get('total');
                series[i] = seriesItem;
              }

              new ReferralWireView.ChartView( { 
                      containerEl : containerEl,
                      ChartType: 'line',
                      ChartTitle: title,
                      subTitle: since_date.toDateString() + " - " + new Date().toDateString(),
                      yAxisTitle : 'total',
                      xAxisTitle : unit,
                      series : series,
                      formatter : function () {
                                return "<span>" + this.value + "</span>";
                      }
              }).render();      
          });
      }

      var unit = 'dayOfMonth';

      drawMetrics( 'Registrations Report', 'UM_REGISTER', unit,  '#chartContainer', new Date("2014/01/01")  );
      // drawMetrics( 'Login Activity Report', 'UM_LOGIN', unit,  '#UM_LOGIN_REPORT', new Date("2014/01/01")  );
      // drawMetrics( 'Inivitations Report', 'UM_SENTINVITATION', unit,  '#UM_SENTINVITATION_REPORT', new Date("2014/01/01")  );
      // drawMetrics( 'Referrals Report', 'UM_REFERRAL', unit,  '#UM_REFERRAL_REPORT', new Date("2014/01/01")  );
      // drawMetrics( 'Add Connections Report', 'UM_ADDCONNECTION', unit,  '#UM_ADDCONNECTION_REPORT', new Date("2014/01/01")  );
      // drawMetrics( 'Chapter Creation Report', 'UM_CREATEORG', unit,  '#UM_CREATEORG_REPORT', new Date("2014/01/01")  );
    

    },

    tenant: function(selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      this.GenericListDetailPattern ( {
      listapplet : "TenantList",
      listTemplate:"TenantList",
      usePaging:true,
      sortby : "tenant",
      formapplet : "TenantDetailsView",
      formTemplate: 'BasicForm',
      viewBarApplet : "TenantListViewBarMaster",
      clickRoute : "tenant",
      selectedId : selectedId,
      appletMenu:"TenantMasterMenu",
      viewTitle: "Account Administration",
      upsertApplet : "TenantDetailsEditMaster",
     });

    }, 

    listadmin: function(type, selectedId) {
      $("#singlePageWeb").addClass("adminPage");

      if ( !$.hasVal(type))  type = "profession";

      var uiMeta = { 

          "profession" :  { 
                          "viewTitle" : "Professions List Administration",
                          "list" : "ProfessionListApplet", 
                          "formAppletView" : "ProfessionViewApplet" , 
                          "formAppletUpdate" : "ProfessionUpdateApplet",
                          "listTemplate" : "SimpleList", 
                          "formTemplate" : "BasicForm" },

          "generic" :  {  
                          "viewTitle" : "Generic List Administration",
                          "list" : "GenericLovList", 
                          "formAppletView" : "LOVFormApplet" , 
                          "formAppletUpdate" : "LOVFormApplet",
                          "listTemplate" : "SimpleList", 
                          "formTemplate" : "BasicForm" },

          "onlinehelp" :  { 
                            "viewTitle" : "Online Help Videos Administration",
                            "list" : "OnlineHelpListApplet", 
                            "formAppletView" : "OnlineHelpViewApplet" , 
                            "formAppletUpdate" : "OnlineHelpUpdateApplet",
                            "listTemplate" : "SimpleList", 
                            "formTemplate" : "BasicForm" }
      
      }

      this.GenericListDetailPattern ( {
        listapplet : uiMeta[type]["list"],
        listTemplate: uiMeta[type]["listTemplate"],
        usePaging:true,
        sortby : "DisplayVal",
        formapplet : uiMeta[type]["formAppletView"],
        formTemplate: uiMeta[type]["formTemplate"],
        viewBarApplet : "ListAdminViewBar",
        clickRoute : "listadmin/" + type,
        selectedId : selectedId,
        appletMenu:"TenantMasterMenu",
        viewTitle: uiMeta[type]["viewTitle"],
        upsertApplet : uiMeta[type]["formAppletUpdate"] ,
     });

    }, 

   });
  
  return ReferralWireRouter;    
     
  })(Backbone, _, $, ReferralWireRouterBase || window.jQuery || window.Zepto || window.ender);
  
  return Backbone.ReferralWireRouter; 

}));
