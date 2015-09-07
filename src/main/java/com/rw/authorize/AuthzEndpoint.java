/**
 *       Copyright 2010 Newcastle University
 *
 *          http://research.ncl.ac.uk/smart/
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.rw.authorize;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.apache.oltu.oauth2.as.request.OAuthAuthzRequest;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.error.OAuthError;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.message.types.ResponseType;
import org.apache.oltu.oauth2.common.utils.OAuthUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.tools.view.VelocityView;

import com.rw.authenticate.OAuthRedisRealm;
import com.rw.resources.Common;

/**
 *
 *
 *
 */
@Path("/authorize")
public class AuthzEndpoint {
	
	static final Logger log = Logger.getLogger(AuthzEndpoint.class.getName());

	@GET
    public Response authorize(@Context HttpServletRequest request, @Context HttpServletResponse res)
        throws URISyntaxException, OAuthSystemException {
        OAuthAuthzRequest oauthRequest = null;
        OAuthIssuerImpl oauthIssuerImpl = new OAuthIssuerImpl(new MD5Generator());
        
        // let us save the authz code for this client
        OAuthRedisRealm r = new OAuthRedisRealm();
        r.setServletContext(request);
        
        log.debug("Authz request recieved");
        try {
            oauthRequest = new OAuthAuthzRequest(request);
            log.debug("OAUTH request has been created");
            String clientId = oauthRequest.getClientId();
            if (!Common.verifyClientId(clientId, request)) {
                log.debug("Client Id Validation failed");
                OAuthResponse response =
                    OAuthASResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                        .setError(OAuthError.TokenResponse.INVALID_CLIENT).setErrorDescription(Common.INVALID_CLIENT_DESCRIPTION)
                        .buildJSONMessage();
                return Response.status(response.getResponseStatus()).entity(response.getBody()).build();
            }

            //build response according to response_type
            String responseType = oauthRequest.getParam(OAuth.OAUTH_RESPONSE_TYPE);
            String authzCode = oauthIssuerImpl.authorizationCode();
            log.debug("Created Authorization Code = " + authzCode);
            OAuthASResponse.OAuthAuthorizationResponseBuilder builder = OAuthASResponse
                .authorizationResponse(request,HttpServletResponse.SC_FOUND);
            if (responseType.equals(ResponseType.CODE.toString())) {
                builder.setCode(authzCode);
            }
                   
            if (responseType.equals(ResponseType.TOKEN.toString())) {
                builder.setAccessToken(authzCode);
                builder.setExpiresIn(3600l);
            }
            
            
            String redirectURI = oauthRequest.getParam(OAuth.OAUTH_REDIRECT_URI);

            final OAuthResponse response = builder.location(redirectURI).buildQueryMessage();
            URI url = new URI(response.getLocationUri());
            
            // save this authorization code
            r.putClient(authzCode, clientId);
        
            PrintWriter out = null;
	     	res.setContentType("text/html");
			
			VelocityView v = new VelocityView(request.getServletContext());
    		Template template = v.getTemplate("/APIWeb/admin/authform.vm");
    		StringWriter sw = new StringWriter();
    		VelocityContext context = new VelocityContext();
    		
    		context.put("client_id", clientId);
    		context.put("client_secret", Common.CLIENT_SECRET);
    		context.put("grant_type", "password");
    		context.put("response_type", "token");
    		context.put("code", authzCode);

    		template.merge( context, sw );
    	
			out = res.getWriter();
			out.print(sw.toString());
			out.flush();
			
            log.debug("Created Login Challenge for Authorization Code = " + authzCode);
			
            return Response.status(response.getResponseStatus()).location(url).build();

        } catch (OAuthProblemException e) {

            final Response.ResponseBuilder responseBuilder = Response.status(HttpServletResponse.SC_FOUND);

            String redirectUri = e.getRedirectUri();

            if (OAuthUtils.isEmpty(redirectUri)) {
                throw new WebApplicationException(
                    responseBuilder.entity("OAuth callback url needs to be provided by client!!!").build());
            }
            final OAuthResponse response = OAuthASResponse.errorResponse(HttpServletResponse.SC_FOUND)
                .error(e)
                .location(redirectUri).buildQueryMessage();
            final URI location = new URI(response.getLocationUri());
            log.debug("Exception is creating the auth code");
            return responseBuilder.location(location).build();
		} catch (IOException e) {
		    log.debug("Template Read issue for /APIWeb/admin/authform.vm");
			throw new OAuthSystemException(e.getMessage());
		} catch (Exception e) {
		   log.debug("Template Read issue for /APIWeb/admin/authform.vm");
		   throw new OAuthSystemException(e.getMessage());
		}

    }
	
}