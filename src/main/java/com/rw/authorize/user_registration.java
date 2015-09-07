package com.rw.authorize;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.bson.types.ObjectId;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.QueryBuilder;
import com.mongodb.util.JSON;
import com.rw.API.GenericMgr;
import com.rw.API.SecMgr;
import com.rw.API.TenantMgr;
import com.rw.API.User;
import com.rw.persistence.mongoStore;
import com.rw.resources.Common;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Path("/v1/register")
public class user_registration {
	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;
	
	static final Logger log = Logger.getLogger(user_registration.class.getName());

	@POST
	@Consumes("application/x-www-form-urlencoded")
	@Produces({MediaType.APPLICATION_JSON})
	public String createNewMember(
			@FormParam("login") String login,
			@FormParam("password") String password,
			@FormParam("firstName") String firstName,
			@FormParam("lastName") String lastName,
			@FormParam("postalCode") String postalCode,
			@FormParam("invitationId") String invitationId,
			@FormParam("APIKey") String APIKey,
			@FormParam("ClientSecret") String ClientSecret
			
		) throws Exception {		
		JSONObject retVal = new JSONObject();
		
		if ( Common.verifyClientIdAndSecret(APIKey, ClientSecret, request)) {
			try {
	
				SecMgr sm = new SecMgr();
				String ten = request.getAttribute("tenant").toString();
				sm.setTenantKey(ten);
				sm.app.setContext(sm);
				
				JSONObject data = new JSONObject();
				
				data.put("login", login);
				data.put("password", password);
				data.put("firstName", firstName);
				data.put("lastName", lastName);
				data.put("postalCode", postalCode);
				return sm.create(data).toString();
			} catch (Exception e) {
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
				response.flushBuffer();
				throw new WebApplicationException(e);
			}
		}
		else {
			String msg = "Invlid APIKey & Client Secret : " + APIKey + "," + ClientSecret;
			log.debug(msg);
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, msg);
			response.flushBuffer();
			throw new WebApplicationException(Response.status(HttpServletResponse.SC_INTERNAL_SERVER_ERROR).build());
		}
	}
}
