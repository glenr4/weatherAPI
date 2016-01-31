$(document).ready(function(){

	// Gets an image of the place from Flickr to display as the background
	function getImage(place){
		// Get location data
		var fullName = place.address_components[0].long_name;

		var lat = place.geometry.location.lat();
		var lng = place.geometry.location.lng();

		// Request images for the place
		$.ajax({
			url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=af1df5d17d123f5acf4da73848a1c8c7&per_page=50&lat="+ lat +"&lon="+lng+"&radius=10&text="+ fullName +"&sort=interestingness-desc&format=json",
			dataType: "jsonp",
			jsonp: "jsoncallback",
			type: "GET"
		})
		.done(function(result){
			showImage(result);
		})
		.fail(function(jqXHR, status, error){ //this waits for the ajax to return with an error promise object
			console.log(status +"\n"+ error +"\n"+ jqXHR.responseText);
		});
	};

	// Show a local background image
	function showImage(result){
		var imageNo = parseInt(Math.random()*49);

		var item = result.photos.photo[imageNo];

		var imageURL = "https://farm"+ item.farm +".staticflickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_b.jpg";

		$("body").css("background-image", "url("+ imageURL +")");
	};

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
			showWeather(result);
		})
		.fail(function(jqXHR, status, error){ //this waits for the ajax to return with an error promise object
			console.log(status +"\n"+ error +"\n"+ jqXHR.responseText);
		});
	};

	// Format and add to DOM
	// Currently only handles metric units, extend later to handle Fahrenheit
	function showWeather(result){
		var fullName = result.current_observation.display_location.full;

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
				// Create new div and populate
				var nextDay = $(".templates .next-day").clone();

				nextDay.find(".weekday").html(item.date.weekday);
				nextDay.find(".high").html("High: " +item.high.celsius);
				nextDay.find(".low").html("Low: " +item.low.celsius);
				nextDay.find(".forecast").html(item.conditions);
				nextDay.find("img").attr("src", item.icon_url);

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

	// Connect auto-complete list to Input
	$('input#city')
		.geocomplete({ map: '#google-map' })
		.on("geocode:result", function(event, result) { 
			// Once the user has made a selection then display the weather
			getWeather(result);
			getImage(result);
		});
});

