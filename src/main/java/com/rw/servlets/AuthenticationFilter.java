package com.rw.servlets;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONObject;

import com.rw.API.SecMgr;

public class AuthenticationFilter implements Filter {
    private static final String USERID = "User.Id";
	
	public void init(FilterConfig filterConfig) throws ServletException {
    }

    public void destroy() {
    }
	
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)req;
        HttpServletResponse response = (HttpServletResponse)res;
        HttpSession session = request.getSession(true);
        String userid = (String) session.getAttribute(USERID);
        if(userid == null || userid.isEmpty()) {
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
    						data.put("act", "login");
    						data.put("login", credArray[0]);
    						data.put("password",credArray[1]);
    						data = sm.handleRequest(data);
    						String id = data.get("data").toString();
    						request.getSession().setAttribute(USERID, id);
    				   	    chain.doFilter(request, response);
    				   	    return;
    			        }
    		        }
    		    }
    	    } catch(Exception e){
    	    	e.printStackTrace();
    	    }
        	response.sendRedirect("/rw.jsp"); 
        }
   	    chain.doFilter(request, response);
	}
}