// Variables + Important Items
require('dotenv').config();
const fs = require('fs');
const request = require('request');
const keys = require('./keys.js');

//Spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});

// Twitter
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const liriVariable = process.argv[2];

// The Switch Case to determine the actions taken based on the argv entered
switch (liriVariable) {
  case 'my-tweets':
    mytweets();
    break;

  case 'spotify-this-song':
    spotifySong();
    break;

  case 'movie-this':
    movieInfo();
    break;

  case 'do-what-it-says':
    dowhatitsays();
    break;
}

// Tweet Function
function mytweets(params) {
  var params = { screen_name: 'justhayleys' };
  client.get('statuses/user_timeline', params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      console.log(tweets);
    }
  });
}

// Functions
function spotifySong(params) {
  let songName = process.argv[3];
  if (!songName) {
    songName = 'Ace of Base - The Sign ';
  }
  params = songName;
  spotify.search({ type: 'track', query: params }, function(err, data) {
    if (!err) {
      var songInfo = data.tracks.items;

      for (let i = 0; i < 5; i++) {
        if (songInfo[i] != undefined) {
          let spotifyResults =
            '------------- YOUR REQUEST BELOW --------------- ' +
            '\r\n' +
            'Artist: ' +
            songInfo[i].artists[0].name +
            '\r\n' +
            'Song: ' +
            songInfo[i].name +
            '\r\n' +
            'Album the song is from: ' +
            songInfo[i].album.name +
            '\r\n' +
            'Preview Url: ' +
            songInfo[i].preview_url +
            '\r\n' +
            '------------- END OF REQUEST --------------- ' +
            '\r\n';
          console.log(spotifyResults);
        }
      }
    } else {
      console.log('Error :' + err);
      return;
    }
  });
}

function movieInfo(params) {
  // OMDB API KEY
  const omdbKey = keys.omdnAPI.key;
  console.log(`Your key is ${omdbKey}`);

  let movieName = process.argv[3];

  let url =
    'http://www.omdbapi.com/?apikey=' +
    omdbKey +
    '&/?t=' +
    movieName +
    '&y=&plot=short&r=json';
  console.log(url);

  if (!movieName) {
    movieName = 'Mr. Nobody.';
  }
  params = movieName;
  request(
    'http://www.omdbapi.com/?apikey=' +
      omdbKey +
      '&/?t=' +
      movieName +
      '&y=&plot=short&r=json',
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var movieObject = JSON.parse(body);

        var movieResults =
          '------------------------------ begin ------------------------------' +
          '\r\n';
        'Title: ' +
          movieObject.Title +
          '\r\n' +
          'Year: ' +
          movieObject.Year +
          '\r\n' +
          'Imdb Rating: ' +
          movieObject.imdbRating +
          '\r\n' +
          'Country: ' +
          movieObject.Country +
          '\r\n' +
          'Language: ' +
          movieObject.Language +
          '\r\n' +
          'Plot: ' +
          movieObject.Plot +
          '\r\n' +
          'Actors: ' +
          movieObject.Actors +
          '\r\n' +
          '------------------------------ end ------------------------------' +
          '\r\n';
        console.log(movieResults);
      } else {
        console.log('Error :' + error);
        return;
      }
    }
  );
}
