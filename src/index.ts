import type { JSONCanvas } from 'json-canvas-viewer';
import { Plugin, FileView } from 'obsidian';
import t from '@/i18n';
import './styles.css';
import type { Settings } from './settings';
import ExportModal from './ExportModal';
import { SettingTab } from './settings';

export default class CanvasLens extends Plugin {
	settings: Settings = {
		customExportFolder: '/',
		defaultExportLocation: 'sameFolder',
		noExportModal: false,
	};
	protected disconnectFunc?: () => void;

	saveSettings = async () => this.saveData(this.settings);

	async onload() {
		Object.assign(this.settings, await this.loadData());
		this.addCommand({
			checkCallback: (checking) => {
				const view = this.app.workspace.getActiveViewOfType(FileView);
				if (view?.getViewType() === 'canvas' && view.file) {
					if (checking) return true;
					new ExportModal(
						this,
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
		this.addSettingTab(new SettingTab(this));
	}
}
