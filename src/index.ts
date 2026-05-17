import type { JSONCanvas } from 'json-canvas-viewer';
import { Plugin, FileView } from 'obsidian';
import t from '@/i18n';
import ExportModal from './ExportModal';
import './styles.css';

export default class WebDAVSyncPlugin extends Plugin {
	onload() {
		this.addCommand({
			checkCallback: (checking) => {
				const view = this.app.workspace.getActiveViewOfType(FileView);
				if (view?.getViewType() === 'canvas' && view.file) {
					if (checking) return true;
					new ExportModal(
						this.app,
						(view as unknown as { canvas: { data: JSONCanvas } }).canvas.data,
						view.file.path,
					).open();
				}
			},
			icon: 'refresh-cw',
			id: 'export-to-svg',
			name: t('exportToSVG'),
		});
	}
}
