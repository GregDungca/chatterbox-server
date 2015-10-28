var fs = require('fs');

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "application/json"
}

var sendResponse = function( response, data, statusCode ) {
  response.writeHead(statusCode, headers);
  response.end(data);
}

var getData = function(request, callback) {
  var data = '';
  request.setEncoding('utf8');
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  })
}

var serveFile = function(response, filePath) {
  filePath = filePath === '/' ? '../client/index.html' : ('../client' + filePath);

  var readClientStream = fs.createReadStream(filePath);
  readClientStream.setEncoding('utf8');
  var contents = '';
  readClientStream.on('data', function(chunk) {
    contents += chunk;
  });
  readClientStream.on('end', function() {
    if ( filePath === '../client/styles/styles.css' ) { //should make this less 'hacky'
      headers = {
        "Content-Type": "text/css"
      }
      response.writeHead(200, headers);
    }
    else {
      response.writeHead(200);
    }
    response.end(contents);
  });
}


exports.sendResponse = sendResponse;
exports.headers = headers;
exports.getData = getData;
exports.serveFile = serveFile;
