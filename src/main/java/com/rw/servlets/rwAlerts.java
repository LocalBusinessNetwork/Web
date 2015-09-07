package com.rw.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuer;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.rw.API.PartyMgr;
import com.rw.persistence.JedisMT;

import redis.clients.jedis.Jedis;

/**
 * Servlet implementation class rwAlerts
 */
public class rwAlerts extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String TENANT = "Tenant.Id" ;
	private static final String USERID = "User.Id" ;
	static final Logger log = Logger.getLogger(rwAlerts.class.getName());
	public static JedisMT jedisMt = new JedisMT();

 
    /**
     * @see HttpServlet#HttpServlet()
     */
    public rwAlerts() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();
		String tenant = (String) session.getAttribute(TENANT);
		String userid = (String) session.getAttribute(USERID);
     	response.setContentType("application/json");
		
		if ( userid != null ) {
	     	PrintWriter out = null;
			out = response.getWriter();
			JSONObject retVal = new JSONObject();
			
			try {
				
				JSONArray notifications = new JSONArray();
			
				jedisMt.setTenant(tenant);
			
				PartyMgr pm = new PartyMgr();
				pm.setTenantKey(tenant);
				pm.setUserId(userid);
				
				String party_id = pm.GetPartyId();
				
				while ( true ) {
					String note = jedisMt.lpop(party_id + "_notify");
					if ( note != null ) {
						JSONObject item = new JSONObject(note);
						notifications.put(item);
					}
					else 
						break;
				} 
				
				retVal.put("notifications", notifications.toString());
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				log.debug("WebInterface Error: ", e);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			out.print(retVal);
			out.flush();
			
		}

	}

}
