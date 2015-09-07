package com.rw.authenticate;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import org.apache.log4j.Logger;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.util.SimpleByteSource;
import org.apache.shiro.web.util.WebUtils;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.rw.API.SecMgr;
import com.rw.API.User;
import com.rw.persistence.RWJApplication;
import com.rw.persistence.RWJBusComp;
import com.rw.persistence.mongoStore;

public class RWAuthRealm extends AuthorizingRealm {
	
	static final Logger log = Logger.getLogger(RWAuthRealm.class.getName());
	  
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token)
            throws AuthenticationException {
        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
        
        String username = upToken.getUsername();
        String parts[] = username.split(":");
        
        String password = upToken.getPassword().toString();
        try {
        	mongoStore store = new mongoStore(parts[0]);
		  
        try {
           		
    		store.beginTrans();
    	    store.requestEnsureConnection();	
	
			BasicDBObject query = new BasicDBObject();
    		query.put("login", parts[1]);
    		
    		DBObject d = store.getColl("rwSecurity").findOne(query);
    		AuthenticationInfo a = null;
    		
    		if ( d != null ) {
    	    	byte[] epwd = (byte []) d.get("password");
    	     	byte[] esalt = (byte []) d.get("passwordSalt");
    	     	
    	     	User u = new User();
    	     	u.tenant = parts[0];
    	     	u.username = parts[1];
    	     	u.userId = d.get("_id").toString();
    	     	
    	     	a = new SimpleAuthenticationInfo(u, epwd, new SimpleByteSource(esalt), getName());
    		}
    		
    		return a;
    		
        } catch (JSONException e) {
			log.debug(e.getStackTrace());
			throw new AuthenticationException(e.getMessage());
		} catch (NoSuchAlgorithmException e) {
			log.debug(e.getStackTrace());
			throw new AuthenticationException(e.getMessage());
		} catch (InvalidKeySpecException e) {
			log.debug(e.getStackTrace());
			throw new AuthenticationException(e.getMessage());
		} catch (Exception e) {
			log.debug(e.getStackTrace());
			throw new AuthenticationException(e.getMessage());
		}
        finally {
        	store.endTrans();
        }
		} catch (Exception e) {
			log.debug(e.getStackTrace());
			throw new AuthenticationException(e.getMessage());
		}
    }
 
    private void checkNotNull(Object reference, String message) {
        if (reference == null) {
            throw new AuthenticationException(message);
        }
    }

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection arg0) {
		
		User u = (User) arg0.getPrimaryPrincipal();
		mongoStore store = null ;
		try {
        	store = new mongoStore(u.tenant);
            		
    		store.beginTrans();
    	    store.requestEnsureConnection();	
	
			BasicDBObject query = new BasicDBObject();
    		query.put("login", u.username);
    		
    		DBObject d = store.getColl("rwSecurity").findOne(query);
    		
    		BasicDBList roles = (BasicDBList) d.get("roles");
    		
    		if ( roles != null ) {
	    		SimpleAuthorizationInfo a = new SimpleAuthorizationInfo();
	    		for ( int i = 0; i < roles.size(); i++) {
	    			a.addRole(roles.get(i).toString());
	    		}
	    		return a;
    		}
        } catch (Exception e) {
			log.debug(e.getStackTrace());
		}	
    	finally {
        	try {
				store.endTrans();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				log.debug(e.getStackTrace());
			}
        }
		
        return null;
	}
}