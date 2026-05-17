type HookMatchingFunc<Args extends GeneralArray> = (...args: Args) => void;
type GeneralArray = ReadonlyArray<unknown>;
type Hook<Args extends GeneralArray = []> = {
	(...args: Args): void;
	subs: Set<HookMatchingFunc<Args>>;
	subscribe(callback: HookMatchingFunc<Args>): () => void;
	unsubscribe(callback: HookMatchingFunc<Args>): void;
};

export default function hook<Args extends GeneralArray = []>(): Hook<Args> {
	const result: Hook<Args> = (...args: Args) => {
		for (const callback of result.subs) callback(...args);
	};
	result.subs = new Set();
	result.subscribe = (callback: HookMatchingFunc<Args>) => {
		result.subs.add(callback);
		return () => result.unsubscribe(callback);
	};
	result.unsubscribe = (callback: HookMatchingFunc<Args>) => {
		result.subs.delete(callback);
	};
	return result;
}
