package com.rw.oauthtest;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;

import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.io.IOUtils;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.apache.oltu.oauth2.common.message.types.ResponseType;
import org.apache.oltu.oauth2.common.utils.OAuthUtils;
import org.json.JSONObject;
import org.junit.Test;

import com.rw.resources.Common;

public class test_setup {
	
	public String access_token = null;
	public String client_id = "a9fa33ec1e8dd84396802ffc4f4ec620";
	public String client_secret = "14b7bf911958f2082b59d5b60d8d4a70";
	
	public void setup() throws Exception {
		
		String state = "MyTestSiteSecret";
		
        OAuthClientRequest request = OAuthClientRequest
            .authorizationLocation(Common.AUTHORIZATION_ENDPOINT)
            .setClientId(client_id)
            .setParameter(OAuth.OAUTH_CLIENT_SECRET, client_secret)
            .setRedirectURI(Common.NEWTOKEN_ENDPOINT)
            .setResponseType(ResponseType.CODE.toString())
            .setState(state)
            .buildQueryMessage();

        URL url = new URL(request.getLocationUri());
        
        HttpURLConnection c = (HttpURLConnection)url.openConnection();

        c.setInstanceFollowRedirects(true);
        c.connect();
        int i = c.getResponseCode();
        
        InputStream in = c.getInputStream();
        String encoding = c.getContentEncoding();
        encoding = encoding == null ? "UTF-8" : encoding;
        JSONObject retVal = new JSONObject(IOUtils.toString(in, encoding));
        
        String authcode = retVal.getString("code");
        String grant_type = retVal.getString("grant_type");
        String response_type = retVal.getString("response_type");
        
        assertNotNull(authcode);
        assertEquals(state, retVal.getString("state"));
        assertEquals("password", grant_type);
        assertEquals("token", response_type);
        
                
        request = OAuthClientRequest
                .authorizationLocation(Common.NEWTOKEN_ENDPOINT)
                .setParameter(OAuth.OAUTH_CODE, authcode)
                .setParameter(OAuth.OAUTH_GRANT_TYPE, grant_type)
                .setParameter("username", "admin.user@referralwire.com")
                .setParameter("password", "123456")
                .setClientId(client_id)
                .setParameter(OAuth.OAUTH_CLIENT_SECRET, client_secret)
                .setRedirectURI(Common.GETTOKEN_ENDPOINT)
                .setResponseType(response_type)
                .setState(state)
                .buildQueryMessage();
        
        url = new URL(request.getLocationUri());
        
        c = (HttpURLConnection)url.openConnection();
      
        if (c instanceof HttpURLConnection) {
            HttpURLConnection httpURLConnection = (HttpURLConnection)c;
            httpURLConnection.setRequestMethod("POST");
            httpURLConnection.setRequestProperty("content-type", "application/x-www-form-urlencoded");
        }
            
        c.connect();
        i = c.getResponseCode();
        
        in = c.getInputStream();
        encoding = c.getContentEncoding();
        encoding = encoding == null ? "UTF-8" : encoding;
        String body = IOUtils.toString(in, encoding);
        
        JSONObject data = new JSONObject(body);
        
        access_token = data.getString("access_token");
        
        System.out.println("Access Token = " + access_token);
        
	}
	
}
