const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "8cru2rq9";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🎨 TalkToFigma Interactive Mode\n");
const ws = new WebSocket("ws://localhost:3055");

let isJoined = false;
let exportCount = 0;

ws.on("open", function open() {
  console.log("✓ Connected\n");

  console.log(`🔌 Joining channel ${CHANNEL_ID}...`);
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
});

ws.on("message", function message(data) {
  const msg = data.toString();

  try {
    const response = JSON.parse(msg);

    if (
      response.type === "system" &&
      response.message &&
      response.message.includes("Joined channel")
    ) {
      isJoined = true;
      console.log("✓ Joined channel\n");
      console.log("📡 Sending various command formats...\n");

      const commands = [
        { type: "get_selection", channel: CHANNEL_ID },
        { type: "getSelection", channel: CHANNEL_ID },
        { type: "GET_SELECTION", channel: CHANNEL_ID },
        { type: "selection", channel: CHANNEL_ID },
        { type: "nodes", channel: CHANNEL_ID },
        { type: "list", channel: CHANNEL_ID },
        { type: "export_selection", channel: CHANNEL_ID, format: "SVG" },
        { type: "message", channel: CHANNEL_ID, content: "get selection" },
        {
          type: "message",
          channel: CHANNEL_ID,
          content: "export selection as svg",
        },
        { type: "command", channel: CHANNEL_ID, command: "help" },
      ];

      commands.forEach((cmd, i) => {
        setTimeout(() => {
          console.log(`${i + 1}. Sending:`, JSON.stringify(cmd));
          ws.send(JSON.stringify(cmd));
        }, i * 800);
      });

      return;
    }

    // Log any non-system responses
    console.log("\n📨 Response:", JSON.stringify(response, null, 2));

    // Try to save if it's SVG data
    if (response.svgData || response.svg || response.data) {
      const svgData = response.svgData || response.svg || response.data;
      if (typeof svgData === "string" && svgData.includes("<svg")) {
        const filename =
          response.filename || `onboarding-${exportCount + 1}-hero`;
        const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
        fs.writeFileSync(filePath, svgData);
        exportCount++;
        console.log(`\n✅ Saved: ${filename}.svg (${exportCount} total)\n`);
      }
    }
  } catch (err) {
    // Check if raw SVG
    if (msg.includes("<svg")) {
      const filename = `onboarding-${exportCount + 1}-hero`;
      const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
      fs.writeFileSync(filePath, msg);
      exportCount++;
      console.log(`\n✅ Saved: ${filename}.svg (${exportCount} total)\n`);
    } else if (msg.length < 500) {
      console.log("\n📝 Raw message:", msg);
    } else {
      console.log("\n📝 Large message received:", msg.length, "bytes");
    }
  }
});

ws.on("error", function error(err) {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});

ws.on("close", function close() {
  console.log(`\n✅ Done! Exported ${exportCount} files\n`);
  process.exit(0);
});

setTimeout(() => {
  console.log("\n⏱️  Closing...");
  ws.close();
}, 20000);
