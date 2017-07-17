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


//**************************************************Functions****************************************************
switch (input) {
	case "my-tweets" : myTweets(); 
	break;

	case "movie-this" : movieThis();
	break;

	//case "spotify-this-song": spotifyThisSong(); 
	//break;

	case "do-what-it-says": doWhatItSays(); 
	break;
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

			}

	     	console.log(

	     		"Title of the movie: " + movieObject.Title + "\r\n" +

	     		"Year the movie came out: " + movieObject.Released + "\r\n" +

 	    			"IMDB rating of the movie: " + movieObject.imdbRating
 	    		);

			for (var i = 0; i < movieObject.Ratings.length; i++){ 
   			

				if ( movieObject.Ratings[i].Source == "Rotten Tomatoes") {
					console.log("Rotten Tomatoes Rating: " + movieObject.Ratings[i].Value);
				}

 	     	}

		}

		console.log(

			"Country where the movie was produced: " + movieObject.Country + "\r\n" +

			"Language of the movie: " + movieObject.Language + "\r\n" +

			"Plot of the movie: " + movieObject.Plot + "\r\n" +

			"Actors in the movie: " + movieObject.Actors

		);

	// End request function
	});
// End movieThis function
}

function doWhatItSays(){

	var clientId = neededKeys.spotifyKeys.client_id;

	var clientSecret = neededKeys.spotifyKeys.client_secret;

	var spotify = new spotifyApi({
		id: clientId,
		secret: clientSecret
	});

	fs.readFile("random.txt", "utf8", function(error, data){

		if (error) {
			return console.log(error);
			}


			var readFileArr = data.split(",");

			//console.log(readFileArr[1]);

			songName = readFileArr[1];


			spotify.search({type: 'track' , query: songName}, function(error,data,response){

			console.log(

				"Artist name: " + data.tracks.items[0].album.artists[0].name + "\r\n" + 

				"Song Name: " + songName + "\r\n" +

				"Preview Link: " +  data.tracks.items[0].href + "\r\n" +

				"Album Name: " + data.tracks.items[0].album.name

			);
		});


	});

// End spotifyThisSong
}





