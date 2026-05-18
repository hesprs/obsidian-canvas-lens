import type { JSONCanvas, JSONCanvasViewerInterface } from 'json-canvas-viewer';
import type { App } from 'obsidian';
import { JSONCanvasViewer } from 'json-canvas-viewer';
import { Modal, MarkdownRenderer, Setting } from 'obsidian';
import t from './i18n';
import PostProcessor from './PostProcessor';
import renderToString from './render';
import interpretPath from './utils/interpret-path';
import NodeComponent from './utils/node-to-component';

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
		const attachments: Record<string, string> = {};
		for (const node of this.canvas.nodes || []) {
			if (node.type !== 'file') continue;
			const file = interpretPath(node.file, this.app);
			if (!file) continue;
			attachments[node.file] = this.app.vault.adapter.getResourcePath(file.path);
		}
		const canvasEl = this.contentEl.createDiv({
			cls: 'h-60vh w-100% rounded-xl overflow-hidden',
		});
		this.viewer = new JSONCanvasViewer(
			{
			    attachments,
				canvas: this.canvas,
				container: canvasEl,
				nodeComponents: {
					text: async ({ container, content }) => {
						container.addClass('px-4');
						await MarkdownRenderer.render(
							this.app,
							content,
							container,
							this.filePath,
							new NodeComponent(),
						);
					},
				},
				theme: this.app.isDarkMode() ? 'dark' : 'light',
			},
			[PostProcessor],
		);
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
	}
}
