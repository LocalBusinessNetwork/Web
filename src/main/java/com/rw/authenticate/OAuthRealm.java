package com.rw.authenticate;

import javax.servlet.http.HttpServletRequest;

import org.apache.oltu.oauth2.common.token.BasicOAuthToken;
import org.json.JSONObject;

public interface OAuthRealm {
	
	public RWOAuthToken getToken(String token);
	public boolean putToken(String token, RWOAuthToken details);
	public void setServletContext(HttpServletRequest request);

}
