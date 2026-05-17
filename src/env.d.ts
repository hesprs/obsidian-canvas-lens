declare module '*.css';

declare module '@tooooools/html-to-svg' {
	export type FontDefinition = {
		family: string;
		url: string;
		style?: string;
		weight?: string | number;
		opentype?: any;
	};

	export type HtmlToSvgOptions = {
		debug?: boolean;
		ignore?: string;
		fonts?: Array<FontDefinition>;
	};

	export type RenderOptions = {
		rasterizeNestedSVG?: boolean;
		splitText?: boolean;
	};

	export type TransformFn = (
		from: Element,
		to: SVGElement | null | undefined,
	) => SVGElement | null | undefined | Promise<SVGElement | null | undefined>;

	export type HtmlToSvgInstance = {
		readonly cache: Map<string, string>;
		preload(): Promise<void>;
		cleanup(): void;
		destroy(): void;
		render(
			root: Element,
			options?: RenderOptions,
			transform?: TransformFn,
		): Promise<SVGElement>;
	};

	export default function HtmlToSvg(options?: HtmlToSvgOptions): HtmlToSvgInstance;
}

declare module '@tooooools/html-to-svg/renderers' {
	import type { RenderOptions } from '@tooooools/html-to-svg';

	export type RendererContext = {
		debug?: boolean;
		fonts?: Array<{
			family: string;
			url: string;
			style?: string;
			weight?: string | number;
			opentype?: any;
		}>;
		cache?: Map<string, string>;
	};

	export type RendererProps = {
		x: number;
		y: number;
		width: number;
		height: number;
		style: CSSStyleDeclaration;
		viewBox?: DOMRect;
		defs?: SVGElement;
	};

	export type Renderer = (
		element: Element,
		props: RendererProps,
		options?: RenderOptions,
	) => Promise<SVGElement | null | undefined>;

	export const div: (context: RendererContext) => Renderer;
	export const text: (
		context: RendererContext,
	) => (
		string: string,
		props: RendererProps,
		options?: RenderOptions,
	) => Promise<SVGElement | null | undefined>;
	export const svg: (context: Pick<RendererContext, 'cache'>) => Renderer;

	export { div as DIV, svg as SVG };
	export { div as MARK, div as SPAN };
	export const CANVAS: (context: RendererContext) => Renderer;
	export const IMG: (context: RendererContext) => Renderer;
}

declare module '@tooooools/html-to-svg/renderers/div' {
	import type { RendererContext, Renderer } from '@tooooools/html-to-svg/renderers';
	const div: (context: RendererContext) => Renderer;
	export default div;
}

declare module '@tooooools/html-to-svg/renderers/span' {
	import type { RendererContext, Renderer } from '@tooooools/html-to-svg/renderers';
	const span: (context: RendererContext) => Renderer;
	export default span;
}

declare module '@tooooools/html-to-svg/renderers/text' {
	import type { RenderOptions } from '@tooooools/html-to-svg';
	import type { RendererContext, RendererProps } from '@tooooools/html-to-svg/renderers';
	const text: (
		context: RendererContext,
	) => (
		string: string,
		props: RendererProps,
		options?: RenderOptions,
	) => Promise<SVGElement | null | undefined>;
	export default text;
}

declare module '@tooooools/html-to-svg/renderers/image' {
	import type { RendererContext, Renderer } from '@tooooools/html-to-svg/renderers';
	const image: (context: RendererContext) => Renderer;
	export default image;
}

declare module '@tooooools/html-to-svg/renderers/canvas' {
	import type { RendererContext, Renderer } from '@tooooools/html-to-svg/renderers';
	const canvas: (context: RendererContext) => Renderer;
	export default canvas;
}

declare module '@tooooools/html-to-svg/renderers/svg' {
	import type { Renderer } from '@tooooools/html-to-svg/renderers';
	const svg: ({ cache }: { cache: Map<string, string> }) => Renderer;
	export default svg;
}
