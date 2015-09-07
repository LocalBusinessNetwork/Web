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

public class memberscsv extends test_setup {
	
	@Before
	public void setUp() throws Exception {
		super.setup();
	}
	
	@Test
    public void test() throws Exception {
	         
        URL url = new URL(Common.RESOURCE_SERVER + "/v1/members/csv");
        HttpURLConnection c = (HttpURLConnection) url.openConnection();
        c.addRequestProperty(Common.HEADER_AUTHORIZATION, "Bearer " + access_token);

        if (c instanceof HttpURLConnection) {
            HttpURLConnection httpURLConnection = (HttpURLConnection)c;
            httpURLConnection.setRequestMethod("GET");
        }
 
        InputStream in = c.getInputStream();
        String encoding = c.getContentEncoding();
        encoding = encoding == null ? "UTF-8" : encoding;
        String body = IOUtils.toString(in, encoding);
        
        // print CSV output
        System.out.println(body);
             
    }
	
}
