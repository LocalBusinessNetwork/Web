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

  Backbone.ReferralWirePhoneRouter = ReferralWirePhoneRouter = (function(Backbone, _, $, ReferralWireRouterBase){
  
  var slice = Array.prototype.slice;
  
  var ReferralWirePhoneRouter  = ReferralWireRouterBase.extend({
      routes: {
        "home": "home",
        "phoneRefInbox":"phoneRefInbox",
        "Refer/:id" : "Refer",
        "ContactProfile/:id" : "ContactProfile",
        "ContactPartnerProfile/:id" : "ContactPartnerProfile",
        "ContactNativeProfile/:id":"ContactNativeProfile",
        "PhonePartnerContact/:id" : "PhonePartnerContact",
        "lookupPartnerProfile/:id":"lookupPartnersPhone",
        "lookupContactProfile/:partyId":"lookupContactPhone",
          "lookupPartnerProfile/:partyId/:partyType":"lookupPartnerPhone_P2P",
        "phoneQualifications/:id":"phoneQualifications",
        "phonePhotos/:id":"phonePhotos",
        "phoneTestimonials/:id":"phoneTestimonials",
        
        "membersalt":"members",
        "members":"members",
        "members/:id":"members",
        "nearMeAlt":"nearMe",
        "nearMe":"nearMe",
        "memberProfile/:id":"PhoneMemberContact",
        "PhoneMemberContact/:id":"PhoneMemberContact",
        "phoneMemberQualifications/:id":"phoneMemberQualifications",
        "phoneMemberPhotos/:id":"phoneMemberPhotos",
        "phoneMemberTestimonials/:id":"phoneMemberTestimonials",
        
        "phoneOrgList":"phoneOrgList",
        "phoneOrgList/:id":"phoneOrgList",
        "phoneOrgDetails/:id":"phoneOrgDetails",
      "phoneOrgMembers/:id":"phoneOrgMembers",
      "phoneOrgPhotos/:id":"phoneOrgPhotos",
      "phoneOrgEvents/:id":"phoneOrgEvents",
      "OrgEvents/:id":"phoneOrgEvents",
      "EventExpected/:id":"phoneEvent",
      "phoneEventExpected/:id":"phoneEventExpected",
      "phoneEventCheckedIn/:id":"phoneEventCheckedIn",
      "phoneEventGuests/:id":"phoneEventGuests",
      "phoneUpcomingEvents":"phoneUpcomingEvents",  
      "phoneUpcomingEvents/id":"phoneUpcomingEvents",
        "phoneRefOutbox":"phoneRefOutbox",

        //"nextPhone":"nextPhone",
        "/:toPartyId":"",
        "partners": "partners",
        "partners/:id": "partners",
        "referrals":"referrals",
        "contacts":"contacts",
        //"newPhoneContact":"newPhoneContact",
        "editPhoneContactWork/:id":"editPhoneContactWork",
        "editPhoneContactPartnerHome/:id":"editPhoneContactPartnerHome",
        "ContactProfileFromParty/:id":"ContactProfileFromPartyId",
        "signout": "signout",
                    
      },

      
      
      Refer : function(partnerId) {
      /*
       * Pick contact
       * Fillup questions
       * Compose email
       * Send 
       */
      },
      
      
      renderPhoneScreen : function(options) {
        
        
        //var el= options.el;
        //var formRoute = options.formRoute;
        var listItemClass = ($.hasVal(options.listItemClass))?options.listItemClass:"phoneListItem";
        var viewBarApplet = options.viewBarApplet;
        var suppressBack = ($.hasVal(options.suppressBack) && options.suppressBack)?true:false;
        var lastView = ReferralWireView.ChildViewContainer.findByCustom("phoneView");
        var contentEL = "<div id='ContentSection' data-role='content' style='position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;min-height:initial'></div>";
        
        if (!_.isUndefined(lastView)  && typeof(lastView) == "object"){
          lastView.undelegateEvents();
        }

        /*
        if (!_.isUndefined(lastView)  && typeof(lastView) == "object"){
          ReferralWireView.ChildViewContainer.remove (lastView);
          $("#ContentSectionOuter").html(contentEL);
        }
        */

          // get meta data for rendering
        
        var mainView = null;
        var appletMenu = null;
        var formView2 = null;
        var formView3 = null;
        var childList = null;
          
        if (!$.hasVal(options.mainRenderer) || options.mainRenderer == "ListView"){
          mainView = new ReferralWireView.ListView ({ 
            applet: options.listAppletName, 
            upsertTemplate: options.upsertTemplate,
            template: options.listTemplateHTML,
            filter:options.setFilter,
            refreshRoute:options.refreshRoute,
            routeIdField:options.routeIdField,
            usePaging:options.usePaging,
            noRecordsMsg:options.noRecordsMsg,
            clientSideSortAttr : options.clientSideSortAttr,
            listItemClass:listItemClass,formRoute:""});
        }
        
        if ($.hasVal(options.mainRenderer) && options.mainRenderer == "FormView"){
          mainView = new ReferralWireView.FormView({ 
            applet: options.formAppletName, 
            upsertTemplate: options.upsertTemplate,
            templateHTML : options.templateHTML,
            refreshRoute:options.refreshRoute,
            routeIdField:options.routeIdField,
            refreshFunction:options.refreshFunction,
            //cacheName:options.cacheName
            }); 
          
        }
        
        if ($.hasVal(options.mainRenderer) && options.mainRenderer == "ReferralMgmtListView"){
          mainView = new ReferralWireView.ReferralMgmtListView ({ 
            applet: options.listAppletName, 
            template: options.listTemplateHTML,
            listItemClass:listItemClass,
            filter:options.setFilter,
            formRoute:""});
          
        }
        
        if ($.hasVal(options.mainRenderer) && options.mainRenderer == "PhotoGallery"){
          mainView = new ReferralWireView.PhotoGallery({
            applet:options.formAppletName,
            templateHTML:options.templateHTML,
          });
        }
        
          if($.hasVal(viewBarApplet)){
              var viewBar = new ReferralWireView.FormView({ 
                applet: options.viewBarApplet, 
                clickRoute:options.clickRoute,
                templateHTML : 'StdForm', //not actually used
                showViewBar:true, 
                model:($.hasVal(options.viewBarModel))?options.viewBarModel:mainView.model,
                viewBarTemplate:'ActionBarTemplate'});
            } else {var viewBar = null;}
            if ($.hasVal(options.appletMenu)){
            appletMenu = new ReferralWireView.FormView({
            applet:options.appletMenu,
            templateHTML:'PhoneAppletMenu',//not actually used
            viewBarTemplate:'PhoneAppletMenu',
            model:mainView.model,
                  showViewBar:true 
          });
          }
          
          if ($.hasVal(options.formapplet2)){
            formView2 = new ReferralWireView.FormView({ 
            applet: options.formapplet2, 
            templateHTML : 'CollapseFormNarrow',
            }); 
          
          }
          if ($.hasVal(options.formapplet3)){
            formView3 = new ReferralWireView.FormView({ 
            applet: options.formapplet3, 
            templateHTML : 'CollapseFormNarrow',
            }); 
          
          }
          
          if ($.hasVal(options.childListApplet)) {
            childList = new ReferralWireView.ListView({ 
              applet: options.childListApplet, 
              clientSideSortAttr : options.clientSideSortAttr,
              model: options.childListModel,
              template: options.listTemplateHTML,
              filter:(!_.isUndefined(options.filter) && options.filter)?true:false,//governs whether search box appears above the list
              usePaging:options.usePaging,
              listItemClass:options.listItemClass,
              formRoute:""
            }); 
            if ($.hasVal(options.clientSideSortAttr) && $.hasVal(options.childListModel)) {childList.setModel(options.childListModel);}
            
          }

        
        var newRecord = (!$.hasVal(options.newRecord) || options.newRecord == false)?false:true;
        //var editRecord = (!$.hasVal(options.editRecord) || options.editRecord == false)?false:true;
        if (newRecord){
          mainView.setDefaultModel();options.model = mainView.model;
        }
        
            if ($.hasVal(options.model)){
                mainView.model = options.model;
              if ($.hasVal(viewBar))
                viewBar.model = mainView.model;
              
              if ($.hasVal(appletMenu))
                appletMenu.model = mainView.model;
                
              if ($.hasVal(formView2))
                formView2.model = mainView.model;
                
              if ($.hasVal(formView3))
                formView3.model = mainView.model;
              
                var phoneView = new PhoneStdView({
                  el:"#ContentSection",
                  viewTemplate:options.viewTemplate,
                  listView:mainView,
                  formView2:formView2,
                  formView3:formView3,
                  childList:childList,
                  viewClass:options.viewClass,
              viewBar:viewBar,
              upsertApplet:options.upsertApplet,
              route:(!_.isUndefined(options.route))?options.route:options.clickRoute,
              refWizard:options.refWizard,
              upsertWizard:options.upsertWizard,
              contextMenu:options.contextMenu,
              noRecordsMsg:options.noRecordsMsg,
              parentDefaultVals:options.parentDefaultVals,
              savedSearch:options.savedSearch,
              appletMenu:appletMenu});

              ReferralWireView.ChildViewContainer.add(phoneView,"phoneView");
              phoneView.render();

                if ( !_.isUndefined(childList.options.usePaging) ) {
                        $('#'+ childList.id ).on( "listviewbeforefilter", childList, childList.textSearchHandler);
                        $('#'+ childList.id ).on( "scroll", childList, childList.scrollHandler);
                        $('.phone-master-detail').addClass("phoneMDSearchList");
                }
                //this.loadPhonePage(phoneView);
                //$("#title").addClass("viewTitle");
                $("#title").html(options.title);
        } else {
          
            var that = this;
          // get data
            var data = new rwcore.StandardCollection({
              "module" : mainView.actor, 
              searchSpec: ($.hasVal(options.searchSpec))?options.searchSpec:mainView.searchSpec,
              "id" : options.id,
              act : options.act,
              bc:options.bc,
              bo:options.bo,
              calculatedFields:options.calculatedFields,
              shape: (!_.isUndefined(options.shape))?options.shape:(options.mainRenderer == "ListView")?'Skinny':undefined,
              sortby : options.sortby,
              limit: _.isUndefined(options.usePaging) ? undefined : rwcore.pagingSize,
              sortOrder : _.isUndefined(options.sortOrder) ? "ASC" : options.sortOrder,
              //cacheOptimize : options.cacheOptimize  
            } );
                
            data.fetch( { 
              add : true,
              error : rwcore.showError, 
              success : function (model, response, jqXHR) {
              
              if (!_.isUndefined(options.cc)) {
                that.phoneContactsCollection = options.cc ;
                model.add(options.cc.models);
              }
              /* Per peter, this code can be
              if ($.hasVal(options.cacheModel)){
                var setCacheString = options.cacheModel + " = model;"
                eval(setCacheString);
                
              }
              */
                
                if ($.hasVal(options.formAppletName)){
                  mainView.model = model.models[0];
                } else {
                  mainView.setModel(model);
                }
                
                if ($.hasVal(viewBar))
                  viewBar.model = mainView.model;
                
                if ($.hasVal(appletMenu))
                  appletMenu.model = mainView.model;
                  
                if ($.hasVal(formView2))
                    formView2.model = mainView.model;
                
                  if ($.hasVal(formView3))
                    formView3.model = mainView.model;

                var phoneView = new PhoneStdView({
                    el:"#ContentSection",
                  viewTemplate:options.viewTemplate,
                  listView:mainView,
                  formView2:formView2,
                      formView3:formView3,
                  viewBar:viewBar,
                  upsertWizard:options.upsertWizard,
                  route:(!_.isUndefined(options.route))?options.route:options.clickRoute,
                  contextMenu:options.contextMenu,
                  viewClass:options.viewClass,
                  refWizard:options.refWizard,
                  upsertApplet:options.upsertApplet,
                  parentDefaultVals:options.parentDefaultVals,
                  savedSearch:options.savedSearch,
                  appletMenu:appletMenu});
                
                  if (!suppressBack){$('#backBtn').show(10);};
                  
                  ReferralWireView.ChildViewContainer.add(phoneView,"phoneView");
                  phoneView.render();
                  
                   if ( !_.isUndefined(mainView.options.usePaging) ) {
                        $('#'+ mainView.id ).on( "listviewbeforefilter", mainView, mainView.textSearchHandler);
                        $('#'+ mainView.id ).on( "scroll", mainView, mainView.scrollHandler);
                    }

                  $("#title").html(options.title);
              }
            });
        }

   
      },
      
      
     
      loadPhonePage: function(nextView){
        /*closeMenu(true);
        if ($.hasVal(this.goBack) && this.goBack){
          rwApp.goBack = false;
          this.backward(nextView)
        }
        else {this.forward(nextView);};
        */
        //$("#frame").html(nextView.render().el).('create');
      },
     
      
      phoneOrgList : function() {
        
        this.renderPhoneScreen({
          el:this.params.modules[1],
          mainRenderer:"ListView",
          listTemplateHTML:'PhoneChapterList',
          listAppletName : "OrganizationAppletList",
            usePaging:true,
          title:"Chapters",
          appletMenu:"PhoneAppletMenuSimple",
          viewTemplate:'PhoneStdViewList',
          //cacheModel:"rwApp.memberCache",
          sortby:"businessName"
          });
      },
      
      phoneOrgDetails : function(partyId){
      
        //var mModel = ($.hasVal(rwApp.memberCache))?rwApp.memberCache.get(partyId):($.hasVal(rwApp.memberCacheSingle))?rwApp.memberCacheSingle:null;
        this.renderPhoneScreen({
            //el:this.params.modules[1],
          formAppletName:"OrganizationShortForm", 
            templateHTML: 'PhoneChapterProfile', 
            id:partyId,
            viewBarApplet:"OrgPhoneViewBar",
            mainRenderer:"FormView",
            title:"Chapter Detail",
            clickRoute:"phoneOrgDetails",
            //model:mModel,
            appletMenu:"PhoneAppletMenuSimple",
            viewTemplate:'PhoneStdView',
            //refWizard:refWiz,
            contextMenu: {
                    ///icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/images/icons/joinChapterIcon.png",
                    action:"joinchapter",
                    hideIf:function(model){return (model.get('id') == rwFB.OrgId)?true:false;},
            }
        });

      },
      
      phoneOrgMembers : function(orgId){
        
        //var mModel = ($.hasVal(rwApp.memberCache))?rwApp.memberCache.get(partyId):($.hasVal(rwApp.memberCacheSingle))?rwApp.memberCacheSingle:null;
          var that = this;
          var data = new rwcore.StandardCollection({
                  module : "OrgMgr", 
                  id : orgId,
                  //act : options.act,  
                  } );
                    
                data.fetch( { 
                  add : true,
                  error : rwcore.showError, 
                  success : function (model, response, jqXHR) {
                      
                      var mModel = model.models[0];
                      var fkFilter = "{OrgId : '"+orgId+"'}"
                var ss = {filter:[{
                                    ftype:"expr", 
                                    expression:fkFilter
                                   },]
                            };
                    
                  var data = new rwcore.StandardCollection({
                        "module" : "PartyMgr", 
                        searchSpec: ss,
                        //act : options.act,
                        shape:"Skinny",
                        sortby : "fullName",
                        //limit: rwcore.pagingSize,
                        sortOrder : "ASC",
                            //cacheOptimize : options.cacheOptimize  
                        } );
                        
                    data.fetch( { 
                      add : true,
                      error : rwcore.showError, 
                      success : function (model, response, jqXHR) {
                          
                          var childListModel = model;
                          that.renderPhoneScreen({
                          
                        //el:this.params.modules[1],
                        templateHTML:'PhoneChapterMaster', 
                        listTemplateHTML:'PhoneMemberList',
                        childListApplet : "MemberAppletList",
                          childListModel : childListModel,
                        title:"Chapter Members",
                        clickRoute:"phoneOrgMembers",
                        appletMenu:"PhoneAppletMenuSimple",
                        viewTemplate:'PhoneMasterDetailView',
                        
                        mainRenderer:"FormView",
                        formAppletName:"OrganizationShortForm",
                        
                          model:mModel,
                          viewBarApplet:"OrgPhoneViewBar"
                        
                      });
                                                    
                      } //closes detail list  success function
                    }); //closes detail list data.fetch
                  } //closes master success function
                }); //closes master data.fetch

      },
      
      phoneOrgPhotos : function(partyId){
        //var mModel = ($.hasVal(rwApp.memberCache))?rwApp.memberCache.get(partyId):($.hasVal(rwApp.memberCacheSingle))?rwApp.memberCacheSingle:null;
        this.renderPhoneScreen({
            //el:this.params.modules[1],
          formAppletName:"ChapterImages", 
            templateHTML:'PhoneChapterProfile', 
            id:partyId,
            viewBarApplet:"OrgPhoneViewBar",
            clickRoute:"phoneOrgPhotos",
            mainRenderer:"PhotoGallery",
            templateHTML : 'PhotoGalleryThumbsNoEdit',
            title:"Chapter Photos",
            //model:mModel,
            appletMenu:"PhoneAppletMenuSimple",
            viewTemplate:'PhoneStdView',
            //refWizard:refWiz
        });

      },
      
      phoneOrgEvents : function(OrgId) {
      var that = this;
          var promise = rwApp.fetchParentChildren({
            parentModule:"OrgMgr",
            masterRecordId:OrgId,
            childModule:"EventMgr",
            childBC:"Event",     
            clientFKFilter:true,
            parentKeyField:"id",//use this to find the child records
            detailSearchSpec: {OrgId : "id" },
            searchSpec: {filter:[
              {
                ftype:"time",
                fieldname:"datetime", 
                period:"80640"
              }
            ]},
            sortby:"datelong",
            sortOrder:"DESC"
          });
          
          promise.done(function(retVal) {
            that.renderPhoneScreen({

                
                templateHTML:'PhoneChapterMaster', 
                listTemplateHTML:'EventList',
                childListApplet : "EventList", 
                childListModel : retVal.childModel,
                title:"Chapter Events",
                clickRoute:"phoneOrgEvents",
                appletMenu:"PhoneAppletMenuSimple",
                viewTemplate:'PhoneMasterDetailView',
                mainRenderer:"FormView",
                formAppletName:"OrganizationShortForm",
                model:retVal.parentModel,
                viewBarApplet:"OrgPhoneViewBar",
                upsertApplet:"EventNewForm",
                 parentDefaultVals:{
                  OrgId:"id",
                  locationName:"establishmentName",
                  logoUrl:"logoUrl",
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
                contextMenu: {
                    //icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/STN/Images/phoneNewRecord.png",
                    action:"addChild",
                    hideIf:function(model){
                      var hasPriv = $.hasAccess({record:model,routeName:"phoneOrgEvents",privilege:"add"});
                      return (hasPriv)?false:true;
                    },

                }               

                
            });
          
        })
      },


     phoneUpcomingEvents : function(EventId){
      var f = new Array();
      var z = rwFB.postalCode;
      f[0] = {ftype:"time",period:"120",max:"10080",fieldname:"datetime"};

      if ($.hasVal(z)){f[1] = {ftype:"proximity",from:z,distance:50};};
      
        this.renderPhoneScreen({
            el:this.params.modules[1],
            sortby:"datetime",
            mainRenderer:"ListView",
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
            usePaging:true,
            listTemplateHTML:'PhoneAllEventList',
            listAppletName : "UpcomingEventList",
            title:"Upcoming Events",
            appletMenu:"PhoneAppletMenuSimple",
            viewTemplate:'PhoneStdViewList',
         });        
      },
/*

      members : function() {
        
        this.renderPhoneScreen({
          el:this.params.modules[1],
          //listAppletName:"PhonePartnerList",
          listTemplateHTML:'PhoneMemberList',
          listAppletName : "MemberAppletList",
          usePaging:true,
             
          title:"All Members",
          appletMenu:"PhoneAppletMenuSimple",
          viewTemplate: 'PhoneStdViewList',
          //viewTemplate:ReferralWire.Templatecache.PhonePageNoViewBar,
          //cacheModel:"rwApp.memberCache",
          sortby:"fullName"
          });
      },


      module : "EventMgr",
                //act:options.act,
                bo:"Event",
                bc:"Event",
                sortby:"datetime",
                searchSpec:{
                      filter:[
                        {
                          ftype:"time", 
                          period:"120",
                          max:"10080",
                          fieldname:"datetime", 
                        },
                    ]
                },
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
                  pastFuture:function(model){
                    var dateVal = (_.isObject(model.get('datetime')))?model.get('datetime').$date:model.get('datetime');
                    var date = new Date(dateVal);
                    var gracePeriod = 1000 * 60 * 60 * 12; //2 hours
                    var retVal = (date.getTime() + gracePeriod > (new Date()).getTime())?"Future":"Past";
                    return retVal;
                  }
                },
      */
      
     phoneEvent : function(EventId){

        this.renderPhoneScreen({
            //el:this.params.modules[1],
            formAppletName:"EventNewForm", 
            templateHTML: 'PhoneEventFormNarrow', 
            id:EventId,
            viewBarApplet:"PhoneAttendeeViewBar",
            bc:"Event",
            bo:"Event",
            act:"readphone",
            clickRoute:"EventExpected",
            mainRenderer:"FormView",
            title:"Event Detail",
            appletMenu:"PhoneAppletMenuSimple",
            viewTemplate:'PhoneStdView',
            upsertApplet:"EventEditForm",
            contextMenu: {
                    //icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/STN/Images/phoneEditButton.png",
                    action:"editRecord",
                    hideIf:function(model){
                      var hasPriv = $.hasAccess({record:model,routeName:"phoneEvent",privilege:"editFull"});
                      return (hasPriv)?false:true;
                    },

             } 
            //refWizard:refWiz
        });
      },
    



    phoneEventExpected : function(EventId) {
    
      var that = this;
          var promise = rwApp.fetchParentChildren({
            parentModule:"EventMgr",
            parentBC:"Event",
            masterRecordId:EventId,
            childModule:"AttendeeMgr",
            childBC:"Attendee",
            clickRoute:"phoneEventExpected",
            clientFKFilter:true,
            sortby : "fullName_denorm",
            limit: rwcore.pagingSize,
            parentKeyField:"id",//use this to find the child records
            detailSearchSpec: {eventId : "id" },
            searchSpec: {filter:[
              {
                ftype:"expr",
                expression:"{status : 'INVITED'}" 
              }
            ]},
          });
          promise.done(function(retVal) {
          that.renderPhoneScreen({
              templateHTML:'PhoneEventMaster', 
              listTemplateHTML:rwApp.getTemplate,
              childListApplet : "AttendeeExpectedList", 
              childListModel : retVal.childModel,
              title:"Expecting",
              clickRoute:"phoneEventExpected",
              filter:true,
              usePaging:true,
              listItemClass:"rw_listitem buttonright",
              viewTemplate:'PhoneMasterDetailView',
              mainRenderer:"FormView",
              formAppletName:"EventNewForm",
            model:retVal.parentModel,
            viewBarApplet:"PhoneAttendeeViewBar",
            contextMenu: {
                    //icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/STN/Images/addGuestButton.png",
                    action:"addGuest",
                    hideIf:function(model){
                      var hasPriv = $.hasAccess({record:model,routeName:"phoneEventExpected",privilege:"editFull"});
                      if (!hasPriv){
                          hasPriv = $.hasAccess({record:model,routeName:"phoneEventExpected",privilege:"addGuest"});
                      }
                      return (hasPriv)?false:true;
                    },

              }
      
        });
          });
          

      },

    phoneEventCheckedIn : function(EventId) {
    
      var that = this;
          var promise = rwApp.fetchParentChildren({
            parentModule:"EventMgr",
            parentBC:"Event",
            masterRecordId:EventId,
            childModule:"AttendeeMgr",
            childBC:"Attendee",
            clickRoute:"phoneEventCheckedIn",
            clientFKFilter:true,
            sortby : "fullName_denorm",
            limit: rwcore.pagingSize,
            parentKeyField:"id",//use this to find the child records
            detailSearchSpec: {eventId : "id" },
            searchSpec: {filter:[
              /*{
                ftype:"expr", 
                expression:"{guestType : 'MEMBER'}"
              },
              */
              {
                ftype:"expr",
                expression:"{status : 'CHECKEDIN'}" 
              }
            ]},
          });
          promise.done(function(retVal) {
          that.renderPhoneScreen({
          templateHTML:'PhoneEventMaster', 
          listTemplateHTML:rwApp.getTemplate,
          childListApplet : "AttendeeExpectedList", 
          childListModel : retVal.childModel,
          title:"Checked In",
          filter:true,
          usePaging:true,
          listItemClass:"rw_listitem buttonright",
          clickRoute:"phoneEventCheckedIn",
          viewTemplate:'PhoneMasterDetailView',
          mainRenderer:"FormView",
          formAppletName:"EventNewForm",
        model:retVal.parentModel,
        viewBarApplet:"PhoneAttendeeViewBar",
        contextMenu: {
                    //icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/STN/Images/addGuestButton.png",
                    action:"addGuest",
                    hideIf:function(model){
                      var hasPriv = $.hasAccess({record:model,routeName:"phoneEventExpected",privilege:"editFull"});
                      if (!hasPriv){
                          hasPriv = $.hasAccess({record:model,routeName:"phoneEventExpected",privilege:"addGuest"});
                      }
                      return (hasPriv)?false:true;
                    },

              }
      
        });
          });
          

      },

    phoneEventGuests : function(EventId) {
    
      var that = this;
          var promise = rwApp.fetchParentChildren({
            parentModule:"EventMgr",
            parentBC:"Event",
            masterRecordId:EventId,
            childModule:"AttendeeMgr",
            childBC:"Attendee",
            clickRoute:"phoneEventGuests",
            clientFKFilter:true,
            parentKeyField:"id",//use this to find the child records
            detailSearchSpec: {eventId : "id" },
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
          });
          promise.done(function(retVal) {
          that.renderPhoneScreen({
          templateHTML:'PhoneEventMaster', 
          listTemplateHTML:rwApp.getTemplate,
          childListApplet : "AttendeeExpectedList", 
          childListModel : retVal.childModel,
          title:"Guests",
          clickRoute:"phoneEventGuests",
          viewTemplate:'PhoneMasterDetailView',
          mainRenderer:"FormView",
          formAppletName:"EventNewForm",
        model:retVal.parentModel,
        viewBarApplet:"PhoneAttendeeViewBar",
        contextMenu: {
                    //icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/STN/Images/addGuestButton.png",
                    action:"addGuest",
                    hideIf:function(model){
                      var hasPriv = $.hasAccess({record:model,routeName:"phoneEventExpected",privilege:"editFull"});
                      if (!hasPriv){
                          hasPriv = $.hasAccess({record:model,routeName:"phoneEventExpected",privilege:"addGuest"});
                      }
                      return (hasPriv)?false:true;
                    },

              }
      
        });
      });
          

      },
      
      fetchParentChildren : function(options){
        this.options = options;
        this.promise =  $.Deferred();
        var that = this;
        var retVal = new Object();
        
                var data = new rwcore.StandardCollection({
                  module : that.options.parentModule, 
                  bc:that.options.parentBC,
                  bo:that.options.parentBC,
                  shape:"Skinny",
                  id : that.options.masterRecordId,
                  } );
                data.fetch( { 
                  add : true,
                  error : rwcore.showError, 
                  success : function (model, response, jqXHR) {
                      
                      var mModel = model.models[0];
                      var fkFilter = "{ZFKeyName : 'ZFKeyValue'}"
                      fkFilter = fkFilter.replace("ZFKeyName",that.options.parentKeyField);
                      fkFilter = fkFilter.replace("ZFKeyValue",that.options.masterRecordId);
                      var ss = {filter:[{
                                    ftype:"expr", 
                                    expression:fkFilter
                                   },]
                            };
                     
                     var dDataOptions = {
                        masterRecordId: options.masterRecordId,
                        module : that.options.childModule, 
                        act:options.act,
                        //shape:"Skinny",
                        searchSpec: ($.hasVal(options.searchSpec))?options.searchSpec:($.hasVal(dview.searchSpec))?dview.searchSpec:undefined, 
                        sortby : that.options.sortby,
                        bc:that.options.childBC,
                        bo:that.options.childBC,
                        limit: that.options.limit,
                        sortOrder : _.isUndefined(options.sortOrder) ? "ASC" : options.sortOrder
                      };
                    
                    if (!_.isUndefined(that.options.detailSearchSpec)) {
                      var keys = Object.keys(that.options.detailSearchSpec);
                      for ( var i = 0; i < keys.length; i++) {
                        var thisKey = keys[i];
                        var thisVal = that.options.detailSearchSpec[keys[i]];
                        
                        if ($.hasVal(that.options.parentKeyField) && options.parentKeyField == thisVal){
                          thisVal = mModel.get(thisVal); //the search spec is a field value from the parent record
                          //
                          
                            if (that.options.clientFKFilter){
                                 var fkFilter = "{ZKeyField : 'ZValue'}";
                                 fkFilter = fkFilter.replace("ZKeyField",thisKey);
                                 fkFilter = fkFilter.replace("ZValue",thisVal);
                                 
                                 var thisFilter = {ftype:"expr",expression:fkFilter};
                                 
                                 if ($.hasVal(dDataOptions.searchSpec)){
                                    if (!_.isArray(dDataOptions.searchSpec.filter)){
                                      dDataOptions.searchSpec.filter = [dDataOptions.searchSpec.filter];
                                    }
                                      var position = dDataOptions.searchSpec.filter.length;
                                      dDataOptions.searchSpec.filter[position] = thisFilter;
                                 } else {
                                    dDataOptions.searchSpec = {filter:[thisFilter]}
                                 }

                              } else {
                                  dDataOptions[thisKey] = thisVal;
                              }
                            };
                          
                          
                      }//close for
                      
                    }
                  var d_data = new rwcore.StandardCollection(dDataOptions);     

                    d_data.fetch( { 
                        add : true,
                        error : rwcore.showError, 
                        success : function (model, response, jqXHR) {
                          
                            var childListModel = model;
                            mModel.clickRoute = that.options.clickRoute;
                            childListModel.clickRoute = that.options.clickRoute;
                            retVal.parentModel = mModel;
                            retVal.childModel = childListModel;
                            that.promise.resolve(retVal);
                        }
                    }); //closes detail list data.fetch
                  } //closes master success function
                }); //closes master data.fetch        
         return this.promise;
      },
      
      

      partners : function() {
        
        this.renderPhoneScreen({
          el:this.params.modules[1],
          //listAppletName:"PhonePartnerList",
          listTemplateHTML: 'PhonePartnerList',
          listAppletName : "PartnerAppletList",
          title:"Partners",
          appletMenu:"PhoneAppletMenuSimple",
          viewTemplate:'PhonePageNoViewBar',
          //cacheModel:"rwApp.partnerCache",
          clientSideSortAttr:"firstName"
          });
      },
      
      PhonePartnerContact : function(partnerId) {
        //this.renderRecordScreen(this.params.modules[1], "PhoneUserProfile", ReferralWire.Templatecache.PhonePartnerProfile, partnerId,true);
        //var pModel = ($.hasVal(rwApp.partnerCache))?rwApp.partnerCache.get(partnerId):($.hasVal(rwApp.partnerCacheSingle))?rwApp.partnerCacheSingle:null;
        var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
        this.renderPhoneScreen({
            //el:this.params.modules[1],
            refWizard:refWiz,
          formAppletName:"PartnerAppletForm", 
            templateHTML:'PhoneStdForm', 
            id:partnerId,
            viewBarApplet:"PhonePartnerContactViewBar",
            appletMenu:"PartnerPhoneReferAppletMenu",
            mainRenderer:"FormView",
            //model:pModel,
            title:"Partner Info",
            viewTemplate: 'PhoneStdView'
        });
      },
      
      phoneQualifications : function(partnerId) {
        
        //var pModel = ($.hasVal(rwApp.partnerCache))?rwApp.partnerCache.get(partnerId):($.hasVal(rwApp.partnerCacheSingle))?rwApp.partnerCacheSingle:null;
        var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
        this.renderPhoneScreen({
            //el:this.params.modules[1],
          formAppletName:"PhonePartnerProfile", 
            templateHTML:'PhonePartnerProfile', 
            id:partnerId,
            viewBarApplet:"PhonePartnerQualificationsViewBar",
            mainRenderer:"FormView",
            title:"About",
            //model:pModel,
            appletMenu:"PartnerPhoneReferAppletMenu",
            viewTemplate:'PhoneStdView',
            refWizard:refWiz,
            viewClass:"qualifications"
        });
      },
      
      
      
      
      phonePhotos:function(partnerId){
         //var pModel = ($.hasVal(rwApp.partnerCache))?rwApp.partnerCache.get(partnerId):($.hasVal(rwApp.partnerCacheSingle))?rwApp.partnerCacheSingle:null;
           var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
           this.renderPhoneScreen ( {
               formAppletName : "PartnerImages",
               viewBarApplet:"PhonePartnerPhotosViewBar",
               id : partnerId,
             mainRenderer:"PhotoGallery",
             title:"Photos",
             //model:pModel,
             templateHTML : 'PhotoGalleryThumbsNoEdit',
             viewTemplate:'PhoneStdView',
             appletMenu:"PartnerPhoneReferAppletMenu",
             refWizard:refWiz
             
             });
   
       }, 
      
      phoneTestimonials:function(partnerId){
        //var pModel = ($.hasVal(rwApp.partnerCache))?rwApp.partnerCache.get(partnerId):($.hasVal(rwApp.partnerCacheSingle))?rwApp.partnerCacheSingle:null;
          var refWiz = rwApp.ContactRefWizard_partnerRefWizard(); 
           this.renderPhoneScreen ( {
               formAppletName : "Testimonials",
               viewBarApplet:"PhonePartnerTestimonialsViewBar",
               id : partnerId,
             mainRenderer:"FormView",
             templateHTML : 'TestimonialsDisplay',
             viewTemplate:'PhoneStdView',
             title:"Testimonials",
             //model:pModel,
             appletMenu:"PartnerPhoneReferAppletMenu",
             refWizard:refWiz
             });
       }, 

       /*
             phoneOrgList : function() {
        
        this.renderPhoneScreen({
          el:this.params.modules[1],
          mainRenderer:"ListView",
          listTemplateHTML:'PhoneChapterList',
          listAppletName : "OrganizationAppletList",
            usePaging:true,
          title:"Chapters",
          appletMenu:"PhoneAppletMenuSimple",
          viewTemplate:'PhoneStdViewList',
          //cacheModel:"rwApp.memberCache",
          sortby:"businessName"
          });
      },
      */
       
       
      members : function() {
        
        this.renderPhoneScreen({
          el:this.params.modules[1],
          //listAppletName:"PhonePartnerList",
          listTemplateHTML:'PhoneMemberListBadges',
          listAppletName : "MemberAppletList",
          mainRenderer:"ListView",
          usePaging:true,
          listItemClass:"rw_listitem hasBadges",   
          title:"All Members",
          appletMenu:"PhoneAppletMenuSimple",
          viewTemplate: 'PhoneStdViewList',
          //viewTemplate:ReferralWire.Templatecache.PhonePageNoViewBar,
          //cacheModel:"rwApp.memberCache",
          sortby : "memberRankScore",
          sortOrder:"DESC",
          savedSearch: {
                  searchGroup:"members",
                  actor:"PartyMgr",
                  bo:"Party",
                  bc:"Party",
                  searchAppletName:"MemberSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Member Search",
            },
            
            contextMenu: {
                  icon:"/images/icons/advancedSearchWhitePhone.png",
                  action:"launchSavedSearch"
            }


          });
      },
      
      nearMe : function() {
          var that = this;
          $.when(that.MarkAndTrackGPS( { partyId: rwFB.uId}) ).always( function() {
                that.renderPhoneScreen({
                  listTemplateHTML:'PhoneMemberListPP',
                  listAppletName : "MembersNearMeList",
                  mainRenderer:"ListView",
                    act: "NearMe",   
                  title:"Members Near Me Now",
                  appletMenu:"PhoneAppletMenuSimple",
                  viewTemplate:'PhoneStdViewList',
                  sortby:"fullName",
                  listItemClass:"powerpartner-li",
                  noRecordsMsg:"No members near me now",
                  contextMenu: {
                            icon:"STN/Images/phoneRefreshIcon.png",
                            action:"refreshView"
                      }
                });     
          });
      },
       
      PhoneMemberContact : function(partyId) {
        //this.renderRecordScreen(this.params.modules[1], "PhoneUserProfile", ReferralWire.Templatecache.PhonePartnerProfile, partnerId,true);
        //var mModel = ($.hasVal(rwApp.memberCache))?rwApp.memberCache.get(partyId):($.hasVal(rwApp.memberCacheSingle))?rwApp.memberCacheSingle:null;
        
        this.renderPhoneScreen({
            //el:this.params.modules[1],
          formAppletName:"PartyAppletFormPublic", 
            templateHTML:'PhoneStdMember', 
            id:partyId,
            viewBarApplet:"PhoneMemberContactViewBar",
            appletMenu:"PhoneAppletMenuMember",
            mainRenderer:"FormView",
            //model:mModel,
            title:"Phone + Address",
            viewTemplate:'PhoneStdView',
            contextMenu: {
                    ///icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/images/icons/connectIcon.png",
                    action: "invite",
                    hideIf:function(model){ 
                      return $.getConditionalConnected(model.get('id'), rwFB.uId, true, false, 'connect');
                    },
            }       
        
        });
      },
      
      phoneMemberQualifications : function(partyId) {
        
        //var mModel = ($.hasVal(rwApp.memberCache))?rwApp.memberCache.get(partyId):($.hasVal(rwApp.memberCacheSingle))?rwApp.memberCacheSingle:null;
        var baseParams = {
              //el:this.params.modules[1],
            formAppletName:"PhoneMemberProfile", 
              templateHTML:'PhoneMemberProfileBadges', 
              id:partyId,
              viewBarApplet:"PhoneMemberQualificationsViewBar",
              mainRenderer:"FormView",
              title:"Qualifications",
              upsertApplet : "PhoneProfileUpsert",//used for edits -- not inserts
              upsertTemplate : 'UpsertFormNarrow',
              refreshFunction:function(){rwApp.refreshTopView()},
              appletMenu:"PhoneAppletMenuMember",
              viewTemplate:'PhoneStdView',
              viewClass:"qualifications",
              contextMenu: {
                      ///icon:"/images/icons/phoneAction.png",
                      icon: rwFB.CDN + "/images/icons/connectIcon.png",
                      action:"invite",
                      hideIf:function(model){return (model.get('id') == rwFB.uId)?true:false;},
              },
          };
        if (partyId == rwFB.uId){
          baseParams.contextMenu.action = "editRecord";
          baseParams.contextMenu.icon = "/images/icons/editPhoneIcon.png";
          baseParams.contextMenu.hideIf=undefined;
        } 
          this.renderPhoneScreen(baseParams);
        
      },
      
      phoneMemberPhotos:function(partyId){
         //var mModel = ($.hasVal(rwApp.memberCache))?rwApp.memberCache.get(partyId):($.hasVal(rwApp.memberCacheSingle))?rwApp.memberCacheSingle:null;
           //var refWiz = rwApp.ContactRefWizard_partnerRefWizard();
           this.renderPhoneScreen ( {
               formAppletName : "MemberImages",
               viewBarApplet:"PhoneMemberPhotosViewBar",
               id : partyId,
             mainRenderer:"PhotoGallery",
             title:"Photos",
             //model:mModel,
             templateHTML : 'PhotoGalleryThumbsNoEdit',
             viewTemplate:'PhoneStdView',
             appletMenu:"PhoneAppletMenuMember",
             //refWizard:refWiz
             });
            
   
       }, 
       
       phoneMemberTestimonials:function(partyId){
        //var mModel = ($.hasVal(rwApp.memberCache))?rwApp.memberCache.get(partyId):($.hasVal(rwApp.memberCacheSingle))?rwApp.memberCacheSingle:null;
          //var refWiz = rwApp.ContactRefWizard_partnerRefWizard(); 
           this.renderPhoneScreen ( {
               formAppletName : "MemberTestimonials",
               viewBarApplet:"PhoneMemberTestimonialsViewBar",
               id : partyId,
             mainRenderer:"FormView",
             templateHTML : 'TestimonialsDisplay',
             viewTemplate:'PhoneStdView',
             title:"Testimonials",
             //model:mModel,
             appletMenu:"PhoneAppletMenuMember",
             //refWizard:refWiz
             });
       }, 


      
      referrals : function() {
        this.renderPhoneScreen(this.params.modules[1],"ReferralList", 'StdThumbNailList',"Referrals" );
      },
      
      contacts : function() {
        that = this;
        rwApp.contactCache = null;
        //$(".ui-loader").show();

        
          that.renderPhoneScreen({
            el:rwApp.params.modules[1],
            listAppletName:"PhoneContactList",
            listTemplateHTML:rwApp.getContactListTemplPhone,//ReferralWire.Templatecache.PhoneContactList, 
            //formRoute:"PhoneProfile",
            title:"My Address Book",
            mainRenderer:"ListView",
            viewTemplate: 'PhoneStdViewList',
            appletMenu:"ContactPhoneListAppletMenu",
            refreshRoute:"#contacts",
            upsertWizard: {
              viewTemplate: 'WizardUpsertView',
              refreshFunction:rwApp.ContactProfileFromParty,
              stations: ["Work","Home"],
              firstApplet:{name:"ProfessionalContactUpsertNoPhoto"},
                  nextAppletFunctions: {
                      ProfessionalContactUpsertNoPhoto:function(model,wizSpec){
                      return {name:"PersonalContactInsert"}
                  }
              }
            },
            cacheModel:"rwApp.contactCache",
            sortby:"fullName",
            usePaging:true,
            cacheOptimize:'yes',              
            contextMenu: {
                    //icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/STN/Images/phoneAction.png",
                    action:"launchContextMenu",
                    contextMenu:[
              { id:"#wizardNew",
                route:"wizardNew",
                label:"New",
                iconSrc:"addIconLargeWhite.png",},
              { id:"#import",
                route:"importAddressBook", 
                label:"Import",
                iconSrc:"importContacts.png",},
              {id:"#search",
                label:"Saved Searches",
                iconSrc:"advancedSearchWhitePhone.png",
                route:"launchSavedSearch"}]
              },
            savedSearch: {
                  searchGroup:"addressbook",
                  actor:"PartnerMgr",
                  bo:"Partner",
                  bc:"Partner",
                  searchAppletName:"AddressBookSearchForm", //replacehardcode
                  searchAppletTemplate:"SearchForm",
                  title:"Addressbook Search",
            },
                
              
          });

        //$.mobile.loading('hide');
      },
      
      ContactProfile : function(contactId) {
        
            
        //var cModel = ($.hasVal(rwApp.contactCache))?rwApp.contactCache.get(contactId):null;

        
        this.renderPhoneScreen({
            //el:this.params.modules[1],
          formAppletName:"ProfessionalContact", 
          //formapplet2 : "PersonalContact",
            //formapplet3 : "Demographic",
            templateHTML:'PhoneStdFormContact', 
            id:contactId,
            viewBarApplet:"ContactPhoneViewBar",
            appletMenu:"ContactPhoneProfileAppletMenu",
            mainRenderer:"FormView",
            upsertApplet : "PersonalContact",//used for edits -- not inserts
            upsertTemplate : 'UpsertFormNarrow',
            title:"Contact Detail",
            //model:cModel,
            refreshRoute:"#contacts",
            refWizard:rwApp.ContactRefWizard,
            upsertWizard: {
                  viewTemplate: 'WizardUpsertView',
                  refreshFunction:rwApp.ContactProfileFromParty,
                  stations: ["Work","Home"],
                  firstApplet:{name:"ProfessionalContactUpsertNoPhoto"},
                  nextAppletFunctions:{
                    ProfessionalContactUpsertNoPhoto:function(model,wizSpec){
                      return {name:"PersonalContactInsert"}
                    }
                  }
                
                },
            route:"ContactProfile",
            viewTemplate:'PhoneStdView',
            contextMenu: {
                    //icon:"/images/icons/phoneAction.png",
                    icon: rwFB.CDN + "/STN/Images/phoneAction.png",
                    action:"launchContextMenu",
                    contextMenu:[
              { id:"#referContact",
                route:"refer",
                label:"Refer",
                iconSrc:"newReferralWhite.png"},
              { id:"#inviteContact",
                route:"invite", 
                label:"Invite",
                iconSrc:"invitationWhite.png"},
              { id:"#editContact",
                route:"wizardEdit", 
                label:"Edit",
                iconSrc:"editWhiteLarge.png"},
              { id:"#deleteContact",
                route:"deleteItem", 
                label:"Delete",
                iconSrc:"deleteLargeWhite.png"}]
              }
        });
        
      },
      
      ContactProfileFromParty : function(model){
        var partyId = model.get("id");
        ContactProfileFromPartyId(partyId);
      },
      
      ContactProfileFromPartyId : function(partyId){
         //var partyId = model.get("id");
       var data = new rwcore.StandardModel({ 
                module : "PartnerMgr", 
                partnerId : partyId});
            
         data.fetch({      
              add : true,
              success : function (model, response, jqXHR) {
              
                partnerId = model.get('id');
                //rwApp.ContactProfile(partnerId);  
                var type = model.get("type");
              if (type == "REFERRAL_PARTNER"){ 
                  rwApp.navigate("#ContactPartnerProfile/"+partnerId,{trigger: true,replace: true});
                }
                else {
                  rwApp.navigate("#ContactProfile/"+partnerId,{trigger: true,replace: true});
                }
                
              }
         });
      },
      
      ContactPartnerProfile : function(contactId) {
        
            
        //var cModel = ($.hasVal(rwApp.contactCache))?rwApp.contactCache.get(contactId):null;
      
        
        this.renderPhoneScreen({
            //el:this.params.modules[1],
          formAppletName:"ProfessionalContactPartner", 
          formapplet2 : "PersonalContact",
            //formapplet3 : "Demographic",
            templateHTML:'PhoneStdFormContactPartner', 
            id:contactId,
            viewBarApplet:"ContactPhoneViewBar",
            appletMenu:"ContactPhoneProfilePartnerAppletMenu",
            mainRenderer:"FormView",
            upsertApplet : "PersonalContact",
            upsertTemplate : 'UpsertFormNarrow',
            title:"Contact Detail",
            //model:cModel,
            //refreshRoute:"#contacts",
            refWizard:rwApp.ContactRefWizard,
            route:"ContactPartnerProfile",
            viewTemplate:'PhoneStdView',
        });
        
      },
      
      
    editPhoneContactPartnerHome: function(recordId){
      
      rwApp.editPhoneContactHome(recordId,"ContactPartnerProfile","PersonalContact",null)
      
    },
     
      
      phoneRefInbox: function(){
        
        //var filterExp = "{$or:[{toId : '"+rwApp.uId+"'},{toId2 : '"+rwApp.uId+"'}]}";
        
        var options = {
            
              listAppletName:"ReferralInbox",
              act:"InBox",
              listTemplateHTML:rwApp.getReferralInboxHomeTemplate,//ReferralWire.Templatecache.ReferralInbox,
              viewBarApplet:"PhoneReferralInBoxViewBar",
                  sortby : "rw_created_on",
                  sortOrder : "DESC",
              viewTemplate:'PhoneStdView',
              mainRenderer:"ReferralMgmtListView",
              appletMenu:"PhoneAppletMenuSimple",
              title:"Recently Received",
              suppressBack:true,
              setFilter:false,
        };
              
        this.renderPhoneScreen(options);

      },
      
      phoneRefOutbox: function(){
        
        var options = {
            
              listAppletName:"ReferralOutboxPhone",
              listTemplateHTML:rwApp.getReferralOutboxHomeTemplate,
              act:"OutBox",
              viewBarApplet:"PhoneReferralOutBoxViewBar",
                  sortby : "rw_created_on",
                  sortOrder : "DESC",
              viewTemplate:'PhoneStdView',
              mainRenderer:"ReferralMgmtListView",
              appletMenu:"PhoneAppletMenuSimple",
              title:"Recently Made",
              suppressBack:true,
              setFilter:false
                
        };
              
        this.renderPhoneScreen(options);
            //$('#backBtn').hide(10);
            //$("#loginTable").remove();
            //that.loadPhonePage(homeview.render().el);
            //$(".phoneHeader").show();
            //$(".phoneMenu").show();
            //$("#title").removeClass("viewTitle");
            //$("#title").html("Recently Received");

      },
      
      
      
      home : function() {
          var that = this;
          var hpModel = new ReferralWire.HomePageModel();
  
          hpModel.fetch({
            error : rwcore.showError, 
            success : function (model, response, jqXHR) {
                rwApp.uId = model.get('id');
                 
                $.when(that.MarkAndTrackGPS( {partyId: rwFB.uId} )).always( function () {

          rwApp.zip = model.get('postalCodeAddress');
                  var homeview = new ReferralWire.HomePageView ({model: model, template: 'STN_phonehome'});    
                $('#backBtn').hide(10);
                $("#loginBackdrop").hide();
                
                //$("#frame").html(homeview.render().el).trigger('create');
                $("#ContentSection").html(homeview.render().el).trigger('create');
                //that.loadPhonePage(homeview);
                $("#title").html(rwFB.HeaderName);
                var homeMenu = [
              { id:"homeMenu",
                route:"#home",
                label:"Home",
                iconSrc:"homeIconSmall.png",},
              { id:"peopleGroup",
                label:"My Address Book",
                route:"#contacts",
                iconSrc:"contactCardsSmall.png"},
              { id:"members",
                route:"#members",
                iconSrc:"allMembers.png",
                label:"All Members"},
              { id:"nearMe",
                route:"#nearMeAlt",
                label:"Members Near Me",
                iconSrc:"nearMeIconWhite.png"},
              { id:"chaptersMenu",
                route:"#phoneOrgList",
                label:"Chapters",
                iconSrc:"chaptersWhite.png"},
              ]
                var homeMenuHTML = _.template('PhoneNavPanel',{model:model,menuNav:homeMenu})();
                
                $("#left-panel").html(homeMenuHTML);
            

                });
    
              }
          });
      },
      

      
      getPhoneContacts : function ( options ) {
        

          var findoptions = new ContactFindOptions();
          // This does not gaurantee the uniqueness..may have put to them on ListView..
          findoptions.filter = "";  
          findoptions.multiple = true;
          var fields = ["name", "phoneNumbers", "emails", "addresses", "organizations", "photos"];
          var contact = navigator.contacts.find(fields,
                  function(contacts) {
                    options.success(contacts);

                    /*
                    var cc = new rwcore.StandardCollection({module:"ContactsMgr"});
                    cc.comparator = function (person) { return person.get('firstName');}
                    cc.reset();
                    
                      for (var i=0; i<contacts.length; i++) {
                          var contact = contacts[i];

                          if ( $.hasVal( contacts[i].name.givenName) && $.hasVal(contacts[i].name.familyName)) {
                              var cm = new rwcore.StandardModel({module:"ContactsMgr"});
                              cm.set({firstName : contacts[i].name.givenName,
                                      lastName :  contacts[i].name.familyName,
                                      fullName : contacts[i].name.formatted});
                              
                              var emails = contacts[i].emails;
                              if ( !_.isNull(emails) )
                                cm.set({emailAddress : emails[0].value});
                              else
                                cm.set({emailAddress : ""});
                              var phoneNumbers = contacts[i].phoneNumbers;
                              if ( !_.isNull(phoneNumbers) )
                                cm.set({mobilePhone : phoneNumbers[0].value});
                              else 
                                cm.set({mobilePhone : ""});
                              cm.set({type : "phone"});
                              cm.id = i;
                              cc.add(cm, {silent: true});
                        }
                      }
                      options.success(cc);
                      */
                      
                },
                  function(contactError) {
                      alert('Error!');
                  }, 
                  findoptions);
    },

    MarkAndTrackGPS : function ( options ) {
      var promise  = $.Deferred();
      promise.resolve();
      return promise;
    },

    /*

    MarkAndTrackGPS : function ( options ) {
      var that = this;
      var promise  = $.Deferred();
      var firstPass = phoneapp.GetAccurateGPSLocation();

      $.when(firstPass).done( function(position) {
      
            var gpsTimeStamp = new Date(position.timestamp).getTime();
            var deviceTimeStamp = new Date().getTime();

            var x = ( deviceTimeStamp - gpsTimeStamp ) / 60000; // in minutes

            if ( x <= 3 ) { // we are okay with 3 minutes old location data
             
          var cm = new rwcore.StandardModel({
              module : "UserMgr",
              latitude : position.coords.latitude,
              longitude : position.coords.longitude,
              GeoTimeStamp : gpsTimeStamp,
              userAgent : navigator.userAgent
            });

              cm.call("MarkGeoLocation", cm, {      
                      async: false, 
                      error : function(request,status,error) { 
                        rwcore.showError(request,status,error);
                        promise.reject(); 
                      },
                      success : function (model, response, jqXHR) {
                        promise.resolve();
                      }   
              });

          }
          else {
            rwcore.FYI('Location Information on your device is ' + String(x) + " minutes old, please retry.");
            promise.reject();
          }
      }).fail( function() { promise.reject()});

      return promise;
  },
  */

                /*
                var element = document.getElementById('geolocation');
                  element.innerHTML = 'Latitude: '          + position.coords.latitude         + '<br />' +
                                      'Longitude: '         + position.coords.longitude        + '<br />' +
                                      'Altitude: '          + position.coords.altitude         + '<br />' +
                                      'Accuracy: '          + position.coords.accuracy         + '<br />' +
                                      'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                                      'Heading: '           + position.coords.heading          + '<br />' +
                                      'Speed: '             + position.coords.speed            + '<br />' +
                                      'Timestamp: '         + position.timestamp               + '<br />';
                */
  
  StartGeoLocationTracking : function (options) {
    
  },

  /*

  StartGeoLocationTracking : function (options) {
     
      var that = this;


      if ( rwFB.geoLocationWatchID != null ) 
        navigator.geolocation.clearWatch(rwFB.geoLocationWatchID);
      
      rwFB.geoLocationWatchID = navigator.geolocation.watchPosition(
          function (position) {
                rwFB.geoLocationErrorCode = null;  

                if ( rwFB.geoLocation != null )
                   if(rwFB.geoLocation.coords.latitude == position.coords.latitude && 
                    rwFB.geoLocation.coords.longitude == position.coords.longitude) {
                    // if you are at the same location, no need to update.
                    _.isFunction(options.success) && options.success(position);
                    return;
                }       

                var cm = new rwcore.StandardModel({
                      module : "UserMgr",
                      latitude : position.coords.latitude,
                      longitude : position.coords.longitude,
                      GeoTimeStamp : new Date(position.timestamp).getTime(),
                      userAgent : navigator.userAgent
                });

                rwFB.geoLocation = position;
                cm.call("MarkGeoLocation", cm, {      
                      async: false, error : ReferralWire.showError,
                      success : function (model, response, jqXHR) {
                        _.isFunction(options.success) && options.success(position);
                      }   
                });
          },
          function (error) {
              // rwFB.geoLocationErrorCode = error.code;
              _.isFunction(options.error) && options.error(error);
          }, 
          { maximumAge: 300000, timeout: _.isUndefined(options.timeout) ? 60000 : options.timeout ,enableHighAccuracy: true }); // track once every minutes.
    },
    
    */

  });


   var PhoneStdView = Backbone.View.extend({ 
    initialize:function (options) {
      this.options = options;
    },
    events:{
      "click [togglestate]":"toggleReferral",
      "tap [launchShow]":function(event){this.options.listView.launchshow(event);},
      "click [closeslideshow]":function(){$("#slideshowcontainer").hide();},
      "tap [nextphoto]":function(event){this.options.listView.next(event);},
      "tap [prevphoto]":function(event){this.options.listView.previous(event);},
      "tap .pickPhoneContact":function(event){this.options.listView.pickPhoneContact(event);},
      "tap #refer":"refer",
      //"click .phoneListItem":function(event){alert('listitem click')},
          "click [confirmation='true']":"updateField",
          //"tap #phoneTitleBar":function(){toggleMenu();},
      "click #menuButtonSave":function(event){event.options = this.options;this.options.listView.saveRecordPhone(event);},
      //"click #menuButtonNext":"next",
      "tap #edit":"editRecord",
      "tap #delete":"deleteItem",
      "tap #wizardEdit":"wizardEdit",
      "tap #wizardNew":"wizardNew",
      "tap #addChild":"addChild",
      "tap #import":"importAddressBook",
      "click [contextAction]":"contextAction",
      "tap #invite":"invite",
      "click .eventselfcheckin":"selfcheckin",
      "click .checkout":"checkout",
      "click .checkin":"checkin",
      "click #menuButtonCancel":"cancel",
          "change select": function(event) { this.options.listView.changeItem(event); },
        "change input": function(event) { 
          if (this.options.listView.hasOwnProperty("changeItem"))
            this.options.listView.changeItem(event); 
        },
        "change textarea":function(event){ this.options.listView.changeItem(event); },
          "tap #share":"share",
            "click #showNextRecords":function(){this.options.listView.showNextRecords()},
          "click #showPreviousRecords":function(){this.options.listView.showPreviousRecords()}
      
    },

    launchSavedSearch:function(){
        var ssPicker = new ReferralWireView.SavedSearchPickView({searchGroup:this.options.savedSearch.searchGroup,parentView:this});
        ssPicker.render();
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
          //if (!_.isUndefined(this.searchView)) {this.searchView.refreshSearchModel(searchModel);}
          this.options.listView.model.options.searchModel = this.searchModel;
          

          this.options.listView.model.options.searchRequest = rwApp.parseSavedSearch(searchModel,this.options.savedSearch.searchAppletName);
          this.options.listView.model.options.searchText = undefined;
          this.options.listView.model.options.skip = undefined;
          $(this.options.listView.selector).html("");
          $(".hasAdvancedSearch .ui-input-search input").attr("value","")
          
          var promise = rwApp.fetchList(this.options.listView.model.options); 
          var that = this;

          if (searchModel.get("accessLevel") == "public"){

          }
          $(this.options.listView.selector).addClass("fetching");
          if (!_.isUndefined(this.ChartView)){
            this.ChartView.searchRequest = this.options.listView.model.options.searchRequest;
            this.ChartView.render();
          }
          var that = this;

        promise.done(function(model){
          
          // that.options.listview.model.add(model.models, {silent: true});
          that.options.listView.model = model;
          that.options.listView.pageNumber = 1;
          that.options.listView.reDraw(model);
          $(that.options.listView.selector).removeClass("fetching");
          if (that.options.listMap){
                that.renderListMap();
              }
          $("#title").html(searchName);
        })
        

      },
    
      wizardEdit:function(event){
          
          var wizard = new ReferralWireView.WizardUpsertView ( { 
          firstApplet:this.options.upsertWizard.firstApplet,
          nextAppletFunctions:this.options.upsertWizard.nextAppletFunctions,
          viewTemplate: this.options.upsertWizard.viewTemplate,
          upsertmodel: this.options.listView.model,
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
          wizardSpec:this.options.upsertWizard,
          parentView: this
          });
          wizard.render();
        },
    


      selfcheckin:function(event){
        // ASSUME THIS HAPPENS IN MASTER DETAIL VIEW
        var checkInButtonId = $(event.target).attr("checkInButtonId");
        var model = this.options.listView.model;
        model.options.bo = "Event";
        model.options.bc = "Event";
        
        var options = {model:model};
        options.validateTimePlace = true;

        $.when(rwApp.eventSelfCheckIn(options)).done(function() {
            $.when(rwcore.showWaitDialog("CheckedInConfirmation_Self")).done(function() { 
                rwApp.navigate("#nearMeAlt", {trigger: true,replace: true});
            });
        });
      },

      checkin:function(event){
        // ASSUME THIS HAPPENS IN MASTER DETAIL VIEW

        var checkInButtonId = ($.hasVal($(event.target).attr("checkInButtonId")))?$(event.target).attr("checkInButtonId"):$(event.target).parents("[checkInButtonId]").attr("checkInButtonId");
        var model = this.options.childList.model.get(checkInButtonId);
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
        var model = this.options.childList.model.get(checkInButtonId);
        model.options.module = "AttendeeMgr";
        model.options.bo = "Attendee";
        model.options.bc = "Attendee";
        
        var options = { model:model, changeToStatus : 'INVITED' };
          var checkInApi = rwApp.eventCheckIn(options);

        $.when(checkInApi).done(function() {
          $("#" + checkInButtonId).hide();
        });
       },    
      
    editRecord:function(event){
      //closeMenu(true);
        var upsertApplet = ($.hasVal(this.options.upsertApplet))?this.options.upsertApplet:this.options.listView.applet;
        this.options.listView.parentView = this;
        this.options.listView.editRecord(upsertApplet);
      
    },  

    addChild:function(){
              var parentModel = this.options.listView.model;
              var upsertApplet = this.options.upsertApplet;
              
              var defaultMap = new Object();
              for (item in this.options.parentDefaultVals) {
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
                    arguments[thisArg] = parentModel.get(thisArg);
                  }
                  var defaultVal = value.functionName(arguments);
                  defaultMap[item] = defaultVal; 
                } else {
                  defaultMap[item] = parentModel.get(value)
              }
              }
              
               var readView = new ReferralWireView.FormView({
                  applet: upsertApplet, 
                    templateHTML : 'StdForm',
                    parentView : this,
                    showConfirmOnSave:false,
                    showViewBar:false, 
                    refreshFunctionStatic:"rwApp.refreshTopView(false)"
              });
            readView.setDefaultModel();
            readView.model.set(defaultMap);
            
            readView.editRecord(upsertApplet);
        },
    
    invite:function(){
          
          var m = this.options.listView.model;
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
      
      contextAction:function(event){
        var elem = ($.hasVal($(event.target).attr("contextAction")))?$(event.target):$(event.target).parents("[contextAction]");
        var functionName = elem.attr("contextAction");
        this[functionName](event);
      },
      
      launchContextMenu:function(event){
        $("#right-panel").panel("open");
      },

      addGuest:function(event){
          
          var m = this.options.listView.model;
          event.OrgId = m.get("OrgId");
          event.eventId = m.get("id");
          event.refWizard = rwApp.AddGuestWizard;
          event.parentView = this;
          rwApp.addGuest(event);

      },
      
      refreshView:function(event){
        
        $.mobile.loading('show');
        rwApp.refreshTopView(true);
        setTimeout(function() {$.mobile.loading('hide')},1000);
      },
      
      contextActionItem:function(event){
        
        var elem = ($.hasVal($(event.target).attr("route")))?$(event.target):$(event.target).parents("[route]");
        
        var functionName = elem.attr("route");
        $("#right-panel").panel("close");
        event.data[functionName]();
      },

    render:function (cachedHTML) {
        
        //$("#left-panel").panel( "close");
        //$("#right-panel").panel( "close");
        
        var childListHTML = ($.hasVal(this.options.childList))?this.options.childList.render().el.outerHTML:"";
        
        var listHTML = this.options.listView.render().el.outerHTML;
        var formView2 = ($.hasVal(this.options.formView2))?this.options.formView2.render().el.outerHTML:"";
        var formView3 = ($.hasVal(this.options.formView3))?this.options.formView3.render().el.outerHTML:"";
        var viewBarHTML = ($.hasVal(this.options.viewBar))?this.options.viewBar.render().el.outerHTML:"";
        var appletMenuHTML = ($.hasVal(this.options.appletMenu))?this.options.appletMenu.render().el.outerHTML:"";
        //var html = _.template(this.options.viewTemplate, {childListHTML :childListHTML ,listHTML:listHTML,formView2:formView2,formView3:formView3,viewBarHTML:viewBarHTML,appletMenuHTML:appletMenuHTML,_:_})();
        var html = _.template(this.options.viewTemplate, {childListHTML :childListHTML ,listHTML:listHTML,formView2:formView2,formView3:formView3,viewBarHTML:viewBarHTML,appletMenuHTML:appletMenuHTML,_:_});
        
        //$(this.el).html(html) // 
        $(this.el).html(html).trigger('create');
        if ($.hasVal(this.options.viewClass))
          $(this.el).find("#ViewContentSection").addClass(this.options.viewClass);
        
        if (this.options.listView.hasOwnProperty("listItem"))
          this.options.listView.refreshList();
        
        if ($.hasVal(this.options.childList))
          this.options.childList.refreshList();
          
            var contextMenuHTML = "";
        
        if ($.hasVal(this.options.contextMenu)){
          
          var hide = ($.hasVal(this.options.contextMenu.hideIf))?this.options.contextMenu.hideIf(this.options.listView.model):false;
          if (!hide){
            $("#actionLink").find("img").attr("src",this.options.contextMenu.icon);
            $("#actionLink").show();
            $("#actionLink").attr("contextAction",this.options.contextMenu.action);
            if ($.hasVal(this.options.contextMenu.contextMenu)){
              contextMenuHTML = _.template('PhoneContextNavPanel',{model:this.options.listView.model,menuNav:this.options.contextMenu.contextMenu});
              $("#right-panel").html(contextMenuHTML);
              $("#contextMenuBody").on('click', '.menuItemDetail', this, this.contextActionItem);
            }
          } else {
            $("#actionLink").hide();
          }
            
        } else {
          $("#actionLink").hide();
        }
        
        
       
        return this;
    },
    
      share:function(event){
         rwApp.sharePartnerInfo({model:this.options.listView.model});
      },


    toggleReferral : function(event){
      console.log("toggleHome");
      event.containerEL = ".rw_details";
      this.options.listView.toggleCollapse(event);
      //ReferralWire.PhoneStdView
    },
    
    cancel:function(event){
      rwApp.goBack = true;
      if ($.hasVal(rwApp.newReferralData) && $.hasVal(rwApp.newReferralData.startingRoute)){
        var route = rwApp.newReferralData.startingRoute;
        rwApp.newReferralData = null;
        rwApp.newReferralMode = null;
        if (Backbone.history.fragment == route){Backbone.history.fragment = null;}
        rwApp.navigate(route,{trigger: true,replace: true});
      }else {
        
        history.back();
        
      }

    },
    
    deleteItem:function(event){
      if (_.isUndefined(event)){event = new Object()}
      event.dView = this.options.listView;
      var route = "'"+event.dView.options.refreshRoute+"'";
      var r = "rwApp.navigate(route,{trigger: true,replace: true});";
      r = r.replace("route",route);
        event.refreshFunction = r;
        
        event.confirmTemplate = "ConfirmDelete";
        event.setFields = "";
        event.setVals = "";
        event.actionRecordId = event.dView.model.get("id");
        //event.refreshlist;
        rwApp.updateKeyField(event);
        
          //rwApp.navigate(currentRoute,{trigger: true,replace: true});
    },
    
    importAddressBook:function(event){
      if (!$.hasVal(event)){
        event = new Object();
      }
              
      event.dView = this.options.listView;
      event.confirmTemplate = "ConfirmImport";
      event.refreshlist="true";
      event.setFields ="";
      event.setVals ="";
      //var route = "'"+event.dView.options.refreshRoute+"'";
      //var r = "rwApp.navigate(route,{trigger: true,replace: true});";
      //r = r.replace("route",route);
      r = "rwApp.refreshTopView(true)";
        event.refreshFunction = r;
        rwApp.updateKeyField(event);
          //rwApp.navigate(currentRoute,{trigger: true,replace: true});
    },

     refer:function(event){
            if (_.isUndefined(event)){event = new Object()}
          event.dView = this.options.listView;
          event.refWizard = this.options.refWizard;
          event.parentView = this;
          //event.toPartyId = this.options.detailview.model.get("partnerId");
          //event.toFullName = this.options.detailview.model.get("fullName");
          rwApp.referCustToSelectedPartner(event);
          
        },
        updateField:function(event){
            
          event.dView = this.options.listView;
          event.refreshFunction = "rwApp.phoneRefInbox()";          
          rwApp.updateKeyField(event);
        },

        joinchapter:function(event){
          var parentModel = this.options.listView.model;
          
          rwApp.joinChapter({OrgId:parentModel.get('id')});
        }
        
    
      
  });
  
   var PhoneContactModel = Backbone.Model.extend({
    
      options : {
        success: function (model, status, xhr) {},
        error: function(request, status, error) {}
      },
    
      initMobile : function (options) {
        this.bindEvents();
      },

      selected_onSuccess : function(contacts) {
        for (var i=0; i<contacts.length; i++) {
            console.log("Display Name = " + contacts[i].displayName);
        }
      },
    
      selected_onError : function(contactError) {
        rwApp.FYI('onError!');
      },

      onContactSelected : function(id) {
            console.log("Works! However only the contact's id is received, not the full contact object.");
            console.log("Contact ID = " + id);  //ex. John Appleseed, ID=3
            
            //TODO: How to look up the contact object by ID???
            var options = new ContactFindOptions();
            options.filter = "" + id;
            var fields = ["id","displayName","addresses", "name", "phoneNumbers", "emails", "phoneNumbers","organizations", "photos"];
            var contact = navigator.contacts.find(fields,phoneapp.phone_onSuccess, phoneapp.phone_onError, options);
      },

      // Application Constructor
      readystatus : false, 
      OnLineStatus : false,
      // Bind Event Listeners
      //
      // Bind any events that are required on startup. Common events are:
      // 'load', 'deviceready', 'offline', and 'online'.
      bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //document.addEventListener('offline', this.OffLine, false);
        //document.addEventListener('online', this.OnLine, false);
      },
    
      // deviceready Event Handler
      //
      // The scope of 'this' is the event. In order to call the 'receivedEvent'
      // function, we must explicity call 'app.receivedEvent(...);'
      onDeviceReady: function() {
        this.readystatus = true;
        this.OnLineStatus = true;
        console.log('Received Event: ' + id);
      },

      OffLine: function() {
        this.OnLineStatus = false;
        this.readystatus = false;
      },

      OnLine: function() {
        this.OnLineStatus = true;
      },
    
      phonePick : function() {
        var options = new ContactFindOptions();
        options.filter="";
        var fields = ["displayName", "name"];
        var contact = navigator.contacts.chooseContact(phoneapp.onContactSelected,  options);
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
        dataout["act"] = 'phoneread';

        $.ajax({
                type: "POST",
                url: strUrl,
                async: false,
                cache: true,
                dataType: "json",
                data: dataout,
                success: function(data, textStatus, jqXHR) {
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
                  
                  var NewReferralsRcvd = JSON.parse(data.NewReferralsRcvd.data);
                  item['NewReferralsRcvd'] = NewReferralsRcvd.length > 0? NewReferralsRcvd[0].count : 0 ;

                  var NewReferralsSent = JSON.parse(data.NewReferralsSent.data);
                  item['NewReferralsSent'] = NewReferralsSent.length > 0? NewReferralsSent[0].count : 0 ;
   
                  that.set(item);
                  
                  rwFB.routes = JSON.parse(data.routes);
                  // console.log(rwFB.routes);

                  options.success(that, textStatus, jqXHR);
                },
                error: function (request, status, error) {
                   options.error(request,status,error);
                }
        }); 
      }
     }); 
 
 
  return ReferralWirePhoneRouter;

  })(Backbone, _, $, ReferralWireRouterBase || window.jQuery || window.Zepto || window.ender);
  
  return Backbone.ReferralWirePhoneRouter; 

}));
