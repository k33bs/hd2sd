#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Load stratagem data from external JSON (sorted by dept per wiki)
const allStratagems = JSON.parse(
	fs.readFileSync("stratagems.data.json", "utf8")
);

// Build page list dynamically and reset previous generated artifacts
// We run inside the current sdProfile directory; its subfolder "profiles/" holds page folders.
const PROFILES_DIR = path.join(process.cwd(), "profiles");

// Helper to make a folder name like XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX.sdProfile
function generateProfileFolderName() {
	const seg = (n) => randomToken(n);
	return `${seg(8)}-${seg(4)}-${seg(4)}-${seg(4)}-${seg(12)}.sdProfile`;
}

// Clean previous generated pages under this sdProfile and root Images
const currentProfileId = path.basename(process.cwd());

// Always remove ALL subfolders within profiles/ to avoid stale pages
function removeAllSubfolders(baseDir) {
	try {
		fs.mkdirSync(baseDir, { recursive: true });
		const entries = fs.readdirSync(baseDir, { withFileTypes: true });
		for (const ent of entries) {
			if (ent.isDirectory()) {
				try {
					fs.rmSync(path.join(baseDir, ent.name), {
						recursive: true,
						force: true,
					});
				} catch {}
			}
		}
	} catch {}
}

removeAllSubfolders(PROFILES_DIR);
try {
	fs.rmSync(path.join(process.cwd(), "Images"), {
		recursive: true,
		force: true,
	});
} catch {}

const pagesCount = Math.ceil(allStratagems.length / 15) || 1;
const generatedPageIds = [];
const pageFiles = ["manifest.json"];

for (let i = 1; i < pagesCount; i++) {
	const folderName = generateProfileFolderName();
	generatedPageIds.push(folderName);
	const folderPath = path.join(PROFILES_DIR, folderName);
	try {
		fs.mkdirSync(folderPath, { recursive: true });
	} catch {}
	try {
		fs.mkdirSync(path.join(folderPath, "Images"), { recursive: true });
	} catch {}
	try {
		fs.writeFileSync(
			path.join(folderPath, ".generated-by-stratagem-generator"),
			new Date().toISOString()
		);
	} catch {}
	pageFiles.push(path.join(folderPath, "manifest.json"));
}

// Key mappings
const keyMap = { s: 1, w: 13, a: 0, d: 2 };

const positions = [
	"0,0",
	"1,0",
	"2,0", // Row 1 (buttons 1,2,3)
	"0,1",
	"1,1",
	"2,1", // Row 2 (buttons 4,5,6)
	"0,2",
	"1,2",
	"2,2", // Row 3 (buttons 7,8,9)
	"0,3",
	"1,3",
	"2,3", // Row 4 (buttons 10,11,12)
	"0,4",
	"1,4",
	"2,4", // Row 5 (buttons 13,14,15)
];

// Icon source directory and slugging helper
const stratagemIconsDir = path.join(process.cwd(), "stratagems");
const slugify = (s) =>
	(s || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

function resolveIconFilename(stratagem) {
	// Reference images by slug basename; do not create/copy in stratagems
	const slug = slugify(stratagem.name);
	return `${slug}.png`;
}

// Random uppercase A-Z + 0-9 token for hashed filenames
function randomToken(len = 28) {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let out = "";
	for (let i = 0; i < len; i++)
		out += alphabet[Math.floor(Math.random() * alphabet.length)];
	return out;
}

// Copy an icon to Images folder under a hashed basename (no spaces)
function copyIconTo(imagesDestDir, srcFilename, destBasename) {
	try {
		fs.mkdirSync(imagesDestDir, { recursive: true });
	} catch {}
	const src = path.join(stratagemIconsDir, srcFilename);
	const dest = path.join(imagesDestDir, destBasename);
	try {
		let shouldCopy = true;
		try {
			const s = fs.statSync(src);
			const d = fs.statSync(dest);
			shouldCopy = s.mtimeMs > d.mtimeMs || s.size !== d.size;
		} catch {
			shouldCopy = true;
		}
		if (shouldCopy) fs.copyFileSync(src, dest);
	} catch (e) {
		console.warn(
			`⚠️  Failed to copy icon ${srcFilename} -> ${imagesDestDir}/${destBasename}:`,
			e.message
		);
	}
}

// Generate unique ID
function generateId() {
	return Array.from(
		{ length: 8 },
		() => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
	).join("");
}

// Generate complete stratagem button
function generateStratagemButton(stratagem, position, imageBasename) {
	const actions = [];

	// Ctrl lift (HOLD)
	actions.push({
		ActionID: `${generateId()}-${generateId()}-${generateId()}-${generateId()}-${generateId()}`,
		Controller: "",
		Name: "Hotkey",
		Settings: {
			Coalesce: true,
			Hotkeys: [
				{
					KeyCmd: false,
					KeyCtrl: true,
					KeyModifiers: 65536,
					KeyOption: false,
					KeyShift: false,
					NativeCode: -1,
					QTKeyCode: -1,
					RKeyCmd: false,
					RKeyCtrl: false,
					RKeyOption: false,
					RKeyShift: false,
					VKeyCode: -1,
				},
				{
					KeyCmd: false,
					KeyCtrl: false,
					KeyModifiers: 65536,
					KeyOption: false,
					KeyShift: false,
					NativeCode: -1,
					QTKeyCode: -1,
					RKeyCmd: false,
					RKeyCtrl: false,
					RKeyOption: false,
					RKeyShift: false,
					VKeyCode: -1,
				},
				{
					KeyCmd: false,
					KeyCtrl: false,
					KeyModifiers: 65536,
					KeyOption: false,
					KeyShift: false,
					NativeCode: -1,
					QTKeyCode: -1,
					RKeyCmd: false,
					RKeyCtrl: false,
					RKeyOption: false,
					RKeyShift: false,
					VKeyCode: -1,
				},
			],
			delay: 0,
			executionTimes: 1,
			hotkeyRadioButtonIndex: 3,
		},
		State: 0,
		States: [
			{
				FontSize: 8,
				Image: "Images/btn_custom_trigger_hotkey",
				ShowTitle: false,
				Title: "ctrl lift",
			},
		],
		UUID: "com.hotspot.streamdock.system.hotkey",
	});

	// Add key sequence
	for (const key of stratagem.sequence) {
		actions.push({
			ActionID: `${generateId()}-${generateId()}-${generateId()}-${generateId()}-${generateId()}`,
			Controller: "",
			Name: "Hotkey",
			Settings: {
				Coalesce: true,
				Hotkeys: [
					{
						KeyCmd: false,
						KeyCtrl: false,
						KeyModifiers: 65536,
						KeyOption: false,
						KeyShift: false,
						NativeCode: -1,
						QTKeyCode: -1,
						RKeyCmd: false,
						RKeyCtrl: false,
						RKeyOption: false,
						RKeyShift: false,
						VKeyCode: keyMap[key],
					},
					{
						KeyCmd: false,
						KeyCtrl: false,
						KeyModifiers: 65536,
						KeyOption: false,
						KeyShift: false,
						NativeCode: -1,
						QTKeyCode: -1,
						RKeyCmd: false,
						RKeyCtrl: false,
						RKeyOption: false,
						RKeyShift: false,
						VKeyCode: -1,
					},
					{
						KeyCmd: false,
						KeyCtrl: false,
						KeyModifiers: 65536,
						KeyOption: false,
						KeyShift: false,
						NativeCode: -1,
						QTKeyCode: -1,
						RKeyCmd: false,
						RKeyCtrl: false,
						RKeyOption: false,
						RKeyShift: false,
						VKeyCode: -1,
					},
				],
				delay: 20,
				executionTimes: 1,
				hotkeyRadioButtonIndex: 0,
			},
			State: 0,
			States: [{ Image: "Images/btn_custom_trigger_hotkey", Title: key }],
			UUID: "com.hotspot.streamdock.system.hotkey",
		});
	}

	// Ctrl press (RELEASE)
	actions.push({
		ActionID: `${generateId()}-${generateId()}-${generateId()}-${generateId()}-${generateId()}`,
		Controller: "",
		Name: "Hotkey",
		Settings: {
			Coalesce: true,
			Hotkeys: [
				{
					KeyCmd: false,
					KeyCtrl: true,
					KeyModifiers: 65536,
					KeyOption: false,
					KeyShift: false,
					NativeCode: -1,
					QTKeyCode: -1,
					RKeyCmd: false,
					RKeyCtrl: false,
					RKeyOption: false,
					RKeyShift: false,
					VKeyCode: -1,
				},
				{
					KeyCmd: false,
					KeyCtrl: false,
					KeyModifiers: 65536,
					KeyOption: false,
					KeyShift: false,
					NativeCode: -1,
					QTKeyCode: -1,
					RKeyCmd: false,
					RKeyCtrl: false,
					RKeyOption: false,
					RKeyShift: false,
					VKeyCode: -1,
				},
				{
					KeyCmd: false,
					KeyCtrl: false,
					KeyModifiers: 65536,
					KeyOption: false,
					KeyShift: false,
					NativeCode: -1,
					QTKeyCode: -1,
					RKeyCmd: false,
					RKeyCtrl: false,
					RKeyOption: false,
					RKeyShift: false,
					VKeyCode: -1,
				},
			],
			delay: 0,
			executionTimes: 1,
			hotkeyRadioButtonIndex: 2,
		},
		State: 0,
		States: [
			{
				FontSize: 8,
				Image: "Images/btn_custom_trigger_hotkey",
				ShowTitle: false,
				Title: "ctrl press",
			},
		],
		UUID: "com.hotspot.streamdock.system.hotkey",
	});

	return {
		[position]: {
			ActionID: `${generateId()}-${generateId()}-${generateId()}-${generateId()}-${generateId()}`,
			Actions: actions,
			Controller: "Keypad",
			Name: "Multi Action",
			Settings: {
				cycleDelay: 100,
				cycleMode: 0,
				cycleNumber: 1,
				enablingCycle: 0,
			},
			State: 0,
			States: [
				{
					FontSize: 8,
					Image: imageBasename || "Images/btn_multiAction",
					ShowTitle: false,
					Title: stratagem.name,
				},
			],
			UUID: "com.hotspot.streamdock.multiactions.routine",
		},
	};
}

console.log("🎮 Helldivers 2 Stratagem Generator");
console.log("===================================================");
console.log(`Total stratagems: ${allStratagems.length}`);

// Process each page - distribute 15 stratagems per page sequentially
for (let pageIndex = 0; pageIndex < pageFiles.length; pageIndex++) {
	const pageFile = pageFiles[pageIndex];
	const startIdx = pageIndex * 15;
	const endIdx = Math.min(startIdx + 15, allStratagems.length);
	const pageStratagems = allStratagems.slice(startIdx, endIdx);

	console.log(`\n📄 Processing Page ${pageIndex + 1}: ${pageFile}`);
	console.log(
		`   Stratagems: ${pageStratagems.length} (indices ${startIdx}-${
			endIdx - 1
		})`
	);

	// Read existing manifest, or create a default skeleton if missing
	let manifest;
	try {
		manifest = JSON.parse(fs.readFileSync(pageFile, "utf8"));
	} catch (err) {
		manifest = {
			Actions: {},
			DeviceModel: "20GBA9901",
			DeviceUUID: "MBox-N1E",
			Name: "Helldivers 2 All Stratagems",
			Version: "1.0",
		};
	}

	// Clear existing actions but keep system buttons
	const newActions = {};

	// Keep page indicator and change page buttons; create defaults if missing
	if (manifest.Actions && manifest.Actions["0,5"]) {
		newActions["0,5"] = manifest.Actions["0,5"];
	} else {
		newActions["0,5"] = {
			ActionID: `${generateId()}-${generateId()}-${generateId()}-${generateId()}-${generateId()}`,
			Controller: "",
			Name: "Page Indicator",
			Settings: {},
			State: 0,
			States: [
				{
					FontSize: "20",
					Image: "Images/btn_pageIndicator",
					TitleAlignment: "middle",
				},
			],
			UUID: "com.hotspot.streamdock.page.indicator",
		};
	}
	if (manifest.Actions && manifest.Actions["2,5"]) {
		newActions["2,5"] = manifest.Actions["2,5"];
	} else {
		newActions["2,5"] = {
			ActionID: `${generateId()}-${generateId()}-${generateId()}-${generateId()}-${generateId()}`,
			Controller: "",
			Name: "change page",
			Settings: {},
			State: 0,
			States: [{ Image: "" }],
			UUID: "com.hotspot.streamdock.page.change",
		};
	}

	// On the first page, set the pages listing (Current + Pages array)
	if (pageIndex === 0) {
		manifest.Pages = {
			Current: currentProfileId,
			Pages: [currentProfileId, ...generatedPageIds],
		};
	}

	// Determine Images destination for this page (hashed copies)
	const pageDir = path.dirname(pageFile);
	const imagesDestDir =
		pageDir === "."
			? path.join(process.cwd(), "Images")
			: path.join(pageDir, "Images");
	const usedNames = new Set();

	// Generate stratagem buttons - fill all 15 positions for this page
	pageStratagems.forEach((stratagem, index) => {
		if (index < 15) {
			// Safety check to not exceed positions array
			const position = positions[index];
			// Resolve slug image and copy into this page's Images folder with hashed filename (no spaces)
			const icon = resolveIconFilename(stratagem);
			let hashedBasename = null;
			if (icon) {
				const ext = path.extname(icon) || ".png";
				// Ensure uniqueness per page
				do {
					hashedBasename = `${randomToken()}${ext}`;
				} while (usedNames.has(hashedBasename));
				usedNames.add(hashedBasename);
				copyIconTo(imagesDestDir, icon, hashedBasename);
			}
			const button = generateStratagemButton(
				stratagem,
				position,
				hashedBasename
			);
			Object.assign(newActions, button);
			console.log(
				`  ✅ ${stratagem.name} -> ${position} (${stratagem.sequence})`
			);
		}
	});

	// Update manifest
	manifest.Actions = newActions;

	// Write updated manifest
	try {
		fs.writeFileSync(pageFile, JSON.stringify(manifest, null, 4));
		console.log(`  💾 Updated ${pageFile}`);
	} catch (err) {
		console.error(`  ❌ Error writing ${pageFile}:`, err.message);
	}
}

console.log(
	`\n🎉 All ${allStratagems.length} stratagems distributed across ${pageFiles.length} pages!`
);
