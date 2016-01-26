/*
Flickr
Key:
af1df5d17d123f5acf4da73848a1c8c7

Secret:
f306370346ca45ab


https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=af1df5d17d123f5acf4da73848a1c8c7&per_page=10&lat=-33.3270685&lon=115.63917360000005&radius=10&tags=bunbury,western,australia&tag_mode=all

https://farm6.staticflickr.com/5694/20178665614_c3381c0634_b.jpg
*/

// Gets an image of the place from Flickr to display as the background
function getImage(place){
	// Get location data
	var lat = place.geometry.location.lat();
	var lng = place.geometry.location.lng();

	console.log("Lat: "+ lat +",Long: "+ lng);

	// Request images for the place
	$.ajax({
		url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=af1df5d17d123f5acf4da73848a1c8c7&per_page=10&lat=-33.3270685&lon=115.63917360000005&radius=10&tags=bunbury,western,australia&tag_mode=all&format=json",
		dataType: "jsonp",
		jsonp: "jsoncallback",
		type: "GET"
	})
	.done(function(result){
		console.log(result);
		// showImage(result);
	})
	.fail(function(jqXHR, status, error){ //this waits for the ajax to return with an error promise object
		console.log(status +"\n"+ error +"\n"+ jqXHR.responseText);
	});
};


// Called after a geoplace has been found and then requests the weather
function getWeather(place){
	// Get location data
	var lat = place.geometry.location.lat();
	var lng = place.geometry.location.lng();

	console.log("Lat: "+ lat +",Long: "+ lng);

	// Request the weather forecast for the place
	$.ajax({
		url: "http://api.wunderground.com/api/a25e9129ca234ec1/conditions/forecast/q/"+ lat 
		+","+ lng +".json",
		data: "request",
		dataType: "json",
		type: "GET"
	})
	.done(function(result){
		// console.log(result);
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

	// var currentWeather = result.current_observation.weather;
	// Data for today
	var currentTemp = formatTemp(result.current_observation.temp_c);
	var todayHigh = formatTemp(result.forecast.simpleforecast.forecastday[0].high.celsius);
	var todayLow = formatTemp(result.forecast.simpleforecast.forecastday[0].low.celsius);
	var todayWeather = result.forecast.txt_forecast.forecastday[0].fcttext_metric;
	var todayIcon = result.forecast.txt_forecast.forecastday[0].icon_url;

	// Show location
	$("#location").empty().append("Weather for "+ fullName);
	// Today's weather
	$("#weather-today .current-temp").html("Currently: "+ currentTemp);
	$("#weather-today img").attr("src", todayIcon);
	$("#weather-today .high").html("High: "+ todayHigh);
	$("#weather-today .low").html("Low: "+ todayLow);
	$("#weather-today .forecast").html(todayWeather);
	

	// Weather for following days
	$(".following-days").empty();
	$.each(result.forecast.simpleforecast.forecastday, function(i, item){

		if(i!==0){	// skip today
			// Next day 	
			// console.log("Next day");
			// console.log(item);
			var nextHigh = formatTemp(item.high.celsius);
			var nextLow = formatTemp(item.low.celsius);
			var nextWeather = item.conditions;
			var nextIcon = item.icon_url;
			var nextDayOfWeek = item.date.weekday;

			// Create new div and populate
			var nextDay = $(".templates .next-day").clone();

			var dayOfWeekElem = nextDay.find(".weekday");
			dayOfWeekElem.html(nextDayOfWeek);
			var highElem = nextDay.find(".high");
			highElem.html("High: " +nextHigh);
			var lowElem = nextDay.find(".low");
			lowElem.html("High: " +nextLow);
			var forecastElem = nextDay.find(".forecast");
			forecastElem.html(nextWeather);
			var iconElem = nextDay.find("img");
			iconElem.attr("src", nextIcon);

			$(".following-days").append(nextDay);
		};
	});
	// Show hidden elements
	$(".hidden").removeClass("hidden");
	// But not for templates
	$(".templates").addClass("display-none");
	
};

// Formats temperature text
function formatTemp(temp){
	temp += "&degC";
	return temp;
};

// Calls the functions above to get and display the weather and background image
function displayWeather(place){
	getWeather(place);
	getImage(place);
}

$(document).ready(function(){
	// Autocomplete for drop down list of cities
	$('input#city').geocomplete({
	  map: '#google-map'
	});

});