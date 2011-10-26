function chrissiUtils(){
	this.addedLines = 0; //Must be global so that it remains constant outside of functions.
	this.neopetsGMTOffset = 7; // Constant, may change based on Daylight Savings, this is the offset of neopets from GMT.
	this.formatMS = function(ms){
		// Formats a number of milliseconds as hr:mn:sc
		var sc = Math.floor(ms / 1000)
		var mn = 0
		var hr = 0
		while (sc > 59){
			sc = sc - 60
			mn = mn + 1
		}
		while (mn > 59){
			mn = mn - 60
			hr = hr + 1
		}
		if (sc < 10){sc = "0" + sc}
		if (mn < 10){mn = "0" + mn}
		if (hr < 10){hr = "0" + hr}
		return hr + ":" + mn + ":" + sc
	}
	this.isEven = function(x){return(x%2)?false:true;}
}
function linkObject(name, passedNumber, duration, longName, url){
	// The main object representing an individual link on the page.
	// There are no defaults since we are creating unique objects.
	
	this.name = name;				// Make all arguments properties of the object.
	this.numID = passedNumber;
	this.duration = duration;
	this.longName = longName;
	this.url = url;
	this.containingElementID = "linklist";	// Sets "linklist" as the default ID of list... can change.
	
	
	/* ------- COOKIE FUNCTIONS ------- */
		this.availableDate = function(dur){		// Returns an expiry date based on the current time + dur seconds.
			if (!dur){dur = this.duration;}		// Or if the duration is not a time but a fixed date,
			expires = new Date();				// Return that fixed date, properly formatted as a date.
			Today = new Date();					// All dates need to be in Neopian time which is PDT!
			
	
	
			if (dur=="daily"){										// Daily case
				expires.setSeconds(0);
				expires.setMinutes(0);
				expires.setUTCHours(myUtils.neopetsGMTOffset);
				if (Today.getUTCHours() >= myUtils.neopetsGMTOffset){ //Midnight neopets time
					expires.setDate(Today.getUTCDate() +1);
				}

				
			} else if (dur == "monthly"){							// Monthly case
				expires.setSeconds(0);
				expires.setMinutes(0);
				expires.setUTCHours(myUtils.neopetsGMTOffset);
				expires.setDate(1);
				if (Today.getUTCHours() >= myUtils.neopetsGMTOffset){ //Midnight neopets time
					expires.setMonth(Today.getUTCMonth()+1);
				}
				
				
			} else if (dur == "snowager"){								// Snowager case
				expires.setSeconds(0);									// Can be REALLY confusing.
				expires.setMinutes(0);									// 6-7am, 2-3pm, and 10-11pm neopian time (PDT)

				
				//Case after 6am and before 2pm.
				if (
					(Today.getUTCHours() >= myUtils.neopetsGMTOffset + 6) && 
					(Today.getUTCHours() < myUtils.neopetsGMTOffset + 14)		// 2pm neopets time is 9pm same day UTC
				){														// Set expiry to 2pm (9pm same day UTC)
					expires.setUTCHours(Today.getUTCHours()+myUtils.neopetsGMTOffset+14);
				} else
				
				
				//Case after 2pm and before 10pm.
				if (
					(Today.getUTCHours() >= myUtils.neopetsGMTOffset + 14) ||	// We use OR because it spans two days.
					(Today.getUTCHours() < myUtils.neopetsGMTOffset -2)			// 2pm neopets time is 9pm same day UTC
				){														//10pm neopets time is 5am next day UTC								
					// Set expiry to 5am UTC tomorrow if it is before midnight UTC
					
					// Set expiry to 5am UTC same day if it is after midnight UTC.
				
				//If it is after 10pm and before 6am.
					//10pm neopets time is 5am 		next day UTC.
					// 6am neopets time is 1pm same day UTC
					// Set expiry to 1pm tomorrow if it is before midnight UTC.
					// Set expiry to 1pm same day if it is after midnight UTC.
				}
			} else if (dur == "decemberdaily"){						// Advent calendar case	
					expires.setSeconds(0);
					expires.setMinutes(0);
					expires.setUTCHours(7);
				if (Today.getUTCMonth() == 11){	
					if (Today.getDate() == 31){
						expires.setFullYear(Today.getFullYear()+1);
					} else {
					expires.setDate(Today.getUTCDate() +1);
					}
				} else {
					expires.setDate(1);
					expires.setMonth(11);
				}
				
				
			} else {												// Duration as # of seconds case.
				expires.setSeconds(Today.getSeconds() + dur);
			}
				return expires;
		}
		this.cookieExists = function(cookieName){
			if (!cookieName){cookieName = "neopets" + this.name;}
			if (document.cookie.indexOf(cookieName) >=0){
				return true
			} else {
				return false
			}
		}
		this.createCookie = function(availableIn){
			if (!availableIn){availableIn = this.duration;}
			document.cookie = "neopets" + this.name + "=" + this.availableDate(availableIn).toUTCString() + "; expires=" + this.availableDate(availableIn).toUTCString() + "; path=/";
		}
		this.deleteCookie = function(myValue){	
			if (!myValue){myValue = this.duration;}
			var time = new Date()
			time.setSeconds(time.getSeconds() - 5)
			document.cookie = "neopets" + this.name + "=" + myValue + "; expires=" + time.toUTCString() + "; path=/";
		}
		this.readCookie = function(cookieName){
			if (!cookieName){cookieName = "neopets" + this.name;}
			var wholeCookie = unescape(document.cookie);
			var cookies = wholeCookie.split(';');
			var cookieContents = "";
			var targetCookie = 0;
			for (i=0;i<cookies.length; i++){
				if (cookies[i].indexOf(cookieName) >= 0){targetCookie = cookies[i]}
			}
			
			for (j=targetCookie.indexOf("=")+1;j<targetCookie.length;j++){
				cookieContents = cookieContents + targetCookie[j];
			}
			return cookieContents;
		}

		this.destroyLink = function(){

		}
	/* ------- END COOKIE FUNCTIONS ------- */

	// Function that adds the object as a node.
	// containerListID is the ID (as a string) of the container to add nodes to.
	// If locationToAdd = "start", link is added to start.  Otherwise, added to end.  "end" for convention.
	this.addNode = function(containerListID, locationToAdd){
		if (!containerListID){containerListID = this.containingElementID}						//Set default arguments.
		if ((!locationToAdd) || (locationToAdd != "start" && locationToAdd != "end")){locationToAdd = "end"}

		var existingListContainer = document.getElementById(containerListID); 	//Get container we are adding nodes to.
		var endingSpacer = document.getElementById('linkListEndingSpacer'); 	//Spacer (hackish) remains at end of list to keep open.
		var listEntry = document.createElement('li');							//Create node to add.
		listEntry.setAttribute('id', this.name);
		if (myUtils.isEven(this.numID)){
			listEntry.setAttribute('class', 'even');
		}

		if (locationToAdd == "start"){											//Determine whether we are adding nodes to beginning
			var entryToPrepend = $('li', existingListContainer)[0];				//	or end of list.  Insert node there.
			var newEntry = existingListContainer.insertBefore(listEntry, entryToPrepend);
		} else {
			var newEntry = existingListContainer.insertBefore(listEntry, endingSpacer);
		}
		
		/* Content! */	
		var spanForLink = document.createElement('span');
		newEntry.appendChild(spanForLink);
			var mainHyperlink = document.createElement('a');
			mainHyperlink.setAttribute('href', this.url);	
			mainHyperlink.setAttribute('onClick', 'linkObjects[' + this.numID + '].createCookie()');
			//$(mainHyperlink).click(this.createCookie());
					if (this.cookieExists()){
			mainHyperlink.setAttribute('class', "unavailable");
		}
			$(mainHyperlink).text(this.longName);
		spanForLink.appendChild(mainHyperlink);	
		
		
		var spanForNextIn = document.createElement('span');
			$(spanForNextIn).text(this.nextInString());
		newEntry.appendChild(spanForNextIn);
			
		
		var spanForMarkAsDone = document.createElement('span');	
		newEntry.appendChild(spanForMarkAsDone);
			var buttonMarkAsDone = document.createElement('button');
				buttonMarkAsDone.setAttribute('onClick', 'linkObjects[' + this.numID + '].createCookie()');
				//$(buttonMarkAsDone).click(this.createCookie());
				$(buttonMarkAsDone).text("Done!");
		spanForMarkAsDone.appendChild(buttonMarkAsDone);
			var buttonOops = document.createElement('button');
				buttonOops.setAttribute('onClick', 'linkObjects[' + this.numID + '].deleteCookie()');
				//$(buttonOops).click(this.deleteCookie());
				$(buttonOops).text("Oops");
		spanForMarkAsDone.appendChild(buttonOops);
		
		
	/* myUtils.addedLines is a variable that keeps track of how many
	user-added lines there are.  We need this in order to give
	each added line a unique name automatically.  Otherwise
	we would need a long list of names in an array and it
	would not be extendable! */
	myUtils.addedLines++;
	}
	
	
	// Public for direct use in page, writes the Next In entry.  Basically just a procedure.
	this.nextInString = function(){	
		var Today = new Date();
		if (this.cookieExists()){
			var ourCookie = this.readCookie();
			var ourExpiry = new Date(ourCookie);
			var formattedIt = myUtils.formatMS(ourExpiry.getTime() - Today.getTime());			
			return formattedIt;
			
		} else {
			return "00:00:00";
		}
	}
}

var myUtils = new chrissiUtils();
// Wrapper for linkObject() which takes a JSON object as its argument,
// and creates a new linkObject() with the JSON object's properties.
linkObjectTakingJSON = function(obj){
    for(var o in obj){
        this[o] = obj[o];
    }
};					
linkObjectTakingJSON.prototype = new linkObject();

var linkObjects = new Array;
var myJSON = $.getJSON("files.json", function(data){
	$.each(data, function(index, myObject){
		linkObjects[index] = new linkObjectTakingJSON(myObject);
		linkObjects[index].addNode();
	})
});