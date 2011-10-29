var chrissiUtils = new function(){		//	A set of utilities that I am using, inside an object to limit the scope, just for safety.
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
	this.sortListBy = function(listArray, tag){
		if (tag === "alpha"){
			listArray.sort(function(a,b){
				if (a.longName > b.longName){
					return 1;
				} else {
					return -1;
				}
			})
		} else {
			listArray.sort(function(a,b){
				return a.nextIn() - b.nextIn();
			})	
		}
		
		cookieUtils.addSortCookie(tag);
	}
	
	// Refresh the list's DOM elements.  Useful to display a new sorted list.
	
	// Clear out a list of all items.
	this.clearList = function (listID){
		var list = $("ul#" + listID);
		$(list).find('li').not('.permanent').remove();
	}
	
	this.createNewEmptyList = function(listID, listName){
		$('#infoColumn').before($(
			"<div class='column'>" +
			"<span>" + listName + "</span>" +
			"<ul class='linklist' id='" + listID + "'></ul></div>"
		));
		$('#' + listID).append($(
		"<h1 class='permanent'>" + 
			"<span><a href='#' class='remove'>-</a></span>" +
			"<span class='link'>Name<a href='#'>▼</a></span>" +
			"<span>Next in<a href='#'>▼</a></span>" +
			"<span>Mark Done</span>" +
		"</h1>"
		));
		$('#' + listID).append($(
		"<li class='addnew permanent'><span><a href='#' class='add'>+</a></span></li>"+
		"<li class='endingSpacer permanent'></li>"	
		));
		
	}
		
	
	// Load list items from listArray, into listID list.
	this.loadList = function (listID, listArray){
		var list = $("body").find($("ul#" + listID));
		for (y=0;y<listArray.length;y++){
			listArray[y].addNode(y);
		}
	$($('li:odd').addClass("odd"));
	}
	
	// Clear a list, then reload it with new information.
	this.reloadList = function(listID, listArray){
		this.clearList(listID);
		this.loadList(listID, listArray);
	}
	
	// Update a timer when information changes.
	this.updateTimer = function(createOrDelete, aElement, timerElement, liElement, linkList){		
	for (var m = 0; m<linkList.length; m++){
		if ($(liElement).is("#neopets" + linkList[m].name)){
			if (createOrDelete === "delete"){
				linkList[m].deleteCookie();
				aElement.removeClass("unavailable");
			}else{
				linkList[m].addCookie();
				aElement.addClass("unavailable");
			}
			timerElement.text(linkObjects[m].nextInString());
	}}}
	
	// Get the current status of all timers.
	this.updateAllTimers = function(){
		var parent = $('ul.linklist');
		var listItem = $('li', parent);
		var listItemNum
		var itemSpan
		var updateLink
		for (var rewa = 0; rewa < linkObjects.length; rewa++){
			listItemNum = $($(listItem)[rewa]);
			itemSpan = $('span', listItemNum);
			updateLink = $('a', itemSpan);
			$(itemSpan[2]).text(linkObjects[rewa].nextInString());
		}
	
	}
}

var cookieUtils = new function(){

	this.exists = function(cookieName){ // Sugar.
		if (document.cookie.indexOf(cookieName) >=0){
			return true
		} else {
			return false
		}
	}		
	this.cookieString = function(cookieName,cookieValue,expiryDate){
		return cookieName + "=" + cookieValue + "; expires=" + expiryDate + "; path=/";
	}
	this.add = function(cookieName,cookieValue,expiryDate){		// Tag takes "alpha", or "time" or anything else for time-left order."
		document.cookie = this.cookieString(cookieName,cookieValue,expiryDate);
	}
	this.del = function(cookieName){	
		var time = new Date()
		time.setSeconds(time.getSeconds() - 5)
		document.cookie = this.cookieString(cookieName,time.toUTCString(),time.toUTCString());
	}
	
	this.addSortCookie = function(sortType){
		var nextYear = new Date();
		nextYear.setFullYear(nextYear.getFullYear() + 1);
		this.add("sortingmethod",sortType,nextYear);
	}
	
	this.getValue = function(cookieName){
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
}

function linkObject(name, passedNumber, duration, longName, url){
	// The main object representing an individual link on the page.
	// There are no defaults since we are creating unique objects.
	
	this.name = name;				// Make all arguments properties of the object.
	this.numID = passedNumber;
	this.duration = duration;
	this.longName = longName;
	this.url = url;
	this.containingElementID = "defaultList";	// Sets "linklist" as the default ID of list... can change.
	this.container = $("ul#" + this.containingElementID);	// The container element in the DOM.
	this.endingLi = $("li.addnew", this.container);	// The ending spacer in the DOM.
	
	// Returns an expiry date based on the current time + dur seconds.
	this.availableDate = function(dur){		
		if (!dur){dur = this.duration;}		// Or if the duration is not a time but a fixed date,
		expires = new Date();				// Return that fixed date, properly formatted as a date.
		Today = new Date();					// All dates need to be in Neopian time which is PDT!
		


		if (dur=="daily"){										// Daily case
			expires.setSeconds(0);
			expires.setMinutes(0);
			expires.setUTCHours(chrissiUtils.neopetsGMTOffset);
			if (Today.getUTCHours() >= chrissiUtils.neopetsGMTOffset){ //Midnight neopets time
				expires.setDate(Today.getUTCDate() +1);
			}

			
		} else if (dur == "monthly"){							// Monthly case
			expires.setSeconds(0);
			expires.setMinutes(0);
			expires.setUTCHours(chrissiUtils.neopetsGMTOffset);
			expires.setDate(1);
			if (Today.getUTCHours() >= chrissiUtils.neopetsGMTOffset){ //Midnight neopets time
				expires.setMonth(Today.getUTCMonth()+1);
			}
			
			
		} else if (dur == "snowager"){								// Snowager case
			expires.setSeconds(0);									// Can be REALLY confusing.
			expires.setMinutes(0);									// 6-7am, 2-3pm, and 10-11pm neopian time (PDT)

			
			//Case after 6am and before 2pm.
			if (
				(Today.getUTCHours() >= chrissiUtils.neopetsGMTOffset + 6) && 
				(Today.getUTCHours() < chrissiUtils.neopetsGMTOffset + 14)		// 2pm neopets time is 9pm same day UTC
			){														// Set expiry to 2pm (9pm same day UTC)
				expires.setUTCHours(Today.getUTCHours()+chrissiUtils.neopetsGMTOffset+14);
			} else
			
			
			//Case after 2pm and before 10pm.
			if (
				(Today.getUTCHours() >= chrissiUtils.neopetsGMTOffset + 14) ||	// We use OR because it spans two days.
				(Today.getUTCHours() < chrissiUtils.neopetsGMTOffset -2)			// 2pm neopets time is 9pm same day UTC
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

	// Adds cookie with appropriate expiry date.
	this.addCookie = function(availableIn){
		if (!availableIn){availableIn = this.duration;}
		cookieUtils.add(
			"neopets" + this.name,
			this.availableDate(availableIn).toUTCString(),
			this.availableDate(availableIn).toUTCString()
		);
	}
	// Deletes cookie specific to this element.
	this.deleteCookie = function(){	
		cookieUtils.del("neopets" + this.name);
	}
	// Get the expiry date from the cookie.
	this.available = function(){
		return cookieUtils.getValue("neopets" + this.name);
	}
	// Not being used yet... not sure if functional.  Deletes the node off the DOM tree.
	this.deleteNode = function(numInArray){
		$($("li", this.container)[numInArray]).remove();
	}
	
	// Generate and return the structure of the list element.  Does not add to DOM, just generates and returns.
	this.elementHTML = function(arrayNum){			
		var listEntry = $("<li id='neopets" + this.name + "'></li>");
		$(listEntry).append("<span><a href='#' class='remove'>-</a></span>");
		$(listEntry).append("<span class='link'><a href='" + this.url + "'>" + this.longName + "</a></span>");
		if (cookieUtils.exists("neopets" + this.name)){
			$('a', $('span', listEntry)[1]).addClass("unavailable");
		}
		$(listEntry).append("<span>" + this.nextInString() + "</span>");
		$(listEntry).append("<span><button>Done!</button><button>Oops!</button></span>");
		return $(listEntry);
	}
	
	//Add this.elementHTML (list element structure) to the actual DOM of the page.
	this.addNode = function(arrayNum, locationToAdd){
		if ((!locationToAdd) || (locationToAdd != "start" && locationToAdd != "end")){locationToAdd = "end"}//Set default arguments.

		if (locationToAdd == "start"){		//Determine whether we are adding nodes to beginning
			$('#' + this.containingElementID + ' h1').after(this.elementHTML(arrayNum));
		} else {
			$('#' + this.containingElementID + ' li.addnew').before(this.elementHTML(arrayNum));
		}
	}
	
	
	// Returns the # of milliseconds from now that the link is available again.
	this.nextIn = function(){	
		var Today = new Date();
		if (cookieUtils.exists("neopets" + this.name)){
			var ourCookie = this.available();
			var ourExpiry = new Date(ourCookie);
			return ourExpiry.getTime() - Today.getTime();			
			
		} else {
			return 0;
		}
	}
		
	// Returns the string to display in the page, for when the link is available again.
	this.nextInString = function(){
		return chrissiUtils.formatMS(this.nextIn());
	}
}

// Wrapper for linkObject() which makes a new linkObject with JSON's properties.
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
	
chrissiUtils.createNewEmptyList("defaultList", "Default List");

var myJSON = $.getJSON("files.json", function(data){

	$.each(data, function(index, myObject){
		spot = myObject.numID;
		linkObjects[spot] = new linkObjectTakingJSON(myObject);
	})
	
	if (cookieUtils.exists("sortingmethod")){
	chrissiUtils.sortListBy(linkObjects, cookieUtils.getValue("sortingmethod"));
	}
	chrissiUtils.loadList("defaultList", linkObjects);
})


chrissiUtils.createNewEmptyList("newList", "My New List");

// More magic!  One click handler, many detection methods!
$('body').click(function(clickEvent){
	if ($(clickEvent.target).is($('ul.linklist li a'))){				// onclick 'a' list item....
		var myA = $(clickEvent.target);
		var myASpan = $(myA.parent());
		var myLi = $(myASpan.parent());
		var myTimerSpan = $(myASpan.next());
		//if (cookieUtils.exists(linkObjects[x])){}
		chrissiUtils.updateTimer("create",myA,myTimerSpan,myLi,linkObjects);
	}
	if ($(clickEvent.target).is($('ul.linklist h1 a'))){				// onclick sorting symbol...
		var myA = $(clickEvent.target);
		var myASpan = $(myA.parent());
		if ($(myASpan).text() == "Name▼"){
			chrissiUtils.sortListBy(linkObjects,"alpha");
		} else {
			chrissiUtils.sortListBy(linkObjects,"time");
		}
		chrissiUtils.reloadList("defaultList", linkObjects);
	}
	if ($(clickEvent.target).is("button", 'ul.linklist')){ 				// onclick 'button'...
		var myButton = $(clickEvent.target);
		var myButtonSpan = $(myButton.parent());
		var myLi = $(myButtonSpan.parent());
		var myTimerSpan = $(myButtonSpan.prev());
		var myASpan = $(myTimerSpan.prev());
		var myA = $('a', myASpan);
		if ($(clickEvent.target).text() == "Oops!"){
			chrissiUtils.updateTimer("delete",myA,myTimerSpan,myLi,linkObjects);
		} else {
			chrissiUtils.updateTimer("create",myA,myTimerSpan,myLi,linkObjects);
		}
	}
})

// Updates timers every second.
setInterval( function () {
	chrissiUtils.updateAllTimers();
	}, 1000
);