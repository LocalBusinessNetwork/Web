package com.rw.googleanalyticstest;

import static org.junit.Assert.*;

import java.io.IOException;
import java.security.GeneralSecurityException;

import org.junit.Test;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.rw.common.GoogleAnalytics;

public class pageviews {

	@Test
	public void test() throws GeneralSecurityException, IOException {
		GoogleAnalytics ga = new GoogleAnalytics();
		try {
			System.out.printf("%s", ga.publicProfileViews("/STN/5370e7aa300463fad4de9289/profile.html", null));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
	}
}
