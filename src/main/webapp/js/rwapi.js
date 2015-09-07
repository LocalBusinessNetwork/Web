
jQuery.extend({

badges:[

	{
		largeTemplate:"BadgeRegionalAmbassador",
		inlineClass:"badgeRegAmbassadorInline",
		link:"http://resource.successfulthinkersnetwork.com/index.php/stn-programs-2/ambassador-certification/ambassador-certification-home/",
		inlineTemplate:"BadgeInlineRole",
		score:"foo",
		show:function(model,score){
			return ($.hasVal(model.get("honoraryRoles")) && model.get("honoraryRoles").indexOf("REG_AMBASSADOR") > -1)
		},
	},
	{
		largeTemplate:"BadgeLeadAmbassador",
		inlineClass:"badgeLeadAmbassadorInline",
		inlineTemplate:"BadgeInlineRole",
		link:"http://resource.successfulthinkersnetwork.com/index.php/stn-programs-2/ambassador-certification/ambassador-certification-home/",
		score:"foo",
		show:function(model,score){
			return (model.get('org_ambassadorId') == model.get('id'))?true:false;
		},
		
	},
	{
		largeTemplate:"BadgeAssociateAmbassador",
		inlineClass:"badgeAssociateAmbassadorInline",
		inlineTemplate:"BadgeInlineRole",
		link:"http://resource.successfulthinkersnetwork.com/index.php/stn-programs-2/ambassador-certification/ambassador-certification-home/",
		score:"foo",
		show:function(model,score){
			return (model.get('org_ambassadorId') != model.get('id') && model.get('isAmbassador') == 'true')?true:false;
		},
		
	},
	//rwFB.isAmbassador
	{
		largeTemplate:"BadgeReferrals",
		inlineClass:"badgeReferralsGivenInline",
		inlineTemplate:"BadgeInlineScore",
		link:"http://resource.successfulthinkersnetwork.com/index.php/the-company-2/member-benefits-program/member-achievement-levels/",
		score:"totalProspects",
		show:function(model,score){
			return (!_.isUndefined(score) && score > 0)?true:false;
		},
		
	},
		{
		largeTemplate:"BadgeAttendance",
		inlineClass:"badgeAttendanceInline",
		inlineTemplate:"BadgeInlineScore",
		link:"http://resource.successfulthinkersnetwork.com/index.php/the-company-2/member-benefits-program/member-achievement-levels/",
		score:"totalMtgsAttended",
		show:function(model,score){
			return (!_.isUndefined(score) && score > 0)?true:false;
		},
		
	},
	{
		largeTemplate:"BadgeInvitations",
		inlineClass:"badgeMembersInvitedInline",
		inlineTemplate:"BadgeInlineScore",
		link:"http://resource.successfulthinkersnetwork.com/index.php/the-company-2/member-benefits-program/member-achievement-levels/",
		score:"totalInvited",
		show:function(model,score){
			return (!_.isUndefined(score) && score > 0)?true:false;
		},
	},
	{
		largeTemplate:"BadgeGenius",
		inlineClass:"badgeGeniusInline",
		link:"http://resource.successfulthinkersnetwork.com/index.php/the-company-2/member-benefits-program/member-achievement-levels/",
		inlineTemplate:"BadgeInlineRole",
		score:"foo",
		show:function(model,score){
			return ($.hasVal(model.get("honoraryRoles")) && model.get("honoraryRoles").indexOf("GENIUS") > -1)
		},
	},
	

	
],

getBadges:function(model,size){
	//return "<div class='"+inlineClass+"'>"+score+"</div>";
	var retVal = "";
	for (var i=0;i<$.badges.length;i++){
		var b = $.badges[i];
		var s = model.get(b.score);
		var lscore = "";
		if (!_.isUndefined(s)){s = parseInt(s);lscore = (s > 99)?"99+":s;}
		if (b.show(model,s)){
			if (size == "large"){
				retVal +=_.template(b.largeTemplate,{score:lscore,model:model,link:b.link})
			}
			if (size == "inline"){
				var h = _.template(b.inlineTemplate,{inlineClass:b.inlineClass,score:lscore,model:model});
				retVal += h;
			}
			if (size == "phone"){
				
				var h =_.template(b.largeTemplate,{score:lscore,model:model,link:"#"})
				retVal += h;
			}
		}
	}
	return retVal;
},

showBadges:function(model){
	var retVal = "hidden"
	for (var i=0;i<$.badges.length;i++){
		var b = $.badges[i];
		var s = model.get(b.score);
		if (b.show(model,s)){
			return "";
		}
	}
	return retVal;

},

getLevelBadge:function(model,size){
	
	var pointVal = (!_.isUndefined(model.get("memberRankScore")))?parseInt(model.get("memberRankScore")):0;
	var imgTempl = "<div class='memberLevelBadge'><a href='Zlink' target='_blank'><img src='images/badges/levelZLevel.png' class='memberLevelBadgeInner'></a><div class='memberLevelBadgeLabel'>Level ZLevel</div></div>";
	if (size == 'phone'){
		imgTempl = "<div class='memberLevelBadgePhone'><img src='images/badges/levelZLevel.png' class='memberLevelBadgeInner'><div class='memberLevelBadgeLabel'>Level ZLevel</div></div>";
	}
	if (size == 'small'){
		imgTempl = "<img src='images/badges/levelZLevel.png' class='memberLevelBadgeInner'>";
	}
	if (size == 'home'){
		imgTempl = "<div><a href='Zlink' target='_blank'><img src='images/badges/levelZLevel.png' class='memberLevelBadgeInner'></a><div class='memberLevelBadgeLabel'>Level ZLevel</div></div>";
	}
	var level = 1;
	if (pointVal >= 15 && pointVal < 250){level = 2}
	if (pointVal >= 250 && pointVal < 2500){level = 3}
	if (pointVal >= 2500 && pointVal < 7500){level = 4}
	if (pointVal >= 7500 && pointVal < 15000){level = 5}
	if (pointVal >= 15000 && pointVal < 25000){level = 6}
	if (pointVal >= 25000){level = 7}
	var link="http://resource.successfulthinkersnetwork.com/index.php/the-company-2/member-benefits-program/member-achievement-levels/",	
	imgTempl = imgTempl.replace(/ZLevel/g,level);
	imgTempl = imgTempl.replace("Zlink",link);
	return imgTempl;
	
	
},
	
geoDistance : function(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	var lat1 = lat1.toRad();
	var lat2 = lat2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	
	return d;
},

lookupMultiLovs:function(fldname,lovType,model){

	var retVal = "";
	var fVal = model.get(fldname);
	if (!_.isUndefined(fVal)) {
		var commaDelimVal = fVal;
		var vals = commaDelimVal.split(",");
		
		for (var i=0;i<vals.length;i++){
			if (retVal != ""){retVal +=",";}
			var gVal = vals[i];
			var dVal = rwcore.getLovDisplayVal (lovType, gVal);
			retVal += dVal;
		}
	}
 	return retVal;
},	

getFirstDayOfWeek:function(year, wn, dayNb){
	dayNb = dayNb + 6;
	var j10 = new Date( year,0,10,12,0,0),
        j4 = new Date( year,0,4,12,0,0),
        mon1 = j4.getTime() - j10.getDay() * 86400000;
    var r = new Date(mon1 + ((wn - 1)  * 7  + dayNb) * 86400000);
    var dayArray = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var monthArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var m = r.getMonth()
    var d = r.getDate();
    return monthArray[m] + " " + d;//"Week Starting " + dayArray[dayNb] + " " + monthArray[m] + " " + d;

},
createUploadIframe: function(id, uri)
{
				//create frame
	            var frameId = 'juploadframe' + id;
	            // var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute;"';
				
	            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
				if(window.ActiveXObject)
				{
	                if(typeof uri== 'boolean'){
						iframeHtml += ' src="' + 'javascript:false' + '"';

	                }
	                else if(typeof uri== 'string'){
						iframeHtml += ' src="' + uri + '"';

	                }	
				}
				iframeHtml += ' />';
				jQuery(iframeHtml).appendTo(document.body);

	            return jQuery('#' + frameId).get(0);			
},

createUploadForm: function(id, fileElementId, data)
{
			//create form	
			var formId = 'juploadform' + id;
			var fileId = 'jpploadfile' + id;
			var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');	
			if(data)
			{
				for(var i in data)
				{
					jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
				}			
			}		
			var oldElement = jQuery('#' + fileElementId);
			var newElement = jQuery(oldElement).clone();
			jQuery(oldElement).attr('id', fileId);
			jQuery(oldElement).before(newElement);
			jQuery(oldElement).appendTo(form);


			
			//set attributes
			jQuery(form).css('position', 'absolute');
			jQuery(form).css('top', '-1200px');
			jQuery(form).css('left', '-1200px');
			jQuery(form).appendTo('body');		
			return form[0];
},

ajaxFileUpload: function(s) {
	        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
	        s = jQuery.extend({}, jQuery.ajaxSettings, s);
	        var id = new Date().getTime();       
			var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data)=='undefined'?false:s.data));
			var io = jQuery.createUploadIframe(id, s.secureuri);
			var frameId = 'juploadframe' + id;
			var formId = 'juploadform' + id;		
	        // Watch for a new set of requests
	        if ( s.global && ! jQuery.active++ )
			{
				jQuery.event.trigger( "ajaxStart" );
			}            
	        var requestDone = false;
	        // Create the request object
	        var xml = {}   
	        if ( s.global )
	            jQuery.event.trigger("ajaxSend", [xml, s]);
	        // Wait for a response to come back
	        var uploadCallback = function(isTimeout)
			{			
				var io = document.getElementById(frameId);
	            try 
				{				
					if(io.contentWindow)
					{
						 xml.responseText = io.contentWindow.document.body? 
						   io.contentWindow.document.body.innerText ? io.contentWindow.document.body.innerText : $(io.contentWindow.document.body.innerHTML).text() : null;
	                	 xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
						 
					} else if(io.contentDocument)
					{
						 xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
	                	xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
					}						
	            } catch(e) {
	            	rwcore.FYI(e);
					// jQuery.handleError(s, xml, null, e);
				}
	            if ( xml || isTimeout == "timeout") 
				{				
	                requestDone = true;
	                var status;
	                try {
	                    status = isTimeout != "timeout" ? "success" : "error";
	                    // Make sure that the request was successful or notmodified
	                    if ( status != "error" )
						{
	                        // process the data (runs the xml through httpData regardless of callback)
	                        var data = jQuery.uploadHttpData( xml, s.dataType );    
	                        // If a local callback was specified, fire it and pass it the data
	                        if ( s.success ) 
	                            s.success( data, status );
	    
	                        // Fire the global callback
	                        if( s.global )
	                            jQuery.event.trigger( "ajaxSuccess", [xml, s] );
	                    } else {
		                    $.mobile.loading('hide');
	                    	rwcore.FYI(status); // jQuery.handleError(s, xml, status);
	                    }
	                } catch(e) {
	                    $.mobile.loading('hide');
	                    alert(xml.responseText.trim()); 
	                    //jQuery.handleError(s, xml, status, e);
	                }

	                // The request was completed
	                if( s.global )
	                    jQuery.event.trigger( "ajaxComplete", [xml, s] );

	                // Handle the global AJAX counter
	                if ( s.global && ! --jQuery.active )
	                    jQuery.event.trigger( "ajaxStop" );

	                // Process result
	                if ( s.complete )
	                    s.complete(xml, status);

	                jQuery(io).unbind();

	                setTimeout(function()
										{	try 
											{
												jQuery(io).remove();
												jQuery(form).remove();	
												
											} catch(e) {
												rwcore.FYI(e); // jQuery.handleError(s, xml, null, e);
											}									
										}, 100);
	                xml = null;
	            }
	        }
	        // Timeout checker
	        if ( s.timeout > 0 ) 
			{
	            setTimeout(function(){
	                // Check to see if the request is still happening
	                if( !requestDone ) uploadCallback( "timeout" );
	            }, s.timeout);
	        }
	        var hFrame = jQuery('#' + frameId);
			hFrame.load(uploadCallback);

	        try 
			{
				var hform = jQuery('#' + formId);
				hform.attr('action', s.url);
				hform.attr('method', 'POST');
				hform.attr('target', frameId);
	            if(hform.encoding) {
					hform.attr('encoding', 'multipart/form-data');      			
	            }
	            else {	
					hform.attr('enctype', 'multipart/form-data');			
	            }	
	            hform.submit();
	        
	        } catch(e) {
				rwcore.FYI(e); // jQuery.handleError(s, xml, null, e);
	        }
	        return {abort: function () {}};	
},

uploadHttpData: function( r, type ) {
			
	        var c = !type;
	        c = type == "xml" || c ? r.responseXML : r.responseText;
	        // If the type is "script", eval it in global context
	        if ( type == "script" )
	            jQuery.globalEval( c );
	        // Get the JavaScript object, if JSON is used.
	        if ( type == "json" || type == "html"  )
	            eval( "c = " + c );
	        // evaluate scripts within html
	        //if ( type == "html" )
	          //  jQuery("<div>").html(data).evalScripts();

	        return c;
},

rwFileUpload : function(id, picid) {
	$.mobile.loading( 'show', {
		text: 'Uploading the picture, it may take few minutes, please wait.',
		textVisible: true,
		theme: 'b',
		html: ""
	});
	
	$.ajaxFileUpload
    (
        {
            //url:'/web/rwFileUpload',
        	url:'/rwFileUpload',
            secureuri:false,
            fileElementId:id,
            dataType: 'json',
            success: function (data, status)
            {
            	
            	if ( !_.isUndefined(data)) { 
    	    		var location_tn = data.URL_tn;
					var location = data.URL;

		    		//var selector = "#upsertRecord img#"+ picid;
	    	    	var selector = ".upsertContainer img#"+ picid;

	  	          	//$(selector).attr('src',  location + "_tn");
	  	          	$(selector).attr('src', location_tn ); 
	  	          	//selector = "#upsertRecord input#"+ picid;
	  	            selector = ".upsertContainer input#"+ picid;
	  	            $(selector).attr('value', location);
	  	            $(selector).trigger("change");
  	        	}
  	            $.mobile.loading('hide');
            },
            error: function (data, status, e)
            {            
            	$.mobile.loading('hide');
            }
        }
    );   
    return false;
},

rwVCFUpload : function(event) {
	$.mobile.loading( 'show', {
		text: 'Uploading the VCF File, it may take few minutes, please wait.',
		textVisible: true,
		theme: 'b',
		html: ""
	});
	
	$.ajaxFileUpload
    (
        {
        	url:'/vcfUpload',
            secureuri:false,
            fileElementId: event.target.id,
            dataType: 'json',
            success: function (data, status)
            {
            	alert('Your contacts will be updated in few minutes. Please check back later.')
  	            $.mobile.loading('hide');
            },
            error: function (data, status, e)
            {
            	rwcore.FYI('Error uploading the VCF file. Please try again later.')
            	$.mobile.loading('hide');
            }
        }
    );   
    return false;
},

rwClearImage:function(picid,id,defaultImg){
	selector = "#upsertRecord input#"+ id;
    $(selector).attr('value', null);
    $(selector).trigger("change");
	var selector = "#upsertRecord img#"+ id;
	$(selector).attr('src',defaultImg);

	
	
},


/*


// google integration APIs.

g_clientId : '626928695782-1h4hu5c4erj25vhf1hbaruprf35t2ash.apps.googleusercontent.com',
g_apiKey : 'AIzaSyCm7aLGa8q1LdIAFD2uFtkLH1YjOYF4XKY',
g_scopes : 'https://www.googleapis.com/auth/plus.me',

g_makeApiCall : function () {
     gapi.client.load('plus', 'v1', function() {
       var request = gapi.client.plus.people.get({
         'userId': 'me'
       });
       request.execute(function(resp) {
         var heading = document.createElement('h4');
         var image = document.createElement('img');
         image.src = resp.image.url;
         heading.appendChild(image);
         heading.appendChild(document.createTextNode(resp.displayName));

         document.getElementById('content').appendChild(heading);
       });
     });
},

g_handleAuthClick : function (event) {
    gapi.auth.authorize({client_id: this.g_clientId, scope: this.g_scopes, immediate: false}, this.g_handleAuthResult);
    return false;
},

g_handleAuthResult : function (authResult) {
    var authorizeButton = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
      authorizeButton.style.visibility = 'hidden';
      this.g_makeApiCall();
    } else {
      authorizeButton.style.visibility = '';
      authorizeButton.onclick = this.g_handleAuthClick;
    }
},

g_checkAuth : function () {
    gapi.auth.authorize({client_id: this.g_clientId, scope: this.g_scopes, immediate: true}, this.g_handleAuthResult);
},

g_load : function () {
  gapi.client.setApiKey(this.g_apiKey);
  window.setTimeout(this.g_checkAuth,1);
},
*/

vcard_parse: function(_input, fields) {
	
	$.mobile.loading( 'show', {
		text: 'Loading your VCF file, please wait..',
		textVisible: true,
		theme: 'b',
		html: ""
	});

	_input = _input.replace(/;CHARSET=utf-8/g,"");
	//replace(/\\,/, "");
	_input = _input.replace(/\\,/g, " ");
	_input = _input.replace(/\\n/g, " ");
	_input = _input.replace(/\\r/g, " ");
	_input = _input.replace(/\\:/g, " ");
	_input = _input.replace(/\\\\/g, " ");

	if(!Array.prototype.forEach){Array.prototype.forEach=function(d,c){c=c||this;for(var b=0,a=this.length;b<a;b++){d.call(c,this[b],b,this)}}}if(typeof Prototype!="undefined"||!Array.prototype.map){Array.prototype.map=function(d,c){c=c||this;var e=[];for(var b=0,a=this.length;b<a;b++){e.push(d.call(c,this[b],b,this))}return e}}if(typeof Prototype!="undefined"||!Array.prototype.filter){Array.prototype.filter=function(d,c){c=c||this;var e=[];for(var b=0,a=this.length;b<a;b++){if(d.call(c,this[b],b,this)){e.push(this[b])}}return e}}["forEach","map","filter","slice","concat"].forEach(function(a){if(!Array[a]){Array[a]=function(b){return this.prototype[a].apply(b,Array.prototype.slice.call(arguments,1))}}});Date.ISO8601PartMap={Year:1,Month:3,Date:5,Hours:7,Minutes:8,Seconds:9};Date.matchISO8601=function(a){return a.match(/^(\d{4})(-?(\d{2}))?(-?(\d{2}))?(T(\d{2}):?(\d{2})(:?(\d{2}))?)?(Z?(([+\-])(\d{2}):?(\d{2})))?$/)};Date.parseISO8601=function(e){var b=this.matchISO8601(e);if(b){var a=new Date,c,d=0;for(var f in this.ISO8601PartMap){if(part=b[this.ISO8601PartMap[f]]){a["set"+f]((f=="Month")?parseInt(part)-1:parseInt(part))}else{a["set"+f]((f=="Date")?1:0)}}if(b[11]){d=(parseInt(b[14])*60)+parseInt(b[15]);d*=((parseInt[13]=="-")?1:-1)}d-=a.getTimezoneOffset();a.setTime(a.getTime()+(d*60*1000));return a}};

    var regexps = {
      simple: /^(version|fn|title|org)\:(.+)$/i,
      complex: /^([^\:\;]+);([^\:]+)\:(.+)$/,
      key: /item\d{1,2}\./,
      properties: /((type=)?(.+);?)+/
    }
 
    var lines = _input.split(/\r?\n/);
    for (var n in lines) {
      line = lines[n];
      var results, key, value, properties, type;
      
      if(regexps['simple'].test(line))
      {
        results = line.match(regexps['simple']);
        key = results[1].toLowerCase();
        value = results[2];
        
        fields[key] = value;
      }
      
      else if(regexps['complex'].test(line))
      {
        results = line.match(regexps['complex']);
        key = results[1].replace(regexps['key'], '').toLowerCase();
        
        properties = results[2].split(';');
        properties = Array.filter(properties, function(p) { return ! p.match(/[a-z]+=[a-z]+/); });
        properties = Array.map(properties, function(p) { return p.replace(/type=/g, ''); });
        
        type = properties.pop() || 'default';
        type = type.toLowerCase();;
        
        value = results[3];
        value = /;/.test(value) ? [value.split(';')] : value;

        fields[key] = fields[key] || {};
        fields[key][type] = fields[key][type] || [];
        fields[key][type] = fields[key][type].concat(value);
      }
    }
    $.mobile.loading('hide');
},

timeAgo: function (then){
	var now = new Date();
	var milliSecondsSince = now.getTime() - then;
	var secondsSince = milliSecondsSince/1000;
	var minutesSince = secondsSince/60;
	var hoursSince = minutesSince/60;
	var daysSince = hoursSince/24;
	var weeksSince = daysSince/7;
	
	var retVal
	if (weeksSince >= 1)
		retVal = Math.round(weeksSince) + " week" + ((Math.round(weeksSince) > 1)?"s":"") + "  ago";
	else if(daysSince >= 1)
		retVal = Math.round(daysSince) + " day" + ((Math.round(daysSince) > 1)?"s":"") + "  ago";
		else if(hoursSince >= 1)
			retVal = Math.round(hoursSince) + " hour"  + ((Math.round(hoursSince) > 1)?"s":"") + "  ago";
			else if (minutesSince >= 1)
				retVal = Math.round(minutesSince) + " minute"  + ((Math.round(minutesSince) > 1)?"s":"") + "  ago";
				else if(secondsSince >= 1)
					retVal = Math.round(secondsSince) + " second" + ((Math.round(secondsSince) > 1)?"s":"") + "  ago";
					else retVal = "just now"
	
					return retVal;
},

getTitleSummaryNews: function (numReferrals, numUpdates) {
	
	var news = "";
	
	if (numReferrals > 1) {
		news = 'You have <font class="welcomeEm">'+numReferrals +'</font> new referrals';
		if (numUpdates > 1)
			news += " and <font class='welcomeEm'>" + numUpdates + "</font> of the referrals that you've given your partners have been updated" 
			else if(numUpdates > 0)
				news += " and <font class='welcomeEm'>1</font> of the referrals that you've given to a partner has been updated"

	} else {
		if (numReferrals > 0){
			news =  'You have <font class="welcomeEm">1</font> new referral';
			if (numUpdates > 1)
				news += " and <font class='welcomeEm'>" + numUpdates + "</font> of the referrals that you've given your partners have been updated" 
				else if(numUpdates > 0)
					news += " and <font class='welcomeEm'>1</font> of the referrals that you've given to a partner has been updated"
			
		} else {
			news = 'You have no new referrals';
			if (numUpdates > 1)
				news = "<font class='welcomeEm'>"+numUpdates +"</font> of the referrals that you've given your partners have been updated"
				else if(numUpdates > 0)
					news = "<font class='welcomeEm'>"+numUpdates +"</font> of the referrals that you've given to a partner has been updated"
					//else news+= " and none of the referral you've given your partners has been updated";
		}
			
	}
	if (news != "")
		news += " since your last log in.";
	
	return news;
	
},

getCityState: function(model){
	//,
	var city = model.get("cityAddress_work");
	var state = model.get("stateAddress_work");
	var retVal = "";
	if ($.hasVal(city) && $.hasVal(state)) retVal = city + ", "+state;
	if ($.hasVal(city) && !$.hasVal(state)) retVal = city;
	if (!$.hasVal(city) && $.hasVal(state)) retVal = state;
		
	return retVal
},

getMemberType: function(model){
	
	var isSpeaker = ($.hasVal(model.get('isSpeaker')) && model.get('isSpeaker') == 'true')?true:false;
	var isAmbassador = ($.hasVal(model.get('org_ambassadorId')) && model.get('org_ambassadorId') == model.get('id'))?true:false;
	var retVal = 'Member'
	if (isSpeaker && isAmbassador) retVal = 'Ambassador, Speaker';
	if (!isSpeaker && isAmbassador) retVal = 'Ambassador';
	if (isSpeaker && !isAmbassador) retVal = 'Speaker';
	return retVal

},

includeFieldDescription: function (description){
	return (!_.isUndefined(description) && !_.isNull(description))?"<div class='fieldDescription'>"+description+"</div>":"";
	
},

showIncomplProf: function(model){
	retVal = "display";
	var pic = model.get('photoUrl');
	var prof = model.get('profession');
	var zip = model.get('postalCodeAddress_work');
	var org = model.get('OrgId');
	var pp = model.get('powerpartner1');
	if ($.hasVal(pic) && $.hasVal(prof) && $.hasVal(zip) && $.hasVal(org) && $.hasVal(pp)){retVal = "hidden";}
	return retVal;
},
getPowerPartnerClass:function(model){
	var retVal = "arrow";
	var prof = model.get('profession');
	var pp = rwFB.powerpartner1;
	if ($.hasVal(prof) && $.hasVal(pp) && pp.indexOf(prof) > -1){
		retVal = "pp";
	}
	return retVal;
},


getPositionDetail: function (jobTitle,business,separator){
	var retVal = separator;
	if ($.hasVal(jobTitle) && $.hasVal(business))
		retVal = jobTitle + ", "+business;
	if ($.hasVal(jobTitle) && !$.hasVal(business))
		retVal = jobTitle;
	if (!$.hasVal(jobTitle) && $.hasVal(business))
		retVal = business;
	
	return retVal;

},
getPosition: function (jobTitle,business){

	return this.getPositionDetail(jobTitle,business,"&nbsp;");
},

getLongDate: function(model){
	var dateVal = model.get('datetime');
	return dateFormat(new Date(dateVal),'mm-dd-yyyy');	
},


getPositionComma: function (model){

	var jobTitle = model.get('jobTitle');
	var business = model.get('business');
	var retVal = this.getPosition(jobTitle,business);
	if (this.hasVal(retVal) && retVal != "&nbsp;")
		retVal = ", " + retVal;
	
	return retVal;
},

getPositionParentheses: function (model,jobTitleField,businessField){

	var jobTitle = model.get(jobTitleField);
	var business = model.get(businessField);
	var retVal = this.getPosition(jobTitle,business);
	if (this.hasVal(retVal) && retVal != "&nbsp;")
		retVal = " (" + retVal + ")";
	
	return retVal;
},

getPositionList:function(jobTitle,business){
	
	return $.getPositionListClass(jobTitle,business,null)
},
getPositionListClass:function(jobTitle,business,partyType){
	
	
	
	var val = this.getPosition(jobTitle, business);
	var replaceWith = "</p><p>";
	if ($.hasVal(partyType)){
		var className = "";
		//var className = (partyType == 'PARTNER')?"partnerName":"contactName";
		replaceWith = "</p><p class='"+className+"'>"; 
	}
	val = val.replace(",",replaceWith);
	return val;
},

getHiddenListFilters:function(attributes,model){

	var retVal = "";
	
	for (i=0;i<attributes.length;i++){
		if (this.hasVal(attributes[i].filter) && attributes[i].filter){
			
			var thisItem = model.get(attributes[i].fldname);
			retVal=(retVal!="")?retVal+" "+thisItem:thisItem;
		}
	}
	
	return retVal;
},

getAltValue: function (datum,altvalue){
	return (!_.isUndefined(datum) && !_.isNull(datum) && datum != "")?datum:altvalue;
},

getPlaceHolder: function (datum,altvalue){
	//returns altvalue IF datum is null
	return (!_.isUndefined(datum) && !_.isNull(datum) && datum != "")?"":altvalue;
},


addPossessiveSuffix: function (noun){
	var retVal = noun;
	if ($.hasVal(noun)){
		var lastLetter = noun.charAt(noun.length-1);
		if (lastLetter == "s")
			retVal+="'";
		else
			retVal+="'s";
	}
	
	return retVal;
},

urlPrefix: function(url){
	retVal = "";
		if ($.hasVal(url) && url.length > 4){
			var start = url.substr(0,4);
			if (start == "http")
				retVal = url;
			else
				retVal = "http://" + url;
		}
	return retVal;
},

getFormattedVal: function (datum,format,altvalue){
	//if datum has a value, we'll search for & replace 'ZfieldVal' in the format string with datum. Else will return altvalue 
	
	var retVal = altvalue; 
	if (!_.isUndefined(datum) && !_.isNull(datum) && datum != ""){
		var re = new RegExp("ZfieldVal","g");
		retVal = format.replace(re,datum);
	}
	return retVal;
},

getFormattedValInner: function (datum,findVal,replaceVal,altvalue){
	//if datum has a value, we'll search for 'find' in the datum and replace with 'replace'  Else will return altvalue 

	var retVal = altvalue; 
	if (!_.isUndefined(datum) && !_.isNull(datum) && datum != ""){
		var re = new RegExp(findVal,"g");
		retVal = datum.replace(re,replaceVal);
	}
	return retVal;
},
getQuestionClass:function (model,number,trueClass){
	var questionVal = model.get("question" + number);
	var answerVal = model.get("answer" + number);
	var retVal = trueClass;
	
	if (!this.hasVal(questionVal) || !this.hasVal(answerVal))
		retVal = 'hidden';
	
	return retVal;
	
},


getDayOfWeek:function(intString){
	//var day = parseInt(intString);
	return rwcore.getLovDisplayVal('WEEKDAY',intString); 
},
getP2PAttr:function (model,attr){
	
	
	var retVal = 'err';
	
	if (model.get('toId') == rwFB.uId){
		retVal = model.get(attr+"2");
	}
	
	if (model.get('toId2') == rwFB.uId){
		retVal = model.get(attr);
	}
	
	return retVal
	
},
getP2PTopLineClass: function (model,useCase){
	return  this.getP2PConditionalClass(model,useCase,"referralListItemTopLine");
},
getP2PConditionalClass: function (model,useCase,showClass){
	var retVal = showClass;
	var partyType = $.getP2PAttr(model,'to_partyType');

	var isMember = false;
	if (partyType == "PARTNER")
		isMember = true;
	
	if (isMember && useCase != "isMember") //the 'isMember' use case will be shown - others will be hidden
			retVal = "hidden"
	
	if (!isMember && useCase != "isContact") //the 'isContact' use case will be shown - others will be hidden
			retVal = "hidden"
	
	return retVal;
				
},

getP2PStatusClass: function (model,useCase,showClass){
	
	
	var retVal = showClass;
	var status = model.get("status");
	
	var waitingForId = model.get("waitingForId")
	if (status == "UNREAD" && useCase != "unread"){
		retVal = "hidden"
	}
	if (status == "ACCEPTED" && useCase != "accepted"){
		retVal = "hidden"
	}
	if (status == "WAITING" && waitingForId == rwFB.uId && useCase != "waitingForMe"){
		retVal = "hidden"
	}
	if (status == "WAITING" && waitingForId != rwFB.uId && useCase != "waitingForOther"){
		retVal = "hidden"
	}
	return retVal;
	
},

getP2POutStatusClass: function (model,useCase,showClass){
	var retVal = showClass;
	var status = model.get("status");
	
	var waitingForId = model.get("waitingForId")
	var toId = model.get("toId");
	var toId2 = model.get("toId2");

	
	if (status == "UNREAD" && useCase != "unread"){
		retVal = "hidden"
	}
	if (status == "ACCEPTED" && useCase != "accepted"){
		retVal = "hidden"
	}
	if (status == "WAITING" && waitingForId == toId && useCase != "waitingForToId"){
		retVal = "hidden"
	}
	if (status == "WAITING" && waitingForId == toId2 && useCase != "waitingForToId2"){
		retVal = "hidden"
	}
	return retVal;
	
},

getP2PAcceptStatus: function (model){
	
	var status = model.get("status");
	var waitingForId = model.get("waitingForId")
	if (status == "UNREAD")
		retVal = "UNREAD"
	
	if (status == "ACCEPTED")
		retVal = "ACCEPTED"
	
	if (status == "WAITING" && waitingForId == rwFB.uId)
		retVal = "UNREAD"
	
	if (status == "WAITING" && waitingForId != rwFB.uId)
		retVal = "WAITING"
	
	return retVal;
	
},

getP2POutPartyHREF: function(model,partyFKField){

	var retVal = "err";
	var partyId = model.get(partyFKField);
	var partyType = (partyFKField.indexOf("2") == -1)?model.get("to_partyType"):model.get("to_partyType2");
	
	if (partyType = "CONTACT"){
		retVal = "#contactReferrals/" + partyId;
	}
	if (partyType = "PARTNER"){
		retVal = "#lookupPartnerProfile/" + partyId + "/PARTNER";
	}
	
	return retVal;
},


referralListToParty : function (model,listName){
	var referralType = model.get('referralType');
	var status = model.get("status");
	var toId = model.get('toId');
	var toId2 = model.get('toId2');
	var retVal = "";
	if (listName == "InBoxList"){
		if (referralType == 'CUST_FOR_PART' && status != "UNREAD") 
			retVal = "<span class='contactName'>"+model.get('contact_fullName')+"</span> was referred to you";
		
		if (referralType == 'CUST_FOR_PART' && status == "UNREAD") 
			retVal = "A <span class='contactName'>prospect</span>  was referred to you";
		
		if (referralType == 'PART_FOR_PART' & toId == rwFB.uId)
			retVal = "<span class='partnerName'>"+model.get('to_fullName2')+"</span>";
		
		if (referralType == 'PART_FOR_PART' & toId2 == rwFB.uId)
			retVal = "<span class='partnerName'>"+model.get('to_fullName')+"</span>";
		
		if (referralType == 'PART_INVITE')
			retVal = "<span class='partnerName'>"+model.get('from_fullName')+"</span>";

		if (referralType == 'INMAIL_REFERRAL')
			retVal = "Message from <span class='partnerName'>"+model.get('from_fullName')+"</span>";
	}
	if (listName == "OutBoxList"){
		var CFB_Answer1 = model.get('CFB_Answer1');
		var CFB_Answer2 = model.get('CFB_Answer2');
		if (referralType == "CUST_FOR_PART" && $.hasVal(CFB_Answer1) && CFB_Answer1 == "Yes") ///thumbsDown.png/CFB_Answer2/No
			retVal = "You referred <span class='contactName'>" + model.get('contact_fullName') + "</span><img src='" + rwFB.CDN + "/images/thumbsUp.png' style='height:16px'>"
		if (referralType == "CUST_FOR_PART" && $.hasVal(CFB_Answer2) && CFB_Answer2 == "No")
			retVal = "You referred <span class='contactName'>" + model.get('contact_fullName') + "</span><img src='" + rwFB.CDN + "/images/thumbsDown.png' style='height:16px'>"
		if (referralType == "CUST_FOR_PART" && !$.hasVal(CFB_Answer1) && !$.hasVal(CFB_Answer2))
			retVal = "You referred <span class='contactName'>" + model.get('contact_fullName') + "</span>";
		if (referralType == "PART_FOR_PART")
			retVal = "You referred <span class='partnerName'>"+ model.get('to_fullName2') + "</span>";
		if (referralType == "PART_INVITE")
			retVal = "<span>You invited <font class='partnerName'>"+ model.get('to_fullName') +"</font><span>"
		if (referralType == "INMAIL_REFERRAL")
			retVal = "<span>Your Message to <font class='partnerName'>"+ model.get('to_fullName') +"</font><span>"
	}
	
	return retVal;
	
},

getProspectReferralStatusOrder : function(model){
	var msg = "--";
	var status = model.get("status");
	switch(status)
	{
	case 'IGNORED':
	  msg = "1 Unclaimed";
	  break;
	case 'UNREAD': 
	  msg = "1 Unclaimed";
	  break;
	case 'ACCEPTED':
	  msg = "2 Claimed";
	  break;  
	case 'CONFIRMED':
	  msg = "3 Contacted";
	  break;  
	case 'CONVERTED':
	  msg = "4 Converted";
	  break;  
	case 'NOSALE':
	  msg = "5 Closed - No Sale";
	  break;  
	default:
	 msg = "";
	  
	}
	return msg;	
	
},

getProspectReferralStatusDisplay : function(model,statusField){
	var msg = "--";
	var status = model.get(statusField);
	switch(status)
	{
	case 'IGNORED':
	  msg = "1 Unclaimed";
	  break;
	case 'UNREAD': 
	  msg = "Unclaimed";
	  break;
	case 'ACCEPTED':
	  msg = "Claimed";
	  break;  
	case 'CONFIRMED':
	  msg = "Contacted";
	  break;  
	case 'CONVERTED':
	  msg = "Converted";
	  break;  
	case 'NOSALE':
	  msg = "Closed - No Sale";
	  break;  
	default:
	 msg = "";
	  
	}
	return msg;	
	
},

getConnectionReferralStatus:function(model){

	var retVal = new Object();
	var msg = "--";
	var order = 1;
	var status = model.get("status");
	var notYetAccepted = "Not Yet Accepted";
	
	
	switch(status)
	{
	case 'IGNORED':
	  msg = notYetAccepted;
	  break;
	case 'UNREAD': 
	  msg = notYetAccepted;
	  break;
	  
	case 'WAITING': 
	  msg = notYetAccepted;
	  
	  var waitingForId  = model.get('waitingForId');
	  if (waitingForId != rwFB.uId){
	  	msg = "Waiting For Other";
	  	order = 2;
	  }   
	  break;
	  
	case 'ACCEPTED':
	  msg = "Accepted";
	  order = 3;
	  break;  
	}
	retVal.msg = msg;
	retVal.order = order;
	return retVal;	

},

getConnectionReferralOutStatus:function(model){

	var retVal = new Object();
	var msg = "--";
	var order = 1;
	var status = model.get("status");
	var notYetAccepted = "Not Yet Accepted";
	
	
	switch(status)
	{
	case 'IGNORED':
	  msg = notYetAccepted;
	  break;
	case 'UNREAD': 
	  msg = notYetAccepted;
	  break;
	  
	case 'WAITING': 
	  msg = "Waiting for One Party";
	  order = 2;
	  break;
	  
	case 'ACCEPTED':
	  msg = "Accepted";
	  order = 3;
	  break;  
	}
	retVal.msg = msg;
	retVal.order = order;
	return retVal;	

},

referralListStatus : function (model,listName){//used by referal inbox to render
	var status = model.get('status');
	var referralType = model.get('referralType');
	var waitingForId  = model.get('waitingForId');
	if (listName == 'InBoxList'){
		if(status == "WAITING" && waitingForId == rwFB.uId){
			status = "UNREAD"
		}
				
		retVal = "<span class='referralListStatusLabel'><font class='status-"+ status + " referralType-" + referralType + "'>" + $.formatOutBoxStatusShort(model) + "</font></span>"
	}if (listName == 'OutBoxList'){
		retVal = "<span class='referralListStatusLabel'><font class='status-"+ status + " referralType-" + referralType + "'>" + $.formatOutBoxStatusShort(model) + "</font></span>"
	}
	
	return retVal;
},

referralListFrom : function (model,listName){
	var referralType = model.get('referralType');
	if (listName == "InBoxList"){
	
		retVal = "<p>by <font style='font-weight:bold;color:firebrick;text-shadow:none'>"+model.get('from_fullName')+"</font> on " + $.getFormattedDate(model.get('rw_created_on').$date) + "</p>";
		if (referralType == "PART_INVITE")
			retVal = "<p>invited you to connect as partners</p>";
	}
	if (listName == "OutBoxList"){
		retVal = "<p>to <font class='partnerName'>"+model.get('to_fullName')+"</font> on "+$.getFormattedDate(model.get('rw_created_on').$date) +"</p>"
		if (referralType == "PART_INVITE")
			retVal = "<p>to connect as partners</p>"
		
	}
	return retVal;
},

getReferralUpdateButtonClass: function (model,ChangeToStatus){
	var status = model.get('status');
	var referralType = model.get("referralType");
	var retVal = 'hidden';
	var displayClass = 'button';
	//right now this function is being used by the ReferralMenuTemplate -- for 
	//displaying the Confirm and Convert buttons
	if (referralType == 'CUST_FOR_PART'){
		if (status == 'ACCEPTED' && ChangeToStatus == 'CONFIRM')
			retVal = displayClass;
			
		if (status == 'CONFIRMED' && ChangeToStatus == 'CONVERT')
			retVal = displayClass;
	}
	return retVal;
},

getRDStatus : function (model,listName){//get referral display status for appletmenu on referral list.  used for P2P referral 
	var status = model.get('status');
	
	var waitingForId  = model.get('waitingForId');
	
	if(status == "WAITING" && waitingForId == rwFB.uId)
		status = "UNREAD"
	
	
	return status;
},



getRSStatus : function (model){//get the status that the referral should be set to if the user clicks Accepts
	//assumes the referral is starting in an unread or waiting state
	var status = model.get("status");
	var referralType = model.get("referralType");
	var retVal = "ACCEPTED"; //the default
	if (status == "UNREAD" && referralType == "PART_FOR_PART")
		retVal = "WAITING"
	return retVal
	
},



archiveButtonClass : function(model){
	var archiveFlag = ($.hasVal(model.get('archiveFlag')) && (model.get('archiveFlag') == "true" || model.get('archiveFlag') == true))?true:false;
	var apparentStatus = $.getRDStatus(model);
	
	return (!archiveFlag && apparentStatus !='UNREAD')?'button':'hidden';
},




getExpectCallText: function (model){
	var retVal = "No";
	var expectsCall = model.get('can_contact');
	if ($.hasVal(expectsCall) && expectsCall)
		retVal = "Yes"
			
	return retVal;
	
},

getReferralCustomQClass: function(model){
	var q1 = model.get('question1');
	var call = model.get('can_contact');
	
	if ($.hasVal(q1) || ($.hasVal(call) && call))
		return 'hidden';
	else
		return '';
},

getSearchResultDesc: function(category,keyword,zip){
	var ckz = category + " : '" + keyword + "' near " + zip;  
	var kz = "'" + keyword + "' near " + zip;  
	var z = "All businesses near " + zip;
	var ck = category + " : '" + keyword + "'";
	var cz = category + " near " + zip;  
	var c = category;
	var k = "'" + keyword + "'";

	var retVal = "All businesses";
	if (category != "none" && keyword != "none" && zip != "none"){retVal = ckz};
	if (category == "none" && keyword != "none" && zip != "none"){retVal = kz};
	if (category == "none" && keyword == "none" && zip != "none"){retVal = z};
	if (category != "none" && keyword != "none" && zip == "none"){retVal = ck};
	if (category != "none" && keyword == "none" && zip != "none"){retVal = cz};
	if (category != "none" && keyword == "none" && zip == "none"){retVal = c};
	if (category == "none" && keyword != "none" && zip == "none"){retVal = k};
	if (_.isUndefined(category) && _.isUndefined(keyword) && _.isUndefined(zip)){retVal = "";}
	return retVal;
},

getInvitationText: function (model,toFirstName,toPartyType){
	
	var fromFullName = (!_.isUndefined(rwFB.fullName))?rwFB.fullName:"";
	var fromJobTitle = (!_.isUndefined(rwFB.jobTitle))?rwFB.jobTitle:"";
	var fromBusiness = (!_.isUndefined(rwFB.business))?rwFB.business:"";
	var tenantName = (!_.isUndefined(rwFB.rwTenantDisplayName))?rwFB.rwTenantDisplayName:"this tool";
	
	
	var OONTemplate = "ZtoFirstName,\n\nI'd like to invite you to connect through ZtenantName. I've found it to be a really useful way to share opportunities with other businesses."
	OONTemplate +=	"\n\nZfromFullName\nZfromJobTitle\nZfromBusiness";
	
	var memberTemplate = "ZtoFirstName,\n\nI'd like to invite you to become part of my partner network."
		memberTemplate +=	"\n\nZfromFullName\nZfromJobTitle\nZfromBusiness";
	
	var template = (toPartyType == 'PARTNER')?memberTemplate:OONTemplate;
	template = template.replace("ZtoFirstName",toFirstName);
	template = template.replace("ZfromFullName",fromFullName);
	template = template.replace("ZfromJobTitle",fromJobTitle);
	template = template.replace("ZfromBusiness",fromBusiness);
	template = template.replace("ZtenantName",tenantName);
	
	return template;
},

getLIList:function(longStr) {
	retVal = "";
	if (this.hasVal(longStr)){
		var regex = new RegExp('\n', 'g');
		retVal = longStr.replace(regex,"<br>");
	}
	
	return retVal;
},


formatHref:function(href,idField,model){
	var retVal = "";
	if (this.hasVal(href)) {
		var anchorVal = null;
		if (this.hasVal(idField) && idField != "undefined"){
			anchorVal = href+"/"+model.get(idField);
			//retVal = "href = '" + anchorVal + "'";
			retVal = anchorVal;
		}
		else {
			//retVal = "href = '" + href + "'";
			retVal = href;
		}
	}
	return retVal;
			
},

getComposite:function(model,fields){
	var fAry = fields.split(",");
	var retVal = "";
	for (i=0;i<fAry.length;i++){
		var fldName = fAry[i];
		var fldVal = model.get(fldName);
		retVal+=(this.hasVal(fldVal) && i>0)?" ":'';
		retVal+=(this.hasVal(fldVal))?fldVal:'';
	}
	return retVal;
},


getFormattedLinkedInPositions: function(positionValues){
	
	
	var simpleTemplate = '<li><div class="experienceTitle">ZHeading</div><div>ZSummary</div></li>';
	var retVal="";
	for (i=0;i<positionValues.length;i++){
		var isCurrent = positionValues[i].isCurrent;
		if (!isCurrent){
			var thisPosition = positionValues[i];
			var title = thisPosition.title;
			var company = thisPosition.company.name;
			var summary = thisPosition.summary;
			var header = "";
			
			if ((!_.isUndefined(title) && !_.isNull(title) && title != "") && (!_.isUndefined(company) && !_.isNull(company) && company != "")){
				header = title + ", " + company;
			}
			if ((!_.isUndefined(title) && !_.isNull(title) && title != "") && (_.isUndefined(company) || _.isNull(company) || company == "")){
				header = title;
			}
			if ((_.isUndefined(title) || _.isNull(title) || title == "") && (!_.isUndefined(company) && !_.isNull(company) && company != "")){
				header = company;
			}
			
			if (_.isUndefined(summary) || _.isNull(summary) || summary == "")
				summary = "";
			
			var thisLine = simpleTemplate.replace("ZHeading",header);
			thisLine = thisLine.replace("ZSummary",summary);
			retVal += thisLine;
		}
		
	}

	if (retVal !=""){
		var container = "<tr><td class='pLeftCol'>Past</td><td><ul>Zpositions</ul></td></tr>";
		retVal = container.replace("Zpositions",retVal);
	}
	return retVal;
	
	
},

getSampleLinkedInModel: function(){

	var model = {
		module:"UserMgr",
		firstName:"Alex",
		lastName:"Chervet",
		jobTitle:"Business & Marketing",
		location:{
			country:{
				code:"us"
			},
			name:"San Francisco Bay Area"
		},
		positions:{
			_total:1,
			values:[
			    {
				    company:{
				    	id:7300,
				    	industry:"Semiconductors",
				    	name:"Silicon Image",
				    	size:"201-500 employees",
				    	ticker:"SIMG",
				    	type:"Public Company"
				    },
					id:4038956,
					isCurrent:true,
					startDate:{
						month:5,
						year:2005
					},
					summary:"Inventors of DVI, HDMI and MHL.  Three world-wide standards, over 3 billion (yes billion with a B) ports shipped!",
					title:"Sr. Director of Marketing"
				},
				{
				    company:{
				    	id:7301,
				    	industry:"Semiconductors",
				    	name:"Echelon",
				    	size:"201-500 employees",
				    	ticker:"EXPL",
				    	type:"Public Company"
				    },
					id:4038957,
					isCurrent:false,
					startDate:{
						month:5,
						year:2005
					},
					summary:"Networking everything that is *not* a computer. Products for buildings, utilities, factories, homes and transportation.",
					title:"Product management, Inventor of the i.LON Family of Products"
				},
				{
				    company:{
				    	id:7301,
				    	industry:"Semiconductors",
				    	name:"BASF",
				    	size:"201-500 employees",
				    	ticker:"EXPL",
				    	type:"Public Company"
				    },
					id:4038958,
					isCurrent:false,
					startDate:{
						month:5,
						year:2005
					},
					summary:"One of the worlds largest chemical companies. They don't make stuff, they make stuff better. (And, yes, they also made cassette tapes)",
					title:"Software Developer - Technology Applications Group"
				}
			]
		},
		bio:"Alex Chervet is the Senior Director of Marketing for Silicon Image, overseeing the companys Digital Television, Home Theater and Automotive businesses. \n \nHe is recognized as a highly imaginative creator of exceptional products who specializes in combining ideas from two or three separate disciplines to create something new and unique.  His 20 years of technical experience and practical business sense make him a trusted advisor to customers & colleagues and an effective business leader. \n\nMr. Chervet has a natural and engaging presentation style.  His insightful view of markets and trends combined with an ability to describe even the most complex systems in terms that anybody can understand, make him a highly sought after presenter. <br><br>Prior to joining Silicon Image, Mr. Chervet held various management and development positions in the USA and Europe at Echelon Corp., BASF, and Schindler Elevator Corp.  He has an extensive background in software, communication and networking systems, and has been awarded patents for his work in power line communications.  Mr. Chervet has participated in multiple standards efforts including IEEE 1473L / ANSI 709.1, HDMI and MHL technology.",
		LNProfileId:"Pcs8CZT_n8",
		LNProfile:"http://www.linkedin.com/in/alexchervet",
		numConnections:255
	};
	
	//var retVal = jQuery.parseJSON(model);


	
    var cm = new ReferralWire.StandardModel({module:"UserMgr"});
    cm.set({
        LNProfileId : model.LNProfileId,
        firstName : model.firstName,
        lastName :  model.lastName,
        jobTitle:model.jobTitle,
        bio:model.bio,
        numConnections:model.numConnections,
        LNProfile : model.LNProfile,
        positions: model.positions,
        location:model.location
    });
    
	return cm;
},

getCustomFieldClass: function (thisQ,nextQ){   //,defaultClass,lastItemClass,hiddenClass){
	var defaultClass ='';
	var lastItemClass ='fauxLast';
	var hiddenClass = 'hidden';
 

	var retVal = hiddenClass
	if (!_.isUndefined(thisQ) && !_.isNull(thisQ) && thisQ != ""){
		retVal = lastItemClass;
		
		if (!_.isUndefined(nextQ) && !_.isNull(nextQ) && nextQ != ""){
			retVal = defaultClass;
		}
	}
	return retVal;
},
/*
getStatusStyle:function(status){
	//console.log('getStatusStyle ' + status);
	var msg;
	switch(status)
	{

	case 'UNREAD': 
	  msg = 'background-color:pink';
	  break;
	case 'ACCEPTED':
	  msg = 'background-color:yellow';
	  break;
	case 'WAITING':
		  msg = 'background-color:orange';
		  break;
	case 'CONFIRMED':
	  msg = 'background-color:#bbf9bb';
	  break;  
	case 'CONVERTED':
	  msg = 'background-color:#2E8B57;color:white;text-shadow:none';
	  break;  
	default:
	 msg = "";
	  
	}
	return msg;

},
*/

getConditionalVal: function(sourceVal,equalToVal,ifEqual,ifNotEqual){


	var retVal = null;
	if (sourceVal==equalToVal){
		retVal = ifEqual;
	}
	else {retVal = ifNotEqual}
		

	return retVal;
},

getConditionalConnected : function(sourceVal,equalToVal,ifEqual,ifNotEqual, hideIf2){
	var r =  $.getConditionalVal(sourceVal,equalToVal,ifEqual,ifNotEqual);
	
	if ( !$.hasVal(sourceVal) ||  !$.hasVal(equalToVal) || r == ifEqual )
			return r;
	
	if( hideIf2 == 'connect') {	
		var c = new rwcore.StandardModel({ module : "PartnerMgr" , partnerId : sourceVal });
		var d = c.fetch({async : false});
		$.when(d).done( function (model) {
				r = ifEqual ;
		}).fail(function(response) { r = ifNotEqual });
	}
	else if( hideIf2 == 'refer') {	
		var c = new rwcore.StandardModel({ module : "PartnerMgr" , partnerId : sourceVal });
		var d = c.fetch({async : false});
		$.when(d).done( function (model) {
				r = ifNotEqual ;
		}).fail(function(response) { r = ifEqual });
	}

	return r;	

},

getPlural:function(quantity,pluralform,singularform){
	var retVal = pluralform;
	if (quantity == 1)
		retVal = singularform;
	return retVal;
},

getArticle:function(noun){
	var retVal = "a";
	var lnoun = noun.toLowerCase();
	
	if ( lnoun.charAt(0) in { 'a':1, 'e':1, 'i':1,'o':1,'u':1 } )
		retVal = "an";
	return retVal;
},

getFormattedDate:function(dtObj){

	if (_.isObject(dtObj)){dtObj = dtObj.$date}
	var dateObject = new Date(dtObj);
	var dateOfMonth = dateObject.getDate();
	var month = dateObject.getMonth() + 1;
	var year = dateObject.getFullYear().toString();
	year = year.substr(2,2);
	var dateString = month + "/" + dateOfMonth + "/" + year;
	return dateString;
},


formatOutBoxStatusShort:function(model){

	var status = model.get('status');
	var referralType = model.get('referralType');
	var fromId = model.get('fromId');
	var inBox = (fromId == rwFB.uId)?false:true;
	var toFirstName = model.get('to_firstName');
	var contactFirstName = model.get('contact_firstName');
	var timeAgo = $.timeAgo(model.get('statusChangeDate').$date)
	var shareNoSaleUpdate = model.get('shareNoSaleUpdate');
	var msg = "";
	
	//You <font class="Zlhs 'status-' + model.get('status') + ' referralType-' + model.get('referralType')Zrhs"> Zlhs $.formatOutBoxStatusShort(model) Zrhs</font> the prospect.

	if (referralType == 'CUST_FOR_PART'){
		
		switch(status)
		{
		case 'IGNORED':
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'> have not Claimed</font> the lead":"ZtoFirstName <font class='status-Zstatus referralType-ZreferralType'> has not Claimed</font> the lead";
		  break;
		case 'UNREAD': 
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'> have not Claimed</font> the lead":"ZtoFirstName <font class='status-Zstatus referralType-ZreferralType'> has not Claimed</font> the lead";
		  break;
		case 'ACCEPTED':
		  //msg = (inBox)?'have Claimed':'was Claimed';
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'> have Claimed</font> the lead":"ZtoFirstName <font class='status-Zstatus referralType-ZreferralType'> Claimed</font> the lead <span class='extraRefDetail'>ZtimeAgo</span>";
		  break;  
		case 'CONFIRMED':
		  //msg = (inBox)?'have Contacted':'was Contacted';
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'> have Contacted</font> ZcontactFirstName":"ZtoFirstName <font class='status-Zstatus referralType-ZreferralType'> Contacted</font> ZcontactFirstName <span class='extraRefDetail'>ZtimeAgo</span>";
		  break;  
		case 'CONVERTED':
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'> have Converted</font> the lead":"ZtoFirstName <font class='status-Zstatus referralType-ZreferralType'> has Converted</font> the lead <span class='extraRefDetail'>ZtimeAgo</span>";
		  break;
		case 'NOSALE':
		  msg = (inBox)?"You have marked the lead as <font class='status-Zstatus referralType-ZreferralType'>Closed-No Sale</font>":"ZtoFirstName has marked the lead as <font class='status-Zstatus referralType-ZreferralType'>Closed-No Sale</font> <span class='extraRefDetail'>ZtimeAgo</span>";
		  break;    
		default:
		 msg = "";
		  
		}
	} 
	
	if (referralType == 'PART_FOR_PART'){
		var waitingForId = model.get("waitingForId")
		var toId = model.get("toId");
		var toId2 = model.get("toId2");
		
		
		//var waitingForFirstName = (!inBox && status == 'WAITING' && model.get("waitingForId") == model.get("toId"))?model.get('to_firstName'):(!inBox && status == 'WAITING' && model.get("waitingForId") == model.get("toId2"))?model.get('to_firstName2'):'Me';
		//var notWaitingForFirstName = (!inBox && status == 'WAITING' && model.get("waitingForId") == model.get("toId"))?model.get('to_firstName2'):(!inBox && status == 'WAITING' && model.get("waitingForId") == model.get("toId2"))?model.get('to_firstName'):'Me';

		var waitingForFirstName = (status == 'WAITING' && waitingForId == model.get("toId"))?model.get('to_firstName'):(status == 'WAITING' && waitingForId == model.get("toId2"))?model.get('to_firstName2'):'Me';		
		var notWaitingForFirstName = (status == 'WAITING' && model.get("waitingForId") == model.get("toId"))?model.get('to_firstName2'):(status == 'WAITING' && model.get("waitingForId") == model.get("toId2"))?model.get('to_firstName'):'Me';


		switch(status)
		{
		case 'IGNORED':
		  msg = 'Not Accepted';
		  break;
		case 'UNREAD': 
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'>have Not Accepted</font> the introduction":"<font class='status-Zstatus referralType-ZreferralType'>has not been Accepted</font> by either party";
		  break;
		case 'ACCEPTED':
		  //msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'>have Accepted</font> the introduction":"<font class='status-Zstatus referralType-ZreferralType'>has been Accepted</font> by both parties";
		  msg = (inBox)?"Both of you <font class='status-Zstatus referralType-ZreferralType'>have Accepted</font> - you're now connected to each other.":"<font class='status-Zstatus referralType-ZreferralType'>has been Accepted</font> by both parties";
		  break;
		case 'WAITING':
			if (inBox) {
				if (waitingForId == rwFB.uId){
					msg = "You <font class='status-UNREAD referralType-ZreferralType'>have Not Accepted</font> the introduction";
				} else {
					msg = "You have <font class='status-ACCEPTED referralType-ZreferralType'>Accepted</font> the introduction; <font class='status-WAITING referralType-ZreferralType'>ZwaitingForFirstName has not.</font>";
				}
			} else {
				msg = "ZnotWaitingForFirstName has accepted; the introduction is now <font class='status-Zstatus referralType-ZreferralType'>Waiting</font> on ZwaitingForFirstName";
			}
		 break;
		default:
		 msg = "";		  
		}
	
	
	}
	
	if (referralType == 'PART_INVITE'){
		
		switch(status)
		{
		case 'IGNORED':
		  msg = 'Not Accepted';
		  break;
		case 'UNREAD': 
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'>have Not Accepted</font> the invitation":"ZtoFirstName <font class='status-Zstatus referralType-ZreferralType'> has not Accepted</font> the invitation";
		  break;
		case 'ACCEPTED':
		  msg = (inBox)?"You <font class='status-Zstatus referralType-ZreferralType'>have Accepted</font> the invitation.":"<font class='status-Zstatus referralType-ZreferralType'>was Accepted</font>";
		  break;
		default:
		 msg = "";		  
		}
	
	
	}
	
	msg = msg.replace(/Zstatus/g,status);
	msg = msg.replace(/ZreferralType/g,referralType);
	msg = msg.replace(/ZtoFirstName/g,toFirstName);
	msg = msg.replace(/ZcontactFirstName/g,contactFirstName);
	msg = msg.replace(/ZtimeAgo/g,timeAgo);
	msg = msg.replace(/ZnotWaitingForFirstName/g,notWaitingForFirstName);
	msg = msg.replace(/ZwaitingForFirstName/g,waitingForFirstName);
		
	
	return msg;
},

formatOutBoxStatus:function(toFirstName,status,statusChangeDate){
	
	/*<span style="color:firebrick;font-size:20pt">Zlhs model.get('to_firstName') Zrhs</a> have Zlhs model.get('status').toLowerCase() Zrhs the referral. -->*/
	var msg
	var dateStr = "";
	
	if (!_.isUndefined(statusChangeDate) && !_.isNull(statusChangeDate) && statusChangeDate != "")
		dateStr = this.getFormattedDate(statusChangeDate);
	
	switch(status)
	{
	case 'IGNORED':
	  msg = 'ZToFirst has not yet accepted the referral';
	  break;
	case 'UNREAD': 
	  msg = 'ZToFirst has not yet accepted the referral';
	  break;
	case 'ACCEPTED':
	  msg = 'ZToFirst accepted the referral on ZStatusChgDate';
	  break;  
	case 'CONFIRMED':
	  msg = 'ZToFirst confirmed that the prospect is interested on ZStatusChgDate';
	  break;  
	case 'CONVERTED':
	  msg = 'ZToFirst successfully converted the prospect into a customer on ZStatusChgDate';
	  break;  
	default:
	 msg = "";
	  
	}
	
	
	msg = msg.replace('ZToFirst','<a class="partnerName light">ZToFirst</a>');
	msg = msg.replace('ZToFirst',toFirstName);
	msg = msg.replace('ZStatusChgDate', dateStr);
	
	return msg;
},

getDataGridLetter:function(numViewBarItems){
	var retVal = "d"
	switch(numViewBarItems){
		case 1:retVal = "a";
		break;
		
		case 2:retVal ="a";
		break;
		
		case 3:retVal ="b";
		break;
		
		case 4:retVal ="c";
		break;
		
		case 5:retVal ="d";
		break;
		
		default:retVal ="d";
	}
	
	return retVal;
},

getStarClass: function(score){
	retVal = "stars none";
	if (score > 0 && score <= .2)
		retVal = "stars one"

	if (score > .2 && score <= .4)
		retVal = "stars two"
	
	if (score > .4 && score <= .6)
		retVal = "stars three"
	
	if (score > .6 && score <= .8)
		retVal = "stars four"
		
	if (score > .8 && score <= 1)
		retVal = "stars five"

	return retVal;	
},

getHarveyClass:function(spec,met){
	retVal = "harveyBall empty";
	var lMet = ($.hasVal(met))?met:0;
	var lSpec = ($.hasVal(spec))?spec:0;
	var score = lMet/lSpec;
	
	if (score > .0 && score <= .25)
		retVal = "harveyBall oneqtrs"
	
	if (score > .25 && score <= .5)
		retVal = "harveyBall twoqtrs"
	
	if (score > .5 && score <= .75)
		retVal = "harveyBall threeqtrs"
	
	if (score > .75 && score <= 1)
		retVal = "harveyBall full"

	return retVal;	
},

substituteVals: function(label,model){
	
	//takes a string "some text [fieldName] other text" and substitutes the [fieldName] with the field value from the model
	var re = new RegExp(/\[(.*?)\]/g);
	var fieldNameAry = label.match(re);
	
	if ($.hasVal(fieldNameAry) && fieldNameAry.length > 0){

		for (j=0;j<fieldNameAry.length;j++){
			var field = fieldNameAry[j];
			var fieldName = field.replace("[","");
			fieldName = fieldName.replace("]","");
			if (fieldName.charAt(0) == "_"){
				fieldName = fieldName.substr(1,fieldName.length - 1);
				var getFieldExp = model.get(fieldName);
				getFieldExp = this.addPossessiveSuffix(getFieldExp);
			} else {
				var getFieldExp = model.get(fieldName);
			}
			label = label.replace(field,getFieldExp);
		}
	}
	return label;

},

getLOV: function(lovType,fieldName,model){
	var GlobalVal = model.get(fieldName);
	var displayVal = rwcore.getLovDisplayVal(lovType, GlobalVal);
	
	return  displayVal;
},

formatLOV: function(lovType,fieldName,model){
	var GlobalVal = model.get(fieldName);
	var displayVal = rwcore.getLovDisplayVal(lovType, GlobalVal);
	var retVal = this.substituteVals(displayVal,model);
	return  retVal;
},

getFieldValOrDefault: function(model,fieldName,defaultVal){
	if ($.hasVal(model) && $.hasVal(model.get(fieldName))){
		return model.get(fieldName);
	} else {
		return defaultVal;
	}
},


nextDate:function(dayInt) {//returns calendar date for next weekday -- e.g., tuesday. weekday is expressed as an int from 0-6

	var date = new Date(this.nextDateObj(dayInt));
    return date.getDate();

},

nextDateObj:function(dayInt) {
	var day = parseInt(dayInt);
    var today = new Date();
    var today_day = today.getDay();
    
    day = (day <= today_day) ? (day + 7) : day;
    var daysUntilNext = day - today_day;
	var nextDate = new Date().setDate(today.getDate() + daysUntilNext);
    return nextDate;
},

nextMonthName:function(dayInt){
	var date = new Date(this.nextDateObj(dayInt));
	var monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var monthInt = date.getMonth();
	return monthArray[monthInt]
},

getDateElement:function(model,dateFieldName,element) {
	var dateVal = model.get(dateFieldName);
	if (dateVal.hasOwnProperty("$date")){
		dateVal = new Date(dateVal.$date);
	} else {
		dateVal = new Date(dateVal);
	}
	if (element == "month"){
		var monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		var monthInt = dateVal.getMonth();
		return monthArray[monthInt];
	}
	if (element == "day"){
		var dayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var dayInt = dateVal.getDay();
		return dayArray[dayInt];
	}
	if (element == "date"){
		return dateVal.getDate();
	}
},

concat:function(inputs){
	var args = (inputs.hasOwnProperty(0))?inputs[0]:inputs;
	
	var nextFullDate = $.nextDateObj(args.meetingDayOfWeek);
	var meetingDate = dateFormat(new Date(nextFullDate),'m/d/yyyy')
	
	return args.businessName + ' weekly meeting ' + meetingDate;

},
/*
getDay:function(model,fieldName){
	
	var fieldVal = new Date(2013, 8, 12, 7, 0, 0, 0);
	//var fieldVal = model.get(fieldName);
	var dayVal = new Date(fieldVal).getDay();
	var retVal = ReferralWireBase.getLovDisplayVal('WEEKDAY',dayVal);
	return retVal; 
},

getDate:function(model,fieldName){
	var fieldVal = new Date(2013, 8, 12, 7, 0, 0, 0);
	//var fieldVal = model.get(fieldName);
	var dateVal = new Date(fieldVal).getDate();
	return dateVal; 
},
*/


calcNextMeeting:function(inputs){

	var args = (inputs.hasOwnProperty(0))?inputs[0]:inputs;
	var nextFullDate = $.nextDateObj(args.meetingDayOfWeek);
	var nextDate = new Date(nextFullDate).getDate();
	var nextMonth = new Date(nextFullDate).getMonth();
	var nextYear = new Date(nextFullDate).getFullYear();

	
	if (args.meetingHour.hasOwnProperty("$date")){
		var dateVal = new Date(args.meetingHour.$date);
	} else {
		var dateVal = new Date(args.meetingHour);
	}
	//dateVal = $.getGMTTimeFromLocal(dateVal);//$.getLocalTimeFromGMT(dateVal);
	var nextHour = dateVal.getHours();
	var nextMin =  dateVal.getMinutes();
	var result = new Date();
	result.setFullYear(nextYear);
	
	result.setDate(nextDate);
	result.setMonth(nextMonth);
	result.setHours(nextHour);
	result.setMinutes(nextMin);
	//result = $.getGMTTimeFromLocal(result.getTime());
	return result.getTime();
	//return new Date(nextYear,nextMonth,nextDate,nextHour,nextMin,0);
},

calcNextMeetingDate:function(inputs){
	
	var args = (inputs.hasOwnProperty(0))?inputs[0]:inputs;
	var nextFullDate = $.nextDateObj(args.meetingDayOfWeek);
	var nextDate = new Date(nextFullDate).getDate();
	var nextMonth = new Date(nextFullDate).getMonth();
	var nextYear = new Date(nextFullDate).getFullYear();
	return new Date(nextYear,nextMonth,nextDate,0,0,0).getDate();
},

calcNextMeetingDay:function(inputs){
	
	var args = (inputs.hasOwnProperty(0))?inputs[0]:inputs;
	var nextFullDate = $.nextDateObj(args.meetingDayOfWeek);
	var nextDate = new Date(nextFullDate).getDate();
	var nextMonth = new Date(nextFullDate).getMonth();
	var nextYear = new Date(nextFullDate).getFullYear();
	var dayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var weekDay = new Date(nextYear,nextMonth,nextDate,0,0,0).getDay();
	return dayArray[weekDay];
},


formatDateTime:function(dateString){
	
	var dayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	return $.formatDateTimeOptions(dateString,dayArray,"m/d/yyyy");
},

formatDateTimeShort:function(dateString){
	
	var dayArray = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	return $.formatDateTimeOptions(dateString,dayArray,"m/d/yy");
},

formatDateTimeOptions:function(dateString, dayArray,datePattern){
	if (_.isObject(dateString)){dateString = dateString.$date}
	//var dateObj = new Date(dateString);
	//var dateObj = $.getLocalTimeFromGMT(dateString);
	var dateObj = new Date(dateString);
	//var dayArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var dayVal = dayArray[dateObj.getDay()];
	var dateVal = dateFormat(dateObj,datePattern);
	var timeVal = dateFormat(dateObj,"h:MM TT");
	var retVal = dayVal + ', ' + dateVal + ' at ' + timeVal;
	return retVal;
},

getDateTime:function(model,fieldName){
	
	var fieldVal = model.get(fieldName);
	if (!_.isUndefined(fieldVal) && !_.isNull(fieldVal)){
		if (fieldVal.hasOwnProperty("$date")){fieldVal = fieldVal.$date}
		//var dateObj = $.getLocalTimeFromGMT(fieldVal);
		var dateObj = new Date(fieldVal);
		var dateVal = dateFormat(dateObj,"m/d/yyyy");
		var timeVal = dateFormat(dateObj,"h:MM TT");
		retVal = dateVal + " " + timeVal;
	} else {
		retVal = "";
	}
	return retVal
	 
},

getTimeString:function(model,fieldName){
	return $.getTimeStringDetail(model,fieldName,'h:MM TT')
},



getTimeStringDetail:function(model,fieldName,format){
	
	var dateVal = model.get(fieldName);
	
	if (!_.isUndefined(dateVal) && !_.isNull(dateVal)){
		if (dateVal.hasOwnProperty("$date")){dateVal = dateVal.$date}
		
		//var retVal = dateFormat(new Date(dateVal),'hh:mm:ss')
		//dateVal = $.getLocalTimeFromGMT(dateVal);
		var retVal = dateFormat(new Date(dateVal),format)
	} else {
		retVal = "";
	}
	return retVal
},

getTimeStringVal:function(dateVal){
	var format = 'h:MM TT';
	if (!_.isUndefined(dateVal) && !_.isNull(dateVal)){
		if (dateVal.hasOwnProperty("$date")){dateVal = dateVal.$date}
		
		//var retVal = dateFormat(new Date(dateVal),'hh:mm:ss')
		//dateVal = $.getLocalTimeFromGMT(dateVal);
		var retVal = dateFormat(new Date(dateVal),format)
	} else {
		retVal = "";
	}
	return retVal

},

getLocalTimeFromGMT:function (sTime){ 
	
  	var dte = new Date(sTime);
  	var now = new Date();
	var locString = new String(window.location);
	
	//var n=locString.indexOf("localhost");
	//var n2 = locString.indexOf("192.168");
	//if (n != -1 && n2 != -1){
		  
		  dte.setTime(dte.getTime() - dte.getTimezoneOffset()*60*1000);
		  //console.log("getLocalTimeFromGMT local offset " + dte);       	
	//} else {
	//	console.log("no offset required " + dte);
	//}
	return dte;
},

getGMTTimeFromLocal:function (sTime){ 
		var dte = new Date(sTime);
		var now = new Date();
		var locString = new String(window.location);

		var n=locString.indexOf("localhost");
		if (n != -1){
			  dte.setTime(dte.getTime() + dte.getTimezoneOffset()*60*1000);       	
		} 
		return dte;

},
getDateString:function(model,fieldName){
	
	
	var dateVal = model.get(fieldName);
	if ($.hasVal(dateVal)){
		if (dateVal.hasOwnProperty("$date")){dateVal = dateVal.$date}
		//var retVal = dateFormat(new Date(dateVal),'mmm d, yyyy')
		dateVal = $.getLocalTimeFromGMT(dateVal);
		var retVal = dateFormat(new Date(dateVal),'m/d/yyyy')
	} else {
		var retVal = "";
	}
	return retVal;
},

getDateStringNoAdjust:function(model,fieldName){
	
	
	var dateVal = model.get(fieldName);
	if ($.hasVal(dateVal)){
		if (dateVal.hasOwnProperty("$date")){dateVal = dateVal.$date}
		//var retVal = dateFormat(new Date(dateVal),'mmm d, yyyy')
		var retVal = dateFormat(new Date(dateVal),'m/d/yyyy')
	} else {
		var retVal = "";
	}
	return retVal;
},

getMonthAndDate:function(model,fieldName){
	var dateVal = model.get(fieldName);
	if (_.isObject(dateVal)){dateVal = dateVal.$date}
	var monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var dayArray = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	if ($.hasVal(dateVal)){
		var monthNum = new Date(dateVal).getMonth();
		var dateNum = new Date(dateVal).getDate();
		var monthName = monthArray[monthNum];
		var dayNum = new Date(dateVal).getDay();
		var dayName = dayArray[dayNum];
		var retVal = dayName + ", " + monthName + " " + dateNum
	} else {
		var retVal = "";
	}
	return retVal;
	
},

getImageTN:function(model,photoField,altFilePath,className){
	var picUrl = $.getAltValue(model.get(photoField),altFilePath)
	console.log (picUrl +  ":" + rwFB.ImageCDN);
	var n = picUrl.indexOf(rwFB.ImageCDN);
	if (n == -1)
		retVal = '<img src="'+picUrl+'" class="'+className+'">'
	else 
		retVal = '<img src="'+picUrl+'_tn" class="'+className+'">'
	return retVal;
},

getImage:function(model,photoField,altFilePath,className, tn){
	var picUrl = $.getAltValue(model.get(photoField),altFilePath)
	retVal = '<img src="'+picUrl+'" class="'+className+'">'
	return retVal;
},

getImageWithId:function(model,photoField,altFilePath,className,id){
	var picUrl = $.getAltValue(model.get(photoField),altFilePath)
	retVal = '<img src="'+picUrl+'" class="'+className+'" id="' + id + '">'
	return retVal;
},

getMemberBadgeClass:function(model){
	var retVal = "hidden";
	if (model.get('isAmbassador') == "true"){
		retVal = "associateAmbassadorBadge"
	}
	if ((model.get('org_ambassadorId') == model.get('id'))){
		retVal = "primaryAmbassadorBadge";
	}
	return retVal;
},

calculateDistance:function(options){
		var lat1 = options.firstPosition.lat;
		var lat2 = options.secondPosition.lat;
		var lon1 = options.firstPosition.lng;
		var lon2 = options.secondPosition.lng;
		unit = "M";
	
	    var radlat1 = Math.PI * lat1/180
	    var radlat2 = Math.PI * lat2/180
	    var radlon1 = Math.PI * lon1/180
	    var radlon2 = Math.PI * lon2/180
	    var theta = lon1-lon2
	    var radtheta = Math.PI * theta/180
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    dist = Math.acos(dist)
	    dist = dist * 180/Math.PI
	    dist = dist * 60 * 1.1515
	    if (unit=="K") { dist = dist * 1.609344 }
	    if (unit=="N") { dist = dist * 0.8684 }
	    return dist

		
},

formatGroupBy:function(data,options){
/*
				
            	categoryField:'fullName',
            	series:[{name:'numNewMembers',field:'count',label:'New Members'}],
            	drillDownString:'#MemberOnlineInvites/ZIdentifier',
            	ZIdentifier:"_id",
*/
		
		var retVal = new Object();
		retVal.categoryAry = new Array();
		retVal.series = new Object();
		
		for (var j = 0; j < options.series.length; j++){
			retVal.series[options.series[j].name] = new Object();
			retVal.series[options.series[j].name].field = options.series[j].field;
			retVal.series[options.series[j].name].label = options.series[j].label;
			retVal.series[options.series[j].name].values = new Array();
		}
		for (var i=0;i<data.length;i++){
			var inputRow = data[i];
			retVal.categoryAry[i] = inputRow.get(options.categoryField);
			
		
			for (var j = 0; j < options.series.length; j++){
				if (options.hasOwnProperty('drillDownString')){
					//this combines a series value with a drill down url that takes the user to a list of
					//record that when into the series value
					var idFieldVal = inputRow.get(options.ZIdentifier);
					var url = options.drillDownString.replace("ZIdentifier",idFieldVal);
					var seriesId = options.series[j].name;
					var seriesField = options.series[j].field;
					var seriesObj = {y:inputRow.get(seriesField),url:url};
					retVal.series[seriesId].values[i] = seriesObj;
				} else {
					retVal.series[options.series[j].name].values[i] = inputRow.get(options.series[j].field);
				}
			}
		}
		return retVal;			        
	
},

groupByTransform:function(data,options){
/*	
            	categoryField:'from_fullName',
            	series:[{name:'numReferrals',description:{fieldName:'id',aggregateFunction:'count'}]]
            	sortByType:'series',
            	sortBy:'numReferrals',
            	sortOrder:'DESC'
*/
	var retVal = new Object();
	retVal.rowObjects = new Object();
	var guestTotals = new Object();
	
	for (var i=0;i<data.length;i++){
		var inputRow = data[i];
		var categoryVal = inputRow.get(options.categoryField);
		var seriesVals = new Object();
		for (var j = 0; j < options.series.length; j++){
			thisSeries = options.series[j];
			thisSeriesVal = inputRow.get(thisSeries.description.fieldName);
			if (!$.hasVal(thisSeriesVal)){thisSeriesVal = 0}
			else {
				if (thisSeries.description.aggregateFunction == 'count'){
					thisSeriesVal = 1;
				}
			}
			seriesVals[thisSeries.name] = thisSeriesVal;
		}
		
		var thisRow = null;
			if (_.has(retVal.rowObjects,categoryVal)){
				thisRow = retVal.rowObjects[categoryVal];
				for (var j = 0; j < options.series.length; j++){
					thisSeries = options.series[j];
					thisSeriesVal = seriesVals[thisSeries.name]
					thisRow.series[thisSeries.name] += thisSeriesVal;
					thisRow.rowTotal += thisSeriesVal; 
				}
				

			} else {
				thisRow = new Object();
				thisRow.series = new Object();
				thisRow.category = categoryVal;
				for (var j = 0; j < options.series.length; j++){
					thisSeries = options.series[j];
					thisSeriesVal = seriesVals[thisSeries.name]
					thisRow.series[thisSeries.name] = thisSeriesVal; 
					thisRow.rowTotal += thisSeriesVal;
				}
				retVal.rowObjects[categoryVal] = thisRow;
			}
			/*
			    Jim:{category:'Jim',series:{Mon:5,Wed:2,Fri:3}},
			    Sue:{category:'Sue',series:{Mon:4,Fri:5}},
			    Sara:{category:'Sara',series:{Mon:1,Fri:5}},
			*/
		 
	}
	var index = new Array();
	if (data.length > 0){
		if (options.sortByType == 'series'){ 	
			var index = _.sortBy(retVal.rowObjects, function(row) {
			return row.series[options.sortBy]
			});
		}
		if (options.sortByType == 'category'){ 	
			var index = _.sortBy(retVal.rowObjects, function(row) {
			return row.category[options.sortBy]
			});
		}
		if ($.hasVal(options.sortOrder) && (options.sortOrder == 'DESC')){
			index = index.reverse();
		}
		if ($.hasVal(options.limit)){
			index = _.first(index, options.limit)
		}
	}
	return index;

},


tableTransform:function(data,rowIdentifier,columnIdentifier){
	
	var retVal = new Object();
	retVal.rowObjects = new Object();
	retVal.guestRowAry = new Array(new Object(),new Object());
	retVal.totalFloaters = 0;
	retVal.totalNewMembers = 0;
	var uniqueColumns = new Object();
	var uniqueLongColumns = new Object();
	var guestTotals = new Object();
	
	for (var i=0;i<data.length;i++){
		var inputRow = data[i];
		var rowId = inputRow.get(rowIdentifier);
		var colId = this.getFormattedDate(inputRow.get(columnIdentifier));
		var primaryKey = inputRow.get('id');
		//this bit is specific to the attendence chart & will have to parameterized to use for other purposes
		var guestType = inputRow.get('guestType');
		if (guestType == 'MEMBER'){
		
			var thisRow = null;
			if (_.has(retVal.rowObjects,rowId)){
				thisRow = retVal.rowObjects[rowId];
				thisRow[colId] = primaryKey;
				uniqueColumns[colId] = colId;
				uniqueLongColumns[new Date(colId).getTime()] = colId;
			} else {
				thisRow = new Object();
				thisRow[colId] = primaryKey;
				uniqueColumns[colId] = colId;
				uniqueLongColumns[new Date(colId).getTime()] = colId;
				retVal.rowObjects[rowId] = thisRow;
			}
			/*
			{Jim:{Mon:1,Wed:2,Fri,3}}
			{Sue:{Mon:4,Fri:5}}
			{Greg:{Mon:6,Wed:7}}
			*/
		} else {
			if (guestType == 'FLOATER'){
				retVal.totalFloaters++;
				guestRowAryIndex = 0;
			} else{
				retVal.totalNewMembers++;
				guestRowAryIndex = 1;
			}
			
			thisRow = retVal.guestRowAry[guestRowAryIndex]
			if (_.has(thisRow,colId)){
				thisRow[colId] = thisRow[colId] + 1;
			} else {
				thisRow[colId] = 1;
			}
			
		}
		
	}
	if (data.length > 0){
		colArray = _.keys(uniqueLongColumns);
		rowArray = ($.hasVal(retVal.rowObjects))?_.keys(retVal.rowObjects):[""];
		var sortedColumns = colArray.sort();
		retVal.colIndex = new Array();
		for (var i=0;i<sortedColumns.length;i++){
			retVal.colIndex[i] = uniqueLongColumns[sortedColumns[i]];
		}
		retVal.rowIndex = rowArray.sort();
	}
	return retVal;
	
},

formatThumbnailCat:function() {
        var fString = "<a href='#memberProfile/id'><div class='chartLabelFrame'><img class='chartLabelImg' src='photoUrl'><div class='chartLabelName'>fullName</div></div></a>";
        if ($.hasVal(this.value)){
          for (var item in this.value){
            var val = (!_.isUndefined(this.value[item]))?this.value[item]:"";
            fString = fString.replace(item,val);
          }
        }
        return fString;
  },


wizardChartTemplates:{
	bar:{
		            chart: { renderTo: 'chartContainer', type: 'bar'},
					title: {  
						text:  'Bar Title'//m.get('reportName')
	                },
	                /*
		            subtitle: {
	                	text: _.isUndefined(that.options.subTitle)?'':that.options.subTitle
	            	},
	            	*/
	                credits : { enabled : false },
		            xAxis: {
		                tickLength: 0,
		                lineWidth: 0,
		                categories: ['cat1','cat2'],//_.map(series, function (item) { return item.display }),
		                title: {
		                	text: 'groupByDisplay',//m.get('groupByDisplay'),//_.isUndefined(that.options.xAxisTitle)?'':that.options.xAxisTitle
		                	margin: 20
		                },
		                labels: {
			                    color: '#fff',
			                    x: -5,
			                    useHTML: true,
			                    formatter: function () {return (this.value.length > 22)?this.value.slice(0, 22)+'...':this.value;},//this.formatter,
			                    style: {
					                width: '160px',	
					                whiteSpace: 'nowrap'
					            },
			                }
	            	},
		            yAxis: {
		                min : 0, 
		                title: {
	                		text: 'yAxisTitle'//this.yAxisTitle//_.isUndefined(that.options.yAxisTitle)?'':that.options.yAxisTitle
	                	},
	                	minTickInterval:1,
	                	allowDecimals:false,

		            },
		            plotOptions: {
		            	bar: {
		                    dataLabels: {
		                        enabled: true, 
		                        color: 'black',
		                        //format: "{point.y:.2f}"

		                    },
	                	},
		            },
		            legend: {
		                backgroundColor: '#FFFFFF',
		                reversed: true,
		                verticalAlign: 'bottom',
		                align: 'center'
		            },
		            series: 
						[{
	                			borderWidth: 1,
	                			borderRadius: 1,
	                			pointWidth: 20,
	                			shadow: false,
	                			data: [0,0],//series,
	                			name: 'metricName'//m.get('metricName')
	            		}]			
	},
	pie: {
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        title: {
		            text: 'Pie title'
		        },
		        tooltip: {
		    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		        },
		        credits : { enabled : false },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                slicedOffset: 20,
		                point: {
		                        events: {
		                            
		                        }
			             },
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true,
		                    color: '#000000',
		                    connectorColor: '#000000',
		                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
		                },
		            }
		        },
		        series: [{
		            type: 'pie',
		            data: [0,0],//series,
	                name: 'metricName'//m.get('metricName')
		        }]
	}
},






renderStandardBarChart:function(options){
	
	
    
    chartData = options;

	var chart = new Highcharts.Chart({
            chart: {
                type: 'bar',
                renderTo: chartData.renderTo,
                backgroundColor: 'rgba(255,255,255,.3)',
            },
            title: {
                text: chartData.title,
                style:{
                	fontWeight:'bold',
                	textShadow:'none',
                	fontSize:'16pt',
                },
                
            },

            xAxis: {
                categories: chartData.topMembers,
                labels: {
                	style:{
                		fontSize:'12pt',
                		fontWeight:'bold'
                	}
                }
                
                
            },
            yAxis: {
                min: 0,
                labels: {
                    overflow: 'justify',
                    style:{
                    	fontSize:'12pt'
                    }
                },
                title: {
                    text: chartData.unitLabel
                },
                 allowDecimals:false,
                
            },
            
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    },
                    color:'#008000'
                },
                
                series: {
	                cursor: 'pointer',
	                point: {
	                    events: {
	                        click: function() {
	                        	if ($.hasVal(this.options) && $.hasVal(this.options.url)){
	                        		window.location = this.options.url;
	                        	}
	                            
	                        }
	                    }
	   	            }
            	}
            },
        
            legend: {
                enabled:false
            },
            credits: {
                enabled: false
            },
            series: [{
                
                data: chartData.topMemberValues
            },]
        });

},

renderReferralStackedBarChart: function(options){
/*
	var DValues = {
		Accepted:{
			given:2,
			received:2
		},
		Confirmed:{
			given:4,
			received:2
		},
		Converted:{
			given:4,
			received:4
		}

	};
*/	
	chart = new Highcharts.Chart({
            chart: {
	            renderTo: options.barDiv,
                type: 'bar'
            },
            credits : {
			    enabled : false
			},
            title: null,
            xAxis: {
                categories: ['Given', 'Received']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Referrals'
                },
                minTickInterval: 1,
                allowDecimals:false
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true,
                itemStyle:options.itemStyle,
                width: options.barLegendWidth,
                x:options.barLegendStart,
                symbolWidth:options.barSymbolWidth
            },
            tooltip: {
                formatter: function() {
                    return ''+
                        this.series.name +': '+ this.y +'';
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    animation: options.animation
                }
            },
                series: [{
                name: 'Converted',
                data: [options.DValues.Converted.given,options.DValues.Converted.received],
                color: '#2E8B57',
            },{
                name: 'Confirmed',
                data: [options.DValues.Confirmed.given,options.DValues.Confirmed.received],
                color:'#bbf9bb'
                
            },{
                name: 'Accepted',
                data: [options.DValues.Accepted.given,options.DValues.Accepted.received],
                color: 'yellow'
            }
            
            ]
        });
	
	
	},

renderContactMarketSummaryChart: function(options){
	chart = new Highcharts.Chart({
            chart: {
            	renderTo: options.renderTo,
                type: 'bar'
            },
			title: {
                text: 'Contacts who Match My Criteria'
            },
            xAxis: {
                categories: ['Estimated Income', 'Location', 'Occupation', 'Business: Recent activity','Property: Recent activity'],
                title: {
                    text: null
                }
            },
            credits : {
			    enabled : false
			},
            yAxis: {
                min: 0,
                title: {
                    text: '% of My Contacts'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                bar: {
                    stacking: 'percent'
                }
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true
            },
            series: [{
                name: 'No Match',
                color: 'gray',
                data: [175, 92, 297, 376,365]
            }, {
                name: 'Match',
                color: '#228B22',
                data: [225, 308, 103, 24,35]
            } ]
        });



},

renderDeDupChart: function(options){
	var testing = new Highcharts.Chart({
			chart: {
                type: 'bar',
                renderTo: options.renderTo,
            },
            title: {
                text: 'Contacts with the Most Duplicates Before Merge'
            },
            subtitle: {
                text: 'Click bar for details'
            },
            tooltip: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: ['George Brown', 'Wells Fargo', 'Kelly Ryan', 'Dean Walter','Stacey Newman', 'Sandra Davies','Amicis','Brian Jones','Susan - Home', 'Susan - Work','Kyle Lipton'],
                title: {
                    text: null
                },
                tickInterval:1
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -100,
                y: 250,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            },
            
            plotOptions: {
                
                series: {
                    stacking: 'normal',
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
                                alert ('Category: '+ this.category +', value: '+ this.y);
                            }
                        }
                    }
                }
            },
            
        
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Before Merge',
                data: [12, 9, 8, 8, 6,3,2,2,2,2,2]
            } ]
	
	
	});

},

renderDeDupPieChart: function(options){
	

	var testing = new Highcharts.Chart({
		chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                renderTo: options.renderTo
            },
            title: {
                text: 'Copies of Each Contact Before Merge'
            },
            
            tooltip: {
            	headerFormat: '',
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            credits : {
			    enabled : false
			},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Duplicates',
                data: [
                    ['10+',25.0],
                    ['3-10',15],
                    ['2',10],
                    ['1', 50],
                ]
            }]
       });
},


renderClock: function(options){

	var testing = new Highcharts.Chart({
	    chart: {
	        type: 'gauge',
	        plotBackgroundColor: null,
	        plotBackgroundImage: null,
	        plotBorderWidth: 0,
	        plotShadow: false,
	        height: 140,
	        renderTo: options.renderTo,
	        spacingTop: 0,
            spacingBottom: 0,
            spacingLeft: 0,
            spacingRight: 0,
	    },
	    
	    credits: {
	        enabled: false
	    },
	    
	    title: null,
	    
	    
        plotOptions: {
            gauge: {
                    dial: {
                        radius: '100%',
                        borderColor: 'black',
                        borderWidth: 5,
                        baseLength: '50%', // of radius
                        rearLength: '20%'
                    }
                }
        },    
	    pane: {
	    	background: [{
	    		// default background
	    	}, {
	    		// reflex for supported browsers
                borderWidth: 6,
                borderColor: 'black',
                backgroundColor: 'white',
	    	}]
	    },
	    
	    yAxis: {
	        labels: {
	            enabled: false
	        },
	        min: 0,
	        max: 12,
	        lineWidth: 0,
	        showFirstLabel: false,
	        
	        minorTickInterval: null,
	        minorTickWidth: 1,
	        minorTickLength: 5,
	        minorTickPosition: 'inside',
	        minorGridLineWidth: 0,
	        minorTickColor: '#666',
	
	        tickInterval: 1,
	        tickWidth: 0,
	        tickPosition: 'inside',
	        tickLength: 10,
	        tickColor: '#666',
            title: {
	            text: 'A M',
	            style: {
	                color: 'darkgray',
	                fontWeight: 'normal',
	                fontSize: '24px',
	                lineHeight: '10px'                
	            },
	            y: 16
	        } 
	              
	    },
	    
	    tooltip: {
	    	enabled:false
	    },
	
	    series: [{
	        data: [{
	            id: 'hour',
	            y: options.hours,
	            dial: {
	                radius: '60%',
	                baseWidth: 4,
	                baseLength: '95%',
	                rearLength: 0
	            }
	        }, {
	            id: 'minute',
	            y: options.minutes,
	            dial: {
                    radius: '80%',
	                baseLength: '95%',
	                rearLength: 0
	            }
	        }],
	        animation: false,
	        dataLabels: {
	            enabled: false
	        }
	    }]

	
	})
},


renderCriteriaMatchWaterfallChart: function(options){
	

	var testing = new Highcharts.Chart({
		chart: {
            type: 'waterfall',
            renderTo: options.renderTo
        },

        title: {
            text: 'Contacts Who Match Criteria'
        },

        xAxis: {
            type: 'category',
            title: {
                text: 'Criteria that Match'
            }
        },

        yAxis: {
            title: {
                text: 'Number of Your Contacts'
            }
        },

        legend: {
            enabled: false
        },

        tooltip: {
        	headerFormat: '',
            pointFormat: '<b>${point.y}</b>'
        },

        series: [{

            color: '#228B22',
            data: [{
                name: 'None',
                y: 220
            }, {
                name: '1 Only',
                y: 72
            }, {
                name: '2',
                y: 54
            }, {
                name: '3',
                y: 38
            }, {
                name: '4+',
                y: 16
            }, ],
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return this.y;
                },
                style: {
                    color: 'white',
                    fontWeight: 'bold'
                }
            },
            pointPadding: 0
        }]

       });
},

renderIncompleteRecordsChart: function(options){
	chart = new Highcharts.Chart({
            chart: {
            	renderTo: options.renderTo,
                type: 'bar'
            },
			title: {
                text: "Records that couldn't be enhanceed because they lack..."
            },
            xAxis: {
                categories: ['First Name', 'Last Name', 'Phone', 'Email'],
                title: {
                    text: null
                }
                
            },
            credits : {
			    enabled : false
			},
            yAxis: {
                min: 0,
                max:100,
                title: {
                    text: '% of My Contacts'
                }
                
            },
            tooltip: {
            	headerFormat: '',
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
                shared: true
            },
            plotOptions: {
                
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true
            },
            series: [{
                name: 'No Match',
                color: '#b22222',
                data: [25, 28, 32, 46]
            }]
        });



},

renderEnrichmentResultsChart: function(options){
	chart = new Highcharts.Chart({
            chart: {
            	renderTo: options.renderTo,
                type: 'bar'
            },
			title: {
                text: '% of Records with Values Before and After Enhancement'
            },
            xAxis: {
                categories: ['First Name', 'Last Name', 'Work Phone','Home Phone','Mobile Phone','Work Email','Personal Email','Photograph','Home Street Address','Home City','Home Postal Code','Work Street Address','Work City','Work Postal Code'],
                title: {
                    text: null
                }
                
            },
            credits : {
			    enabled : false
			},
            yAxis: {
                min: 0,
                max:100,
                title: {
                    text: '% of My Contacts'
                }
                
            },
            tooltip: {
            	headerFormat: '',
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>',
                shared: true
            },
            plotOptions: {
                
            },
            legend: {
                backgroundColor: '#FFFFFF',
                reversed: true,
                verticalAlign: 'top',
                align: 'right'
            },
            series: [{
                name: 'After',
                color: '#228B22',
                data: [74, 72, 77, 74, 74,88,71,43,50,52,45,32,34,49]
            },{
                name: 'Before',
                color: '#b22222',
                data: [64, 62, 57, 44, 34,38,41,0,31,5,8,12,14,9]
            }]
        });



},

formatImageLabel:function(val,model){//used for leaderboardChart

    var htmlTemplate = "<div class='chartLabelFrame'><img class='chartLabelImg' src='Zsrc'><div class='chartLabelName'>ZfullName</div></div>"

        var displayName = model[val].displayName;
        var imgUrl = model[val].imgUrl;
    
        var html=htmlTemplate.replace("Zsrc",imgUrl);
        html = html.replace("ZfullName",displayName);
    return html;
    
},

renderLeaderBoardChartGiven: function(options){
	var chartSeries = options.chartSeries;
	var model = options.model;

	chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart1',
                type: 'bar',
                backgroundColor: 'transparent',
            },
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            xAxis: {
                tickLength: 0,
                lineWidth: 0,
                categories: ['AA1','AA2', 'AA3', 'AA4', 'AA5'],
                title: {
                    text: null
                },
                labels: {
//                    enabled: false,
                    color: '#fff',
                    
                    x: 5,
                    useHTML: true,
                    formatter: function () {
                        console.log(this);
                        var thisVal = $.formatImageLabel(this.value,model);
                        
                        return thisVal;
                         //'<img class="" src="http://dummyimage.com/60x60/ff6600/ffffff"/>';
                    }
                    
                }
            },
            yAxis: {
                min: 0,
                gridLineWidth: 0,
                title: {
                    text: null
                },
                labels: {
                    enabled: false,
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true, 
                        color: 'black'
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            
            series: [{
                borderWidth: 0,
                borderRadius: 3,
                pointWidth: 30,
                shadow: false,
                data:chartSeries 
                    
            }]
        })




},



renderReferralProfessionPieChart: function(options){
/*
	var DValues = [
             ['Plumber',45],
             ['Contractor', 35],
             ['Building & Supply', 15],
             ['Landscape Architect', 5]
		]
*/
	
		chart = new Highcharts.Chart({
			chart: {
                renderTo: options.pieDiv,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                marginTop: 0,
                spacingTop: 0
            },
            credits : {
			    enabled : false
			},
            title: null,
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            legend:{
            	itemStyle:options.itemStyle,
            	margin:options.pieLegendMargin
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
/*
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>';
                        }
                    }
*/
                },
	            series: {
	                animation: options.animation
	            }
            },
            series: [{
                type: 'pie',
                name: 'Activity share',
                data: options.DValues,
            }]
        });
		
		
		},	
		

		
		
		
		
		
		
	
renderGaugeChart: function (eltag,val){
		 var testing = new Highcharts.Chart({
		  chart: {
		    renderTo: eltag,
		    type: 'gauge',
		    alignTicks: false,
		    plotBackgroundColor: null,
		    plotBorderWidth: 0,
		    plotShadow: false,
		    plotBackgroundImage: 'images/gaugeChartBackgroundWhite.png',
		    backgroundColor: "Blue",
		    borderWidth: 0,
		    borderRadius: 0,
		    spacingTop: 0,
		    spacingRight: 0,
		    spacingBottom: 0,
		    spacingLeft: 0,
		    style: {
		      textAlign: "center",
		      left: 0,
		      cursor: "pointer"
		    }
		  },
		  exporting: {
		    enabled: false
		  },
		  credits: {
		    enabled: false
		  },
		  title: null,
		  tooltip: {
		    enabled: false
		  },
		  pane: {
		    startAngle: -108,
		    endAngle: 108,
		    background: [{
		      backgroundColor: null,
		      borderWidth: 0
		    }]
		  },
		  // the value axis
		   yAxis: {
		          min: 0,
		          max: 20,
		
		          labels: {
		              step: 2,
		              rotation: 'auto',
		              style: {
		                  color: 'white',
		                  fontSize: '12px'
		                }
		          },
		          title: {
		              text: null
		          },
		       lineWidth:0,  
		
		          minorTickInterval: 'auto',
		          minorTickWidth: 0,
		          minorTickLength: 10,
		          minorTickPosition: 'inside',
		          minorTickColor: '#666',
		       
		  
		          tickPixelInterval: 30,
		          tickWidth: 1,
		          tickPosition: 'inside',
		          tickLength: 10,
		          tickColor: 'white'
		           
		      },
		  series: [{
		    name: '',
		    dataLabels: {
		      borderColor: null,
		      borderWidth: 0,
		      color: 'black',
		      y:12,
		      style: {
		        fontSize: '44px'
		      }
		    },
		    dial: {
		                  backgroundColor: 'red'
		    },
		    data: [ val ],
		    tooltip: {
		      valueSuffix: ''
		    }
		  }]
		})
		}

}

);



