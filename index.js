var chrissiUtils = new function(){	//	Scoped utilities.
	this.neopetsGMTOffset = 7;      // Constant, may change based on Daylight Savings, this is neopets time offset from GMT.	
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
    this.updateAllTimers = function(){
        for (i=0;i<lists.length;i++){
            for (j=0;j<lists[i].linkObjects.length;j++){             
                lists[i].linkObjects[j].updateTimer();
            }
        }
    }
	this.parseClick = function(Target){
		if ($(Target).parents('ul').length){
            
			var sortLabel;
			var liElement = $(Target).parents('li');
			var parentListID = $($(Target).parents('ul.linklist')).attr('id');
            var listNum
            for (j=0;j<lists.length;j++){
                if (parentListID == lists[j].name){
                    listNum = j;
                }
            }
            var targetList = lists[listNum];
			var listLinkObjects = lists[listNum].linkObjects;
			var linkObjectsLength = listLinkObjects.length;
			
			if (Target.is($('ul.linklist span.link a'))){				// onclick 'a' list item....
				for (var i=0; i<listLinkObjects[linkObjectsLength]; i++){			
					if ("neopets" + listLinkObjects[i].name == liElement.attr('id')){
						lists[listNum].linkObjects[i].buttonAction("create");
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
					for (i=0; i<linkObjectsLength; i++){			
						if ("neopets" + listLinkObjects[i].name == liElement.attr('id')){
							listLinkObjects[i].buttonAction("delete");
						}
					}
				} else if (Target.text() == "Done!") {
					for (i=0; i<linkObjectsLength; i++){				
						if ("neopets" + listLinkObjects[i].name == liElement.attr('id')){			
							listLinkObjects[i].buttonAction("create");
				}}}
			}
            if (Target.is('ul.linklist span.listtitle')){
                $(Target).empty();
                input = $("<input type='text'></input><button>Submit</button>");
                $($(input)[0]).val(lists[listNum].longName);
                $(Target).append(input);
            }
            
		}//if ($(Target).parents('ul').length){
	}//parseClick
}

function listObject(name, longName, linkObjects){

	this.name = name;
	this.longName = longName
	this.linkObjects = linkObjects;
    this.listNum;
	
	this.toJSON = function(){
		return {
			name: this.name,
			longName: this.longName,
			linkObjects: this.linkObjects
		}
	}
    this.makeArrayObjects = function(){ 
        for (j=0;j<this.linkObjects.length;j++){
            this.linkObjects[j] = new linkObject(
                this.linkObjects[j].name,
                this.linkObjects[j].numID,
                this.linkObjects[j].duration,
                this.linkObjects[j].longName,
                this.linkObjects[j].url,
                this.linkObjects[j].listName
            );
        }           
    }
	this.sorted = function(){
		if ($.cookie("list" + this.listNum + "sortingmethod") !== null){
			return true;
		} else {
			return false;
		}
	}
	this.addSortCookie = function(sortType){
		var thisSortType = sortType;
		$.cookie(
			"list" + this.listNum + "sortingmethod",
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
	// Clear out a list of all items.
	this.clear = function (){
		var list = $("ul#" + this.name);
		$(list).find('li').not('.permanent').remove();
	}
	
	this.blankList = function(){	
		return $(
		"<div class='column'>" +
			"<ul class='linklist' id='" + this.name + "'>" +
			"<span class='listtitle'>" + this.longName + "</span>" +
				"<h1 class='permanent'>" + 
					"<span class='remove'><a href='#'>-</a></span>" +
					"<span class='link'>Name<a href='#'>▼</a></span>" +
					"<span>Next in<a href='#'>▼</a></span>" +
					"<span>Mark Done</span>" +
				"</h1>" +
				"<li class='addnew permanent'>" +
                    "<span class='add'><a href='#'>+</a></span>" +
                "</li>"+
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
			this.linkObjects[y].addNode("end",this.listNum);
		}
		$($("ul.linklist")[this.listNum]).find("li:odd").addClass("odd");
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
		
	}
};
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
	this.addNode = function(locationToAdd, listNum){
        var Target;
		if (
            (!locationToAdd) ||
            (locationToAdd != "start" && locationToAdd != "end")){
        locationToAdd = "end"
        }//Set default arguments.
		if (locationToAdd == "start"){	//Determine whether we are adding nodes to beginning
			Target = $($('ul.linklist')[listNum]).find('h1');
            Target.after(this.elementHTML());
		} else {
			Target = $($('ul.linklist')[listNum]).find('li.addnew');
            Target.before(this.elementHTML());
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

var lists = [];
$.getJSON("files.json", function(data){
	lists[0] = data;
    lists[0] = new listObject(
        lists[0].name,
        lists[0].longName,
        lists[0].linkObjects
    );
    lists[0].listNum = lists.length-1;
    lists[0].makeArrayObjects();
    lists[0].initialize();
    if (lists[0].sorted){
        lists[0].sortBy($.cookie("list0sortingmethod"))
    }
    lists[0].load();
    
    lists[1] = new listObject(
        "newlist",
        "My New List",
        JSON.parse($.cookie("list2"))
    );
    lists[1].listNum = lists.length-1;
    lists[1].makeArrayObjects();
    lists[1].initialize();
    if (lists[1].sorted){
        lists[1].sortBy($.cookie("list1sortingmethod"))
    }
    lists[1].load();
    
    lists[lists.length] = new listObject(
        "magiclist",
        "Magic List",
        []
    );
    lists[lists.length-1].listNum = lists.length-1;
    lists[lists.length-1].initialize();
});

$('body').click(function(clickEvent){
	chrissiUtils.parseClick($(clickEvent.target));
});

$('body').focusin(function(focusEvent){
    console.log("Focus!"); 
});
$('body').focusout(function(focusEvent){
    console.log("Unfocus!");
    var focusTarget = $(focusEvent.target);
    var focusList = $(focusTarget).parents('ul.linklist');
    var focusTitle = $('span.listtitle');
    console.log($($(focusTarget).html()));
    console.log($('ul.linklist span.listtitle').html())
    if ($($(focusTarget).html()).is($('ul.linklist span.listtitle').html())){
        for (q=0;q<lists.length;q++){
            console.log("Attempting to empty...");
            console.log(focusList.html());
            console.log($($('ul.linklist')[q]).html())
            if (focusList.html() == $($('ul.linklist')[q]).html()){
                console.log("Emptying...");
                $(focusTitle).empty();
                $(focusTitle).append(lists[q].longName);
            }
        }
    }
});

// Updates timers every second.
setInterval( function () {
	chrissiUtils.updateAllTimers();
	}, 1000
);