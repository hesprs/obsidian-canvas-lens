import { Component } from 'obsidian';

export default class NodeComponent extends Component {
	load() {
		console.log('load');
	}
	unload() {
		console.log('unload');
	}
	onunload() {
		console.log('onunload');
	}
	onload() {
		console.log('onload');
	}
	addChild<T extends Component>(t: T) {
		console.log('addChild');
		return t;
	}
	removeChild<T extends Component>(t: T) {
		console.log('removeChild');
		return t;
	}
	register(): void {
		console.log('register');
	}
	registerEvent(): void {
		console.log('registerEvent');
	}
	registerDomEvent(): void {
		console.log('registerDomEvent');
	}
	registerInterval(id: number): number {
		console.log('registerInterval');
		return id;
	}
}
