package com.rw.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.binary.Base64;
import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.message.types.ParameterStyle;
import org.apache.oltu.oauth2.rs.request.OAuthAccessResourceRequest;
import org.apache.oltu.oauth2.rs.response.OAuthRSResponse;
import org.apache.oltu.oauth2.rsfilter.OAuthDecision;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.web.servlet.ShiroFilter;
import org.json.JSONException;
import org.json.JSONObject;

import com.rw.API.SecMgr;
import com.rw.API.TenantMgr;
import com.rw.authenticate.AuthenticityDecision;

public class ResourceProvider implements org.apache.oltu.oauth2.rsfilter.OAuthRSProvider {
	static final Logger log = Logger.getLogger(ResourceProvider.class.getName());

	public OAuthDecision validateRequest(String realm, String access_token,
			HttpServletRequest request) throws OAuthProblemException {
		OAuthDecision d = null;
		try {
			d = new AuthenticityDecision(realm, access_token, request);
			log.debug("Validating the API request for access token = " + access_token);
		} catch (Exception e) {
			throw OAuthProblemException.error(e.getMessage());
		}
		return d;
	}
	
}