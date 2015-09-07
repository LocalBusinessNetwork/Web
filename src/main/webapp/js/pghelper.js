/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var pgReady = $.Deferred();

var phoneapp = {
    // Application Constructor
   client : 'phone',

    initialize: function() {
        console.log('PG initialize');
        this.bindEvents();
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log('PG bindevents');
        document.addEventListener('deviceready', phoneapp.onDeviceReady, false);
        document.addEventListener("pause", phoneapp.onPause, false);
        document.addEventListener("resume", phoneapp.onResume, false);
        document.addEventListener("online", phoneapp.onOnLine, false);
        document.addEventListener("offline", phoneapp.onOffLine, false);
    },
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        pgReady.resolve();

        if (window.device.version == "7.0"){
            console.log("device version " + window.device.version); 
            document.body.style.marginTop = "20px";
            $("body").addClass("margin-top","20px");
        } 
    },
    
    onPause: function() {
    },

    onResume: function() {
    },

    onOnLine: function() {
    },

    onOffLine: function() {
        // alert('You must be connected to the internet to use this App.');
    },
    
    /*
      element.innerHTML = 'Latitude: '          + position.coords.latitude         + '<br />' +
                          'Longitude: '         + position.coords.longitude        + '<br />' +
                          'Altitude: '          + position.coords.altitude         + '<br />' +
                          'Accuracy: '          + position.coords.accuracy         + '<br />' +
                          'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
                          'Heading: '           + position.coords.heading          + '<br />' +
                          'Speed: '             + position.coords.speed            + '<br />' +
                          'Timestamp: '         + position.timestamp               + '<br />';
    */

    GetAccurateGPSLocation : function () {
     
        var promise  = $.Deferred();    
        
        $.mobile.loading( 'show', {
            html: "<div style='margin-top:25%;'><img width='100%' src='/images/gps.gif' alt='Locating GPS'/></div>"
        });

        navigator.geolocation.getCurrentPosition(
          function(position) {
            $.mobile.loading('hide');
            promise.resolve(position);
            console.log("lat: " + position.coords.latitude + " long: " + position.coords.longitude );
          },
          function(error) {
            $.mobile.loading( 'hide');

            if ( error.code == PositionError.PERMISSION_DENIED)
                alert('GPS is not permitted on this device');
            else if ( error.code == PositionError.POSITION_UNAVAILABLE)
                alert('Your location is temporarily unavailable on  this device');
            else if ( error.code == PositionError.TIMEOUT)
                alert('Your location is temporarily unavailable on  this device, request timedout');
            else 
                alert('Your location is temporarily unavailable on  this device : ' + error.message);
            
            console.log("GPSERROR: " + error.code + " : " + error.message);

            promise.reject();
 
          },
          { maximumAge: 120000, timeout: 60000, enableHighAccuracy: true } // need response in 3 seconds
        );

        return promise;
    },

      /*
      var startDate = new Date("January 13, 2014 16:00:00");
      var endDate = new Date("January 13, 2014 17:30:00");
      var title = "My nice event";
      var location = "Home";
      var notes = "Some notes about this event.";
      var success = function(message) { alert("Success: " + JSON.stringify(message)); };
      var error = function(message) { alert("Error: " + message); };
      window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);
      */
    
    addCalenderEvent : function(model) {     
        var promise = $.Deferred();
        window.plugins.calendar.createEvent(model.get('title'),model.get('location'),
            model.get('notes'),model.get('startDate'),model.get('endDate'),
                function(message) { promise.resolve(message);}, function(message) { promise.reject(message);} );
        return promise;
    },

    modifyCalenderEvent : function(modelOld, modelNew) {     
        var promise = $.Deferred();
        window.plugins.calendar.modifyEvent(title,location,notes,startDate,endDate,newTitle,location,notes,startDate,endDate,
            modelOld.get('title'),modelOld.get('location'),
            modelOld.get('notes'),modelOld.get('startDate'),modelOld.get('endDate'),
            modelNew.get('title'),modelNew.get('location'),
            modelNew.get('notes'),modelNew.get('startDate'),modelNew.get('endDate'),
             function(message) { promise.resolve(message);}, function(message) { promise.reject(message);} );
        return promise;
    }

};



