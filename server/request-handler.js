var fs = require('fs');
var url = require('url');
var utils = require ('./utils');
var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var getHandler = function () {
    var messages = fs.createReadStream('/Users/student/2015-10-chatterbox-server/server/messages.json');
    messages.setEncoding('utf8');
    var messageData = '';
    messages.on('data', function(chunk) {
      messageData += chunk;
    });

    messages.on('end', function() {
      utils.sendResponse(response, messageData, 200);
    });
  }

  var postHandler = function () {
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
        utils.sendResponse(response, '{"objectID":0}', 201)
      });
    });
  }

  var optionsHandler = function () {
    utils.sendResponse(response, '', 200);
    console.log('test');
  }

  var methodHandler = {
    'GET' : getHandler,
    'POST' : postHandler,
    'OPTIONS' : optionsHandler
  }

  var action = request.method;
  if ( methodHandler[action] ) {
    methodHandler[action]();
  } else {
    utils.sendResponse(response, 'NOT FOUND', 404);
  }

};

exports.requestHandler = requestHandler;
