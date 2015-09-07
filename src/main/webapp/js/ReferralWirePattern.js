(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
    var ReferralWireView = require('ReferralWireView');
 
    module.exports = factory(jquery, underscore, backbone, ReferralWireView);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone', 'ReferralWireView'], factory);

  } 
}(this, function ($, _, Backbone, ReferralWireView) {

  Backbone.ReferralWirePattern = ReferralWirePattern = (function(Backbone, _, $, ReferralWireView){
  var ReferralWirePattern = {} ; 
  
  ReferralWirePattern.GenericSummaryDetailPattern = function (options) {

    
        var that = this;  
      
        // get meta data for rendering
        var sview = new ReferralWireView.FormView ({ 
          applet: options.summaryapplet, 
          clickRoute:options.clickRoute,
          templateHTML: _.isUndefined(options.summaryTemplate) ? 'StdForm' : options.summaryTemplate,
          showViewBar:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?options.profileNavigation:false,
          viewBarTemplate:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation) && options.profileNavigation)?options.summaryTemplate:'ActionBarTemplate'
        });
  
      
        
        var data = new rwcore.StandardModel({ 
          module : ($.hasVal(options.actor))?options.actor:sview.actor, 
          calculatedFields: options.calculatedFields,
          id: options.selectedId });

        var parentModel;
        
        data.fetch(
             {      
                  add : false,
                  error : rwcore.showError, 
                  success : function (model, response, jqXHR) {
                    

                      sview.model = model;
                      parentModel = model;
                      
                      var dAppletMenuName = "CUDMenu";//this default applet menu supports Create, Update & Delete. It's defined in party.xml
                      if (!_.isUndefined(options.appletMenu) && !_.isNull(options.appletMenu)){
                        dAppletMenuName = options.appletMenu; 
                      }
                      var dAppletMenuTemplate = 'AppletMenuTemplate';
                      if (!_.isUndefined(options.appletMenuTemplate) && !_.isNull(options.appletMenuTemplate)){
                        dAppletMenuTemplate = options.appletMenuTemplate; 
                      }
                      
                      model.clickRoute = options.clickRoute;
                      var dAppletMenu = new ReferralWireView.FormView({
                       applet:dAppletMenuName,
                       templateHTML : 'StdForm', //This is ignored at the time of rendering
                       showViewBar:true, 
                       viewBarTemplate:dAppletMenuTemplate,
                       model: model
                      });
                      
                    
                      var dview = new ReferralWireView.PhotoGallery({
                        model: model, 
                        applet: options.detailapplet, 
                        templateHTML : ($.hasVal(options.detailTemplate))?options.detailTemplate:'StdForm',
                        showViewBar:false}); 
                      
                      var upsertApplet = ($.hasVal(options.upsertApplet))?options.upsertApplet:options.detailapplet;

                      var dViewBar = new ReferralWireView.FormView({ applet: options.viewBarApplet, 
                          templateHTML : 'StdForm', 
                          clickRoute:options.clickRoute,
                          showViewBar:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?false:true, 
                          viewBarTemplate:(!$.hasVal(options.viewBarTemplate))?'ActionBarTemplate':options.viewBarTemplate
                          });
                      
                      dViewBar.model = dview.model;          
                      
                      var viewTitle = options.viewTitle;

                      

                      
                      var dynamicTitles = new Array();
                      if (!_.isUndefined(options.dynamicTitles) && !_.isNull(options.dynamicTitles)){
                       var m = sview.model;
                       for (i=0;i< options.dynamicTitles.length;i++){
                         thisTitle = options.dynamicTitles[i];
                           var dTitle = thisTitle.template;
                           var fields = thisTitle.fields;
                           for (j=0;j< fields.length;j++){
                             thisField = fields[j];
                             for (f in thisField){
                               var thisVal = m.get(f);
                               if (!_.isUndefined(thisVal) && !_.isNull(thisVal)){
                                  dTitle = dTitle.replace(thisField[f],thisVal);
                               }
                             }
                           }
                           
                         dynamicTitles[i] = dTitle;
                         //takes list of substitution templates for view title, etc., replaces them with data values from master applet & put them into 
                         // a new array that will be passed to the parent view
                       }
                        
                      
                      }
                      
                      
                      
                      
                      //var ldPageTemplate = _.isUndefined(options.pageTemplate) ? ReferralWireView.Templatecache.StdSummaryDetailView : options.pageTemplate,
                      
                      var ldview = new ReferralWireView.ListDetailView ( { 
                        listview : sview, 
                        detailview: dview, 
                          templateHTML: !_.isUndefined(options.viewTemplate)?options.viewTemplate:'StdSummaryDetailView',
                          route: options.clickRoute,
                        appletMenu:dAppletMenu,
                        appletMenuRight:options.appletMenuRight,
                        upsertApplet:upsertApplet,
                        secondTierNav:options.secondTierNav,
                        viewTitle:viewTitle,
                        appletMenuRight:options.appletMenuRight,
                        dynamicTitles:dynamicTitles,
                        tooltipSource:options.tooltipSource,
                        refWizard:options.refWizard,
                        upsertWizard:options.upsertWizard,
                        inlineMap:options.inlineMap,
                          viewBar:dViewBar});
                      

                    if ($.hasVal(options.viewEL)){
                         ldview.printContainer = options.viewEL; //setting this varible will cause the html output to go to a popup window
                         var rHtml = ldview.render().el;
                      } else{
                        var rHtml = ldview.render().el;
                        $(rwApp.params.modules[1]).html(rHtml).trigger('create');
                      }
                      
                                            
                      if (!_.isUndefined(options.showLinkedInProfile) && options.showLinkedInProfile){ 
                        var first = sview.model.get('contact_firstName');
                        var last = sview.model.get('contact_lastName');
                        var zip = sview.model.get('contact_postalCodeAddress');
                        var conLNId = sview.model.get('contactLNId');
                        var defaultzip = ($.hasVal(rwApp.zip))?rwApp.zip:null;
 
                        var LIoptions = {
                         firstName:(!_.isUndefined(first) && !_.isNull(first) && first != "")?first:null,
                         lastName:(!_.isUndefined(last) && !_.isNull(last) && last !="")?last:null,
                         zipCode:(!_.isUndefined(zip) && !_.isNull(zip) && zip != "")?zip:defaultzip,
                         contactLNId:conLNId,
                         dview:sview
                        }
                      
                        rwApp.showLinkedInList(LIoptions);
                        
                      }
                      
                      if ($.hasVal(options.inlineMap)){
                                  ldview.renderInLineMap();
                      }

                      if (!_.isUndefined(options.done)){ 
                          
                        options.done(ldview);
                      }


                }   
             });
        

        return parentModel;
     };
     
     
  ReferralWirePattern.GenericListDetailPattern = function (options) {
      
        var that = this;  
        
        // get meta data for rendering
        var lview = new ReferralWireView.ListView ({ 
          applet: options.listapplet, 
          listItemClass: options.listItemClass,
          usePaging:options.usePaging,
          clientSideSortAttr : options.clientSideSortAttr,
          clientSideSortDirection: options.clientSideSortDirection,
          listMap:options.listMap,
          filter:options.setFilter,
          calculatedFields:options.calculatedFields,
          template: _.isUndefined(options.listTemplate) ? 'StdList' : options.listTemplate});
        
        var dDataOptions = {
        module : ($.hasVal(options.actor))?options.actor:lview.actor,
        now:new Date().getTime(),
        act:options.act,
        bo:lview.bo,
        bc:lview.bc,
        searchText:options.searchText,
        searchSpec: ($.hasVal(options.searchSpec))?options.searchSpec:lview.searchSpec, 
        sortby : options.sortby,
            cacheOptimize : options.cacheOptimize,
        sortOrder : _.isUndefined(options.sortOrder) ? "ASC" : options.sortOrder,
            limit: _.isUndefined(options.usePaging) ? undefined : rwcore.pagingSize,
	       shape: (!_.isUndefined(options.shape))?options.shape:'Skinny'
         // excludeId : options.selectedId
        };
      
        if (!_.isUndefined(options.detailSearchSpec)) {
            var keys = Object.keys(options.detailSearchSpec);
            for ( var i = 0; i < keys.length; i++) {
              dDataOptions[keys[i]] = options.detailSearchSpec[keys[i]];
            }
        }
        
        var ssM = undefined;
        if (!_.isUndefined(options.savedSearch) && !_.isUndefined(options.savedSearch.dssModel)){
            ssM = rwApp.xformSS(options.savedSearch.dssModel)
            dDataOptions.searchRequest = rwApp.parseSavedSearch(ssM,options.savedSearch.searchAppletName);
        }
        dDataOptions.calculatedFields = options.calculatedFields;
        var data = new rwcore.StandardCollection(dDataOptions);
        data.fetch(
        {      
              add : true,
              error : rwcore.showError, 
              success : function (model, response, jqXHR) {
                lview.setModel(model);
                var selModel = lview.model.models[0];
                if (!_.isUndefined(options.selectedId) && !_.isNull(options.selectedId)){
                  var lViewModel = lview.model.get(options.selectedId);

                  if ( _.isUndefined(lViewModel) || _.isNull(lViewModel)) {
                      var missingRow = new rwcore.StandardModel( { module : dDataOptions.module, shape: dDataOptions.shape, id: options.selectedId } );
                      missingRow.fetch( {
                            async : false,
                            error : rwcore.showError, 
                            success : function (model, response, jqXHR) {
                                lview.model.add(model);
                                selModel = lview.model.get(options.selectedId);
                                
                            }
                      }); 
                  } else {
                    selModel = lViewModel;
                  }
                }
                ReferralWirePattern.finishGenericListDetailPattern(options,selModel,lview);
            }  
        });
     };

     ReferralWirePattern.finishGenericListDetailPattern = function(options,selModel,lview){
          var ssM = undefined;
          if (!_.isUndefined(options.savedSearch) && !_.isUndefined(options.savedSearch.dssModel)){
            ssM = rwApp.xformSS(options.savedSearch.dssModel)
          }

          var dview = new ReferralWireView.FormView({
            model: selModel, 
            applet: options.formapplet, 
            templateHTML : _.isUndefined(options.formTemplate) ? 'StdForm' : options.formTemplate,
            showViewBar:false});
          
          var dview2 = null;
          var dview3 = null;
          var dview4 = null;
          
          ;
          if ($.hasVal(options.formapplet2)){
                  dview2 = new ReferralWireView.FormView({
                  model: selModel, 
                  applet: options.formapplet2, 
                  templateHTML : _.isUndefined(options.formTemplate2) ? 'BasicForm' : options.formTemplate,
                  showViewBar:false});
          }
          
          if ($.hasVal(options.formapplet3)){
              dview3 = new ReferralWireView.FormView({
              model: selModel, 
              applet: options.formapplet3, 
              templateHTML : _.isUndefined(options.formTemplate3) ? 'BasicForm' : options.formTemplate,
              showViewBar:false});
          }
          
          if ($.hasVal(options.formapplet4)){
              dview4 = new ReferralWireView.FormView({
              model: selModel, 
              applet: options.formapplet4, 
              templateHTML : _.isUndefined(options.formTemplate4) ? 'BasicForm' : options.formTemplate,
              showViewBar:false});
          }

          
          
          var upsertApplet = ($.hasVal(options.upsertApplet))?options.upsertApplet:options.formapplet;
                                
          
          var dAppletMenuName = "CUDMenu";//this default applet menu supports Create, Update & Delete. It's defined in party.xml
          if (!_.isUndefined(options.appletMenu) && !_.isNull(options.appletMenu)){
            dAppletMenuName = options.appletMenu; 
          }
          var dAppletMenuTemplate = 'AppletMenuTemplate';
          if (!_.isUndefined(options.appletMenuTemplate) && !_.isNull(options.appletMenuTemplate)){
            dAppletMenuTemplate = options.appletMenuTemplate; 
          }
          
          if ($.hasVal(dview.model)){
              dview.model.clickRoute = options.clickRoute;
          }

          var dAppletMenu = new ReferralWireView.FormView({
           applet:dAppletMenuName,
           templateHTML : 'StdForm', //This is ignored at the time of rendering
           showViewBar:true, 
           viewBarTemplate:dAppletMenuTemplate,
           model: dview.model
          });

          var dViewBar = new ReferralWireView.FormView({ 
            applet: options.viewBarApplet, 
            clickRoute: options.clickRoute,
            templateHTML : 'StdForm', 
            showViewBar:true, 
            viewBarTemplate:(!$.hasVal(options.viewBarTemplate))?'ActionBarTemplate':options.viewBarTemplate
          });
              dViewBar.model = dview.model;                     
          
          var ldview = new ReferralWireView.ListDetailView ( { 
            listview : lview, 
            detailview: dview, 
            detailview2:dview2,
            detailview3:dview3,
            detailview4:dview4,
            templateHTML: ($.hasVal(options.viewTemplate))?options.viewTemplate:'StdLDView',
            route: options.clickRoute,
            viewBar:dViewBar,
            appletMenu:dAppletMenu,
            appletMenuRight:options.appletMenuRight,
            upsertApplet:upsertApplet,
            viewTitle:options.viewTitle,
            tooltipSource:options.tooltipSource,
            upsertWizard:options.upsertWizard,
            refWizard:options.refWizard,
            fixRecordApplet:options.fixRecordApplet,
            fixRecordWizard:options.fixRecordWizard,
            inlineMap:options.inlineMap,
            inlineClock:options.inlineClock,
            listMap:options.listMap,
            secondTierNav:options.secondTierNav,
            savedSearch:options.savedSearch,
            ssModel:ssM,
            editRefreshFunction:options.editRefreshFunction,
            reportMeta:(!_.isUndefined(options.isReport) && options.isReport)?lview.model.models[0]:undefined
            
        });

        lview.parentView = ldview;
          
          // render
          var rHtml = ldview.render().el; 
          
          $(rwApp.params.modules[1]).html(rHtml).trigger('create');
          
          if ($.hasVal(options.savedSearch)){
            var notUserConfigurable = ($.hasVal(options.savedSearch.notUserConfigurable) && options.savedSearch.notUserConfigurable)?true:false;
        
            $(".listViewListContainer").addClass("hasAdvancedSearch");
            if (notUserConfigurable){$(".listViewListContainer").addClass("noconfig")}
            //$(".listViewListContainer .ui-input-search").prepend("<div class='savedSearchBtn'></div>")
            $(".listViewListContainer form").before( "<div class='savedSearchDesc'><div class='savedSearchDisplay'><div class='savedSearchName'>All</div></div><div class='editSearchButton'></div></div>");
            if ($.hasVal(options.savedSearch.dssName)){
                $(".savedSearchName").html(options.savedSearch.dssName);
            }
          }
          
            //this function remove empty fields and sections
          rwApp.removeEmptyFields();
          
          
          if (!_.isUndefined(options.done)){ 
              
            options.done(ldview);
          }
          
          if ( !_.isUndefined(options.usePaging) ) {
                  $('#'+ lview.id ).on( "listviewbeforefilter", lview, lview.textSearchHandler);
                  $('#'+ lview.id ).on( "scroll", lview, lview.scrollHandler);
           }
          // Could come back with empty list
          
            
          lview.refreshList(); // this tells the list view to keep progressively rendering all the models

          if (selModel) { 
            lview.selectItem(selModel.id);
            ldview.displaySelected(selModel);
          }
          else {
            ldview.displaySelected(lview.model.models[0]);
          } 

          if ($.hasVal(options.inlineMap)){
            ldview.renderInLineMap();
          }
          
          if ($.hasVal(options.inlineClock)){
            ldview.renderInLineClock(options.inlineClock);
          }

    };

    ReferralWirePattern.GenericMergedListDetailPattern = function (options) {
      // combines two or more datasets into a single model collection for a list view.
      // Used initially to support AllUpcomingEvents list view - which overlays a list of upcoming events
      // (rwEvent) with a list of those events that I'm attending (rwAttendee).  Those events I'm attending
      // are visually flagged and I can make myself an Expected Attendee of those I'm not already planning to attend

      // doesn't support paging (and may never). Doesn't support saved search either, but probably could with a significant amount 
      // of work -- including extensions to ListDetailView.applySavedSearch and rwApp.ParseSavedSearch

        var that = this;  
        var dOptions = _.clone(options.dataOptions);
        var p = rwApp.fetchMultipleLists({dataOptions:dOptions})
            p.done(function(model){
                  var lview = new ReferralWireView.ListView ({ 
                      applet: options.listapplet, 
                      listItemClass: options.listItemClass,
                      usePaging:options.usePaging,
                      clientSideSortAttr : options.clientSideSortAttr,
                      clientSideSortDirection: options.clientSideSortDirection,
                      listMap:options.listMap,
                      calculatedFields:options.calculatedFields,
                      template: _.isUndefined(options.listTemplate) ? 'StdList' : options.listTemplate
                  });
            lview.setModel(model);
            var selModel = lview.model.models[0];
            ReferralWirePattern.finishGenericListDetailPattern(options,selModel,lview)
                  
     });
   };
  
  ReferralWirePattern.GenericMasterDetailPattern = function (options) {
       var that = this;
      // get meta data for rendering master applet
      var mview = new ReferralWireView.FormView ({ 
        applet: options.masterApplet, 
        templateHTML : _.isUndefined(options.masterTemplate) ? 'StdFormNarrow' : options.masterTemplate,
        showViewBar:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?options.profileNavigation:false,
        viewBarTemplate:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?options.masterTemplate:'ActionBarTemplate'
            
        });

      // get data of the master
        var m_data = new rwcore.StandardModel({
        module : ($.hasVal(options.actor))?options.actor:mview.actor,
        bc:mview.bc,
        bo:mview.bo,
        "id":options.masterRecordId 
      });
      m_data.fetch({ 
          add : true,

                error : rwcore.showError, 
                success : function (model, response, jqXHR) {
                 
                  model.clickRoute = options.clickRoute;
                  options.model = model;
                  options.mview = mview;
                  
                  rwApp.MasterDetailRenderChildren(options);

              }
      });

     };

      ReferralWirePattern.MasterDetailWithNextPrev = function (options){
     
     
      var that = this;  
      
      var mview = new ReferralWireView.FormView ({ 
        applet: options.masterApplet, 
        templateHTML : _.isUndefined(options.masterTemplate) ? 'StdFormNarrow' : options.masterTemplate,
        showViewBar:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?options.profileNavigation:false,
        viewBarTemplate:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?options.masterTemplate:'ActionBarTemplate'
            
        });
 
        // get meta data for rendering
        var lview = new ReferralWireView.ListView ({ 
          applet: options.nextPrev.listapplet, 
          listItemClass: options.listItemClass,
          //usePaging:options.usePaging,
          clientSideSortAttr : options.nextPrev.clientSideSortAttr,
          clientSideSortDirection : options.nextPrev.clientSideSortDirection,
          
          template: _.isUndefined(options.listTemplate) ? 'StdList' : options.listTemplate});
        
        var dDataOptions = {
        module : ($.hasVal(options.nextPrev.actor))?options.actor:lview.actor,
        act:options.nextPrev.act,
        bo:lview.bo,
        bc:lview.bc,
      searchSpec: ($.hasVal(options.nextPrev.searchSpec))?options.nextPrev.searchSpec:lview.searchSpec, 
        sortby : options.nextPrev.sortby,
            cacheOptimize : options.cacheOptimize,
        sortOrder : _.isUndefined(options.nextPrev.sortOrder) ? "ASC" : options.nextPrev.sortOrder,
            //limit: _.isUndefined(options.usePaging) ? undefined : rwcore.pagingSize
        };

        var data = new rwcore.StandardCollection(dDataOptions);
        data.fetch(
             {      
                  add : true,
                  error : rwcore.showError, 
                  success : function (model, response, jqXHR) {
                  
                      lview.setModel(model);
                      //var selModel = lview.model.models[0];
                      var selModel = lview.model.get(options.masterRecordId);
                      options.model = selModel;
                    options.mview = mview;
                    options.nextPrevListView = lview;
                    rwApp.MasterDetailRenderChildren(options);
                  
                  }
      });
     };
     
     ReferralWirePattern.MasterDetailRenderChildren = function (options){
            
        
          


            //model.query.partyRelation = "TARGET";
            var model = options.model;
            var mview = options.mview;  
            var that = this;
          model.bc = mview.bc;
          model.bo = mview.bo;
                  mview.model = model;
                  mview.render();
                  
                  var detailListTemplate = (!_.isUndefined(options.detailListTemplate) && !_.isNull(options.detailListTemplate))?options.detailListTemplate:'StdList';

                  var dViewOptions = {
                      applet:(_.isFunction(options.detailListApplet))?options.detailListApplet(mview.model):options.detailListApplet,//options.detailListApplet,
                      transformOptions:options.transformOptions,
                      template:detailListTemplate,
                      clientSideSortAttr:options.clientSideSortAttr,
                      clientSideSortDirection:options.clientSideSortDirection,
                      filter:(!_.isUndefined(options.filter) && options.filter)?true:false,//governs whether search box appears above the list
                      usePaging:options.usePaging,
                      listItemClass:options.listItemClass
                  };

                  // var dview = new ReferralWirePattern.ListView(dViewOptions);
                  // var dview = new ReferralWirePattern.ReferralMgmtListView(dViewOptions);
                  
                  var dview = (!_.isUndefined(options.detailRenderer)) ? new options.detailRenderer(dViewOptions) : new ReferralWireView.ReferralMgmtListView(dViewOptions);
                  dview.clickRoute = options.clickRoute;


                  var dDataOptions = {
                      masterRecordId: options.masterRecordId,
                      module : dview.actor, 
                      act:options.act,
                      searchSpec: ($.hasVal(options.searchSpec))?options.searchSpec:($.hasVal(dview.searchSpec))?dview.searchSpec:undefined, 
                      sortby : options.sortby,
                      bc:dview.bc,
                      bo:dview.bo,
                      limit: _.isUndefined(options.usePaging) ? undefined : rwcore.pagingSize,
                      sortOrder : _.isUndefined(options.sortOrder) ? "ASC" : options.sortOrder
                  };
                  
                  if (!_.isUndefined(options.detailSearchSpec)) {
                    var keys = Object.keys(options.detailSearchSpec);
                    for ( var i = 0; i < keys.length; i++) {
                      var thisKey = keys[i];
                      var thisVal = options.detailSearchSpec[keys[i]];
                      
                      if ($.hasVal(options.parentKeyField) && options.parentKeyField == thisVal){
                        thisVal = model.get(thisVal); //the search spec is a field value from the parent record
                        //
                        
                          if (options.clientFKFilter){
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
                             /*
                               var ss = {filter:[{
                                ftype:"expr", 
                                expression:fkFilter
                               }]}
                               dDataOptions.searchSpec = ss;
                               */
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
                    
                    model.bc = dview.bc;
                    model.bo = dview.bo;
                      dview.setModel(model);
                                            
                      var dViewBar = new ReferralWireView.FormView({ 
                        applet: options.viewBarApplet, 
                        clickRoute:options.clickRoute, //used to identify which view is active
                        templateHTML : 'StdForm', 
                        showViewBar:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?false:true, 
                        viewBarTemplate:(!$.hasVal(options.viewBarTemplate))?'ActionBarTemplate':options.viewBarTemplate()
                        });
                      
                      dViewBar.model = mview.model;
                      
                      var dAppletMenuName = "CUDMenu";//this default applet menu supports Create, Update & Delete. It's defined in party.xml
                      if (!_.isUndefined(options.appletMenu) && !_.isNull(options.appletMenu)){
                        dAppletMenuName = options.appletMenu; 
                      }
                      var dAppletMenuTemplate = 'AppletMenuTemplate';
                      if (!_.isUndefined(options.appletMenuTemplate) && !_.isNull(options.appletMenuTemplate)){
                        dAppletMenuTemplate = options.appletMenuTemplate; 
                      }
                      

                      var dAppletMenu = new ReferralWireView.FormView({
                       applet:dAppletMenuName,
                       templateHTML : 'StdForm', //This is ignored at the time of rendering
                       showViewBar:true, 
                       viewBarTemplate:dAppletMenuTemplate,
                       model: mview.model
                      });
                      
                      var viewTitle = options.viewTitle;

                      
                      var dynamicTitles = new Array();
                      if (!_.isUndefined(options.dynamicTitles) && !_.isNull(options.dynamicTitles)){
                       var m = mview.model;
                       for (i=0;i< options.dynamicTitles.length;i++){
                         thisTitle = options.dynamicTitles[i];
                           var dTitle = thisTitle.template;
                           var fields = thisTitle.fields;
                           for (j=0;j< fields.length;j++){
                             thisField = fields[j];
                             for (f in thisField){
                               var thisVal = m.get(f);
                               if (!_.isUndefined(thisVal) && !_.isNull(thisVal)){
                                  dTitle = dTitle.replace(thisField[f],thisVal);
                               }
                             }
                           }
                           
                         dynamicTitles[i] = dTitle;
                         //takes list of substitution templates for view title, etc., replaces them with data values from master applet & put them into 
                         // a new array that will be passed to the parent view
                       }
                        
                      
                       }
                      
                      var mdview = new ReferralWireView.MasterDetailView ( { 
                        masterview: mview, 
                        d1view : dview,  
                        templateHTML: (!_.isUndefined(options.MDTemplate))?options.MDTemplate:'StdMDView', 
                        viewBar:dViewBar,
                        viewTitle:viewTitle,
                        route: options.clickRoute,
                        dynamicTitles:dynamicTitles,
                        tooltipSource:options.tooltipSource,
                        appletMenuRight:options.appletMenuRight,
                        appletMenu:dAppletMenu,
                        refWizard:options.refWizard,
                        upsertWizard:options.upsertWizard,
                        secondTierNav:options.secondTierNav,
                        shareFunction:options.shareFunction,
                        inviteFields:options.inviteFields,
                        fixRecordApplet:options.fixRecordApplet,
                        upsertApplet:options.upsertApplet,
                        parentDefaultVals:options.parentDefaultVals,
                        listItemClass:options.listItemClass,
                        refreshModelView:mview,
                        nextPrevListView:options.nextPrevListView,
                        allOptions:options
                       });
                      
                      $(rwApp.params.modules[1]).html(mdview.render().el).trigger('create');
                      if (!_.isUndefined(dview.refreshList)){
                        dview.refreshList(); // this tells the list view to keep progressively rendering all the models
                    }

                     if ( !_.isUndefined(options.usePaging) ) {
                            $('#'+ dview.id ).on( "listviewbeforefilter", dview, dview.textSearchHandler);
                            $('#'+ dview.id ).on( "scroll", dview, dview.scrollHandler);
                     }
                      
                      
                      if (!_.isUndefined(options.done)){ 
                          
                        options.done(mdview);
                      }
                      
                      
                      }
                  }); 
      
     };

      ReferralWirePattern.ReferralsMasterTwoDetail = function (options) {
     
                var that = this;
                var mview = new ReferralWireView.FormView ({ 
                  applet: options.masterApplet, 
                  templateHTML : 'StdFormNarrowPub'
                });    
                var m_data = new rwcore.StandardModel({
                  module : ($.hasVal(options.actor))?options.actor:mview.actor, 
                  "id":options.masterRecordId 
                });
                
                m_data.fetch({ 
                    add : true,
  
                      error : rwcore.showError, 
                      success : function (model, response, jqXHR) {
                        
                          mview.model = model;
                          mview.render();
                          var d1ViewOptions = {
                              applet:options.detail1ListApplet,
                              template:options.detail1ListTemplate,
                              filter:false,
                              ulClass:"d1List"
                          }
                          
                          var parentId = model.get('partnerId');
                          
                          
                          options.viewTitle = ($.hasVal(model.get('firstName')))?model.get('firstName'):model.get('firstName_pub');
                
                
                          var d1view = new ReferralWireView.ReferralMgmtListView(d1ViewOptions);
                          var fkFilter = "{fromId : '"+parentId+"'}"
                          var personalFilter = "{$or:[{toId : '"+rwFB.uId+"'},{toId2 : '"+rwFB.uId+"'}]}"

                          var ss = {
                            filter:[
                                    //{
                                    //  ftype:"expr", 
                                    //  expression:"{archiveFlag : { $ne : 'true'}}"
                                    //},
                                    {
                                      ftype:"expr", 
                                      expression:fkFilter
                                    },
                                    {
                                      ftype:"expr", 
                                      expression:personalFilter
                                    }
                                    ]
                          };
                          
                          
                          var d1_data = new rwcore.StandardCollection({
                            module : d1view.actor,
                            fromId: parentId,
                            sortby:'rw_created_on',
                            sortOrder:'DESC',
                            searchSpec:ss
                            });

                          d1_data.fetch( {
                            add : true,
                              error : rwcore.showError, 
                              success : function (model, response, jqXHR) {
                              
                                
                                 d1view.model = model;
                                
                                  var d2ViewOptions = {
                                        applet:options.detail2ListApplet,
                                        template:options.detail2ListTemplate,    
                                        filter:false,
                                        ulClass:"d2List"
                                  };
                                  
                                   //mongodb or syntax example: {$or: [ { qty: { $lt: 20 } }, { sale: true } ] } 
                                 var fkFilter = "{$or:[{toId : '"+parentId+"'},{toId2 : '"+parentId+"'}]}"
                                 var personalFilter = "{fromId : '"+rwFB.uId+"'}"

                                var ss = {
                                  filter:[
                                          {
                                            ftype:"expr", 
                                            expression:"{archiveFlag : { $ne : 'true'}}"
                                          },
                                          {
                                            ftype:"expr", 
                                            expression:fkFilter
                                          },
                                          {
                                            ftype:"expr", 
                                            expression:personalFilter
                                          },
                                          ]
                                };
                                
                                  
                                  var d2view = new ReferralWireView.ListView(d2ViewOptions);

                                  var d2_data = new rwcore.StandardCollection({
                                    module : d2view.actor, 
                                    toId: parentId,
                                    searchSpec:ss,
                                    sortby:'rw_created_on',
                                  sortOrder:'DESC',
                                    //searchSpec: d2view.searchSpec
                                  });
                                  d2_data.fetch( {
                                    add : true,
                                      error : rwcore.showError, 
                                      success : function (model, response, jqXHR) {
                                        
                                        d2view.model = model;
                                        
                                                              
                                        var dViewBar = new ReferralWireView.FormView({ 
                                          applet: options.viewBarApplet,
                                          clickRoute:options.clickRoute, //used to identify which view is active 
                                          templateHTML : 'StdForm', 
                                          showViewBar:true, 
                                          viewBarTemplate:(!$.hasVal(options.viewBarTemplate))?'ActionBarTemplate':options.viewBarTemplate
                                        });
                                        dViewBar.model = mview.model;
                                        
                                        var dAppletMenuName = "CUDMenu";//this default applet menu supports Create, Update & Delete. It's defined in party.xml
                                        if (!_.isUndefined(options.appletMenu) && !_.isNull(options.appletMenu)){
                                          dAppletMenuName = options.appletMenu; 
                                        }
                                        var dAppletMenuTemplate = 'AppletMenuTemplate';
                                        if (!_.isUndefined(options.appletMenuTemplate) && !_.isNull(options.appletMenuTemplate)){
                                          dAppletMenuTemplate = options.appletMenuTemplate; 
                                        }
                                        

                                        var dAppletMenu = new ReferralWireView.FormView({
                                         applet:dAppletMenuName,
                                         templateHTML : 'StdForm', //This is ignored at the time of rendering
                                         showViewBar:true, 
                                         viewBarTemplate:dAppletMenuTemplate,
                                         model: mview.model
                                        });
                                        
                                        var dynamicTitles = new Array();
                                        if (!_.isUndefined(options.dynamicTitles) && !_.isNull(options.dynamicTitles)){
                                         var m = mview.model;
                                         for (i=0;i< options.dynamicTitles.length;i++){
                                           thisTitle = options.dynamicTitles[i];
                                             var dTitle = thisTitle.template;
                                             var fields = thisTitle.fields;
                                             for (j=0;j< fields.length;j++){
                                               thisField = fields[j];
                                               for (f in thisField){
                                                 var thisVal = m.get(f);
                                                 if (!_.isUndefined(thisVal) && !_.isNull(thisVal)){
                                                    dTitle = dTitle.replace(thisField[f],thisVal);
                                                 }
                                               }
                                             }
                                             
                                           dynamicTitles[i] = dTitle;
                                           //takes list of substitution templates for view title, etc., replaces them with data values from master applet & put them into 
                                           // a new array that will be passed to the parent view
                                         }
                                          
                                        
                                         }
                                        
                                        var mdview = new ReferralWireView.MasterDetailView ( { 
                                          masterview: mview, 
                                          d1view : d1view, 
                                          d2view:d2view, 
                                          templateHTML: 'MasterTwoDetail', 
                                          viewBar:dViewBar,
                                          route: options.clickRoute,
                                          refreshModelView : mview,
                                          dynamicTitles:dynamicTitles,
                                          viewTitle:options.viewTitle,
                                          appletMenuRight:options.appletMenuRight,
                                          tooltipSource:options.tooltipSource,
                                          appletMenu:dAppletMenu,
                                          refWizard:options.refWizard
                                         });
                                        
                                        $(rwApp.params.modules[1]).html(mdview.render().el).trigger('create');
                                        d1view.refreshList();
                                        d2view.refreshList();
                                      }
                                  });
                                  
                              }     
                            });
                    }
                  });
          

   };
    
    ReferralWirePattern.GenericSummaryTilesPattern = function (options) {

        var that = this;  
        
        // get meta data for rendering
        var sview = new ReferralWireView.FormView ({ 
          applet: options.summaryapplet, 
          templateHTML: _.isUndefined(options.summaryTemplate) ? 'StdForm' : options.summaryTemplate,
          showViewBar:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?options.profileNavigation:false,
          viewBarTemplate:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation) && options.profileNavigation)?options.summaryTemplate:'ActionBarTemplate'
        });
    
        var  parentModel = sview.model = new rwcore.StandardModel({id: options.selectedId });        
        var dAppletMenuName = "CUDMenu";//this default applet menu supports Create, Update & Delete. It's defined in party.xml
        if (!_.isUndefined(options.appletMenu) && !_.isNull(options.appletMenu)){
          dAppletMenuName = options.appletMenu; 
        }
        var dAppletMenuTemplate = 'AppletMenuTemplate';
        if (!_.isUndefined(options.appletMenuTemplate) && !_.isNull(options.appletMenuTemplate)){
          dAppletMenuTemplate = options.appletMenuTemplate; 
        }
          
        var dAppletMenu = new ReferralWireView.FormView({
         applet:dAppletMenuName,
         templateHTML : 'StdForm', //This is ignored at the time of rendering
         showViewBar:true, 
         viewBarTemplate:dAppletMenuTemplate,
         model: sview.model
        });
                    
        var dview = ReferralWireView.ChildViewContainer.findByCustom(options.detailapplet);
        if ( !$.hasVal(dview) ) {  
          dview = new ReferralWireView.TilesView({
            model: options.data, 
            id: options.regionId,
            applet: options.detailapplet, 
            rwuserId : options.selectedId,
            templateHTML : _.isUndefined(options.detailTemplate) ? 'StdForm' : options.detailTemplate,
            showViewBar:false}); 
      
          ReferralWireView.ChildViewContainer.add(dview,options.detailapplet);
        }
        else  { 
              dview.model.reset(); 
              if ( !_.isUndefined(options.data) )  {
                    _.each(options.data.models, function (stdModel) {
                        dview.model.add(stdModel, {silent: true});
                      });
              } 
              dview.$el.empty();
              dview.options['offset'] = 0; 
        }
        
        var upsertApplet = ($.hasVal(options.upsertApplet))?options.upsertApplet:options.detailapplet;

        var dViewBar = new ReferralWireView.FormView({ applet: options.viewBarApplet, 
            clickRoute:options.clickRoute, //used to identify which view is active
            templateHTML : 'StdForm', 
            showViewBar:(!_.isUndefined(options.profileNavigation) && !_.isNull(options.profileNavigation))?false:true, 
            viewBarTemplate:(!$.hasVal(options.viewBarTemplate))?'ActionBarTemplate':options.viewBarTemplate
            });
        
        dViewBar.model = sview.model;          
        
        var viewTitle = options.viewTitle;

        var dynamicTitles = new Array();
        if (!_.isUndefined(options.dynamicTitles) && !_.isNull(options.dynamicTitles)){
           var m = sview.model;
           for (i=0;i< options.dynamicTitles.length;i++){
             thisTitle = options.dynamicTitles[i];
               var dTitle = thisTitle.template;
               var fields = thisTitle.fields;
               for (j=0;j< fields.length;j++){
                 thisField = fields[j];
                 for (f in thisField){
                   var thisVal = m.get(f);
                   if (!_.isUndefined(thisVal) && !_.isNull(thisVal)){
                      dTitle = dTitle.replace(thisField[f],thisVal);
                   }
                 }
               }
               
             dynamicTitles[i] = dTitle;
             //takes list of substitution templates for view title, etc., replaces them with data values from master applet & put them into 
             // a new array that will be passed to the parent view
           }
        }
      
        var ldview = new ReferralWireView.ListDetailView ( { 
          listview : sview, 
          detailview: dview, 
          templateHTML: !_.isUndefined(options.viewTemplate)?options.viewTemplate:'StdSummaryDetailView',
          route: options.clickRoute,
          appletMenu:dAppletMenu,
          upsertApplet:upsertApplet,
          viewTitle:viewTitle,
          appletMenuRight:options.appletMenuRight,
          dynamicTitles:dynamicTitles,
          tooltipSource:options.tooltipSource,
          refWizard:options.refWizard,
          viewBar:dViewBar});
                
          // render
          var rHtml = ldview.render().el; 
                
          $(rwApp.params.modules[1]).html(rHtml).trigger('create');
          $( ".mainPanelBody" ).on('scroll', dview, dview.scrollHandler);
          
        };   
        
        ReferralWirePattern.GetUserLinkedInProfile = function (LinkedInId, options) {

          IN.API.Profile(LinkedInId)
            .fields(["id", 
                     "firstName", 
                     "lastName",
                     "headline", 
                     "pictureUrl", 
                     "emailAddress",
                     "summary",
                     "publicProfileUrl",
                     "location",
                     "positions",
                     "skills",
                     "educations",
                     "certifications",
                     "associations",
                     "recommendationsReceived",
                     "publications",
                     "languages",
                     "specialties",
                     "numConnections"
                     ])
            .result(function(result) {
              
              var cm = new rwcore.StandardModel({module:"UserMgr"});
              if ( result._total > 0 ) {
                var ln = result.values[0];
                cm.set({
                  firstName : ln.firstName,
                  lastName :ln.lastName,
                  login: ln.emailAddress,
                  emailAddress: ln.emailAddress,
                  current:ln.currentShare,
                  jobTitle:ln.headline,
                  location: ln.location,
                  positions: ln.positions,
                  photoUrl : ln.pictureUrl,
                  bio : ln.summary, // todo: build the bi using the data from skills, positions, certs, etc
                  LNProfileId: ln.id,
                  LNProfile : ln.publicProfileUrl,
                  skills : ln.skills,
                  educations: ln.educations,
                  certifications : ln.certifications,
                  associations : ln.associations,
                  recommendationsReceived : ln.recommendationsReceived,
                  publications : ln.publications,
                  languages : ln.languages,
                  specialties : ln.specialties,
                  numConnections : ln.numConnections
                });
                
              //  if (!_.isUndefined(ln.location))
                //  cm.set({postalCodeAddress : ln.location});
              }
              options.success(cm);
            })
            .error( function(errorPayload) {
              options.error(errorPayload);     
            }); 
      };
      
      ReferralWirePattern.lnPeopleSearch = function (firstName, lastName, zipcode, options) {


        if (_.isUndefined(IN)) return;
        
        
        IN.User.authorize(function() {

        
            IN.API.PeopleSearch()
            .params({"first-name": firstName, "last-name": lastName, "postal-code" : zipcode,"network":"S"})
            .fields(["id", "firstName", "lastName", "headline", "pictureUrl","publicProfileUrl","location"])
            .result(function(result) {
                var cc = new rwcore.StandardCollection({module:"ContactsMgr"});
                cc.reset();
                for (var index in result.people.values) {
                    var ln = result.people.values[index];
                    var cm = new rwcore.StandardModel({module:"ContactsMgr"});
                    cm.set({
                      LNProfileId : ln.id,
                      firstName : ln.firstName,
                      lastName :  ln.lastName,
                      emailAddress : ln.email1Address,
                      jobTitle:ln.headline,
                      photoUrl : ln.pictureUrl,
                      publicProfileUrl : ln.publicProfileUrl,
                      location : (!_.isUndefined(ln.location))?ln.location.name:""
                    });
                    cc.add(cm, {silent: true});
                }
                if ( !_.isUndefined(options) && !_.isUndefined(options.success) )
                  options.success(cc);
            })
            .error( function(errorPayload) {

            });

        });
    };  
/*


    ReferralWirePattern.ChartAdminPattern2 = function (options) {

      $(options.containerEl).html(_.template('chartAdmin')).trigger('create'); 
      $('#adminCharts').css('background', 'blue');

      $('#showchart').on("click", function(event) {

          var chart = {} ;
          var inputParams = {} ;
      
          var report = JSON.parse($('#report').val().replace(/\'/g,"\""));

          var dataclass = report.dataclass;
          chart['name'] =  dataclass + "Chart";
          chart['dataclass'] =  dataclass ;

          if ( !_.isUndefined(report['contextVar']) ) {
               inputParams[report.contextVar.name] = report.contextVar.value;
          }

          var filters = JSON.parse($('#filter').val().replace(/\'/g,"\""));
          var subTitle = $('#filter option:selected').text();

          var period =  $('#period').val();
          if ( period != "")  {
            var d = new Date();
            var n = d.getTime();
            var m = parseInt(period); // period in days
            n = n - m*86400000; 
            inputParams['since_date'] = new Date(n);
          }
          else 
            inputParams['since_date'] = new Date("2012/01/01"); 

          subTitle =  subTitle + "," + $('#period option:selected').text();

          chart['filter'] = filters; 
          var groupby = JSON.parse($('#groupby').val().replace(/\'/g,"\""));
          subTitle =  subTitle + "," + $('#groupby option:selected').text();

          chart['groupby'] = groupby;
          inputParams['chart'] = chart;
    
          inputParams['module'] = report.actor;
          inputParams['act'] = report.act;
          inputParams['name'] = report.series;

          var data = new rwcore.StandardCollection(inputParams);
          
          $.when(data.sync()).done( function( c ) { 

          var series = [];

          for (var i = 0; i < c.length; i++) {
            var seriesItem = {};
            seriesItem['name'] = c.models[i].get('_id')[groupby.aggregate.name];
            seriesItem['y'] = c.models[i].get(groupby.aggregate.name);
            series[i] = seriesItem;
          }

          new ReferralWireView.ChartView( { 
                  containerEl : '#chartContainer',
                  ChartType: $('#type').val(),
                  ChartTitle: report.Title,
                  subTitle: subTitle,
                  yAxisTitle : 'total',
                  xAxisTitle : groupby.aggregate.name,
                  series : series,
                  formatter : function () {return "<span>" + series[this.value].name + "</span>";}
          }).render();      
          });
        
      });

    };
*/
    ReferralWirePattern.ChartAdminPattern = function (options) {

      $(options.containerEl).html(_.template('chartAdmin')).trigger('create'); 
      $('#adminCharts').css('background', 'blue');

      $('#showchart').on("click", function(event) {

          var chart = {} ;
          var inputParams = {} ;
      
          var report = JSON.parse($('#report').val().replace(/\'/g,"\""));

          var dataclass = report.dataclass;
          chart['name'] =  dataclass + "Chart";
          chart['dataclass'] =  dataclass ;

          if ( !_.isUndefined(report['contextVar']) ) {
               inputParams[report.contextVar.name] = report.contextVar.value;
          }

          var filters = JSON.parse($('#filter').val().replace(/\'/g,"\""));
          var subTitle = $('#filter option:selected').text();

          var period =  $('#period').val();
          if ( period != "")  {
            var d = new Date();
            var n = d.getTime();
            var m = parseInt(period); // period in days
            n = n - m*86400000; 
            inputParams['since_date'] = new Date(n);
          }
          else 
            inputParams['since_date'] = new Date("2012/01/01"); 

          subTitle =  subTitle + "," + $('#period option:selected').text();

          chart['filter'] = filters; 
          var groupby = JSON.parse($('#groupby').val().replace(/\'/g,"\""));
          subTitle =  subTitle + "," + $('#groupby option:selected').text();

          chart['groupby'] = groupby;
          inputParams['chart'] = chart;
    
          inputParams['module'] = report.actor;
          inputParams['act'] = report.act;
          inputParams['name'] = report.series;

          var data = new rwcore.StandardCollection(inputParams);
          
          $.when(data.sync()).done( function( c ) { 

          var series = [];

          for (var i = 0; i < c.length; i++) {
            var seriesItem = {};
            var a = c.models[i].get('_id')[groupby.aggregate.name];
            if ( _.isUndefined(a))
              a = c.models[i].get('_id');
            
            seriesItem['name'] = a;

            seriesItem['y'] = c.models[i].get(groupby.aggregate.name);
            series[i] = seriesItem;
          }

          new ReferralWireView.ChartView( { 
                  containerEl : '#chartContainer',
                  ChartType: $('#type').val(),
                  ChartTitle: report.Title,
                  subTitle: subTitle,
                  yAxisTitle : 'total',
                  xAxisTitle : groupby.aggregate.name,
                  series : series,
                  formatter : function () {return "<span>" + this.value+ "</span>";}
          }).render();      
          });
        
      });

    };

    ReferralWirePattern.SystemMetricsReport = function (options) {
      $(options.containerEl).html(_.template('systemMetrics')).trigger('create'); 
      $('#adminCharts').css('background', 'gold');
      $('#adminMetrics').css('background', 'blue');
      
      
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

      drawMetrics( 'Registrations Report', 'UM_REGISTER', unit,  '#UM_REGISTRATION_REPORT', new Date("2014/01/01")  );
      drawMetrics( 'Login Activity Report', 'UM_LOGIN', unit,  '#UM_LOGIN_REPORT', new Date("2014/01/01")  );
      drawMetrics( 'Inivitations Report', 'UM_SENTINVITATION', unit,  '#UM_SENTINVITATION_REPORT', new Date("2014/01/01")  );
      drawMetrics( 'Referrals Report', 'UM_REFERRAL', unit,  '#UM_REFERRAL_REPORT', new Date("2014/01/01")  );
      drawMetrics( 'Add Connections Report', 'UM_ADDCONNECTION', unit,  '#UM_ADDCONNECTION_REPORT', new Date("2014/01/01")  );
      drawMetrics( 'Chapter Creation Report', 'UM_CREATEORG', unit,  '#UM_CREATEORG_REPORT', new Date("2014/01/01")  );
      
    };

      
   return ReferralWirePattern;   
  })(Backbone, _, $, ReferralWireView || window.jQuery || window.Zepto || window.ender);
  return Backbone.ReferralWirePattern; 
}));

