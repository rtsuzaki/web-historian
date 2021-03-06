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
          return res.end('404 Not Found');
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
          return res.end('404 Not Found');
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
      
      if (urlRegex().test(post.url)) {
        var populateData = function(htmlData) {
          if (!htmlData) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('The page with URL ' + post.url + ' is not archived.');
            return res.end();
          } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('http://' + htmlData);
            return res.end();
          }
        };

        archive.getFromArchive(post.url, populateData);
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('you requested to archive URL = ' + post.url);
        return res.end();
      }
    });
  } else {
    console.log('---------> requestHandler');
    res.end(archive.paths.list);
  }
};
