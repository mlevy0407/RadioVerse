# RadioVerse

Explore a 3D Earth and listen to a curated selection of real radio stations. RadioVerse is a static frontend-only university project: there is no backend, database, radio station API, account, or API key.

## Run locally

On Windows, open this folder in VS Code and run the **Serve RadioVerse** task from **Terminal > Run Task**, or start the included static server in a PowerShell terminal:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ./serve.ps1
```

Alternatively, if Python is installed, run:

```sh
python -m http.server 8000
```

Visit `http://localhost:8000`. On Windows, use `py -m http.server 8000` if `python` is unavailable. You can also use VS Code's Live Server extension. An internet connection is required for Globe.GL, the Earth textures, fonts, icons, and the live streams. The PowerShell server is for local development only and is not part of the deployed app.

## Publish on GitHub Pages

Push these files to a GitHub repository. Under **Settings > Pages**, choose **Deploy from a branch**, select your branch and the root folder, and save. GitHub will provide the published URL. All project paths are relative, so the site also works under a repository subpath.

## How it works

- `index.html` contains the page and accessible controls.
- `style.css` provides the responsive design and animations.
- `script.js` contains the station array, Globe.GL setup, player, filters, discovery, and localStorage favorites.
- `serve.ps1` and `.vscode/tasks.json` provide an optional Windows development server and launch task.
- Globe.GL and Lucide are loaded from public CDNs. Earth textures come from the Three Globe example assets.
- Station coordinates represent their city or broadcast location, not the listener's location. Select a marker or a list entry, then press play. Favorites are saved only in the current browser.

## Stream limitations

Station streams are operated by third parties. URLs, availability, formats, and geographic restrictions can change without notice; a station listed here is not guaranteed to be online. Browsers can also block mixed-content streams or unsupported formats. When a stream fails, try another station. This project uses HTTPS stream URLs where available and never simulates playback. To update the collection, edit the `stations` array in `script.js` with real direct HTTPS streams and their coordinates.