var playlists = require('../index');

playlists
    .download({user: "christofer.roth", playlist: "5TX2BIzygS5HPP2ySb2OED"})
    .then(function(playlist) {
      console.log(playlist);
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
