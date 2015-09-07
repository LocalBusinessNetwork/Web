package com.rw.common;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.json.JSONException;

import au.com.bytecode.opencsv.CSVWriter;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.rw.persistence.mongoStore;
import com.rw.resources.MembersResource;

public class CSVimpl {
	static final Logger log = Logger.getLogger(CSVimpl.class.getName());

	public String members(HttpServletRequest request) throws Exception {
		
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
				o[5] = row.get("InvitationCode") == null ? "undefined" : row.get("InvitationCode").toString();
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
