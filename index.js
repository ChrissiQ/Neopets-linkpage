var chrissiUtils = new function(){	//	Scoped utilities.
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
		if ($(Target).parents('.list').length){
			
			// Get listID from end of ID attribute on element.
			var listID = parseInt(
				$(Target).parents('.list').attr('id').slice(4)
			);
			
			// Get element in lists array, by checking the ID against each.
			var listElementInArray;
			var listsLength = lists.length;
			for (q=0;q<listsLength;q++){
				if (lists[q].ID == listID) listElementInArray = q;
			}
			var list = lists[listElementInArray];
				
			// LIST TITLE
			if ($(Target).is('.list .title')){
				
				// Convert the title into a textbox which can be modified.
				$(Target).empty();
				input = $("<input type='text'></input>");
				$($(input)[0]).val(lists[listID].name);
				$(Target).append(input);
			}

			// SORT
			if ($(Target).is('.list thead button.sort')){
				
				if ($(Target).is('.sort_name')){
					list.sortBy("alpha");
				} else if ($(Target).is('.sort_next_in')){
					list.sortBy("time");
				}
				list.reloadDOM();
			}
			
			// OPEN ADD LINK FORM
			if (Target.is('.list button.open-form')){
				console.log("Clicked open!");
				list.openNewLinkForm();
			}
			
			if (Target.is('.list button.close-form')){
				console.log("Clicked close!");
				list.closeNewLinkForm();
			}
			
			// SUBMIT TO ADD NEW LINK
			if ($(Target).is('.list button.submit-form')){
				list.submitAddNewLink(
					$('.list .addnew div.form')
				);			
			}

			// If we are clicking within a link element.
			if ($(Target).parents('tr').not('.permanent').length){
				
				var links = list.links;
				
				// Get linkID from end of ID attribute on li element.
				var fullID = $(Target).parents('tr').attr('id');
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
				var link = links[linkElementInArray];
				
				// CLICK A LINK
				if (Target.is($('.list .link a'))){
					link.buttonAction("create");
				}
				
				// CLICK A BUTTON
				if (Target.is($('.list tbody td button'))){
					if (Target.is(".remove")){		
						link.buttonAction("delete");
					} else if (Target.is(".add")) {					
						link.buttonAction("create");
					}
				}
				
				// REMOVE A LINK
				if (Target.is('.list td.remove button')){
					var yes=confirm(
						"Are you sure you want to remove the link" +
						link.name + "?  This action is permanent!"
					);
					if (yes==true){
						// Delete link from stored array
						links = links.splice(linkElementInArray,1);
						// Store new array
						chrissiUtils.storage(
							"list" + listID.toString(),
							JSON.stringify(lists[listID])
						);
						list.reloadDOM();
					}
				}
			}
            
		}
	} //parseClick
    
    
    this.parseFcsOut = function(focusTarget){
        var list = $(focusTarget).parents('.list');
        var listID_DOM = $(list).attr('id');
		var listID = parseInt(listID_DOM.slice(4));
        var focusTitle = $(focusTarget).parent();
        if ($(focusTarget).is('.title input')){
            lists[listID].name = $(focusTarget).val();
            $(focusTitle).empty();
            $(focusTitle).append(lists[listID].name);
            
			// Save with the new title.
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
				} else {
					return -1;
				}
			})
		} else {
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
		var list = $("#list" + this.ID + " tbody");
		$(list).find('tr').not('.permanent').remove();
	}
	
	this.blankList = function(){	
		return $(
		"<div class='column list' id='list" + this.ID.toString() + "'>" +
			"<h2 class='title'>" + this.name + "</h2>" +
			"<table class='condensed-table'>" +
				"<thead class='permanent'>" +
					"<tr>" +
					"<td class='remove'><button class='btn small'>-</button></td>" +
					"<td>Name	<button class='sort sort_name'>▼</button></td>" +
					"<td>Next in<button class='sort sort_next_in'>▼</button></td>" +
					"<td>Mark Done</td>" +
					"</tr>" +
				"</thead>" +
				"<tbody>" +
					"<tr class='addnew permanent'>" +
						"<td colspan=4 class='add'><button class='btn small open-form'>+</button></td>" +
					"</tr>"+
					"<tr class='endingSpacer permanent'></tr>" +
				"</tbody>" +
			"</table>" +
		"</div>");
	}
	// Initializes a new blank list in the DOM.
	this.initialize = function(){
        this.ID = $.inArray(this, lists);
		$('#infoColumn').before(this.blankList());
	}
  
    // Populates the list with information from a JSON file or cookie (newLinks).
    // List should already be initialized with this.initialize() before using.
    this.load = function(newLinks){
		
		// Push links from newLinks into the links array storage.
        for ( j=0 ; j<newLinks.length ; j++ ){
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
		// Add to start of list
		if (locationToAdd == "start"){
			Target = $('#list' + this.ID.toString() + ' tbody');
            Target.prepend(nodeHTML);
		// Add to end of list
		} else if (locationToAdd == "end"){
			Target = $('#list' + this.ID.toString() + ' .addnew');
            Target.before(nodeHTML);
			
		// Add to specified location (append, as first child)
		// Chosen when a jquery object somewhere in a list is
		// passed to this function, instead of "start" or "end".
		} else if ($('.list').children(locationToAdd).length) {
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
				'#list' + this.ID.toString() +
				"_link" + this.links[y].ID.toString());
            this.links[y].timerElement = $(this.links[y].listItem).find('td.timer');
		}
		$("#list" + this.ID).find("tbody tr:odd").not('.addnew').addClass("odd");
	}
	
	// Clear DOM list, then reload it with new information.
	this.reloadDOM = function(){
		this.clearDOM();
		this.loadDOM();
	}
	
	this.openNewLinkForm = function(){
        var thisFunc = this;
		var thisList = $('#list' + this.ID.toString());
		var button = $("<button class='btn small close-form'>-</button>")
		$(thisList).find('.addnew .add').empty();
		$(thisList).find('.addnew .add').append(button);
        $.get('form.html', function(data){
            thisFunc.addNode($(thisList).find('.addnew td.add'),data);
        }, 'html');
	}
	
	this.closeNewLinkForm = function(){
		var thisList = $('#list' + this.ID.toString());
		var button = $("<button class='btn small open-form'>+</button>")
		$(thisList).find('.addnew .add').empty();
		$(thisList).find('.addnew .add').append(button);
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
			.not('.add')
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
	this.container = $("#list" + this.listID.toString());	// The container element in the DOM.	
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
			"<tr id='list" + this.listID.toString() +
			"_link" + this.ID.toString() + "'></tr>"
		);
		if (this.nextIn() > 0){
			$(listEntry).addClass("unavailable");
		}
		$(listEntry).append(
			"<td class='remove'><button class='btn small'>-</button></td>" +
			"<td class='link'><a href='" + this.url + "'>" + this.name + "</a></td>" +
			"<td class='timer'>" + this.nextInString() + "</td>" +
			"<td><button class='add btn primary small'>Done!</button><button class='remove btn small'>Oops!</button></td>"
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
		
		} else {
			return 0;
		}
	}
	
	this.nextInCached = this.nextIn();
		
	// Returns the string to display in the page, for when the link is available again.
	this.nextInString = function(){
		return chrissiUtils.formatMS(this.nextIn());
	}
	
	this.listItem = $("#list" + this.listID.toString() + "_link" + this.ID.toString());
	
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