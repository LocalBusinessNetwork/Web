package com.rw.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.rw.persistence.JedisMT;
import com.rw.API.RfrlMgr;
import com.rw.API.SecMgr;

/**
 * Servlet implementation class rwCFB
 */
public class rwCFB extends HttpServlet {
	static final Logger log = Logger.getLogger(rwCFB.class.getName());
	public JedisMT jedisMt = null; 
	;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public rwCFB() {
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
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();
     	PrintWriter out = null;
		out = response.getWriter();

		String sn = request.getServerName();
		String tenant = null;
		JSONObject data = new JSONObject();
		SecMgr sm = new SecMgr();
		try {
			data.put("act", "getTenantContext");
			data.put("sn", sn);
			JSONObject tenantObj;
				tenantObj = sm.handleRequest(data);
			if (tenantObj == null ) {
				response.sendError(HttpServletResponse.SC_NOT_FOUND);
				return;
			}

			tenant = tenantObj.getString("tenant");
			jedisMt = new JedisMT(tenant);
			
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			e1.printStackTrace();
			return;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}

		String type = request.getParameter("type");
		String jedistoken = request.getParameter("token");

		String tokenValue = null;
		
		if ( type.equals("1") ) {
			tokenValue = jedisMt.get(jedistoken);
	
			if (tokenValue != null ) {
				try {
					RfrlMgr r = new RfrlMgr();
					r.setTenantKey(tenant);
					r.UpdateCFB(jedistoken, tokenValue, type, request.getParameter("decision"));
					// A survey can be submitted only once..
					jedisMt.del(jedistoken);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					log.debug("WebInterface Error: ", e);
				}
				out.write("Thank You!");
			}
			else {
				out.write("This survey does not exist or expired");
			}
		}
		else if ( type.equals("2") ) {

			tokenValue = jedisMt.get(jedistoken);

			if (tokenValue != null ) {
				Cookie cookie= new Cookie("OONRCookie", jedistoken);
			    cookie.setMaxAge(60 * 60 * 24 * 15);
			    response.addCookie(cookie);
			    
				
				Cookie cookie2= new Cookie("OONRFormDataCookie", tokenValue);
			    cookie.setMaxAge(60 * 60 * 24 * 15);
			    response.addCookie(cookie2);
			    response.sendRedirect("/register.jsp");
			}
			else {
				out.write("This Referral Invitation survey does not exist or expired");
			}
		}
		
		out.flush();
	}
}


