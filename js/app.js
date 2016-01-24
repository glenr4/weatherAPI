// a25e9129ca234ec1

// Need to manually convert Fahrenheit temperatures to Celsius

$(document).ready(function(){
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