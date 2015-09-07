<META HTTP-EQUIV="EXPIRES" CONTENT="Mon, 21 Oct 2013 12:30:59 GMT">
<%@ page import="java.util.Map,java.util.ResourceBundle,java.util.Locale,org.json.JSONObject,com.rw.API.SecMgr,com.rw.API.UserMgr,eu.bitwalker.useragentutils.UserAgent,eu.bitwalker.useragentutils.OperatingSystem, eu.bitwalker.useragentutils.Browser,eu.bitwalker.useragentutils.DeviceType" %>
<%

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

sm.setExecutionContextItem("tenant", tenant);

String uId = request.getParameter("member");

if (uId == null ) {
	response.sendError(HttpServletResponse.SC_NOT_FOUND);
	return;
}

String routerSubClass = "";
String formFactorStyle = "web";
String viewport = "<meta name='viewport' content='width=device-width, initial-scale=1'> ";

String uaString = request.getHeader("User-Agent");
String browserName = "OTHERBROWSER";
String OSName = "";
String OSVersion = "";
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
			OStype == OperatingSystem.iOS6_IPHONE || 
							OStype == OperatingSystem.MAC_OS_X_IPHONE){
								formFactorStyle = "smartPhone";
								routerSubClass = "Phone";
								//viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";
								//viewport = "<meta name='viewport' content='width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi'/>";
								viewport = "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>";
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


UserMgr um = new UserMgr(sm);

data = new JSONObject();
data.put("act", "publicProfile");
data.put("id", uId);

String pp = null;
JSONObject userObj = null;

try {
	userObj = new JSONObject(um.handleRequest(data).getString("data"));
	pp = userObj.getString("publicProfile");
}catch (Exception e) {
	response.sendError(HttpServletResponse.SC_NOT_FOUND);
	return;	
}

%>

<!DOCTYPE html> 
<html> 
<head> 
<title><%= userObj.getString("fullName")%></title> 
<%= viewport %>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<META HTTP-EQUIV="EXPIRES" CONTENT="Mon, 21 Oct 2013 12:30:59 GMT">
<!-- <link rel="shortcut icon" href="favicon.ico" /> -->
<link rel="shortcut icon" href="favicon<%= tenant%>.ico" />
<link rel="stylesheet" href="/style/jquery-ui-1.10.3.custom.min.css" />
<link rel="stylesheet" href="/style/jquery.mobile-1.3.1.css" />

<link rel="stylesheet" href="/style/<%= tenant%>_style.css" />
<link rel="stylesheet" href="https://resource.successfulthinkersnetwork.com/stn-member/stn.css" />
 

<script type="text/javascript"  data-main="/js/main" src="/js/require-jquery.min.js"></script> 
<script type="text/javascript"  src="/js/jqmconfig.js"></script>

<script>
var jqmReady = $.Deferred();

requirejs(['jquery.mobile-1.3.1.min'], function(jquerymobile) {
	jqmReady.resolve();
});

</script>

</head>
<body style="overflow:hidden" class="<%= formFactorStyle%> <%= browserName%>">
<div id="fb-root"></div>
	<div data-role="page" id="singlePageWeb" class="rwContainer" >
			<%= pp%>
	</div>		
</body>

</html>
