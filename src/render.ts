// oxlint-disable capitalized-comments

import { elementToSVG, inlineResources } from 'dom-to-svg';
export default async function renderToString(element: HTMLElement) {
	const svg = elementToSVG(element);
	await inlineResources(svg.documentElement);
	return new XMLSerializer().serializeToString(svg);
}

//import HtmlToSvg from '@tooooools/html-to-svg';
//import { woff2Decode } from 'woff-lib/woff2/decode';
//
//type HtmlToSvgFont = {
//	family: string;
//	url: string;
//	style?: string;
//	weight?: string;
//};
//
//function unquote(value: string) {
//	return value.replace(/^['"]|['"]$/g, '');
//}
//
//function extractFontUrls(src: string) {
//	const urls: Array<string> = [];
//	const fontUrlPattern = /url\((['"]?)(.*?)\1\)/g;
//	let match: RegExpExecArray | null;
//	while ((match = fontUrlPattern.exec(src)) !== null) if (match[2]) urls.push(match[2]);
//
//	return urls;
//}
//
//function isSupportedFontUrl(url: string) {
//	return /\.(ttf|otf|ttc|woff2)(\?|#|$)/i.test(url);
//}
//
//function isWoff2Url(url: string) {
//	return /\.(woff2)(\?|#|$)/i.test(url);
//}
//
//function getObsidianFonts(element: HTMLElement): Array<HtmlToSvgFont> {
//	const fonts = new Map<string, HtmlToSvgFont>();
//	for (const styleSheet of element.ownerDocument.styleSheets) {
//		let rules: CSSRuleList;
//		try {
//			rules = styleSheet.cssRules;
//		} catch {
//			continue;
//		}
//
//		for (const rule of rules) {
//			if (rule.type !== CSSRule.FONT_FACE_RULE) continue;
//
//			const fontFaceRule = rule as CSSFontFaceRule;
//			const family = unquote(fontFaceRule.style.getPropertyValue('font-family').trim());
//			const src = fontFaceRule.style.getPropertyValue('src');
//			if (!family || !src) continue;
//
//			const fontUrl = extractFontUrls(src).find(isSupportedFontUrl);
//			if (!fontUrl) continue;
//
//			const font: HtmlToSvgFont = {
//				family,
//				style: fontFaceRule.style.getPropertyValue('font-style').trim() || undefined,
//				url: fontUrl,
//				weight: fontFaceRule.style.getPropertyValue('font-weight').trim() || undefined,
//			};
//			fonts.set([font.family, font.style ?? '', font.weight ?? '', font.url].join('|'), font);
//		}
//	}
//
//	return [...fonts.values()];
//}
//
//async function resolveFontUrl(fontUrl: string) {
//	if (!isWoff2Url(fontUrl)) return fontUrl;
//
//	const response = await fetch(fontUrl);
//	if (!response.ok) throw new Error(`Failed to fetch font: ${fontUrl}`);
//
//	const decoded = await woff2Decode(await response.arrayBuffer());
//	return URL.createObjectURL(new Blob([decoded.buffer as ArrayBuffer], { type: 'font/ttf' }));
//}
//
//export default async function renderToString(element: HTMLElement) {
//	const fonts = await Promise.all(
//		getObsidianFonts(element).map(async (font) => ({
//			...font,
//			url: await resolveFontUrl(font.url),
//		})),
//	);
//	console.log(fonts)
//	const renderer = HtmlToSvg({ fonts });
//	await renderer.preload();
//	return (await renderer.render(element)).outerHTML;
//}
