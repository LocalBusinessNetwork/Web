package com.rw.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.rw.API.RfrlMgr;
import com.rw.API.UserMgr;
import com.rw.persistence.JedisMT;

/**
 * Servlet implementation class rwCFB
 */
public class rwFBListener extends HttpServlet {
	static final Logger log = Logger.getLogger(rwFBListener.class.getName());
	private static final String USERID = "User.Id" ;
	private static final String TENANT = "Tenant.Id" ;

	public static JedisMT jedisMt = new JedisMT();
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public rwFBListener() {
        super();
        // TODO Auto-generated constructor stub
    }
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		
		try {
			PrintWriter out = null;
			out = response.getWriter();
			String act = request.getParameter("act");
			log.info("act:" + act);
			String payloadStr = request.getParameter("data");
			JSONArray payloadOut = new JSONArray();
			JSONArray payload = new JSONArray(request.getParameter("data"));
			String  FaceBookId = null;
			String  LNProfileId = null;
			
			UserMgr um = new UserMgr();
			String tenant_key = (String) request.getSession().getAttribute(TENANT);
			um.setTenantKey(tenant_key );
			um.setUserId((String) request.getSession().getAttribute(USERID));
			jedisMt.setTenant(tenant_key);
			
			if ( act.equals("getFBFriends")) {
				// String  accessToken = request.getParameter("AccessToken");
				// FacebookClient fb = new DefaultFacebookClient(accessToken);
				// grab user's facebook in profile id
				FaceBookId = request.getParameter("FaceBookId");
				
				// cache all FaceBookIds in the system to a set 	
				jedisMt.cacheFaceBookIds(false);
					
				// Correlate the facebookid with the friends
				for ( int i = 0; i < payload.length(); i++) {
					String id = payload.getJSONObject(i).getString("id");
					if  ( jedisMt.sismember("FACEBOOK_MEMBERS", id))
						payloadOut.put("m" + id);
					if  ( jedisMt.get("FB"+ id) != null )
						payloadOut.put("i" + id);
				}
				
				JSONObject f = new JSONObject();
				f.put("FaceBookId", FaceBookId);
				um.UpdateSocialIds(f);

			}
			else if ( act.equals("getINConnections")) {
					
					// grab user's linked in profile id
					LNProfileId = request.getParameter("LNProfileId");
					
					// cache all FaceBookIds in the system to a set 	
					jedisMt.cacheLinkedInIds(false);
					
					// Correlate the facebookid with the friends
					for ( int i = 0; i < payload.length(); i++) {
						String id = payload.getJSONObject(i).getString("id");
						if  ( jedisMt.sismember("LINKEDIN_MEMBERS", id))
							payloadOut.put("m" + id);
						if  ( jedisMt.get("LN" + id) != null )
							payloadOut.put("i" + id);
					}
					
					JSONObject f = new JSONObject();
					f.put("LNProfileId", LNProfileId);				
					um.UpdateSocialIds(f);
			}
						
			// Done with correlation, send out the members that are already in the system
			response.setContentType("application/json");
			out.print(payloadOut);
			out.flush();

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		/*
		String accessToken = request.getParameter("AccessToken");
		//AccessToken accessToken = new DefaultFacebookClient().obtainAppAccessToken("295573790540551", "5ab21d233ac92d097b9dd5376a495745");
		
		log.info(accessToken);
		
		//FacebookClient fb = new DefaultFacebookClient(accessToken.getAccessToken());
		FacebookClient fb = new DefaultFacebookClient(accessToken);
		
		User u1 = fb.fetchObject("13755075", User.class);
	
		System.out.println(u1.toString());
		
		fb.publish("me/feed", FacebookType.class,
			    Parameter.with("message", "RestFB test"));
		
		
		Connection<User> fs = fb.fetchConnection("me/friends", User.class);
		
		for ( User u : fs.getData()) {
			User u1 = fb.fetchObject(u.getId(), User.class);
			System.out.println(u1.getId() + ":" + u1.getEmail() + ":" + u1.getLink() );
		}
		
		for ( User u : fs.getData()) {
			User u1 = fb.fetchObject(u.getId(), User.class);
			System.out.println(u1.toString());
		}
		*/

	}
}


