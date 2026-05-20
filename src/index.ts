import type { JSONCanvas } from 'json-canvas-viewer';
import { Plugin, FileView, MarkdownView } from 'obsidian';
import t from '@/i18n';
import './styles.css';
import embedCanvas from './canvas-embed';
import ExportModal from './ExportModal';

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
		this.registerMarkdownPostProcessor((el) => void embedCanvas(el, this.app));
		// Enable embed in live preview
		this.registerEvent(
			this.app.workspace.on('active-leaf-change', (leaf) => {
				if (!leaf) return;
				const view = leaf.view;
				const vault = this.app.vault as unknown as { config: { livePreview: boolean } };
				if (
					!(view instanceof MarkdownView) ||
					view.getMode() !== 'source' ||
					!vault.config.livePreview
				)
					return;
				void embedCanvas(view.contentEl, this.app);
			}),
		);
	}
}
