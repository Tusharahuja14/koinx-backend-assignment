// natsWrapper.js
const { connect, StringCodec } = require('nats');

let nc;
const sc = StringCodec();

const connectNATS = async () => {
  if (nc) return nc; // Return existing connection if already connected

  nc = await connect({
    servers: process.env.NATS_URL || 'nats://localhost:4222',
    name: 'koinx-worker',
  });

  nc.closed().then(() => {
    console.log('NATS connection closed');
    process.exit();
  });

  return nc;
};

const publish = async (subject, message) => {
  if (!nc) throw new Error('NATS client not connected');
  nc.publish(subject, sc.encode(message));
};

module.exports = { connectNATS, publish };
