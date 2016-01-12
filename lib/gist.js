var GistBin;
(function () {
'use strict';

var key = '...'
  , ajaxSettings =
    { headers:
      { Authorization: "Basic " + btoa("glennimoss:" + key)
      }
    }
  ;

GistBin = function (username, key, bin_name) {
  this.ajaxSettings =
    { headers:
      { Authorization: "Basic " + btoa(username + ":" + key)
      }
    }
  ;
  this.username = username;
  this.bin_name = bin_name;
}

GistBin.prototype.getId = function () {
  if (!this._id) {
    $.ajax($.extend(
        { method: 'GET'
        , url: 'https://api.github.com/users/' + this.username + '/gists'
        , success: function (gists) {
            for (let i=0; i < gists.length; i++) {
              if (gists[i].description = this.bin_name) {
                this._id = gists[i].id;
                break;
              }
            }
          }
        },
        this.ajaxSettings
    ));
  }

  return this._id;
}

GistBin.prototype.save = function (filename, content) {
  var dataObj = { files: {} };

  dataObj.files[filename] = { content: content };
  $.ajax($.extend(
    { method: 'PATCH'
    , url: 'https://api.github.com/gists/' + this.getId()
    , data: JSON.stringify(dataObj)
    , success: function (r) { console.log(r); }
    , complete: function () { console.log("complete:", arguments); }
    },
    this.ajaxSettings
  ));
}

GistBin.prototype.load = function (filename, cb) {
  return $.ajax($.extend(
      { method: 'GET'
      , url: 'https://api.github.com//gists/' + this.getId()
      , success: function (gist) { cb(gist.files[filename].content); }
      },
      this.ajaxSettings
  ));
}
})();
