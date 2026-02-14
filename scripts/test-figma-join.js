const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "8cru2rq9";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🎨 Connecting to TalkToFigma...\n");

const ws = new WebSocket("ws://localhost:3055");

let messageCount = 0;

ws.on("open", function open() {
  console.log("✓ Connected!\n");

  // Try multiple join formats
  const joinAttempts = [
    {
      cmd: JSON.stringify({ type: "join", channel: CHANNEL_ID }),
      desc: "JSON type:join",
    },
    {
      cmd: JSON.stringify({ action: "join", channel: CHANNEL_ID }),
      desc: "JSON action:join",
    },
    {
      cmd: JSON.stringify({ command: "JOIN", channel: CHANNEL_ID }),
      desc: "JSON command:JOIN",
    },
    { cmd: `/join ${CHANNEL_ID}`, desc: "IRC-style /join" },
    { cmd: `JOIN ${CHANNEL_ID}`, desc: "Uppercase JOIN" },
    { cmd: `join ${CHANNEL_ID}`, desc: "Lowercase join" },
    { cmd: CHANNEL_ID, desc: "Just channel ID" },
    { cmd: JSON.stringify({ channel: CHANNEL_ID }), desc: "JSON channel only" },
  ];

  console.log("🔐 Trying different join command formats...\n");

  joinAttempts.forEach((attempt, i) => {
    setTimeout(() => {
      console.log(`${i + 1}. ${attempt.desc}: ${attempt.cmd}`);
      ws.send(attempt.cmd);
    }, i * 500);
  });

  // After all attempts, try to list nodes
  setTimeout(
    () => {
      console.log("\n📡 Attempting to list nodes after join attempts...");
      ws.send(JSON.stringify({ action: "list" }));
      ws.send("list");
    },
    joinAttempts.length * 500 + 1000,
  );
});

ws.on("message", function message(data) {
  messageCount++;
  const msg = data.toString();
  console.log(`\n📨 Message #${messageCount}:`);
  console.log("   ", msg.substring(0, 200));

  try {
    const json = JSON.parse(msg);
    if (
      json.type !== "system" ||
      json.message !== "Please join a channel to start chatting"
    ) {
      console.log("   ✨ NEW RESPONSE TYPE!");
      console.log("   ", JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.log("    (not JSON)");
  }
});

ws.on("error", function error(err) {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});

ws.on("close", function close() {
  console.log("\n✅ Connection closed");
  console.log(`Total messages received: ${messageCount}`);
  process.exit(0);
});

setTimeout(() => {
  console.log("\n\n⏱️  Test complete. Closing connection...");
  ws.close();
}, 15000);
