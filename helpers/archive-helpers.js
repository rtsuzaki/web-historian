var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var urlParser = require('url');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
// exports.siteList = '';

exports.readListOfUrls = function(callback) {
  // fs.readFile(this.paths.list, 'utf8', (error, data) => {
  //   if (error) console.log('error', error);
  //   console.log(JSON.stringify(data));
  // });
  // fs.readFile(this.paths.list, 'utf8', callback => {
  //   if (error) console.log('error', error);
  //   console.log(JSON.stringify(data));
  // });
  fs.readFile(this.paths.list, 'utf8', callback);
};

exports.isUrlInList = function(url, callback) {
  // call readlistOfUrls using 'callback' that will return file in memory
  // var data = '';
  // var error = '';
  var readListOfUrlsCallback = function(error, data) {
    if(error) {
      console.log('error reading list file', error);
      //return error;
    } else {
      console.log('(list) data', data);
      // return data;
    }
  };

  // this.readListOfUrls(readListOfUrlsCallback(error, data));
  // console.log('--- data', data);
  // console.log('--- error', error);
  this.readListOfUrls(readListOfUrlsCallback);

// console.log('this.siteList', this.siteList); // happens b/f readListOfUrls finishes

  // have to search returned file in memory for 'url'
  // if it exists, set it on the callback
  // else set null on callback
};

exports.addUrlToList = function(url, callback) {
};

exports.isUrlArchived = function(url, callback) {
// console.log('url',url);
//   var parsedHost = urlParser.parse(url,true);
// console.log('parsedHost',parsedHost);
//   // parsedHost = parsedHost.host;
// console.log('parsedHost.hostname',parsedHost.hostname);

//   var hostPath = this.paths.archivedSites + '/' + parsedHost;
  var hostPath = urlParser.parse(url).pathname
console.log('hostPath', hostPath);

  fs.access(hostPath, fs.constants.F_OK, (callback) => {
    console.log(`${hostPath} ${callback ? false : true}`);  
  });
};

exports.downloadUrls = function(urls) {
};

exports.getFromArchive = function(url) {}
