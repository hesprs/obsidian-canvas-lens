import type { BaseArgs, Options as BaseOptions } from 'json-canvas-viewer';
import { BaseModule, internal } from 'json-canvas-viewer';
import { App, setIcon, TFile } from 'obsidian';
import t from '@/i18n';

type Options = {
	file: TFile;
	app: App;
} & BaseOptions;

export default class CanvasBadge extends BaseModule<Options> {
	badge?: HTMLDivElement;

	constructor(...args: BaseArgs) {
		super(...args);
		this.badge = createDiv({ cls: 'JCV-border-shadow-bg JCV-badge' });
		setIcon(this.badge, 'layout-dashboard');
		const text = createDiv({ cls: 'ml-2', text: t('canvas') });
		this.badge.appendChild(text);
		this.container.get(internal.DataManager).data.container.appendChild(this.badge);
		this.badge.addEventListener('pointerup', this.open);
		this.onDispose(this.dispose);
	}

	private readonly open = () => {
		const { app, file } = this.options;
		void app.workspace.getLeaf(false).openFile(file);
	};

	private readonly dispose = () => {
		this.badge?.removeEventListener('pointerup', this.open);
		this.badge?.remove();
		this.badge = undefined;
	};
}
