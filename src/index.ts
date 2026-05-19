import type { JSONCanvas } from 'json-canvas-viewer';
import { fetchCanvas } from 'json-canvas-viewer';
import { Plugin, FileView } from 'obsidian';
import t from '@/i18n';
import ExportModal from './ExportModal';
import './styles.css';
import interpretPath from './utils/interpret-path';
import mountViewer from './utils/mount-viewer';

export default class WebDAVSyncPlugin extends Plugin {
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
		this.registerMarkdownPostProcessor(this.processMarkdown);
	}

	private readonly processMarkdown = async (element: HTMLElement) => {
		for (const embed of element.querySelectorAll('.internal-embed')) {
			const src = embed.getAttribute('src');
			if (!src) continue;
			const file = interpretPath(src, this.app);
			if (file?.extension !== 'canvas') continue;
			embed.addClass('aspect-ratio-16/9');
			embed.addEventListener('click', (e) => e.stopPropagation(), { capture: true });
			mountViewer({
				app: this.app,
				canvas: await fetchCanvas(
					this.app.vault.getResourcePath(file) as `${string}.canvas`,
				),
				host: embed as HTMLElement,
				lazy: true,
				modules: [],
				path: file.path,
			});
		}
	};
}
