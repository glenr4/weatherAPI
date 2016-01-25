// a25e9129ca234ec1



$(document).ready(function(){
	// Autocomplete for drop down list of cities
	$('input#city').geocomplete({
	  map: '#google-map'
	});

});



	$.ajax({
		url: "http://api.wunderground.com/api/a25e9129ca234ec1/conditions/forecast/q/Australia/Sydney.json",
		data: "request",
		dataType: "json",
		type: "GET"
	})
	.done(function(result){
		console.log(result);
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		console.log(error);
	});
});