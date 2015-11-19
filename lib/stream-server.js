/*
 * stream-server.js: Server to handle STREAM requests
 *
 * (C) 2015 Nick Palmer
 * BSD-3-Clause LICENCE
 */

var net = require('net');
var virusScanner = require('./virus-scanner.js');

var streamServer = {};

streamServer.start = function(streamServerPort, clamshellServerSocket) {
  console.log('Starting stream server on port:', streamServerPort);

  streamServer.server = net.createServer(function (socket) {
    console.log('Recieving data to stream server');

    socket.on('end', function() {

      if (!streamServer.scanMessage) {
        throw 'No scan message result';
      }

      var cmdOut = 'stream: ' + streamServer.scanMessage + '\n';
      console.log('clamshell:', cmdOut.trim());
      clamshellServerSocket.write(cmdOut);

      socket.end();
      streamServer.server.close();

      console.log('Stream Server ended\n');
    });

    socket.on('data', function (data) {
      console.log('client:', data.toString('ascii', 0, 10), '...', data.length);
      
      streamServer.scanMessage = virusScanner.scan(data);
    });
  });

  streamServer.server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('Stream server port in use:', streamServerPort);
    }
  });

  streamServer.server.listen(streamServerPort, function() {
    console.log('');
    console.log('Stream server listener bound');
  });
};

module.exports = streamServer;
