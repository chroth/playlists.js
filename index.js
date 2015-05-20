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

var _parseDurations = function(embedBody) {
  return embedBody.match(/ data-duration-ms="(\d+)/ig);
};

var _parseSong = function(songBody) {
  return /class="track-title ([a-z0-9]+)[^"]+" rel="[^ ]+(.+)">/i.exec(songBody);
};

var _parseArtist = function(artistBody) {
  return /rel="(.*)" style=/i.exec(artistBody);
};

var _parseDuration = function(duration) {
  return parseInt(duration.substr(19), 10);
};

var _trackObject = function(artistBody, songBody, durationString) {
  var artist = _parseArtist(artistBody);
  var song = _parseSong(songBody);
  var duration = _parseDuration(durationString);
  return {
    href: song[1],
    song: song[2].trim(),
    artist: artist[1],
    duration: duration,
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
            })
            .done();
          })
          .catch(function(err) {
            d.reject(err);
          })
          .done();
      }

      return d.reject(new Error("Request to Spotify failed"));
    });

  return d.promise;
}

function _downloadAll(playlists) {
  var d = Q.defer();

  async.mapLimit(playlists, 5, function(playlist, next) {
    _download(playlist)
      .then(function(data) { next(null, data); })
      .catch(next)
      .done();
  },
  function(errs, results) {
    if (errs) return d.reject(errs);
    d.resolve(results);
  });

  return d.promise;
}

//public:
function Playlists() {}

Playlists.prototype.parse = function(embedBody) {
  var d = Q.defer();
  var songs = _parseSongs(embedBody);
  var artists = _parseArtists(embedBody);
  var durations = _parseDurations(embedBody);

  if (!songs || !artists || !durations || songs.length !== artists.length || songs.length !== durations.length) {
    d.reject(new Error('Failed to parse playlist'));
  }
  else {
    async.times(songs.length, 
      function(i, next) {
        next(null, _trackObject(artists[i], songs[i], durations[i]));
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
