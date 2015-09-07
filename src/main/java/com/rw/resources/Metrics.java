package com.rw.resources;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.rw.API.PartyMgr;
import com.rw.common.GoogleAnalytics;
import com.rw.persistence.RWJBusComp;

@Path("/v1/metrics")
public class Metrics {
	static final Logger log = Logger.getLogger(Metrics.class.getName());
	
	@Context
	HttpServletRequest request;
	@Context
    HttpServletResponse response;
		
	@GET @Path("/pageviews/me")
	@Produces({MediaType.APPLICATION_JSON})
	public String myPublicProfilePageViews () throws Exception {	
		GoogleAnalytics ga = new GoogleAnalytics();
		JSONObject retVal = new JSONObject();
		
		PartyMgr pm = new PartyMgr();
		pm.setTenantKey(request.getAttribute("tenant").toString());
		pm.setUserId(request.getAttribute("userid").toString());
		
		String party_id = pm.GetPartyId();
		RWJBusComp partyRecord = pm.getPartyRecord(party_id);
		
		JSONObject tenantObj = pm.getTenant(null);

		String publicId = partyRecord.GetFieldValue("InvitationCode").toString();
		
		retVal.put("profileviews", ga.publicProfileViews(  "/" + publicId.toLowerCase() + ".html", tenantObj));
		
		return retVal.toString();
	}
			
}
