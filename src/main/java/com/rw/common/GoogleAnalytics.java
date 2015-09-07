package com.rw.common;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.analytics.Analytics;
import com.google.api.services.analytics.AnalyticsScopes;
import com.google.api.services.analytics.model.Accounts;
import com.google.api.services.analytics.model.GaData;
import com.google.api.services.analytics.model.GaData.ColumnHeaders;
import com.google.api.services.analytics.model.Profiles;
import com.google.api.services.analytics.model.Webproperties;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;

import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GoogleAnalytics {
	static final Logger log = Logger.getLogger(GoogleAnalytics.class.getName());
	private static final String APPLICATION_NAME = "PageViewTracker";

	  /** Directory to store user credentials. */
	  private static final java.io.File DATA_STORE_DIR =
	      new java.io.File(System.getProperty("user.home"), ".store/analytics_sample");
	 
	  /**
	   * Global instance of the {@link DataStoreFactory}. The best practice is to make it a single
	   * globally shared instance across your application.
	   */
	  private static FileDataStoreFactory dataStoreFactory;

	  /** Global instance of the HTTP transport. */
	  private static HttpTransport httpTransport;

	  /** Global instance of the JSON factory. */
	  private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
	  
	  private int retryCount = 0;
	  
	 public String  publicProfileViews(String who, JSONObject tenantObj) throws Exception  {
		try {
			
		log.debug(who);
		
		String webRoot = System.getProperty("WebRoot");
		log.info("WebRoot : " + webRoot);
		if ( webRoot == null || webRoot.isEmpty()) {
			webRoot = new String ("/var/lib/tomcat7/webapps/ROOT");
		}
		
		log.debug(tenantObj.getString("GoogleAnalyticsServiceAccountEmail"));
		log.debug(tenantObj.getString("GoogleAnalyticsServiceAccountPrivateKey"));
		log.debug(tenantObj.getString("GoogleAnalyticsServiceAccountGaId"));
		
		
		GoogleCredential credential = new GoogleCredential.Builder().setTransport(httpTransport)
		            .setJsonFactory(JSON_FACTORY)
		            .setServiceAccountUser("admin@referralwire.com")
		            .setServiceAccountId(tenantObj.getString("GoogleAnalyticsServiceAccountEmail"))
		            .setServiceAccountScopes(Collections.singleton("https://www.googleapis.com/auth/analytics.readonly"))
		            .setServiceAccountPrivateKeyFromP12File(new File(webRoot + "/WEB-INF/" + tenantObj.getString("GoogleAnalyticsServiceAccountPrivateKey") + ".p12"))
		            .build();	
		
		/*
		GoogleCredential credential = new GoogleCredential.Builder().setTransport(httpTransport)
	            .setJsonFactory(JSON_FACTORY)
	            .setServiceAccountUser("admin@referralwire.com")
	            .setServiceAccountId("734052415290-i6brg4dsbrq8o84dgfs37ugvikq0dtoc@developer.gserviceaccount.com")
	            .setServiceAccountScopes(Collections.singleton("https://www.googleapis.com/auth/analytics.readonly"))
	            .setServiceAccountPrivateKeyFromP12File(new File(webRoot + "/WEB-INF/key.p12"))
	            .build();	
		*/
		httpTransport = GoogleNetHttpTransport.newTrustedTransport();
		
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
 		String formattedDate = formatter.format(new Date());
 		
		String URI  = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A" + tenantObj.getString("GoogleAnalyticsServiceAccountGaId") + "&dimensions=ga%3ApagePath&metrics=ga%3Apageviews&start-date=2014-01-01&max-results=50&filters=ga%3ApagePath%3D%3D" + 
				who + "&end-date=" + formattedDate;
		
		log.debug("httpRequest = " + URI);
		
	    HttpRequestFactory requestFactory = httpTransport.createRequestFactory(credential);
        GenericUrl url = new GenericUrl(URI);
        HttpRequest request = requestFactory.buildGetRequest(url).setNumberOfRetries(3);
        HttpResponse response = request.execute();
        String content = response.parseAsString();
        
        log.debug("httpResponse = " + content);
        
        JSONObject js = new JSONObject(content);
        int totalRows = js.getInt("totalResults");
        
        log.debug("totalRows = " + String.valueOf(totalRows));
        
        if ( totalRows > 0 ) {
        	JSONArray rows = js.getJSONArray("rows");
        	JSONArray row = rows.getJSONArray(0);
        	int pageViews = row.getInt(1);
        	return String.valueOf(pageViews);
        }

		}
		catch(GeneralSecurityException s ) {
			log.debug(s.getMessage());
			s.printStackTrace();
		}
		catch (IOException e) {
			log.debug(e.getMessage());
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			log.debug(e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			log.debug(e.getMessage());
			retryCount++;
			
			if ( retryCount < 3 ) { 
				return publicProfileViews(who, tenantObj);
			}
			
		}
		
        /*
		  httpTransport = GoogleNetHttpTransport.newTrustedTransport();
	      dataStoreFactory = new FileDataStoreFactory(DATA_STORE_DIR);
	      Analytics analytics = initializeAnalytics();
	      String profileId = getFirstProfileId(analytics);
	      if (profileId == null) {
	        System.err.println("No profiles found.");
	      } else {
	    	  GaData gaData = executeDataQuery(analytics, profileId, who);
	    	  return gaData.getRows().get(0).get(1);
	         }
	    } catch (GoogleJsonResponseException e) {
	      System.err.println("There was a service error: " + e.getDetails().getCode() + " : "
	          + e.getDetails().getMessage());
	    } catch (Throwable t) {
	      t.printStackTrace();
	    }
	    */
		
		log.debug("returning empty");
		return "";
		
	 }

	 public String  memberSitePageViews(String who, JSONObject tenantObj)  {
			try {
				
			log.debug(who);
			
			String webRoot = System.getProperty("WebRoot");
			log.info("WebRoot : " + webRoot);
			if ( webRoot == null || webRoot.isEmpty()) {
				webRoot = new String ("/var/lib/tomcat7/webapps/ROOT");
			}
			
			GoogleCredential credential = new GoogleCredential.Builder().setTransport(httpTransport)
		            .setJsonFactory(JSON_FACTORY)
		            .setServiceAccountUser("admin@referralwire.com")
		            .setServiceAccountId(tenantObj.getString("GoogleAnalyticsServiceAccountEmail"))
		            .setServiceAccountScopes(Collections.singleton("https://www.googleapis.com/auth/analytics.readonly"))
		            .setServiceAccountPrivateKeyFromP12File(new File(webRoot + "/WEB-INF/" + tenantObj.getString("GoogleAnalyticsServiceAccountPrivateKey") + ".p12"))
		            .build();	
			
			httpTransport = GoogleNetHttpTransport.newTrustedTransport();
			
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	 		String formattedDate = formatter.format(new Date());
	 			
			String URI  = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A86971733&dimensions=ga%3ApagePath&metrics=ga%3Apageviews&start-date=2014-01-01&max-results=50&end-date=" + formattedDate;
			
			log.debug("httpRequest = " + URI);
			
		    HttpRequestFactory requestFactory = httpTransport.createRequestFactory(credential);
	        GenericUrl url = new GenericUrl(URI);
	        HttpRequest request = requestFactory.buildGetRequest(url);
	        HttpResponse response = request.execute();
	        String content = response.parseAsString();
	        
	        log.debug("httpResponse = " + content);
	        
	        JSONObject js = new JSONObject(content);
	        int totalRows = js.getInt("totalResults");
	        
	        log.debug("totalRows = " + String.valueOf(totalRows));
	        
	        if ( totalRows > 0 ) {
	        	JSONArray rows = js.getJSONArray("rows");
	        	JSONArray row = rows.getJSONArray(0);
	        	int pageViews = row.getInt(1);
	        	return String.valueOf(pageViews);
	        }

			}
			catch(GeneralSecurityException s ) {
				log.debug(s.getMessage());
				s.printStackTrace();
			}
			catch (IOException e) {
				log.debug(e.getMessage());
				e.printStackTrace();
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				log.debug(e.getMessage());
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				log.debug(e.getMessage());
				return memberSitePageViews(who, tenantObj);
				
			}
			
			log.debug("returning empty");
			return "";
			
	 }

	 private static Credential authorize() throws Exception {
		    // load client secrets
		    GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(
		        JSON_FACTORY, new InputStreamReader(
		        		GoogleAnalytics.class.getResourceAsStream("/client_secrets.json")));
		    if (clientSecrets.getDetails().getClientId().startsWith("Enter")
		        || clientSecrets.getDetails().getClientSecret().startsWith("Enter ")) {
		    	String msg =  "Enter Client ID and Secret from https://code.google.com/apis/console/?api=analytics "
				          + "into /client_secrets.json";
		      System.out.println(msg);
		      throw new Exception(msg);
		    }
		    // set up authorization code flow
		    GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
		        httpTransport, JSON_FACTORY, clientSecrets,
		        Collections.singleton(AnalyticsScopes.ANALYTICS_READONLY)).setDataStoreFactory(
		        dataStoreFactory).build();
		    // authorize
		    return new AuthorizationCodeInstalledApp(flow, new LocalServerReceiver()).authorize("user");
	 }
	 
	 private static Analytics initializeAnalytics() throws Exception {
		    // Authorization.
		    Credential credential = authorize();

		    // Set up and return Google Analytics API client.
		    return new Analytics.Builder(httpTransport, JSON_FACTORY, credential).setApplicationName(
		        APPLICATION_NAME).build();
	}

	 private static String getFirstProfileId(Analytics analytics) throws IOException {
		    String profileId = null;

		    // Query accounts collection.
		    Accounts accounts = analytics.management().accounts().list().execute();

		    if (accounts.getItems().isEmpty()) {
		      System.err.println("No accounts found");
		    } else {
		      String firstAccountId = accounts.getItems().get(0).getId();

		      // Query webproperties collection.
		      Webproperties webproperties =
		          analytics.management().webproperties().list(firstAccountId).execute();

		      if (webproperties.getItems().isEmpty()) {
		        System.err.println("No Webproperties found");
		      } else {
		        String firstWebpropertyId = webproperties.getItems().get(0).getId();

		        // Query profiles collection.
		        Profiles profiles =
		            analytics.management().profiles().list(firstAccountId, firstWebpropertyId).execute();

		        if (profiles.getItems().isEmpty()) {
		          System.err.println("No profiles found");
		        } else {
		          profileId = profiles.getItems().get(0).getId();
		        }
		      }
		    }
		    return profileId;
		}

	 	private static GaData executeDataQuery(Analytics analytics, String profileId, String who) throws IOException {
	 		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	 		String formattedDate = formatter.format(new Date());
	 		
	 		return analytics.data().ga().get("ga:" + profileId, // Table Id. ga: + profile id.
		    	"2014-01-01", // Start date.
		    	formattedDate, // End date.
    	        "ga:pageviews") // Metrics.
    	        .setDimensions("ga:pagePath")
    	        // .setSort("-ga:visits,ga:source,ga:pageviews")
    	        .setFilters("ga:pagePath=="+ who )
    	        .setMaxResults(25)
		        .execute();
		  }

	 	private static void printGaData(GaData results) {
	 	    System.out.println(
	 	        "printing results for profile: " + results.getProfileInfo().getProfileName());

	 	    if (results.getRows() == null || results.getRows().isEmpty()) {
	 	      System.out.println("No results Found.");
	 	    } else {

	 	      // Print column headers.
	 	      for (ColumnHeaders header : results.getColumnHeaders()) {
	 	        System.out.printf("%30s", header.getName());
	 	      }
	 	      System.out.println();

	 	      // Print actual data.
	 	      for (List<String> row : results.getRows()) {
	 	        for (String column : row) {
	 	          System.out.printf("%30s", column);
	 	        }
	 	        System.out.println();
	 	      }

	 	      System.out.println();
	 	    }
	 	  }

}
