package com.rw.resources;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVWriter;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.rw.API.BusinessMgr;
import com.rw.API.OrgMgr;
import com.rw.API.PartyMgr;
import com.rw.API.UserMgr;
import com.rw.persistence.mongoStore;

@Path("/v1/groups")
public class OrganizationResource {
	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;
	
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public String getChapters(
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
		
		OrgMgr p = new OrgMgr(request.getAttribute("userid").toString());
		p.setTenantKey(request.getAttribute("tenant").toString());
		return p.read(data).toString();
	}
	
	@GET @Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public String groupRecord(
			@PathParam("id") String id,
			@QueryParam("fields") String fields
			) throws Exception {		
		
		JSONObject data = new JSONObject();
		Pattern mongoId = Pattern.compile("^[0-9a-fA-F]{24}$");
		Matcher matcher1 = mongoId.matcher(id);
		if ( matcher1.find() ) {
			data.put("id", id );
			OrgMgr p = new OrgMgr(request.getAttribute("userid").toString());
			p.setTenantKey(request.getAttribute("tenant").toString());
			return p.read(data).toString();
		}
		else return null;
	}
	
	@GET @Path("/mygroup")
	@Produces({MediaType.APPLICATION_JSON})
	public String mygroup(
			@QueryParam("fields") String fields
			) throws Exception {				
		JSONObject data = new JSONObject();
		
		OrgMgr p = new OrgMgr(request.getAttribute("userid").toString());
		p.setTenantKey(request.getAttribute("tenant").toString());
		return p.read(data).toString();
		
	}
	
	@GET @Path("/csv")
	public String bulkCsv() throws Exception {
		
		mongoStore store = new mongoStore(request.getAttribute("tenant").toString());
		
		try {
			store.beginTrans();
			store.requestEnsureConnection();	
			DBCursor cursorDoc = null;
				
			BasicDBObject s = new BasicDBObject();
			BasicDBObject q = new BasicDBObject();
			q.put("partytype", "BUSINESS");
			s.put("businessName", 1);
			s.put("ambassador", 1);
			s.put("city", 1);
			s.put("postalCode", 1);
		
			cursorDoc = store.getColl("rwParty").find(q,s);
			
			StringWriter writer = new StringWriter();
			
			CSVWriter csvw = new CSVWriter(writer);
			List<String[]> list = new ArrayList<String[]>();

			while (cursorDoc.hasNext()) {
				
				DBObject row = cursorDoc.next();
				
				String[] o = new String[4];
				
				o[0] = row.get("businessName").toString();
				o[1] = row.get("ambassador").toString();
				o[2] = row.get("city").toString();
				o[2] = row.get("postalCode").toString();
				
				list.add( o );
			}

			csvw.writeAll(list);
			return writer.toString();

		} catch (JSONException e) {
			throw new Exception(e.getMessage());
		}
		finally {
			store.endTrans();
		}
	}
}
