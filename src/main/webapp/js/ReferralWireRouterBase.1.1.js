(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
    var ReferralWireBase = require('ReferralWireBase');
    var ReferralWirePattern = require('ReferralWirePattern');
 
    module.exports = factory(jquery, underscore, backbone, ReferralWirePattern);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone', 'ReferralWirePattern'], factory);

  } 
  
}(this, function ($, _, Backbone, ReferralWirePattern) {

  Backbone.ReferralWireRouterBase = ReferralWireRouterBase = (function(Backbone, _, $, ReferralWirePattern){

  var slice = Array.prototype.slice;

  var ReferralWireRouterBase = Backbone.Router.extend({
    params : null,    
    
    routes: {
      "*actions": "defaultRoute"
    },

    defaultRoute : function (actions) {
    },

    initialize: function(options) {
      this.params = options.params;
      this.homepage = options.homepage;
      this.tenant = options.tenant;
      ReferralWireBase.init(options);
    },

    help : function (page) {
      rwcore.FYI("help" + page);
    },
    
    signout : function() {
      
        $.ajax({
            type: "POST",
            url: "/rwWebRequest?logout=true",
            async: false,
            cache: true,
            dataType: "json",
            data: {},
            success: function(model, response, jqXHR) {
               if ( rwFB.geoLocationWatchID != null ) {
                navigator.geolocation.clearWatch(rwFB.geoLocationWatchID);
                rwFB.geoLocationWatchID = null;
              }
              window.location = "/login.jsp";
            },
            error : rwcore.showError
        }); 
        
    },

    createNewRecord : function(el, appletName, templateHTML,filter, success) {
      // get the rendering template
        var view = new ReferralWireView.FormView({ applet: appletName, 
              templateHTML : templateHTML,
              success : function(model, response, jqXHR) {
                if (!_.isUndefined(success) )
                  success(model, response, jqXHR);
              },
              error : rwcore.showError 
        });
        view.setDefaultModel();
        // render
      $(el).html(view.render().el).trigger('create');
    },
    
    GenericSummaryDetailPattern : function(options) { _.bind(ReferralWirePattern.GenericSummaryDetailPattern, this, options)();},
    GenericListDetailPattern : function(options) { _.bind(ReferralWirePattern.GenericListDetailPattern, this, options)();},
    GenericMergedListDetailPattern : function(options) { _.bind(ReferralWirePattern.GenericMergedListDetailPattern, this, options)();},
    GenericMasterDetailPattern : function(options) { _.bind(ReferralWirePattern.GenericMasterDetailPattern, this, options)();},
    MasterDetailWithNextPrev : function(options) { _.bind(ReferralWirePattern.MasterDetailWithNextPrev, this, options)() ;},
    MasterDetailRenderChildren : function(options) { _.bind(ReferralWirePattern.MasterDetailRenderChildren, this, options)() ;},
    ReferralsMasterTwoDetail : function(options) { _.bind(ReferralWirePattern.ReferralsMasterTwoDetail, this, options)() ;},
    GenericSummaryTilesPattern : function(options) { _.bind(ReferralWirePattern.GenericSummaryTilesPattern, this, options)();},
    
    //allEventDataOptions is an array of dataoptions used by both the desktop and the smartphone apps to populate the
    //AllEvents list view. The items in the array are each used as arguments to the fetch data from the server
    // the results are merged into a single collection on the client via a backbone utility
    allEventDataOptions:[{

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
                //sortby : options.sortby,
                //sortOrder : _.isUndefined(options.sortOrder) ? "ASC" : options.sortOrder,
            },
            /*
            {

                module : "AttendeeMgr",
                //act:options.act,
                bo:"Attendee",
                bc:"Attendee",
                searchSpec:{
                      filter:[
                        {
                          ftype:"time", 
                          period:"1440",
                          fieldname:"denorm_datetime", 
                        },
                        {
                          ftype:"self",
                          fieldname:"partyId",
                          attr:"_id"
                        }
                    ]
                },
                calculatedFields: {
                  dayName:function(model){
                    var dateVal = (_.isObject(model.get('denorm_datetime')))?model.get('denorm_datetime').$date:model.get('denorm_datetime');
                    var date = new Date(dateVal);
                    var retVal = rwcore.getLovDisplayVal('WEEKDAY',date.getDay());
                    retVal += ", " + dateFormat(new Date(dateVal),'mmm d'); 
                    return retVal;
                  },
                  datetime:function(model){
                    return model.get('denorm_datetime');
                  },
                  attendeeId:function(model){
                    return model.get("id");
                  },
                  id:function(model){
                    return model.get("eventId");
                  },
                  _id:function(model){
                    return {"$oid":model.get("eventId")};
                  },
                  orgPhotoUrl:function(model){
                    return model.get('Org_photoUrl');
                  },
                  pastFuture:function(model){
                    var dateVal = (_.isObject(model.get('denorm_datetime')))?model.get('denorm_datetime').$date:model.get('denorm_datetime');
                    var date = new Date(dateVal);
                    var gracePeriod = 0;//1000 * 60 * 60 * 2; //2 hours
                    var retVal = (date.getTime() - gracePeriod > (new Date()).getTime())?"Future":"Past";
                    return retVal;
                  }

                },
                //sortby : options.sortby,
                //sortOrder : _.isUndefined(options.sortOrder) ? "ASC" : options.sortOrder,
            }
            */
    ],


    ContactRefWizard : { //this isn't a route it's a declaration on the referral wizard structure that's referenced by several partner views 
          showConfirmOnSave:'ReferralSentConfirmation',
          viewTemplate: 'WizardUpsertView',
          stations: ["Referral Type","Who","Context","Other"],
          firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
          firstApplet:{name:"ReferralWizard_1WhosThis"},
          refreshFunction: function(model,thisView){//$$
                            thisView.parentView.refreshInPlace(model);

                        },
          partyDefaults: {
                CUST_FOR_PART:{
                  contactId:'firstPartyId',
                  contact_fullName:'firstPartyFullName',
                  contact_firstName:'firstPartyFirstName'
                },
                PART_FOR_PART:{
                  toId:'firstPartyId',
                  to_fullName:'firstPartyFullName',
                  to_firstName:'firstPartyFirstName'
                },
                
                PART_FOR_CUST:{
                  contactId:'firstPartyId',
                  contact_fullName:'firstPartyFullName',
                  contact_firstName:'firstPartyFirstName'
                }
                
                  
          },
          nextAppletFunctions:{
            ReferralWizard_1WhosThis:function(model,wizSpec){
              var referralType = model.get('referralType');
              var firstPartyEmail = model.get('firstPartyEmail');
              //var firstPartyProf = model.get('firstPartyProfession');
              //var summaryText = "Referrals can only be made to non-members if they have a valid email -- so we can invite them to join." 
              var pMap = wizSpec.partyDefaults[referralType];
              var vMap = new Object();
              if ($.hasVal(pMap)){
                for (item in pMap){
                  vMap[item] = model.get(pMap[item]);
                }
              }
              var vMapAry = _.toArray(vMap);
  
                if (referralType == "CUST_FOR_PART"){
                  if (vMapAry.length > 0) 
                    model.set(vMap);
                  model.set({comments:""})
                  return {name:"ReferralWizard_2PickCustomer"}
                }
                
                if (referralType == "PART_FOR_PART"){
                  if ($.hasVal(firstPartyEmail) && firstPartyEmail.indexOf("@") > 0 && vMapAry.length > 0){model.set(vMap);}
                  model.set({comments:"I believe the two of you would be good power partners. I encourage you to connect through STN Connect."})
                  return {name:"ReferralWizard_2PickOtherPartner"}
                }
                if (referralType == "PART_FOR_CUST"){
                  if (firstPartyEmail.indexOf("@") > 0 && vMapAry.length > 0){model.set(vMap);}
                  model.set({comments:""})
                  return {name:"ReferralWizard_2PickIndirect"}
                }
                if (referralType == "PART_INVITE"){
                  return {name:"InvitationWizard_ContactInfo"}
                }
              
            },
            ReferralWizard_2PickCustomer:function(model,wizSpec){return {name:"ReferralWizard_3WhyNowCust"}},
            ReferralWizard_2PickOtherPartner:function(model,wizSpec){return {name:"ReferralWizard_3WhyNowPart"}},
            ReferralWizard_2PickIndirect:function(model,wizSpec){return {name:"ReferralWizard_3WhyNowIndirect"}},
            InvitationWizard_ContactInfo:function(model,wizSpec){
              var toFirstName = model.get("newContactFirst");
              var toPartyType = "CONTACT";
              var invitationText = $.getInvitationText(model,toFirstName,toPartyType);
              
              model.set({comments:invitationText})
              return {name:"ReferralWizard_3WhyNowInvite"}
            },
            ReferralWizard_3WhyNowPart:function(model,wizSpec){return {name:"ReferralWizard_4NoteP2P",template:'CreateReferralWizardFormP2P'}},
            ReferralWizard_3WhyNowCust:function(model,wizSpec){return {name:"ReferralWizard_4NotesCustomQ", template: 'CreateReferralWizardForm'}},
            ReferralWizard_3WhyNowIndirect:function(model,wizSpec){
              var summaryVal = "<ul><li>Send your email to [contact_firstName]; and</li><li>Let [to_firstName] know you've recommended him/her to one of your contacts</li></ul>";
              summaryVal += "<div style='padding-top: 25px;font-weight: bold;font-style: italic;'>If [to_firstName] enters [_contact_firstName] into his/her STN Connect address book in the future, we'll make sure [to_firstName] knows [contact_firstName] was referred by you.</div>"
              summaryVal = $.substituteVals(summaryVal,model);
              var boilerPlate = "[to_firstName] is a great resource.";
              boilerPlate = $.substituteVals(boilerPlate,model);
              model.set({comments:boilerPlate,summaryText2:summaryVal});
              return {name:"ReferralWizard_4NoteIndirect"}
            },
            ReferralWizard_3WhyNowInvite:function(model,wizSpec){
              var summaryVal = "Send an invitation with your message to [newContactFirst] with a registration link.";
              summaryVal = $.substituteVals(summaryVal,model);
              model.set({summaryText2:summaryVal});
              return {name:"ReferralWizard_4InviteNote"}
            },
       
          }
     },
     
    ContactRefWizard_phoneHomeRefWizard : function(){
      var CRW_copy = _.clone(rwApp.ContactRefWizard);
      CRW_copy.partyDefaults = new Object();
      //CRW_copy.refreshFunction 
      return CRW_copy;
     },

    referCustToSelectedPartner:function(event){
     
       //var that = this;
       
        var refWizardSpec = event.refWizard;
        var dView = event.dView;
        var dViewModel = ($.hasVal(dView))?dView.model:($.hasVal(event.dViewModel))?event.dViewModel:undefined;  
        if ($.hasVal(dViewModel)){
          var firstPartyId = dViewModel.get(refWizardSpec.firstPartyIdField)
          //var toPartyId = event.toPartyId;
          var firstPartyFullName = ($.hasVal(refWizardSpec.firstPartyFullNameField))?dViewModel.get(refWizardSpec.firstPartyFullNameField):dViewModel.get("fullName_pub");
          var firstPartyFirstName = ($.hasVal(refWizardSpec.firstPartyFirstNameField))?dViewModel.get(refWizardSpec.firstPartyFirstNameField):dViewModel.get("firstName_pub");
          var firstPartyEmail = ($.hasVal(refWizardSpec.firstPartyEmailAddressField))?dViewModel.get(refWizardSpec.firstPartyEmailAddressField):dViewModel.get("emailAddress_pub");
          var firstPartyProfession = ($.hasVal(refWizardSpec.firstPartyProfessionField))?dViewModel.get(refWizardSpec.firstPartyProfessionField):dViewModel.get("profession");
          var secondPartyFullName = dViewModel.get(refWizardSpec.secondPartyFullNameField);
          var secondPartyFirstName = dViewModel.get(refWizardSpec.secondPartyFirstNameField);
          var secondPartyEmail = dViewModel.get(refWizardSpec.secondPartyEmailAddressField);
          var secondPartyProfession = dViewModel.get(refWizardSpec.secondPartyProfessionField);
          
        }
        var summaryText = "You can only pick parties that are Successful Thinkers members or have a valid email.";
        
        var parentView = (!_.isUndefined(event.parentView) && !_.isNull(event.parentView))?event.parentView:null;
          //var userdata = new ReferralWire.StandardModel({module:'UserMgr', id: toPartyId});
        var userdata = new rwcore.StandardModel({module:'UserMgr',id:firstPartyId});

        var refModel = new rwcore.StandardModel({"module" : "RfrlMgr"});
        var refMetaApplet = new ReferralWireBase.AppletView({applet: refWizardSpec.firstApplet.name});
        //template: this.templateHTML,showViewBar:this.showViewBar,viewBarTemplate:this.viewBarTemplate
        ReferralWireBase.setDefaultValues(refModel, refMetaApplet, null);
        if ($.hasVal(dViewModel)){
          refModel.set({
            firstPartyId:firstPartyId,
            firstPartyFullName: firstPartyFullName,
            firstPartyFirstName: firstPartyFirstName,
            firstPartyEmail:firstPartyEmail,
            firstPartyProfession:firstPartyProfession,
            question1: dViewModel.get("question1"),
            question2: dViewModel.get("question2"),
            question3: dViewModel.get("question3"),
            question4: dViewModel.get("question4"),
            summaryText:summaryText,
            secondPartyFullName:secondPartyFullName,
            secondPartyFirstName:secondPartyFirstName,
            secondPartyEmail:secondPartyEmail,
            secondPartyProfession:secondPartyProfession
          }); // this will have to change with OON
        } else {
           refModel.set({
            summaryText:summaryText
          }); // this will have to change with OON
        }

        
        var wizard = new ReferralWireView.WizardUpsertView ( { 
            firstApplet:refWizardSpec.firstApplet,
            nextAppletFunctions:refWizardSpec.nextAppletFunctions,
            appletTemplates:refWizardSpec.appletTemplates,
            viewTemplate: refWizardSpec.viewTemplate,
            upsertmodel: refModel,
            stations:refWizardSpec.stations,
            saveFunction:refWizardSpec.saveFunction,
            refreshFunction:event.refnewreshFunction,
            refreshFunctionStatic:event.refreshFunctionStatic,
            parentView: event.parentView,
            showConfirmOnSave: refWizardSpec.showConfirmOnSave,
            wizardSpec:refWizardSpec
          });
          //var firstAppletView = wizard.getCurrentAppletView(wizard.firstApplet);//this will initialize the wizard model

        
        wizard.render();

          

       },
   

      upsertRecord : function(options){
      
      var el = options.el;
      var appletName = options.appletName;
      var templateHTML = ($.hasVal(options.upsertTemplate))?options.upsertTemplate:'upsertForm';
      var model = options.upsertModel;
      var parentView = options.parentView;
    
      // get the rendering template
        var view = new ReferralWireView.FormView({
            applet: appletName, 
              templateHTML : templateHTML,
              parentView : parentView,
              showConfirmOnSave:options.showConfirmOnSave,
              refreshFunctionStatic:options.refreshFunctionStatic,
              refreshFunction:options.refreshFunction, 
              success : function(model, response, jqXHR) {
              },
              error : rwcore.showError 
        });
        if (model == ''){view.setDefaultModel();}
        else {

            if (_.isUndefined(model.options.bo) && !_.isUndefined(view.bo)){model.options.bo = view.bo;}
            if (_.isUndefined(model.options.bc) && !_.isUndefined(view.bc)){model.options.bc = view.bc;}
            view.model = model
        }
        var fields = view.metaApplet.model.attributes.field;

     
    if ( _.isArray(fields) == false ) {
        fields = [fields];
      }
        var fieldList = _.clone(fields);
        rwApp.FetchRadioButtonModels({view:view,fieldList:fieldList,done:"showUpsert",wizardView:null});
    },

    
    
    FetchRadioButtonModels:function(options){

        //this.options = options;
        var thisField = options.fieldList[0]
        var updatedList = _.rest(options.fieldList);        
        var that = this;  

          if ((thisField.dataType == "radio" || thisField.dataType == "multicheckbox_search") && !$.hasVal(thisField.lovType)){ //
            var pickAppletName = thisField['pickApplet'];
              var pickAppletFilter = thisField['pickAppletFilter'];
              var pickCreateApplet = thisField['pickCreateApplet'];
              var usePaging = null;
              var usePaging = ($.hasVal(thisField['pickUsePaging']) && thisField['pickUsePaging'])?true:null;
              var radioLimit = 10;//used only if paging is on - sets page size for radio list
          
              var pickListTemplate = 'StdDynamicPickList';
              var pickMaps = rwApp.getCopyPickMaps(thisField.pickMap);
              
              var template = 'StdList';
      
              var metaApplet = new ReferralWireBase.RepoObjectModel({type: 'Applet', name: pickAppletName});

              /*  
              var pickView = new ReferralWireView.ListView({ 
                applet: pickAppletName, 
                setFilter:true, 
                template: pickListTemplate, 
                //parentView: this, 
                //ulClass:"pickID",
                //usePaging:usePaging,
                pickMap : pickMaps});
              */

              //var constraints = rwApp.addConstraintPickMapExpressions(thisField.pickMap,options.view.model,pickView.searchSpec);
              var constraints = rwApp.addConstraintPickMapExpressions(thisField.pickMap,options.view.model, metaApplet.get('searchSpec'));
              
              //var pickAppletfields = pickView.listItem.metaApplet.model.attributes.field;
              var pickAppletfields = metaApplet.attributes.field;
              
              if (!_.isUndefined(metaApplet.get('sortBy')) && !_.isNull(metaApplet.get('sortBy')))
                var sortByField = metaApplet.get('sortBy');
              else if ($.isArray(pickAppletfields))
                var sortByField = pickAppletfields[0]['fldname'];
              else
                var sortByField = pickAppletfields['fldname'];

                var data = new rwcore.StandardCollection({
                  "module" : metaApplet.get('actor'), 
                  bo: metaApplet.get('bo'),
                  bc: metaApplet.get('bc'),
                  searchSpec: constraints, 
                  "sortby" :sortByField,
                  limit: _.isNull(usePaging) ? undefined : radioLimit//rwcore.pagingSize
                });

              data.fetch({      
                    add : true,
      
                          error: function (request, status, error) {
                            
                              var errorDiv = new rwcore.ErrorView ({request : request,status : status, error : error}); 
                              errorDiv.render(status.responseText);
                      },
                      success : function (model, response, jqXHR) {

                        //that.options.view.metaApplet.model.attributes[thisField.fldname].radioList = model;
                        //that.options.view.metaApplet.model.attributes[thisField.fldname].radioPickMaps = pickMaps;
                        thisField.radioList = model;
                        thisField.radioPickMaps = pickMaps;
                        options.view.metaAppletHasRadioModels = true;
                        
                        if (!$.hasVal(options.view.radioModels))
                          options.view.radioModels = new Object();
                          options.view.radioModels[thisField.fldname] = {radioPickMaps:pickMaps,radioList:model};
                          if (updatedList.length > 0){
                            rwApp.FetchRadioButtonModels({view:options.view,fieldList:updatedList,done:options.done,wizardView:options.wizardView});
                          } else {
                            if (options.done == "showUpsert"){
                              rwApp.openStandardDialog({view:that.options.view});
                            }
                            if (options.done == "wizardNextApplet"){
                              options.wizardView.renderStep();  
                            }
                            if (options.done == "initializeWizard"){
                              options.wizardView.renderFirstStep(); 
                            } 
                            if (typeof(options.done) === 'function'){
                                options.done(options);
                            }
                            //initializeWizard
                            
                          }
                        }
              });

          }
          else { //the field isn't a radio we need data for
            
            if (updatedList.length > 0){
              rwApp.FetchRadioButtonModels({view: options.view,fieldList:updatedList,done: options.done,wizardView: options.wizardView});
            } else {
            
              if ( options.done == "showUpsert"){
                rwApp.openStandardDialog({view:options.view});
              }
              if (options.done == "wizardNextApplet"){
                options.wizardView.renderStep();
              }
              if (options.done == "initializeWizard"){
                options.wizardView.renderFirstStep(); 
              }
              if (typeof(options.done) === 'function'){
                  options.done(options);
              }
              
            }
          }
        
    },
    renderList : function(el, appletName, templateHTML, filter) {

      // get meta data for rendering
      var view = new ReferralWireView.ListView ({ applet: appletName, template: templateHTML});
 
    // get data
      var data = new rwcore.StandardCollection({"module" : view.actor, searchSpec: view.searchSpec });
      data.fetch( { 
        add : true,
        error : rwcore.showError, 
        success : function (model, response, jqXHR) {
            // render
            $(el).html(view.render(model).el).trigger('create');
        }
      });
    },

  getContactProfessionalTemplate:function(model){
    var retVal = 'StdFormContact';
    if ($.hasVal(model)){
          var type = model.get("type");
          var pType = model.get("partytype");
          //if (pType == "PARTNER"){
          if (type == "REFERRAL_PARTNER"){
          retVal = 'StdFormContactPartner';
        }
        }
        return retVal;
  },
getReferralInboxHomeTemplate:function(model){
    
        var fromId = model.get("fromId");
        if (fromId == rwFB.uId){
          return rwApp.getReferralOutboxHomeTemplate(model);
        }
        var retVal = 'ReferralInbox';
        if ($.hasVal(model)){
        
          var referralType = ($.hasVal(model.get("referralType")))?model.get("referralType"):"CUST_FOR_PART";
          var status = ($.hasVal(model.get("status")))?model.get("status"):"ACCEPTED";
          
          if (referralType == "CUST_FOR_PART" && status == "UNREAD"){
            retVal = 'ReferralInboxUnread'; //update this
            
          }
          
          
          if (referralType == "PART_FOR_PART"){
            retVal = 'ReferralInboxP2P'; //update this
          }
          
          if (referralType == "PART_INVITE"){
            retVal = 'ReferralInboxInvite'; //update this
          }
        }
        return retVal;
      
    },
    
    getReferralOutboxHomeTemplate:function(model){
        var retVal = 'ReferralOutbox';
        if ($.hasVal(model)){
          var referralType = ($.hasVal(model.get("referralType")))?model.get("referralType"):"CUST_FOR_PART";
          
          if (referralType == "PART_FOR_PART"){
            retVal = 'ReferralOutboxP2P'; //update this
          }
          
          if (referralType == "PART_INVITE"){
            retVal = 'ReferralOutboxInvite'; //update this
          }
        }
        return retVal;
    },
    

    
    getReferralViewForm:function(model){
      
        var retVal = 'ViewReferralForm';
        if ($.hasVal(model)){
          var referralType = ($.hasVal(model.get("referralType")))?model.get("referralType"):"CUST_FOR_PART";
          var status = model.get("status");
          if (referralType == "PART_FOR_PART"){
          return 'ViewReferralFormP2P'; //update this
        }
        if (referralType == "CUST_FOR_PART" && status == "UNREAD" ){
          return 'ViewReferralFormUnreadProspect'; //update this
        }
        if (referralType == "PART_INVITE"){
          return 'ViewReferralFormInvite'; //update this
        }
        
        }
        return retVal;
          
      
  },
  
  getReferralViewOutForm:function(model){
          
        var retVal = 'OutBoxReferralForm';
        if ($.hasVal(model)){
          var referralType = ($.hasVal(model.get("referralType")))?model.get("referralType"):"CUST_FOR_PART";
          var status = model.get("status");
          if (referralType == "PART_FOR_PART"){
          return 'OutBoxReferralFormP2P'; //update this
        }
        if (referralType == "PART_INVITE"){
          return 'OutBoxReferralFormInvite'; //update this
        }
        
        }
        return retVal;
          
      
  },
  getPartnerReferralReceivedTempl:function(model){
    
    var retVal = 'PartnerReferralInbox';
    if ($.hasVal(model)){
          var referralType = ($.hasVal(model.get("referralType")))?model.get("referralType"):"CUST_FOR_PART";
          var status = model.get("status");
        if (referralType == "PART_FOR_PART"){
          retVal ='PartnerReferralInboxP2P'; //update this
        }
        if (referralType == "PART_INVITE"){
          retVal = 'PartnerReferralInboxInvite' //update this
        }
        
        }
        return retVal;
    
  },
  
  getPartnerReferralGivenTempl:function(model){
    var retVal = 'PartnerReferralOutbox';
    if ($.hasVal(model)){
          var referralType = ($.hasVal(model.get("referralType")))?model.get("referralType"):"CUST_FOR_PART";
          var status = model.get("status");
          if (referralType == "PART_FOR_PART"){
          retVal = 'PartnerReferralOutBoxP2P'; //update this
        }
        if (referralType == "PART_INVITE"){
          retVal = 'PartnerReferralOutBoxInvite'; //update this
        }
        
        }
        return retVal;
  },

  getContactListTempl:function(model){
    var retVal = "ContactListPrivate";
    if ($.hasVal(model)){
      var type = model.get("type");
      var partytype = model.get("partytype_denorm");
      if (type == "REFERRAL_CONTACT" && (partytype == "PARTNER" || partytype == "PARTNER_DEMO")){retVal = "ContactListNoRelation";}
      if (type == "REFERRAL_PARTNER"){retVal = "ContactList";}
    }
   return retVal;
  },

  getContactQualificationsTemplate:function(model){
      return $.hasVal(model) && model.get("type") ==  "REFERRAL_PARTNER" ? "QualificationsFormDisplay" : "StdFormContactPartner";
  },
  
  getContactProfessionalApplet:function(model){
    var retVal = "ProfessionalContact";
    if ($.hasVal(model)){
          var type = model.get("type");
          var pType = model.get("partytype");
          //if (pType == "PARTNER"){
          if (type == "REFERRAL_PARTNER"){
          retVal = "ProfessionalContactPartner";
        }
        }
        return retVal;
  },

  getPublicMemberApplet:function(model){
    
      var retVal = "PartyAppletFormPublic";
      if(!_.isUndefined(model)){
        var clickRoute = Backbone.history.fragment.split("/")[0];
        var privCheck = {routeName:clickRoute,record:model}
        
        if (_.contains(['memberList','memberProfile','PhoneMemberContact'],clickRoute)){  
          privCheck.privilege = "viewFullProfile";
          if ($.hasAccess(privCheck)) {
            retVal= "PartyAppletFormAdmin";
          }
        }
      }
      return retVal;
  
  },
  
  getAddrListViewBarApplet:function(model){
    var retVal = "ContactsViewBar";
    if ($.hasVal(rwApp.tenant) && rwApp.tenant == "STN"){
        retVal = "STNContactsViewBar"
      }
    if ($.hasVal(model)){
          var type = model.get("type");
          //var pType = model.get("partytype");
          //if (pType == "PARTNER"){
          if (type == "REFERRAL_PARTNER"){
          retVal = "PartnersViewBar";
          if ($.hasVal(rwApp.tenant) && rwApp.tenant == "STN"){
            retVal = "STNPartnersViewBar"
          }
        }
        }
        return retVal;
  },
  
  getAddrRecViewBarApplet:function(model){
      return $.hasVal(model) && model.get("type") ==  "REFERRAL_PARTNER" ? "PartnerRecommendationsViewBar" : "ContactRecommendationsViewBar";
  },

  getTemplate:function(model){
    
    var clickRoute  = model.clickRoute;
    var privCheck = {routeName:clickRoute,record:model}
    var templateName = "not found";
    
    if (_.contains(["EventExpected","EventCheckedIn","EventGuests"],clickRoute)){
      templateName = "ChapterMeetingAttendeeListNoAct";
      privCheck.privilege = "editFull";
      if ($.hasAccess(privCheck)){
        templateName = "ChapterMeetingAttendeeList" 
      } else {
        privCheck.privilege = "addGuest";
        if ($.hasAccess(privCheck)){
          templateName= "ChapterMeetingAttendeeList"
        } 
      } 
      
     }

     if (_.contains(["phoneEventExpected","phoneEventCheckedIn","phoneEventGuests"],clickRoute)){
      templateName = "PhoneMeetingAttendeeListNoAct";
      privCheck.privilege = "editFull";
      if ($.hasAccess(privCheck)){
        templateName = "PhoneMeetingAttendeeList" 
      } else {
        privCheck.privilege = "addGuest";
        if ($.hasAccess(privCheck)){
          templateName= "PhoneMeetingAttendeeList"
        } 
      } 
      
     }

     
     if (clickRoute == "speakerBio"){
      var privCheck = {routeName:clickRoute,record:model,privilege:"edit"}
      templateName = "STN_speakerInviteMessage";
      if ($.hasAccess(privCheck)){
        templateName = "StdFormPlain" 
      }
     
     }
     
     return templateName;
    
  },
  

  InviteWizard : { //this isn't a route it's a declaration on the referral wizard structure that's referenced by several partner views 
          //showConfirmOnSave:'ReferralSentConfirmation',
          viewTemplate: 'WizardUpsertView',
          stations: ["Who","Message","Next Steps"],
          firstPartyIdField:"partnerId",//the user initiates a referral from a selected contact or partner.  This field referrences the id of the party.  It's "partnerId" if initiated from a parnter record
          firstApplet:{name:"InvitationWizard_ContactInfo"},
          nextAppletFunctions:{
            InvitationWizard_ContactInfo:function(model,wizSpec){
              var toFirstName = model.get("newContactFirst");
              var toPartyType = "CONTACT";
              var invitationText = $.getInvitationText(model,toFirstName,toPartyType);
              
              model.set({comments:invitationText,fromId:rwFB.uId,referralType:'PART_INVITE'})
              
              return {name:"ReferralWizard_3WhyNowInvite"}
            },
            ReferralWizard_3WhyNowInvite:function(model,wizSpec){
              var summaryVal = "Send an invitation with your message to [newContactFirst] with a registration link.";
              summaryVal = $.substituteVals(summaryVal,model);
              model.set({summaryText2:summaryVal});
              return {name:"ReferralWizard_4InviteNote"}
            },

          }
     },
        
      AddGuestSelfServiceWizard : { //this isn't a route it's a declaration on the referral wizard structure that's referenced by several partner views 
        showConfirmOnSave:'AddGuestConfirmation',
        viewTemplate: 'WizardUpsertView',
        stations: ["Guest Name","Confirmation"],
        firstApplet:{name:"AddGuestWizard_2AddNewMember"},
        
        nextAppletFunctions:{
        
          AddGuestWizard_2AddNewMember:function(model,wizSpec){
            var summaryVal = "We'll send [newContactFirst] a registration email!"; 
              summaryVal = $.substituteVals(summaryVal,model);
              model.set({nextSteps:summaryVal});
              return {name:"AddGuestWizard_4NewMemberConfirmation"};

          },
        
        }
        
   },

  refreshTopView : function(resetContext){
    
    if (!$.hasVal(resetContext)){resetContext = false}
     //var currentRoute = Backbone.history.fragment;
     var currentRoute = window.location.hash.replace("#","");
     
     
     if (resetContext && (currentRoute.indexOf("/") != -1)){
       //we need to strip off the record id in case the record is being filtered from the list
       var contextId = currentRoute.substr(currentRoute.lastIndexOf('/'));
       currentRoute = currentRoute.replace(contextId,"");
     }
     Backbone.history.fragment = null;
     rwApp.navigate(currentRoute,{trigger: true,replace: true});
    // return false;
      
    
   },
   refreshAndSelect : function(model){
    
     //var currentRoute = Backbone.history.fragment;
     var currentRoute = window.location.hash.replace("#","");
     var newRecordId = model.get("id");
     
     if (currentRoute.indexOf("/") != -1){
       //we need to strip off the record id in case the record is being filtered from the list
       var contextId = currentRoute.substr(currentRoute.lastIndexOf('/'));
       currentRoute = currentRoute.replace(contextId,newRecordId);
     } else {
        currentRoute += "/" + newRecordId;
     }
     Backbone.history.fragment = null;
     rwApp.navigate(currentRoute,{trigger: true,replace: true});
    // return false;
      
    
   },
   

ContactRefWizard_Recommendation : function(){
      
      var CRW_copy = _.clone(rwApp.ContactRefWizard);
      CRW_copy.firstPartyIdField = "contactPartyId";
      CRW_copy.firstPartyFullNameField = "contact_fullName";
    CRW_copy.firstPartyFirstNameField = "contact_firstName";
    CRW_copy.firstPartyEmailAddressField = "contact_emailAddress";
    CRW_copy.firstPartyProfessionField = "partner_profession";
    CRW_copy.secondPartyIdField = "partnerPartyId";
      CRW_copy.secondPartyFullNameField = "partner_fullName";
    CRW_copy.secondPartyFirstNameField = "partner_firstName";
    CRW_copy.secondPartyEmailAddressField = "partner_emailAddress";
    CRW_copy.secondPartyProfessionField = "partner_profession";
    
    CRW_copy.partyDefaults.CUST_FOR_PART = {
        contactId:'firstPartyId',
        contact_fullName:'firstPartyFullName',
        contact_firstName:'firstPartyFirstName',
      
      toId:'secondPartyId',
        to_fullName:'secondPartyFullName',
        to_firstName:'secondPartyFirstName',
      recipientProfession:'secondPartyProfession',
    };
    CRW_copy.partyDefaults.PART_FOR_PART = {
        toId2:'firstPartyId',
        to_fullName2:'firstPartyFullName',
        to_firstName2:'firstPartyFirstName',
      
      toId:'secondPartyId',
        to_fullName:'secondPartyFullName',
        to_firstName:'secondPartyFirstName',
      recipientProfession:'secondPartyProfession',
    };
    CRW_copy.partyDefaults.PART_FOR_CUST = {
        contactId:'firstPartyId',
        contact_fullName:'firstPartyFullName',
        contact_firstName:'firstPartyFirstName',
      
      toId:'secondPartyId',
        to_fullName:'secondPartyFullName',
        to_firstName:'secondPartyFirstName',
      recipientProfession:'secondPartyProfession',
    };
    
    
      return CRW_copy;
     },
     ContactRefWizard_ServProvRecommendation : function(){
      
      var CRW_copy = _.clone(rwApp.ContactRefWizard);
      CRW_copy.firstPartyIdField = "contactPartyId";
      CRW_copy.firstPartyFullNameField = "contact_fullName";
    CRW_copy.firstPartyFirstNameField = "contact_firstName";
    CRW_copy.firstPartyEmailAddressField = "contact_emailAddress";
    CRW_copy.firstPartyProfessionField = "contact_profession";
    
      CRW_copy.secondPartyIdField = "partnerPartyId";
      CRW_copy.secondPartyFullNameField = "partner_fullName";
    CRW_copy.secondPartyFirstNameField = "partner_firstName";
    CRW_copy.secondPartyEmailAddressField = "partner_emailAddress";
    CRW_copy.secondPartyProfessionField = "partner_profession";
    
    CRW_copy.partyDefaults.CUST_FOR_PART = {
      contactId:'secondPartyId',
        contact_fullName:'secondPartyFullName',
        contact_firstName:'secondPartyFirstName',
        toId:'firstPartyFullName',
        to_fullName:'firstPartyFullName',
        to_firstName:'firstPartyFirstName',
        recipientProfession:'secondPartyProfession'
    
    }
    
    
      return CRW_copy;
     },

     ContactRefWizard_P2PRecommendation : function(){

      var CRW_copy = _.clone(rwApp.ContactRefWizard);
      CRW_copy.firstPartyIdField = "partnerPartyId";
      CRW_copy.firstPartyFullNameField = "partner_fullName";
    CRW_copy.firstPartyFirstNameField = "partner_firstName";
    CRW_copy.firstPartyEmailAddressField = "partner_emailAddress";
    CRW_copy.firstPartyProfessionField = "partner_profession";
    CRW_copy.firstApplet = {name:"ReferralWizard_1WhosThis_P2P"},
    
    CRW_copy.secondPartyIdField = "contactPartyId";
      CRW_copy.secondPartyFullNameField = "contact_fullName";
    CRW_copy.secondPartyFirstNameField = "contact_firstName";
    CRW_copy.secondPartyEmailAddressField = "contact_emailAddress";
    CRW_copy.partyDefaults.PART_FOR_PART = {
      toId:'firstPartyId',
        to_fullName:'firstPartyFullName',
        to_firstName:'firstPartyFirstName',
        toId2:'secondPartyFullName',
        to_fullName2:'secondPartyFullName',
        to_firstName2:'secondPartyFirstName'
    
    };
    CRW_copy.nextAppletFunctions.ReferralWizard_1WhosThis_P2P = function(model,wizSpec){
      return wizSpec.nextAppletFunctions.ReferralWizard_1WhosThis(model,wizSpec);
      //ReferralWizard_1WhosThis_P2P has a different default value for referral type, but the logic 
      //for gettin the next applet is the same as ReferralWizard_1WhosThis
    } 
    
    
      return CRW_copy;
     },
     
     ContactRefWizard_partnerRefWizard : function(){
      var CRW_copy = _.clone(rwApp.ContactRefWizard);
      CRW_copy.partyDefaults.PART_FOR_PART = {
      toId:'firstPartyId',
        to_fullName:'firstPartyFullName',
        to_firstName:'firstPartyFirstName',
      recipientProfession:'firstPartyProfession'
    };
    CRW_copy.nextAppletFunctions.ReferralWizard_3WhyNowPart = function(model,wizSpec){return {name:"ReferralWizard_4NoteP2P",template:'CreateReferralWizardFormP2P'}}
    
    return CRW_copy;
     },
     
     
     
     
     
     
     ContactUpsertWizard : function(){
      var contactUpWizard =
        {
          viewTemplate: 'WizardUpsertView',
          refreshFunction:rwApp.refreshContactAfterInsert,
          stations: ["Work","Home"],
          firstApplet:{name:"ProfessionalContactUpsert"},
          nextAppletFunctions:{
            ProfessionalContactUpsert:function(model,wizSpec){
              return {name:"PersonalContactInsert"}
            }
          }
          //the nextAppletFunctions object is a list of functions that return the next applet in the wizard
          //these functions enable the wizard to branch down different paths from a given node as needed
          //the function name is the applet user is currently looking at when they hit the Next button
          //the function uses the current model to decide what applet to show next

        }   
      return contactUpWizard;
     },
    

      updateClaimedReferralWizard: {
        
          //showConfirmOnSave:'AddGuestConfirmation',
        viewTemplate: "WizardUpsertView",
        stations: ["New Status","Notes","Next Steps","Forward To","Confirm"],
        firstApplet:{name:"ClaimedUpdate_NewReferralStatus1A",template:"WizardUpsertFormRefStatus"},
        nextAppletFunctions:{
              ClaimedUpdate_NewReferralStatus1A:function(model,wizSpec){
                
                var newStatus = model.get('protoStatus');
                if (newStatus == 'NOSALE'){
                  return {name:"ClaimedUpdate_WhyClaimedToNoSale1A_2A"}
                }
                if (newStatus == 'CONFIRMED'){
                  return {name:"ClaimedUpdate_ContactedNoteToSender2B_3A"}
                }
                if (newStatus == 'CONVERTED'){
                  return {name:"ClaimedUpdate_ConvertedNoteToSender2C_3A"}
                }
                if (newStatus == 'ARCHIVED'){
                  return {name:"ClaimedUpdate_NextSteps4M",stationNumber:4,template:"WizardUpsertFormRefStatusConfirm"}
                }
                
              },
              ClaimedUpdate_WhyClaimedToNoSale1A_2A:function(model,wizSpec){
                  model.set({toId_fwd:undefined,to_fullName_fwd:undefined,recipientProfession_fwd:undefined});
                  var shareUpdate = 'YES'//model.get('shareNoSaleUpdate');
                  if (shareUpdate == 'NO'){
                    return {name:"ClaimedUpdate_NoSalePrivate2A_3B"}
                  } else {
                    return {name:"ClaimedUpdate_NoSale2A_3A"}
                  }
              },
              ClaimedUpdate_NoSale2A_3A:function(model,wizSpec){
                  if ($.hasVal(model.get('toId_fwd'))){
                    var msg = "<ul><li>ZfromFullName will be notified that you don't see an opportunity to move forward with ZcontactFullName at this time.</li><li>The original referral will be archived and a new referral will be created from you to ZtoFullNameFWD.</li></ul>";
                    msg = msg.replace("ZfromFullName",model.get('from_fullName'));
                    msg = msg.replace("ZcontactFullName",model.get('contact_fullName'));
                    msg = msg.replace("ZtoFullNameFWD",model.get('to_fullName_fwd'));
                    model.set({summaryText:msg})
                    if (!$.hasVal(model.get('recipientProfession_fwd'))){
                      model.set({recipientProfession_fwd:'Other',referral_reason_fwd:'OTHER'})
                    }
                    return {name:"ClaimedUpdate_ContactedForwardTo4M",template: 'ForwardReferralWizardForm'}
                  } else {
                    var msg = "<ul><li>ZfromFullName will be notified that you don't see an opportunity to move forward with ZcontactFullName at this time.</li><li>The referral will be archived.</li></ul>";
                    msg = msg.replace("ZfromFullName",model.get('from_fullName'));
                    msg = msg.replace("ZcontactFullName",model.get('contact_fullName'));
                    model.set({summaryText:msg})
                    return {name:"ClaimedUpdate_NextSteps4M",stationNumber:4,template:"WizardUpsertFormRefStatusConfirm"}
                  }
              },

              

              ClaimedUpdate_ConvertedServiceProvided1A_2C:function(model,wizSpec){
                    var archiveNow = model.get("archiveNow");
                    var msg = "ZfromFullName will be notified that you made a sale to ZcontactFullName.";
                    if (archiveNow == "YES"){msg = "ZfromFullName will be notified that you made a sale to ZcontactFullName and the lead will be archived.";}
                    msg = msg.replace("ZfromFullName",model.get('from_fullName'));
                    msg = msg.replace("ZcontactFullName",model.get('contact_fullName'));
                    model.set({summaryText:msg})
                  return {name:"ClaimedUpdate_NextSteps4M",stationNumber:4,template:"WizardUpsertFormRefStatusConfirm"}
              },

              ClaimedUpdate_ConvertedNoteToSender2C_3A:function(model,wizSpec){

                  return {name:"ClaimedUpdate_ConvertedServiceProvided1A_2C"}
              },
              ClaimedUpdate_ContactedNoteToSender2B_3A:function(model,wizSpec){
                    var msg = "ZfromFullName will be notified that you contacted ZcontactFullName and that the lead represents an active opportunity for you.";
                    msg = msg.replace("ZfromFullName",model.get('from_fullName'));
                    msg = msg.replace("ZcontactFullName",model.get('contact_fullName'));
                    model.set({summaryText:msg})
                  return {name:"ClaimedUpdate_NextSteps4M",stationNumber:4,template:"WizardUpsertFormRefStatusConfirm"}
              },

              ClaimedUpdate_ContactedNoOpportunity2B_3B:function(model,wizSpec){
                
                 if ($.hasVal(model.get('toId_fwd'))){
                    var msg = "ZfromFullName will be notified that you contacted ZcontactFullName but don't see an opportunity to move forward at this time. The original referral will be archived and a new referral will be created from you to ZtoFullNameFWD.";
                    msg = msg.replace("ZfromFullName",model.get('from_fullName'));
                    msg = msg.replace("ZcontactFullName",model.get('contact_fullName'));
                    msg = msg.replace("ZtoFullNameFWD",model.get('to_fullName_fwd'));
                    model.set({summaryText:msg})
                    if (!$.hasVal(model.get('recipientProfession_fwd'))){
                      model.set({recipientProfession_fwd:'Other',referral_reason_fwd:'OTHER'})
                    }
                    return {name:"ClaimedUpdate_ContactedForwardTo4M",template: 'ForwardReferralWizardForm'}
                  } else {
                    var msg = "ZfromFullName will be notified that you contacted ZcontactFullName but don't see an opportunity to move forward at this time.  The referral will be archived.";
                    msg = msg.replace("ZfromFullName",model.get('from_fullName'));
                    msg = msg.replace("ZcontactFullName",model.get('contact_fullName'));
                    model.set({summaryText:msg})
                    return {name:"ClaimedUpdate_NextSteps4M",stationNumber:4,template:"WizardUpsertFormRefStatusConfirm"}
                  }

              },

              ClaimedUpdate_ContactedForwardTo4M:function(model,wizSpec){
                   return {name:"ClaimedUpdate_NextSteps4M",template:"WizardUpsertFormRefStatusConfirm"}
              }


        },
        
      
      },

      getUpdateContactedReferralWizard: function(){
          var updateReferralWizard = _.clone(rwApp.updateClaimedReferralWizard);
          updateReferralWizard.firstApplet={name:"ContactedUpdate_NewReferralStatus1A",template:"WizardUpsertFormRefStatus"};
          updateReferralWizard.nextAppletFunctions.ContactedUpdate_NewReferralStatus1A = updateReferralWizard.nextAppletFunctions.ClaimedUpdate_NewReferralStatus1A;

          return updateReferralWizard;
      },

      getUpdateUnreadReferralWizard: function(){
          var updateReferralWizard = _.clone(rwApp.updateClaimedReferralWizard);
          updateReferralWizard.firstApplet={name:"UnreadUpdate_NewReferralStatus1A",template:"WizardUpsertFormRefStatus"};
          updateReferralWizard.stations=["New Status","Confirm"],
          updateReferralWizard.nextAppletFunctions.UnreadUpdate_NewReferralStatus1A = function(model,wizSpec){
                
                var newStatus = model.get('protoStatus');
                if (newStatus == 'ACCEPTED'){
                  model.set({summaryText:"When you click 'Done'"});
                  return {name:"ClaimedUpdate_NextSteps4M",template:"WizardUpsertFormRefStatusConfirm"}
                }
                if (newStatus == 'ARCHIVED'){
                  model.set({summaryText:"The lead has been ignored..."});
                  return {name:"ClaimedUpdate_NextSteps4M",template:"WizardUpsertFormRefStatusConfirm"}
                }
                
              };

          return updateReferralWizard;
      },    
      
        AddGuestWizard : { //this isn't a route it's a declaration on the referral wizard structure that's referenced by several partner views 
          showConfirmOnSave:'AddGuestConfirmation',
          viewTemplate: 'WizardUpsertView',
          stations: ["Guest Type","Guest Name","Source","Confirmation"],
          firstApplet:{name:"AddGuestWizard_1GuestType"},
          
          nextAppletFunctions:{
          
            AddGuestWizard_1GuestType:function(model,wizSpec){
              
              var guestType = model.get('guestType');
              
                if (guestType == "FLOATER"){
                  return {name:"AddGuestWizard_2PickFloater"}
                }
                if (guestType == "NEW_MEMBER"){
                  return {name:"AddGuestWizard_2AddNewMember"}
                }
            },
            AddGuestWizard_2PickFloater:function(model,wizSpec){return {name:"AddGuestWizard_3FloaterSource"}},
            AddGuestWizard_3FloaterSource:function(model,wizSpec){
            
                var summaryVal = "We'll add [firstName] to the guest list!"; 
              summaryVal = $.substituteVals(summaryVal,model);
              model.set({nextSteps:summaryVal});
            
              var floaterSource = model.get('heardAboutFrom');
                if (floaterSource == "EXISTING_MEMBER"){
                  return {name:"AddGuestWizard_4FloaterPickRecommender"};
                }
                else {
                  return {name:"AddGuestWizard_4FloaterConfirmation"}
                }
            },
            AddGuestWizard_2AddNewMember:function(model,wizSpec){return {name:"AddGuestWizard_3NewMemberSource"}},
            
            AddGuestWizard_3NewMemberSource:function(model,wizSpec){
              var newMemberSource = model.get('heardAboutFrom');
              
                var summaryVal = "We'll send [newContactFirst] a registration email!"; 
                summaryVal = $.substituteVals(summaryVal,model);
                model.set({nextSteps:summaryVal});
                
                if (newMemberSource == "EXISTING_MEMBER"){
                  return {name:"AddGuestWizard_4NewMemberPickRecommender"};
                }
                else {
                  return {name:"AddGuestWizard_4NewMemberConfirmation"};
                }
              
            },
            

          
            
          }
          
     },
     
   getNewReferralModel:function(options){
   var toPartyId = options.toPartyId;
   var toFullName = options.toFullName;
   //var parentView = (!_.isUndefined(options.parentView) && !_.isNull(options.parentView))?options.parentView:null;
     var userdata = new rwcore.StandardModel({module:'UserMgr',id:toPartyId});
     userdata.fetch({
         error : rwcore.showError, 
         success : function (model, response, jqXHR) {
    
          
             var view = new ReferralWireView.FormView({applet: "CreateReferralForm", 
                 templateHTML : 'CreateReferralForm',
                 //parentView : parentView,
                 //showConfirmOnSave:ReferralWire.Templatecache.ReferralSentConfirmation
             });
             view.setDefaultModel();
             
             var refrldata = view.model;
              refrldata.set({ toId : toPartyId});
              refrldata.set({ to_fullName : toFullName});
              refrldata.set({question1: model.get("question1")});
              refrldata.set({question2: model.get("question2")});
              refrldata.set({question3: model.get("question3")});
              refrldata.set({question4: model.get("question4")});
              
              return refrldata;
         }
     })
   },

    addGuest:function(event){
      var refWizardSpec = event.refWizard;
      var guestModel = new rwcore.StandardModel({"module" : "AttendeeMgr"});
    var guestMetaApplet = new ReferralWireBase.AppletView({applet: refWizardSpec.firstApplet.name});
      //template: this.templateHTML,showViewBar:this.showViewBar,viewBarTemplate:this.viewBarTemplate
      ReferralWireBase.setDefaultValues(guestModel, guestMetaApplet, null);
    guestModel.set({
      OrgId:event.OrgId,
      eventId:event.eventId,
      newMemberSrc_partyId:event.newMemberSrc_partyId,
      isGuest:"true",
      status:'CHECKEDIN',
      guestType:event.guestType,
      newMemberSrc_fullName:event.newMemberSrc_fullName
    }); 
    
    
      
      var wizard = new ReferralWireView.WizardUpsertView ( { 
        firstApplet:refWizardSpec.firstApplet,
        nextAppletFunctions:refWizardSpec.nextAppletFunctions,
        appletTemplates:refWizardSpec.appletTemplates,
        viewTemplate: refWizardSpec.viewTemplate,
        upsertmodel: guestModel,
        stations:refWizardSpec.stations,
        saveFunction:refWizardSpec.saveFunction,
        parentView: event.parentView,
        showConfirmOnSave: refWizardSpec.showConfirmOnSave,
        wizardSpec:refWizardSpec
      });
      //var firstAppletView = wizard.getCurrentAppletView(wizard.firstApplet);//this will initialize the wizard model

    
    wizard.render();
   },
  /*
  validateCheckInNoGeo:function(options){ //this version of the function ignores latitude and longitude
      this.options = options;
      var that = this;
      var feetAway = 100; //this is rigged see ValidateCheckInOrg for the real validation
    var maxDistanceFeet = 400;
      var meetingTime = new Date(that.options.model.get('datetime').$date);
      //meetingTime = $.getLocalTimeFromGMT(meetingTime.getTime()).getTime();
      var minFromMeetingStart = Math.abs(new Date().getTime() - meetingTime)/60000;
      console.log("meetingTime " + meetingTime);
      console.log("now " + new Date().getTime());
      console.log("feet away " + feetAway);
      console.log("min from start " + minFromMeetingStart);
      var maxMinFromStart = 120;
      if (feetAway < maxDistanceFeet && minFromMeetingStart < maxMinFromStart){
        that.options.validateTimePlace = false;
        rwApp.eventCheckIn(that.options);           
      } else {
        var confirmTemplate = "CheckedInInvalid";
        var popUpContainer = $("#PopupContainer");
      popUpContainer.html(_.template(confirmTemplate)()); //
      popUpContainer.addClass("confirmation");
      $(".overlay-background").show();
      popUpContainer.show();
      popUpContainer.one("click", "[popEvent]", function() {
        popUpContainer.hide();
        $(".overlay-background").hide();
        popUpContainer.removeClass("confirmation");
        rwApp.preventNavigation = false; // this
        
        //if ($.hasVal(that.options.refresh)){rwApp.refreshTopView();}
      });
      }
  },
  */
  validateCheckIn:function(options){
    

      this.options = options;
      var chapterLatitude = options.model.get('org_latitude_work');
      var chapterLongitude = options.model.get('org_longitude_work');
      // console.log("chapterLat " + chapterLatitude);
      // console.log("chapterLng " + chapterLongitude);
      that = this;
      
      navigator.geolocation.getCurrentPosition(
            // success
            function(position) {
              // console.log("position latitude " + position.coords.latitude)
              // console.log("position long " + position.coords.longitude)
              
              var options = {
              firstPosition:{
                lat:chapterLatitude,
                lng:chapterLongitude 
              },
      
              secondPosition:{
                lat:position.coords.latitude,
                lng:position.coords.longitude
              }
            }
            var feetAway = $.calculateDistance(options) * 5280;
            var maxDistanceFeet = 400;
            var meetingTime = new Date(that.options.model.get('datetime').$date);
            //meetingTime = $.getLocalTimeFromGMT(meetingTime.getTime()).getTime();
            var minFromMeetingStart = Math.abs(new Date().getTime() - meetingTime)/60000;
             console.log("checkin chapterLongitude " + chapterLongitude);
             console.log("checkin chapterLatitude " + chapterLatitude);
             console.log("checkin position lat " + options.secondPosition.lat);
             console.log("checkin position lng " + options.secondPosition.lng);
             console.log("checkin meetingTime " + meetingTime);
             console.log("checkin now " + new Date().getTime());
             console.log("checkin feet away " + feetAway);
             console.log("checkin min from start " + minFromMeetingStart);
            var maxMinFromStart = 120;
            if (feetAway < maxDistanceFeet && minFromMeetingStart < maxMinFromStart){
              that.options.validateTimePlace = false;
              rwApp.eventSelfCheckIn(that.options);           
            } else {
              var confirmTemplate = "CheckedInInvalid";
              var popUpContainer = $("#PopupContainer");
              popUpContainer.html(_.template(confirmTemplate)()); //
              popUpContainer.addClass("confirmation");
              $(".overlay-background").show();
              popUpContainer.show();
              popUpContainer.one("click", "[popEvent]", function() {
                popUpContainer.hide();
                $(".overlay-background").hide();
                popUpContainer.removeClass("confirmation");
                rwApp.preventNavigation = false; // this
              
              //if ($.hasVal(that.options.refresh)){rwApp.refreshTopView();}
              });
            }
              
              
              
            },
            function(error) {
              //rwFB.onGeoError(error);
              // console.log("getPosition error");
              // console.log(error.message);
            var confirmTemplate = "CheckedInPositionError";
            var popUpContainer = $("#PopupContainer");
            popUpContainer.html(_.template(confirmTemplate)()); //
            popUpContainer.addClass("confirmation");
            $(".overlay-background").show();
            popUpContainer.show();
            popUpContainer.one("click", "[popEvent]", function() {
              popUpContainer.hide();
              $(".overlay-background").hide();
              popUpContainer.removeClass("confirmation");
              rwApp.preventNavigation = false; // this
              
              //if ($.hasVal(that.options.refresh)){rwApp.refreshTopView();}
            });
            },
            { maximumAge: 60000, timeout: 10000,enableHighAccuracy: true }
        )
  
    },

    getContactListTemplPhone:function(model){
    var retVal = "ContactListPrivatePhone";
    if ($.hasVal(model)){
      var type = model.get("type");
      var partytype = model.get("partytype_denorm");
      if (type == "REFERRAL_CONTACT" && (partytype == "PARTNER" || partytype == "PARTNER_DEMO")){retVal = "ContactListNoRelationPhone";}
      if (type == "REFERRAL_PARTNER"){retVal = "ContactListPhone";}
    }
   return retVal;
  },


  eventCheckIn : function (options){
      var requireValidation = ($.hasVal(options.validateTimePlace) && options.validateTimePlace)?true:false;
      
      
      if (!requireValidation){
   
        this.options = options;
        var model = options.model;
        var buttonId = options.checkInButtonId;
        var domReference = "[checkInButtonId='buttonId']";
          var changeToStatus = ($.hasVal(options.changeToStatus))?options.changeToStatus:"CHECKEDIN";
        
        domReference = domReference.replace("buttonId",buttonId);
        model.set({status:changeToStatus});
        var confirmTemplate = ($.hasVal(options.confirmTemplate))?options.confirmTemplate:"CheckedInConfirmation_Self";
        var that = this;
      
        model.save({},{
          
          success:function(model, textStatus, jqXHR){
            $(domReference).hide();
            var popUpContainer = $("#PopupContainer");
            popUpContainer.html(_.template(confirmTemplate)()); //
            popUpContainer.addClass("confirmation");
            $(".overlay-background").show();
            popUpContainer.show();
            popUpContainer.one("click", "[popEvent]", function() {
              popUpContainer.hide();
              $(".overlay-background").hide();
              popUpContainer.removeClass("confirmation");
              rwApp.preventNavigation = false; // this
              
              if ($.hasVal(that.options.refresh)){rwApp.refreshTopView();}
            });
            
        },
        
              
            error: rwcore.showError
        })
      } else {
        rwApp.validateCheckIn(options);
        
      }
   
   },

  eventSelfCheckIn : function (options){
      var requireValidation = ($.hasVal(options.validateTimePlace) && options.validateTimePlace)?true:false;
      
      
      if (!requireValidation){
   
        this.options = options;
        var model = options.model;
        //model.set({status:changeToStatus});
        model.set({selfcheckin:true});//server looks for this to call the checkin function

        var confirmTemplate = ($.hasVal(options.confirmTemplate))?options.confirmTemplate:"CheckedInConfirmation_Self";
        var that = this;
      
        model.save({},{
          
          success:function(model, textStatus, jqXHR){
            if ($.hasVal(that.options.refresh)){rwApp.refreshTopView();}
            
        },
        
              
            error: rwcore.showError
        })
      } else {
        rwApp.validateCheckIn(options);
        
      }
   
   },

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

   fetchMultipleLists:function(options){//fetches multiple lists and merges them into a single collection
      var promise =  (!_.isUndefined(options.promise))?options.promise:$.Deferred();
      var fetchParams = options.dataOptions[0];
      
      var p = rwApp.fetchList(fetchParams)
          p.done(function(model){
              if (!_.isUndefined(options.dataSoFar)){
                 
                  options.dataSoFar.add(model.models, {merge:true,silent : true});
                 //options.dataSoFar.add(model.toJSON(), {silent : true});
              } else {
                options.dataSoFar = model;
              }
              if (options.dataOptions.length > 1){
                var dataOptions = _.rest(options.dataOptions);
                rwApp.fetchMultipleLists({dataOptions:dataOptions,dataSoFar:options.dataSoFar,promise:promise});
              } else {
                promise.resolve(options.dataSoFar);
              }
          });
      return promise;
      /*
        var ssM = undefined;
        if (!_.isUndefined(options.savedSearch) && !_.isUndefined(options.savedSearch.dssModel)){
            ssM = rwApp.xformSS(options.savedSearch.dssModel)
            dDataOptions.searchRequest = rwApp.parseSavedSearch(ssM,options.savedSearch.searchAppletName);
        }
        dDataOptions.calculatedFields = options.calculatedFields; // should be able to support just by including in data options
      */
   },

   fetchList:function(options){//wraps server call in a promise

          var promise =  $.Deferred();
          var that = this;
          
          var data = new rwcore.StandardCollection(options);

          data.fetch( { 
            add : true,
            error : rwcore.showError, 
            success : function (model, response, jqXHR) {

                promise.resolve(model);
            }
          });

          return promise;                             
   },

    saveModel:function(model){//wraps re-usable server call in a promise

      var promise =  $.Deferred();
      var that = this;

      model.save({},{
        //error : rwcore.showError, 
        success : function (model, response, jqXHR) {

            promise.resolve(model);
        }
      });

      return promise;                             
   },
   deleteModel:function(model){//wraps re-usable server call in a promise

      var promise =  $.Deferred();
      var that = this;
      model.destroy( { 
        add : true,
        //error : rwcore.showError, 
        success : function () {
            promise.resolve();
        }
      });
      return promise;      
   },


   fetchSavedSearch:function(options){
        var searchGroup = options.searchGroup;
        var ss = {filter:[{
                            ftype:"expr", 
                            expression:{searchGroup:searchGroup}
                           },
                           {ftype:"expr", 
                            expression:{accessLevel:"public"}
                           },
                           {ftype:"expr", 
                            expression:{searchName:options.searchName}
                           }]
                    };
            return rwApp.fetchList({
              module : "SavedSearchMgr",
              bc:"SavedSearch",
              bo:"SavedSearch",
              sortby:"name",
              searchSpec: ss,
              //id : options.id,
            })

   },

   getSearchDefinition: function(model,searchAppletName,prettyPrint) {//

         // var searchFields = this.searchFormView.metaApplet.model.attributes.field;
          var searchFormView = new ReferralWireView.FormView({applet:searchAppletName});  //replacehardcode
          var searchFields = searchFormView.metaApplet.model.attributes.field;

            var searchDefinition = new Array()

            for (var i = 0; i < searchFields.length; i++){
              var thisField = searchFields[i];
              var thisFieldName = thisField.fldname;
              var dataType = thisField.dataType;
              var thisFieldLabel = thisField.label;
              var thisVal = model.get(thisFieldName);
              var searchOperator = thisField.searchOperator;
              if (($.hasVal(thisVal) || searchOperator == "DISTANCE_FROM") && thisFieldName != "searchName" && thisFieldName != "isDefaultSearch" ){           
                if (searchOperator == "DISTANCE_FROM"){
                  var parts =  $.toArray(thisField.part);
                    var that = this;
                        _.each(parts,function(part){
                          thisFieldName = part.fldname;
                          thisVal = model.get(thisFieldName);
                          if ($.hasVal(thisVal)){
                            thisElement = part.element;
                            var term = {fldname:thisElement,value:thisVal};
                            searchDefinition[searchDefinition.length]= term;
                          }
                      });
                } else {
                  var fName = (prettyPrint)?thisFieldLabel:thisFieldName;
                  if (searchOperator == "EQUALS_ID") {
                      var idName = thisField.equalsIdField;
                      var idVal = model.get(idName);
                      
                      var term = {fldname:idName,value:idVal,displayName:fName,displayVal:thisVal};
                      searchDefinition[searchDefinition.length]= term;
                  } else{
                      if (searchOperator == "IN" || searchOperator == "NOT_IN") {
                        
                        var term = {fldname:fName,value:thisVal};
                        searchDefinition[searchDefinition.length]= term;
                      } else {  
                        if (dataType == "date" || dataType == "datetime" || dataType == "time"){
                          var term = {fldname:fName,value:thisVal,isDate:true};
                          searchDefinition[searchDefinition.length]= term;
                        } else {
                          var term = {fldname:fName,value:thisVal};
                          searchDefinition[searchDefinition.length]= term;
                        }
                      }
                  }
                }
                //searchDefinition.add({fldname:thisFieldName,value:thisVal});
              }
            }
            
            return JSON.stringify(searchDefinition);
            

    },

   getReportModel:function(options){
      
      var baseModel = _.clone(options.baseModel);
      baseModel.set({sActor:options.sActor,sBC:options.sBC,sBO:options.sBO,isGenericFilter:'true'});
      var filterModel = rwApp.xformSS(baseModel);
      baseModel = undefined;
      var items = {};
      for(attr in filterModel.attributes){
          if (!_.contains(['module'], attr)) {
            var val = filterModel.get(attr);
            items[attr] = val;
          }
          
      }
      options.baseModel.set(items);
      return options.baseModel;

   },
   rWizSetModel:function(model,sApplet){
      var sApplet = model.get("searchapplet");
      var fsd = rwApp.getSearchDefinition(model,sApplet,false);
      var fDesc = rwApp.getSearchDefinition(model,sApplet,true);
      model.set({
        definition:fsd,
        fDesc:fDesc
      });
      return model;
   },
   

   xformSS:function(selectedModel){ //this function takes a saved search stored in the db and transforms it into a format that can be 
    //shown in FormView and subsequently converted into search spec by parseSavedSearch
            
            var module = selectedModel.get('sActor');
            var bo = selectedModel.get('sBC');
            var bc = selectedModel.get('sBO');
            var setSavedSearchFields = ($.hasVal(selectedModel.get('isGenericFilter')))?false:true;
            
            var searchDefModel = new rwcore.StandardModel({module: module,bo:bo,bc:bc});
            if (setSavedSearchFields){
              searchDefModel.set({
                searchName:selectedModel.get('searchName'),
                isDefaultSearch:selectedModel.get('isDefaultSearch'),
                accessLevel:selectedModel.get('accessLevel'),
                savedSearchId:selectedModel.get("id")
              });
            }
            var definition = selectedModel.get("definition");
            if (!_.isUndefined(definition)){
              var searchTerms = $.toArray(definition);
            var items = {};
            
          _.each(searchTerms, function(term) {        
            var val = term["value"];

            if ($.hasVal(val) && val.hasOwnProperty("$date")){
                val = val.$date;
            } 

            var valStr = new String(val);
            if (valStr.indexOf("[") > -1){
                    val = val.replace("[","");
                    val = val.replace("]","");
                    val = rwFB[val];
            }
            items[term["fldname"]] = val;
            if (!_.isUndefined(term.displayName)){
                items[term["displayName"]] = term["displayVal"];
            }
          });

          searchDefModel.set(items);
        }
        return searchDefModel;
   },

   parseSavedSearch:function(searchModel,searchAppletName){
        /*
        searchGroup:"members",
        actor:"PartyMgr",
        bo:"Party",
        bc:"Party"
        searchAppletName:"MemberSearchForm", //replacehardcode
        searchAppletTemplate:"SearchForm",
        title:"Member Search"
        */
      
      var searchFormView = new ReferralWireView.FormView({applet:searchAppletName});  //replacehardcode
      var searchFields = searchFormView.metaApplet.model.attributes.field;
      var searchRequest = new Object();

      for (var i = 0; i < searchFields.length; i++){
        var thisField = searchFields[i];
        var thisFieldName = thisField.fldname;
        var thisFieldLabel = thisField.label;
        var thisVal = searchModel.get(thisFieldName);
        var thisOperator =  thisField.searchOperator;
        if (($.hasVal(thisVal) && !_.isUndefined(thisOperator)) || thisOperator == "DISTANCE_FROM") {
          
          var searchRequestTerm = new Object();
          searchRequestTerm.dataType = thisField.dataType;
          if (thisOperator == "DISTANCE_FROM" || thisOperator == "DISTANCE_LENGTH") {
            thisFieldName = thisField.distanceGroup;
            if (searchRequest.hasOwnProperty(thisFieldName)){
              searchRequestTerm = searchRequest[thisField.distanceGroup];
            } 
            searchRequestTerm.searchOperator = "DISTANCE";

            if (thisOperator == "DISTANCE_FROM"){ //presumes "DISTANCE_FROM" is on a field with data type "address"
              var distanceLength = searchModel.get(thisField.distanceLengthField);
              if (distanceLength != "ANY"){
                searchRequestTerm.distanceCompareTo = thisField.distanceCompareTo;
                var parts =  $.toArray(thisField.part);
                var that = this;
                    _.each(parts,function(part){
                      thisFieldName = part.fldname;
                      thisVal = searchModel.get(thisFieldName);
                      thisElement = part.element;
                      if ($.hasVal(thisVal)){searchRequestTerm[thisElement] = thisVal;}
                  });
                if (!($.hasVal(searchRequestTerm.postalCode) || ($.hasVal(searchRequestTerm.city) && $.hasVal(searchRequestTerm.state) && $.hasVal(searchRequestTerm.street)))){
                  var distanceLength = searchModel.get(thisField.distanceLengthField);
                  if (distanceLength != "ANY"){
                    rwcore.FYI("You must provide either a zipcode or a street, city and state in order to search by distance.");
                    return;
                  }
                }
              } else {
                searchRequestTerm = undefined;
              } 
            }
            if (thisOperator == "DISTANCE_LENGTH"){
              if (thisVal == "ANY"){
                searchRequestTerm = undefined;
              } else {
                searchRequestTerm.distanceUnit = thisField.distanceUnit;
                if (!_.isUndefined(thisField.distanceLengthField)){
                    searchRequestTerm.distanceLengthField = thisField.distanceLengthField;
                } else{searchRequestTerm.distanceLength = thisVal;}
                
              }
            }

          } else {

            if (thisOperator == "EQUALS_ID"){
              searchRequestTerm.searchOperator = thisOperator;
              searchRequestTerm.equalsIdField = thisField.equalsIdField;
              searchRequestTerm.value = searchModel.get(searchRequestTerm.equalsIdField);
            } else {

              //if (thisOperator == "LESS_THAN" || thisOperator == "GREATER_THAN") {
                  //compareField is needed in cases where the same field is used for both a greater than and a less than comparison
                  //in these cases two terms are created -- each with a pseudo field name (fldname="fakefieldname") that uniquely identifies the term to the 
                  //server.  The comparefield name is the one that's actually in the search
              //    searchRequestTerm.compareField = (_.isUndefined(thisField.compareField))?thisFieldName:thisField.compareField;
              //}
              if (thisOperator == "LESS_THAN" || thisOperator == "GREATER_THAN") {
                  //compareField is needed in cases where the same field is used for both a greater than and a less than comparison
                  thisFieldName = thisField.compareField;
                  searchRequestTerm.searchOperator = "LT_GT";
                  if (searchRequest.hasOwnProperty(thisFieldName)){
                    searchRequestTerm = searchRequest[thisFieldName];
                  } 
                  searchRequestTerm[thisOperator] = thisVal;

              } else {

                  if (thisOperator == "EQUALS" && thisVal == "ANY") {
                      searchRequestTerm = undefined;
                      //if the term  EQUALS ANY we're allowing the user to remove a particular term
                  } else {

                    searchRequestTerm.searchOperator = thisOperator;  
                    searchRequestTerm.value = thisVal;
                  }
              }
            }

          }
          if (!_.isUndefined(searchRequestTerm)){
            searchRequestTerm.fieldName = thisFieldName;

            searchRequest[thisFieldName] = searchRequestTerm;

          }
        }
      }
      return searchRequest;
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
   execPickMap:function(options){
        
        var selectedModel = options.fromModel;
        var pickMap = options.pickMap;
        
        for ( var i = 0; i < pickMap.length; i++) {
          var pickItem = pickMap[i];
          if (pickItem["type"] == "pick"){
            var fromValue = selectedModel.get(pickItem["fromField"]);
            fromValue = (selectedModel.get('id') == "novalue")?"":fromValue;
            var item = {};
                item[pickItem["toField"]] = fromValue;
            options.toModel.set(item);
            var toFieldName= pickItem["toField"];
            
            if (toFieldName.indexOf("[") > -1){
              toFieldName = toFieldName.replace("[","");
              toFieldName = toFieldName.replace("]","");
              rwFB[toFieldName] = fromValue;
            } else {
              var selector = ".upsertContainer span#"+toFieldName;
              $(selector).html(fromValue);
              var selector = ".upsertContainer input#"+toFieldName;
              $(selector).html(fromValue);
              $(selector).attr("value",fromValue);
            }
          }
        }
        
        $("#pickBackground").hide(50);
        $('#picklistContainer').hide(350);
   
   },

   /*
if (defaultVal.indexOf("[") > -1){
                
                defaultVal = defaultVal.replace("[","");
                defaultVal = defaultVal.replace("]","");
                defaultVal = rwFB[defaultVal];
              }
   */

      closeStandardDialog : function(options){
   
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
          rwApp.preventNavigation = false;
        }
      )
   
   },
   
   openStandardDialog : function(options) {
     var el = '#upsertRecord'
     var view = options.view;
     
     if ($.hasVal(view))
       $(el).html(view.render(view.model).el).trigger('create');
       $("[altTimeVal]").attr("value",$("[altTimeVal]").attr("altTimeVal")); 
       $("[altDateVal]").attr("value",$("[altDateVal]").attr("altDateVal")); 
       $(".datepicker" ).datepicker({dateFormat: "mm/dd/yy"});
       $(".datetimepicker" ).datetimepicker({dateFormat: "mm/dd/yy", timeFormat: "hh:mm tt"});
       $(".timepicker").timepicker({timeFormat: "hh:mm tt"});
       view.renderAllMultiCheckSearchControls();
       //this is an odd work around for a bug that's keeping time and date fields from rendering their value attribute normally  
   
      
      $(el).show(50);
      $(".overlay-background").toggle(00);
      
        $(el).animate({
            top:0
          }, 500, function() {
            $(el).css('bottom','5px');
            $(el).css('height','auto');
                
          });
        rwApp.preventNavigation = true; // this is checked by code on rw.jsp that fires on the window.changehash event.  It's here so users don't accidentally navigate away while editting.
       
   },
   

   
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

   joinChapter:function (options) {
        var mview = new ReferralWireView.FormView (
          { 
              applet: "PartyUpsertForm", 
              templateHTML : "StdFormNarrow",
              showViewBar:false,
            });
                // get data of the master
          var m_data = new rwcore.StandardModel({
            module : mview.actor, 
          });
          

          m_data.fetch({ 
            add : true,
            error : rwcore.showError, 
            success : function (model, response, jqXHR) {
                mview.model = model;
                var event = new Object();
                
                event.dView = mview;
          /*
          var route = "'"+options.refreshRoute+"'";
          var r = "rwApp.navigate(route,{trigger: true,replace: true});";
          r = r.replace("route",route);
            event.refreshFunction = r;
            */
            event.refreshFunction = "rwApp.refreshTopView()";
            
            event.confirmTemplate = "ConfirmJoinChapter";
            event.setFields = "OrgId,isAmbassador,joinChapter";
            event.setVals = options.OrgId + ",false,true";
            event.actionRecordId = event.dView.model.get("id");
            //event.refreshlist;
            rwApp.updateKeyField(event);
                    
            }
          });
    
    },

    toggleMeetingAttendence:function(options){
       options.handleRefresh = true;
       rwcore.showWaitDialog(options.htmlTemplate, options, function(target){

          var options = target.data;
          var am = new rwcore.StandardModel({module:"AttendeeMgr"});
          
          if (options.operation == "remove"){
              am.set({id:options.attendeeId})
              var deletePromise = rwApp.deleteModel(am);
              deletePromise.done(function(){
                options.refreshFunction(options.eventId);

              });
          } else {
              var guestType = (options.OrgId == rwFB.OrgId)?"MEMBER":"FLOATER";
              am.set({
                eventId:options.eventId,
                partyId:rwFB.uId,
                guestType:guestType,
                OrgId:options.OrgId,
                status:"INVITED",
              })
              var savePromise = rwApp.saveModel(am);
              savePromise.done(function(model){
                model.set({id:model.get("eventId"),orgPhotoUrl:model.get('Org_photoUrl')});
                //options.parentView.refreshInPlace(model);
                options.refreshFunction(model,options.parentView);
              });
          }

       })

    },
   
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
          pEvent.setFieldAry = setFieldAry;
          pEvent.setValAry = setValAry;

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
          
                  for (i=0;i<pEvent.setFieldAry.length;i++){
                    thatModel.set(pEvent.setFieldAry[i],pEvent.setValAry[i]);
                    if (pEvent.setFieldAry[i] == "OrgId"){rwFB.OrgId = pEvent.setValAry[i]};
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
                    event.refreshFunction();
                  }
              });
            //window.rwApp.refresh();
              return false;
            }
            
            if (action == 'importPhoneContacts'){
              //popUpContainer.html(_.template('ImportProgress')());
              $(".ui-loader").find("H1").html("loading...");
              $.mobile.loading('show');
              rwApp.getPhoneContacts({
                success: function(data){
                    var cm = new rwcore.StandardModel({module:"ContactsMgr", contacts : JSON.stringify(data)});
                    cm.call('phoneCards', cm, {async : true, 
                        success : function(model, response, jqXHR) {
                          var counter = response.counter; 
                          $.mobile.loading('hide');
                          
                          var timer ;

                          var closer = function() {
                            popUpContainer.hide();                  
                            $(".overlay-background").hide();
                            Backbone.history.fragment = null;
                            eval(event.refreshFunction);
                            // clearInterval(timer);
                          };
                          

                          /*
                          timer =  setInterval( function() {
                            var count = rwcore.Peek(counter);
                            if ( count == null)
                              closer();                            
                            else {
                              $(".ui-loader").find("H1").html("Imported :" + count);
                            }                               
                          }, 6000);
                          */

                          // cancel handler ?? 
                          // Why aren't we using rwcore.showWaitDialog ??

                          closer();

                        }
                      });

                    /*
                  ReferralWireBase.ExportContactsToServer(data)
                    .done( function (response) { 
                      $.mobile.loading('hide');
                      alert(response.Imported + " records imported in " + response.time + " milli secords"); 
                      popUpContainer.hide();                  
                      $(".overlay-background").hide();
                      Backbone.history.fragment = null;
                      eval(event.refreshFunction);
                    });
                    */
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
   
   lookupPartnerProfile_P2P : function(partyId, partyType){
       var data = new rwcore.StandardModel({ 
                module : "PartnerMgr", 
                partnerId : partyId});
            
         data.fetch({      
              add : true,
              error : function(){rwApp.MemberSocial(partyId)},
              success : function (model, response, jqXHR) {
                partnerId = model.get('id');
                rwApp.PartnerSocial(partnerId);  
                
              }
         });
      },
      
      lookupPartnerProfile : function(partyId) {
       
        var data = new rwcore.StandardModel({ 
              module : "PartnerMgr", 
              partnerId : partyId});
          
        data.fetch(
                   {      
                        add : true,
                        error : rwcore.showError, 
                        success : function (model, response, jqXHR) {
                          
                          partnerId = model.get('id');
                          rwApp.PartnerSocial(partnerId);
                          
                          
                        }
                   });
        
      },
      
      lookupContactProfile : function(partyId) {
       
        var data = new rwcore.StandardModel({ 
              module : "PartnerMgr", 
              partnerId : partyId});
          
        data.fetch(
                   {      
                        add : true,
                        error : rwcore.showError, 
                        success : function (model, response, jqXHR) {
                          
                          partnerId = model.get('id');
                          rwApp.PartnerListDetail(partnerId);
                          
                          
                        }
                   });
        
      },
      
      
      lookupPartnersPhone : function (partyId){
          //rwApp.phoneMemberQualifications(partyId)
          
          
        var data = new rwcore.StandardModel({ 
              module : "PartnerMgr", 
              partnerId : partyId});
          
        data.fetch(
                   {      
                        add : true,
                      error : function(){rwApp.phoneMemberQualifications(partyId)},
                        success : function (model, response, jqXHR) {
                            
                          //rwApp.partnerCacheSingle = model;
                          partnerId = model.get('id');
                          rwApp.phoneQualifications(partnerId);
                        }
                   });
        
      },
      
      
      lookupContactPhone : function(partyId) {
       
        var data = new rwcore.StandardModel({ 
              module : "PartnerMgr", 
              partnerId : partyId});
        data.fetch(
             {      
                  add : true,
                  error : rwcore.showError, 
                  success : function (model, response, jqXHR) {           
                    partnerId = model.get('id');
                    rwApp.ContactProfile(partnerId);
                  }
             });
      },
      
      lookupPartnerPhone_P2P : function(partyId, partyType){
          
          rwApp.phoneMemberQualifications(partyId)
       
       var data = new rwcore.StandardModel({ 
                module : "PartnerMgr", 
                partnerId : partyId});
              
         data.fetch({      
              add : true,
              error : function(){rwApp.phoneMemberQualifications(partyId)},
              success : function (model, response, jqXHR) {
                partnerId = model.get('id');
                rwApp.phoneQualifications(partnerId);  
                
              }
         });
         
      },

       newInvitation:function(options){
    
    var toPartyId = options.toPartyId;
  var toFullName = options.toFullName;
  var toFirstName = options.toFirstName;
  var toPartyType = options.toPartyType;
  var toEmail = options.toEmail;
  var summaryTextContact = "An invitation will be sent to ZFirstName email address with your message."
  var summaryTextMember = "ZFirstName will receive an invitation to join your network."
  
  
  var inValidEmail = ($.hasVal(toEmail) && toEmail.indexOf("@") > -1)?false:true;
  if (inValidEmail && toPartyType == "CONTACT"){
    var errStatus = {status:0,statusText:"The invitee must have a valid email address"}
    rwcore.showError(null,errStatus,null);
    return;
  }
  
  
  if (toPartyType == 'PARTNER'){
    var summary = summaryTextMember.replace("ZFirstName",toFirstName);
  }
  else {
    var possessiveFirst = $.addPossessiveSuffix(toFirstName);
    var summary = summaryTextContact.replace("ZFirstName",possessiveFirst);
  }
  
  
  var userdata = new rwcore.StandardModel({module:'UserMgr'});
  userdata.fetch({
         error : rwcore.showError, 
         success : function (model, response, jqXHR) {
         
      var fromId = model.get('id');
      var defaultComments = $.getInvitationText(model,toFirstName,toPartyType) //options should include toFirstName, fromFullName, fromBusiness, fromTitle    
          
             var view = new ReferralWireView.FormView({applet: "Invitation", 
                 templateHTML : 'UpsertFormNarrow',
                 //parentView : options.parentView,
                 //showConfirmOnSave:ReferralWire.Templatecache.ReferralSentConfirmation
             });
             view.setDefaultModel();
             
             var refrldata = view.model;
              refrldata.set({
                toId : toPartyId,
                to_fullName : toFullName,
                to_firstName : toFirstName,
                comments:defaultComments,
                summaryText:summary,
                referralType:'PART_INVITE',
                fromId:fromId
              });
              
        
            var showConfirmOnSave = 'InvitationSentConfirmation';
            rwApp.upsertRecord({
              el:'#upsertRecord',
              appletName:"Invitation",
              upsertTemplate:'UpsertFormNarrow',
              upsertModel:refrldata,
              parentView:null,
              showConfirmOnSave:showConfirmOnSave,
              success:null
            });
              
              //view.model = refrldata;
              
              
         }
     })


   },
  
    
  });

  return ReferralWireRouterBase;

  })(Backbone, _, $, ReferralWirePattern || window.jQuery || window.Zepto || window.ender);
  
  return Backbone.ReferralWireRouterBase; 

}));