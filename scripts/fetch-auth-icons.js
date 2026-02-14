const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "yvy1l5t4";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/auth");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🎨 Fetching Google and Apple icons from Figma...\n");
console.log(
  "📝 Make sure you have selected the Google and Apple icons in Figma!\n",
);

const ws = new WebSocket("ws://localhost:3055");
let exportCount = 0;
const maxExports = 2;

ws.on("open", () => {
  console.log("✓ Connected to TalkToFigma\n");
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
});

ws.on("message", (data) => {
  const msg = data.toString();

  try {
    const response = JSON.parse(msg);

    if (response.type === "system" && response.message?.includes("Joined")) {
      console.log("✓ Joined channel\n");
      ws.send(
        JSON.stringify({ type: "chat", text: "show me the current selection" }),
      );
      setTimeout(() => {
        ws.send(
          JSON.stringify({ type: "chat", text: "export selection as svg" }),
        );
      }, 1500);
    }

    if (response.selection || response.nodes) {
      console.log("📦 Selection info:", JSON.stringify(response, null, 2));
    }

    if (response.svg || response.svgData) {
      const svg = response.svg || response.svgData;
      let filename = "icon.svg";

      if (response.name || response.filename) {
        const name = (response.name || response.filename).toLowerCase();
        if (name.includes("google")) {
          filename = "google-icon.svg";
        } else if (name.includes("apple")) {
          filename = "apple-icon.svg";
        } else {
          filename = `auth-icon-${exportCount + 1}.svg`;
        }
      } else {
        filename = exportCount === 0 ? "google-icon.svg" : "apple-icon.svg";
      }

      const filepath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(filepath, svg);
      console.log(`✅ Saved: ${filename}`);
      exportCount++;

      if (exportCount >= maxExports) {
        console.log("\n✨ Done! Icons saved to:", OUTPUT_DIR);
        ws.close();
        process.exit(0);
      }
    }

    if (response.exports && Array.isArray(response.exports)) {
      console.log(`📦 Received ${response.exports.length} exports`);
      response.exports.forEach((exp, i) => {
        if (exp.svg || exp.svgData) {
          const svg = exp.svg || exp.svgData;
          const name = (exp.name || "").toLowerCase();
          let filename = name.includes("google")
            ? "google-icon.svg"
            : name.includes("apple")
              ? "apple-icon.svg"
              : i === 0
                ? "google-icon.svg"
                : "apple-icon.svg";

          const filepath = path.join(OUTPUT_DIR, filename);
          fs.writeFileSync(filepath, svg);
          console.log(`✅ Saved: ${filename}`);
          exportCount++;
        }
      });

      if (exportCount >= maxExports) {
        console.log("\n✨ Done! Icons saved to:", OUTPUT_DIR);
        ws.close();
        process.exit(0);
      }
    }
  } catch (e) {
    console.log("📨 Response:", msg.substring(0, 200));
  }
});

ws.on("error", (error) => {
  console.error("❌ WebSocket error:", error.message);
  process.exit(1);
});

ws.on("close", () => {
  console.log("\n🔌 Connection closed");
  if (exportCount === 0) {
    console.log(
      "\n⚠️  No icons exported. Please select Google and Apple icons in Figma and run again.\n",
    );
  }
});

setTimeout(() => {
  if (exportCount < maxExports) {
    console.log(
      "\n⏱️  Timeout - exported",
      exportCount,
      "of",
      maxExports,
      "icons",
    );
    ws.close();
    process.exit(exportCount > 0 ? 0 : 1);
  }
}, 15000);
