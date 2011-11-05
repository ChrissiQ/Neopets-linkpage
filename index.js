var chrissiUtils = new function(){		//	A set of utilities that I am using, inside an object to limit the scope, just for safety.
	this.neopetsGMTOffset = 7;	// Constant, may change based on Daylight Savings, this is neopets time offset from GMT.	
	this.Today = function(){
		return new Date();
	}
	this.nextYear = function(){
		var nextY = new Date();
		nextY.setFullYear(this.Today().getFullYear()+1);
		return nextY;
	}		
	this.formatMS = function(sc){	// Formats a number of seconds as hr:mn:sc, for display purposes.
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
	// Update a timer when information changes.
	this.updateTimer = function(createOrDelete, timerElement, liElement, list){	
	for (var m = 0; m<list.length; m++){
		if ($(liElement).is("#neopets" + list[m].name)){
			if (createOrDelete === "delete"){
				list[m].deleteCookie();
				if (list[m].nextIn() <= 0){
				liElement.removeClass("unavailable");
				}
			}else{
				list[m].addCookie();
				liElement.addClass("unavailable");
			}
			timerElement.text(list[m].nextInString());
	}}}
	
	// Get the current status of all timers.
	// Used to update the page every second.
	// ALL LISTS MUST BE IN THE MAIN LIST ARRAY!
	this.updateAllTimers = function(){
		var parent;
		var listItem;
		var listItemNum
		var itemSpan;
		var updateLink;
		var endOfLists;
		var listLength = lists.length;
		if (lists[listLength-1].linkObjects == null){		// If the last list has an empty array of links,
			endOfLists = listLength-2;					// Don't bother updating its timer.
		} else {
			endOfLists = listLength-1;
		}
		for (var listNum=0; listNum<endOfLists; listNum++){
			 parent = $('ul.linklist')[listNum];
			 listItem = $('li', parent);
			for (var obj = 0; obj < lists[listNum].linkObjects.length; obj++){
				listItemNum = $(listItem)[obj];
				itemSpan = $('span', listItemNum);
				updateLink = $('a', itemSpan);
				$(itemSpan[2]).text(lists[listNum].linkObjects[obj].nextInString());
			}
		}
	}
	
	
	this.newListObjectFromArray = function(longName, listArray){
		return new listObject(listArray[0].listName, longName, listArray);
	}
	
	this.parseClick = function(Target){
		if ($(Target).parents('ul').length){
			var sortLabel;
			var liElement = $(Target).parents('li');
			var parentListID = $($(Target).parents('ul.linklist')).attr('id');
			var targetList = eval(parentListID);
			var listLinkObjects = targetList.linkObjects;
			var linkObjectsLength = listLinkObjects.length;
			
			if (Target.is($('ul.linklist span.link a'))){				// onclick 'a' list item....
				for (var l=0; l<linkObjectsLength; l++){			
					if ("neopets" + listLinkObjects[l].name == liElement.attr('id')){
						listLinkObjects[l].buttonAction("create");
			}}}
			if (Target.is($('ul.linklist h1 a'))){				// onclick sorting symbol...
				sortLabel = $(Target.parent());
				if (sortLabel.text() == "Name▼"){
					targetList.sortBy("alpha");
				} else if (sortLabel.text() == "Next in▼"){
					targetList.sortBy("time");
				}
				targetList.reload();
			}
			if (Target.is('ul.linklist button')){ 				// onclick 'button'...
				if (Target.text() == "Oops!"){
					for (var l=0; l<linkObjectsLength; l++){			
						if ("neopets" + listLinkObjects[l].name == liElement.attr('id')){
							listLinkObjects[l].buttonAction("delete");
						}
					}
				} else if (Target.text() == "Done!") {
					for (var l=0; l<linkObjectsLength; l++){				
						if ("neopets" + listLinkObjects[l].name == liElement.attr('id')){			
							listLinkObjects[l].buttonAction("create");
				}}}
			}
		}
	}
}

function listObject(name, longName, linkObjects){

	this.name = name;
	this.longName = longName
	this.linkObjects = linkObjects;
	
	this.toJSON = function(){
		return {
			name: this.name,
			longName: this.longName,
			linkObjects: this.linkObjects
		}
	}
	this.sorted = function(){
		if ($.cookie(this.name + "sortingmethod") !== null){
			return true;
		} else {
			return false;
		}
	}
	this.addSortCookie = function(sortType){
		var thisSortType = sortType;
		$.cookie(
			this.name + "sortingmethod",
			sortType, 
			{ expires: 
				Math.floor((
					chrissiUtils.nextYear().getTime() - 
					chrissiUtils.Today().getTime()) 
				/ 1000)
			}
		);
	}
	this.sortBy = function(tag){
		if (tag === "alpha"){
			this.linkObjects.sort(function(a,b){
				if (a.longName > b.longName){
					return 1;
				} else {
					return -1;
				}
			})
		} else {
			this.linkObjects.sort(function(a,b){
				return a.nextIn() - b.nextIn();
			})	
		}	
		this.addSortCookie(tag);
	}	
	this.getSortCookie = function(){
		return $.cookie(this.name + "sortingmethod");
	}
		
	// Clear out a list of all items.
	this.clear = function (){
		var list = $("ul#" + this.name);
		$(list).find('li').not('.permanent').remove();
	}
	
	this.blankList = function(){	
		return $(
		"<div class='column'>" +
			"<span>" + this.longName + "</span>" +
			"<ul class='linklist' id='" + this.name + "'>" +
				"<h1 class='permanent'>" + 
					"<span class='remove'><a href='#'>-</a></span>" +
					"<span class='link'>Name<a href='#'>▼</a></span>" +
					"<span>Next in<a href='#'>▼</a></span>" +
					"<span>Mark Done</span>" +
				"</h1>" +
				"<li class='addnew permanent'><span class='add'><a href='#'>+</a></span></li>"+
				"<li class='endingSpacer permanent'></li>" +
			"</ul>" +
		"</div>");
	}
	// Initializes a new list in the DOM.
	this.initialize = function(){	
		$('#infoColumn').before(this.blankList());			
		this.endingLi = $("li.addnew", "#" + this.name);	
		this.listElement = $("ul#" + this.name);
	}

	// Load list items from the array into the DOM.
	this.load = function (){
		for (y=0;y<this.linkObjects.length;y++){
			this.linkObjects[y].addNode();
		}
		$("ul#" + this.name + " li:odd").addClass("odd");
	}
	
	// Clear DOM list, then reload it with new information.
	this.reload = function(){
		this.clear();
		this.load();
	}
	
	this.addNewLink = function(list){
	//	this.OpenForm();
	//	array = this.formResults;
	//	this.closeForm();
	//	var
	//	add node
	//	create cookie
		
	}
	
	
	
	this.printNewListForm = function(){
		
		$('ul#' + this.name + ' li.addnew').before(
			"<li class='newlinkform'><form><legend>Add a link</legend>" + 
			"<label>Link Name</label><input type='text' />" +
			"<label>Address (URL)</label><input type='text' />" +
			"<label>Frequency</label><input type='radio' name='frequency' />Hourly" +
			"" +
			"</form></li>"
		);
		
	}

}
function linkObject(name, passedNumber, duration, longName, url, listName){
	// The main object representing an individual link on the page.
	// There are no defaults since we are creating unique objects.
	
	this.name = name;				// Make all arguments properties of the object.
	this.numID = passedNumber;
	this.duration = duration;
	this.longName = longName;
	this.url = url;
	this.listName = listName; // The default list.
	this.container = $("ul#" + this.listName);	// The container element in the DOM.
	
	this.toJSON = function(){
		return {
			name: this.name,
			numID: this.numID,
			duration: this.duration,
			longName: this.longName,
			url: this.url,
			listName: this.listName
		}
	}
	
	// Returns an expiry date based on the current time + dur seconds.
	this.availableDate = function(dur){		
		if (!dur){dur = this.duration;}		// Or if the duration is not a time but a fixed date,
		var expires = new Date();				// Return that fixed date, properly formatted as a date.
		var Today = new Date();					// All dates need to be in Neopian time which is PDT!
		


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
	this.addCookie = function(){
		$.cookie(
			"neopets" + this.name,
			this.availableDate().toUTCString(),
			{ expires: Math.floor(
				(this.availableDate().getTime() - chrissiUtils.Today().getTime())
				/ 1000
			)}
		);
	}
	// Deletes cookie specific to this element.
	this.deleteCookie = function(){	
		$.cookie("neopets" + this.name, null);
	}
	// Get the expiry date from the cookie.
	this.available = function(){
		return new Date($.cookie("neopets" + this.name));
	}
	// Not being used yet... not sure if functional.  Deletes the node off the DOM tree.
	this.deleteNode = function(numInArray){
		$($("li", this.container)[numInArray]).remove();
	}
	
	// Generate and return the structure of the list element.  Does not add to DOM, just generates and returns.
	this.elementHTML = function(){			
		var listEntry = $("<li id='neopets" + this.name + "'></li>");
		if (this.nextIn() > 0){
			$(listEntry).addClass("unavailable");
		}
		$(listEntry).append(
			"<span class='remove'><button>-</button></span>" +
			"<span class='link'><a href='" + this.url + "'>" + this.longName + "</a></span>" +
			"<span>" + this.nextInString() + "</span>" +
			"<span><button>Done!</button><button>Oops!</button></span>"
		);
		return $(listEntry);
	}
	
	//Add this.elementHTML (list element structure) to the actual DOM of the page.
	this.addNode = function(locationToAdd){
		if ((!locationToAdd) || (locationToAdd != "start" && locationToAdd != "end")){locationToAdd = "end"}//Set default arguments.

		if (locationToAdd == "start"){		//Determine whether we are adding nodes to beginning
			$('ul#' + this.listName + ' h1').after(this.elementHTML());
		} else {
			$('ul#' + this.listName + ' li.addnew').before(this.elementHTML());
		}
		this.listItem = $('li#neopets' + this.name);
		this.linkItem = $(this.listItem).find('a');
		this.timerElement = $(this.listItem).find('span')[2];
		this.buttons = $(this.listItem).find('button');
	}
	
	
	// Returns the # of seconds from now that the link is available again.
	this.nextIn = function(){	
		var Today = new Date();
		if ($.cookie("neopets" + this.name) !== null){
			var ourCookie = this.available();
			var ourExpiry = new Date(ourCookie);
			return Math.floor((ourExpiry.getTime() - Today.getTime())/1000);			

		} else if (this.duration == "decemberdaily"){
			var DecFirst = new Date();
			DecFirst.setMonth(11);
			DecFirst.setDate(1);
			DecFirst.setUTCHours(chrissiUtils.neopetsGMTOffset);
			DecFirst.setMinutes(0);
			DecFirst.setSeconds(0);
			DecFirst.setMilliseconds(0);
			if (Today.getTime() < DecFirst.getTime()){
				return Math.floor((DecFirst.getTime() - Today.getTime())/1000);
			} else {
				return 0;
			}
		
		} else {
			return 0;
		}
	}
		
	// Returns the string to display in the page, for when the link is available again.
	this.nextInString = function(){
		return chrissiUtils.formatMS(this.nextIn());
	}

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
			this.deleteCookie();
			if (this.nextIn() <= 0){
				this.makeAvailable();
			}
		} else if (createOrDelete === "create"){
			this.addCookie();
			this.makeUnavailable();
		}
		this.updateTimer();			
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
// lists[0] is the array of link objects.  It is pulled
// from "files.json" as an array of objects.  These objects are
// then converted to a linkObject with all methods.
// Then a node is added to the document for each.
// Using jquery makes this simple to understand!
var lists = [];
var list0 = [];
var otherlinks = [];
var list2 = [];

$.getJSON("files.json", function(data){

	$.each(data, function(index, myObject){
		spot = myObject.numID;
		list0[spot] = new linkObjectTakingJSON(myObject);
	});	
	list0 = chrissiUtils.newListObjectFromArray("My Default List", list0);
	lists[0] = list0;
	
	if (lists[0].sorted){
		lists[0].sortBy(lists[0].getSortCookie());
	}
	lists[0].initialize();
	lists[0].load();

	otherlinks = [
		new linkObjectTakingJSON({
		  "name":"imaginar",
		  "numID":0,
		  "duration":10800,
		  "longName":"Imaginary Something 1",
		  "url":"http://www.neopets.com/pirates/buriedtreasure/index.phtml",
		  "listName":"otherlinks"
	   }),
	   new linkObjectTakingJSON({
		  "name":"imaginaryso",
		  "numID":1,
		  "duration":21600,
		  "longName":"Imaginary Something 2",
		  "url":"http://www.neopets.com/halloween/strtest/index.phtml",
		  "listName":"otherlinks"
	   }),
	   new linkObjectTakingJSON({
		  "name":"crazyonetwo",
		  "numID":2,
		  "duration":21600,
		  "longName":"The Crazy One",
		  "url":"http://www.neopets.com/winter/kiosk.phtml",
		  "listName":"otherlinks"
	   })
	];
	otherlinks = chrissiUtils.newListObjectFromArray("New List", otherlinks);
	otherlinks.initialize();
	if (otherlinks.sorted()){
		otherlinks.sortBy(otherlinks.getSortCookie());
	}
	otherlinks.load();
	lists[1] = otherlinks;

	//console.log(chrissiUtils.JSONObjectCookie(list0.linkObjects[0].name));
	console.log(JSON.stringify(lists[0]));
	var JSONString = JSON.stringify(otherlinks.linkObjects);
	$.cookie("list2", JSONString, { expires: 60*60*24*365 } );

	$.each(
		JSON.parse($.cookie("list2")),
		function(index,Element){
			list2[index] = new linkObjectTakingJSON(Element);
			list2[index].listName = "list2";
			list2[index].name = list2[index].name + "2";
		});

	list2 = chrissiUtils.newListObjectFromArray("Other Custom List", list2);
	lists[2] = list2;
	list2.initialize();
	if (list2.sorted()){
			list2.sortBy(list2.getSortCookie());
		}
	list2.load();
	
	lists[lists.length] = new listObject("list" + lists.length, "Create New List", null);
	lists[lists.length-1].initialize();
});
// More magic!  One click handler, many detection methods!
$('body').click(function(clickEvent){
	chrissiUtils.parseClick($(clickEvent.target));
});

// Updates timers every second.
setInterval( function () {
	chrissiUtils.updateAllTimers();
	}, 1000
);