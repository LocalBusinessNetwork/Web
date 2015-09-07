package com.rw.authorize;

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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
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
import com.rw.API.TenantMgr;
import com.rw.API.User;
import com.rw.persistence.mongoStore;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Path("/apiapp")
public class RegstrationEndPoint {
	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;
	@Context 
	SecurityContext sc;
	
	static final Logger log = Logger.getLogger(RegstrationEndPoint.class.getName());

	@POST
	@Consumes("application/x-www-form-urlencoded")
	@Produces({MediaType.APPLICATION_JSON})
	public String createObject(
			@FormParam("id") String id,
			@FormParam("tenant_id") String tenant_id,
			@FormParam("appName") String appName,
			@FormParam("appUrl") String appUrl,
			@FormParam("appIcon") String appIcon,
			@FormParam("appDescription") String appDescription,
			@FormParam("CorsUris") String CorsUris
		) throws Exception {		
		JSONObject retVal = new JSONObject();
		
		try {
			
			User u = (User) sc.getUserPrincipal();
			TenantMgr tm = new TenantMgr(u.userId);
			tm.setTenantKey(u.tenant);
			
			JSONObject tenantContext  = tm.getTenant(null);
			
			JSONObject data = new JSONObject();
		
			if ( id != null ) {
				data.put("id", id);
				log.debug("updating an existing app definition");
			}
			else {
				OAuthIssuerImpl oauthIssuerImpl = new OAuthIssuerImpl(new MD5Generator());
				data.put("appClientId", oauthIssuerImpl.accessToken());
				data.put("appClientSecret", oauthIssuerImpl.authorizationCode());
				log.debug("creating a new app definition");
				if ( tenant_id != null )
					data.put("tenant_id", tenant_id);
			}
			
			if ( appName != null )
				data.put("appName", appName);
			
			if ( appUrl != null )
				data.put("appUrl", appUrl);
			
			if ( appIcon != null )
				data.put("appIcon", appIcon);
			
			if ( appDescription != null )
				data.put("appDescription", appDescription);

			if ( CorsUris != null )
				data.put("CorsUris", CorsUris);
			
			return tm.putAPIAppDef(data).toString();
		
		} catch (JSONException e) {
			throw new Exception(e.getMessage());
		}
	}

	@DELETE
	@Consumes("application/x-www-form-urlencoded")
	@Produces({MediaType.APPLICATION_JSON})
	public String deleteObject(
			@FormParam("id") String id) throws Exception {		
		JSONObject retVal = new JSONObject();
		try {
			User u = (User) sc.getUserPrincipal();
			TenantMgr tm = new TenantMgr(u.userId);
			tm.setTenantKey(u.tenant);
			JSONObject data = new JSONObject();
			data.put("id",id);
			return tm.deleteAPIAppDef(data).toString();
		} catch (JSONException e) {
			throw new Exception(e.getMessage());
		}
	}

}
