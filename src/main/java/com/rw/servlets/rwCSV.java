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

import com.rw.common.CSVimpl;

import redis.clients.jedis.Jedis;

/**
 * Servlet implementation class rwAlerts
 */
public class rwCSV extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String USERID = "User.Id" ;
	static final Logger log = Logger.getLogger(rwCSV.class.getName());

    /**
     * @see HttpServlet#HttpServlet()
     */
    public rwCSV() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		HttpSession session = request.getSession();
	
		String userid = (String) session.getAttribute(USERID);
     	response.setContentType("application/octet-stream");
		
     	String type = request.getParameter("type");
     	
     	if ( type.equals("members")) {
     	 	PrintWriter out = null;
			out = response.getWriter();
			CSVimpl csvImpl = new CSVimpl();
			try {
				out.print(csvImpl.members(request));
				out.flush();
			}
			catch(Exception e) {
				throw new ServletException(e);
			}			
     	}
     		
	}

}


