jQuery.extend({
hasVal:function(datum){	return  !_.isUndefined(datum) && !_.isNull(datum) && datum !="" ; },
toArray: function(datum) {	return _.isArray(datum) ? datum : [datum] },
isValidBrowser: function(){
	var retVal = false;
	var browser = null;
	var version = 0;
	
	try{

		
		for (member in $.browser){
			var item = String(member);
			if (item.indexOf("safari") >= 0 || item.indexOf("mozilla") >= 0 || item.indexOf("msie") >= 0 || item.indexOf("chrome") >= 0){
			//if (item.indexOf("safari") >= 0 || item.indexOf("msie") >= 0 || item.indexOf("chrome") >= 0){
				browser = item;
			}
			if (item.indexOf("version") >= 0){
				version = parseFloat($.browser[item]);
			}
		}
		
		if (!_.isNull(browser)){
			switch (browser) {
			case "safari": 
				if (version >= 6) retVal = true;  
				break;
			case "chrome": 
				if (version >= 10) retVal = true;
				break;
			case "msie": 
				if (version >= 9) retVal = true;
				break;
			case "mozilla": 
				if (version >= 19) retVal = true;  
				break;
			}
		}

	}
	catch(e){
		
		alert(e.description);
	};
	
	$("body").addClass(browser);
	window.browser = browser;
	window.browserVersion = version;
	this.getOS();
	return retVal;
},

hasAccess: function(options){
	var retVal = false;
	var routeName = options.routeName;
	var privilege = options.privilege;
	var record = options.record;
	
	
	
	//rwFB.OrgId, rwFB.uId, rwFB.emailAddress,rwFB.isAmbassador,rwFB.isSpeaker

	//if ($.hasVal(routeName) && $.hasVal(privilege) && $.hasVal(record) && $.hasVal(rwApp.profileModeld)){
	var ambassadors = {
		OrgList:{
			edit:(record.get('id') == rwFB.OrgId),
		},
		OrgEvents:{
			add:(record.get('id') == rwFB.OrgId),
		},

		EventExpected:{
			addGuest:(record.get('OrgId') == rwFB.OrgId),
		},
		EventExpected:{
			editFull:(record.get('OrgId') == rwFB.OrgId),
		},
		
		EventCheckedIn:{
			addGuest:(record.get('OrgId') == rwFB.OrgId),
		},
		EventGuests:{
			addGuest:(record.get('OrgId') == rwFB.OrgId),
		},
		phoneEvent:{
			editFull:(record.get('OrgId') == rwFB.OrgId),
		},
		
		phoneOrgEvents:{
			add:(record.get('id') == rwFB.OrgId),
		},

		phoneEventExpected:{
			addGuest:(record.get('OrgId') == rwFB.OrgId),
		},
		
		phoneEventCheckedIn:{
			addGuest:(record.get('OrgId') == rwFB.OrgId),
		},
		phoneEventGuests:{
			addGuest:(record.get('OrgId') == rwFB.OrgId),
		},
		home:{
			vspeaker:true
		}
	};
	
	var primaryAmbassadors = {
		/*
		memberList:{
			designateAmbassador:(record.get('org_ambassadorId') == rwFB.uId),
		},
		memberProfile:{
			designateAmbassador:(record.get('org_ambassadorId') == rwFB.uId),
		},
		*/
		OrgList:{
			edit:(record.get('ambassadorId') == rwFB.uId)
		},
		OrgEvents:{
			add:(record.get('ambassadorId') == rwFB.uId)
		},
		phoneOrgEvents:{
			add:(record.get('ambassadorId') == rwFB.uId)
		},
		OrgPhotos:{
			edit:(record.get('ambassadorId') == rwFB.uId)
		},
		EventExpected:{
			editFull:(record.get('org_ambassadorId') == rwFB.uId),
		},
		EventCheckedIn:{
			editFull:(record.get('org_ambassadorId') == rwFB.uId),
		},
		EventGuests:{
			editFull:(record.get('org_ambassadorId') == rwFB.uId),
		},
		phoneEvent:{
			editFull:(record.get('org_ambassadorId') == rwFB.uId),
		},
		phoneEventExpected:{
			editFull:(record.get('org_ambassadorId') == rwFB.uId),
		},
		phoneEventCheckedIn:{
			editFull:(record.get('org_ambassadorId') == rwFB.uId),
		},
		phoneEventGuests:{
			editFull:(record.get('org_ambassadorId') == rwFB.uId),
		},
		home:{
			vspeaker:(record.get('org_ambassadorId') == rwFB.uId),
		}
	};
	
	var administrators = {
		home:{
			upsertBanner:true,
			vspeaker:true,
			adminscreen:true,
		},
		memberList:{
			editFull:true,
			viewFullProfile:true,	
		},
		memberListDemo:{
			editFull:true
		},
		memberProfile:{
			editFull:true
		},
		
		memberListAdmin:{
			editFull:true
		},
		
		OrgList:{
			editFull:true,
		},
		OrgPhotos:{
			edit:true,
		},
		OrgEvents:{
			add:true,
		},
		phoneOrgEvents:{
				add:true,
		},
		EventExpected:{
			editFull:true,
		},
		EventCheckedIn:{
			editFull:true,
		},
		EventGuests:{
			editFull:true,
		},
		phoneEvent:{
			editFull:true,
		},
		phoneEventExpected:{
			editFull:true,
		},
		phoneEventCheckedIn:{
			editFull:true,
		},
		phoneEventGuests:{
			editFull:true,
		},

		memberProfile:{
			viewFullProfile:true,
		},
		PhoneMemberContact:{
			viewFullProfile:true,
		},
		any:{
			editPublicSavedSearch:true
		}
		
	};
	
	var speakers = {
		speakerBio:{
			edit:true
		}
		
	}
	

	
	if ((rwFB.emailAddress == "admin.user@referralwire.com" || rwFB.emailAddress == "jimb@yesitworks.com" || rwFB.emailAddress == "donna.bellacera@gmail.com" || rwFB.emailAddress == "Donna.Bellacera@gmail.com") && !retVal && administrators.hasOwnProperty(routeName)){
		var routePrivileges = administrators[routeName];
		retVal = (routePrivileges.hasOwnProperty(privilege))?routePrivileges[privilege]:false;
	} else {
	
		if (primaryAmbassadors.hasOwnProperty(routeName)){
			var routePrivileges = primaryAmbassadors[routeName];
			retVal = (routePrivileges.hasOwnProperty(privilege))?routePrivileges[privilege]:false;
		} 
		//primaryAmbassadors has to be checked first
		if (rwFB.isAmbassador == "true" && !retVal && ambassadors.hasOwnProperty(routeName)){
			var routePrivileges = ambassadors[routeName];
			retVal = (routePrivileges.hasOwnProperty(privilege))?routePrivileges[privilege]:false;
		} 
		if (rwFB.isSpeaker == "true" && !retVal && speakers.hasOwnProperty(routeName)){
				var routePrivileges = speakers[routeName];
				retVal = (routePrivileges.hasOwnProperty(privilege))?routePrivileges[privilege]:false;
		}
			
	}


	//}
	return retVal;

},

getMenu: function(){

},
	
getOS: function(){
	var userOS;    // will either be iOS,  or unknown
	var userOSver; // this is a string, use Number(userOSver) to convert
	var isIOS7;
	
	
	  var ua = navigator.userAgent;
	  var uaindex;
	
	  // determine OS
	  if ( ua.match(/iPad/i) || ua.match(/iPhone/i) )
	  {
	    userOS = 'iOS';
	    uaindex = ua.indexOf( 'OS ' );
	  }
	  else if ( ua.match(/Android/i) )
	  {
	    userOS = 'Android';
	    uaindex = ua.indexOf( 'Android ' );
	  }
	  else
	  {
	    userOS = 'otherOS';
	  }
	
	  // determine version
	  if ( userOS === 'iOS'  &&  uaindex > -1 )
	  {
	    userOSver = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
	  }
	  else if ( userOS === 'Android'  &&  uaindex > -1 )
	  {
	    userOSver = ua.substr( uaindex + 8, 3 );
	  }
	  else
	  {
	    userOSver = 'unknown';
	  }
	  
	  if (ua.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)){
	  	 $("body").addClass("iOS7");
	  }
	  
	  $("body").addClass(userOS);
	  
	  window.userOS = userOS;
	  
	  return userOS;
}	



});