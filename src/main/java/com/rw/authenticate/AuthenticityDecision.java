package com.rw.authenticate;

import java.security.Principal;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.rsfilter.OAuthClient;
import org.apache.oltu.oauth2.rsfilter.OAuthUtils;

import com.rw.API.User;
import com.rw.API.UserMgr;
import com.rw.security.ResourceProvider;

public class AuthenticityDecision implements org.apache.oltu.oauth2.rsfilter.OAuthDecision {
	protected RWOAuthToken tokenDetails = null;
	protected boolean tokenMatch = false;
	static final Logger log = Logger.getLogger(AuthenticityDecision.class.getName());
	public AuthenticityDecision(String realm, String access_token,
			HttpServletRequest request) throws Exception {

		Class<?> clazz;
		try {
			clazz = Class.forName(realm);
			OAuthRealm r = (OAuthRealm) OAuthUtils.createObjectFromClassName(clazz);
			r.setServletContext(request);
			tokenDetails = r.getToken(access_token);
			request.setAttribute("userid", tokenDetails.getUserId());
			
			if ( tokenDetails != null && tokenDetails.accessToken.equals(access_token) ) 
				tokenMatch = true;
				
		} catch (ClassNotFoundException e) {
			throw new Exception(e.getMessage());
		} catch (IllegalAccessException e) {
			throw new Exception(e.getMessage());
		} catch (InstantiationException e) {
			throw new Exception(e.getMessage());
		}
	}

	public OAuthClient getOAuthClient() {
		return new OAuthClientMgr(tokenDetails.clientId);
	}

	public Principal getPrincipal() {
		User u = new User(tokenDetails.userId);
		u.tenant = tokenDetails.tenant;
		return u;
	}

	public boolean isAuthorized() {
		log.debug("API call authorization = " + tokenMatch);
		return tokenMatch;
	}

	public String getTenant() {
		return tokenDetails.tenant;
	}

}
