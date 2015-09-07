package com.rw.authenticate;

import com.rw.resources.Common;

public class OAuthClientMgr implements org.apache.oltu.oauth2.rsfilter.OAuthClient{
	
	protected String clientId = null ;
	public OAuthClientMgr(String clientId) {
		this.clientId = clientId;
	}

	public String getClientId() {
		// TODO Auto-generated method stub
		return clientId;
	}

}
