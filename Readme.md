# Clamshell

[Node.js](https://github.com/nodejs/node) based simulator for [ClamD](http://www.clamav.net/).

While developing code which typically runs on a server and interacts with ClamD, the ClamAV daemon, via 127.0.0.1:3310 I hit issues when testing the integration with ClamD.
We didn't want to expose a ClamD server on the network as it has a `SHUTDOWN` command, which isn't great to expose, and local config would have to redirect to that server.
I also develop on a system that already has a running AV that isn't Clam and didn't want to run two.

So the easy fix was to make a mocked version of ClamD for my application to talk to, which is what Clamshell is.

Currently it only has a couple of basic ClamD commands implemented as those are the only ones my application code uses.
My application code also runs a test scan streaming Eicar to check ClamD is running properly, so Clamshell currently, crudely, checks for this and returns the expected result. 

## Requirements

[Node.js](https://github.com/nodejs/node)

## Installation and Usage

Either download this repository and run:

`
node clamshell.js
`

Or use npm and install it globally:

`
npm install -g clamshell
`

## TODO
- Implement all clamd commands: http://linux.die.net/man/8/clamd
- Look at adding more options to the virus-scanner.js
 - AVG backend: http://faqbay.com/faq/how-use-avg-command-line-scan
 - Prompt on command line for return value?
- Support scanning of buffered data better (currently stream-server sets the scan message for every data chunk passed in)
