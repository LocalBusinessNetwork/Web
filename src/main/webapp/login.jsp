<%@ page import="java.util.Map,java.util.ResourceBundle,java.util.Locale,org.json.JSONObject,com.rw.API.SecMgr,eu.bitwalker.useragentutils.UserAgent,eu.bitwalker.useragentutils.OperatingSystem, eu.bitwalker.useragentutils.Browser,eu.bitwalker.useragentutils.DeviceType" %>
<%@ page import="canvas.SignedRequest" %>
<%@ page import="java.util.Map" %>
<%
    // Pull the signed request out of the request body and verify/decode it.
    Map<String, String[]> parameters = request.getParameterMap();
    String[] signedRequest = parameters.get("signed_request");
    // String yourConsumerSecret=System.getenv("CANVAS_CONSUMER_SECRET");
// uncomment this line for maintenance mode
// response.sendRedirect("/maintenance.html");

// This is the entry point browser based app - for all devices.

// see if the loginEmail was passed in

String loginEmailStr = request.getParameter("loginEmail")  == null ? "" : request.getParameter("loginEmail");
String redirectHash = request.getParameter("redirectHash") == null ? "home" : request.getParameter("redirectHash");

String sn = request.getServerName();

JSONObject data = new JSONObject();
SecMgr sm = new SecMgr();
data.put("act", "getTenantContext");
data.put("sn", sn);
JSONObject tenantObj = sm.handleRequest(data);

if (tenantObj == null ) {
	response.sendError(HttpServletResponse.SC_NOT_FOUND);
	return;
}

String tenant = tenantObj.getString("tenant");
request.getSession(true).setAttribute("Tenant.Id", tenant);
String SFDCToken = null;

if (signedRequest != null) {
    SFDCToken ="6556957529713189146"; // tenantObj.getString("SFDCTOken");
    String signedRequestJson = SignedRequest.verifyAndDecodeAsJson(signedRequest[0], SFDCToken);
    System.out.println(signedRequestJson);
}

String userid = (String) request.getSession(false).getAttribute("User.Id");

String baseUrl = ((tenantObj.getString("WebAppLocation") == null) ? "/rw.jsp" : tenantObj.getString("WebAppLocation") ) +  "#" + redirectHash;

if (userid != null && !userid.isEmpty() ) {
	response.sendRedirect( baseUrl );
	return;
}


sm.setExecutionContextItem("tenant", tenant);


System.out.println("loginEmail :" + loginEmailStr);
System.out.println("redirectHash : " + redirectHash);

String formFactorStyle = "web";
String viewport = "<meta name='viewport' content='width=device-width, initial-scale=1'> ";

String uaString = request.getHeader("User-Agent");
UserAgent ua = UserAgent.parseUserAgentString(uaString); 
String browserName = "OTHERBROWSER";
OperatingSystem OStype = OperatingSystem.UNKNOWN;

if ( uaString != null ) {
	Browser b = ua.getBrowser().getGroup();
	if (b == Browser.SAFARI){browserName = "SAFARI";}
	if (b == Browser.FIREFOX){browserName = "FIREFOX";}
	if (b == Browser.CHROME){browserName = "CHROME";}
	if (b == Browser.IE){browserName = "IE";}
	OStype = ua.getOperatingSystem();
}

int bv = 0;
try {
	bv = Integer.parseInt(ua.getBrowserVersion().getMajorVersion());
}

catch (java.lang.IndexOutOfBoundsException e) {
	if (browserName.equals("IE")){bv = 11;}
	//added since ua wasn't finding IE 11 -- the IndexOutBounds exception gets thrown when you point IE 11 at ua.getBrowserVersion().getMajorVersion()
}

catch (java.lang.NullPointerException e){
	//ua.getBrowserVersion() is null if the user log's in from an iPhone (and maybe Android).  Ignore since
	//this code is real
}

// STEP1: For Debugging the mobile code on browser, uncomment one of the lines below 
//OperatingSystem OStype = OperatingSystem.MAC_OS_X_IPHONE;
//OperatingSystem OStype = OperatingSystem.ANDROID4;

System.out.println("Login:" + browserName);
System.out.println("Login:" + OStype);

String OSName = "DeskTop";
String MobileWelcomePage = "";

if ( OStype == OperatingSystem.iOS4_IPHONE || 
		OStype == OperatingSystem.iOS5_IPHONE || 
			OStype == OperatingSystem.iOS6_IPHONE || 
							OStype == OperatingSystem.MAC_OS_X_IPHONE){
	OSName = "IOS";	
	formFactorStyle = "smartPhone";
	viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";
	//MobileWelcomePage = tenantObj.getString("IPhoneAppLocation");
} 
else if ( OStype == OperatingSystem.ANDROID1 || 
					OStype == OperatingSystem.ANDROID2 || 
							OStype == OperatingSystem.ANDROID4 ){
	OSName = "Android";	
	formFactorStyle = "smartPhone";
	viewport = "<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0,user-scalable=no' />";
	MobileWelcomePage = tenantObj.getString("AndroidAppLocation");
} 

// STEP2: For Debugging the mobile code on the browser, comment IF block below 

//if ( formFactorStyle == "smartPhone" ) {

//	response.sendRedirect(MobileWelcomePage);
//	return;	

	// trigger mobile app launch on the smart phone.
	// We need to do this once every switches to the new app
	//String mobileAppScheme =  tenantObj.getString("MobileAppName");
	// if ( mobileAppScheme != null && mobileAppScheme != "na" ) {
		//response.sendRedirect(mobileAppScheme + "://");
	//}
	//else {
		//response.sendRedirect(MobileWelcomePage);
	//}
	//return;	

//}

String CDN = ResourceBundle.getBundle("referralwire", new Locale("en", "US")).getString("S3ROOT.codeCDN");        

String homepage = tenantObj.getString("homepage");
String domainName = tenantObj.getString("domainName");
String rootUrl = tenantObj.getString("rootUrl");
String tenantLogo = tenantObj.getString("tenantLogo");
String FaceBookAppId = tenantObj.getString("FaceBookAppId");
String LinkedInAppId = tenantObj.getString("LinkedInAppId");
String AppVer = tenantObj.getString("ver");
String loginDisplayName = tenantObj.getString("loginDisplayName");
String tagLine = tenantObj.getString("tagLine");
String splashImage = tenantObj.getString("splashImage");
String pageTitle = tenantObj.getString("pageTitle");
String TrackingID = tenantObj.has("GoogleAnalyticsPropertyCode")?tenantObj.getString("GoogleAnalyticsPropertyCode"):"UA-40902707-2";

String privacyPolicyUrl = CDN + "/" + tenant + "/Templates/Other/STN_PrivacyPolicy.html";
String termsOfUseUrl = CDN + "/" + tenant + "/Templates/Other/STN_TermsOfUseSR.html";
String aboutUrl = "http://www." + domainName ;

String InvitationCode = "OI4ECA31DF";

%>

<!DOCTYPE html> 
<html> 
<head> 
<title><%= pageTitle %></title> 
<%= viewport %>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<link rel="shortcut icon" href="<%= CDN%>/<%= tenant%>/favicon<%= tenant%>.ico" />
<link rel="stylesheet" href="<%= CDN%>/style/jquery.mobile-1.3.1.css" />
<link rel="stylesheet" href="//assets.zendesk.com/external/zenbox/v2.6/zenbox.css" />
<link rel="stylesheet" href="/<%= tenant%>/<%= tenant%>_style.css" />
<link rel="stylesheet" href="https://resource.successfulthinkersnetwork.com/stn-member/stn.css" />

<script>
    var rwFB = { CDN : "<%= CDN%>" };
</script>

<script type="text/javascript"  data-main="/js/main" src="<%= CDN%>/js/require-jquery.min.js"></script>
<script type="text/javascript"  src="<%= CDN%>/js/jquery.cookie.min.js"></script>
<script type="text/javascript"  src="/js/jqmconfig.js"></script>
<!-- <script type="text/javascript"  src="/js/ReferralWirePhoneRouter.js"></script> -->

<% if( SFDCToken != null )  {%>
<script type="text/javascript" src="/js/sfdc/canvas-all.js"></script>
<script type="text/javascript" src="/js/sfdc/json2.js"></script>
<%  } %>

<script>
     

  	$(".emailLabel").live("click",function(){
  			
  		var locString = new String(window.location);

  		//var n=locString.indexOf("localhost");
		var n=locString.indexOf("members.successfulthinkersnetwork.com");
		if (n == -1){
			$.get('Help/demoUsers.html', function(data) {
				  $('.demoUserList').html(data);	  
				  $('.demoUserList').show();

				});
		}

        });          


        $(".demouser").live("click",function(event){
  			
            var target = event.target;
            var tagName = $(target).get(0).nodeName.toLowerCase();
            var anchorId = $(target).attr('id');
            var anchor = $(target);
            if (tagName != 'a'){
              var anchor = $(target).parents('a');
              anchorId = anchor.attr('id');
            }
            var userName = anchor.attr('uname');
            $("#login").attr("value",userName);
            $('#password').attr('value','123456');
            $('.demoUserList').hide();
        });
       
        
  </script>
	


	<!--<script type="text/javascript" src="../../js/jquery.mobile-1.0.1.js"></script>-->
	


<script>

var jqmReady = $.Deferred();
requirejs(['<%= CDN%>/js/jquery.mobile-1.3.1.min.js'], function(jquerymobile) {
	jqmReady.resolve();
});

requirejs(['rwutils.min'], function(rwutils) {});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', "<%= TrackingID%>", "<%= domainName%>");
	ga('send', 'pageview');
</script>

</head>

<body style="overflow:hidden; overflow-y:scroll" class="<%= formFactorStyle%> <%= browserName%> <%= OSName%>" >
<div id="fb-root"></div>

<audio id="ding">
<source src="/media/ding.mp3"></source>
</audio>


<script>
	rwFB.tenant = "<%= tenant%>";
	rwFB.rwTenantName = "<%= domainName%>";
	rwFB.rwTenantURL = "<%= rootUrl%>";
	rwFB.rwTenantLogo = "<%= tenantLogo%>"; 
	rwFB.rwTenantInvitation = "This is an invitation";
	rwFB.rwAppId = "<%= FaceBookAppId%>";  
	rwFB.rwChannelUrl = "http://referralwiretest.biz";
	rwFB.geoLocationWatchID = null;
	rwFB.geoLocation = null;
	rwFB.geoLocationErrorCode = null;
	rwFB.fbUserID = null;
	rwFB.FBInit = false;
	rwFB.fbAuthResponse = null;
	rwFB.picture = null;
	rwFB.routes = null;
	rwFB.LinkedInAppId = "<%= LinkedInAppId%>";
	rwFB.loginEmail = "<%= loginEmailStr%>";
	rwFB.badPasswordAttemps = 0;
	browserName = "<%= browserName %>";
	browserVersion = "<%= bv %>";
	rwFB.formFactorStyle = "<%= formFactorStyle%>" + "." + "<%= OSName%>" + ".web";
	rwFB.AppLocation = "<%= baseUrl%>";
	rwFB.InvitationCode = "<%= InvitationCode%>" ;
	rwFB.InvitationLink = "http://www.<%= domainName%>/?invitation=<%= InvitationCode%>"; // this is production
	
</script>
<!--  Page 1 Login  -->
	<div data-role="page" id="singlePageWeb" style="position:absolute;top:0;bottom:0;left:0;right:0" id="login" >
			<!-- 
			<div data-role="panel" id="left-panel"  data-theme="a" client="web">
				
			</div>
			
			<div data-role="panel" id="right-panel" data-position="right" data-theme="a" client="web">
				
			</div>
			-->
			 
	   <div id="ContentSection" data-role="content" style="position:absolute;top:0;bottom:0;left:0;right:0;min-height:initial"> 
				<!-- POST TO THE SAME PAGE -->
				
			<div id="loginDiv">
				<div class="loginFrame">

						<div class="loginFrame-inner">
							<img src="images/icons/referralWireLogo.png" style="height:90px; padding-right:15px;float:left">
							<div class="loginDisplayName"><%= loginDisplayName%></div>
							
						</div>	
						<div class="loginFrameTagLine"><%= tagLine%></div>
		
						<div class="loginFrameTable">	
	
								<form id="loginForm" action="javascript:preLogin()">
									<input type="hidden" name="act" id="act" value="login"/>
						 			<input type="hidden" name="tenant" id="tenant" value="<%= tenant%>"/>
						 			<div class="loginbox login">
			
							 			<div class="registerField"> 
							 				<div class="register-field-label">
							 					<label id="emailLabel" onclick="" for="email" class="emailLabel">Login Email:</label> 
											</div>
											<div  class="register-field-input">
											 	<input style="font-size:14pt;font-weight:bold" type="email" name="login" id="login" value="" placeholder="Login email - required" required/>
											</div>
										</div>
										<div class="registerField"> 
							 				<div class="register-field-label">
							 					<label for="password">Password:</label>  
											</div>
											<div class="register-field-input">
											 	<input type="password" name="password" id="password" value="" placeholder="Password ******* - required" required/>
											</div>
										</div>
										<div class="registerField"> 
							 				<div class="register-field-checkbox">
							 					<label for="RememberMe" >Remember Me</label>  
											 	<input name="RememberMe" id="RememberMe" type="checkbox" checked value="1" data-mini="true" data-inline="true"/>
											</div>
										</div>
										
										<div class="registerField"> 
							 				<div class="register-field-link">  
											 	<a id="pwdfgt" href="#passwordReset" data-ajax="false" data-mini="true" data-inline="true" data-theme="b">forgot password?</a>
											</div>
										</div>
										
										<div class="registerField center"> 
							 				<div class="register-field-button">
							 					<a id="loginSubmit" action="login" href="javascript:preLogin()" data-role="button" data-mini="true" data-inline="true" data-theme="b">Sign In</a>
											</div>
										</div >
										<div style="margin-left:-1000px;position:absolute"><input type="submit"/></div>
									</div>
								</form>
								
						</div>
						<div class="loginDisplayName" style="font-size:18px;margin-left:110px">
							<div style="margin-top:10px"> Not a Member yet ? 
									<a data-role="button" data-mini="true" data-inline="true" data-theme="b" href="http://www.<%= domainName%>/?invitation=<%= InvitationCode%>">Register, It's Free</a> </div>
						</div> <!--  close <div class="loginFrameTable"> -->
				</div> <!--  close <div class="loginFrame"> -->
					
				<div class="smartPhoneLoginFooter" onclick="window.open('http://resource.successfulthinkersnetwork.com/index.php/mobile-app-resource/', '_blank', 'location=yes');">
					About the Successful Thinkers Mobile App
				</div>
					
			</div> <!--  close <div class="loginDiv"> -->
			
			
		</div> <!--  close ContentSection -->

			<div data-role="footer" data-position="fixed">
				 <ul class="static-footer">
				 	<li><a href="<%= aboutUrl %>">About</a></li>
				 	<li><a href="<%= privacyPolicyUrl %>" target="_blank">Privacy Policy</a></li>
				 	<li><a href="<%= termsOfUseUrl%>" target="_blank">Terms of Use</a></li>
				 	<li><a href="http://www.referralwire.com" target="_blank">Powered by ReferralWire</a></li>
				 </ul>
			</div>	
						
			<div class="demoUserList" style="display:none"></div>
			<div class="overlay-foreground upsertContainer" id="upsertRecord" style="display:none"></div>
			<div id="pickBackground" style="display:none"></div>   	
			<div id="PopupContainer" class="popupApplet" style="display:none"></div>	    
			<div class="overlay-background" style="display:none"></div>
			<div id="ErrorMsgContainer" class="popupApplet" style="display:none"></div>	    
			<div id="EulaContainer" class="Eula" style="display:none"></div>	    
			<div id="FYIContainer" class="FYI" style="display:none"></div>	    
	</div>
	<% if (OStype == OperatingSystem.iOS4_IPHONE || 
		OStype == OperatingSystem.iOS5_IPHONE || 
			OStype == OperatingSystem.iOS6_IPHONE || 
				OStype == OperatingSystem.MAC_OS_X_IPHONE ) { System.out.println("IPHONE"); %>
        <script>
			var phoneapp = {
					client : 'phone'
			}
        </script>
	<% } else if (OStype == OperatingSystem.ANDROID1 || 
			OStype == OperatingSystem.ANDROID2 || 
					OStype == OperatingSystem.ANDROID4 ) { System.out.println("ANDROID"); %>
        <script>
			var phoneapp = {
					client : 'phone'
			}
        </script>
	<% } else { %>
		<script>	
			var phoneapp = {
					client : 'web'
			}
		</script>
	<% } %>	        

</body>

<script type="text/javascript">


window.onload = function ()
{
	$.when(jqmReady).done(function() {

		requirejs([
		           'RWAuth'
		         ], function(RWAuth){
		  		 var app = new RWAuth.Router(
		  				{ params: { modules: ['#HeaderSection', '#ContentSection', '#FooterSection'] }, 
		  				  homepage : '<%= homepage%>',
		  				  tenant :  '<%= tenant%>',
		  				  AppVer :  '<%= AppVer%>',
		  				  OStype :  '<%= OSName%>',
		  				  baseUrl : '<%= baseUrl%>'
		  				});
		  	    
		  	    window.rwApp = app;
		  	    Backbone.history.start();
		  	    if (!_.isUndefined(navigator)){
		  	    	// navigator.splashscreen.hide();	
		  	    }
		  	  	
		  	  	var browserName = "<%= browserName%>";
		  	  	var OSName = "<%= OSName%>";

		  	  	// Load ZenDesk Widget
		  	  	if ( phoneapp.client == 'web') {
					$.getScript("//assets.zendesk.com/external/zenbox/v2.6/zenbox.js", function success() {
					  if (typeof(Zenbox) !== "undefined") {
			    		Zenbox.init({
					      dropboxID:   "20252143",
					      url:         "https://successulthinkers.zendesk.com",
					      tabTooltip:  "Support",
					      tabImageURL: "https://assets.zendesk.com/external/zenbox/images/tab_support_right.png",
					      tabColor:    "#E2971F",
					      tabPosition: "Right"
			    		});
			  		}
    				}); 
				}
		});

	});
}

$("#dismissErrorMsg").live("click",function(){
	$("#pickBackground").hide(50);
	$('#ErrorMsgBox').hide(250);
	
});

$("#lnProfileBtn").live("click",function(){
	window.rwApp.regLNProfile();
});

$("#fbProfileBtn").live("click",function(){
	window.rwApp.regFBProfile();
});

$(".contextHelpLink").live("click",function(){
	var target = $(this).attr("pTarget");
	window.location = target;
});

$(".tooltip a.ui-collapsible-heading-toggle").live("mouseenter",function(){

	showHelp(this);
});

$(".tooltip a.ui-collapsible-heading-toggle").live("mouseleave",
		  function () {

			  $(this).find("div.custom").remove()
				
			}	  

		);
	
$("span.tooltip").live("mouseenter",function(){showHelp(this);});

$("span.tooltip").live("mouseleave",function(){$(this).find("div.custom").remove();});

function preLogin(){
	rwApp.login();
}



</script>

</html>
