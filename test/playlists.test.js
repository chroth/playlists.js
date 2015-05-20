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
        .then(function(playlist) {
          playlist.id.should.eql("5TX2BIzygS5HPP2ySb2OED")
          playlist.user.should.eql("christofer.roth")
          playlist.tracks.length.should.be.exactly(10);
          playlist.tracks[0].href.should.eql("76b8ipYsNb9zPhliPfWqkn");
          playlist.tracks[0].artist.should.eql("Love");
          playlist.tracks[0].song.should.eql("A House Is Not A Motel");
          playlist.tracks[0].duration.should.eql(211693);
          playlist.tracks[9].href.should.eql("6vTZGECwpTLkgAdnfCgXwW");
          playlist.tracks[9].artist.should.eql("Neil Young");
          playlist.tracks[9].song.should.eql("On The Beach - Remastered");
          playlist.tracks[9].duration.should.eql(419306);
          done();
        })
        .catch(function(err) {
          done(err);
        })
        .done();
    });

    it("should download all playlists in array and parse them", function(done) {
      playlists
        .download([
          {user: "christofer.roth", playlist: "5TX2BIzygS5HPP2ySb2OED"},
          {user: "christofer.roth", playlist: "2Ts7BsCckracyNBTV5AQzX"},
        ])
        .then(function(playlists) {
          playlists.length.should.be.exactly(2);

          playlists[0].id.should.eql("5TX2BIzygS5HPP2ySb2OED")
          playlists[0].user.should.eql("christofer.roth")

          playlists[1].id.should.eql("2Ts7BsCckracyNBTV5AQzX")
          playlists[1].user.should.eql("christofer.roth")

          var tracks = playlists[0].tracks;
          var tracks2 = playlists[1].tracks;

          tracks.length.should.be.exactly(10);
          tracks[0].href.should.eql("76b8ipYsNb9zPhliPfWqkn");
          tracks[0].artist.should.eql("Love");
          tracks[0].song.should.eql("A House Is Not A Motel");
          tracks[9].href.should.eql("6vTZGECwpTLkgAdnfCgXwW");
          tracks[9].artist.should.eql("Neil Young");
          tracks[9].song.should.eql("On The Beach - Remastered");

          tracks2.length.should.be.exactly(8);
          tracks2[0].href.should.eql("4IcTpvoM4dXXEIRtHFnRlj");
          tracks2[0].artist.should.eql("Love");
          tracks2[0].song.should.eql("Maybe The People Would Be The Times Or Between Clark And Hilldale");
          tracks2[7].href.should.eql("2bbmdWor8U0QVHxLiwo4SP");
          tracks2[7].artist.should.eql("Blaze Foley");
          tracks2[7].song.should.eql("Clay Pigeons");

          done();
        })
        .catch(function(err) {
          done(err);
        })
        .done();
    });

    it("should throw error if incorrect playlist id", function(done) {
      playlists
        .download({user: "christofer.roth", playlist: "rRrrrrrrrS5HPP2ySb2OED"})
        .catch(function(err) {
          err.message.should.eql('Failed to parse playlist');
          done();
        })
        .done();
    });

  });

  describe(".parse", function() {
    it("should parse a playlist and return tracks", function(done) {
      var tracks = playlists
        .parse(fixture["5TX2BIzygS5HPP2ySb2OED.html"])
        .then(function(tracks) {
          tracks.length.should.be.exactly(10);
          tracks[0].href.should.eql("76b8ipYsNb9zPhliPfWqkn");
          tracks[0].artist.should.eql("Love");
          tracks[0].song.should.eql("A House Is Not A Motel");
          tracks[0].duration.should.eql(211693);
          tracks[1].artist.should.eql("Jackie O Motherfucker");
          tracks[1].song.should.eql("Hey! Mr. Sky");
          tracks[2].artist.should.eql("Margo Guryan");
          tracks[2].song.should.eql("Sunday Morning");
          tracks[3].artist.should.eql("\"Canned\" Heat");
          tracks[3].song.should.eql("\"Poor\" Moon - 2005 Digital Remaster");
          tracks[8].href.should.eql("1vHqkvJuwJf22NH6i0czCH");
          tracks[8].artist.should.eql("Angels Of Light");
          tracks[8].song.should.eql("Untitled > Love Song");
          tracks[8].duration.should.eql(294493);
          tracks[9].artist.should.eql("Angels Of Light");
          tracks[9].song.should.eql("");
          tracks[9].duration.should.eql(294493);
          done();
        })
        .catch(function(err) {
          done(err);
        })
        .done();
    });

  });

});
