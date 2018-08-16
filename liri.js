// Variables + Important Items
require("dotenv").config();
const fs = require("fs");
const request = require("request");
const keys = require("./keys.js");

//Spotify
let Spotify = require("node-spotify-api");
let spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// Twitter
let Twitter = require("twitter");
let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

runLiriBot(process.argv[2], process.argv[3]);

function runLiriBot(liriAction, liriValue) {
  // The Switch Case to determine the actions taken based on the argv entered
  switch (liriAction) {
    case "my-tweets":
      mytweets();
      break;

    case "spotify-this-song":
      spotifySong(liriValue);
      break;

    case "movie-this":
      movieInfo(liriValue);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;
  }
}

// Tweet Function
function mytweets() {
  let params = { screen_name: "@captain_code67", count: 20 };
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log(`You've tweeted:`);
      tweets.forEach(tweet => {
        console.log(
          `Tweet: ${tweet.text}  \r\n Created at: ${tweet.created_at}`
        );
        console.log(`------------`);
      });
    }
  });
}

// Spotify Function
function spotifySong(songName = "Ace of Base - The Sign ") {
  spotify.search({ type: "track", query: songName, limit: 1 }, function(
    err,
    data
  ) {
    if (!err) {
      var songInfo = data.tracks.items;

      for (let i = 0; i < 2; i++) {
        if (songInfo[i] != undefined) {
          let spotifyResults =
            "Here is the snashot about your song:  " +
            "\r\n" +
            "Artist: " +
            songInfo[i].artists[0].name +
            "\r\n" +
            "Song: " +
            songInfo[i].name +
            "\r\n" +
            "Album the song is from: " +
            songInfo[i].album.name +
            "\r\n" +
            "Wanna listen? Preview Url: " +
            songInfo[i].preview_url +
            "\r\n";
          console.log(spotifyResults);
        }
      }
    } else {
      console.log("Error :" + err);
      return;
    }
  });
}

function movieInfo(movieName = "Mr+Nobody") {
  // OMDB API KEY
  const omdbKey = keys.omdnAPI.key;

  let url =
    "https://www.omdbapi.com/?t=" +
    movieName +
    "&y=&plot=short&r=json&apikey=" +
    omdbKey;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let movieObject = JSON.parse(body);

      console.log("The movie you requested:");

      let movieResult =
        "Movie Title: " +
        movieObject.Title +
        "\r\n" +
        "Year: " +
        movieObject.Year +
        "\r\n" +
        "Imdb Rating: " +
        movieObject.imdbRating +
        "\r\n" +
        "Country: " +
        movieObject.Country +
        "\r\n" +
        "Language: " +
        movieObject.Language +
        "\r\n" +
        "The Plot: " +
        movieObject.Plot +
        "\r\n" +
        "Cast: " +
        movieObject.Actors +
        "\r\n" +
        "Did you know: Hayley thinks " +
        movieObject.Title +
        " was a good movie";

      console.log(movieResult);
    } else {
      console.log("Error :" + error);
      return;
    }
  });
}

// do-what-it-says Function

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    let dataArr = data.split(",");
    let liriAction = dataArr[0];
    let liriValue = dataArr[1];

    runLiriBot(liriAction, liriValue);
  });
}
