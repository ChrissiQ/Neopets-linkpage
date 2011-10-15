var addedLines = 0;

function addLink(){


	/* ---- Elements pulled from document ------- */
	/* Parent of list entry (ul) */
	var existingListContainer = document.getElementById('linklist');
	/* Spacer which must remain at end of list (we are trying to insert before it when we add an entry). */
	var endingSpacer = document.getElementById('endingSpacer');
	
	
	/* ----- New elements we are creating for this function! ------- */
	/* The li element for our new list entry */
	var listEntry = document.createElement('li');	
	/* The spans inside our new list entry. */
	var spanForLink = document.createElement('span');
	var spanForNextIn = document.createElement('span');
	var spanForDoEvery = document.createElement('span');
	var spanForMarkAsDone = document.createElement('span');	
	/* The input boxes inside the spans of our new list entry */
	var inputForLink = document.createElement('INPUT');
	var inputForNextIn = document.createElement('INPUT');
	var inputForDoEvery = document.createElement('INPUT');
	var inputForMarkAsDone = document.createElement('INPUT');
	/* Fill in required attributes for above input boxes */
	inputForLink.setAttribute("Link", "Link"+addedLines);		
	inputForNextIn.setAttribute("NextIn", "NextIn"+addedLines);
	inputForDoEvery.setAttribute("DoEvery", "DoEvery"+addedLines);
	inputForMarkAsDone.setAttribute("MarkAsDone", "MarkAsDone"+addedLines);
	
	
	/* Insert our new entry before the ending spacer.*/
	var newEntry = existingListContainer.insertBefore(listEntry, linkListEndingSpacer);
	
	/* Insert spans for details to sit in. */
	newEntry.appendChild(spanForLink);
	newEntry.appendChild(spanForNextIn);
	
	/* Insert input boxes, this will eventually be replaced with useful things. */
	spanForLink.appendChild(inputForLink);	
	spanForNextIn.appendChild(inputForNextIn);
	
	
	/* addedLines is a variable that keeps track of how many
	user-added lines there are.  We need this in order to give
	each added line a unique name automatically.  Otherwise
	we would need a long list of names in an array and it
	would not be extendable! */
	addedLines++;
}


linkNames = new Array()
linkNames[0] = "healing"
linkNames[1] = "mediocrity"
linkNames[2] = "excitement"
linkNames[3] = "treasure"
linkNames[4] = "strength"
linkNames[5] = "scratch"
linkNames[6] = "fishing"
linkNames[7] = "coltzan"
linkNames[8] = "snowager"
linkNames[9] = "potato"
linkNames[10] = "meteor"
linkNames[11] = "knowledge"
linkNames[12] = "omelette"
linkNames[13] = "symol"
linkNames[14] = "tombola"
linkNames[15] = "tomb1"
linkNames[16] = "fruit"
linkNames[17] = "jelly"
linkNames[18] = "lab"
linkNames[19] = "bank"
linkNames[20] = "faerie1"
linkNames[21] = "faerie2"
linkNames[22] = "stock"
linkNames[23] = "advent"
linkNames[24] = "coconut"
linkNames[25] = "altador"
linkNames[26] = "slorg"
linkNames[27] = "marrow"
linkNames[28] = "lunar"
linkNames[29] = "faerie3"
linkNames[30] = "freebie"

function dateAddSeconds(n){
	// Returns a Date() object with n seconds added.
	// Used for links that require timing.
	expires = new Date();
	expires.setSeconds(expires.getSeconds() + n);
	return expires;
}

function nstOffset(){
	// We want neopets time!!!
	// Detects daylight savings so we can offset UTC by NST consistently. *** NOT YET, working on it
	return -7;
	
}
function dateNextDay(){
	// Returns Date() object of the beginning of the next neopets day.
	// For daily links. 
	expires = new Date()
	if (expires.getUTCHours() >= nstOffset()){
		expires.setUTCDate(expires.getUTCDate() + 1)
	}
	expires.setUTCHours(8)
	expires.setUTCMinutes(0)
	expires.setUTCSeconds(0)
	return expires
}
function dateNextHour(){
	// Returns Date() of next hour.
	// For snowager, who is gone by the next hour.
	expires = new Date()
	expires.setUTCHours(expires.getUTCHours() + 1)
	expires.setUTCMinutes(0)
	expires.setUTCSeconds(0)
	return expires
}
function dateNextMonth(){
	// Returns Date() of first day of next month.
	// For the monthly freebie.
	expires = new Date()
	expires.setMonth(expires.getMonth() + 1)
	expires.setUTCDate(1)
	expires.setUTCHours(8)
	expires.setUTCMinutes(0)
	expires.setUTCSeconds(0)
	return expires
}
function putCookie(linkName, time){
	// Creates a cookie if one doesn't exist.
	// This is the desired action of the links.
	if (!checkCookies(linkName)){
		document.cookie = linkName +"=" + time + "; expires=" + time.toUTCString() + "; path=/";
	}	
}
function putCookieFromButton(linkName, time){
	// Creates a cookie regardless of whether one exists.
	// This is the desired action of the Done button.
	document.cookie = linkName +"=" + time + "; expires=" + time.toUTCString() + "; path=/";
}
function deleteCookie(linkName){
	// Deletes a cookie if it exists.
	// For the "Oops!" button
	time = new Date()
	time.setUTCSeconds(time.getUTCSeconds() - 5)
	if (checkCookies(linkName)){
		document.cookie = linkName +"=" + time + "; expires=" + time.toUTCString() + "; path=/";
	}	
}
function putCookieSnowagerWrapper(){
	// This is a wrapper for putCookie() in the snowager case. It checks whether we ought to create a snowager cookie.
	if (currentTime.getUTCHours() == 6 || currentTime.getUTCHours() == 14 || currentTime.getUTCHours() == 22){
		return putCookie('snowager', dateNextHour())
	}
}
function checkCookies(cookieName){
	// Checks whether a cookie exists.
	if (document.cookie.indexOf(cookieName) >=0){
		return true
	} else {
		return false
	}
}
function dateFromCookie(cookieName){
	// Gets the expiry date of the cookie (no hax!)
	currentTime = new Date()
	expires = new Date()
	wholeCookie = unescape(document.cookie)
	cookies = wholeCookie.split(";")
	expiryTimeString = ""
	targetCookie = 0
	for (i=0;i<cookies.length; i++){
		if (cookies[i].indexOf(cookieName) >= 0){
			targetCookie = cookies[i]
		}
	}
	for (i=targetCookie.indexOf("=")+1;i<targetCookie.length;i++){
		expiryTimeString = expiryTimeString + targetCookie[i]
	}
	currentTime = new Date(expiryTimeString)
	currentTime2 = new Date()
	//currentTime.setUTCMinutes(currentTime.getUTCMinutes() + currentTime.getTimezoneOffset())
	return currentTime
}

function colourUnavailableLink(byID){
	// Display unavailable links as red.
	element = document.getElementById(byID)
	if (checkCookies(byID)){
		element.addClass("unavailable");
	}
}

function doColourLinks(){
	// Goes through and applies colourUnavailableLink() to unavailable links.
	for (i = 0; i < linkNames.length;i++){
		colourUnavailableLink(linkNames(byID))
	}
}

function lightUpSnowager(byID){
	// Light up snowager during unavailable times.
	element = document.getElementById(byID)
	currentTime = new Date();
	if (!(currentTime.getUTCHours == 6 || currentTime.getUTCHours == 14 || currentTime.getUTCHours == 22) || (document.cookie.indexOf(byID) >=0)){
		element.style.color = "red"
		element.style.fontWeight = "normal"
	}
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