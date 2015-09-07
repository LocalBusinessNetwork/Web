package com.rw.resources;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

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
import com.rw.persistence.mongoStore;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Path("/objects/{queryParams}")
public class Generic {
	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    SecurityContext securityContext;
	@Context
    HttpServletResponse response;
	
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public String getObject(@PathParam("queryParams") String queryParams) throws Exception {		
		JSONObject retVal = new JSONObject();
		
		try {
			GenericMgr gm = new GenericMgr(request.getAttribute("userid").toString());
			gm.setTenantKey(request.getAttribute("tenant").toString());
			
			JSONObject data = new JSONObject(queryParams);
			retVal = gm.read(data);
			return retVal.toString();
		
		} catch (JSONException e) {
			throw new Exception(e.getMessage());
		}
	}
}
