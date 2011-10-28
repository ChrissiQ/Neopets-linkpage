function chrissiUtils(){		//	A set of utilities that I am using, inside an object to limit the scope, just for safety.
	this.addedLines = 0; 		// Used to keep track of how many lines we've added.
	this.neopetsGMTOffset = 7;	// Constant, may change based on Daylight Savings, this is neopets time offset from GMT.
	
	this.formatMS = function(ms){	// Formats a number of milliseconds as hr:mn:sc, for display purposes.
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
	this.isEven = function(x){return(x%2)?false:true;}	// Used to find even rows only, for style purposes.
	
	this.updateAllTimers = function(){						// Function with setInterval to update all timers every 1 sec
		var parent = $('ul#linklist');
		var listItem = $('li', parent);
		var listItemNum
		var itemSpan
		var updateLink
		for (var rewa = 0; rewa < linkObjects.length; rewa++){
			listItemNum = $($(listItem)[rewa]);
			itemSpan = $('span', listItemNum);
			updateLink = $('a', itemSpan);
			$(itemSpan[1]).text(linkObjects[rewa].nextInString());
		}
	
	}
	
	this.addSortCookie = function(tag){		// Tag takes "alpha", or "time" or anything else for time-left order."
		var nextYear = new Date();
		nextYear.setFullYear(nextYear.getFullYear() + 1);
		document.cookie = "sortingmethod=" + tag + "; expires=" + nextYear + "; path=/";
	}
	
	this.getCookie = function(cookieName){
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
	
	this.hasCookie = function(cookieName){ // Sugar.
			if (document.cookie.indexOf(cookieName) >=0){
				return true
			} else {
				return false
			}
		}
	
	this.sortListBy = function(tag){
		var sortedArray = linkObjects.slice(0);
		if (tag === "alpha"){
			sortedArray.sort(function(a,b){
				if (a.longName > b.longName){
					return 1;
				} else {
					return -1;
				}
			})
		} else {
			sortedArray.sort(function(a,b){
				return a.nextIn() - b.nextIn();
			})	
		}
		if (sortedArray == linkObjects){
			linkObjects.reverse();
		} else {
			linkObjects = sortedArray.slice(0);
		}
		this.addSortCookie(tag);
	}
	
	this.updateTimer = function(createOrDelete, aElement, timerElement, liElement, linkList){		
	for (var m = 0; m<linkList.length; m++){
		if ($(liElement).is("#" + linkList[m].name)){
			if (createOrDelete == "create"){
				linkList[m].createCookie();
				aElement.addClass("unavailable");
				timerElement.text(linkObjects[m].nextInString());
			}
			if (createOrDelete === "delete"){
				linkList[m].deleteCookie();
				timerElement.text(linkObjects[m].nextInString());
				aElement.removeClass("unavailable");
			}
	}}}
	
	this.reloadList = function(listElementName, listArray){
		var listElement = $("ul#" + listElementName);
		$(listElement).empty();
		myUtils.addedLines = 0;
		$(listElement).append("<h1><span>Link<a href='#'>▼</a> </span><span>Next in<a href='#'>▼</a> </span><span>Mark Done</span></h1>");
		for (y=0;y<linkObjects.length;y++){
			$(linkObjects[y].container).append($(linkObjects[y].thisNode(y)));
		}
		$(listElement).append("<li id='linkListEndingSpacer'></li>");
	}
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
	this.container = $("ul#" + this.containingElementID);	// The container element in the DOM.
	this.endingLi = $("li#linkListEndingSpacer", this.container);	// The ending spacer in the DOM.
	
	
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
		this.cookieExists = function(cookieName){ // Sugar.
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
		this.deleteCookie = function(){	
			var time = new Date()
			time.setSeconds(time.getSeconds() - 5)
			document.cookie = "neopets" + this.name + "=" + time.toUTCString() + "; expires=" + time.toUTCString() + "; path=/";
		}
		this.expiryCookie = function(cookieName){
			if (!cookieName){cookieName = "neopets" + this.name;}
			return myUtils.getCookie(cookieName);
		}
		
		this.deleteNode = function(numInArray){
			$($("li", this.container)[numInArray]).remove();
		}
	/* ------- END COOKIE FUNCTIONS ------- */

	// Function that adds the object as a node.
	// containerListID is the ID (as a string) of the container to add nodes to.
	// If locationToAdd = "start", link is added to start.  Otherwise, added to end.  "end" for convention.
	
	this.thisNode = function(arrayNum){
		var listEntry = $("<li id='" + this.name + "'></li>");	//Create node to add.
		if (myUtils.isEven(arrayNum)){ 
			$(listEntry).addClass("even"); 
		}
		$(listEntry).append("<span><a href='" + this.url + "'>" + this.longName + "</a></span>");
		if (this.cookieExists()){
			$('a', $('span', listEntry)[0]).addClass("unavailable");
		}
		$(listEntry).append("<span>" + this.nextInString() + "</span>");
		$(listEntry).append("<span><button>Done!</button><button>Oops!</button></span>");
		return $(listEntry);
	}
	
	this.addNode = function(arrayNum, locationToAdd){
		if ((!locationToAdd) || (locationToAdd != "start" && locationToAdd != "end")){locationToAdd = "end"}//Set default arguments.

		if (locationToAdd == "start"){		//Determine whether we are adding nodes to beginning
			$("h1", this.container).after($(this.thisNode(arrayNum)));
		} else {
			$(this.endingLi, this.container).before($(this.thisNode(arrayNum)));
		}

		/* myUtils.addedLines is a variable that keeps track of how many
		user-added lines there are.  We need this in order to give
		each added line a unique name automatically.  Otherwise
		we would need a long list of names in an array and it
		would not be extendable! */
		myUtils.addedLines++;
	}
	
	
	// Public for direct use in page, writes the Next In entry.  Basically just a procedure.
	this.nextIn = function(){	
		var Today = new Date();
		if (this.cookieExists()){
			var ourCookie = this.expiryCookie();
			var ourExpiry = new Date(ourCookie);
			return ourExpiry.getTime() - Today.getTime();			
			
		} else {
			return 0;
		}
	}
		
	this.nextInString = function(){
		return myUtils.formatMS(this.nextIn());
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

// Where the magic happens!
// linkObjects is the array of link objects.  It is pulled
// from "files.json" as an array of objects.  These objects are
// then converted to a linkObject with all methods.
// Then a node is added to the document for each.
// Using jquery makes this simple to understand!
var linkObjects = new Array;
var myJSON = $.getJSON("files.json", function(data){
	$.each(data, function(index, myObject){
		spot = myObject.numID;
		linkObjects[spot] = new linkObjectTakingJSON(myObject);
	})
	
	if (myUtils.hasCookie("sortingmethod")){
	myUtils.sortListBy(myUtils.getCookie("sortingmethod"));
	}
	
	for (x=0;x<linkObjects.length;x++){
		linkObjects[x].addNode(x);
		
	//linkObjects[4].deleteNode(4);
	}
})

$('body').click(function(clickEvent){
	if ($(clickEvent.target).is('a', 'li', 'ul#linklist')){				// onclick 'a' list item....
		var myA = $(clickEvent.target);
		var myASpan = $(myA.parent());
		var myLi = $(myASpan.parent());
		var myTimerSpan = $(myASpan.next());
		myUtils.updateTimer("create",myA,myTimerSpan,myLi,linkObjects);
	}
	if ($(clickEvent.target).is('a', 'h1', 'ul#linklist')){				// onclick sorting symbol...
		var myA = $(clickEvent.target);
		var myASpan = $(myA.parent());
		if ($(myASpan).is($(":first-child"))){
			myUtils.sortListBy("alpha");
		} else {
			myUtils.sortListBy("time");
		}
		myUtils.reloadList("linklist", linkObjects);
	}
	if ($(clickEvent.target).is("button", 'ul#linklist')){ 				// onclick 'button'...
		var myButton = $(clickEvent.target);
		var myButtonSpan = $(myButton.parent());
		var myLi = $(myButtonSpan.parent());
		var myTimerSpan = $(myButtonSpan.prev());
		var myASpan = $(myTimerSpan.prev());
		var myA = $('a', myASpan);
		if ($(clickEvent.target).text() == "Oops!"){
			myUtils.updateTimer("delete",myA,myTimerSpan,myLi,linkObjects);
		} else {
			myUtils.updateTimer("create",myA,myTimerSpan,myLi,linkObjects);
		}
	}
})
	
setInterval( function () {
	myUtils.updateAllTimers();
	}, 1000
);

