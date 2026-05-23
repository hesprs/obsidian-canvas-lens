import type { Vault } from 'obsidian';

export default async function ensureAvailable(path: string, vault: Vault) {
	const parents = path.split('/').slice(0, -1);
	for (let i = 0; i < parents.length; i++) {
		const parentPath = parents.slice(0, i + 1).join('/');
		if (!vault.getAbstractFileByPath(parentPath) && parentPath !== '')
			await vault.createFolder(parentPath);
	}
	const existingFile = vault.getAbstractFileByPath(path);
	if (existingFile) await vault.delete(existingFile);
}
