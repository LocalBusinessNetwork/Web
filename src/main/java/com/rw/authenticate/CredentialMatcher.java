package com.rw.authenticate;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SaltedAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.apache.shiro.util.SimpleByteSource;

import com.rw.API.RWPasswordEncryptionService;

public class CredentialMatcher extends SimpleCredentialsMatcher {
	
	static final Logger log = Logger.getLogger(CredentialMatcher.class.getName());
 
    public boolean doCredentialsMatch(AuthenticationToken tok, AuthenticationInfo info)
    {
    	try {
    	   	UsernamePasswordToken u = (UsernamePasswordToken) tok;
        	String password = String.valueOf(u.getPassword());
        	
        	SaltedAuthenticationInfo rwSource = (SaltedAuthenticationInfo) info;
        	
        	RWPasswordEncryptionService p = new RWPasswordEncryptionService();
        	SimpleByteSource salt = (SimpleByteSource) rwSource.getCredentialsSalt();
    	    return p.authenticate(password, (byte[]) (byte[]) rwSource.getCredentials(), salt.getBytes());
	
    	} catch (NoSuchAlgorithmException e) {
			log.debug(e.getMessage());
		} catch (InvalidKeySpecException e) {
			log.debug(e.getMessage());
		}
    	return false;
    }
    
}