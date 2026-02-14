const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const https = require("https");

const FIGMA_API_KEY = process.env.FIGMA_TOKEN || "your_figma_token_here";
const FILE_URL = process.env.FIGMA_FILE_URL ||
  "https://www.figma.com/design/YOUR_FILE_KEY/Your-File-Name?node-id=0-1";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(
  "🔌 Connecting to local Figma Desktop app on ws://localhost:3055...\n",
);

const ws = new WebSocket("ws://localhost:3055");

ws.on("open", function open() {
  console.log("✓ Connected to Figma Desktop!\n");

  // Join the specific channel using plain text command
  console.log("🔌 Joining channel 8cru2rq9...");
  ws.send("/join 8cru2rq9");
});

ws.on("message", function message(data) {
  try {
    const response = JSON.parse(data.toString());
    console.log("📨 Received:", response.type || "Unknown message");
    console.log("   Full response:", JSON.stringify(response, null, 2));

    if (response.type === "CHANNEL_JOINED") {
      console.log("✓ Channel joined successfully!\n");

      // Now request to open the file
      console.log("📂 Requesting to open Figma file...");
      ws.send(
        JSON.stringify({
          type: "OPEN_FILE",
          fileUrl: FILE_URL,
        }),
      );
    }

    if (response.type === "FILE_OPENED") {
      console.log("✓ File opened successfully!\n");
      console.log("📄 File:", response.fileName || "Unknown");

      // Request to list all frames/nodes
      console.log("\n🔍 Searching for onboarding assets...");
      ws.send(
        JSON.stringify({
          type: "GET_NODES",
          filter: "onboarding",
        }),
      );
    }

    if (response.type === "NODES_LIST") {
      console.log(`\n✓ Found ${response.nodes?.length || 0} nodes:\n`);

      if (!response.nodes || response.nodes.length === 0) {
        console.log("❌ No onboarding assets found.");
        console.log(
          "💡 Try selecting the onboarding frames in Figma Desktop and running this script again.\n",
        );
        ws.close();
        return;
      }

      response.nodes.forEach((node, i) => {
        console.log(`  ${i + 1}. ${node.name} (${node.type}) - ID: ${node.id}`);
      });

      // Find onboarding hero nodes
      const onboardingNodes = response.nodes
        .filter((node) => /onboarding.*hero|hero.*\d/i.test(node.name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 5);

      if (onboardingNodes.length > 0) {
        console.log(
          `\n📦 Exporting ${onboardingNodes.length} hero illustrations...\n`,
        );

        onboardingNodes.forEach((node, i) => {
          ws.send(
            JSON.stringify({
              type: "EXPORT_NODE",
              nodeId: node.id,
              format: "SVG",
              filename: `onboarding-${i + 1}-hero`,
            }),
          );
        });
      } else {
        console.log(
          "\n⚠️  No hero illustrations found. Exporting first 5 nodes...\n",
        );

        response.nodes.slice(0, 5).forEach((node, i) => {
          ws.send(
            JSON.stringify({
              type: "EXPORT_NODE",
              nodeId: node.id,
              format: "SVG",
              filename: `onboarding-${i + 1}-hero`,
            }),
          );
        });
      }
    }

    if (response.type === "EXPORT_COMPLETE") {
      console.log(`✓ Exported: ${response.filename}.svg`);

      // Save the SVG data
      if (response.svgData) {
        const filePath = path.join(OUTPUT_DIR, `${response.filename}.svg`);
        fs.writeFileSync(filePath, response.svgData);
        console.log(`  Saved to: ${filePath}`);
      }
    }

    if (response.type === "ERROR") {
      console.error("❌ Error:", response.message);
    }
  } catch (err) {
    console.error("❌ Parse error:", err.message);
  }
});

ws.on("error", function error(err) {
  console.error("❌ WebSocket error:", err.message);
  console.log("\n💡 Make sure:");
  console.log("  1. Figma Desktop app is running");
  console.log("  2. The TalkToFigma plugin is installed and running");
  console.log("  3. Your Figma file is open in the Desktop app\n");
  process.exit(1);
});

ws.on("close", function close() {
  console.log("\n✅ Connection closed. Assets exported to:");
  console.log(`   ${OUTPUT_DIR}\n`);
  process.exit(0);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log("\n⏱️  Timeout - closing connection");
  ws.close();
}, 30000);
