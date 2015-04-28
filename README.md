# PLAYLISTS.JS

A Spotify playlists downloader and parser. Takes an object with a user and a playlist id and returns a list of tracks. Also accepts an array

## Installation

npm install playlistsjs -S

## Usage

```javascript
var playlists = require('playlistsjs');

playlists
    .download({user: "christofer.roth", playlist: "5TX2BIzygS5HPP2ySb2OED"})
    .then(function(tracks) {
      console.log(tracks);
    })
    .catch(function(error) {
      console.log(error);
    })
    .done();

playlists
    .download([{user: "christofer.roth", playlist: "2Ts7BsCckracyNBTV5AQzX"}, {user: "christofer.roth", playlist: "5TX2BIzygS5HPP2ySb2OED"}])
    .then(function(playlists) {
      console.log(playlists);
    })
    .catch(function(error) {
      console.log(error);
    })
    .done();
```
