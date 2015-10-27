var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "application/json"
};

var fs = require('fs');
var url = require('url');

var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var paths = [
    '/classes/chatterbox',
    '/classes/room1',
    '/classes/room',
    '/log',
    '/classes/messages'
  ];

  var sendResponse = function( response, data, statusCode ) {
    response.writeHead(statusCode, headers);
    response.end(data);
  }


  if ( paths.indexOf(url.parse(request.url).pathname) !== -1 ) {

    if ( request.method === 'POST') {
      console.log('received a POST message');
      var receivedMessage = '';
      request.setEncoding('utf8');

      request.on('data', function(chunk) {
        receivedMessage += chunk;
      });
      var readMessages = fs.createReadStream('/Users/student/2015-10-chatterbox-server/server/messages.json');
      readMessages.setEncoding('utf8');
      var allData = '';
      readMessages.on('data', function(chunk) {
        allData += chunk;
      });
      

      readMessages.on('end', function() {
        var writeStream = fs.createWriteStream('/Users/student/2015-10-chatterbox-server/server/messages.json');
        writeStream.end(allData.slice(0, allData.length-2) + ',' + receivedMessage + "]}");
        writeStream.on('finish', function () {
          sendResponse(response, '{"objectID":0}', 201)
        });
      });

    }

    else if ( request.method === 'GET' ) {
      var messages = fs.createReadStream('/Users/student/2015-10-chatterbox-server/server/messages.json');

      messages.setEncoding('utf8');

      var messageData = '';
      messages.on('data', function(chunk) {
        messageData += chunk;
      });

      messages.on('end', function() {
        sendResponse(response, messageData, 200);
      });
    }

    else if ( request.method === 'OPTIONS' ) {
      sendResponse(response, '', 200);
    }
    
  }

  else {
    sendResponse(response, '', 404);
  }



};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.



exports.requestHandler = requestHandler;
