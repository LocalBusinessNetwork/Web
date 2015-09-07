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
import com.rw.API.RfrlMgr;
import com.rw.API.SecMgr;
import com.rw.API.UserMgr;
import com.rw.persistence.mongoStore;

@Path("/v1/referrals")
public class ReferralsResource extends RfrlMgr {
	
	static final Logger log = Logger.getLogger(ReferralsResource.class.getName());

	@Context
	UriInfo uriInfo;
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;
	
	@GET
	@Produces({MediaType.APPLICATION_JSON})
	public String Search(
			@QueryParam("searchText") String searchText,
			@QueryParam("fields") String fields,
			@QueryParam("skip") String skip,
			@QueryParam("savedSearch") String savedSearch
			) throws Exception {		
		
		setUserId(request.getAttribute("userid").toString());
		setTenantKey(request.getAttribute("tenant").toString());

		JSONObject data = new JSONObject();
		
		if ( searchText != null )
			data.put("searchText", searchText);
		
		if ( skip != null )
			data.put("skip", skip);
			
		data.put("shape", "Skinny" );
		data.put("limit", "20" );
		
		setUserId(request.getAttribute("userid").toString());
		setTenantKey(request.getAttribute("tenant").toString());
		return read(data).toString();
	
	}
	
	@POST
	@Consumes("application/x-www-form-urlencoded")
	@Produces({MediaType.APPLICATION_JSON})
	public String newEntity(
			@FormParam("login") String login,
			@FormParam("password") String password,
			@FormParam("firstName") String firstName,
			@FormParam("lastName") String lastName,
			@FormParam("postalCode") String postalCode,
			@FormParam("invitationId") String invitationId
		) throws Exception {		
		JSONObject retVal = new JSONObject();
		
		try {
			
			setUserId(request.getAttribute("userid").toString());
			setTenantKey(request.getAttribute("tenant").toString());

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
		
		} catch (JSONException e) {
			throw new Exception(e.getMessage());
		}
	}

	@GET @Path("/{id}")
	@Produces({MediaType.APPLICATION_JSON})
	public String entityRecord(
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
	public String myEntity(
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
		
		mongoStore store = new mongoStore(request.getAttribute("tenant").toString());
		
		try {
			store.beginTrans();
			store.requestEnsureConnection();	
			DBCursor cursorDoc = null;
				
			BasicDBObject s = new BasicDBObject();
			s.put("firstName", 1);
			s.put("lastName", 1);
			s.put("emailAddress", 1);
			s.put("postalCodeAddress_work", 1);
			s.put("isAmbassador", 1);
			s.put("isSpeaker", 1);
			s.put("InvitationCode", 1);
			s.put("memberProfileScore", 1);
			s.put("speakerProfileScore", 1);
			
			BasicDBObject q = new BasicDBObject();
			q.put("partytype","PARTNER");
			
			cursorDoc = store.getColl("rwParty").find(q,s);
			
			StringWriter writer = new StringWriter();
			
			CSVWriter csvw = new CSVWriter(writer);
			List<String[]> list = new ArrayList<String[]>();

			while (cursorDoc.hasNext()) {
				
				DBObject row = cursorDoc.next();
				
				String[] o = new String[9];
				
				o[0] = row.get("firstName") == null ? "undefined" : row.get("firstName").toString();
				o[1] = row.get("lastName") == null ? "undefined" : row.get("lastName").toString();
				o[2] = row.get("emailAddress") == null ? "undefined" : row.get("emailAddress").toString();
				o[3] = row.get("postalCodeAddress_work") == null ? "undefined" : row.get("postalCodeAddress_work").toString();
				o[4] = row.get("isSpeaker") == null ? "undefined" : row.get("isSpeaker").toString();
				o[5] = row.get("InvitationCode").toString();
				o[6] = row.get("memberProfileScore") == null ? "undefined" : row.get("memberProfileScore").toString();
				o[7] = row.get("speakerProfileScore") == null ? "undefined" : row.get("speakerProfileScore").toString();
								
			
				BasicDBObject q2 = new BasicDBObject();
				q2.put("partytype", "BUSINESS");
				q2.put("ambassadorId", row.get("_id").toString());
				
				String ambassadorType = null;
				
				if ( store.getColl("rwParty").findOne(q2) != null )
					ambassadorType = "Lead Ambassador";
				
				if ( ambassadorType == null && row.get("isAmbassador") != null) {
					String ab =  row.get("isAmbassador").toString();
					if ( !ab.isEmpty() && ab.equals("true") ) {
						ambassadorType = "Associate Ambassador";
					}
				}
				o[8] = ambassadorType == null ? "undefined" :ambassadorType ;
				
				list.add( o );
			}
			csvw.writeAll(list);
			
			log.debug("Returning member.csv information");
			
			return writer.toString();

		} catch (JSONException e) {
			throw new Exception(e.getMessage());
		}
		finally {
			store.endTrans();
		}
		
	}
	
}
