const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "8cru2rq9";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("🎨 Fetching hero images from Figma Desktop via TalkToFigma\n");

const ws = new WebSocket("ws://localhost:3055");

let isJoined = false;
let exportedCount = 0;
const heroNames = [
  "onboarding-1-hero",
  "onboarding-2-hero",
  "onboarding-3-hero",
  "onboarding-4-hero",
  "onboarding-5-hero",
];

ws.on("open", function open() {
  console.log("✓ Connected to TalkToFigma\n");

  // Join the channel
  console.log(`🔌 Joining channel ${CHANNEL_ID}...`);
  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
});

ws.on("message", function message(data) {
  try {
    const response = JSON.parse(data.toString());

    // Handle channel join confirmation
    if (
      response.type === "system" &&
      response.message &&
      response.message.includes("Joined channel")
    ) {
      isJoined = true;
      console.log("✓ Successfully joined channel\n");

      // Request list of nodes
      console.log("📋 Requesting list of Figma nodes...");
      ws.send(
        JSON.stringify({
          type: "request",
          channel: CHANNEL_ID,
          action: "list_nodes",
        }),
      );

      // Also try alternative formats
      setTimeout(() => {
        ws.send(
          JSON.stringify({
            type: "message",
            channel: CHANNEL_ID,
            content: "list nodes",
          }),
        );
      }, 500);

      setTimeout(() => {
        ws.send(
          JSON.stringify({
            type: "command",
            channel: CHANNEL_ID,
            command: "GET_SELECTION",
          }),
        );
      }, 1000);

      return;
    }

    // Handle nodes list
    if (response.nodes || response.selection || response.layers) {
      const nodes =
        response.nodes || response.selection || response.layers || [];
      console.log(`\n✓ Found ${nodes.length} nodes/frames\n`);

      if (nodes.length === 0) {
        console.log("⚠️  No nodes found. Please:");
        console.log("   1. Open your Figma file");
        console.log("   2. Select the hero frames you want to export");
        console.log("   3. Run this script again\n");
        ws.close();
        return;
      }

      // List all nodes
      console.log("Available nodes:");
      nodes.forEach((node, i) => {
        console.log(
          `   ${i + 1}. ${node.name || node.id} (${node.type || "unknown"})`,
        );
      });

      // Filter and export hero nodes
      const heroNodes = nodes
        .filter((node) => node.name && /hero|onboarding.*\d/i.test(node.name))
        .slice(0, 5);

      if (heroNodes.length === 0) {
        console.log(
          "\n⚠️  No hero nodes found. Exporting first 5 nodes as heroes...",
        );
        heroNodes.push(...nodes.slice(0, 5));
      }

      console.log(`\n📦 Exporting ${heroNodes.length} hero illustrations:\n`);
      heroNodes.forEach((node, i) => {
        console.log(`   ${i + 1}. ${node.name || heroNames[i]}`);

        // Request export
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              type: "export",
              channel: CHANNEL_ID,
              nodeId: node.id,
              format: "SVG",
              scale: 1,
              filename: heroNames[i],
            }),
          );
        }, i * 300);
      });

      return;
    }

    // Handle export response
    if (response.type === "export" || response.svg || response.svgData) {
      const svgData = response.svg || response.svgData || response.data;
      const filename =
        response.filename ||
        heroNames[exportedCount] ||
        `hero-${exportedCount + 1}`;

      if (svgData) {
        const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
        fs.writeFileSync(filePath, svgData);
        exportedCount++;
        console.log(`✅ Exported: ${filename}.svg`);

        if (exportedCount >= heroNames.length) {
          console.log(
            `\n🎉 Successfully exported all ${exportedCount} hero images!`,
          );
          console.log(`📁 Saved to: ${OUTPUT_DIR}\n`);
          ws.close();
        }
      }
      return;
    }

    // Log other responses for debugging
    if (response.type && response.type !== "system") {
      console.log(
        `📨 ${response.type}:`,
        JSON.stringify(response).substring(0, 100),
      );
    }
  } catch (err) {
    const msg = data.toString();
    if (msg.includes("<svg")) {
      // Raw SVG data
      const filename = heroNames[exportedCount] || `hero-${exportedCount + 1}`;
      const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
      fs.writeFileSync(filePath, msg);
      exportedCount++;
      console.log(`✅ Exported: ${filename}.svg`);

      if (exportedCount >= heroNames.length) {
        console.log(
          `\n🎉 Successfully exported all ${exportedCount} hero images!`,
        );
        ws.close();
      }
    }
  }
});

ws.on("error", function error(err) {
  console.error("\n❌ WebSocket error:", err.message);
  console.log("\n💡 Make sure:");
  console.log("   1. Figma Desktop app is running");
  console.log("   2. TalkToFigma plugin is installed and active");
  console.log("   3. Your Figma file is open");
  console.log(`   4. Channel ${CHANNEL_ID} is active\n`);
  process.exit(1);
});

ws.on("close", function close() {
  if (exportedCount > 0) {
    console.log(`\n✅ Exported ${exportedCount} files to ${OUTPUT_DIR}\n`);
  } else if (isJoined) {
    console.log("\n⚠️  Channel joined but no files exported.");
    console.log(
      "💡 Try selecting the hero frames in Figma Desktop and run again.\n",
    );
  }
  process.exit(0);
});

// Timeout
setTimeout(() => {
  if (!isJoined) {
    console.log("\n⏱️  Timeout: Could not join channel");
  } else if (exportedCount === 0) {
    console.log("\n⏱️  Timeout: No exports completed");
    console.log("💡 Make sure the hero frames are selected in Figma Desktop\n");
  }
  ws.close();
}, 20000);
