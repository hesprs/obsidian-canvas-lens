import type { JSONCanvas } from 'json-canvas-viewer';
import { roundDp } from './fns';

export default function getAspectRatio(canvas: JSONCanvas): string {
	const { height, width } = calculateBounds({ edges: [], nodes: [], ...canvas });
	const realHeight = height + 200;
	const realWidth = width + 200;
	const aspectRatio = realHeight / realWidth;
	return `1 / ${roundDp(aspectRatio, 2)}`;
}

function calculateBounds(canvasData: Required<JSONCanvas>) {
	let minX = Infinity,
		minY = Infinity,
		maxX = -Infinity,
		maxY = -Infinity;
	canvasData.nodes.forEach((node) => {
		minX = Math.min(minX, node.x);
		minY = Math.min(minY, node.y);
		maxX = Math.max(maxX, node.x + node.width);
		maxY = Math.max(maxY, node.y + node.height);
	});
	const width = maxX - minX;
	const height = maxY - minY;
	return { height, maxX, maxY, minX, minY, width };
}
