import type CanvasLens from '@';
import { PluginSettingTab, Setting } from 'obsidian';
import t from '@/i18n';
import formatFolder from './utils/format-folder';

export type Settings = {
	substituteDefaultEmbed: boolean;
	defaultExportLocation: 'sameFolder' | 'custom';
	customExportFolder: string;
	noExportModal: boolean;
};

export class SettingTab extends PluginSettingTab {
	constructor(private readonly plugin: CanvasLens) {
		super(plugin.app, plugin);
		this.settings = plugin.settings;
	}

	settings: Settings;
	private readonly detachListeners: Array<() => void> = [];

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName(t('substituteDefault.name'))
			.setDesc(t('substituteDefault.description'))
			.addToggle((component) => {
				component.setValue(this.settings.substituteDefaultEmbed).onChange((value) => {
					this.settings.substituteDefaultEmbed = value;
					void this.plugin.saveSettings();
					if (value) this.plugin.connect();
					else this.plugin.disconnect?.();
				});
			});

		new Setting(containerEl)
			.setName(t('noExportModal.name'))
			.setDesc(t('noExportModal.description'))
			.addToggle((component) => {
				component.onChange((value) => {
					this.settings.noExportModal = value;
					void this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName(t('defaultExportLocation.name'))
			.setDesc(t('defaultExportLocation.description'))
			.addDropdown((component) => {
				component
					.addOption('sameFolder', t('defaultExportLocation.sameFolder'))
					.addOption('custom', t('defaultExportLocation.customFolder'))
					.setValue(this.settings.defaultExportLocation)
					.onChange((value) => {
						this.settings.defaultExportLocation = value as 'sameFolder' | 'custom';
						void this.plugin.saveSettings();
						this.display();
					});
			});

		if (this.settings.defaultExportLocation === 'custom')
			new Setting(containerEl)
				.setName(t('customExportFolder.name'))
				.setDesc(t('customExportFolder.description'))
				.addText((component) => {
					const onBlur = () => {
						const value = formatFolder(component.getValue());
						if (value !== this.settings.customExportFolder) {
							this.settings.customExportFolder = value;
							component.inputEl.value = value;
							void this.plugin.saveSettings();
						}
					};
					component
						.setPlaceholder(t('customExportFolder.placeholder'))
						.setValue(this.settings.customExportFolder)
						.inputEl.addEventListener('blur', onBlur);
					this.detachListeners.push(() =>
						component.inputEl.removeEventListener('blur', onBlur),
					);
				});
	}

	hide() {
		while (this.detachListeners.length) this.detachListeners.pop()?.();
	}
}
