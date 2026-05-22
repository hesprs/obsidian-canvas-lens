import type CanvasLens from '@';
import type { JSONCanvas, JSONCanvasViewerInterface } from 'json-canvas-viewer';
import { Modal, Setting } from 'obsidian';
import type { Settings } from '@/settings';
import t from '@/i18n';
import ensureAvailable from '@/utils/ensure-parents';
import getAspectRatio from '@/utils/get-aspect-ratio';
import mountViewer from '@/utils/mount-viewer';
import renderToString from '@/utils/render-to-string';
import PostProcessor from '@/viewer-modules/CanvasPostProcessor';

export default class ExportModal extends Modal {
	constructor(
		plugin: CanvasLens,
		private readonly canvas: JSONCanvas,
		private readonly filePath: string,
	) {
		super(plugin.app);
		this.setTitle(t('exportToSVG'));
		this.settings = plugin.settings;
	}

	settings: Settings;
	viewer?: JSONCanvasViewerInterface<[PostProcessor]>;
	canvasEl?: HTMLElement;

	private readonly generatePath = {
		custom: () => {
			const basename = this.filePath.split('/').pop();
			const folder = this.settings.customExportFolder;
			return `${folder === '/' ? '' : folder}${basename?.slice(0, basename.lastIndexOf('.'))}.svg`;
		},
		sameFolder: () => `${this.filePath.slice(0, this.filePath.lastIndexOf('.'))}.svg`,
	};

	onOpen() {
		this.canvasEl = this.contentEl.createDiv({ cls: 'w-100% mb-4' });
		this.canvasEl.style.aspectRatio = getAspectRatio(this.canvas);
		this.viewer = mountViewer({
			app: this.app,
			canvas: this.canvas,
			host: this.canvasEl,
			modules: [PostProcessor],
			path: this.filePath,
		});
		if (this.settings.noExportModal) {
			const loadingDiv = this.contentEl.createDiv({ cls: 'w-100% text-align-center', text: t('rendering') });
			this.contentEl.appendChild(loadingDiv);
			setTimeout(() => void this.export(), 100);
		} else
			new Setting(this.contentEl).addButton((button) =>
				button.setButtonText(t('exportToSVG')).setCta().onClick(this.export),
			);
	}

	export = async () => {
		if (!this.canvasEl) return;
		const path = this.generatePath[this.settings.defaultExportLocation]();
		await ensureAvailable(path, this.app.vault);
		this.viewer?.postProcess();
		const string = await renderToString(this.canvasEl);
		await this.app.vault.create(path, string);
		this.close();
	};

	onClose() {
		this.viewer?.dispose();
		this.viewer = undefined;
	}
}
