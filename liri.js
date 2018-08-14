require('dotenv').config();

var request = require('request');

const keys = require('./keys.js');

const spotifyKeys = keys.spotify;
const client = keys.twitter;

switch (process.argv[2]) {
  case 'my-tweets':
    mytweets();
    break;

  case 'spotify-this-song':
    sopifySong();
    break;

  case 'movie-this':
    movieInfo();
    break;

  case 'do-what-it-says':
    dowhatitsays();
    break;
}

console.log(spotifyKeys.id);
