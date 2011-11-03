$('body').click(function(clickEvent){
	console.log($(clickEvent.target));
	$("input:radio")[0].attr("checked",true);
});

console.log($('input:radio[name=frequency]'));


$('input.numbers').live('keyup', function() {
  $(this).val($(this).val().replace(/[^0-9]/g, ''));
});
