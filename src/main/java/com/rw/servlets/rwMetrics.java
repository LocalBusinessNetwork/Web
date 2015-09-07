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
import org.json.JSONException;
import org.json.JSONObject;

import com.rw.API.PartnerMgr;
import com.rw.API.PartyMgr;
import com.rw.common.CSVimpl;
import com.rw.common.GoogleAnalytics;
import com.rw.persistence.RWJBusComp;

import redis.clients.jedis.Jedis;

/**
 * Servlet implementation class rwAlerts
 */
public class rwMetrics extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String USERID = "User.Id" ;
	private static final String TENANT = "Tenant.Id" ;

	static final Logger log = Logger.getLogger(rwMetrics.class.getName());

    /**
     * @see HttpServlet#HttpServlet()
     */
    public rwMetrics() {
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
		
     	String type = request.getParameter("type");
     	
     	if ( type.equals("pageviews")) {
     	 	PrintWriter out = null;
			out = response.getWriter();
			GoogleAnalytics ga = new GoogleAnalytics();
			JSONObject retVal = new JSONObject();
			try {
				
				PartyMgr pm = new PartyMgr();
				pm.setTenantKey(tenant);
				pm.setUserId(userid);
				
				String party_id = pm.GetPartyId();
				
				RWJBusComp partyRecord = pm.getPartyRecord(party_id);
				JSONObject tenantObj = pm.getTenant(null);
				
				String publicId = partyRecord.GetFieldValue("InvitationCode").toString();
				
				retVal.put("profileviews", ga.publicProfileViews(  "/" + publicId.toLowerCase() + ".html", tenantObj));
				
				out.print(retVal.toString());
				out.flush();
			}
			catch(Exception e) {
				throw new ServletException(e);
			}			
     	}
   		
	}

}


