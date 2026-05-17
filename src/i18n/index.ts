import createI18n from './composable';
import en from './en';

const resources = { en } as const;
type Languages = keyof typeof resources;
export type TranslationShape = typeof en;

export default createI18n<TranslationShape>({
	current: resolveLanguage(),
	resources,
}).translation;

function resolveLanguage(): Languages {
	return 'en';
}
