const { connect } = require('nats');

let nc;

async function connectNATS() {
  nc = await connect({ servers: "localhost:4222" });
  console.log("✅ Connected to NATS");

  nc.closed().then((err) => {
    if (err) {
      console.error("❌ NATS connection closed with error:", err);
    } else {
      console.log("ℹ️ NATS connection closed");
    }
  });
}

function publish(subject, data) {
  if (!nc) throw new Error("❌ NATS not connected yet");
  nc.publish(subject, Buffer.from(JSON.stringify(data)));
}

function subscribe(subject, callback) {
  if (!nc) throw new Error("❌ NATS not connected yet");

  const sub = nc.subscribe(subject);
  (async () => {
    for await (const msg of sub) {
      const data = JSON.parse(msg.data.toString());
      callback(data);
    }
  })();
}

module.exports = {
  connectNATS,
  publish,
  subscribe,
};
