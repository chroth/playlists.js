var testHelper = require("./test-helper");
var should = require("should");
var playlists = require("../index");

describe("playlists", function() {
  var fixture = {};

  before(function(done) {
    testHelper.loadFixtures(function(err, results) {
      if (err) return done(err);
      fixture = results;
      done();
    });
  });

  describe(".download", function() {
    it("should download a playlist and parse it", function(done) {
      playlists
        .download({user: "christofer.roth", playlist: "5TX2BIzygS5HPP2ySb2OED"})
        .then(function(tracks) {
          tracks.length.should.be.exactly(10);
          tracks[0].href.should.eql("76b8ipYsNb9zPhliPfWqkn");
          tracks[0].artist.should.eql("Love");
          tracks[0].song.should.eql("A House Is Not A Motel");
          tracks[9].href.should.eql("6vTZGECwpTLkgAdnfCgXwW");
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
        .parse(fixture["5TX2BIzygS5HPP2ySb2OED.html"])
        .then(function(tracks) {
          tracks.length.should.be.exactly(9);
          tracks[0].href.should.eql("76b8ipYsNb9zPhliPfWqkn");
          tracks[0].artist.should.eql("Love");
          tracks[0].song.should.eql("A House Is Not A Motel");
          tracks[1].artist.should.eql("Jackie O Motherfucker");
          tracks[1].song.should.eql("Hey! Mr. Sky");
          tracks[2].artist.should.eql("Margo Guryan");
          tracks[2].song.should.eql("Sunday Morning");
          tracks[3].artist.should.eql("Canned Heat");
          tracks[3].song.should.eql("Poor Moon - 2005 Digital Remaster");
          tracks[8].href.should.eql("1vHqkvJuwJf22NH6i0czCH");
          tracks[8].artist.should.eql("Angels Of Light");
          tracks[8].song.should.eql("Untitled Love Song");
          done();
        })
        .catch(function(err) {
          done(err);
        })
        .done();
    });

  });

});
