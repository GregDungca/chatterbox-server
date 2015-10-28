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

exports.sendResponse = sendResponse;
exports.headers = headers;