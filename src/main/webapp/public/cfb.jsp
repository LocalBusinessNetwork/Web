<%@ page language="java" contentType="text/html; charset=US-ASCII"
    pageEncoding="US-ASCII" import="org.json.JSONObject,com.rw.API.RfrlMgr,redis.clients.jedis.*,java.io.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<META HTTP-EQUIV="EXPIRES" CONTENT="Mon, 21 Oct 2013 12:30:59 GMT">
<title>ReferralWire Customer Feedback</title>
<style type="text/css">

.cfbbox {
    position:relative;
	border-radius:5px;
    background-color:white;
    z-index:1502;
    padding:5px 15px 15px 5px;
    color:black;
    margin-left:10%;
    margin-right:10%;
	margin-top:5%;
	border-bottom-left-radius: 12px;
	border-bottom-right-radius: 12px;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
 	-webkit-box-shadow: 0 0 5px rgba(0, 0, 255, .5);
 	-moz-box-shadow: 0 0 5px rgba(0, 0, 255, .5);
 	-o-box-shadow: 0 0 5px rgba(0, 0, 255, .5);
 	-ms-box-shadow: 0 0 5px rgba(0, 0, 255, .5);
 	box-shadow: 0 0 5px rgba(0, 0, 255, .5);
 	font-style:italic;
}
</style>

</head>
<body style="background-color:lightblue">
<%
	String token = request.getParameter("cfbToken");
 
Jedis jedis  = new Jedis(System.getProperty("PARAM1") == null? "localhost" : System.getProperty("PARAM1") );
String rfrlId = jedis.get(token);
JSONObject details = null;

if (rfrlId != null) {
	RfrlMgr r = new RfrlMgr();
	details = r.GetARfrl(rfrlId);
}
else {
	out.write("This survey does not exist or expired");
	out.flush();
	return;
}
%>

<div class="cfbbox">
<p>
Hi 
<span> <%= details.getString("contact_fullName") %>, </span>
<p>
Recently, <%= details.getString("from_fullName") %> shared your contact information with <%= details.getString("to_fullName") %> regarding an opportunity to serve you.
<%= details.getString("from_fullName") %>  would like your input to refer additional clients to <%= details.getString("to_firstName") %>. 
<p>
Thank you for taking a moment to respond.
<p>

<div style="font-weight: bold;">Did <%= details.getString("to_firstName") %> get in touch with you?</div>
<form style="padding-top:15px;padding-bottom:30px" action="/rwCFB" method="post" >
<input type="radio" name="contact" value="Yes">&nbsp;Yes<br>
<input type="radio" name="contact" value="No">&nbsp;No

<p>
<div style="font-weight: bold;">Should <%= details.getString("from_firstName") %> recommend <%= details.getString("to_firstName") %> to other clients?</div>
<p>
<input type="radio" name="recommend" value="Definitely!">&nbsp;Definitely!<br>
<input type="radio" name="recommend" value="Very selectively">&nbsp;Very selectively
<p><input type="submit" value="Submit"></p>
<p><input name="token" type="hidden" value=<%= token%>></p>
</form>

Thank you! Your feedback is very valuable to serve <%= details.getString("from_firstName") %>'s clients.

</div>

</body>
</html>