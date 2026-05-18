import type { BaseArgs, BaseOptions } from 'json-canvas-viewer';
import { BaseModule, internal } from 'json-canvas-viewer';
import { Context } from 'svgcanvas';

export default class PostProcessor extends BaseModule<
	BaseOptions,
	{ postProcess: PostProcessor['postProcess'] }
> {
	private readonly renderer: InstanceType<typeof internal.Renderer>;
	private readonly DM: InstanceType<typeof internal.DataManager>;

	constructor(...args: BaseArgs) {
		super(...args);
		this.augment({ postProcess: this.postProcess });
		this.renderer = this.container.get(internal.Renderer);
		this.DM = this.container.get(internal.DataManager);
	}

	postProcess = () => {
		const container = this.DM.data.container;
		const renderer = this.renderer as unknown as {
			ctx: Context;
			redraw: () => {};
			_canvas: HTMLCanvasElement | SVGSVGElement;
		};
		const ctx = new Context(container.clientWidth, container.clientHeight);
		renderer.ctx = ctx;
		renderer.redraw();
		// oxlint-disable-next-line no-underscore-dangle
		renderer._canvas.replaceWith(ctx.getSvg());
	};
}
