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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.rw.API.GenericMgr;
import com.rw.API.TenantMgr;
import com.rw.persistence.mongoMaster;
import com.rw.persistence.mongoStore;

@Path("/v1/account")
public class Tenant {
	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;
	
	String bo = null;
	String bc = null;
	
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public String getMembers() throws Exception {		
		JSONArray retVal = new JSONArray();
		TenantMgr t = new TenantMgr(request.getAttribute("userid").toString());
		t.setTenantKey(request.getAttribute("tenant").toString());
		t.app.setContext(t);
		return t.read(null).toString();
	}
}
