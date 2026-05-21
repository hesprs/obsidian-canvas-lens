import type CanvasLens from '@';
import type { App } from 'obsidian';
import { PluginSettingTab } from 'obsidian';

export type Settings = {
	substituteDefaultEmbed: boolean;
	defaultSvgLocation: 'same-folder' | 'custom';
	customSvgLocation: string;
	noExportModal: boolean;
};

export class SettingTab extends PluginSettingTab {
	constructor(private readonly plugin: CanvasLens) {
		super(plugin.app, plugin);
	}

	display() {}
}
