import { domToSvg } from 'dom-svg-parser';
import optimizeSvgNumbers from './utils/optimize-svg';
export default async function renderToString(element: HTMLElement) {
	const { svg } = await domToSvg(element);
	optimizeSvgNumbers(svg, 4);
	return svg.outerHTML;
}
