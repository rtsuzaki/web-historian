var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var urlParser = require('url');
var scrape = require('website-scraper');
var requestServer = require('../web/request-handler');
const http = require('http');

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
  fs.readFile(this.paths.list, 'utf8', (error, data) => {
    if (error) {
      console.log('error', error);
      return;
    } else {
      var urlArray = data.split('\n');
      urlArray.filter(url => url.length);
      callback(urlArray);
    }
  });
};

exports.isUrlInList = function(url, callback) {

  var result = false;
  console.log('url', url);
  this.readListOfUrls(function(urlArray) {
    if (urlArray.includes(url)) {
      result = true;
    }
    callback(result);
  });
  
};

exports.addUrlToList = function(url, callback) {
  var archive = this;
  this.isUrlInList(url, function(result) {
    if (result) {
      //then url is already in list so don't need to add.
    } else {
      fs.appendFile(archive.paths.list, url, (err) => {
        if (err) {
          return;
        } else {
          console.log('The url was appended to the list');
          callback(result);
        }
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {

  // var parsedHost = urlParser.parse(url, false);

  // parsedHost = ((parsedHost.path).split('.'))[1];
  // parsedHost = parsedHost.path;
  // console.log('parsedHost', parsedHost);
  var hostPath = this.paths.archivedSites + '/' + url;
  console.log(hostPath);
  var result = false;
  fs.access(hostPath, (err) => {
    if (err) {
      // TODO: how to handle errors?
      console.log('isUrlArchived#error', err);
      callback(result);
    } else {
      result = true;
      console.log(result);
      callback(result);
    }
  });
};

exports.downloadUrls = function(urls) {
  // for each url
  // do a get request & store the response as a file at ../archive/url
  if(urls !== null && urls.length > 0) {
    urls.forEach(function(url) {
      http.get('http://' + url, (resp) => {
        resp.setEncoding('utf8');
        let rawData = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          rawData += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          //console.log(JSON.parse(data).explanation);
          //console.log(JSON.parse(data));
          try {
            const parsedData = JSON.parse(rawData);
            console.log('downloadUrls received:', parsedData);
          } catch (e) {
            console.error(`downloadUrls Got error on END: ${e.message}`);
          }
        });

        resp.on("error", (err) => {
          //console.log("Error: " + err.message);
          console.error(`downloadUrls Got error: ${e.message}`);
        });
      });
    });
  }

  // var thisUrls = urls;
  // var options = {
  //   urls: thisUrls,
  //   directory: this.paths.archivedSites,
  // };

  // scrape(options).then((result) => {
  //   //this.addWebsiteToArchive(result);
  //   console.log('downloadUrls downloading result:', result);
  // }).catch((err) => {
  //   console.log('downloadUrls#err', err);
  // });
  // scrape({
  //   urls: [urls],
  //   urlFilter: function(url){
  //     return url.indexOf('http://example.com') === 0;
  //   },
  //   directory: this.paths.archivedSites + '/'
  // }).then(console.log).catch(console.log);
};

exports.addWebsiteToArchive = function(archive) {
  
}

exports.getFromArchive = function(url) {};