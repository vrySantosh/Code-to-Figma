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

ws.on("open", function open() {
  console.log("✓ Connected!\n");

  // Try different command formats
  console.log("📡 Attempting to communicate with Figma...\n");

  // Try 1: Plain text
  ws.send("list nodes");

  setTimeout(() => {
    // Try 2: Channel-specific message
    ws.send(`${CHANNEL_ID}: export heroes as svg`);
  }, 1000);

  setTimeout(() => {
    // Try 3: More specific request
    ws.send(
      `${CHANNEL_ID}: export onboarding-1-hero,onboarding-2-hero,onboarding-3-hero,onboarding-4-hero,onboarding-5-hero`,
    );
  }, 2000);
});

ws.on("message", function message(data) {
  const msg = data.toString();
  console.log("📨 Received:", msg.substring(0, 150));
  console.log("    Full length:", msg.length, "bytes\n");

  // Try to parse as JSON
  try {
    const json = JSON.parse(msg);
    console.log(
      "    Parsed JSON:",
      JSON.stringify(json, null, 2).substring(0, 300),
      "\n",
    );

    // If it's SVG data, save it
    if (json.svgData || json.svg) {
      const svgData = json.svgData || json.svg;
      const filename = json.filename || json.name || `hero-${Date.now()}`;
      const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
      fs.writeFileSync(filePath, svgData);
      console.log(`✅ Saved: ${filename}.svg\n`);
    }
  } catch (err) {
    // Not JSON, might be raw SVG or other data
    if (msg.includes("<svg")) {
      const filename = `hero-${Date.now()}.svg`;
      const filePath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filePath, msg);
      console.log(`✅ Saved SVG: ${filename}\n`);
    }
  }
});

ws.on("error", function error(err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
});

ws.on("close", function close() {
  console.log("\n✅ Connection closed");
  process.exit(0);
});

setTimeout(() => {
  console.log("\n⏱️  Closing after 15 seconds...");
  ws.close();
}, 15000);
