var util = new function(){	//	Scoped utilities.
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
                lists[i].links[j].updateTimerDOM();
				
				// If the timer reaches zero, make the link available again.
				if (lists[i].links[j].timer <= 0)
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
				list.openNewLinkForm();
			}
			
			if (Target.is('.list button.close-form')){
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
						"Are you sure you want to remove the link " +
						link.name + "?  This action is permanent!"
					);
					if (yes==true){
						
						// Remove any remaining trace of the link in storage.
						if (util.storage(link.clickedExpiresString))
							util.storage(link.clickedExpiresString, null);	
						
						// Delete link from stored array
						links = links.splice(linkElementInArray,1);
						// Store new array
						util.storage(
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
            lists[listID].name = ($(focusTarget).val().length)
				? $(focusTarget).val()
				: ".";
            $(focusTitle).empty();
            $(focusTitle).append(lists[listID].name);
            
			// Save with the new title.
			util.storage(
				'list' + listID,
				JSON.stringify(lists[listID]),
				{expires: util.secondsToNextYear()}
			);
			util.storage(
				'list' + listID + 'title',
				lists[listID].name,
				{expires: util.secondsToNextYear()}
			);
            
        }
   }
   
    this.pushLists = function(){
		
	// Create and load default list.
		
		var m;
		if (util.storage("list0")){
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

        while (util.storage("list" + m)){
            var listFromCookie = JSON.parse(util.storage("list" + m));
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
			if (util.webStorageSupported){
				localStorage.setItem(ID, storeData);
			}
			else {
				// Otherwise, use inferior cookie storage.
				if (expires.length){
					$.cookie(name, storeData, {expires: expires})
				} else {
					$.cookie(name, storedata,
							{ expires: util.secondsToNextYear() }
					)// End cookieset function
				}
			}// End Cookie Case
		
		} // End post
		
		// If we are not defining something to store, get what is stored.
		else if (ID.length){
			if (util.webStorageSupported){
				return localStorage[ID];
			} else {
				return $.cookie(ID);
			}
		} // End get
		
	
	return 0;	
	} // End Storage function
		
// End util		
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
		var sortingMethod = util.storage("list" + this.ID.toString() + "sortingmethod");
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
				var value = a.timer - b.timer;
				if (value > 0) changed = true;
				return value;
			})
		}
		if (!changed) this.links.reverse();

		util.storage(
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
		
		var sortingMethod = util.storage("list" + this.ID.toString() + "sortingmethod");
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
			
			this.links[y].setTimer();
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
		util.storage("list" + this.ID.toString(), JSON.stringify(this));
		
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
	this.timer = 0;

	this.clickedExpiresString =
		"list" + this.listID.toString() +
		"_link" + this.ID.toString() +
		"_clicked_expires";
		
	// Store link click info
	this.addClickedExpiresInfo = function(){
		util.storage(
			this.clickedExpiresString,
			this.timer.toUTCString(),
			Math.floor(
				(this.availableDate().getTime() - util.Today().getTime())
				/ 1000)
		);
	}
	// Remove clicked expires info.
	this.removeClickedExpiresInfo = function(){	
		util.storage( this.clickedExpiresString , null );
	}
	
	// Generate and return the structure of the list element.  Does not add to
	// DOM, just generates and returns a jquery object.
	this.elementHTML = function(){			
		var listEntry = $(
			"<tr id='list" + this.listID.toString() +
			"_link" + this.ID.toString() + "'></tr>"
		);
		$(listEntry).append(
			"<td class='remove'><button class='btn small'>-</button></td>" +
			"<td class='link'><a href='" + this.url + "'>" + this.name + "</a></td>" +
			"<td class='timer'>" + this.updatedTimer() + "</td>" +
			"<td><button class='add btn primary small'>Done!</button><button class='remove btn small'>Oops!</button></td>"
		);
		return $(listEntry);
	}
	this.newTimer = function(){		// Use when someone clicks to set a timer.
		var expires = new Date();
		var now = new Date();

		// Daily case
		if (this.duration=="daily"){
			expires.setSeconds(0);
			expires.setMinutes(0);
			expires.setUTCHours(util.neopetsGMTOffset);
			if (now.getUTCHours() >= util.neopetsGMTOffset){ //Midnight neopets time
				expires.setDate(now.getUTCDate() +1);
			}

		// Monthly case			
		} else if (this.duration == "monthly"){
			expires.setSeconds(0);
			expires.setMinutes(0);
			expires.setUTCHours(util.neopetsGMTOffset);
			expires.setDate(1);
			if (now.getUTCHours() >= util.neopetsGMTOffset){ //Midnight neopets time
				expires.setMonth(now.getUTCMonth()+1);
			}
			
		
		// Snowager case	
		// SNOWAGER IS COMPLETELY BROKEN and really confusing so I am
		// not fixing it just yet.  There are more important things.
		//
		// 6-7am, 2-3pm, and 10-11pm neopian time (PDT)
		} else if (this.duration == "snowager"){
			expires.setSeconds(0);
			expires.setMinutes(0);									

			
			//Case after 6am and before 2pm.
			if (
				// 2pm neopets time is 9pm same day UTC
				(now.getUTCHours() >= util.neopetsGMTOffset + 6) && 
				(now.getUTCHours() < util.neopetsGMTOffset + 14)
			){
				// Set expiry to 2pm (9pm same day UTC)
				expires.setUTCHours(now.getUTCHours()+util.neopetsGMTOffset+14);
			} else
			
			
			//Case after 2pm and before 10pm.
			if (
				// 2pm neopets time is 9pm same day UTC
				(now.getUTCHours() >= util.neopetsGMTOffset + 14) ||
				// OR is used because it spans two days.
				//10pm neopets time is 5am next day UTC	
				(now.getUTCHours() < util.neopetsGMTOffset -2)			
			){																					
				// Set expiry to 5am UTC tomorrow if it is before midnight UTC
				
				// Set expiry to 5am UTC same day if it is after midnight UTC.
			
			//If it is after 10pm and before 6am.
				//10pm neopets time is 5am 		next day UTC.
				// 6am neopets time is 1pm same day UTC
				// Set expiry to 1pm tomorrow if it is before midnight UTC.
				// Set expiry to 1pm same day if it is after midnight UTC.
			}
			
		// Advent calendar case.
		} else if (this.duration == "decemberdaily"){
				expires.setSeconds(0);
				expires.setMinutes(0);
				expires.setUTCHours(util.neopetsGMTOffset);
			if (now.getUTCMonth() == 11){	
				if (now.getDate() == 30){
					expires.setFullYear(now.getFullYear()+1);
				} else {
				expires.setDate(now.getUTCDate() +1);
				}
			} else {
				expires.setDate(1);
				expires.setMonth(11);
			}
			
			
		// Duration as # of seconds case (my favourite!  So easy!)
		} else {
			expires.setSeconds(now.getSeconds() + this.duration);
		}
		
		// Set and store the timer as a date.	
		this.timer = expires;	
		util.storage(
			this.clickedExpiresString,
			this.timer.toUTCString(),
			Math.floor(
				(this.timer.getTime() - now.getTime())
				/ 1000)
		);

	}
	
	this.setTimer = function(){
		var now = new Date();
		
		// If the stored timer is active,
		if (util.storage(this.clickedExpiresString) !== null){
			var clickedExpires = new Date(util.storage(this.clickedExpiresString));
			
			// Update the timer property so we don't have to keep requesting it.
			if (clickedExpires.getTime() > now.getTime()){
				this.timer = clickedExpires;
			} else {
				
				// And if the timer has expired, clean it up.
				util.storage(this.clickedExpiresString, null);
				this.timer = 0;
			}
			
		// If the stored timer is not active, just update the property.
		} else {
			this.timer = 0;
			
		}
	}
	this.updatedTimer = function(){
		var now = new Date();
		if (this.timer > 0){
			if (this.timer.getTime() - now.getTime() <= 0)
			this.timer = 0;
		}
		return (this.timer <= 0)
			? "00:00:00"
			: util.formatMS(Math.floor(
				(this.timer.getTime()
				 - now.getTime())
				/1000
			));
		}
	
	this.listItem = $("#list" + this.listID.toString() + "_link" + this.ID.toString());
	
	this.makeAvailable = function(){
		if ((this.listItem).hasClass('unavailable'))
			this.listItem.removeClass('unavailable');
	}
	this.makeUnavailable = function(){
		if (!((this.listItem).hasClass('unavailable')))
			this.listItem.addClass('unavailable');
	}	
	this.updateTimerDOM = function(){
		$(this.timerElement).text(this.updatedTimer());
		if (this.timer <= 0){
			this.makeAvailable();	
		} else {
			this.makeUnavailable();
		}
	}	
	this.buttonAction = function(createOrDelete){
		if (createOrDelete === "delete"){
			this.removeClickedExpiresInfo();
			this.setTimer();
			if (this.timer <= 0){
				this.makeAvailable();
			}
		} else if (createOrDelete === "create"){
			this.newTimer();
			this.addClickedExpiresInfo();
			this.makeUnavailable();
		}
		this.updateTimerDOM();			
	}
}		

var lists = [];

util.pushLists();

$('body').click(function(clickEvent){
	util.parseClick($(clickEvent.target));
});
$('body').focusin(function(focusEvent){
});
$('body').focusout(function(focusEvent){
    util.parseFcsOut($(focusEvent.target));
});

// Updates timers every second.
setInterval( function () {
	util.updateAllTimers();
	}, 1000
);