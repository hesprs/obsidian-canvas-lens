import type { GeneralModuleCtor, JSONCanvasViewerInterface } from 'json-canvas-viewer';
import { Component } from 'obsidian';
import type { MountOptions } from './utils/mount-viewer';
import getAspectRatio from './utils/get-aspect-ratio';
import hook from './utils/hook';
import mountViewer from './utils/mount-viewer';

export default class NodeComponent<M extends Array<GeneralModuleCtor> = []> extends Component {
	private readonly unloadHook = hook();
	viewer?: JSONCanvasViewerInterface<M>;
	canvasEl?: HTMLDivElement;

	constructor(target: Element, options: Omit<MountOptions<M>, 'component' | 'host'>) {
		super();
		this.canvasEl = target.createDiv({ cls: 'w-100%' });
		this.canvasEl.style.aspectRatio = getAspectRatio(options.canvas);
		this.viewer = mountViewer({ ...options, component: this, host: this.canvasEl });
	}

	unload() {
		this.viewer?.dispose();
		this.unloadHook();
		this.unloadHook.subs.clear();
		this.canvasEl?.remove();
		this.viewer = undefined;
		this.canvasEl = undefined;
	}
	register(cb: () => any): void {
		this.unloadHook.subscribe(cb);
	}
}
