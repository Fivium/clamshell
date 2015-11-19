/*
 * clamshell-server.js: Clamd server mock
 *
 * (C) 2015 Nick Palmer
 * BSD-3-Clause LICENCE
 */
/* global process */

var net = require('net');
var clamdConfig = require('./config.js');
var streamServer = require('./stream-server.js');

var clamshellServer = {};

clamshellServer.start = function() {
  if (clamshellServer.server) {
    console.err('Clamshell server already started');
  }
  else {
    console.log('Starting clamshell server');

    clamshellServer.server = net.createServer(function (socket) {
      console.log('client connected');

      socket.on('end', function() {
        console.log('client disconnected\n');
      });

      socket.on('data', function (data) {
        var cmdIn = data.toString().trim();
        var cmdOut;
        console.log('client:', cmdIn);
        switch (cmdIn) {
          case 'PING':
            cmdOut = 'PONG' + '\n';
            console.log('clamshell:', cmdOut.trim());
            socket.write(cmdOut);
            break;
          case 'VERSION':
            cmdOut = 'Clamshell ' + process.env.npm_package_version + '\n';
            console.log('clamshell:', cmdOut.trim());
            socket.write(cmdOut);
            break;
          case 'RELOAD':
            // Return what clamd would, nothing for clamshell to reload
            cmdOut = 'RELOADING' + '\n';
            console.log('clamshell:', cmdOut.trim());
            socket.write(cmdOut);
            break;
          case 'STREAM':
            // TODO - NP - This should round robin and check if there's an existing stream socket for that port in use
            var newPort = Math.round(Math.random() * (clamdConfig.streamPortRange[1] - clamdConfig.streamPortRange[0])) + clamdConfig.streamPortRange[0];

            // Spawn new listener
            streamServer.start(newPort, socket);

            cmdOut = 'PORT ' + newPort + '\n';
            console.log('clamshell:', cmdOut.trim());
            socket.write(cmdOut);
            break;
          case 'SHUTDOWN':
            cmdOut = 'Shutting Down' + '\n';
            socket.end(cmdOut);
            clamshellServer.stop();
            break;
          default:
            cmdOut = 'Unknown command: ' + cmdIn + '\n';
            console.log('clamshell:', cmdOut.trim());
            socket.end(cmdOut);
        }
      });
    });

    clamshellServer.server.on('error', function (e) {
      if (e.code == 'EADDRINUSE') {
        console.log('Clamshell server port in use: ' + clamdConfig.port);
      }
    });

    clamshellServer.server.listen(clamdConfig.port, function() {
      console.log('Clamshell server listener bound');
    });
  }
};

clamshellServer.stop = function() {
  console.log('Stopping clamshell server');
  clamshellServer.server.close(function() {
    console.log('Clamshell server stopped');
  });
};

module.exports = clamshellServer;
