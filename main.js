
$(document).ready(function () {


var trigger=$('#getTheLocation');
var navError =$('#navError');

var dataOutput=$('#dataOutput');

trigger.on("click", function showLocalWeather() {

// Error handlers

if (!navigator.geolocation) {
		console.log("Seems, your navigator doesn't have geolocation function");
		navigatorErrorOuput.style.display="block";
	};

function locationError() {
$('#locationError').fade();
}

function onSuccessRequest(position) {
	 var latitude  = position.coords.latitude.toFixed(3);
    var longitude = position.coords.longitude.toFixed(3);

    dataOutput.innerHTML = '<p>Latitude is ' + latitude 
    + '° <br>Longitude is ' + longitude + '°</p>';

    
    // vanilla js request
var API_key ="14cbcd61fa4d9e193a3a32128af89564",
    requestURL = "https:/api.openweathermap.org/data/2.5/weather?"
    +"lat="+latitude+"&lon="+longitude+"&type=accurate"+"&units=metric"+"&APPID="+API_key,
 // create the variable for youtube search
    weather="";
   

    var request =new XMLHttpRequest();
    request.open('GET', requestURL);
  	console.log(requestURL);
    request.responseType="json";
    request.send();

    // vanilla js response workaround
    request.onload=function() {
    	var respondedJSON=request.response;
    	console.log(respondedJSON);
    	 passValues(respondedJSON);
    	    }



}



function passValues(jsonObject) {
	weather=jsonObject["weather"][0]["main"];
	var description=jsonObject["weather"][0]["description"];
	var	icon=jsonObject["weather"][0]["icon"];
	var currentTemp=jsonObject["main"]["temp"];
	var cityName=jsonObject["name"];

	showTemp(currentTemp,description,cityName,icon);

	getTYoutubeResults(weather);

}


function showTemp(temp,description,cityName,icon) {
	var tempHTML='<p class="location">'+'~~location:'+'<span id="cityName">'+cityName+
	'</span></p><p class="temp">'+'Temp outside:'+'<span id="temp">'+temp+'</span>'+'</p>';
	var descrpHTML='<p class="weather">'+
	'<img src="http://openweathermap.org/img/w/'+icon+'.png">'+'</p>'+
	'<p class="descrp">'+'<span class="descrp-span">'+description+'</span></p>';
	var switchBtn='<button id="switchBtn" class="switcher-temp">Toggle C&#176;/F&#176; </button>';
	$('.weather-output').empty();
	$('.weather-output').append(tempHTML,descrpHTML,switchBtn);

// load metric/imperial switcher
toggleUnits();

}




function getTYoutubeResults(query) {
	var maxResults=10;
	var API_key="AIzaSyBkya_0J0Ae85zXb7VUU6sG7BfbHUcrNHY",
		requestURL="https://www.googleapis.com/youtube/v3/search?part=snippet"
		+"&q="+"lo-fi+"+query+"&maxResults="+maxResults+"&key="+API_key;
	var	request=new XMLHttpRequest();
	request.open('GET', requestURL);
	request.send();

	  request.onload=function() {
    	var respondedJSON=request.response;
    	console.log(respondedJSON);
    	 generateVideo(respondedJSON,maxResults);
    	    }
}


function generateVideo(jsonObject,arrayLength) {
	var obj=JSON.parse(jsonObject);
	var idArray=new Array();
	var titleArray=new Array();
	var thumbArray=new Array();

	for (var i=0;i<arrayLength;i++) {
		 idArray.push(obj["items"][i]["id"]["videoId"]);
	}

	for (var j=0;j<arrayLength;j++) {
		 titleArray.push(obj["items"][j]["snippet"]["title"]);
	}

	for (var k=0;k<arrayLength;k++) {
		 thumbArray.push(obj["items"][k]["snippet"]["thumbnails"]["default"]["url"]);
	}

	//GENERATE HTML

	//TITLE
	var title = '<h2> Best result for your current weather<h2>';

	//FRAME
	var iframeBlock = '<iframe class="yt-player" id="YTPlayer1"'+
	' width="560" height="315" src="https://www.youtube.com/embed/'+idArray[0]+'"'+
	' frameborder="0" allowfullscreen></iframe>';

	//LIST
	var worthLinksList='<ul><h2>Other related lo-fi video to your local weather</h2>';
	var worthLinksListClose='</ul>';

	for (var l = 0; l < arrayLength; l++) {
		worthLinksList+='<li>'+'<img title="Thumbnail of video" src="'+thumbArray[l]+
		'" >'+'<a target="_blank" href="https://youtu.be/'+idArray[l]+'"'+
		' >'+titleArray[l]+'</a>'+'</li>';
	}

	worthLinksList+=worthLinksListClose;

	$('.video-title').empty();
	$('.video-title').append(title);
	$('.video-wrapper').empty();
	$('.video-wrapper').append(iframeBlock);
	$('.search-results').empty();
	$('.search-results').append(worthLinksList);

}



navigator.geolocation.getCurrentPosition(onSuccessRequest, locationError);







});

function toggleUnits() {
	
	//Enable switching celsius/f
	var tempUnit = "c";

	$('#switchBtn').on("click", function() {
	  

	var tempEl = $('#temp');

  var tempVal = parseFloat(tempEl[0].innerHTML);
  if(tempUnit=="f"){
    tempUnit="c";
    // Calculate
    var converted = (tempVal-32)/(9/5);
    // Set
    tempEl[0].innerHTML=converted.toFixed(1);
    $(this).html("C&#176;");
  }else{
    tempUnit="f";
    // Calculate
    var converted = (tempVal*1.8)+32;
    // Set
    tempEl[0].innerHTML=converted.toFixed(1);
    $(this).html("F&#176;");
  }

});
}



});



