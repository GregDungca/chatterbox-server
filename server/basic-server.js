var http = require("http");
var handler = require("./request-handler");
var url = require('url');
var utils = require('./utils')
var fs = require('fs');

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
  console.log(url.parse(req.url).pathname);
  if ( url.parse(req.url).pathname === '/' ) {
    console.log('empty');
    // read file from index.html and submit within the response body
      // let's try piping
    var readClientStream = fs.createReadStream('../client/index.html')
    readClientStream.setEncoding('utf8');
    var contents = '';
    readClientStream.on('data', function(chunk) {
      contents += chunk;
    });
    readClientStream.on('end', function() {
      res.writeHead(200);
      res.end(contents);
    });

  } else if ( paths.indexOf(url.parse(req.url).pathname) !== -1 ) {
    handler.requestHandler(req,res);
  } else {
    utils.sendResponse(res, 'This path does not exist', 404);
  }
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
