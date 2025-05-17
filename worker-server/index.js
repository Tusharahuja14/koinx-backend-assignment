// index.js
const { connect, StringCodec } = require('nats');
const cron = require('node-cron');

async function startWorker() {
  const nc = await connect({ servers: 'localhost:4222' });
  const sc = StringCodec();

  console.log('✅ Worker connected to NATS');

  cron.schedule('*/15 * * * *', () => {
    const message = { trigger: 'update' };
    nc.publish('crypto.update', sc.encode(JSON.stringify(message)));
    console.log('📤 Published update to crypto.update at', new Date().toLocaleString());
  });

  console.log('⏰ Worker job scheduled to run every 15 minutes');
}

startWorker().catch(console.error);
