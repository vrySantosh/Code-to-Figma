const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "8cru2rq9";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🎨 TalkToFigma Chat Mode\n");
const ws = new WebSocket("ws://localhost:3055");

let exportCount = 0;

ws.on("open", function open() {
  console.log("✓ Connected\n");
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
      console.log("✓ Joined channel\n");
      console.log("💬 Sending chat messages...\n");

      // Try sending plain text messages
      const messages = [
        "export selection",
        "export current selection as svg",
        "download svg",
        "get layers",
        "show selection",
        "/export svg",
        "/selection",
        "/help",
      ];

      messages.forEach((text, i) => {
        setTimeout(() => {
          console.log(`${i + 1}. Sending: "${text}"`);
          // Try as plain text
          ws.send(text);
        }, i * 1000);
      });

      return;
    }

    // Log all responses
    if (response.type && !response.message?.includes("Please join")) {
      console.log("\n📨 Response:", JSON.stringify(response, null, 2));
    }

    // Save SVG data
    if (response.svgData || response.svg) {
      const svgData = response.svgData || response.svg;
      const filename = `onboarding-${exportCount + 1}-hero`;
      const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
      fs.writeFileSync(filePath, svgData);
      exportCount++;
      console.log(`\n✅ Saved: ${filename}.svg\n`);
    }
  } catch (err) {
    if (msg.includes("<svg")) {
      const filename = `onboarding-${exportCount + 1}-hero`;
      const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
      fs.writeFileSync(filePath, msg);
      exportCount++;
      console.log(`\n✅ Saved: ${filename}.svg\n`);
    } else if (msg.length < 200) {
      console.log("\n📝", msg);
    }
  }
});

ws.on("error", (err) => console.error("\n❌", err.message));
ws.on("close", () => {
  console.log(`\n✅ Exported ${exportCount} files\n`);
  process.exit(0);
});

setTimeout(() => {
  console.log("\n⏱️  Timeout");
  ws.close();
}, 15000);
