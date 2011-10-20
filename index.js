var addedLines = 0;
// Function that adds a link list element.
// containerListName is a string, the -ID- of the list we are adding elements to.  NOT the element itself.
// If locationToAdd = "start", link is added to start.  Otherwise, added to end.  "end" for convention.

function addLink(containerListName,locationToAdd){
	if (!containerListName){containerListName = "linklist"}	
	// If locationToAdd isn't specified, or if it's not one of "start" or "end", make it "end" by default.
	if ((!locationToAdd) || (locationToAdd != "start" && locationToAdd != "end")){locationToAdd = "end"}
	document.write(locationToAdd);

	/* ---- Elements pulled from document ------- */
	/* Parent of list entry (ul) */
	var existingListContainer = document.getElementById(containerListName);
	/* Spacer which must remain at end of list (we are trying to insert before it when we add an entry). */
	var endingSpacer = document.getElementById('endingSpacer');
	
	
	/* ----- New elements we are creating for this function! ------- */
	

	/* The li element for our new list entry */
	var listEntry = document.createElement('li');		
	/* Insert our new entry before the ending spacer.*/
	if (locationToAdd == "start"){
		var entryToPrepend = $('li', existingListContainer)[0];
		var newEntry = existingListContainer.insertBefore(listEntry, entryToPrepend);
	} else {
		var newEntry = existingListContainer.insertBefore(listEntry, linkListEndingSpacer);
	}
	
	
	
	/* The spans inside our new list entry. */
	var spanForLink = document.createElement('span');
	var spanForNextIn = document.createElement('span');
	var spanForMarkAsDone = document.createElement('span');	
	/* Insert spans for details to sit in. */
	newEntry.appendChild(spanForLink);
	newEntry.appendChild(spanForNextIn);
	newEntry.appendChild(spanForMarkAsDone);
	
	
	
	/* The input boxes inside the spans of our new list entry */
	var inputForLink = document.createElement('INPUT');
	var inputForNextIn = document.createElement('INPUT');
	var inputForDoEvery = document.createElement('INPUT');
	var inputForMarkAsDone = document.createElement('INPUT');
	/* Insert input boxes, this will eventually be replaced with useful things. */
	spanForLink.appendChild(inputForLink);	
	spanForNextIn.appendChild(inputForNextIn);
	
	
	/* Fill in required attributes for above input boxes */
	inputForLink.setAttribute("Link", "Link"+addedLines);		
	inputForNextIn.setAttribute("NextIn", "NextIn"+addedLines);
	inputForDoEvery.setAttribute("DoEvery", "DoEvery"+addedLines);
	inputForMarkAsDone.setAttribute("MarkAsDone", "MarkAsDone"+addedLines);
	
	
	/* addedLines is a variable that keeps track of how many
	user-added lines there are.  We need this in order to give
	each added line a unique name automatically.  Otherwise
	we would need a long list of names in an array and it
	would not be extendable! */
	addedLines++;
}

function formatMS(ms){
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

function addIDs(){
	for (i=0; i<linkList.length(); i++){
	}
}



function linkObject(name, passedNumber, duration, longName, url){
	// The main object representing an individual link on the page.

	
	this.name = name;
	this.number = passedNumber;
	this.duration = duration;
	this.longName = longName;
	this.url = url;
	
		
	// Turns the duration passed in, into an expiry date (now + dur seconds)
	this.expiryDate = function(dur){
		if (!dur){dur = this.duration;}
		expires = new Date();
		Today = new Date();
		expires.setSeconds(Today.getSeconds() + dur);
		return expires;
	}
	
	this.cookieExists = function(cookieName){
		if (!cookieName){cookieName = this.name;}
		if (document.cookie.indexOf(cookieName) >=0){
			return true
		} else {
			return false
		}
	}
	
	// Cookie creation, myValue is usually the duration.  Overwrites existing cookie, use in conjunction with cookieExists() to avoid overwriting.
	this.createCookie = function(expiresIn){
		if (!expiresIn){expiresIn = this.duration;}
		document.cookie = this.name + "=" + this.expiryDate(expiresIn).toUTCString() + "; expires=" + this.expiryDate(expiresIn).toUTCString() + "; path=/";
	}

	// Delete cookie.  Should check first if cookie exists...
	this.deleteCookie = function(myValue){	
		if (!myValue){myValue = this.duration;}
		var time = new Date()
		time.setSeconds(time.getSeconds() - 5)
		document.cookie = this.name + "=" + myValue + "; expires=" + time.toUTCString() + "; path=/";
	}

	this.readCookie = function(cookieName){
		if (!cookieName){cookieName = this.name;}
		var wholeCookie = unescape(document.cookie)
		var cookies = wholeCookie.split(";")
		var cookieContents = ""
		var targetCookie = 0
		for (i=0;i<cookies.length; i++){
			if (cookies[i].indexOf(cookieName) >= 0){
				targetCookie = cookies[i]
			}}
		for (i=targetCookie.indexOf("=")+1;i<targetCookie.length;i++){
			cookieContents = cookieContents + targetCookie[i]
		}
		return cookieContents;
	}

	this.destroyLink = function(){

	}
	
	
	// Public for direct use in page, writes the Next In entry.  Basically just a procedure.
	this.nextInString = function(){	
		var Today = new Date();
		if (this.cookieExists()){
			var ourCookie = this.readCookie();
			var ourExpiry = new Date(ourCookie);
			var formatted = formatMS(ourExpiry.getTime() - Today.getTime());			
			return formatted;
		} else {
			return "00:00:00";
		}
	}
}


var linkList = new Array(
	new linkObject("healing",0,30*60,"The Healing Springs", "http://www.neopets.com/faerieland/springs.phtml"),
	new linkObject("mediocrity",1,120,"Wheel of Mediocrity", "http://www.neopets.com/prehistoric/mediocrity.phtml"),
	new linkObject("excitement",2,240,"Wheel of Excitement")
);

for (i in linkList){
}
