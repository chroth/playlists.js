# PLAYLISTS.JS

A Spotify playlists downloader and parser. Takes a user and a playlist id and returns a list of tracks.

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
```
