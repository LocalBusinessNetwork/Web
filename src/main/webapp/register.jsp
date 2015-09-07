
<%@ page import="java.util.Map,java.util.ResourceBundle,java.util.Locale,org.json.JSONObject,com.rw.API.SecMgr,com.rw.persistence.JedisMT, eu.bitwalker.useragentutils.UserAgent,eu.bitwalker.useragentutils.OperatingSystem, eu.bitwalker.useragentutils.Browser, eu.bitwalker.useragentutils.DeviceType" %>
<%
// uncomment this line for maintenance mode
// response.sendRedirect("/maintenance.html");

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
if (tenant == null ) {
	response.sendError(HttpServletResponse.SC_NOT_FOUND);
	return;
}

request.getSession(true).setAttribute("Tenant.Id", tenant);

//Get the invitation IS
String invitationId = request.getParameter("invitation");

// No invitation id? We should take them to marketing page.
if ( (invitationId == null) || invitationId.length() == 0 ) {
	response.sendRedirect("/expired.html"); 
	return;
}

sm.setExecutionContextItem("tenant", tenant);

// Look for invitaiotn ID
JedisMT jedisMt = new JedisMT(tenant);
		
String invitationEnvelope = jedisMt.get(invitationId);	

if ( invitationEnvelope == null ) {  // User clicked on the invitation link second time
	data = new JSONObject();
	String loginEmail =	sm.findInvitation(invitationId);
	
	if (  loginEmail != null ) { // Use has already registered, let us find out his login and send him to login page.
		response.sendRedirect("/login.jsp?loginEmail=" + loginEmail );
		return;
	}		
	else {
		// Invitation expired.
		response.sendRedirect("/expired.html"); 
		return;
	}
}

JSONObject invitationDetails = new JSONObject(invitationEnvelope);
String invitationType = invitationDetails.get("invitationType").toString();

String to_emailAddress = "";
String to_firstName = "";
String to_lastName = "";

String fromFullName = invitationDetails.get("fromFullName").toString();;

if ( !invitationType.equals("OI") ) {
	try {
		to_emailAddress = invitationDetails.get("to_emailAddress").toString();
		to_firstName = invitationDetails.get("to_firstName").toString() ;
		to_lastName = invitationDetails.get("to_lastName").toString();
	}
	catch(Exception e) {
		// just ingore any missing last or firstname
		System.out.println(e);
	}
}

// handle the case of multiple envitations to the same person.
if ( to_emailAddress != null ) {
	if ( sm.findUser(to_emailAddress) ) { 		
		// User has already registered, let us find out his login and send him to login page.
		response.sendRedirect("/login.jsp?loginEmail=" + to_emailAddress );
		return;
	}
}

// Start the registration process.

String to_gender = "MALE";
	
String formFactorStyle = "web";
String viewport = "<meta name='viewport' content='width=device-width, initial-scale=1'> ";

String uaString = request.getHeader("User-Agent");
String browserName = "OTHERBROWSER";
OperatingSystem OStype = OperatingSystem.UNKNOWN;

if ( uaString != null ) {
	UserAgent ua = UserAgent.parseUserAgentString(uaString); 
	Browser b = ua.getBrowser().getGroup();
	if (b == Browser.SAFARI){browserName = "SAFARI";}
	if (b == Browser.FIREFOX){browserName = "FIREFOX";}
	if (b == Browser.CHROME){browserName = "CHROME";}
	if (b == Browser.IE){browserName = "IE";}
	OStype = ua.getOperatingSystem();
}

// PETER...PETER...PETER...PETER...PETER...PETER...
// For Debugging the mobile code on browser, uncomment one of the lines below 
//OperatingSystem OStype = OperatingSystem.MAC_OS_X_IPHONE;
//OperatingSystem OStype = OperatingSystem.ANDROID4;

System.out.println("Register:" + browserName);
System.out.println("Register:" + OStype);

String OSName = "DeskTop";

if ( OStype == OperatingSystem.iOS4_IPHONE || 
		OStype == OperatingSystem.iOS5_IPHONE || 
			OStype == OperatingSystem.iOS6_IPHONE || 
							OStype == OperatingSystem.MAC_OS_X_IPHONE){
	OSName = "IOS";	
	formFactorStyle = "smartPhone";
	viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";

} 

else if ( OStype == OperatingSystem.ANDROID1 || 
					OStype == OperatingSystem.ANDROID2 || 
							OStype == OperatingSystem.ANDROID4 ){
	OSName = "Android";	
	formFactorStyle = "smartPhone";
	viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";

} 

String CDN = ResourceBundle.getBundle("referralwire", new Locale("en", "US")).getString("S3ROOT.codeCDN");        

String homepage = tenantObj.getString("homepage");
String domainName = tenantObj.getString("domainName");
String rootUrl = tenantObj.getString("rootUrl");
String tenantLogo = tenantObj.getString("tenantLogo");
String AppVer = tenantObj.getString("ver");
String FaceBookAppId = tenantObj.getString("FaceBookAppId");
String LinkedInAppId = tenantObj.getString("LinkedInAppId");
String loginDisplayName = tenantObj.getString("loginDisplayName");
String tagLine = tenantObj.getString("tagLine");
String splashImage = tenantObj.getString("splashImage");
String pageTitle = tenantObj.getString("pageTitle");
String TrackingID = tenantObj.has("GoogleAnalyticsPropertyCode")?tenantObj.getString("GoogleAnalyticsPropertyCode"):"UA-40902707-2";

String privacyPolicyUrl = CDN + "/" + tenant + "/Templates/Other/STN_PrivacyPolicy.html";
String termsOfUseUrl = CDN + "/" + tenant + "/Templates/Other/STN_TermsOfUseSR.html";
String aboutUrl = "http://www." + domainName ;

%>

<!DOCTYPE html> 
<html> 
<head> 
<title><%= pageTitle %></title> 
<%= viewport %>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<META HTTP-EQUIV="EXPIRES" CONTENT="Mon, 21 Oct 2013 12:30:59 GMT">
<link rel="shortcut icon" href="<%= CDN%>/<%= tenant%>/favicon<%= tenant%>.ico" />
<link rel="stylesheet" href="<%= CDN%>/style/jquery.mobile-1.3.1.css" />
<link rel="stylesheet" href="//assets.zendesk.com/external/zenbox/v2.6/zenbox.css" />

<link rel="stylesheet" href="/style/<%= tenant%>_style.css" />

<script>
    var rwFB = { CDN : "<%= CDN%>"} ;
</script>

<script type="text/javascript"  data-main="/js/main" src="<%= CDN%>/js/require-jquery.min.js"></script>
<script type="text/javascript"  src="<%= CDN%>/js/jquery.cookie.min.js"></script>
<script type="text/javascript"  src="/js/jqmconfig.js"></script>


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

<body class="<%= formFactorStyle%> <%= browserName%>" style="overflow-y:scroll" >
<div id="fb-root"></div>
<script>
	rwFB.tenant = '<%= tenant%>';
	rwFB.rwTenantName = '<%= domainName%>';
	rwFB.rwTenantURL = '<%= rootUrl%>';
	rwFB.rwTenantLogo = '<%= tenantLogo%>'; 
	rwFB.rwTenantInvitation = 'This is an invitation';
	rwFB.OSType = '<%= OStype%>';
</script>
<!--  Page 1 Login  -->
<table> <tr><td align="center">
		<div data-role="page" id="singlePageWeb" id="login" style="background-color: #466bb0;positon:absolute">
		
	       <div id="ContentSection" data-role="content" style="background-color: #466bb0;overflow-y:scroll"> 
			<!-- POST TO THE SAME PAGE -->
				
					
					<div style="width: 320px; margin: auto;"><img src="/STN/Images/emails/email-header_invitation.jpg" width="300" height="50" alt=""/></div>
				
					
					<form id="registerForm"  action="javascript:rwApp.register()">
			 			<div class="loginbox" style="width:320px;">

				 			<div class="registerField" style="margin-left:10px;margin-top:5px"> 
				 				<label id="emailLabel" for="email"><h1>Login Email</h1></label> 
								<div class="register-field-input" style="margin-left:-18px">
								<input type="email" name="login" id="login" value="" placeholder="Valid login email - required" required onchange="javascript:rwApp.checkLoginExists($('#login'));"/>
								</div>
							</div>
							<div class="registerField" style="margin-left:10px"> 
				 				<label for="password"><h1>Password</h1></label>  
								<div class="register-field-input" style="margin-left:-18px">
								 	<input type="password" name="password" id="password" value="" placeholder="Password - 6 letters minimum - required" required/>
								</div>
							</div>
							<div class="registerField" style="margin-left:10px"> 
								<div class="register-field-input" style="margin-left:-18px">
								 	<input type="text" name="firstName" id="firstName" value="" placeholder="First Name - required" required/>
								 	<input type="text" name="lastName" id="lastName" value="" placeholder="Last Name - required" required/>
								 	<input type="text" name="postalCode" id="postalCode" value="" placeholder="Zip Code"/>
								</div>
							</div>
												
							<div class="registerField center" style="margin-top:5px;margin-left:20px;margin-right:20px;size:6pt">By clicking Join Now, you agree to Successful Thinkers Network's <a id="tol" href="<%= termsOfUseUrl%>" data-ajax="false" data-mini="true" data-inline="true" data-theme="b" target="_blank">Terms Of Use, Privacy Policy and Cookie Policy.</a></div> 

							<div style="width: 200px; margin: 10px auto 10px;"><a style="display:block; color: #FFF; background-color: #e39720; border-radius: 5px; -moz-border-radius: 5px; font-size: 18px; line-height: 50px; width: 200px; height: 50px; text-align: center; text-decoration: none" href="javascript:rwApp.register()">JOIN NOW</a></div>

							<div class="registerField center">Invited by&nbsp;:&nbsp;<%= fromFullName%></div> 
						</div> <!-- end loginbox -->
						<input type="hidden" id="invitationId" name="invitationId" value="test"/> 
						<div style="margin-left:-1000px;position:absolute"><input type="submit"/></div>

						<div style="width: 290px;margin-top: 30px; padding:15px; background-color: #FFF; text-align: left; color: #818181; font-size: 12px; line-height: 20px; border-radius: 8px; -moz-border-radius: 8px;">
						<div><img src="/STN/Images/emails/need-help.png" alt="Need Help?"/></div>
						<p>If you need any help, be sure to visit our help system for videos that take you step-by-step through the process.</p>
					    <p>If you experience any difficulties accessing your account or features of the STN Connect software do not appear to be functioning properly, please do not hesitate to reach out to our support team via a troubleticket on the help site, or by emailing:</p>
					    <p><a href="mailto:support@successfulthinkersnetwork.com" style="color: #000; text-decoration:none;"><strong>support@successfulthinkersnetwork.com</strong></a></p>
						<div style="width: 290px; margin-left:35px;"><a style="display:block; color: #FFF; background-color: #e39720; border-radius: 5px; -moz-border-radius: 5px; font-size: 18px; line-height: 70px; width: 200px; height: 50px; text-align: center; text-decoration: none" href="http://help.successfulthinkersnetwork.com/" target="_blank">STN HELP SITE</a></div>
						</div>

					</form>
					
			
	
			<div class="overlay-foreground upsertContainer" id="upsertRecord" style="display:none"></div>
			<div id="pickBackground" style="display:none"></div>   	
			<div id="PopupContainer" class="popupApplet" style="display:none"></div>	    
			<div class="overlay-background" style="display:none"></div>
			<div id="ErrorMsgContainer" class="popupApplet" style="display:none"></div>	    
			<div id="EulaContainer" class="Eula" style="display:none"></div>	    
			<div id="FYIContainer" class="FYI" style="display:none"></div>	    
	</div>

</td></tr></table>	

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
			var pgReady = $.Deferred();
			var phoneapp = {
					client : 'web'
			}
			pgReady.resolve();
		</script>
	<% } %>	        

<script type="text/javascript">

window.onload = function ()
{	
	$.when(jqmReady).done(function() {

		requirejs([
	           'RWAuth'
	         ], function(RWAuth){

	  		 var app = new RWAuth.Router(
	  				{ params: { modules: ['#HeaderSection', '#ContentSection', '#FooterSection'] }, 
	  				  browserParams:'',
	  				  homepage : '<%= homepage%>',
	  				  tenant :  '<%= tenant%>',
	  				  AppVer :  '<%= AppVer%>',
	  				  OStype :  '<%= OSName%>'
	  				}); 	    
	  	    window.rwApp = app;

	        $('#registerForm #login').val("<%= to_emailAddress%>");
		  	$('#registerForm #firstName').val("<%= to_firstName%>"); 
	  		$('#registerForm #lastName').val( "<%= to_lastName%>"); 
		  	$('#registerForm #invitationId').val("<%= invitationId%>"); 
			$('#registerDiv').show(0);
	  	    Backbone.history.start();

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

</script>

</body>

</html>