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
        for (i=0;i<lists.length;i++){
            for (j=0;j<lists[i].links.length;j++){             
                lists[i].links[j].updateTimer();
				
				// If the timer reaches zero, make the link available again.
				if (lists[i].links[j].nextIn() <= 0){
					lists[i].links[j].makeAvailable();
				}
            }
        }
    }
	this.parseClick = function(Target){
		if ($(Target).parents('ul.linklist').length){
            
			// Prepare information to use in clicks
			var sortLabel;
			var liElement = $(Target).parents('li');
			var liElementID = $(liElement).attr('id');
			var linkID = parseInt(
				liElementID.slice(
					liElementID.indexOf("_") + 4
				)
			);
			
			var listElementID = $($(Target).parents('ul.linklist')).attr('id');
			var listID = parseInt(listElementID.slice(4)); // Extracts ID # from string "list#"

			var links = lists[listID].links;
			
			// onclick 'a' list item....
			if (Target.is($('ul.linklist span.link a'))){
				for (i=0; i<links.length; i++){			
                    if ("neopets" + links[i].name == liElement.attr('id')){
                        links[i].buttonAction("create");
                    }
				}
            }
			
			// onclick sorting symbol...
			if (Target.is($('ul.linklist h1 a'))){
				sortLabel = $(Target.parent());
				if (sortLabel.text() == "Name▼"){
					targetList.sortBy("alpha");
				} else if (sortLabel.text() == "Next in▼"){
					targetList.sortBy("time");
				}
				targetList.reload();
			}
			
			// onclick 'button'...
			if (Target.is($('ul.linklist li button'))){
				if (Target.text() == "Oops!"){
					for (i=0; i<links.length; i++){			
						if ("neopets" + links[i].name == liElement.attr('id')){
							links[i].buttonAction("delete");
						}
					}
				} else if (Target.text() == "Done!") {
					for (i=0; i<links.length; i++){				
						if ("neopets" + links[i].name == liElement.attr('id')){			
							links[i].buttonAction("create");
				}}}
			}
			
			// onclick the title of a list
            if (Target.is('ul.linklist span.listtitle')){
                $(Target).empty();
                input = $("<input type='text'></input>");
                $($(input)[0]).val(lists[listID].longName);
                $(Target).append(input);
            }
			// onclick the minus symbol to remove a link
			if (Target.is('ul.linklist li .remove button')){
				
			}
			
			// onclick the plus symbol to open the 'add link' form
            if ($(Target).is('ul.linklist li.addnew .add a')){
                lists[listID].addNewLink();
                $('#list' + listID + "addnew")
                    .find('div.close a')
                    .attr('href', '#list' + listID + "addnew");
            }
			// onclick the minus symbol to close the list form
            if ($(Target).is('ul.linklist li.addnew .close a')){
                $($(liElement).children())
                    .not('span.add')
                    .remove();
            }
			
			// onclick add new submission
            if ($(Target).is('ul.linklist li.addnew button')){
                lists[listID].processNewLink($('ul.linklist li.addnew div.form'));
                
            }
            
		}//if ($(Target).parents('ul').length){
	}//parseClick
    
    
    this.parseFcsOut = function(focusTarget){
        var parentList = $(focusTarget).parents('ul.linklist');
        var parentListID = $(parentList).attr('id');
        var focusTitle = $(focusTarget).parent();
        if ($(focusTarget).parent().is('span.listtitle')){
            var listID = $('ul.linklist').index(parentList);
            lists[listID].longName = $(focusTarget).val();
            $(focusTitle).empty();
            $(focusTitle).append(lists[listID].longName);
            
			// Save cookie with the new title.
			chrissiUtils.storage(
				'list' + listID,
				JSON.stringify(lists[listID]),
				{expires: chrissiUtils.secondsToNextYear()}
			);
			chrissiUtils.storage(
				'list' + listID + 'title',
				lists[listID].longName,
				{expires: chrissiUtils.secondsToNextYear()}
			);
			//alert("list" + listID);
			//alert(encodeURIComponent(JSON.stringify(lists[listID])));
            
        }
   }
   
    this.pushLists = function(){
	// Mainline for list creation
        
		
		// Create and load default list.
        lists[0] = new listObject(
            0,
            "My Default List",
            []
        );
        lists[0].initialize();
        $.getJSON("files.json", function(data){
            lists[0].load(data.links);
        });
		
		// Create and load first saved list, if exists.
        var m = 1;
        while (chrissiUtils.storage("list" + m)){
            var listFromCookie = JSON.parse(chrissiUtils.storage("list" + m));
            lists[m] = new listObject(
                listFromCookie.name,
                listFromCookie.longName,
                []
            );
            lists[m].initialize();
            lists[m].load(m, listFromCookie.links);
            
            m++;
        }
		
		// Create and initialize one blank list at the end.
        lists[m] = new listObject(
            "list" + m,
            "New list",
            []
        );
        lists[m].initialize();
	}
	this.storage = function(name, storeData, expires){
		// If we are defining something to store, store it.
		if (storeData !== undefined){
			
			// If we have html5 storage in the browser, use it!
			if (chrissiUtils.webStorageSupported){
				localStorage.setItem(name, storeData);
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
		else if (name.length){
			if (chrissiUtils.webStorageSupported){
				return localStorage[name];
			} else {
				return $.cookie(name);
			}
		} // End get
		
		
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
		var sortingMethod = chrissiUtils.storage("list" + this.listNum + "sortingmethod");
		return (sortingMethod !== null)
			? true
			: false;
	}
	this.sortBy = function(sortingMethod){
		if (sortingMethod === "alpha"){
			this.links.sort(function(a,b){
				return (a.longName > b.longName)
					? 1
					: -1;
			})
		} else {
			this.links.sort(function(a,b){
				return a.nextIn() - b.nextIn();
			})	
		}	
		chrissiUtils.storage(
			"list" + this.listNum + "sortingmethod",
			sortingMethod);
	}
	// Clear out a list of all items.
	this.clearDOM = function (){
		var list = $("ul#" + this.name);
		$(list).find('li').not('.permanent').remove();
	}
	
	this.blankList = function(){	
		return $(
		"<div class='column'>" +
			"<ul class='linklist' id='list" + this.ID.toString() + "'>" +
			"<span class='listtitle'>" + this.name + "</span>" +
				"<h1 class='permanent'>" + 
					"<span class='remove'><a href='#'>-</a></span>" +
					"<span class='link'>Name<a href='#'>▼</a></span>" +
					"<span>Next in<a href='#'>▼</a></span>" +
					"<span>Mark Done</span>" +
				"</h1>" +
				"<li class='addnew permanent'>" +
                    "<span class='add'><a href='#ender'>+</a></span>" +
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
            this.links.push(new linkObject(
                newLinks[j].ID,
                newLinks[j].name,
                newLinks[j].url,
                newLinks[j].duration,
                newLinks[j].listID
            ));
        }
		
		var sortingMethod = chrissiUtils.storage("list" + listID + "sortingmethod");
        if (sortingMethod){
			this.sortBy(sortingMethod);
		}
        this.loadDOM();
    } 
	
	//Add this.elementHTML (list element structure) to the actual DOM of the page.
	this.addNode = function(locationToAdd, nodeHTML){
        var Target;
		if (locationToAdd == "start"){	//Determine whether we are adding nodes to beginning
			Target = $('ul#list' + this.listID + ' h1');
            Target.after(nodeHTML);
		} else if (locationToAdd == "end"){
			Target = $('ul#list' + this.listID + ' li.addnew');
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
            this.links[y].listItem = $('li#neopets' + this.links[y].name);
            this.links[y].linkItem = $(this.links[y].listItem).find('a');
            this.links[y].timerElement = $(this.links[y].listItem).find('span')[2];
            this.links[y].buttons = $(this.links[y].listItem).find('button');
			
		}
		$($("ul.linklist")[this.listID]).find("li:odd").addClass("odd");
	}
	
	// Clear DOM list, then reload it with new information.
	this.reloadDOM = function(){
		this.clearDOM();
		this.loadDOM();
	}
	
	this.addNewLink = function(){
        var thisFunc = this;
        $.get('form.html', function(data){
            thisFunc.addNode($($('ul.linklist')[thisFunc.ID]).find('li.addnew'),data);
        }, 'html');	
	}
    this.processNewLink = function(linkForm){
		
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
			this.listID
			)
		);
		
		// Push from array to storage.
		chrissiUtils.storage("list" + this.listID, JSON.stringify(this));
		
		// Refresh the list view to display the newly added link.
		lists[this.listID].reload();
		// Remove the form.		
		$("#list" + this.listID + " .addnew").children()
			.not('span.add')
			.remove();
    }
};
function linkObject(ID, name, duration, url, listID){
	// The main object representing an individual link on the page.
	// There are no defaults since we are creating unique objects.

	this.ID = ID;
	this.name = name;
	this.duration = duration;
	this.url = url;
	this.listID = listID;
	this.container = $("ul#list" + this.listID);	// The container element in the DOM.	
	this.toJSON = function(){
		return {
			ID: this.ID,
			name: this.name,
			duration: this.duration,
			url: this.url,
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


	// Adds cookie with appropriate expiry date.
	this.addCookie = function(){
		chrissiUtils.storage(
			"neopets" + this.name,
			this.availableDate().toUTCString(),
			Math.floor(
				(this.availableDate().getTime() - chrissiUtils.Today().getTime())
				/ 1000)
		);
	}
	// Deletes cookie specific to this element.
	this.deleteCookie = function(){	
		chrissiUtils.storage("neopets" + this.name, null);
	}
	
	// Get the expiry date from the cookie.
	this.available = function(){
		if (chrissiUtils.storage("neopets" + this.name)){
			return new Date(chrissiUtils.storage("neopets" + this.name));
		} else {
			return chrissiUtils.Today();
		}
	}
	// Generate and return the structure of the list element.  Does not add to
	// DOM, just generates and returns a jquery object.
	this.elementHTML = function(){			
		var listEntry = $("<li id='list" + this.listID + "_link" + this.ID + "'></li>");
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
	// Used to find the next available date when a cookie doesn't exist and the
	// link is not clicked.
	// Usually zero...
	this.nextIn = function(){	
		var Today = new Date();
		if (chrissiUtils.storage(
			"list" + this.listID.toString() +
			"_link" + this.ID.toString()
			) !== null
		) {
			var ourCookie = this.available();
			var ourExpiry = new Date(ourCookie);
			if (ourExpiry.getTime() - Today.getTime() > 0){
				return Math.floor((ourExpiry.getTime() - Today.getTime())/1000);
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