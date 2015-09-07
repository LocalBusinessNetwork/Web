<%@ page import="com.rw.API.SecMgr" %>
<!DOCTYPE html> 
<html> 
<head> 
<title>ReferralWire System Health Checker</title> 
<!-- <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1,height=device-height"> -->
<meta name="viewport" content="width=device-width, initial-scale=1"> 
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
</head>
<%
	SecMgr sm = new SecMgr();
%>

<body style="overflow:hidden" >
<h1> <%= sm.healthCheck(null) %></h1>
</body>

</html>
