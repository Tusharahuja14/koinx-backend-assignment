const { connect, StringCodec } = require('nats');

let nc;
const sc = StringCodec();

async function connectNATS() {
  if (nc) return nc;
  nc = await connect({ servers: process.env.NATS_URL || 'nats://localhost:4222' });
  console.log('✅ NATS client connected');
  return nc;
}

async function publish(subject, message) {
  if (!nc) {
    throw new Error('NATS connection not established');
  }
  nc.publish(subject, sc.encode(message));
}

function subscribe(subject, callback) {
  if (!nc) {
    throw new Error('NATS connection not established');
  }
  const subscription = nc.subscribe(subject);
  (async () => {
    for await (const msg of subscription) {
      const decoded = sc.decode(msg.data);
      callback(decoded);
    }
  })();
}

module.exports = {
  connectNATS,
  publish,
  subscribe,
};
