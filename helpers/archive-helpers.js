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
  console.log('addUrlToList url', url);
  var archive = this;
  this.isUrlInList(url, function(result) {
    if (result) {
      console.log('The url is already in list');
    } else {
      fs.appendFile(archive.paths.list, url, (err) => {
        if (err) {
          callback(err);
        } else {
          console.log('The url was appended to the list');
          callback(result);
        }
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {

  var hostPath = this.paths.archivedSites + '/' + url;

  var result = false;
  fs.access(hostPath, (err) => {
    if (err) {
      // TODO: how to handle errors?
      console.error('isUrlArchived#error', err);
      // console.log('line86', callback)
      callback(result);
    } else {
      result = true;
      console.log(result);
      callback(result);
    }
  });
};

exports.downloadUrls = function(urls) {
  var thisVar = this;
  if (urls !== null && urls.length > 0) {
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
          try {
            thisVar.addWebsiteToArchive({ siteUrl: url, html: rawData });
          } catch (e) {
            console.error(`downloadUrls Got error on END: ${e.message}`);
          }
        });

        resp.on('error', (err) => {
          //console.log("Error: " + err.message);
          console.error(`downloadUrls Got error: ${e.message}`);
        });
      });
    });
  }
};

// 'archive' will be { siteUrl: url, html: rawData }
exports.addWebsiteToArchive = function(archive) {
  // receives:
  // {"siteUrl":"www.google.com","html":"<!doctype html> ..."}

  fs.writeFile(this.paths.archivedSites + '/' + archive.siteUrl, archive.html, (err) => {
    if (err) { throw err; }
    console.log('addWebsiteToArchive wrote file for URL', archive.siteUrl);
  });
};

exports.getFromArchive = function(url, renderPage) {
  var archiveModule = this;
  
  var cb = function(isArchived) {
    if (!isArchived) {
      archiveModule.addUrlToList(url);
      renderPage(false);
    } else {
      fs.readFile(archiveModule.paths.archivedSites + '/' + url, 'utf8', (error, data) => {
        if (error) {
          console.error('error', error);
          return;
        } else {
          renderPage(data);
        }
      });
    }
  };
  
  this.isUrlArchived(url, cb);
  // returns true or false

  // callback(this.isUrlArchived(url, cb));
};