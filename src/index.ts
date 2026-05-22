import type { JSONCanvas, JSONCanvasViewerInterface } from 'json-canvas-viewer';
import { Plugin, FileView } from 'obsidian';
import t from '@/i18n';
import './styles.css';
import type { Settings } from './settings';
import ExportModal from './ExportModal';
import { SettingTab } from './settings';
import embedCanvas from './utils/embed-canvas';
import watchClass from './utils/watch-class';

export default class CanvasLens extends Plugin {
	private readonly trackedCanvas = new Map<HTMLElement, JSONCanvasViewerInterface>();

	settings: Settings = {
		customExportFolder: '/',
		defaultExportLocation: 'sameFolder',
		noExportModal: false,
		substituteDefaultEmbed: true,
	};
	protected disconnectFunc?: () => void;

	saveSettings = async () => this.saveData(this.settings);
	disconnect = () => {
		activeDocument.body.removeClass('canvas-lens-substitute');
		this.disconnectFunc?.();
		this.disconnectFunc = undefined;
		this.trackedCanvas.forEach((value) => value.dispose());
		this.trackedCanvas.clear();
	};
	connect = () => {
		activeDocument.body.addClass('canvas-lens-substitute');
		this.disconnectFunc = watchClass(activeDocument.body, [
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
	};

	async onload() {
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
		Object.assign(this.settings, await this.loadData());
		if (this.settings.substituteDefaultEmbed) this.connect();
	}

	onunload() {
		this.disconnect();
	}
}
