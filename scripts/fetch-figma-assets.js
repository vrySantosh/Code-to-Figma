const https = require("https");
const fs = require("fs");
const path = require("path");

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || "your_figma_token_here";
const FILE_KEY = process.env.FIGMA_FILE_KEY || "your_file_key_here";
const OUTPUT_DIR = path.join(__dirname, "../assets/images/figma/onboarding");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.figma.com",
      path: path,
      method: "GET",
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
      },
    };

    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchFileStructure() {
  console.log("Fetching Figma file structure...");
  console.log(`File key: ${FILE_KEY}`);

  const data = await makeRequest(`/v1/files/${FILE_KEY}`);
  return data;
}

async function findOnboardingAssets(fileData) {
  console.log("Searching for onboarding assets...");
  const assets = [];

  function traverse(node, depth = 0) {
    const name = node.name?.toLowerCase() || "";

    // Look for onboarding-related nodes
    if (name.includes("onboarding") || name.includes("hero")) {
      console.log(`  Found: ${node.name} (${node.type}) - ID: ${node.id}`);

      // Check if it looks like one of our 5 hero illustrations
      if (
        node.type === "FRAME" ||
        node.type === "COMPONENT" ||
        node.type === "INSTANCE" ||
        node.type === "GROUP"
      ) {
        assets.push({
          id: node.id,
          name: node.name,
          type: node.type,
        });
      }
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, depth + 1));
    }
  }

  traverse(fileData.document);
  return assets;
}

async function exportAssetAsSVG(nodeId, filename) {
  console.log(`Exporting ${filename}...`);

  // Get image URLs
  const imageData = await makeRequest(
    `/v1/images/${FILE_KEY}?ids=${nodeId}&format=svg`,
  );

  if (!imageData.images || !imageData.images[nodeId]) {
    throw new Error(`No image URL returned for ${nodeId}`);
  }

  const imageUrl = imageData.images[nodeId];
  console.log(`  Downloading from ${imageUrl.substring(0, 60)}...`);

  return new Promise((resolve, reject) => {
    https
      .get(imageUrl, (res) => {
        if (res.statusCode === 200) {
          const filePath = path.join(OUTPUT_DIR, filename);
          const fileStream = fs.createWriteStream(filePath);
          res.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            console.log(`  ✓ Saved to ${filename}`);
            resolve(filePath);
          });
        } else {
          reject(new Error(`Failed to download: HTTP ${res.statusCode}`));
        }
      })
      .on("error", reject);
  });
}

async function main() {
  try {
    console.log("🎨 Fetching Figma assets for Provibe onboarding...\n");

    // Fetch file structure
    const fileData = await fetchFileStructure();
    console.log(`✓ File loaded: ${fileData.name}\n`);

    // Find onboarding assets
    const assets = await findOnboardingAssets(fileData);
    console.log(`\n✓ Found ${assets.length} potential onboarding assets\n`);

    if (assets.length === 0) {
      console.log(
        "❌ No onboarding assets found. Listing top-level frames instead:\n",
      );
      const pages = fileData.document.children;
      pages.forEach((page) => {
        console.log(`\nPage: ${page.name}`);
        if (page.children) {
          page.children.forEach((frame) => {
            console.log(`  - ${frame.name} (${frame.type}) - ID: ${frame.id}`);
          });
        }
      });
      return;
    }

    // Sort by name and take first 5 that look like numbered onboarding screens
    const sortedAssets = assets
      .filter((a) => /onboarding[-\s]?\d/i.test(a.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 5);

    if (sortedAssets.length === 0) {
      console.log(
        "\n⚠️  No numbered onboarding assets found. Showing all found assets:",
      );
      assets.forEach((asset, i) => {
        console.log(`  ${i + 1}. ${asset.name} (ID: ${asset.id})`);
      });
      console.log("\nPlease manually specify which assets to export.");
      return;
    }

    console.log("Exporting SVGs:\n");

    // Export each asset
    for (let i = 0; i < sortedAssets.length; i++) {
      const asset = sortedAssets[i];
      const filename = `onboarding-${i + 1}-hero.svg`;
      await exportAssetAsSVG(asset.id.replace(":", "-"), filename);
    }

    console.log("\n✅ All assets exported successfully!");
    console.log(`📁 Location: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
