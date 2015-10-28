var http = require("http");
var handler = require("./request-handler");
var url = require('url');
var utils = require('./utils')

var port = 3000;

var ip = "127.0.0.1";

var paths = [
  '/classes/chatterbox',
  '/classes/room1',
  '/classes/room',
  '/log',
  '/classes/messages'
];  

var server = http.createServer(function(req,res) {
  if ( paths.indexOf(url.parse(req.url).pathname) !== -1 ) {
    handler.requestHandler(req,res);
  } else {
    utils.sendResponse(res, 'This path does not exist', 404);
  }
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
