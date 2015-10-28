var fs = require('fs');
var url = require('url');
var utils = require ('./utils');
var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var getHandler = function () {
    var messages = fs.createReadStream('./messages.json');
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
    utils.getData(request, function (receivedMessage) {



      // read messages from messages.json

      var messagesStream = fs.createReadStream('./messages.json');
      messagesStream.setEncoding('utf8');
      var allData = '';
      messagesStream.on('data', function(chunk) {
        allData += chunk;
      });
      messagesStream.on('end', function() {

        // add objectId to message
        var newID = JSON.parse(allData).results.length;
        var jsonReceivedMessage = JSON.parse(receivedMessage);
        jsonReceivedMessage.objectId = newID;

        // write messages to messages.json

        var writeStream = fs.createWriteStream('./messages.json');
        writeStream.end(allData.slice(0, allData.length-2) + ',' + JSON.stringify(jsonReceivedMessage) + "]}");
        writeStream.on('finish', function () {
          utils.sendResponse(response, '{"success":1}', 201);
        });
      });
    });
  }

  var optionsHandler = function () {
    utils.sendResponse(response, '', 200);
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
