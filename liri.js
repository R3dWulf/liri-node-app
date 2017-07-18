//***********************************************Global Variables**************************************************
// File System
var fs = require("fs");

//Twitter
var Twitter = require("twitter");

var neededKeys = require("./keys.js");

//IMDB
var request = require("request");

//Spotify
var spotify = require ("spotify");

var spotifyApi = require('node-spotify-api');

//Grab user input
var input = process.argv[2]; 

var songName = "";

var noSong = "";

var doWhat = false


//**************************************************Functions****************************************************
	switch (input) {
		case "my-tweets" : myTweets(); 
		break;

		case "movie-this" : movieThis();
		break;

		case "spotify-this-song": spotifyThisSong(); 
		break;

		case "do-what-it-says": doWhatItSays(); 
		break;

		default: console.log("\r\n" +"Try one of the following commands after 'node liri.js'" +"\r\n"+
				"1. my-tweets, 'to see my latest tweets'" +"\r\n"+
				"2. spotify-this-song + 'any song name here' "+"\r\n"+
				"3. movie-this + 'any movie name here' "+"\r\n"+
				"4. do-what-it-says."+"\r\n"
				);
	}

//Pull 20 tweets from twitter
function myTweets() {

	var params = {screen_name: "AkaiOkami", count: 20 };

	var client = new Twitter(neededKeys.twitterKeys);

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (!error) {
	     	//will need a for loop
	     	for (var i = 0; i < tweets.length; i++){
	    	    		console.log(tweets[i].text);
	    	    		log(tweets[i].text);
	     	}
		}
	});
}

//Pull info from movie title if the movie command is given
function movieThis(){

	var movieName = "";

	var movieTitle = process.argv;

	var noMovie = process.argv[3];

	for ( var i = 3; i < movieTitle.length; i++ ) {	

		if ( i > 3 && i < movieTitle.length) {

			//movieParamsName = movieParamsName + "+" + movieTitle[i];
			movieName = movieName + " " + movieTitle[i];

		}

		else {

		 	//movieParamsName += movieTitle[i];

		 	movieName += movieTitle[i];

		}

	} 

	if ( !noMovie ) {

		movieName = "Mr Nobody";
	}


	var params = movieName;

	var queryUrl = "http://www.omdbapi.com/?t=" + params + "&y=&plot=short&apikey=40e9cece";


	request(queryUrl, function (error, response, body) {


		//Check to see if a movie has a Rotten Tomatoes Rating and display it since older movies do not have them. 
		if (!error && response.statusCode == 200) {

			var movieObject = JSON.parse(body);

			if (movieObject.Title == "Mr. Nobody"){

				console.log(

					"If you have not seen Mr Nobody, you should," + "\r\n" +

					"its on Netflix and can be found on IMBd here: http://www.imdb.com/title/tt0485947/"

				);

				var mrNobodyLog = 

					"If you have not seen Mr Nobody, you should," + "\r\n" +

					"its on Netflix and can be found on IMBd here: http://www.imdb.com/title/tt0485947/";

				log(mrNobodyLog);

			}


	     	console.log(

	     		"Title of the movie: " + movieObject.Title + "\r\n" +

	     		"Year the movie came out: " + movieObject.Released + "\r\n" +

 	    			"IMDB rating of the movie: " + movieObject.imdbRating
 	    		);

 	    		var moviePart1Log = 

	     		"Title of the movie: " + movieObject.Title + "\r\n" +

	     		"Year the movie came out: " + movieObject.Released + "\r\n" +

 	    			"IMDB rating of the movie: " + movieObject.imdbRating;

 	    		log(moviePart1Log);

			for (var i = 0; i < movieObject.Ratings.length; i++){ 
   			

				if ( movieObject.Ratings[i].Source == "Rotten Tomatoes") {

					console.log("Rotten Tomatoes Rating: " + movieObject.Ratings[i].Value);

					var rottenTomatoesLog = "Rotten Tomatoes Rating: " + movieObject.Ratings[i].Value;

					log(rottenTomatoesLog);
				}

 	     	}

		}

		console.log(

			"Country where the movie was produced: " + movieObject.Country + "\r\n" +

			"Language of the movie: " + movieObject.Language + "\r\n" +

			"Plot of the movie: " + movieObject.Plot + "\r\n" +

			"Actors in the movie: " + movieObject.Actors

		);

		var moviePart2Log = 

			"Country where the movie was produced: " + movieObject.Country + "\r\n" +

			"Language of the movie: " + movieObject.Language + "\r\n" +

			"Plot of the movie: " + movieObject.Plot + "\r\n" +

			"Actors in the movie: " + movieObject.Actors;

			log(moviePart2Log);

	// End request function
	});
// End movieThis function
}


function spotifyThisSong(){

	var clientId = neededKeys.spotifyKeys.client_id;

	var clientSecret = neededKeys.spotifyKeys.client_secret;

	var spotify = new spotifyApi({
		id: clientId,
		secret: clientSecret
	});

	var songTitle = process.argv;

	if ( doWhat === false ){

		var noSong = process.argv[3];

	} 


	for ( var i = 3; i < songTitle.length; i++ ) {	

		if ( i > 3 && i < songTitle.length) {

			//movieParamsName = movieParamsName + "+" + movieTitle[i];
			songName = songName + " " + songTitle[i];

		}

		else {

		 	//movieParamsName += movieTitle[i];

		 	songName += songTitle[i];

		}

	} 

	if ( !noSong ) {

		songName = "The Sign";
	}

	spotify.search({type: 'track' , query: songName}, function(error,data,response){

			var info = 

				"Artist name: " + data.tracks.items[0].album.artists[0].name + "\r\n" + 

				"Song Name: " + songName + "\r\n" +

				"Preview Link: " +  data.tracks.items[0].href + "\r\n" +

				"Album Name: " + data.tracks.items[0].album.name

			console.log(info);

			log(info);

	});



}


function doWhatItSays(){

	doWhat = true;

	fs.readFile("random.txt", "utf8", function(error, data){

		if (error) {
			return console.log(error);
		}

		var results = data.split(",");

		var songName =  results[1].replace(/"/g, "");


		var clientId = neededKeys.spotifyKeys.client_id;

		var clientSecret = neededKeys.spotifyKeys.client_secret;

		var spotify = new spotifyApi({
			id: clientId,
			secret: clientSecret
		});

		spotify.search({type: 'track' , query: songName}, function(error,data,response){

				var info = 

					"Artist name: " + data.tracks.items[0].album.artists[0].name + "\r\n" + 

					"Song Name: " + songName + "\r\n" +

					"Preview Link: " +  data.tracks.items[0].href + "\r\n" +

					"Album Name: " + data.tracks.items[0].album.name

				console.log(info);

				log(info);

		});

	});

// End doWhatItSays
}

function log(data){

	var logData = "\r\n"+data;

	fs.appendFile("log.txt", logData, function(err) {
	  if (err) {
	    return console.log(err);
	  }

	});
}