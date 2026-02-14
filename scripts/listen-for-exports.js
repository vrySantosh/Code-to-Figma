const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "8cru2rq9";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🎧 Listening for Figma exports on channel", CHANNEL_ID);
console.log("📍 Will save SVG files to:", OUTPUT_DIR);
console.log(
  "\n👉 Now click 'Export' in the TalkToFigma plugin in Figma Desktop\n",
);

const ws = new WebSocket("ws://localhost:3055");
let exportCount = 0;
const heroNames = [
  "onboarding-1-hero",
  "onboarding-2-hero",
  "onboarding-3-hero",
  "onboarding-4-hero",
  "onboarding-5-hero",
];

ws.on("open", function open() {
  console.log("✓ Connected to TalkToFigma");
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
});

ws.on("message", function message(data) {
  const msg = data.toString();

  try {
    const response = JSON.parse(msg);

    if (
      response.type === "system" &&
      response.message &&
      response.message.includes("Joined")
    ) {
      console.log("✓ Listening on channel\n");
      console.log("⏳ Waiting for exports from Figma...\n");
      return;
    }

    // Log any message that's not the join confirmation
    if (
      response.type !== "system" ||
      !response.message?.includes("Please join")
    ) {
      console.log("\n📨 Received:", response.type || "data");

      // Try to extract and save SVG
      const svgData =
        response.svgData || response.svg || response.data || response.content;
      if (svgData && typeof svgData === "string" && svgData.includes("<svg")) {
        const filename =
          response.filename ||
          response.name ||
          heroNames[exportCount] ||
          `hero-${exportCount + 1}`;
        const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
        fs.writeFileSync(filePath, svgData);
        exportCount++;
        console.log(`✅ Saved: ${filename}.svg (${exportCount} total)`);

        if (exportCount >= 5) {
          console.log("\n🎉 All 5 hero images exported!\n");
          ws.close();
        }
      } else {
        console.log("    Data:", JSON.stringify(response).substring(0, 150));
      }
    }
  } catch (err) {
    // Check for raw SVG
    if (msg.includes("<svg")) {
      const filename = heroNames[exportCount] || `hero-${exportCount + 1}`;
      const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
      fs.writeFileSync(filePath, msg);
      exportCount++;
      console.log(`✅ Saved: ${filename}.svg (${exportCount} total)`);

      if (exportCount >= 5) {
        console.log("\n🎉 All 5 hero images exported!\n");
        ws.close();
      }
    }
  }
});

ws.on("error", (err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});

ws.on("close", () => {
  console.log(`\n✅ Listener closed. Exported ${exportCount} files.\n`);
  process.exit(0);
});

// Keep listening for 60 seconds
setTimeout(() => {
  console.log("\n⏱️  Timeout after 60 seconds");
  if (exportCount === 0) {
    console.log("❌ No exports received");
    console.log("\n💡 Make sure to:");
    console.log("   1. Select the frames in Figma Desktop");
    console.log("   2. Open TalkToFigma plugin");
    console.log("   3. Click the export/send button\n");
  }
  ws.close();
}, 60000);
