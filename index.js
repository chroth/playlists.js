var unirest = require('unirest');
var Q = require('q');
var async = require('async');

//private:
var playlistEmbedUrl = "https://embed.spotify.com/?uri=spotify:user:[user]:playlist:[playlist_id]";

var _parseSongs = function(embedBody) {
  return embedBody.match(/<li class="track-title[^>]+/ig);
};

var _parseArtists = function(embedBody) {
  return embedBody.match(/<li class="artist[^>]+/ig);
};

var _parseSong = function(songBody) {
  return /class="track-title ([a-z0-9]+)[^"]+" rel="[^ ]+ ([^"]+)"/i.exec(songBody);
};

var _parseArtist = function(artistBody) {
  return /rel="([^"]+)/i.exec(artistBody);
};

var _trackObject = function(artistBody, songBody) {
  var artist = _parseArtist(artistBody);
  var song = _parseSong(songBody);
  return {
    href: song[1],
    song: song[2],
    artist: artist[1]
  };
};

//public:
function Playlists() {}

Playlists.prototype.parse = function(embedBody) {
  var d = Q.defer();
  var songs = _parseSongs(embedBody);
  var artists = _parseArtists(embedBody);

  if (songs.length !== artists.length) {
    throw new Error('Failed to parse artists array');
  }

  async.times(songs.length, 
    function(i, next) {
      next(null, _trackObject(artists[i], songs[i]));
    },
    function(err, tracks) {
      d.resolve(tracks);
    });

  return d.promise;
};

Playlists.prototype.download = function(opts) {
  var d = Q.defer();
  var user = opts.user;
  var playlistId = opts.playlist;
  var playlistUrl = playlistEmbedUrl.replace("[user]", user).replace("[playlist_id]", playlistId);

  unirest.get(playlistUrl)
    .header('User-Agent', 'Mozilla/5.0')
    .end(function(res) {
      if (res.ok) {
        try {
          var tracks = playlists.parse(res.body);
          return d.resolve(tracks);
        } catch(e) {
          return d.resolve(e);
        }
      }

      return d.reject(new Error("Request to Spotify failed"));
    });

  return d.promise;
};

var playlists = (function() {
  return new Playlists();
}());

module.exports = playlists;
