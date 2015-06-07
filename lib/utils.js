
'use strict';

// Dependencies:
var request = require('request');

exports.loadURL = function(url, handler) {

  request(url, function(error, response, body) {

    if (error || 200 !== response.statusCode) {
      handler();
    } else {
      handler(body);
    }

  });

};

/* exports.loadURL = function (url, cb) {
    if (!cb) return this.throw("Missing callback to loadURL.");
    var self = this;
    sua.get(url)
        .set("User-Agent", "Specberus/" + version + " Node/" + process.version + " by sexy Robin")
        .end(function (err, res) {
            if (err) return self.throw(err.message);
            if (!res.text) return self.throw("Body of " + url + " is empty.");
            self.url = url;
            self.loadSource(res.text, cb);
        });
};

exports.loadSource = function (src, cb) {
    if (!cb) return this.throw("Missing callback to loadSource.");
    this.source = src;
    var $;
    try {
        $ = whacko.load(src);
    }
    catch (e) {
        this.throw("Whacko failed to parse source: " + e);
    }
    cb(null, $);
};

exports.loadFile = function (file, cb) {
    if (!cb) return this.throw("Missing callback to loadFile.");
    var self = this;
    fs.exists(file, function (exists) {
        if (!exists) return cb("File '" + file + "' not found.");
        fs.readFile(file, { encoding: "utf8" }, function (err, src) {
            if (err) return cb(err);
            self.loadSource(src, cb);
        });
    });
};

exports.loadDocument = function (doc, cb) {
    if (!cb) return this.throw("Missing callback to loadDocument.");
    if (!doc) return cb("No document.");
    cb(null, function (selector, context) { return whacko(selector, context, doc); });
}; */

