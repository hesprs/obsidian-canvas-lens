import type {
	JSONCanvas,
	GeneralModuleCtor,
	JSONCanvasViewerInterface,
	Options,
} from 'json-canvas-viewer';
import type { App, Component } from 'obsidian';
import { JSONCanvasViewer } from 'json-canvas-viewer';
import { MarkdownRenderer } from 'obsidian';
import interpretPath from './interpret-path';

export type MountOptions<M extends Array<GeneralModuleCtor>> = {
	canvas: JSONCanvas;
	app: App;
	path: string;
	host: HTMLElement;
	loading?: Options['loading'];
	modules?: M;
	component: Component;
	options?: Partial<Options<M>>;
};

export default function mountViewer<M extends Array<GeneralModuleCtor> = []>({
	canvas,
	app,
	path,
	host,
	loading = 'normal',
	modules,
	component,
	options,
}: MountOptions<M>): JSONCanvasViewerInterface<M> {
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
			loading,
			nodeComponents: {
				markdown: async ({ container, content }) => {
					container.addClasses(['px-4', 'py-0.5']);
					const response = await fetch(content);
					const result = await response.text();
					await MarkdownRenderer.render(app, result, container, path, component);
				},
				text: async ({ container, content }) => {
					container.addClasses(['px-4', 'py-0.5']);
					await MarkdownRenderer.render(app, content, container, path, component);
				},
			},
			theme: app.isDarkMode() ? 'dark' : 'light',
			...options,
		} as Options<M>,
		modules,
	);
}
