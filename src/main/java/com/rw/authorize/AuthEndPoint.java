package com.rw.authorize;

import java.io.StringWriter;
import java.net.URI;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import org.apache.log4j.Logger;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.utils.OAuthUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.tools.view.VelocityView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.rw.API.GenericMgr;
import com.rw.API.RWReqHandle;
import com.rw.API.TenantMgr;
import com.rw.persistence.mongoMaster;
import com.rw.persistence.mongoStore;
import com.rw.security.DelegatingShiroFilter;

@Path("/authenticate")
public class AuthEndPoint {
	static final Logger log = Logger.getLogger(AuthEndPoint.class.getName());
	
	@Context
    SecurityContext securityContext;
	
	@GET
	@Produces({MediaType.TEXT_HTML})
	public String AuthenticationForm(@Context HttpServletRequest request, @Context HttpServletResponse res) throws Exception {	
		String mode = request.getParameter("display");
		VelocityView v = new VelocityView(request.getServletContext());
		Template template = v.getTemplate("/APIWeb/admin/authform.vm");
		StringWriter sw = new StringWriter();
		VelocityContext context = new VelocityContext();
		template.merge( context, sw );
		return sw.toString();
	}
	/*
	@POST
    @Consumes("application/x-www-form-urlencoded")
    @Produces("application/json")
    public Response authorize( @FormParam("username") String username,
			@FormParam("password") String passsword ) {
		
	    final Response.ResponseBuilder responseBuilder = Response.status(HttpServletResponse.SC_OK);
        return responseBuilder.build();
	}
	*/
}
