// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
var GistBin;
(function () {
'use strict';


GistBin = function (bin_name) {
  var username = GM_getValue('gistbin_username')
    , key = GM_getValue('gistbin_key')
    ;
  if (!username) {
    username = prompt("GistBin: enter GitHub username:");
    GM_setValue('gistbin_username', username);
  }
  if (!key) {
    key = prompt("GistBin: enter " + username + "'s GitHub key:");
    GM_setValue('gistbin_key', key);
  }
  this.auth_headers = { Authorization: "Basic " + btoa(username + ":" + key) };
  this.username = username;
  this.bin_name = bin_name;
  this.getId();
}

GistBin.clear_credentials = function () {
  GM_deleteValue("gistbin_username");
  GM_deleteValue("gistbin_key");
}

GistBin.prototype.getId = function () {
  if (!this._id) {
    var self = this;
    this._id = $.ajax(
        { method: 'GET'
        , url: 'https://api.github.com/gists'
        , headers: this.auth_headers
        , success: function (gists) {
            self._gists = gists;
          }
        , error: function () {
            console.warn("Failed to get gists:", arguments);
          }
        }
    ).then(function () {
      self._id = null;
      for (let i=0; i < self._gists.length; i++) {
        if (self._gists[i].description == self.bin_name) {
          self._id = self._gists[i].id;
          console.debug("GistBin", self.bin_name, "found ID", self._id);
          break;
        }
      }
      if (!self._id) {
        var dataObj = { description: self.bin_name
                      , public: false
                      , files: {}
                      }
          ;

        dataObj.files[self.bin_name] = { content: "GistBin created " + (new Date()).toISOString() };
        this._id = $.ajax(
            { method: 'POST'
            , url: 'https://api.github.com/gists'
            , headers: this.auth_headers
            , data: JSON.stringify(dataObj)
            , success: function (gist) {
                self._new_gist = gist;
                self._id = gist.id;
                console.debug("GistBin created with ID", self._id);
              }
            , error: function () {
                console.warn("Failed to create gist:", arguments);
              }
            }
          );
      }
    });
  }

  return this._id;
}

GistBin.prototype.save = function (filename, content) {
  var dataObj = { files: {} };

  if (content) {
    dataObj.files[filename] = { content: content };
  } else {
    dataObj.files[filename] = null;
  }
  return $.ajax(
    { method: 'PATCH'
    , url: 'https://api.github.com/gists/' + this.getId()
    , headers: this.auth_headers
    , data: JSON.stringify(dataObj)
    }
  );
}

GistBin.prototype.remove = function (filename) {
  this.save(filename, null);
}

GistBin.prototype.load = function (filename) {
  var self = this
    , promise = new Promise (function (resolve, reject) {
    $.ajax(
      { method: 'GET'
      , url: 'https://api.github.com/gists/' + self.getId()
      , headers: this.auth_headers
      , success: function (gist) { resolve(gist.files[filename].content); }
      , error: function () { reject(arguments); }
      }
    );
  });
  return promise;
}

GistBin.prototype.drop_bin = function () {
  var self = this;
  $.ajax(
    { method: 'DELETE'
    , url: 'https://api.github.com/gists/' + this.getId()
    , headers: this.auth_headers
    , success: function () { console.log("GistBin", self.bin_name, "deleted.", arguments); }
    , error: function () { console.warn("Unable to delete GistBin.", arguments); }
    }
  );
}

})();
