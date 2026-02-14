const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const CHANNEL_ID = "yvy1l5t4";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");
const DATA_FILE = path.join(__dirname, "../onboarding-data.json");

console.log("🎨 Fetching onboarding data from Figma via TalkToFigma\n");

const ws = new WebSocket("ws://localhost:3055");

let onboardingData = [];
let exportCount = 0;

ws.on("open", function open() {
  console.log("✓ Connected to TalkToFigma");
  console.log("🔌 Joining channel", CHANNEL_ID + "...\n");

  ws.send(JSON.stringify({ type: "join", channel: CHANNEL_ID }));
});

ws.on("message", function message(data) {
  try {
    const response = JSON.parse(data.toString());

    if (
      response.type === "system" &&
      response.message &&
      response.message.includes("Joined")
    ) {
      console.log("✓ Joined channel successfully\n");
      console.log("📋 Requesting onboarding frames data...\n");

      // Request to get the current selection/frames
      ws.send(
        JSON.stringify({
          type: "get_frames",
          channel: CHANNEL_ID,
        }),
      );

      // Also try alternative formats
      setTimeout(() => {
        ws.send(
          JSON.stringify({
            type: "get_selection",
            channel: CHANNEL_ID,
          }),
        );
      }, 500);

      return;
    }

    // Handle frames/nodes data
    if (response.frames || response.nodes || response.selection) {
      const frames =
        response.frames || response.nodes || response.selection || [];
      console.log(`✓ Received ${frames.length} frames\n`);

      frames.forEach((frame, index) => {
        console.log(`Frame ${index + 1}: ${frame.name}`);
        console.log(`  Title: ${frame.title || frame.text || "N/A"}`);
        console.log(
          `  Description: ${frame.description || frame.subtitle || "N/A"}`,
        );

        onboardingData.push({
          index: index + 1,
          name: frame.name,
          title: frame.title || frame.text || "",
          description: frame.description || frame.subtitle || "",
          id: frame.id,
        });

        // Request SVG export for this frame
        if (frame.id) {
          setTimeout(() => {
            ws.send(
              JSON.stringify({
                type: "export",
                channel: CHANNEL_ID,
                nodeId: frame.id,
                format: "svg",
                filename: `onboarding-${index + 1}-hero`,
              }),
            );
          }, index * 300);
        }
      });

      // Save the data
      if (onboardingData.length > 0) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(onboardingData, null, 2));
        console.log(`\n✅ Saved onboarding data to ${DATA_FILE}\n`);
      }

      return;
    }

    // Handle SVG export
    if (response.type === "export" || response.svg || response.svgData) {
      const svgData = response.svg || response.svgData || response.data;
      const filename =
        response.filename || `onboarding-${exportCount + 1}-hero`;

      if (svgData) {
        const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
        fs.writeFileSync(filePath, svgData);
        exportCount++;
        console.log(`✅ Exported: ${filename}.svg (${exportCount} total)`);

        if (exportCount >= 5) {
          console.log("\n🎉 All exports complete!\n");
          ws.close();
        }
      }
    }

    // Log other responses for debugging
    if (response.type && response.type !== "system") {
      console.log("📨 Response type:", response.type);
    }
  } catch (err) {
    const msg = data.toString();
    if (msg.includes("<svg")) {
      const filename = `onboarding-${exportCount + 1}-hero`;
      const filePath = path.join(OUTPUT_DIR, `${filename}.svg`);
      fs.writeFileSync(filePath, msg);
      exportCount++;
      console.log(`✅ Exported: ${filename}.svg (${exportCount} total)`);
    }
  }
});

ws.on("error", (err) => {
  console.error("\n❌ Error:", err.message);
  console.log("\n💡 Make sure:");
  console.log("   1. Figma Desktop is running");
  console.log("   2. TalkToFigma plugin is active");
  console.log("   3. Onboarding frames are selected");
  console.log(`   4. Channel ${CHANNEL_ID} is active\n`);
  process.exit(1);
});

ws.on("close", () => {
  console.log("\n✅ Connection closed");
  if (onboardingData.length > 0) {
    console.log(`📄 Onboarding data saved to: ${DATA_FILE}`);
    console.log(`🖼️  Exported ${exportCount} hero images\n`);
  }
  process.exit(0);
});

setTimeout(() => {
  console.log("\n⏱️  Timeout");
  if (onboardingData.length === 0) {
    console.log("❌ No data received");
    console.log("\n💡 Please:");
    console.log("   1. Select the onboarding frames in Figma Desktop");
    console.log("   2. Make sure TalkToFigma plugin is running");
    console.log("   3. Try running this script again\n");
  }
  ws.close();
}, 30000);
