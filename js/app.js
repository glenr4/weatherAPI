// a25e9129ca234ec1





// Called after a geoplace has been found and then requests the weather
function getWeather(place){
	// Get location data
	var lat = place.geometry.location.lat();
	var lng = place.geometry.location.lng();

	// Request the weather forecast for the place
	$.ajax({
		url: "http://api.wunderground.com/api/a25e9129ca234ec1/conditions/forecast/q/"+ lat 
		+","+ lng +".json",
		data: "request",
		dataType: "json",
		type: "GET"
	})
	.done(function(result){
		console.log(result);
		showWeather(result);
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		console.log(error);
	});
};

// Format and add to DOM
// Currently only handles metric units, extend later to handle Fahrenheit
function showWeather(result){
	var fullName = result.current_observation.display_location.full;
	var currentTemp = formatTemp(result.current_observation.temp_c);
	var currentWeather = result.current_observation.weather;

	var todayHigh = formatTemp(result.forecast.simpleforecast.forecastday[0].high.celsius);
	var todayLow = formatTemp(result.forecast.simpleforecast.forecastday[0].low.celsius);
	var todayWeather = result.forecast.txt_forecast.forecastday[0].fcttext_metric;
	var todayIcon = result.forecast.txt_forecast.forecastday[0].icon_url;

	console.log(fullName);
	console.log(currentTemp);
	console.log(currentWeather);

	console.log(todayHigh);
	console.log(todayLow);
	console.log(todayWeather);
	console.log(todayIcon);

	// Todays weather
	$("#weather-today img").attr("src", todayIcon);
	$("#weather-today .current-temp").html("Currently: "+ currentTemp);
	$("#weather-today .high").html("High: "+ todayHigh);
	$("#weather-today .low").html("Low: "+ todayLow);
	$("#weather-today .forecast").html(todayWeather);
	$("#location").empty().append("Weather for "+ fullName);
	// Show hidden elements
	$("#location").removeClass("hidden");
	$("#weather-today").removeClass("hidden");

	// Weather for following days
	var result = $('.templates .answerer').clone();
	

/*		// answerers
	$.each(result.items, function(i, item){
		var answerer = showAnswerer(item);
		$('.results').append(answerer);
	});
	// Name, picture and profile
	var nameElem = result.find('.name a');
	nameElem.prepend("<p>"+ answerer.user.display_name);
	nameElem.attr('href', answerer.user.link);
	var nameImg = result.find('.name img');
	nameImg.attr('src', answerer.user.profile_image);
*/

};

// Formats temperature text
function formatTemp(temp){
	temp += "&degC";
	return temp;
};


$(document).ready(function(){
	// Autocomplete for drop down list of cities
	$('input#city').geocomplete({
	  map: '#google-map'
	});

});