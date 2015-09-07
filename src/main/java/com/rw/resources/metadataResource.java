package com.rw.resources;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
import com.rw.API.RepoMgr;
import com.rw.API.SecMgr;
import com.rw.API.UserMgr;
import com.rw.persistence.mongoStore;

@Path("/v1/repository")
public class metadataResource {
	
	static final Logger log = Logger.getLogger(metadataResource.class.getName());

	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;

	@GET @Path("/buscomps")
	@Produces({MediaType.APPLICATION_JSON})
	public String getallbuscomp() throws Exception {		
		JSONObject data = new JSONObject();
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}

	@POST @Path("/buscomps")
	@Produces({MediaType.APPLICATION_JSON})
	public String newbuscomp(
			@FormParam("name") String name,
			@FormParam("dataclass") String dataclass,
			@FormParam("accessor") String accessor,
			@FormParam("field") String field,
			@FormParam("join") String join
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}

	

	@GET @Path("/buscomps/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String getbuscomp(
			@PathParam("name") String name,
			@QueryParam("fields") String fields
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}

	@PUT @Path("/buscomps/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String updatebuscomp(
			@PathParam("name") String name,
			@FormParam("dataclass") String dataclass,
			@FormParam("accessor") String accessor,
			@FormParam("field") String field,
			@FormParam("join") String join
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}

	@DELETE @Path("/buscomps/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String deletebuscomp(
			@PathParam("name") String name
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}
	
	@POST @Path("/applets")
	@Produces({MediaType.APPLICATION_JSON})
	public String newapplet(
			@FormParam("name") String name,
			@FormParam("type") String type,
			@FormParam("pluralTitle") String pluralTitle,
			@FormParam("singularTitle") String singularTitle,
			@FormParam("editTitle") String editTitle,
			@FormParam("actor") String actor,
			@FormParam("field") String field
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.Applet(data).toString();
	}

	@GET @Path("/applets")
	@Produces({MediaType.APPLICATION_JSON})
	public String getallapplets() throws Exception {		
		JSONObject data = new JSONObject();
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}

	@GET @Path("/applet/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String applet(
			@PathParam("name") String name,
			@QueryParam("fields") String fields
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.Applet(data).toString();
	}

	@PUT @Path("/applets/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String updateapplet(
			@PathParam("name") String name,
			@FormParam("type") String type,
			@FormParam("pluralTitle") String pluralTitle,
			@FormParam("singularTitle") String singularTitle,
			@FormParam("editTitle") String editTitle,
			@FormParam("actor") String actor,
			@FormParam("field") String field
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.Applet(data).toString();
	}

	@DELETE @Path("/applets/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String deleteaplet(
			@PathParam("name") String name
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.Applet(data).toString();
	}
	
	@POST @Path("/busobjs")
	@Produces({MediaType.APPLICATION_JSON})
	public String newbo(
			@FormParam("name") String name,
			@FormParam("bc") String bc
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}
	
	@GET @Path("/busobjs/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String busobj(
			@PathParam("name") String name,
			@QueryParam("fields") String fields
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusObj(data).toString();
	}

	
	@PUT @Path("/busobjs/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String updatebo(
			@FormParam("name") String name,
			@FormParam("bc") String bc
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.BusComp(data).toString();
	}
	
	
	@DELETE @Path("/busobjs/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String deletebo(
			@PathParam("name") String name
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.Applet(data).toString();
	}
	
	
	@GET @Path("/chartApplet/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String chartApplet(
			@PathParam("name") String name,
			@QueryParam("fields") String fields
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.ChartApplet(data).toString();
	}

	@GET @Path("/chartdefinition/{name}")
	@Produces({MediaType.APPLICATION_JSON})
	public String chartDefinition(
			@PathParam("name") String name,
			@QueryParam("fields") String fields
			) throws Exception {		

		JSONObject data = new JSONObject();
		data.put("name", name);
		
		RepoMgr r = new RepoMgr(request.getAttribute("userid").toString());
		r.setTenantKey(request.getAttribute("tenant").toString());
		return r.ChartApplet(data).toString();
	}
	
	
}
