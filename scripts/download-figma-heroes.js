const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "8cru2rq9";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🎨 Connecting to TalkToFigma on ws://localhost:3055...\n");

const ws = new WebSocket("ws://localhost:3055");

let exportedCount = 0;
let totalToExport = 5;

ws.on("open", function open() {
  console.log("✓ Connected to TalkToFigma!\n");

  // Try sending a message to the channel
  console.log(`📡 Sending message to channel ${CHANNEL_ID}...`);
  ws.send(
    JSON.stringify({
      channel: CHANNEL_ID,
      message: "Hello from Provibe! Ready to export onboarding heroes.",
    }),
  );

  // After a brief delay, request to list nodes
  setTimeout(() => {
    console.log("\n🔍 Requesting list of Figma nodes...");
    ws.send(
      JSON.stringify({
        channel: CHANNEL_ID,
        action: "list_nodes",
      }),
    );
  }, 1000);
});

ws.on("message", function message(data) {
  try {
    const response = JSON.parse(data.toString());
    console.log(
      "📨 Received:",
      response.type || JSON.stringify(response).substring(0, 100),
    );

    // Handle different response types
    if (response.type === "nodes" || response.nodes) {
      const nodes = response.nodes || [];
      console.log(`\n✓ Found ${nodes.length} nodes in Figma`);

      // Filter for hero illustrations
      const heroNodes = nodes
        .filter((node) => /hero|onboarding/i.test(node.name))
        .slice(0, 5);

      if (heroNodes.length === 0) {
        console.log("❌ No hero nodes found. Available nodes:");
        nodes.slice(0, 10).forEach((node) => {
          console.log(`  - ${node.name} (${node.id})`);
        });
        ws.close();
        return;
      }

      console.log("\n📦 Exporting hero illustrations:");
      heroNodes.forEach((node, i) => {
        console.log(`  ${i + 1}. ${node.name}`);
      });

      // Request exports
      heroNodes.forEach((node, i) => {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              channel: CHANNEL_ID,
              action: "export",
              nodeId: node.id,
              format: "svg",
              filename: `onboarding-${i + 1}-hero`,
            }),
          );
        }, i * 500);
      });

      totalToExport = heroNodes.length;
    }

    if (response.type === "export_complete" || response.svgData) {
      const filename = response.filename || `hero-${Date.now()}`;
      const svgData = response.svgData || response.data;

      if (svgData) {
        const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
        fs.writeFileSync(filePath, svgData);
        exportedCount++;
        console.log(
          `✓ Exported ${filename}.svg (${exportedCount}/${totalToExport})`,
        );

        if (exportedCount >= totalToExport) {
          console.log("\n🎉 All exports complete!");
          ws.close();
        }
      }
    }

    if (response.type === "error") {
      console.error(
        "❌ Error from TalkToFigma:",
        response.message || response.error,
      );
    }
  } catch (err) {
    console.log("📝 Raw message:", data.toString().substring(0, 200));
  }
});

ws.on("error", function error(err) {
  console.error("\n❌ WebSocket error:", err.message);
  console.log("\n💡 Troubleshooting:");
  console.log("  1. Make sure Figma Desktop is running");
  console.log("  2. Ensure TalkToFigma plugin is active in Figma");
  console.log("  3. Check that your Figma file is open");
  console.log(`  4. Verify channel ${CHANNEL_ID} is correct\n`);
  process.exit(1);
});

ws.on("close", function close() {
  console.log("\n✅ Done! Assets saved to:");
  console.log(`   ${OUTPUT_DIR}\n`);
  process.exit(0);
});

// Timeout after 20 seconds
setTimeout(() => {
  console.log("\n⏱️  Timeout reached");
  if (exportedCount > 0) {
    console.log(`✓ Exported ${exportedCount}/${totalToExport} files`);
  } else {
    console.log("❌ No files exported");
    console.log("\n💡 Try:");
    console.log("  1. Selecting the hero frames in Figma Desktop");
    console.log("  2. Running the TalkToFigma plugin again");
    console.log("  3. Verifying the channel ID is correct");
  }
  ws.close();
}, 20000);
