package com.rw.authorize;

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


import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuer;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.apache.oltu.oauth2.as.request.OAuthTokenRequest;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.error.OAuthError;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.tools.view.VelocityView;

import com.rw.API.User;
import com.rw.authenticate.OAuthRedisRealm;
import com.rw.authenticate.RWOAuthToken;
import com.rw.resources.Common;


/**
 *
 *
 *
 */

@Path("/token")
public class NewTokenEndPointForWebClient {
	
    @GET
    @Produces("application/json")
    public Response authorize(@Context HttpServletRequest request) throws OAuthSystemException {

    	OAuthTokenRequest oauthRequest = null;

    	OAuthIssuer oauthIssuerImpl = new OAuthIssuerImpl(new MD5Generator());

        OAuthRedisRealm r = new OAuthRedisRealm();
        r.setServletContext(request);
        
        try {
            oauthRequest = new OAuthTokenRequest(request);

            String clientId = oauthRequest.getClientId();
            if (!Common.verifyClientId(clientId, request)) {
                OAuthResponse response =
                    OAuthASResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                        .setError(OAuthError.TokenResponse.INVALID_CLIENT).setErrorDescription(Common.INVALID_CLIENT_DESCRIPTION)
                        .buildJSONMessage();
                return Response.status(response.getResponseStatus()).entity(response.getBody()).build();
            }

            String authzCode = oauthRequest.getParam(OAuth.OAUTH_CODE);
            String clientId2 = r.getClient(authzCode);
            // see if this authz code was allocated to this client
            if ( clientId2.equals(clientId)) {
                OAuthResponse response =
                        OAuthASResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                            .setError(OAuthError.TokenResponse.INVALID_CLIENT).setErrorDescription(Common.INVALID_CLIENT_DESCRIPTION)
                            .buildJSONMessage();
                    return Response.status(response.getResponseStatus()).entity(response.getBody()).build();
            }
            
            // good progress...web clients support only Authorization code
            if (!oauthRequest.getParam(OAuth.OAUTH_GRANT_TYPE)
                    .equals(GrantType.AUTHORIZATION_CODE.toString())) {
                OAuthResponse response =
                        OAuthASResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST)
                            .setError(OAuthError.TokenResponse.INVALID_CLIENT).setErrorDescription(Common.INVALID_CLIENT_DESCRIPTION)
                            .buildJSONMessage();
                    return Response.status(response.getResponseStatus()).entity(response.getBody()).build();
            	
            }

            // OK, we are ready to allocate a new access token.
            r.closeAuthzCode(authzCode);
            
            String newToken = oauthIssuerImpl.accessToken();
            
            RWOAuthToken t = new RWOAuthToken();
            
            t.setAccessToken(newToken);
            t.setExpiresIn(3600);
            
        	Subject currentUser = SecurityUtils.getSubject();

        	PrincipalCollection  pl = currentUser.getPrincipals();
  	        User u = (User) pl.getPrimaryPrincipal();
  	        t.setUserId(u.userId);
            t.setTenant(r.tenant);

            r.putToken(newToken, t);

            OAuthResponse response = OAuthASResponse
                .tokenResponse(HttpServletResponse.SC_OK)
                .setAccessToken(newToken)
                .setTokenType(OAuth.OAUTH_TOKEN)
                .setExpiresIn("3600")
                .buildJSONMessage();
            return Response.status(response.getResponseStatus()).entity(response.getBody()).build();

        } catch (OAuthProblemException e) {
            OAuthResponse res = OAuthASResponse.errorResponse(HttpServletResponse.SC_BAD_REQUEST).error(e)
                .buildJSONMessage();
            return Response.status(res.getResponseStatus()).entity(res.getBody()).build();
		} catch (Exception e) {
			   throw new OAuthSystemException(e.getMessage());
		}
   }

}