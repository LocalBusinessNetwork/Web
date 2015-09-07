package com.rw.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.tools.view.VelocityViewServlet;
import org.eclipse.jetty.util.log.Log;
import org.json.JSONObject;

import com.rw.API.TenantMgr;


/**
 * Servlet implementation class Velocity
 */
public class VelocityServlet extends VelocityViewServlet  {
	private static final long serialVersionUID = 1L;
	static final Logger log = Logger.getLogger(VelocityServlet.class.getName());
  
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VelocityServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		super.doGet(request, response);

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		super.doPost(request, response);
	}

	protected void fillContext(org.apache.velocity.context.Context context,
            javax.servlet.http.HttpServletRequest request) {
		
		TenantMgr t = new TenantMgr();
		
		try {
			JSONObject data = new JSONObject();
			data.put("sn", request.getServerName());
			JSONObject retVal = t.getTenantContext(data);

			data.remove("sn");
			t.setTenantKey(retVal.getString("tenant"));
			t.app.setContext(t);
			
			context.put("tenant", retVal);
	        context.put("jsonUtil", data);
	        context.put("tenantObj", t);
	        
		} catch (Exception e) {
			log.debug(e.getStackTrace());
		}
		
		super.fillContext(context, request);
	}
	
}
