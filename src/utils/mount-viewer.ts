import type {
	JSONCanvas,
	GeneralModuleCtor,
	JSONCanvasViewerInterface,
	Options,
} from 'json-canvas-viewer';
import type { App } from 'obsidian';
import { JSONCanvasViewer } from 'json-canvas-viewer';
import { MarkdownRenderer } from 'obsidian';
import interpretPath from './interpret-path';
import NodeComponent from './node-to-component';

type MountOptions<M extends Array<GeneralModuleCtor>> = {
	canvas: JSONCanvas;
	app: App;
	path: string;
	host: HTMLElement;
	lazy?: boolean;
	modules?: M;
};

export default function mountViewer<M extends Array<GeneralModuleCtor>>({
	canvas,
	app,
	path,
	host,
	lazy = false,
	modules,
}: MountOptions<M>): JSONCanvasViewerInterface<M> {
	const component = new NodeComponent();
	const attachments: Record<string, string> = {};
	for (const node of canvas.nodes || []) {
		if (node.type !== 'file') continue;
		const file = interpretPath(node.file, app, path);
		if (!file) continue;
		attachments[node.file] = app.vault.adapter.getResourcePath(file.path);
	}
	return new JSONCanvasViewer(
		{
			attachments,
			canvas,
			container: host,
			loading: lazy ? 'lazy' : 'normal',
			nodeComponents: {
				markdown: async ({ container, content }) => {
					container.addClass('px-4');
					const response = await fetch(content);
					const result = await response.text();
					await MarkdownRenderer.render(app, result, container, path, component);
				},
				text: async ({ container, content }) => {
					container.addClass('px-4');
					await MarkdownRenderer.render(app, content, container, path, component);
				},
			},
			theme: app.isDarkMode() ? 'dark' : 'light',
		} as Options<M>,
		modules,
	);
}
