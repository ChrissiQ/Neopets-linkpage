<<<<<<< HEAD
﻿function chrissiUtils(){		//	A set of utilities that I am using, inside an object to limit the scope, just for safety.
	this.addedLines = 0; 		// Used to keep track of how many lines we've added.
	this.neopetsGMTOffset = 8;	// Constant, may change based on Daylight Savings, this is neopets time offset from GMT.
	
	this.formatMS = function(ms){	// Formats a number of milliseconds as hr:mn:sc, for display purposes.
		var sc = Math.floor(ms / 1000)
=======
﻿var chrissiUtils = new function(){	//	Scoped utilities.
	this.neopetsGMTOffset = 8;      // Constant, may change based on Daylight Savings, this is neopets time offset from GMT.	
	this.Today = function(){
		return new Date();
	}
	this.nextYear = function(){
		var nextY = new Date();
		nextY.setFullYear(this.Today().getFullYear()+1);
		return nextY;
	}
	
	this.webStorageSupported = ('localStorage' in window) && window['localStorage'] !== null;
    
    this.secondsToNextYear = function(){
        return Math.floor((this.nextYear().getTime() - this.Today().getTime())/1000);
    }
	this.formatMS = function(sc){	// Formats a number of seconds as hr:mn:sc, for display purposes.
>>>>>>> master
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
<<<<<<< HEAD
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
=======
    this.updateAllTimers = function(){
		var listsLength = lists.length;
        for (i=0;i<listsLength;i++){
			var linksLength = lists[i].links.length;
            for (j=0;j<linksLength;j++){             
                lists[i].links[j].updateTimer();
				
				// If the timer reaches zero, make the link available again.
				if (lists[i].links[j].nextIn() <= 0)
					lists[i].links[j].makeAvailable();
            }
        }
    }
	
	this.findElementInArray = function(num,array){
		for (i=0;i<array.length-1;i++){
			
		}
	}
	
	this.parseClick = function(Target){
		
		// Only respond to clicks inside of lists.
		if ($(Target).parents('ul.linklist').length){
			
			// Get listID from end of ID attribute on ul element.
			var listID = parseInt(
				$(Target).parents('ul.linklist').attr('id').slice(4)
			);
			
			// Get element in lists array, by checking the ID against each.
			var listElementInArray;
			var listsLength = lists.length;
			for (q=0;q<listsLength;q++){
				if (lists[q].ID == listID) listElementInArray = q;
			}
			var list = lists[listElementInArray];
			
			console.log("List element in array:", listElementInArray);

				
			// LIST TITLE
			if ($(Target).is('ul.linklist span.listtitle')){
				
				// Convert the title into a textbox which can be modified.
				$(Target).empty();
				input = $("<input type='text'></input>");
				$($(input)[0]).val(lists[listID].name);
				$(Target).append(input);
			}

			// SORT
			if ($(Target).is('ul.linklist .list_label .sort')){
				
				if ($(Target).is('.sort_name')){
					list.sortBy("alpha");
				} else if ($(Target).is('.sort_next_in')){
					list.sortBy("time");
				}
				list.reloadDOM();
			}
			
			// OPEN ADD LINK FORM
			if (Target.is('ul.linklist li.addnew .add button')){
				list.loadNewLinkForm();
			}
			
			// SUBMIT TO ADD NEW LINK
			if ($(Target).is('ul.linklist div.form button')){
				list.submitAddNewLink(
					$('ul.linklist li.addnew div.form')
				);			
			}

			// CLOSE LIST FORM by removing elements from DOM
			if ($(Target).is('ul.linklist li.addnew .close button')){
				$($(liElement).children())
					.not('span.add')
					.remove();
			}	
			
			
			// If we are clicking within a link element.
			if ($(Target).parents('li').not('.permanent').length){
				
				var links = list.links;
				
				
				
				// Get linkID from end of ID attribute on li element.
				var fullID = $(Target).parents('li').attr('id');
				var linkID = parseInt(
								fullID.slice(	fullID.indexOf("_link") + 5	)
				);
				// Get element in links array, by checking the ID against each.
				var linkElementInArray;
				var linksLength = links.length;
				for (j=0;j<linksLength;j++){
					if (links[j].ID == linkID){
						linkElementInArray = j;
					}
				}
				console.log("Link element in array:",linkElementInArray);
				
				var link = links[linkElementInArray];
				
				
				// CLICK A LINK
				if (Target.is($('ul.linklist span.link a'))){
					link.buttonAction("create");
				}
				
				// CLICK A BUTTON
				if (Target.is($('ul.linklist li button'))){
					if (Target.text() == "Oops!"){		
						link.buttonAction("delete");
					} else if (Target.text() == "Done!") {					
						link.buttonAction("create");
					}
				}
				// REMOVE A LINK
				if (Target.is('ul.linklist li .remove button')){
					var yes=confirm(
						"Are you sure you want to remove the link" +
						link.name + "?  This action is permanent!"
					);
					if (yes==true){
						links = links.splice(linkElementInArray,1);
						console.log(lists[listElementInArray]);
						chrissiUtils.storage("list" + listID.toString(), JSON.stringify(lists[listID]))
						list.reloadDOM();
					}
				}
			}
            
		}
	} //parseClick
    
    
    this.parseFcsOut = function(focusTarget){
        var parentList = $(focusTarget).parents('ul.linklist');
        var parentListID = $(parentList).attr('id');
        var focusTitle = $(focusTarget).parent();
        if ($(focusTarget).parent().is('span.listtitle')){
            var listID = $('ul.linklist').index(parentList);
            lists[listID].name = $(focusTarget).val();
            $(focusTitle).empty();
            $(focusTitle).append(lists[listID].name);
            
			// Save cookie with the new title.
			chrissiUtils.storage(
				'list' + listID,
				JSON.stringify(lists[listID]),
				{expires: chrissiUtils.secondsToNextYear()}
			);
			chrissiUtils.storage(
				'list' + listID + 'title',
				lists[listID].name,
				{expires: chrissiUtils.secondsToNextYear()}
			);
			//alert("list" + listID);
			//alert(encodeURIComponent(JSON.stringify(lists[listID])));
            
        }
   }
   
    this.pushLists = function(){
		
	// Create and load default list.
		
		var m;
		if (chrissiUtils.storage("list0")){
			m = 0;
		} else {
			lists[0] = new listObject(
				0,
				"My Default List",
				[]
			);
			m=1;
			lists[0].initialize();
			$.getJSON("files.json", function(data){
				lists[0].load(data.links);
			});

		}
		
		// Create and load first saved list, if exists.

        while (chrissiUtils.storage("list" + m)){
            var listFromCookie = JSON.parse(chrissiUtils.storage("list" + m));
            lists[m] = new listObject(
				listFromCookie.ID,
                listFromCookie.name,
                []
            );
            lists[m].initialize();
            lists[m].load(listFromCookie.links);
            
            m++;
        }
		
		// Create and initialize one blank list at the end.
        lists[m] = new listObject(
            m,
            "New list",
            []
        );
        lists[m].initialize();
	}
	this.storage = function(ID, storeData, expires){
		// If we are defining something to store, store it.
		if (storeData !== undefined){
			
			// If we have html5 storage in the browser, use it!
			if (chrissiUtils.webStorageSupported){
				localStorage.setItem(ID, storeData);
			}
			else {
				// Otherwise, use inferior cookie storage.
				if (expires.length){
					$.cookie(name, storeData, {expires: expires})
				} else {
					$.cookie(name, storedata,
							{ expires: chrissiUtils.secondsToNextYear() }
					)// End cookieset function
				}
			}// End Cookie Case
		
		} // End post
		
		// If we are not defining something to store, get what is stored.
		else if (ID.length){
			if (chrissiUtils.webStorageSupported){
				return localStorage[ID];
			} else {
				return $.cookie(ID);
			}
		} // End get
		
	
	return 0;	
	} // End Storage function
		
// End chrissiUtils		
}

function listObject(ID, name, links){

	this.ID = ID;
	this.name = name;
	this.links = links;
	
	this.toJSON = function(){
		return {
			ID: this.ID,
			name: this.name,
			links: this.links
		}
	}
	this.sorted = function(){
		var sortingMethod = chrissiUtils.storage("list" + this.ID.toString() + "sortingmethod");
		return (sortingMethod !== null)
			? true
			: false;
	}
	this.sortBy = function(sortingMethod){
		var changed = false;
		if (sortingMethod === "alpha"){
			this.links.sort(function(a,b){
				if (a.name > b.name){
					changed = true; return 1;
>>>>>>> master
				} else {
					return -1;
				}
			})
		} else {
<<<<<<< HEAD
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
			
=======
			this.links.sort(function(a,b){
				var value = a.nextIn() - b.nextIn();
				if (value > 0) changed = true;
				return value;
			})
		}
		if (!changed) this.links.reverse();

		chrissiUtils.storage(
			"list" + this.ID.toString() + "sortingmethod",
			sortingMethod);
	}
	// Clear out a list of all items.
	this.clearDOM = function (){
		var list = $("ul#list" + this.ID);
		$(list).find('li').not('.permanent').remove();
	}
	
	this.blankList = function(){	
		return $(
		"<div class='column'>" +
			"<ul class='linklist' id='list" + this.ID.toString() + "'>" +
			"<span class='listtitle'>" + this.name + "</span>" +
				"<h1 class='list_label permanent'>" + 
					"<span class='remove'><button>-</button></span>" +
					"<span class='link'>Name<button class='sort sort_name'>▼</button></span>" +
					"<span>Next in<button class='sort sort_next_in'>▼</button></span>" +
					"<span>Mark Done</span>" +
				"</h1>" +
				"<li class='addnew permanent'>" +
                    "<span class='add'><button>+</button></span>" +
                "</li>"+
				"<li class='endingSpacer permanent'></li>" +
			"</ul>" +
		"</div>");
	}
	// Initializes a new blank list in the DOM.
	this.initialize = function(){
        this.ID = $.inArray(this, lists);
		$('#infoColumn').before(this.blankList());			
		this.endingLi = $("li.addnew", "#" + this.name);	
		this.listElement = $("ul#" + this.name);
	}
  
    // Populates the list with information from a JSON file or cookie (newLinks).
    // List should already be initialized with this.initialize() before using.
    this.load = function(newLinks){
		
		// Push links from newLinks into the links array storage.
        for ( j=0 ; j<newLinks.length ; j++ ){
			console.log(newLinks[j]);
            this.links.push(new linkObject(
                newLinks[j].ID,
                newLinks[j].name,
                newLinks[j].url,
                newLinks[j].duration,
                newLinks[j].listID
            ));
        }
		
		var sortingMethod = chrissiUtils.storage("list" + this.ID.toString() + "sortingmethod");
        if (sortingMethod){
			this.sortBy(sortingMethod);
		}
        this.loadDOM();
    } 
	
	//Add this.elementHTML (list element structure) to the actual DOM of the page.
	this.addNode = function(locationToAdd, nodeHTML){
        var Target;
		if (locationToAdd == "start"){	//Determine whether we are adding nodes to beginning
			Target = $('ul#list' + this.ID.toString() + ' h1');
            Target.after(nodeHTML);
		} else if (locationToAdd == "end"){
			Target = $('ul#list' + this.ID.toString() + ' li.addnew');
            Target.before(nodeHTML);
		} else if ($('ul.linklist').children(locationToAdd).length) {
            Target = locationToAdd;
            Target.append(nodeHTML);
        }
	}
    
	// Load list items from the array into the DOM.
	this.loadDOM = function (){
		for ( y=0 ; y<this.links.length ; y++ ){
			this.addNode( "end" , this.links[y].elementHTML() );
			
			// These might not belong here.  Find a better place for them later.
            this.links[y].listItem = $(
				'li#list' + this.ID.toString() +
				"_link" + this.links[y].ID.toString());
            this.links[y].linkItem = $(this.links[y].listItem).find('a');
            this.links[y].timerElement = $(this.links[y].listItem).find('span')[2];
            this.links[y].buttons = $(this.links[y].listItem).find('button');
			
		}
		$($("ul.linklist")[this.ID]).find("li:odd").addClass("odd");
	}
	
	// Clear DOM list, then reload it with new information.
	this.reloadDOM = function(){
		this.clearDOM();
		this.loadDOM();
	}
	
	this.loadNewLinkForm = function(){
        var thisFunc = this;
        $.get('form.html', function(data){
            thisFunc.addNode($($('ul.linklist')[thisFunc.ID]).find('li.addnew'),data);
        }, 'html');	
	}
    this.submitAddNewLink = function(linkForm){
		
		var inputs = $(linkForm).find('input');
		var textboxes = $(linkForm).find('input:text');
		var radioboxes = $(linkForm).find('input:radio');
		
		// Find the duration from these inputs.
		var duration;
		
		// MINUTES
		if ($(radioboxes[0]).is(':checked')){
			var minutes_duration;
			var hours_duration;
			// If minutes are entered, use them.
			minutes_duration = 	($(textboxes[2]).val() > 0) ?
								parseInt($(textboxes[2]).val())*60 : 0;
			// If hours are entered, use them.
			hours_duration = 	($(textboxes[3]).val() > 0) ?
								parseInt($(textboxes[3]).val())*60*60 : 0;
			// Then add up the minutes and hours (we measure in seconds).
			duration = minutes_duration + hours_duration;
		
		// DAILY	
		} else if ($(radioboxes[1]).is(':checked')){
			duration = "daily";
		
		// WEEKLY	
		} else if ($(radioboxes[2]).is(':checked')){
			duration = "weekly";
			
		// MONTHLY
		} else if ($(radioboxes[3]).is(':checked')){
			duration = "monthly";
		
		// NONE
		} else {
			duration = 0;
		}
		
		// Push new link to the list in local array.  Later push from array
		// to storage.
		var newID = links.length;
		this.links.push(new linkObject(
			newID,
			$(textboxes[0]).val(),
			$(textboxes[1]).val(),
			duration,
			this.ID
			)
		);
		
		// Push from array to storage.
		chrissiUtils.storage("list" + this.ID.toString(), JSON.stringify(this));
		
		// Refresh the list view to display the newly added link.
		this.reloadDOM();
		// Remove the form.		
		$("#list" + this.ID.toString() + " .addnew").children()
			.not('span.add')
			.remove();
    }
};
function linkObject(ID, name, url, duration, listID){
	// The main object representing an individual link on the page.
	// There are no defaults since we are creating unique objects.

	this.ID = ID;
	this.name = name;
	this.url = url;
	this.duration = duration;
	this.listID = listID;
	this.container = $("ul#list" + this.listID.toString());	// The container element in the DOM.	
	this.toJSON = function(){
		return {
			ID: this.ID,
			name: this.name,
			url: this.url,
			duration: this.duration,
			listID: this.listID
		}
	}
	// Returns an expiry date based on the current time + duration seconds.
	// Used for creating a cookie when the user has clicked the link recently.
	// Not used for not-clicked links.
	this.availableDate = function(){		
		var expires = new Date();				// Return that fixed date, properly formatted as a date.
		var Today = new Date();					// All dates need to be in Neopian time which is PDT!
		


		if (this.duration=="daily"){										// Daily case
			expires.setSeconds(0);
			expires.setMinutes(0);
			expires.setUTCHours(chrissiUtils.neopetsGMTOffset);
			if (Today.getUTCHours() >= chrissiUtils.neopetsGMTOffset){ //Midnight neopets time
				expires.setDate(Today.getUTCDate() +1);
			}

			
		} else if (this.duration == "monthly"){							// Monthly case
			expires.setSeconds(0);
			expires.setMinutes(0);
			expires.setUTCHours(chrissiUtils.neopetsGMTOffset);
			expires.setDate(1);
			if (Today.getUTCHours() >= chrissiUtils.neopetsGMTOffset){ //Midnight neopets time
				expires.setMonth(Today.getUTCMonth()+1);
			}
			
			
		// SNOWAGER IS COMPLETELY BROKEN
		} else if (this.duration == "snowager"){								// Snowager case
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
		} else if (this.duration == "decemberdaily"){						// Advent calendar case	
				expires.setSeconds(0);
				expires.setMinutes(0);
				expires.setUTCHours(chrissiUtils.neopetsGMTOffset);
			if (Today.getUTCMonth() == 11){	
				if (Today.getDate() == 30){
					expires.setFullYear(Today.getFullYear()+1);
				} else {
				expires.setDate(Today.getUTCDate() +1);
				}
			} else {
				expires.setDate(1);
				expires.setMonth(11);
			}
			
			
		} else {												// Duration as # of seconds case.
			expires.setSeconds(Today.getSeconds() + this.duration);
		}
			return expires;
	}


	this.clickedExpiresString =
		"list" + this.listID.toString() +
		"_link" + this.ID.toString() +
		"_clicked_expires";
		
	// Store link click info
	this.addClickedExpiresInfo = function(){
		chrissiUtils.storage(
			this.clickedExpiresString,
			this.availableDate().toUTCString(),
			Math.floor(
				(this.availableDate().getTime() - chrissiUtils.Today().getTime())
				/ 1000)
		);
	}
	// Remove clicked expires info.
	this.removeClickedExpiresInfo = function(){	
		chrissiUtils.storage( this.clickedExpiresString , null );
	}
	
	// Get the clicked expires date.
	this.clickedExpires = function(){
		if (chrissiUtils.storage(this.clickedExpiresString)){
			return new Date(chrissiUtils.storage(this.clickedExpiresString));
		} else {
			return chrissiUtils.Today();
		}
	}
	// Generate and return the structure of the list element.  Does not add to
	// DOM, just generates and returns a jquery object.
	this.elementHTML = function(){			
		var listEntry = $(
			"<li id='list" + this.listID.toString() +
			"_link" + this.ID.toString() + "'></li>"
		);
		if (this.nextIn() > 0){
			$(listEntry).addClass("unavailable");
		}
		$(listEntry).append(
			"<span class='remove'><button>-</button></span>" +
			"<span class='link'><a href='" + this.url + "'>" + this.name + "</a></span>" +
			"<span>" + this.nextInString() + "</span>" +
			"<span><button>Done!</button><button>Oops!</button></span>"
		);
		return $(listEntry);
	}
	
	
	// Returns the # of seconds from now that the link is available again.
	// Used to find the next available date when stored doesn't exist and the
	// link is not clicked.
	// Usually zero...
	this.nextIn = function(){	
		var now = new Date();
		if (chrissiUtils.storage(this.clickedExpiresString) !== null) {
			var available = this.clickedExpires();
			var ourExpiry = new Date(available);
			if (ourExpiry.getTime() - now.getTime() > 0){
				return Math.floor((ourExpiry.getTime() - now.getTime())/1000);
			} else {
				return 0;
		}
			

		//} else if (this.duration == "decemberdaily"){
		//	var DecFirst = new Date();
		//	DecFirst.setMonth(11);
		//	DecFirst.setDate(0);
		//	DecFirst.setUTCHours(chrissiUtils.neopetsGMTOffset);
		//	DecFirst.setMinutes(0);
		//	DecFirst.setSeconds(0);
		//	DecFirst.setMilliseconds(0);
		//	if (Today.getTime() < DecFirst.getTime()){
		//		return Math.floor((DecFirst.getTime() - Today.getTime())/1000);
		//	} else {
		//		return 0;
		//	}
		
>>>>>>> master
		} else {
			return 0;
		}
	}
<<<<<<< HEAD
		
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

=======
	
	this.nextInCached = this.nextIn();
		
	// Returns the string to display in the page, for when the link is available again.
	this.nextInString = function(){
		return chrissiUtils.formatMS(this.nextIn());
	}
	
	this.listItem = $("li#list" + this.listID.toString() + "_link" + this.ID.toString());
	
	this.makeAvailable = function(){
		this.listItem.removeClass('unavailable');
	}
	this.makeUnavailable = function(){
		this.listItem.addClass('unavailable');
	}	
	this.updateTimer = function(){
		$(this.timerElement).text(this.nextInString());
	}	
	this.buttonAction = function(createOrDelete){
		if (createOrDelete === "delete"){
			this.removeClickedExpiresInfo();
			if (this.nextIn() <= 0){
				this.makeAvailable();
			}
		} else if (createOrDelete === "create"){
			this.addClickedExpiresInfo();
			this.makeUnavailable();
		}
		this.updateTimer();			
	}
}		

var lists = [];
/*var cookieObj = {
   "name":"list1",
   "longName":"Cookie List",
   "linkObjects":[
      {
         "name":"fakehealing",
         "numID":0,
         "duration":1800,
         "longName":"The Healing Springs",
         "url":"http://www.neopets.com/faerieland/springs.phtml",
         "listName":"list1"
      },
      {
         "name":"fakemediocrity",
         "numID":1,
         "duration":2400,
         "longName":"Wheel of Mediocrity",
         "url":"http://www.neopets.com/prehistoric/mediocrity.phtml",
         "listName":"list1"
      }
   ]
};
chrissiUtils.storage(
    "list1",
    JSON.stringify(cookieObj),
    chrissiUtils.secondsToNextYear()
);*/


chrissiUtils.pushLists();

$('body').click(function(clickEvent){
	chrissiUtils.parseClick($(clickEvent.target));
});
$('body').focusin(function(focusEvent){
});
$('body').focusout(function(focusEvent){
    chrissiUtils.parseFcsOut($(focusEvent.target));
});

// Updates timers every second.
setInterval( function () {
	chrissiUtils.updateAllTimers();
	}, 1000
);
>>>>>>> master
