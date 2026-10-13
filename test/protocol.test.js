'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createPacketDecoder, encodePacket, isVersion160Check, API_OK } = require('../src/protocol');

const request = "<msg t='sys'><body action='verChk' r='0'><ver v='160' /></body></msg>";

test('accepts original SmartFox 1.6.0 version check', () => {
  assert.equal(isVersion160Check(request), true);
  assert.equal(isVersion160Check(request.replace('160', '159')), false);
});

test('uses NUL terminators and handles fragmented or coalesced packets', () => {
  const packets = [];
  const decode = createPacketDecoder((packet) => packets.push(packet));
  const encoded = encodePacket(request);
  assert.equal(encoded.at(-1), 0);
  decode(encoded.subarray(0, 9));
  assert.deepEqual(packets, []);
  decode(Buffer.concat([encoded.subarray(9), encodePacket(API_OK)]));
  assert.deepEqual(packets, [request, API_OK]);
});
