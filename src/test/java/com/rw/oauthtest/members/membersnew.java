package com.rw.oauthtest.members;

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
import org.apache.http.message.BasicNameValuePair;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.apache.oltu.oauth2.common.message.types.ResponseType;
import org.apache.oltu.oauth2.common.utils.OAuthUtils;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;

import com.rw.oauthtest.test_setup;
import com.rw.resources.Common;

public class membersnew extends test_setup {

	@Before
	public void setUp() throws Exception {
		// super.setup();
	}
	
	@Test
    public void test() throws Exception {
		
	        
		URL url = new URL( Common.RESOURCE_SERVER + "/authz/v1/register");        
		HttpURLConnection c = (HttpURLConnection) url.openConnection();

        c.setRequestMethod("POST");
        c.setRequestProperty("content-type", "application/x-www-form-urlencoded");
        c.setDoInput(true);
        c.setDoOutput(true);
 
        List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
        
        params.add(new BasicNameValuePair("login", "john10.smith2@referralwire.com"));
        params.add(new BasicNameValuePair("password", "123456"));
        params.add(new BasicNameValuePair("firstName", "John"));
        params.add(new BasicNameValuePair("lastName", "Smith"));
        params.add(new BasicNameValuePair("postalCode", "94582"));
        params.add(new BasicNameValuePair("invitationId", "OI6DE6C2CE"));
        params.add(new BasicNameValuePair("APIKey", client_id));
        params.add(new BasicNameValuePair("ClientSecret", client_secret));
        
        c.connect();
               
        UrlEncodedFormEntity formEntity = new UrlEncodedFormEntity(params); 
     
        OutputStream output = null;
        try {
        	  output = c.getOutputStream();    
        	  formEntity.writeTo(output);
        } finally {
        	 if (output != null) 
        		 	try { 
        		 		output.close(); 
        		 	} 
        	 		catch (IOException ioe) {}
        }
        
        int i = c.getResponseCode();
        
        if ( i == 200 ) {
	        InputStream in = c.getInputStream();
	        String encoding = c.getContentEncoding();
	        encoding = encoding == null ? "UTF-8" : encoding;
	        String body = IOUtils.toString(in, encoding);
	        
	        JSONObject data = new JSONObject(body);
	        System.out.println(data);
        }
        else {
        	System.out.println(c.getResponseMessage());
        }
        
    }
	
}
