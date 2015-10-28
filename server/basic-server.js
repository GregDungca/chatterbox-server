var http = require("http");
var handler = require("./request-handler");
var url = require('url');
var utils = require('./utils')
var fs = require('fs'); // may remove

var port = 3000;

var ip = "127.0.0.1";

var paths = [
  '/classes/chatterbox',
  '/classes/room1',
  '/classes/room',
  '/log',
  '/classes/messages'
];  

var filePaths = [
  '/styles/styles.css',
  '/bower_components/jquery/dist/jquery.js',
  '/env/config.js',
  '/scripts/app.js',
  '/images/spiffygif_46x46.gif'
]

var server = http.createServer(function(req,res) {
  console.log("Serving request type " + req.method + " for url " + req.url);
  var pathName = url.parse(req.url).pathname;
  if ( pathName === '/' ) {
    utils.serveFile(res, pathName);
  } else if (filePaths.indexOf(pathName) !== -1 ) {
    utils.serveFile(res, pathName);
  } else if ( paths.indexOf(pathName) !== -1 ) {
    handler.requestHandler(req,res);
  } else {
    utils.sendResponse(res, 'This path does not exist', 404);
  }
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
