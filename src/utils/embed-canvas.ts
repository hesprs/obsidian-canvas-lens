import { MistouchPreventer } from 'json-canvas-viewer';
import { App, View } from 'obsidian';
import t from '@/i18n';
import CanvasBadge from '@/viewer-modules/CanvasBadge';
import getAspectRatio from './get-aspect-ratio';
import getCanvasFromFile from './get-canvas-from-file';
import interpretPath from './interpret-path';
import mountViewer from './mount-viewer';

export default async function embedCanvas(element: HTMLElement, app: App, view?: View) {
	const src = element.getAttribute('src');
	if (!src) return;
	const file = interpretPath(src, app);
	if (file?.extension !== 'canvas') return;
	const canvas = await getCanvasFromFile(file, app);
	element.style.aspectRatio = getAspectRatio(canvas);
	element.addEventListener('click', (e) => e.stopPropagation(), { capture: true });
	const viewer = mountViewer({
		app,
		canvas,
		component: view,
		host: element,
		loading: 'lazy',
		modules: [CanvasBadge, MistouchPreventer],
		options: {
			app,
			file,
			mistouchPreventerBannerText: t('clickBanner'),
			preventMistouchAtStart: true,
		},
		path: file.path,
	});
	view?.register(viewer.dispose);
	return viewer;
}
