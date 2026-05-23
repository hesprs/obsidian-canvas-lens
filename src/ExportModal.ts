import type CanvasLens from '@';
import type { JSONCanvas } from 'json-canvas-viewer';
import { Modal, Setting } from 'obsidian';
import type { Settings } from '@/settings';
import PostProcessor from '@/CanvasPostProcessor';
import t from '@/i18n';
import ensureAvailable from '@/utils/ensure-available';
import renderToString from '@/utils/render-to-string';
import CanvasComponent from './CanvasComponent';

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
	component?: CanvasComponent<[typeof PostProcessor]>;

	private readonly generatePath = {
		custom: () => {
			const basename = this.filePath.split('/').pop();
			const folder = this.settings.customExportFolder;
			return `${folder === '/' ? '' : folder}${basename?.slice(0, basename.lastIndexOf('.'))}.svg`;
		},
		sameFolder: () => `${this.filePath.slice(0, this.filePath.lastIndexOf('.'))}.svg`,
	};

	onOpen() {
		this.component = new CanvasComponent(this.contentEl, {
			app: this.app,
			canvas: this.canvas,
			modules: [PostProcessor],
			path: this.filePath,
		});
		this.component.canvasEl?.addClass('mb-4');
		if (this.settings.noExportModal) {
			const loadingDiv = this.contentEl.createDiv({
				cls: 'w-100% text-align-center',
				text: t('rendering'),
			});
			this.contentEl.appendChild(loadingDiv);
			setTimeout(() => void this.export(), 100);
		} else
			new Setting(this.contentEl).addButton((button) =>
				button.setButtonText(t('exportToSVG')).setCta().onClick(this.export),
			);
	}

	export = async () => {
		const { viewer, canvasEl } = this.component ?? {};
		if (!canvasEl || !viewer) return;
		const path = this.generatePath[this.settings.defaultExportLocation]();
		await ensureAvailable(path, this.app.vault);
		viewer.postProcess();
		const string = await renderToString(canvasEl);
		await this.app.vault.create(path, string);
		this.close();
	};

	onClose() {
		this.component?.unload();
		this.component = undefined;
	}
}
