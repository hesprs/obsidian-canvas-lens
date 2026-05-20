export function roundSf(value: number, sf: number): number {
	return parseFloat(value.toFixed(sf));
}

export function roundDp(value: number, digits: number) {
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}
