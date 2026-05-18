import { domToSvg } from 'dom2svg';

export default async function renderToString(element: HTMLElement) {
	const svg = await domToSvg(element, { flattenTransforms: true, padding: 0 });
	return svg.toString();
}
