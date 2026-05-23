import { getLanguage } from 'obsidian';
import createI18n from './composable';
import en from './en';
import zhHans from './zh-Hans';

const resources = { en, 'zh-Hans': zhHans } as const;
type Languages = keyof typeof resources;
export type TranslationShape = typeof en;

export default createI18n<TranslationShape>({
	current: resolveLanguage(),
	resources,
}).translation;

function isLanguage(key: string): key is Languages {
	return key in resources;
}

function resolveLanguage(): Languages {
	const segments = getLanguage().split('-');
	if (segments[0] === 'zh') return 'zh-Hans';
	return isLanguage(segments[0]) ? segments[0] : 'en';
}
