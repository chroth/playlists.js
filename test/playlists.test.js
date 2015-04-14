var path = require("path");
var fs = require("fs");
var should = require("should");
var playlists = require("../index");

describe("playlists", function() {
  var fixture = {};

  before(function(done) {
    var fixturesDir = path.join(__dirname, "fixtures");

    fs.readdir(fixturesDir, function(err, files) {
      if (err) done(err);

      var numberOfFiles = files.length;
      var filesIndex = 0;
      files.forEach(function(filename) {
        fs.readFile(path.join(fixturesDir, filename), function(err, contents) {
          fixture[filename] = contents.toString();
          filesIndex++;
          if (filesIndex === numberOfFiles) {
            return done();
          }
        });
      });
    })
  });

  describe(".download", function() {
    it("should download a playlist and parse it", function(done) {
      playlists
        .download({user: "christofer.roth", playlist: "5TX2BIzygS5HPP2ySb2OED"})
        .then(function(tracks) {
          tracks.length.should.be.exactly(10);
          tracks[0].artist.should.eql("Love");
          tracks[0].song.should.eql("A House Is Not A Motel");
          tracks[9].artist.should.eql("Neil Young");
          tracks[9].song.should.eql("On The Beach - Remastered");
          done();
        })
        .catch(function(err) {
          done(err);
        })
        .done();
    });

  });

  describe(".parse", function() {
    it("should parse a playlist and return tracks", function(done) {
      var tracks = playlists
        .parse(fixture["5TX2BIzygS5HPP2ySb2OED.html"]);

      tracks.length.should.be.exactly(10);
      tracks[0].artist.should.eql("Love");
      tracks[0].song.should.eql("A House Is Not A Motel");
      tracks[1].artist.should.eql("Jackie O Motherfucker");
      tracks[1].song.should.eql("Hey! Mr. Sky");
      tracks[2].artist.should.eql("Margo Guryan");
      tracks[2].song.should.eql("Sunday Morning");
      tracks[3].artist.should.eql("Canned Heat");
      tracks[3].song.should.eql("Poor Moon - 2005 Digital Remaster");
      tracks[9].artist.should.eql("Neil Young");
      tracks[9].song.should.eql("On The Beach - Remastered");
      done();
    });

  });

});
