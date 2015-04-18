var path = require("path");
var fs = require("fs");

var testHelper = {
  loadFixtures: function(done) {
    var fixture = {};
    var fixturesDir = path.join(__dirname, "fixtures");

    fs.readdir(fixturesDir, function(err, files) {
      if (err) return done(err);

      var numberOfFiles = files.length;
      var filesIndex = 0;
      files.forEach(function(filename) {
        fs.readFile(path.join(fixturesDir, filename), function(err, contents) {
          if (err) return done(err);

          fixture[filename] = contents.toString();
          filesIndex++;
          if (filesIndex === numberOfFiles) {
            return done(null, fixture);
          }
        });
      });
    })
  }
};

module.exports = testHelper;
