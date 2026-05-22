export default function formatFolder(folder: string): string {
	folder = folder.trim();
	if (folder.startsWith('/')) folder = folder.slice(1);
	if (!folder.endsWith('/')) folder = `${folder}/`;
	return folder;
}
