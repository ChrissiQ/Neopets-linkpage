$('body').click(function(clickEvent){
	if ($(clickEvent.target).parents('div.form').length){
		
		var Target = $(clickEvent.target);
		var parentForm = $(Target).parents('div.form');
		if ($(Target).is('input.numbers')){
			$($("input:radio", parentForm)[0]).attr("checked",true);
		}
	
	}
return false; // Stops the button from automatically reloading the page, hopefully.
});
$('input.numbers').live('keyup', function() {
  $(this).val($(this).val().replace(/[^0-9]/g, ''));
});
