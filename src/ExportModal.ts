import type { JSONCanvas, JSONCanvasViewerInterface } from 'json-canvas-viewer';
import type { App } from 'obsidian';
import { Modal, Setting } from 'obsidian';
import t from '@/i18n';
import PostProcessor from '@/PostProcessor';
import renderToString from '@/render';
import mountViewer from '@/utils/mount-viewer';

export default class ExportModal extends Modal {
	constructor(
		app: App,
		private readonly canvas: JSONCanvas,
		private readonly filePath: string,
	) {
		super(app);
		this.setTitle(t('exportToSVG'));
	}

	viewer?: JSONCanvasViewerInterface<[PostProcessor]>;

	onOpen() {
		const canvasEl = this.contentEl.createDiv({
			cls: 'h-60vh w-100% rounded-xl overflow-hidden',
		});
		this.viewer = mountViewer({
			app: this.app,
			canvas: this.canvas,
			host: canvasEl,
			modules: [PostProcessor],
			path: this.filePath,
		});
		new Setting(this.contentEl).addButton((button) =>
			button
				.setButtonText(t('exportToSVG'))
				.setCta()
				.onClick(async () => {
					const path = this.filePath;
					this.viewer?.postProcess();
					const string = await renderToString(canvasEl);
					await this.app.vault.create(
						`${path.slice(0, path.lastIndexOf('.'))}.svg`,
						string,
					);
					this.close();
				}),
		);
	}

	onClose() {
		this.viewer?.dispose();
		this.viewer = undefined;
	}
}
