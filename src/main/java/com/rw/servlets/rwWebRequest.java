package com.rw.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.*;
import org.apache.commons.lang3.CharEncoding;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import com.mongodb.util.JSONSerializers;
import com.mongodb.util.ObjectSerializer;
import com.rw.API.ContactsMgr;
import com.rw.API.LovMgr;
import com.rw.API.PartnerMgr;
import com.rw.API.RWReqHandle;
import com.rw.API.RepoMgr;
import com.rw.API.RfrlMgr;
import com.rw.API.SecMgr;
import com.rw.API.UserMgr;
import com.rw.persistence.JedisMT;

/**
 * 
 * Servlet implementation class rwWebRequest
 * 
 * JVM params for appserver like Jetty or Tomcat
 * 
 * -cp <<RWHOME>>/web/src/main/webapp/WEB-INF/lib  
 * 		-DWebRoot=<<RWHOME>>/web/src/main/webapp 
 * 		-DJDBC_CONNECTION_STRING=localhost -DPARAM1=localhost 
 * 		-DEMAIL=production -DPARAM3=STN -DPARAM5=rwstaging 
 * 		-Dorg.eclipse.jetty.server.Request.maxFormContentSize=5000000 
 * 		-DTENANTPROXY=<<Tenant domainName>>
 * 
 * 
 */

public class rwWebRequest extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	private static final String USERID = "User.Id" ;
	private static final String ROLES = "User.roles" ;
	private static final String TENANT = "Tenant.Id" ;
	
	static final Logger log = Logger.getLogger(rwWebRequest.class.getName());
	public static JedisMT jedisMt = new JedisMT();

	public static void handleRuntimeException(Exception ex, HttpServletResponse 
            response) {
		try{
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
			response.flushBuffer();
			log.fatal(ex.getMessage());
		
		} catch (IOException e) {
			log.debug(e.getStackTrace());
		}
		
	}
    /**
     * Default constructor. 
     */
    public rwWebRequest() {
        // TODO Auto-generated constructor stub
    }
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		JSONObject retVal = new JSONObject();
		try {
		
			String captcha = request.getParameter("Captcha");  	
			if ( captcha != null) {
				response.setContentType("application/json");
				PrintWriter out = response.getWriter();
				retVal.put("Captcha", GetCaptcha(request));
				out.print(retVal);
				out.flush();
				return;
			}
			
			String item = request.getParameter("Peek"); 
			if ( item != null ) {
				HttpSession session = request.getSession();
				String tenant = (String) session.getAttribute(TENANT);
				jedisMt.setTenant(tenant);
				String value = jedisMt.get(item);
				response.setContentType("application/json");
				PrintWriter out = response.getWriter();
				retVal.put("value", value);
				out.print(retVal);
				out.flush();
				return;
			}
			
			doPost(request,response);
			
		 } catch (IOException e) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
			response.flushBuffer();
			log.fatal(e.getMessage());
		 } catch (JSONException e) {
			// TODO Auto-generated catch block
			log.debug(e.getStackTrace());
			log.fatal(e.getMessage());
		}

	}

	public boolean handleOONReferral(HttpServletRequest request, HttpServletResponse response, String invitationId) throws IOException {
		
		String invitationEnvelope = jedisMt.get(invitationId);
		JSONObject invitationDetails;
		try {
			invitationDetails = new JSONObject(invitationEnvelope);
			String invitationType = invitationDetails.getString("invitationType");
			String invitationLifeSpan = invitationDetails.has("invitationLifeSpan") ? invitationDetails.getString("invitationLifeSpan") : null;
			String invitedBy_Id = invitationDetails.has("fromId") ? invitationDetails.getString("fromId") : null;
			String invitedBy_OrgId = invitationDetails.has("fromOrgId") ? invitationDetails.getString("fromOrgId") : null;
			String invitedBy_FullName = invitationDetails.has("fromFullName") ? invitationDetails.getString("fromFullName") : null;
			
			PartnerMgr pm = new PartnerMgr();
			pm.setTenantKey( (String) request.getSession().getAttribute(TENANT));
			pm.setUserId((String) request.getSession().getAttribute(USERID));
			
			String party_id = pm.GetPartyId();

			JSONObject InvitorData = new JSONObject();
			InvitorData.put("id",party_id);
			InvitorData.put("invitedBy_Id",invitedBy_Id);
			InvitorData.put("invitedBy_OrgId",invitedBy_OrgId);
			InvitorData.put("invitedBy_FullName",invitedBy_FullName);
 			
			if ( (invitationType != null ) && (invitationType.equals("LN") || 
						invitationType.equals("FB") || 
							invitationType.equals("OI"))) {
				if ( invitationType.equals("FB"))
					InvitorData.put("FacebookId", invitationDetails.getString("socialConnectionId"));
				else if(invitationType.equals("LN")  )
					InvitorData.put("LNProfileId", invitationDetails.getString("socialConnectionId"));
				
				RfrlMgr rm = new RfrlMgr(pm);
				JSONObject RfrlData = new JSONObject();
				RfrlData.put("fromId",invitedBy_Id);
				RfrlData.put("toId",party_id);
				RfrlData.put("referralType", invitationType);
				RfrlData.put("status","ACCEPTED");
				rm.create(RfrlData);
				rm.updateStat("totalInvited", "totalInvited", "Party",  invitedBy_Id);

				
			}
			else {
				// This is the standard email invitation. We already have referral created for this one. 
				// Let us update it
				RfrlMgr rm = new RfrlMgr(pm);
				JSONObject RfrlData = new JSONObject();
				
				RfrlData.put("id",invitationDetails.getString("id"));
				RfrlData.put("status","ACCEPTED");
				rm.update(RfrlData);
				rm.updateStat("totalInvited", "totalInvited", "Party",  invitedBy_Id);

			}
				
			UserMgr um = new UserMgr(pm);
			um.update(InvitorData);
			
			pm.BiDirectionalEdge(invitedBy_Id, party_id);
			
			if ( invitationLifeSpan == null)
				jedisMt.del(invitationId);		
			
		} catch (JSONException e) {
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Invitation");
			response.flushBuffer();
			log.debug(e.getStackTrace());		
		} catch (Exception e) {
			log.debug(e.getStackTrace());
		}
		return true;
	}
	
	public boolean handleRememberMe(HttpServletRequest request, HttpServletResponse response) {
		
		try{
		    Cookie[] cookies = request.getCookies();
		    for (int i = 0; i < cookies.length; i++) {
		        Cookie cookie = cookies[i];
		        if (cookie.getName().equals("ReferralWireAuthCookie")) {
			        if(cookie.getValue() != "" && cookie.getValue().length() > 0){
			        	String credentials = cookie.getValue();
	        	        String decodedCredentials = new String(Base64.decodeBase64(credentials.getBytes()));
			        	String credArray[] = decodedCredentials.split(":");
			        	JSONObject data = new JSONObject();
						SecMgr sm = new SecMgr();
						sm.setTenantKey( (String) request.getSession().getAttribute(TENANT));
						
						data.put("act", "login");
						data.put("login", credArray[0]);
						data.put("password",credArray[1]);

						data = sm.handleRequest(data);
						JSONObject bc = (JSONObject) data.get("data_secret");

						String id = bc.getString("_id");
						request.getSession().setAttribute(USERID, id);

		   				String roles = bc.getString("roles");
		   				request.getSession().setAttribute(ROLES, roles);
		   				
		   				// extend the life of cookie additinal 30 days every time someone logs in.
		   				cookie.setMaxAge(60 * 60 * 24 * 30);
						response.addCookie(cookie);
			
						return true;
			        }
		        }
		    }
	    } catch(Exception e){
	    	log.debug("WebInterface Error: ", e);
	    }
		return false;
	}
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();
		
		String tenant = (String) session.getAttribute(TENANT);
		String userid = (String) session.getAttribute(USERID);
		String roles = (String) session.getAttribute(ROLES);
		jedisMt.setTenant(tenant);
		
	    try {
		     	PrintWriter out = null;
		     	response.setContentType("application/json");
				out = response.getWriter();
				
				JSONObject payload = new JSONObject();
				JSONObject retVal = null;
				
				String payloadStr = request.getParameter("data");
				
				if  ( payloadStr != null ) {
					payload = new JSONObject(payloadStr);
				}
				else {
				
					Map<String, String[]> paramMap = (Map<String, String[]>)request.getParameterMap();
				
					for (String paramName : request.getParameterMap().keySet()){
						String[] paramValue = (String []) paramMap.get(paramName);
						payload.put(paramName, paramValue[0].toString());
					}

					if ( !payload.isNull("signout") ) {
					    Cookie cookie= new Cookie("ReferralWireAuthCookie", "");
					    cookie.setMaxAge(0);
					    response.addCookie(cookie);
					    Subject currentUser = SecurityUtils.getSubject();
					    currentUser.logout();
						return;
					}
					
					if ( !payload.isNull("CaptchaInput") ) {
						String Captcha = (String) payload.get("CaptchaInput");
						if ( !CheckCaptcha(request,response,Captcha ) )
							return;
					}

				}
				
				if (!payload.isNull("module")) {
					String module = (String) payload.get("module");	
							
					// we know which module to reach so, shred it from payload
					payload.remove("module");

					String className = new String ( "com.rw.API." + module );
					Class cls = Class.forName(className); 
					RWReqHandle obj = (RWReqHandle) cls.newInstance(); 
					obj.setTenantKey(tenant);
					
					if ( userid != null ) {
						if (!obj.restoreExecutionContext(userid.toString()) )
							obj.setUserId(userid.toString());
					}

					if ( module.equals("SecMgr")) {
						String act = (String) payload.get("act");	
					    
						if ( act.equals("login") ) {
							
							// AuthenticationMgr auth = new AuthenticationMgr();
							// auth.login( payload.get("login").toString().toLowerCase(),payload.get("password").toString() );
							
							retVal = obj.handleRequest(payload);

							Cookie cookie= new Cookie("ReferralWireAuthCookie", "");
						    cookie.setMaxAge(0);
						    response.addCookie(cookie);
							
							JSONObject bc = (JSONObject) retVal.get("data_secret");

							String id = bc.getString("_id");
							session.setAttribute(USERID, id);

			   				roles = bc.getString("roles");
							session.setAttribute(ROLES, roles);
							
			   				retVal.remove("data_secret");
							
							retVal.put("data", id);
							retVal.put("roles", roles);
							
							if ( !payload.isNull("RememberMe")) {
								String CookieDough = payload.get("login").toString() + ":" + payload.get("password").toString(); 
							    String encodedCredentials = Base64.encodeBase64URLSafeString(CookieDough.getBytes());
							    cookie.setValue(encodedCredentials);
							    cookie.setMaxAge(60 * 60 * 24 * 30);
							    response.addCookie(cookie);
							}
						}
						else if (act.equals("create")) {

							retVal = obj.handleRequest(payload);

							Cookie cookie= new Cookie("ReferralWireAuthCookie", "");
						    cookie.setMaxAge(0);
						    response.addCookie(cookie);

							BasicDBObject userObj = (BasicDBObject) JSON.parse(retVal.get("data").toString()); 
							ObjectId idObj = (ObjectId) userObj.get("_id");
							session.setAttribute(USERID, idObj.toString());

							if ( !payload.isNull("invitationId")) {
								// This is a special case
								handleOONReferral(request, response, payload.get("invitationId").toString());
							}
							
							response.flushBuffer();
							return;
							
						}
						else if ( act.equals("changePassword") ) {
							retVal = obj.handleRequest(payload);

							Cookie cookie= new Cookie("ReferralWireAuthCookie", "");
						    cookie.setMaxAge(0);
						    response.addCookie(cookie);

						    response.flushBuffer();
							return;
						}
						else if ( act.equals("confirmLoginId") || act.equals("resetPassword") || act.equals("getVer")) {
							retVal = obj.handleRequest(payload);
						}
						else {  // hacker proof it
							response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Please login");
							response.flushBuffer();
							return;
						}
					}
					else {
							// Lovs and Repo need to initialized before login
							// RepoMgr & LovMgr is public - You don't need creds to access it.
							if ( module.equals("LovMgr") || module.equals("RepoMgr") ) {
								payload.put("userid", userid);
								retVal = obj.handleRequest(payload);
								out.print(retVal);
								out.flush();
								return;
							}
							
						    // enter any module only after login
							// establishing server sesson
							if ((userid == null) || userid.isEmpty() ) {
								// server session times out..
								// use remember me to establish the credentials.
								if ( !handleRememberMe(request, response)) {
									// No Cookie info..throw login
									response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Please login");
									response.flushBuffer();
									return;
								}
								else {
									userid = (String) session.getAttribute(USERID);
								}
							}
							
							// now, you have the right to go do what ever you want.
							payload.put("userid", userid);
							payload.put("roles", roles);
							retVal = obj.handleRequest(payload);
					}
				}
				
				if ( retVal == null ) {
					response.sendError(HttpServletResponse.SC_NO_CONTENT, "No Data");
					response.flushBuffer();
					return;
				}
				out.print(retVal);
				out.flush();
		} catch (Exception e) {
			throw new ServletException(e);
		}
	
	}

	String GetCaptcha(HttpServletRequest request) {

		CaptchasDotNet captchas = new CaptchasDotNet(
				  request.getSession(true),     // Ensure session
				  "referralwire",                       // client
				  "Zd6MosSWKmBcPLAI70VgR5NvghZhfEOHSy7XjlDU"                      // secret
				  );
		
		return captchas.imageUrl();
		
	}
	
	boolean CheckCaptcha(HttpServletRequest request,HttpServletResponse response, String rwCaptchaString) throws IOException {
	
		CaptchasDotNet captchas = new CaptchasDotNet(
				  request.getSession(true),     // Ensure session
				  "referralwire",                       // client
				  "Zd6MosSWKmBcPLAI70VgR5NvghZhfEOHSy7XjlDU"                      // secret
				  );

		boolean retValue = false;
		
		String body;
		switch (captchas.check(rwCaptchaString)) {
		  case 's':
		    body = "Session seems to be timed out or broken. ";
		    body += "Please try again or report error to administrator.";
			response.sendError(HttpServletResponse.SC_EXPECTATION_FAILED, body);
			response.flushBuffer();
		    break;
		  case 'm':
		    body = "Every CAPTCHA can only be used once. ";
		    body += "The current CAPTCHA has already been used. ";
		    body += "Please use back button and reload";
			response.sendError(HttpServletResponse.SC_EXPECTATION_FAILED, body);
			response.flushBuffer();
		    break;
		  case 'w':
		    body = "You entered the wrong Captcha Code. ";
		    body += "Please use back button and try again. ";
			response.sendError(HttpServletResponse.SC_EXPECTATION_FAILED, body);
			response.flushBuffer();
		    break;
		  default:
		    body = "Your message was verified to be entered by a human and is \"" + rwCaptchaString + "\"";
		    retValue = true;
		    break;
		}
		
		return retValue;
	}
}
