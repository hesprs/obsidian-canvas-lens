import { App, MarkdownView } from 'obsidian';
import getAspectRatio from './utils/get-aspect-ratio';
import getCanvasFromFile from './utils/get-canvas-from-file';
import interpretPath from './utils/interpret-path';
import mountViewer from './utils/mount-viewer';

export default async function embedCanvas(element: HTMLElement, app: App) {
	for (const embed of element.querySelectorAll('.internal-embed')) {
		const src = embed.getAttribute('src');
		if (!src) continue;
		const file = interpretPath(src, app);
		if (file?.extension !== 'canvas') continue;
		const canvas = await getCanvasFromFile(file, app);
		embed.removeClasses(['canvas-embed', 'inline-embed']);
		(embed as HTMLElement).style.aspectRatio = getAspectRatio(canvas);
		embed.addEventListener('click', (e) => e.stopPropagation(), { capture: true });
		const activeView = app.workspace.getActiveViewOfType(MarkdownView);
		const viewer = mountViewer({
			app,
			canvas,
			component: activeView ?? undefined,
			host: embed as HTMLElement,
			loading: 'lazy',
			path: file.path,
		});
		if (activeView) activeView.register(viewer.dispose);
	}
}
