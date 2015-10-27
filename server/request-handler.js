var fs = require('fs');


var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  


  if ( request.method === 'POST') {
    console.log('received a POST message');
    var receivedMessage;
    request.setEncoding('utf8');
    request.on('data', function(chunk) {
      receivedMessage = JSON.parse(chunk);
    });
    var readMessages = fs.createReadStream('messages.json');
    readMessages.setEncoding('utf8');
    var allData;
    readMessages.on('data', function(chunk) {
      allData = JSON.parse(chunk);
    });
    

    readMessages.on('end', function() {
      var parsedAllData = JSON.stringify(allData);

      var slicedParsedAllData = parsedAllData.slice(0, parsedAllData.length-2);

      var writeStream = fs.createWriteStream('messages.json');

      writeStream.write(slicedParsedAllData + ',' + JSON.stringify(receivedMessage) + "]}");

      var statusCode = 200;

      var headers = defaultCorsHeaders;

      response.writeHead(statusCode, headers);

      response.end();
    });


  }

  else {
    var messages = fs.createReadStream('messages.json');

    messages.setEncoding('utf8');

    var messageData = '';
    messages.on('data', function(chunk) {
      messageData += chunk;
    });

    messages.on('end', function() {
      var statusCode = 200;

      var headers = defaultCorsHeaders;
      

      headers['Content-Type'] = "text/plain";//may have to make this application/json

      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      response.writeHead(statusCode, headers);
    
      // Make sure to always call response.end() - Node may not send
      // anything back to the client until you do. The string you pass to
      // response.end() will be the body of the response - i.e. what shows
      // up in the browser.
      //
      // Calling .end "flushes" the response's internal buffer, forcing
      // node to actually send all the data over to the client.
      response.end(messageData);
    });
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
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


exports.handleRequest = requestHandler;
