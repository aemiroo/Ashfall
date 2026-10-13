'use strict';

const net = require('node:net');
const { createPacketDecoder, encodePacket, isVersion160Check, API_OK } = require('./protocol');

const port = Number(process.env.PORT || 444);
const host = process.env.HOST || '127.0.0.1';

function createServer() {
  return net.createServer((socket) => {
    const peer = socket.remoteAddress + ':' + socket.remotePort;
    console.log('[connect]', peer);
    let handshakeComplete = false;
    const receive = createPacketDecoder((packet) => {
      console.log('[recv]', peer, packet);
      if (!handshakeComplete && isVersion160Check(packet)) {
        handshakeComplete = true;
        socket.write(encodePacket(API_OK));
        console.log('[send]', peer, API_OK);
        return;
      }
      if (!handshakeComplete) {
        console.warn('[protocol] Expected SmartFox 1.6.0 verChk; disconnecting', peer);
        socket.end();
        return;
      }
      // Later milestones: login, getRmList, autoJoin, object and extension messages.
      console.log('[unhandled]', peer, packet);
    });
    socket.on('data', (chunk) => {
      try { receive(chunk); }
      catch (error) { console.error('[protocol error]', peer, error.message); socket.destroy(); }
    });
    socket.on('error', (error) => console.error('[socket error]', peer, error.message));
    socket.on('close', () => console.log('[disconnect]', peer));
  });
}

if (require.main === module) {
  const server = createServer();
  server.on('error', (error) => { console.error('[listen error]', error.message); process.exitCode = 1; });
  server.listen(port, host, () => console.log('Ashfall listening on ' + host + ':' + port));
}

module.exports = { createServer };
