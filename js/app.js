// a25e9129ca234ec1





// Called after a geoplace has been found and then requests the weather
function getWeather(place){
	var lat = place.geometry.location.lat();
	var lng = place.geometry.location.lng();

	console.log("lat and lng: "+ lat +" "+ lng);



	// Request the weather forecast for the place
	$.ajax({
		// url: "http://api.wunderground.com/api/a25e9129ca234ec1/conditions/forecast/q/Australia/Sydney.json",
		url: "http://api.wunderground.com/api/a25e9129ca234ec1/conditions/forecast/q/"+ lat 
		+","+ lng +".json",
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
};


$(document).ready(function(){
	// Autocomplete for drop down list of cities
	$('input#city').geocomplete({
	  map: '#google-map'
	});

});