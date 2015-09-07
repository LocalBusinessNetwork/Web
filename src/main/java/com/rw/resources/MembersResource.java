package com.rw.resources;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
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
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.subject.Subject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVWriter;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.rw.API.PartyMgr;
import com.rw.API.SecMgr;
import com.rw.API.UserMgr;
import com.rw.common.CSVimpl;
import com.rw.persistence.mongoStore;

@Path("/v1/members")
public class MembersResource {
	
	static final Logger log = Logger.getLogger(MembersResource.class.getName());
	
	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;
	
	
	
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public String memberSearch(
			@QueryParam("searchText") String searchText,
			@QueryParam("fields") String fields,
			@QueryParam("skip") String skip,
			@QueryParam("savedSearch") String savedSearch
			) throws Exception {		

		JSONObject data = new JSONObject();
		
		if ( searchText != null )
			data.put("searchText", searchText);
		
		if ( skip != null )
			data.put("skip", skip);
			
		data.put("shape", "Skinny" );
		data.put("limit", "20" );
		
		PartyMgr p = new PartyMgr(request.getAttribute("userid").toString());
		p.setTenantKey(request.getAttribute("tenant").toString());
		return p.read(data).toString();
	
	}
	
	
	@GET @Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public String memberRecord(
			@PathParam("id") String id,
			@QueryParam("fields") String fields
			) throws Exception {		
		
		JSONObject data = new JSONObject();
		Pattern mongoId = Pattern.compile("^[0-9a-fA-F]{24}$");
		Matcher matcher1 = mongoId.matcher(id);
		if ( matcher1.find() ) {
			data.put("id", id );
			data.put("partytype","PARTNER" );
			PartyMgr p = new PartyMgr(request.getAttribute("userid").toString());
			p.setTenantKey(request.getAttribute("tenant").toString());
			return p.read(data).toString();
		}
		else return null;
	}
	
	@GET @Path("/me")
	@Produces({MediaType.APPLICATION_JSON})
	public String me(
			@QueryParam("fields") String fields
			) throws Exception {				
		JSONObject data = new JSONObject();
		UserMgr u = new UserMgr(request.getAttribute("userid").toString());
		u.setTenantKey(request.getAttribute("tenant").toString());
		return u.read(data).toString();		
	}
	
	@PUT @Path("/me")
	@Consumes("application/x-www-form-urlencoded")
	@Produces({MediaType.APPLICATION_JSON})
	public String updatePassword(
			@FormParam("id") String id,
			@FormParam("password") String password) throws Exception {		
		JSONObject retVal = new JSONObject();
		return retVal.toString();
	}
	
	@GET @Path("/csv")
	@Produces({MediaType.APPLICATION_OCTET_STREAM})
	public String bulkCsv() throws Exception {
		CSVimpl csvImpl = new CSVimpl();
		return csvImpl.members(request);
	}
		
}
