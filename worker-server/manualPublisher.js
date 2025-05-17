// manualPublisher.js
const { connect, StringCodec } = require('nats');

async function publishUpdate() {
  const nc = await connect({ servers: 'localhost:4222' }); // adjust if your NATS is on a different port
  const sc = StringCodec();

  const message = { trigger: 'update' };

  nc.publish('crypto.update', sc.encode(JSON.stringify(message)));
  console.log('📤 Published message to "crypto.update":', message);

  await nc.drain(); // gracefully close the connection
}

publishUpdate().catch(console.error);
