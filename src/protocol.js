'use strict';

const MAX_PACKET_BYTES = 1024 * 1024;
const VERSION_CHECK = /<body\b[^>]*\baction\s*=\s*['"]verChk['"][^>]*>/i;
const VERSION_160 = /<ver\b[^>]*\bv\s*=\s*['"]160['"][^>]*\/?\s*>/i;
const API_OK = "<msg t='sys'><body action='apiOK' r='0'></body></msg>";

function createPacketDecoder(onPacket) {
  let pending = Buffer.alloc(0);
  return function receive(chunk) {
    pending = Buffer.concat([pending, chunk]);
    if (pending.length > MAX_PACKET_BYTES) throw new Error('Incoming packet exceeds size limit');
    let boundary;
    while ((boundary = pending.indexOf(0)) !== -1) {
      const packet = pending.subarray(0, boundary).toString('utf8');
      pending = pending.subarray(boundary + 1);
      if (packet.length > 0) onPacket(packet);
    }
  };
}

function encodePacket(xml) {
  return Buffer.from(xml + '\0', 'utf8');
}

function isVersion160Check(xml) {
  return VERSION_CHECK.test(xml) && VERSION_160.test(xml) && /<msg\b[^>]*\bt\s*=\s*['"]sys['"]/i.test(xml);
}

module.exports = { createPacketDecoder, encodePacket, isVersion160Check, API_OK };
