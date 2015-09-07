package com.rw.security;

import java.io.IOException;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

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
import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.web.servlet.ShiroFilter;
import org.json.JSONException;
import org.json.JSONObject;

import com.rw.API.SecMgr;
import com.rw.API.TenantMgr;
import com.rw.API.User;
import com.rw.authenticate.OAuthRedisRealm;
import com.rw.authenticate.RWOAuthToken;
import com.rw.servlets.rwWebRequest;

public class DelegatingShiroFilter implements Filter {
    private ShiroFilter f =  new ShiroFilter() ;
    static final Logger log = Logger.getLogger(DelegatingShiroFilter.class.getName());
    
	public void init(FilterConfig filterConfig) throws ServletException {
		f.init(filterConfig);
    }

    public void destroy() {
    	f.destroy();
    }
	
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest)req;
        HttpServletResponse response = (HttpServletResponse)res;
        HttpSession session = request.getSession(true);
        Map<String, String[]> additionalParams = new HashMap<String, String[]>();
		String sn = request.getServerName();
		
		
		try {
			TenantMgr t = new TenantMgr();
			String tenant = null;
			String tenant_id = null ;
			
			JSONObject data = new JSONObject();
			data.put("sn",sn);
			log.debug("sn = " + sn);
			
			JSONObject tenantContext  = t.getTenantContext(data);
			tenant_id = tenantContext.get("_id").toString();
			tenant = tenantContext.get("tenant").toString();
			
			request.setAttribute("tenant", tenant);
			request.setAttribute("tenant_id", tenant_id );
			
			// System.out.println(request.getParameterMap().toString());
			
			String origin = request.getHeader("Origin");
			
        	if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        		// This is a pre-flight request 
        		// TODO: We could probably validate all the CORS domains for this tenant.
        		if (origin != null ) {
        			response.setHeader("Access-Control-Allow-Origin", origin);
        			log.debug("OPTIONS REQUEST, setting CORS To = " + origin);
            	}
        		else {
        			log.debug("PREFLIGHT CALL: Not Setting CORS Domain because origin was null");
        		}
        		
        		response.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE, OPTIONS" );
    			response.setHeader("Access-Control-Allow-Headers", "Authorization");
    			response.setStatus(200);
                return;
            }

        	
        	if ( origin != null ) {
	        	// This is a CORS request
				// This request should be coming to us 
        		
        		// 1. For an Authorization Token to call API with a client id
        		// 2. With an Authorization token for an API call.
        
        		String destination = request.getScheme() + "://" + sn + ":" + request.getServerPort();
            	if( !origin.equals(destination)) {
            
	        		String CORS_client_id = null;
					String Authorization = request.getHeader("Authorization");
					
					if (  Authorization == null  ) {
						// case 1: Request is for Authorization token.
						CORS_client_id = request.getParameter("client_id");
					}
					else {
						// Case 2: Request is for an API call
						OAuthRedisRealm r = new OAuthRedisRealm();
						r.setServletContext(request);
			     		RWOAuthToken oauthToken = r.getToken(Authorization.substring(7, Authorization.length()));
			     		if (oauthToken == null ) {
			     			log.debug("Authorization Token Expired for Orign = " + origin ) ;
							response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization Token has expired for " + origin );
							response.flushBuffer();
							return;
			     		}
			     		CORS_client_id = oauthToken.getClientId();
					}
					
					if ( CORS_client_id != null ) {
						// All good, let us proceed to serve this request
				        data.put("client_id",CORS_client_id );
						t.setTenantKey(tenant);
						t.app.setContext(t);
						JSONObject appDef = t.getAPIAppDef(data);
						
						if ( !appDef.has("CorsUris") ) {
							// Aha moment again : CORSUris were not setup right for this request.
			     			log.debug("There was no CORS Origin specified for = " + origin ) ;
							response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "There was no CORS Origin specified for = " + origin );
							response.flushBuffer();
							return;
						}
						
						String CorsUrisStr = appDef.get("CorsUris").toString();
						
						String[] CorsUris = CorsUrisStr.split(",");
						boolean foundCorsMatch = false;
						for( int i = 0; i < CorsUris.length; i++) {
							if ( CorsUris[i].toLowerCase().contains(origin.toLowerCase())) {
								foundCorsMatch = true;
								break;
							}
						}
						
						if ( !foundCorsMatch ) {
							// Aha moment again : wrong CORS origin or a hacker request.
							String errorStr = "CORS Origin is not in the list of approved Origins  : " + origin + " Vs. " +  CorsUrisStr;
							log.debug(errorStr) ;
							response.sendError(HttpServletResponse.SC_UNAUTHORIZED, errorStr  );
							response.flushBuffer();
							return;
						}
						
						if (Authorization == null ) { 
							// Don't need this for already pre-flighted & Authorized calls 
							log.debug("API CALL: Setting CORS Domain to " + origin);
					        response.setHeader("Access-Control-Allow-Origin", origin);	
						}
						
					}
            	}
            	else {
        			log.debug("Did not set the CORS Origin for Origin = " + origin + ", Desitination = " + destination );
            		// response.setHeader("Access-Control-Allow-Origin", origin);
            	}
	        }
     	} catch (JSONException e) {
			log.debug(e.getStackTrace());
			throw new ServletException(e.getMessage());
		} catch (Exception e) {
			log.debug(e.getStackTrace());
			throw new ServletException(e.getMessage());
		}

		HttpServletRequest t = new TenantHttpServletRequestWrapper(request, additionalParams);
		f.doFilter(t, response, chain);
        
	}
}