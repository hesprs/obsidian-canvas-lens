import en from './en';

const zhHans: typeof en = {
	canvas: 'Canvas',
	clickBanner: '点击查看 Canvas',
	customExportFolder: {
		description: '输入自定义导出文件夹的路径，使用 "/" 表示仓库根目录。',
		name: '自定义导出文件夹',
		placeholder: '例如 attachments/',
	},
	defaultExportLocation: {
		customFolder: '下方指定的文件夹',
		description: '选择保存导出 SVG 文件的文件夹。',
		name: '默认导出位置',
		sameFolder: '与 Canvas 所在文件夹相同',
	},
	exportToSVG: '导出为 SVG',
	noExportModal: {
		description: '运行导出命令时跳过导出预览模态框，直接导出为 SVG。',
		name: '跳过导出预览模态框',
	},
	rendering: '渲染中，请稍候...',
};

export default zhHans;
