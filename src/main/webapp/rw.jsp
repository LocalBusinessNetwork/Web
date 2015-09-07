<META HTTP-EQUIV="EXPIRES" CONTENT="Mon, 21 Oct 2013 12:30:59 GMT">
<%@ page import="java.util.Map,java.net.URLEncoder,java.util.ResourceBundle,java.util.Locale,org.json.JSONObject,com.rw.API.SecMgr,com.rw.API.UserMgr,com.rw.common.GoogleAnalytics,eu.bitwalker.useragentutils.UserAgent,eu.bitwalker.useragentutils.OperatingSystem, eu.bitwalker.useragentutils.Browser,eu.bitwalker.useragentutils.DeviceType" %>
<%

// uncomment this line for maintenance mode
// response.sendRedirect("/maintenance.html");

String redirectHash = request.getParameter("redirectHash") == null ? "home" : request.getParameter("redirectHash");
String loginEmailStr = request.getParameter("loginEmail")  == null ? "" : request.getParameter("loginEmail");

System.out.println("redirectHash : " + redirectHash);

String userid = (String) request.getSession(false).getAttribute("User.Id");

System.out.println("PathInfo =" + request.getQueryString());

if (userid == null || userid.isEmpty() ) {

	response.sendRedirect("/login.jsp?redirectHash=" + redirectHash + ( (loginEmailStr == null ) ? "" : ("&loginEmail=" + loginEmailStr) ) );
	return;
}


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

sm.setExecutionContextItem("userid", userid);
sm.setExecutionContextItem("tenant", tenant);


String routerSubClass = "";
String formFactorStyle = "web";
String viewport = "<meta name='viewport' content='width=device-width, initial-scale=1'> ";

String uaString = request.getHeader("User-Agent");
UserAgent ua = UserAgent.parseUserAgentString(uaString); 



String browserName = "OTHERBROWSER";
String OSName = "";
String OSVersion = "";
OperatingSystem OStype = OperatingSystem.UNKNOWN;

if ( uaString != null ) {
	Browser b = ua.getBrowser().getGroup();
	if (b == Browser.SAFARI){browserName = "SAFARI";}
	if (b == Browser.FIREFOX){browserName = "FIREFOX";}
	if (b == Browser.CHROME){browserName = "CHROME";}
	if (b == Browser.IE){browserName = "IE";}
	OStype = ua.getOperatingSystem();
}

// PETER...PETER...PETER...PETER...PETER...PETER...
// STEP1: For Debugging the mobile code on browser, uncomment one of the lines below 
// OStype = OperatingSystem.MAC_OS_X_IPHONE;
// OStype = OperatingSystem.ANDROID4;

System.out.println("Home:" + browserName);
System.out.println("Home:" + OStype);

		if ( OStype == OperatingSystem.iOS4_IPHONE){OSName = "iOS";OSVersion = "4";}
		if ( OStype == OperatingSystem.iOS5_IPHONE){OSName = "iOS";OSVersion = "5";}
		if ( OStype == OperatingSystem.iOS6_IPHONE){OSName = "iOS";OSVersion = "6";}
		if ( OStype == OperatingSystem.MAC_OS_X_IPHONE){OSName = "iOS";OSVersion = "7";}
		if ( OStype == OperatingSystem.ANDROID1){OSName = "Android";OSVersion = "1";}
		if ( OStype == OperatingSystem.ANDROID2){OSName = "Android";OSVersion = "2";}
		if ( OStype == OperatingSystem.ANDROID4){OSName = "Android";OSVersion = "$";}

/*
if ( OStype == OperatingSystem.iOS4_IPHONE || 
		OStype == OperatingSystem.iOS5_IPHONE || 
			OStype == OperatingSystem.iOS6_IPHONE || 
				OStype == OperatingSystem.ANDROID1 || 
					OStype == OperatingSystem.ANDROID2 || 
							OStype == OperatingSystem.ANDROID4 || 
								OStype == OperatingSystem.MAC_OS_X_IPHONE){
				formFactorStyle = "smartPhone";
	        	routerSubClass = "Phone";
				viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";
} 
*/
		if ( OStype == OperatingSystem.iOS4_IPHONE || 
		OStype == OperatingSystem.iOS5_IPHONE || 
			OStype == OperatingSystem.iOS6_IPHONE) {
								formFactorStyle = "smartPhone";
								routerSubClass = "Phone";
								//viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";
								//viewport = "<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi'/>";
								viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";
		} 
		else if (OStype == OperatingSystem.MAC_OS_X_IPHONE) {
				formFactorStyle = "smartPhone";
				routerSubClass = "Phone";
				//viewport = "<meta name='viewport' content='width=device-width,  height=device-height, initial-scale=1, user-scalable=no'>";
				viewport = "<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi, user-scalable=no' />";
		}
		else if ( OStype == OperatingSystem.ANDROID1 || 
					OStype == OperatingSystem.ANDROID2 || 
							OStype == OperatingSystem.ANDROID4 ){
							formFactorStyle = "smartPhone";
							routerSubClass = "Phone";
							//viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";
							//viewport = "<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi' />";
							viewport = "<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0,user-scalable=no' />";
		
		}


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

UserMgr um = new UserMgr();
um.cloneExecutionContext(sm);

data = new JSONObject();
data.put("act", "read");
JSONObject userObj = new JSONObject(um.handleRequest(data).getString("data"));
String  OrgId = (userObj.has("OrgId"))?userObj.getString("OrgId"):"";
String  powerpartner1 = (userObj.has("powerpartner1"))?userObj.getString("powerpartner1"):"";
String  profession = (userObj.has("profession"))?userObj.getString("profession"):"";
String  uId = userObj.getJSONObject("_id").getString("$oid");
String employerId = (userObj.has("employerId"))?userObj.getString("employerId"):"";
Long memberProfileScore = (userObj.has("memberProfileScore"))?userObj.getLong("memberProfileScore"):0;
Long memberRankScore = (userObj.has("memberRankScore"))?userObj.getLong("memberRankScore"):0;
String emailAddress = userObj.getString("emailAddress");
String isAmbassador = userObj.has("isAmbassador") ? userObj.getString("isAmbassador"):"no";
String isSpeaker = userObj.has("isSpeaker") ? userObj.getString("isSpeaker"):"no";
String fullName = userObj.getString("fullName");
String business = userObj.has("business") ? userObj.getString("business"):"";
String jobTitle = userObj.has("jobTitle") ? userObj.getString("jobTitle"):"";
String postalCode = userObj.has("postalCodeAddress_work") ? userObj.getString("postalCodeAddress_work"):"";
String street = userObj.has("streetAddress1_work") ? userObj.getString("streetAddress1_work"):"";
String city = userObj.has("cityAddress_work") ? userObj.getString("cityAddress_work"):"";
String state = userObj.has("stateAddress_work") ? userObj.getString("stateAddress_work"):"";
String photoUrl = userObj.has("photoUrl") ? userObj.getString("photoUrl"):"/images/icons/User.png";

String InvitationCode = userObj.has("InvitationCode") ? userObj.getString("InvitationCode"):"";

String showWelcomePage = (String) session.getAttribute( userid + ".showWelcomePage");

if ( showWelcomePage == null ) {
	showWelcomePage = userObj.has("welcomePage") ? userObj.getString("welcomePage"):"SHOW";
}

String CDN = ResourceBundle.getBundle("referralwire", new Locale("en", "US")).getString("S3ROOT.codeCDN");        
String ImageCDN = ResourceBundle.getBundle("referralwire", new Locale("en", "US")).getString("S3ROOT." + System.getProperty("PARAM5") );        

System.out.println("CDN:" + CDN);
System.out.println("ImageCDN:" + ImageCDN);

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
<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- <link rel="shortcut icon" href="favicon.ico" /> -->
<link rel="shortcut icon" href="<%= CDN%>/<%= tenant%>/favicon<%= tenant%>.ico" />
<!-- link rel="stylesheet" href="/style/jquery-ui-1.10.3.custom.css" / -->
<link rel="stylesheet" href="<%= CDN%>/style/jquery-ui-1.10.3.custom.min.css" />
<link rel="stylesheet" href="<%= CDN%>/style/jquery.mobile-1.3.1.css" />
<link rel="stylesheet" href="<%= CDN%>/style/timepicker.css" />
<link rel="stylesheet" href="//assets.zendesk.com/external/zenbox/v2.6/zenbox.css" />

<!-- <link rel="stylesheet" href="/style/ss_style.css" /> -->
<!-- <link rel="stylesheet" href="<%= CDN%>/style/<%= tenant%>_style.css" /> -->
<link rel="stylesheet" href="/<%= tenant%>/<%= tenant%>_style.css" />
<!-- link rel="stylesheet" href="<%= CDN%>/<%= tenant%>/stn.css" / -->
<link rel="stylesheet" href="https://resource.successfulthinkersnetwork.com/stn-member/stn.css" />



<!--   
<script type="text<META HTTP-EQUIV="EXPIRES" CONTENT="Mon, 21 Oct 2013 12:30:59 GMT">ript>
  --> 
<script>
    var rwFB = { CDN : "<%= CDN%>", ImageCDN : "<%= ImageCDN%>" } ;
</script>

<script type="text/javascript"  data-main="/js/main" src="<%= CDN%>/js/require-jquery.min.js"></script>
<!-- <script type="text/javascript"  data-main="/js/main" src="/js/require.js"></script>-->
<!-- require.js is minified; jquery.js is version v1.10.2, is minified and is automatically included by require.js -->
<script type="text/javascript"  src="<%= CDN%>/js/controlLib/highCharts/highcharts.js"></script>
<script type="text/javascript"  src="<%= CDN%>/js/controlLib/highCharts/highcharts-more.js"></script>
<script type="text/javascript"  src="<%= CDN%>/js/controlLib/highCharts/exporting.js"></script>
 
<script type="text/javascript" src="//maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/javascript" src="<%= CDN%>/js/controlLib/gmap3/gmap3.min.js"></script>
<script type="text/javascript" src="<%= CDN%>/js/jquery.cookie.min.js"></script>

<script type="text/javascript" src="<%= CDN%>/js/jqmconfig.js"></script>
<script type="text/javascript" src="<%= CDN%>/js/jquery.hoverIntent.minified.js"></script>
<script type="text/javascript" src="<%= CDN%>/js/jquery-ui-1.10.3.custom.min.js"></script>
<script type="text/javascript" src="<%= CDN%>/js/timepicker.min.js"></script>

<script>

	var jqmReady = $.Deferred();

	requirejs(['<%= CDN%>/js/jquery.mobile-1.3.1.min.js'], function(jquerymobile) {
		jqmReady.resolve();
	});

	requirejs(['rwutils.min'], function(rwutils) {});
	requirejs(['rwapi.min'], function(rwapi) {});
	//requirejs(['rwapi'], function(rwapi) {});
	requirejs(['<%= CDN%>/js/dateformatter.min.js'], function(df) {});

// Start collecting pageview stats

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	ga('create', "<%= TrackingID%>", "<%= domainName%>");
	ga('send', 'pageview');

</script>

<!--  enable for production
<script src="https://apis.google.com/js/client.js?onload=$.g_load"></script>
 -->

</head>

<body style="overflow:hidden; overflow-y:scroll" class="<%= formFactorStyle%> <%= browserName%> <%= OSName%> version<%= OSVersion%>">
<div id="fb-root"></div>

<audio id="ding">
<source src="/media/ding.mp3"></source>
</audio>

<script>
    rwFB.rwTenantDisplayName = "<%= tenantObj.get("loginDisplayName")%>"; 
	rwFB.tenant = "<%= tenant%>";
	rwFB.rwTenantName = "<%= domainName%>";
	rwFB.rwTenantURL = "<%= rootUrl%>";
	rwFB.rwTenantLogo = "<%= tenantLogo%>"; 
	rwFB.rwTenantInvitation = "I'd really like to connect with you through" + "<%= tenantObj.get("loginDisplayName")%>" + ".  Here's a registration link:";
	rwFB.iconDirectory = rwFB.CDN + "/STN/Images/"; // this need to be tenant enabled.
	rwFB.HeaderName = rwFB.rwTenantDisplayName;
	rwFB.rwAppId = "<%= FaceBookAppId%>";  
	rwFB.rwChannelUrl = "<%= rootUrl%>";
	rwFB.geoLocationWatchID = null;
	rwFB.geoLocation = null;
	rwFB.geoLocationErrorCode = null;
	rwFB.fbUserID = null;
	rwFB.lnUserID = null;
	rwFB.FBInit = false;
	rwFB.routes = null;
	rwFB.fbAccessToken = null;
	rwFB.LinkedInAppId = "<%= LinkedInAppId%>";
	
	rwFB.OrgId = "<%= OrgId %>";
	rwFB.powerpartner1 = "<%= powerpartner1 %>";
	rwFB.profession = "<%= profession %>";
	rwFB.employerId = "<%= employerId %>";
	rwFB.memberProfileScore = "<%= memberProfileScore %>";
	rwFB.memberRankScore = "<%= memberRankScore %>";
	rwFB.uId = "<%= uId %>";
	rwFB.emailAddress = "<%= emailAddress %>";
	rwFB.isAmbassador = "<%= isAmbassador %>";
	rwFB.isSpeaker = "<%= isSpeaker %>";
	rwFB.fullName = "<%= fullName %>";
	rwFB.photoUrl = "<%= photoUrl %>";
	rwFB.business = "<%= business %>";
	rwFB.jobTitle = "<%= jobTitle %>";
	rwFB.postalCode =  "<%= postalCode %>";
	rwFB.street =  "<%= street %>";
	rwFB.city =  "<%= city %>";
	rwFB.state =  "<%= state %>";
	rwFB.showWelComePage = "<%= showWelcomePage %>"; 
	rwFB.OSName = "<%= OSName %>";
	rwFB.OSVersion = "<%= OSVersion %>";
	rwFB.InvitationCode = "<%= InvitationCode%>";
	rwFB.InvitationLink = "http://www.<%= domainName%>?invitation=<%= InvitationCode%>"; // this is production
	// rwFB.InvitationLink = "<%= rootUrl%>/register.jsp?invitation=<%= InvitationCode%>";// this for testing/staging
	rwFB.formFactorStyle = "<%= formFactorStyle%>" + "." + "<%= OSName%>" + ".web";
	rwFB.loginUrl = "/login.jsp";

</script>

<% 
session.setAttribute(userid + ".showWelcomePage","HIDE");
%>
<!--  Page 1 Login  -->
	<div data-role="page" id="singlePageWeb" class="rwContainer" style="position:absolute;">
			
			<div data-role="panel" id="left-panel"  data-theme="a" client="web" data-display="reveal">				
			</div>

			<div data-role="panel" id="right-panel" data-position="right" data-theme="a" client="web">
			</div>

			<div id="frame" data-role="content" style="position:absolute;right: 0;left: 0;top: 0;bottom: 0;" class="catalog">	
			</div><!--frame-->
			
			<div id="ContentSectionOuter" data-role="content" style="position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;min-height:initial"> 
	        <!--  <div style="font-size:50pt;position:absolute;top:40%;margin-left:10%"><%= domainName%> coming up..</div> -->
				<div id="ContentSection" data-role="content" style="position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;min-height:initial"></div> 
		        <!--  <div style="font-size:50pt;position:absolute;top:40%;margin-left:10%"><%= domainName%> coming up..</div> -->
			</div>

						
			<div class="demoUserList" style="display:none"></div>
			
			<div class="print-foreground" id="printPage" style="display:none">
			</div>
			<div class="overlay-foreground upsertContainer" id="upsertRecord" style="display:none">
			</div>
			
			<div class="overlay-background" style="display:none">
			</div>
			<div id="picklistContainer" style="display:none;overflow-x:hidden" >
				<div id="pickMode">
					<div style="right: 5px;left: 5px;position: absolute;top: 0;height: 50px;color: white;">
						
						<div class="picklistheader">
							<div id="cancelPick" class="pickbutton-left button">Cancel</div>
							<div id="pickTitle">Pick</div>
						</div>
					</div>
					<div id="pickListContents"  class="listViewListContainer">
					</div>
				</div>
				<!-- <div class="showHiddenBookmarks"><label><input id="showHiddenBookMarksCheck" type="checkbox">Show Hidden Filters</label></div> -->
				<div id="pickCreateMode" class="upsertContainer" style="position:absolute;top:0;bottom:0;left:500px;width:400px;display:none">
					
				</div>
			</div>   
			<div id="pickBackground" style="display:none">
			</div>   	
			<div id="PopupContainer" class="popupApplet" style="display:none">
			</div>
			<div id="ErrorMsgContainer" class="popupApplet" style="display:none">
			</div>	    
			<div id="EulaContainer" class="Eula" style="display:none">
			</div>	    
			<div id="FYIContainer" class="FYI" style="display:none">
			</div>	    
			<div id="rwSpinner" style="position:absolute;display:none">
				 <img height='30' width='30' src='/images/ajax-loader.gif'/>
      		</div>	    

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

var linkedInReady = $.Deferred();
var facebookReady = $.Deferred();
var googleplusReady = $.Deferred();
var twitterReady = $.Deferred();
var helloReady = $.Deferred();

function OnlinkedReady() {
	linkedInReady.resolve();
}


window.onload = function ()
{
	$.when(jqmReady).done(function() {

	$.mobile.loading( 'show', {
		text: rwFB.rwTenantName,
		textVisible: true,
		theme: 'b',
		html: ""
	});
	
	requirejs([
           '<%= tenant%>'
         ], function(ReferralWire<%= tenant%>){
  		 var app = new ReferralWire<%= tenant%>.<%=routerSubClass%>Router(
  				{ params: { modules: ['#HeaderSection', '#ContentSection', '#FooterSection'] }, 
  				  homepage : '<%= homepage%>',
  				  tenant :  '<%= tenant%>',
  				  AppVer :  '<%= AppVer%>'
	  			});
  	    
  	    window.rwApp = app;
  	    window.rwObjectCache = {};

		Backbone.history.start();
		if( $.hasVal(window.location.hash) )
			app.navigate(window.location.hash, {trigger:true, replace:true});
		else 
			app.navigate('#home', {trigger:true, replace:true});
  		    
	  	if ('<%= routerSubClass %>' != 'Phone'){
	  		$("#left-panel").html(_.template('STN_WebNavPanel')).trigger("create");
	  	} 		  	
  	    
	    $.mobile.loading( 'hide');

  	    //$("#left-panel").html(_.template('STN_WebNavPanel')).trigger("create");
  	    //PT: Putting this here keeps the menu from disappearing if the user refreshes in "mid-app"
  	    //Need to tenant-enable this.  Sudhakar: apart from DemoSetup (and mongo) I'm not sure
  	    //where you administer all the tenant variables. 
  	    
  	      


  	    if ( phoneapp.client == 'web') {
  	    		
  	    /*
  	    $.getScript('/js/hello.js', function(){
     			hello.init({ 
				meetup : 'euioujldhprrbn41s6m61r1es9',
				facebook  : rwFB.rwAppId,
				linkedin : rwFB.LinkedInAppId
				},{ redirect_uri:'http://successfuthinkersnetwork.com' });

			hello.on('auth.login', function(auth){
				hello( auth.network ).api( '/me' ).success(function(r){
						alert("hello logged in");
					});
 			});

     			helloReady.resolve();
   		});
		*/

		$.getScript("//platform.linkedin.com/in.js?async=true", function success() {
			IN.init({
			    onLoad: 'OnlinkedReady',
				api_key: rwFB.LinkedInAppId,
				scope: 'r_fullprofile r_emailaddress r_network r_contactinfo w_messages',
				authorize: true,
				credentials_cookie: true,
				credentials_cookie_crc: true
			});
   		}); 	
   		$.getScript('//connect.facebook.net/en_US/all.js', function(){
   			try {
				FB.init({
				    appId      : rwFB.rwAppId,
				    channelUrl : rwFB.rwChannelUrl,
				    status     : false,                                 // Check Facebook Login status
				    xfbml      : true
				});

				facebookReady.resolve();
			}
			catch(e) {
				facebookReady.reject(e.message);
			}
		});

		window.___gcfg = {
       			lang: 'en-US'
     		};

     		$.getScript('//apis.google.com/js/plusone.js', function(){
     			googleplusReady.resolve();
   		});
   		
   		$.getScript('//platform.twitter.com/widgets.js', function(){
     			twitterReady.resolve();
   		});

   		// Load ZenDesk Widget
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



	
window.onhashchange = function () {
	var loc = window.location.hash;

	if (loc.indexOf("_admin") > -1){
		$("#singlePageWeb").addClass("adminPage");
    } else {
    	$("#singlePageWeb").removeClass("adminPage");
    }
}	


$(".menuLaunch").live("click",function(){

	$(".subMenus").hide(0);
	$("img.menuToggle").attr("src","images/icons/expandIconWhite.png");
	$("#left-panel").panel( "open" , null);
});

$("#menuIcon").live("click",function(){
	$(".subMenus").hide(0);
	$("img.menuToggle").attr("src","images/icons/expandIconWhite.png");
	$("#left-panel").panel( "open" , null);
});

/*
$("#left-panel").live("mouseleave",function(){
	$("#left-panel").panel( "close" , null);
	
});
*/

$("#closeFix").live("click",function(event){
	rwApp.closeStandardDialog();
});

$("#closeLeftMenu").live("click",function(event){
	
	$("#left-panel").panel( "close");	
	$("#singlePageWeb").css("min-height","");
});

if (rwFB.OSName == "Android"){
	document.addEventListener("showkeyboard", function() {
		rwApp.frameHeight = $("#singlePageWeb").height();
	}, false);
	document.addEventListener("hidekeyboard", function() {
		$("#singlePageWeb").css("min-height",rwApp.frameHeight);
	}, false);
}

$("div.closeContextMenu").live("click",function(event){
	
	$("#right-panel").panel( "close");	
	$("#singlePageWeb").css("min-height","");
});

$(".homeMenu.action").live("click",function(event){
	if (event.target.className == 'homeMenu action'){
		elem = $(event.target);
	} else {
		var elem = $(event.target).parent('.homeMenu');
	}
	var route = elem.attr('route');
	window.location = route;
	
});


$(".menuItemDetail.refer").live("click",function(event){
	
	  event.dView = null;
	  event.refWizard = rwApp.ContactRefWizard_phoneHomeRefWizard();
	  var refreshFunctionStatic = "rwApp.refreshTopView()"; 
	  event.refreshFunctionStatic = refreshFunctionStatic;
 	  rwApp.referCustToSelectedPartner(event);
	  $("#left-panel").panel( "close");
	  $("#singlePageWeb").css("min-height",""); //workaround
	
});

$(".menuItemDetail.action").live("click",function(event){
	
	expandMenuSection(event)
	
});


function expandMenuSection(event){
	debugger;
	//alert(event.target.id);
	if (event.target.className == 'menuItemDetail action'){
		elem = $(event.target);
	} else {
		var elem = $(event.target).parent('.menuItemDetail');
	}
	var route = elem.attr('route');
	
	if (route=="expand"){
	  	var id = elem.attr('id');
	  	var subId = id + "_sub";
		var level2 = $("#"+subId);
		level2.toggle(300);
		//level2.toggle(0);
		var toggleIcon = elem.find("img.menuToggle");
		var startImage = toggleIcon.attr("src");
		if (startImage.indexOf("expand") > -1){
			toggleIcon.attr("src","images/icons/collapseIconWhite.png");	
		} else {
			toggleIcon.attr("src","images/icons/expandIconWhite.png");
		}
	}
	else {
		
		if ($.hasVal(elem.attr("target"))){
			window.open(route,"_blank");
		} else{
			rwApp.preventNavigation = false;
			//window.location = route;
			rwApp.navigate(route,{trigger: true});//,replace:true});
		}
		
		$("#left-panel").panel( "close");
		$("#singlePageWeb").css("min-height",""); //workaround
		
	}
}

function hoverToggleMenu(){

	var container = $(this);
	var id = container.attr("group");
	var elem = $("#"+id);
///	var id = elem.attr('id');
  	var subId = id + "_sub";
	var level2 = $("#"+subId);
	var toggleIcon = elem.find("img.menuToggle");
	var isOpen = (level2.css("display") == "none")?false:true;
	if (isOpen){
		level2.hide(300);
		toggleIcon.attr("src","images/icons/expandIconWhite.png");
	} else {
		$(".subMenus").hide(300);
		$("img.menuToggle").attr("src","images/icons/expandIconWhite.png");
		level2.show(300);
		toggleIcon.attr("src","images/icons/collapseIconWhite.png");	
	}
}

function panelOpen(){

	var isClosed = ($("#left-panel").hasClass("ui-panel-closed"))?true:false;
	if (isClosed){
		$("#left-panel").panel( "open" , null);	
	}
	
}
	


$( "#left-panel" ).on("panelclose", function( event, ui ) {
	$("#left-panel .subMenus").hide();
	$("img.menuToggle").attr("src","images/icons/expandIconWhite.png");
} );



$(".navigate").live("click",function(){
	$(".overlay-background").hide();
    $("#overlay-navbar").hide();
	
	
});



$("#closeNavPop").live("click",function(){
		
	$(".overlay-background").hide(50);
    $("#overlay-navbar").hide(50);
});

/*
$("#cancelPick").live("click",function(){
	
	$("#pickBackground").hide(50);
	$('#picklistContainer').hide(250);
});
*/

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


function showHelp(hoverSource){
			if (window.userOS != "iOS"){

		    var tooltipSource = $(hoverSource).attr('tooltipSource');
		    
		    if (!$.hasVal(tooltipSource)){
		    	tooltipSource = $(hoverSource).parents('[tooltipSource]').attr('tooltipSource');
		    }
		    var repository = rwcore.getTemplate('/Help/contextHelp.html');
		    //var repository = ReferralWireBase.Templatecache.contextHelp;
			var thisItem = $(repository).find("#"+tooltipSource).html();
			//alert("thisItem: " + thisItem);
			
			var thisItemPopHeight = $(repository).find("#"+tooltipSource).attr("popHeight");
			var thisItemPopWidth = $(repository).find("#"+tooltipSource).attr("popWidth");
			var thisItemTitle = $(repository).find("#"+tooltipSource+"_Title").html();
			thisItemTitle = "<em>"+thisItemTitle+"</em>";
			var popTemplate = $(repository).find("#template").html();
		    var content = popTemplate.replace("...",thisItem);
		    content = content.replace("<em>Information</em>",thisItemTitle);
		    //alert("content: " + thisItem);		    
		    
		    $(hoverSource).append($(content));
		    if ($.hasVal(thisItemPopHeight)){
			    $(hoverSource).find(".info").css("height",thisItemPopHeight);
		    }
		    if ($.hasVal(thisItemPopWidth)){
			    $(hoverSource).find(".info").css("width",thisItemPopWidth);
		    }
		    
		    /*
		    $(tooltipSource).append($(content));
		    if ($.hasVal(thisItemPopHeight)){
			    $(tooltipSource).find(".info").css("height",thisItemPopHeight);
		    }
		    */
			}
			
}


$(document).ready(function() {

	$(window).on('hashchange', function(e) {
		
		/*	
		  if ($.hasVal(rwApp.preventNavigation) && rwApp.preventNavigation){
			  e.preventDefault();
			  e.stopImmediatePropagation();
			  document.location.hash = rwApp.lastHash;
			  return false;
		  } else {
			  rwApp.lastHash = document.location.hash;
		  }
		*/  
		});
});

</script>


</html>
