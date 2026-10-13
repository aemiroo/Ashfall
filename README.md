# Ashfall

Independent Node.js server emulator targeting the network protocol used by the original Dead Frontier 3D Unity client.

Not affiliated with or endorsed by the original game's creators. Do not commit proprietary client binaries or game assets.

## Milestone 0.1.0 — SmartFox connection handshake

- TCP server listening on `127.0.0.1:444` by default
- UTF-8 XML packets terminated with NUL (`0x00`)
- Accepts SmartFox 1.6.0 `verChk` (`v='160'`)
- Responds with `apiOK`
- Logs further packets without pretending login or multiplayer works yet
- Basic decoder tests

### Run

Requires Node.js 20 or newer.

```sh
npm start
npm test
```

Optional environment variables: `HOST` (default `127.0.0.1`), `PORT` (default `444`). Use loopback for initial testing; don't expose this prototype to the public internet.

### Test with the original client

Point a legally obtained original client at `127.0.0.1:444`. A successful first-stage test should show a `verChk` packet in the terminal followed by an `apiOK` response. This has not yet been validated with the actual game client.

### Next milestones

1. Confirm `apiOK` response compatibility against the real client.
2. Implement `login` and `logOK` with a local account store.
3. Implement `getRmList`, `rmList`, `autoJoin`, and `joinOK`.
4. Reverse-engineer extension and object payloads for actual gameplay.

Security: XML is recognized using narrow string checks for this initial handshake only. Before exposing the server or implementing authentication, add robust input validation, rate limits, credential hashing, and protocol-aware parsing.
