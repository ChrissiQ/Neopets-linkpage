$('body').click(function(clickEvent){
	if ($(clickEvent.target).parents('ul.linklist').length){
		
		var Target = $(clickEvent.target);
		var parentList = $(Target).parents('ul.linklist');
		if ($(Target).is('input.numbers')){
			$($("input:radio", parentList)[0]).attr("checked",true);
		}
	
	}	
});
$('input.numbers').live('keyup', function() {
  $(this).val($(this).val().replace(/[^0-9]/g, ''));
});
