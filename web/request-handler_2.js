var path = require('path');
var fs = require('fs');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');
const urlRegex = require('url-regex');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    console.log('in GET');
    if (req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
    }
    if (req.url === '/styles.css') {
      fs.readFile(archive.paths.siteAssets + '/styles.css', function(err, data) {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
        }  
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        return res.end();
      });
    }
  } else if (req.method === 'POST') {
    console.log('in POST');
    var body = '';
    var post = '';
    req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6) {
        req.connection.destroy();
      }
    });
    req.on('end', function () {
      post = qs.parse(body);
      // TODO
      //test url with url-regex
      //if true, then search for it in list (archive.isUrlInList)
      //if found, prepare content from archive folder to response
      //if not found, then add url to list for worker to scrape.
          //repsond with "come back later" message
      if (urlRegex().test(post.url)) {
        // check if its on the list
        // archive.readListOfUrls(function(error, data) {
        //   if(error) {
        //     console.log('error reading list file', error);
        //   } else {
        //     console.log('(list) data', data);
        //   }
        // });
        // function(data) {
        //   if(error) {
        //     console.log('error reading list file', error);
        //   } else {
        //     console.log('(list) data', data);
        //   }
        // });
        archive.isUrlInList(post.url, function(){});
      } else {

        //respond back to user that the url is invalid
      }


      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('you requested to archive URL = ' + post.url);
      return res.end();
    });
  } else {
    console.log('---------> requestHandler');
    res.end(archive.paths.list);
  }
};
