import type { JSONCanvas, JSONCanvasViewerInterface } from 'json-canvas-viewer';
import { Plugin, FileView, MarkdownView } from 'obsidian';
import t from '@/i18n';
import './styles.css';
import ExportModal from './ExportModal';
import embedCanvas from './utils/embed-canvas';
import watchClass from './utils/watch-class';

export default class WebDAVSyncPlugin extends Plugin {
	trackedViews = new WeakSet<MarkdownView>();
	trackedCanvas = new WeakMap<HTMLElement, JSONCanvasViewerInterface>();
	disconnect?: () => void;

	onload() {
		this.addCommand({
			checkCallback: (checking) => {
				const view = this.app.workspace.getActiveViewOfType(FileView);
				if (view?.getViewType() === 'canvas' && view.file) {
					if (checking) return true;
					new ExportModal(
						this.app,
						structuredClone(
							(view as unknown as { canvas: { data: JSONCanvas } }).canvas.data,
						),
						view.file.path,
					).open();
				}
			},
			icon: 'refresh-cw',
			id: 'export-to-svg',
			name: t('exportToSVG'),
		});

		this.disconnect = watchClass(activeDocument.body, [
			{
				callback: async (el) => {
					const parent = el.parentElement;
					if (!parent) return;
					const viewer = await embedCanvas(parent, this.app);
					if (viewer) this.trackedCanvas.set(parent, viewer);
				},
				className: 'canvas-minimap',
				type: 'add',
			},
			{
				callback: (el) => {
					const viewer = this.trackedCanvas.get(el as HTMLElement);
					if (viewer) viewer.dispose();
					this.trackedCanvas.delete(el as HTMLElement);
				},
				className: 'canvas-embed',
				type: 'remove',
			},
		]);
	}

	onunload() {
		this.disconnect?.();
	}
}
