(function (root, factory) {
  if (typeof exports === 'object') {

    var jquery = require('jquery');
    var underscore = require('underscore');
    var backbone = require('backbone');
    var ReferralWireBase = require('rwcore');
 
    module.exports = factory(jquery, underscore, backbone, rwcore);

  } else if (typeof define === 'function' && define.amd) {

    define(['jquery', 'underscore', 'backbone',  'rwcore'], factory);

  } 
}(this, function ($, _, Backbone, rwcore, base64) {

  Backbone.RWAuth = RWAuth = (function(Backbone, _, $, rwcore){
      var RWAuth =  {} ; 
   
      RWAuth.resetPasswordTemplate = { location: '/Templates/custom/resetPasswordTemplate.html',value : null };

      RWAuth.Router  = Backbone.Router.extend({
      
      params: "",
      
      routes: {
        "passwordReset" : "passwordReset", 
        "*actions": "defaultRoute"
      },
      
      defaultRoute : function (actions) {
          if(_.isNull(rwFB.loginEmail) || _.isEmpty(rwFB.loginEmail) ) 
            rwFB.loginEmail = localStorage.getItem("rwLoginId");
          if ( rwFB.loginEmail ) {
            $('#loginForm #login').val(rwFB.loginEmail);
            rwFB.loginChecked = true;
          }
      },

      register : function () {

        if (  !$.hasVal($('#registerForm #login').val()) ||
              !$.hasVal($('#registerForm #password').val()) ||
              !$.hasVal($('#registerForm #firstName').val()) ||
              !$.hasVal($('#registerForm #lastName').val())  ) {
          rwcore.FYI("Please fill in all the required information");
          return;
        }
   
        if (!rwcore.validEmail ($('#registerForm #login').val()) )
        {
          rwcore.FYI("<h4>Login Email should be a valid email address</h4> Example: bob@acme.com. <p>You Login email address will be used to communicate with you.");
          return;
        }
        
        if( $('#registerForm #password').val().length < 6 ) {
          rwcore.FYI("<h4> Weak Password </h4> Password should be 6 letters or more. Please use Alpha Numerics. <p> Example: Abc1Xyz2");
          return;
        }

   
        var registrationData =  {
            module : 'SecMgr',
            act : 'create',
            login  : $('#registerForm #login').val(),
            password : $('#registerForm #password').val(),
            firstName : $('#registerForm #firstName').val(),
            lastName : $('#registerForm #lastName').val(),
            postalCodeAddress_work : $('#registerForm #postalCode').val(),
            invitationId : $('#registerForm #invitationId').val(),
            tenant : rwApp.tenant
        };
          
        var promise  = $.ajax({
              type: "POST",
              url: "/rwWebRequest?",
              async: false,
              cache: true,
              dataType: "json",
              data: { data : JSON.stringify(registrationData) } });
          
        promise.done(
              function(model, response, jqXHR) {
                  
                  // TODO : fire off SMASH registration from here..
     
                  window.localStorage.setItem("rwLoginId", $('#registerForm #login').val());
                  if (rwFB.OSType.indexOf("IPHONE") > -1) {
                  	 window.location  = "/"+rwFB.tenant+"/Templates/Other/iphoneWelcome.html";
                  } else if (rwFB.OSType.indexOf("ANDROID") > -1){
                  	 window.location  = "/"+rwFB.tenant+"/Templates/Other/androidWelcome.html";
                  } else {
                  	rwcore.FYI("Congratulations, Your STN Connect account has been created and a confirmation email has been sent to your login email address with your STN Connect login and password. Please save it safely for your records.");
                  	ga('send', 'event', 'System', 'Registered', $('#registerForm #login').val());
                    window.location  = "/rw.jsp#home";
                  }
	            });

        promise.fail ( rwcore.showError ); 

      },
    
      login : function () {

          var that = this;

          var login = $('#login').val();

          if (login.length < 6 || !rwcore.validEmail (login) )
          {
              rwcore.FYI("<h4>Login Email should be a valid email address</h4> Example: bob@acme.com.");
              return;
          }

          var pw = $('#password').val();

          if (pw.length < 6 )
          {
              rwcore.FYI("<h4>Password is short</h4> Your password should be atleast 6 letters long");
              return;
          }

          var formData = $("#loginForm").serialize();
         
          var promise = $.ajax({
              type: "POST",
              url: "/rwWebRequest?module=SecMgr&",
              async: false,
              cache: true,
              dataType: "json",
              data: formData });
          promise.done( function(model, response, jqXHR) {
                  window.localStorage.setItem("rwLoginId", $('#loginForm #login').val());
                  ga('send', 'event', 'System', 'LoggedIn', $('#loginForm #login').val());
                  window.location = that.baseUrl;
              });
          promise.fail(function (response, status, error) {
            rwcore.showError(response, status, error);
          });
      },

      checkLoginExists : function(loginId) {
        var promise = $.Deferred();
        var val = loginId.val();

        if (val.length < 6 || !rwcore.validEmail (val) )
        {
          rwcore.FYI("<h4>Login Email should be a valid email address</h4> Example: bob@acme.com. <p>You Login email address will be used to communicate with you.");
          promise.reject(); 
          return;
        }

        var data = new rwcore.StandardModel({module:"SecMgr"});
        data.set( {"login": loginId.val()});
        var req = data.call("confirmLoginId", data );
        $.when(req).done (function (d) { 
            rwcore.FYI("<h4>This Login Email has already been registered.</h4> We sent you an email at the time of registration with your login information. Please check your email folders including junk folders to locate it. Or goto login screen, request a password reset.");
            promise.reject(); 
          }).fail(function (response, status, error) { 
            promise.resolve();
        });

        return promise;
      },

      help : function (page) {
          rwcore.FYI("help" + page);
      },
    
        passwordReset : function() {
            var pwResetDlg = new RWAuth.passwordResetWizard ({});
            pwResetDlg.render();  
        },

        initialize: function(options) {
          this.params = options.params;
          this.homepage = options.homepage;
          this.tenant = options.tenant;
          this.OStype = options.OStype;
          this.baseUrl = options.baseUrl;

          rwcore.init(options);
        },
    });

    RWAuth.passwordResetWizard = Backbone.View.extend({
    options : null,
    
    initialize : function (options) {
      this.options = options;
    },
    
    events:{
      "click #confirmLogin":"confirmLogin",
      "click #resetPassword":"resetPassword",
    },
    
    confirmLogin : function ( event ) {
        
        var login = $('#resetpw_login').val();

        if (login.length < 6 || !rwcore.validEmail (login) )
        {
            rwcore.FYI("<h4>Login Email should be a valid email address</h4> Example: bob@acme.com.");
            return;
        }

        var data = new rwcore.StandardModel({module:"SecMgr"});
        data.set( {"login": login});
        var req = data.call("confirmLoginId", data );
        $.when(req).done (function (d) { 
            $("#Step1").hide(0);
            $("#Step2").show(0);
        }).fail(function (response, status, error) { 
            rwcore.showError(response, status, error)
        });
        
        event.preventDefault();
    },
      
    resetPassword : function(event) {
      var that = event.data;

      var data = new rwcore.StandardModel({module:"SecMgr"});
      data.set( {"login": $('#resetpw_login').val()});
      data.call("resetPassword", data,
      {       
          add : true, error : rwcore.showError,
          success : function (model, response, jqXHR) {
            $("#PopupContainer").hide(0);
            $("#PopupContainer").html("");
            $("#pickBackground").hide(0);
            ga('send', 'event', 'System', 'ResetPassword', $('#resetpw_login').val());

            window.location = "/login.jsp"; 
            }   
      });
      event.preventDefault();
    },
      
    cancel:function(event){
        $("#PopupContainer").hide(0);
        $("#PopupContainer").html("");
        $("#pickBackground").hide(0);
        window.location = "/login.jsp"; 
    },

    render:function (data) {
      var that = this;
      var data = new rwcore.StandardModel({module:"SecMgr"});
      if ( _.isNull(RWAuth.resetPasswordTemplate.value) )
                    RWAuth.resetPasswordTemplate.value = rwcore.getTemplate(RWAuth.resetPasswordTemplate.location);
      var html = _.template(RWAuth.resetPasswordTemplate.value,{});
      $('#PopupContainer').html(html).trigger('create');
      $("#PopupContainer").on('click', '#confirmLogin', that, that.confirmLogin);
      $("#PopupContainer").on('click', '#resetPassword', that, that.resetPassword);
      $("#PopupContainer").on('click', '#CancelResetTxn', that, that.cancel);
      $("#pickBackground").show(0);
      $("#PopupContainer").show(0);
      return that;
    }

    });
  
    return RWAuth;   
  })(Backbone, _, $, rwcore || window.jQuery || window.Zepto || window.ender);
  return Backbone.RWAuth; 
}));
