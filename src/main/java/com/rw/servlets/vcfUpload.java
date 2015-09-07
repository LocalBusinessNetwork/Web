package com.rw.servlets;


import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.log4j.Logger;
//import org.json.simple.JSONObject;
import org.json.JSONObject;

import java.awt.Graphics2D;

import com.rw.API.ContactsMgr;
import com.rw.API.S3DataVault;

import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.UserAgent;

 
/**
 * Servlet implementation class UploadServlet
 */
public class vcfUpload extends HttpServlet {
    private static final long serialVersionUID = 1L;
	private static final String USERID = "User.Id" ;
	private static final String TENANT = "Tenant.Id" ;

	static final Logger log = Logger.getLogger(vcfUpload.class.getName());

    private static final int THRESHOLD_SIZE = 1024 * 1024 * 3; // 3MB
    private static final int MAX_FILE_SIZE = 1024 * 1024 * 40; // 40MB
    private static final int REQUEST_SIZE = 1024 * 1024 * 50; // 50MB
 
    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
     *      response)
     */
    
	public static void handleRuntimeException(Exception ex, HttpServletResponse 
            response) {
		try{
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, ex.getMessage());
			response.flushBuffer();
			log.fatal(ex.getMessage());
		} catch (IOException e) {
			log.debug("WebInterface Error: ", e);
		}
	}
 
	 protected void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException {
		 doPost(request,response);
	 }
	 
	 protected void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        // checks if the request actually contains upload file
        if (!ServletFileUpload.isMultipartContent(request)) {
			response.sendError(HttpServletResponse.SC_UNSUPPORTED_MEDIA_TYPE, "Can't Upoad");
			response.flushBuffer();
			return;
		}
 
		try {

			HttpSession session = request.getSession();
			
			String userid = (String) session.getAttribute(USERID);
			
			if ((userid == null) || userid.isEmpty()) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Please login");
				response.flushBuffer();
				return;
			}
	
		    PrintWriter out = null;
		    
		    UserAgent ua = UserAgent.parseUserAgentString(
		    		   request.getHeader("User-Agent")); 
		    
		    Browser b = ua.getBrowser();
		    
		    String bn = b.getName();
		    
		    if (bn.contains("Internet Explorer") )
		    	response.setContentType("text/html");
		    else
		    	response.setContentType("application/json");
		    
			out = response.getWriter();
				
			JSONObject retVal =  new JSONObject();

			DiskFileItemFactory factory = new DiskFileItemFactory();
	        factory.setSizeThreshold(THRESHOLD_SIZE);
	        factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
	         
	        ServletFileUpload upload = new ServletFileUpload(factory);
	        upload.setFileSizeMax(MAX_FILE_SIZE);
	        upload.setSizeMax(REQUEST_SIZE);
	
            // parses the request's content to extract file data
            List formItems = upload.parseRequest(request);
            Iterator iter = formItems.iterator();
             
            // iterates over form's fields
            while (iter.hasNext()) {
                FileItem item = (FileItem) iter.next();
                // processes only fields that are not form fields
                while (!item.isFormField()) { // try until we find a unique file name, this should rarely happen.
                	
                	 String existingBucketName = System.getProperty("PARAM5");
               		
                     if ( existingBucketName == null )
                     	existingBucketName = ResourceBundle.getBundle("referralwire", new Locale("en", "US")).getString("S3BucketName");
             		
                    String fileName = new File(RandomStringUtils.randomAlphabetic(24)).getName(); // .concat(item.getName())).getName();
                     
                    File storeFile = File.createTempFile(fileName, null);
                    item.write(storeFile);   
                    if ( existingBucketName.equals("local")) {
                       	retVal.put("URL",fileName );
                       	fileName = storeFile.getPath();
                    }
                    else {
                    	S3DataVault dataVault = new S3DataVault();            	
                    	InputStream imgFile = new FileInputStream(storeFile);
                    	retVal.put("URL", dataVault.store(existingBucketName, fileName, imgFile, item.getSize()));
                    }
                    String tenant = (String) session.getAttribute(TENANT);
                    
                    ContactsMgr c = new ContactsMgr(userid);
                    c.setTenantKey(tenant);
                    JSONObject data = new JSONObject();
                    data.put("bucket", existingBucketName);
                    data.put("name", fileName);
                    c.pushToBackground("ImportVCards", data);
                	break;
                }
            }
            out.print(retVal);
    		out.flush();
        } catch (Exception e) {
			handleRuntimeException(e,response);
			return;
        }
    }
}
