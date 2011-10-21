var addedLines = 0; //Must be global so that it remains constant outside of functions.


// Function that adds a list node.
// containerListID is the ID (as a string) of the container to add nodes to.
// If locationToAdd = "start", link is added to start.  Otherwise, added to end.  "end" for convention.
function addListNode(containerListID,locationToAdd){

	if (!containerListID){containerListID = "linklist"}						//Set default arguments.
	if ((!locationToAdd) || (locationToAdd != "start" && locationToAdd != "end")){locationToAdd = "end"}
	document.write(locationToAdd);						////////////////////// *** DEBUG CODE ***

	var existingListContainer = document.getElementById(containerListID); 	//Get container we are adding nodes to.
	var endingSpacer = document.getElementById('endingSpacer'); 			//Spacer (hackish) remains at end of list to keep open.
	var listEntry = document.createElement('li');							//Create node to add.

	if (locationToAdd == "start"){											//Determine whether we are adding nodes to beginning
		var entryToPrepend = $('li', existingListContainer)[0];				//	or end of list.  Insert node there.
		var newEntry = existingListContainer.insertBefore(listEntry, entryToPrepend);
	} else {
		var newEntry = existingListContainer.insertBefore(listEntry, linkListEndingSpacer);
	}
	
	//
	// Creating content to fill the node.
	//
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
	var inputForMarkAsDone = document.createElement('INPUT');
	/* Insert input boxes, this will eventually be replaced with useful things. */
	spanForLink.appendChild(inputForLink);	
	spanForNextIn.appendChild(inputForNextIn);
	
	
	/* Fill in required attributes for above input boxes */
	inputForLink.setAttribute("Link", "Link"+addedLines);		
	inputForNextIn.setAttribute("NextIn", "NextIn"+addedLines);
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
	// There are no defaults since we are creating unique objects.
	
	this.name = name;				// Make all arguments properties of the object.
	this.number = passedNumber;
	this.duration = duration;
	this.longName = longName;
	this.url = url;
	
	
	/* ------- COOKIE FUNCTIONS ------- */
		this.expiryDate = function(dur){		// Returns an expiry date based on the current time + dur seconds.
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
		this.createCookie = function(expiresIn){
			if (!expiresIn){expiresIn = this.duration;}
			document.cookie = this.name + "=" + this.expiryDate(expiresIn).toUTCString() + "; expires=" + this.expiryDate(expiresIn).toUTCString() + "; path=/";
		}
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
				if (cookies[i].indexOf(cookieName) >= 0){targetCookie = cookies[i]}
			}
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
	new linkObject("mediocrity",1,40*60,"Wheel of Mediocrity", "http://www.neopets.com/prehistoric/mediocrity.phtml"),
	new linkObject("excitement",2,120*60,"Wheel of Excitement", "http://www.neopets.com/faerieland/wheel.phtml")
);

linkList[linkList.length] = new linkObject("treasure",3,60*60*3,"Buried Treasure", "http://www.neopets.com/pirates/buriedtreasure/index.phtml");
linkList[linkList.length] = new linkObject("strength",4,60*60*6,"Test Your Strength", "http://www.neopets.com/halloween/strtest/index.phtml");