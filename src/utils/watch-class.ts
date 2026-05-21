type WatchRule = {
	className: string;
	type: 'add' | 'remove';
	callback: (el: Element) => void;
};

/**
 * Watches for multiple classes within a subtree, firing specific callbacks
 * based on rule configurations when elements are added/removed from the DOM
 * or when their classes change.
 *
 * @returns A cleanup function that disconnects the observer.
 */
export default function watchClass(root: HTMLElement, rules: Array<WatchRule>): () => void {
	if (rules.length === 0) return () => {};

	// 1. Group rules by className and deduplicate callbacks
	const rulesMap = new Map<string, { add: Set<Function>; remove: Set<Function> }>();
	const uniqueClassNames = new Set<string>();

	for (const rule of rules) {
		uniqueClassNames.add(rule.className);
		if (!rulesMap.has(rule.className))
			rulesMap.set(rule.className, { add: new Set(), remove: new Set() });

		const entry = rulesMap.get(rule.className)!;
		if (rule.type === 'add') entry.add.add(rule.callback);
		else entry.remove.add(rule.callback);
	}

	// 2. Initialize a WeakSet for each unique class to track active elements
	const tracked = new Map<string, WeakSet<Element>>();
	for (const cn of uniqueClassNames) tracked.set(cn, new WeakSet());

	// 3. Build a combined selector for efficient subtree querying
	const selector = [...uniqueClassNames].map((c) => `.${CSS.escape(c)}`).join(',');

	const collectMatches = (el: Element): Array<Element> => {
		const results: Array<Element> = [];
		if (el.matches(selector)) results.push(el);
		results.push(...el.querySelectorAll(selector));
		return results;
	};

	// 4. Core evaluation logic
	const evaluate = (el: Element, isDomRemoval: boolean) => {
		for (const cn of uniqueClassNames) {
			const isPresent = !isDomRemoval && el.classList.contains(cn);
			const weakSet = tracked.get(cn)!;
			const isTracked = weakSet.has(el);

			if (isPresent === isTracked) continue; // State hasn't changed

			if (isPresent) {
				weakSet.add(el);
				for (const cb of rulesMap.get(cn)!.add) cb(el);
			} else {
				weakSet.delete(el);
				for (const cb of rulesMap.get(cn)!.remove) cb(el);
			}
		}
	};

	// 5. Initial scan
	collectMatches(root).forEach((el) => evaluate(el, false));

	// 6. Observer
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations)
			if (mutation.type === 'childList') {
				for (const node of mutation.addedNodes)
					if (node instanceof Element)
						collectMatches(node).forEach((el) => evaluate(el, false));

				for (const node of mutation.removedNodes)
					if (node instanceof Element)
						collectMatches(node).forEach((el) => evaluate(el, true));
			} else if (mutation.type === 'attributes')
				// Triggered only for 'class' attribute changes
				evaluate(mutation.target as Element, false);
	});

	observer.observe(root, {
		attributeFilter: ['class'],
		attributes: true,
		childList: true,
		subtree: true,
	});

	return () => observer.disconnect();
}
