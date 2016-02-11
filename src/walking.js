var fs = require('fs');
var path = require('path');
var util = require('util');

var EX_FOLDER = ['node_modules', 'bower_components', 'vendors', 'vendor'];

function File(options) {
  this.size = options.size;
  this.ext = options.ext;
}

var walking = function walking(dirName, done) {
  var results = [];
  fs.readdir(dirName, function(err, list) {
    if (err) return done(err);
    var l = list.length;
    if (!l) return done(null, results);
    list.forEach(function(fileName) {
      if (!~EX_FOLDER.indexOf(fileName)) {
        var filePath = path.resolve(dirName, fileName);
        fs.stat(filePath, function(err, stat) {
          if (err) {
            if (!--l) done(null, results);
            return;
          }
          if (stat && stat.isDirectory()) {
            walking(filePath, function(err, res) {
              results = results.concat(res);
              if (!--l) done(null, results);
            });
          } else {
            results.push(new File({
              size: stat.size,
              ext: path.extname(fileName)
            }));
            if (!--l) done(null, results);
          }
        });
      } else {
        if (!--l) done(null, results);
      }
    });
  });
};

module.exports = walking;
