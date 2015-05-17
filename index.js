var unirest = require('unirest');
var Q = require('q');
var async = require('async');

//private:
var playlistEmbedUrl = "https://embed.spotify.com/?uri=spotify:user:[user]:playlist:[playlist_id]";

var _parseSongs = function(embedBody) {
  return embedBody.match(/<li class="track-title.+">/ig);
};

var _parseArtists = function(embedBody) {
  return embedBody.match(/<li class="artist.+">/ig);
};

var _parseSong = function(songBody) {
  return /class="track-title ([a-z0-9]+)[^"]+" rel="[^ ]+ (.+)">/i.exec(songBody);
};

var _parseArtist = function(artistBody) {
  return /rel="(.+)" style=/i.exec(artistBody);
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

var _download = function(playlist) {
  var d = Q.defer();
  var user = playlist.user;
  var playlistId = playlist.playlist;
  var playlistUrl = playlistEmbedUrl.replace("[user]", user).replace("[playlist_id]", playlistId);

  unirest.get(playlistUrl)
    .header('User-Agent', 'Mozilla/5.0')
    .end(function(res) {
      if (res.ok) {
        return playlists.parse(res.body)
          .then(function(tracks) {
            return d.resolve({
              id: playlistId,
              user: user,
              tracks: tracks
            });
          })
          .catch(function(err) {
            d.reject(err);
          });
      }

      return d.reject(new Error("Request to Spotify failed"));
    });

  return d.promise;
}

function _downloadAll(playlists) {
  var results = [];
  var d = Q.defer();

  var que = async.queue(function(playlist, next) {
    _download(playlist)
      .then(function(data) {
        results[playlist.index] = data;
        next();
      })
      .catch(function(err) {
        results[playlist.index] = err;
        next();
      });
  }, 5);

  que.drain = function() {
    d.resolve(results);
  }

  for (var i=0; i < playlists.length; i++)
    playlists[i].index = i;

  que.push(playlists);

  return d.promise;
}

//public:
function Playlists() {}

Playlists.prototype.parse = function(embedBody) {
  var d = Q.defer();
  var songs = _parseSongs(embedBody);
  var artists = _parseArtists(embedBody);

  if (!songs || !artists || songs.length !== artists.length) {
    d.reject(new Error('Failed to parse playlist'));
  }
  else {
    async.times(songs.length, 
      function(i, next) {
        next(null, _trackObject(artists[i], songs[i]));
      },
      function(err, tracks) {
        d.resolve(tracks);
      });
  }

  return d.promise;
};

Playlists.prototype.download = function(opts) {
  if (Array.isArray(opts)) {
    return _downloadAll(opts);
  } else {
    return _download(opts);
  }
};

var playlists = (function() {
  return new Playlists();
}());

module.exports = playlists;
