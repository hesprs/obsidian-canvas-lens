import type { App } from 'obsidian';

export default function interpretPath(
	link: string,
	app: App,
	source = app.workspace.getActiveFile()?.path || '',
) {
	const lastIndex = link.lastIndexOf('?');
	const [cleanPath] = (lastIndex === -1 ? link : link.slice(0, lastIndex)).split(/#|\^/);
	const file = app.metadataCache.getFirstLinkpathDest(cleanPath, source);
	if (file) return file;
}
