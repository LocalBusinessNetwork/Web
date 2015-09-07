package com.rw.authenticate;

import java.io.IOException;
import java.io.ObjectStreamException;
import java.io.Serializable;

import org.apache.log4j.Logger;
import org.eclipse.jetty.util.log.Log;
import org.json.JSONException;
import org.json.JSONObject;

public class RWOAuthToken implements org.apache.oltu.oauth2.common.token.OAuthToken {

	static final Logger log = Logger.getLogger(RWOAuthToken.class.getName());

	protected String accessToken = null;
    protected Long expiresIn = 3600L;
    protected String refreshToken = "NONE";
    protected String scope = "ALL";
    protected String userId = null;
    protected String tenant = null;
    protected String clientId = null;
    
    public RWOAuthToken() {	
    }
    
    public RWOAuthToken(String  str) throws Exception {
    	try {
			JSONObject data = new JSONObject( str) ;
			accessToken = data.getString("access_token");
			
			if ( data.has("expiresIn"))
				expiresIn = Long.parseLong(data.getString("expiresIn"));
			
			if ( data.has("refreshToken"))
				refreshToken = data.getString("refreshToken");
			
			if ( data.has("scope"))
				scope = data.getString("scope");
			
			userId = data.getString("userId");
			tenant = data.getString("tenant");
			clientId = data.getString("clientId");
					
		} catch (JSONException e) {
			throw new Exception(e.getMessage());
		}
    }
    
	public String getAccessToken() {
		// TODO Auto-generated method stub
		return accessToken;
	}

	public Long getExpiresIn() {
		// TODO Auto-generated method stub
		return expiresIn;
	}

	public String getRefreshToken() {
		// TODO Auto-generated method stub
		return refreshToken;
	}

	public String getScope() {
		// TODO Auto-generated method stub
		return scope;
	}
	
	public String getUserId() {
		// TODO Auto-generated method stub
		return userId;
	}
	
	public String getTenant() {
		// TODO Auto-generated method stub
		return tenant;
	}
	
	public void  setAccessToken(String access_token) {
		// TODO Auto-generated method stub
		accessToken = access_token ;
	}

	public void setExpiresIn(long msecs) {
		// TODO Auto-generated method stub
		expiresIn = msecs;
	}

	public void setRefreshToken(String refToken) {
		// TODO Auto-generated method stub
		refreshToken = refToken;
	}

	public void setScope(String scope) {
		// TODO Auto-generated method stub
		scope = scope;
	}
	
	public void  setUserId(String uid) {
		// TODO Auto-generated method stub
		userId = uid;
	}
	
	public void  setTenant(String tid) {
		// TODO Auto-generated method stub
		tenant = tid;
	}
	
	public String toString() {
		
		JSONObject data = new JSONObject();
		try {
			data.put("access_token", accessToken);
			data.put("expiresIn", expiresIn);
			data.put("refreshToken", refreshToken);
			data.put("scope", scope);
			data.put("userId", userId);
			data.put("tenant", tenant);
			data.put("clientId", clientId);
			return data.toString();
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			log.debug(e.getStackTrace());
		}
		
		return null;
		
	}

	public void setClientId(String clientId) {
		// TODO Auto-generated method stub
		this.clientId = clientId;
	}
	
	public String getClientId() {
		// TODO Auto-generated method stub
		return clientId;
	}

}
