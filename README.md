# Helldivers 2 Stratagems – StreamDock Setup

Follow these steps to generate a new StreamDock Scene populated with stratagem buttons.

## Quick Start: Pre-generated Scene (No Generator)

- Download the pre-generated Scene from the Releases page.
- In StreamDock, use Import Scene to import it.
- If it doesn’t appear right away, close the app and open it again.

You can skip the generator steps below if you import the pre-generated Scene.

## What You’ll Need

- Node.js installed (to run the generator)
- The following files/folders ready to copy:
  - `stratagems.data.json`
  - `stratagems/` (folder containing all stratagem icon images)
  - `stratagems.streamdock.generator.js` (the generator script)

## Steps

1. Create a new Scene in the StreamDock app.

   - Give it a memorable name (you’ll locate its folder next by looking into its manifest.json).

2. Quit the StreamDock app completely (ensure it is not running in the menu bar).

3. Open the Scene’s profile folder on disk:

   - Path template (replace `username` and the Scene folder):
     `/Users/username/Library/Application Support/HotSpot/StreamDock/profiles/STREAMDOCK-GENERATED-SCENENAME.sdProfile/`
   - The actual folder name is often auto-generated (e.g., a GUID-like name). If unsure which folder belongs to your new Scene, check the most recently modified folder or open its `manifest.json` and verify the `Name`.

4. Copy the content into that Scene folder:

   - Drop `stratagems.data.json`
   - Drop the entire `stratagems/` images folder
   - Drop `stratagems.streamdock.generator.js`

5. Run the generator from inside the Scene folder:

   - Example (macOS):

     ```sh
     cd "/Users/username/Library/Application Support/HotSpot/StreamDock/profiles/STREAMDOCK-GENERATED-SCENENAME.sdProfile"
     node stratagems.streamdock.generator.js
     ```

   - What it does:
     - Deletes all subfolders under `profiles/` for a clean slate
     - Rebuilds `manifest.json` and page folders
     - Copies icons into the proper `Images/` locations

6. Open the StreamDock app.

7. Close the StreamDock app again, then open it one more time.
   - This double restart ensures the app refreshes the new Scene and assets.

After the second launch, the new Scene should be visible and populated with the stratagem buttons.
Now you can create yet another scene for your specific layout and just copy paste over your Stratagems into your custom load-out scene.

## Tips & Troubleshooting

- Path with spaces: Always quote the path when using the terminal (as shown above).
- Can’t find the Scene folder: Sort the `profiles/` directory by “Date Modified”, or open each `manifest.json` and check the `Name`.
- Icons missing: Ensure the `stratagems/` folder (with PNGs) is placed alongside the generator and `stratagems.data.json` in the Scene folder before running the generator.
- Nothing changed: Confirm Node.js is installed and the generator ran without errors. Re-run the generator while the StreamDock app is closed.
- Scene still not visible: Perform the open → close → open sequence again, or reboot the StreamDock device if applicable.

---

If you need different page sizes or layouts, you can adjust the generator script and re-run these steps.

## Credits

Thanks to @nvigneux for the Helldivers 2 stratagem icons (SVG) at https://github.com/nvigneux/Helldivers-2-Stratagems-icons-svg — converted to PNG for this project.

If you want to do so yourself:
```sh
brew install librsvg
fd -e svg -x rsvg-convert -o {.}.png {}
```
