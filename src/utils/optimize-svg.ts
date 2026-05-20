import { roundSf } from './fns';

const NUMERIC_ATTRS = new Set([
	'x',
	'y',
	'width',
	'height',
	'cx',
	'cy',
	'r',
	'rx',
	'ry',
	'x1',
	'y1',
	'x2',
	'y2',
	'dx',
	'dy',
	'opacity',
	'fill-opacity',
	'stroke-opacity',
	'stroke-width',
	'stroke-dasharray',
	'stroke-dashoffset',
	'font-size',
	'viewBox',
	'transform',
	'd',
	'points',
	'pathLength',
]);

const FLOAT_REGEX = /-?\d+\.\d+/g;

/**
 * Rounds floating-point numbers in an SVG DOM element's attributes.
 * Modifies the element in-place for maximum performance.
 *
 * @param svg - The root SVGSVGElement (or any SVGElement subtree)
 * @param precision - Decimal places to keep (default: 2)
 */
export default function optimizeSvgNumbers(svg: SVGSVGElement, precision = 2): void {
	const elements = [svg, ...svg.querySelectorAll<SVGElement>('*')];
	for (const el of elements)
		for (const attr of el.attributes) {
			if (!NUMERIC_ATTRS.has(attr.name)) continue;
			const original = attr.value;
			const optimized = original.replace(FLOAT_REGEX, (match) => {
				const num = parseFloat(match);
				if (isNaN(num)) return match;
				return roundSf(num, precision).toString();
			});
			if (optimized !== original) el.setAttribute(attr.name, optimized);
		}
}
