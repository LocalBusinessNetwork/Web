package com.rw.authenticate;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.common.token.BasicOAuthToken;
import org.json.JSONObject;

import com.rw.API.TenantMgr;
import com.rw.authorize.RegstrationEndPoint;
import com.rw.persistence.JedisMT;

public class OAuthRedisRealm implements OAuthRealm {
	public String tenant = null;
	public static JedisMT jedisMt = new JedisMT();
	
	static final Logger log = Logger.getLogger(OAuthRedisRealm.class.getName());

	public OAuthRedisRealm() {
	}
	
	public RWOAuthToken getToken(String token) {
		
		String tk = jedisMt.get(token);
		if ( tk == null ) return null;
		else {
			try {
				return new RWOAuthToken(tk);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				log.debug(e.getStackTrace());
			}
		}
		return null;
	}

	public boolean putToken(String token, RWOAuthToken details) {
		jedisMt.set(token, details.toString());
		// TODO : set Expiration policy for these tokens
		return false;
	}


	public String getClient(String token) {
		return jedisMt.get(token);
	}

	public void putClient(String token, String client) {
		jedisMt.set(token, client);
	}

	public void closeAuthzCode(String token) {
		jedisMt.del(token);
	}

	public void setServletContext(HttpServletRequest request) {
			tenant = request.getAttribute("tenant").toString();
			jedisMt.setTenant(tenant);
	}
	
}
