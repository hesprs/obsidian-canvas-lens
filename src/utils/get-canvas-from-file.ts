import type { JSONCanvas } from 'json-canvas-viewer';
import type { App, TFile } from 'obsidian';
import { fetchCanvas } from 'json-canvas-viewer';

export default async function getCanvasFromFile(file: TFile, app: App): Promise<JSONCanvas> {
	return await fetchCanvas(app.vault.getResourcePath(file) as `${string}.canvas`);
}
