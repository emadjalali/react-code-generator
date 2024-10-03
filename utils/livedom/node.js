import { parse, stringify } from "flatted";
import { objectToNode } from "@/utils/livedom/node4live";
import { addOnClick, addToClassList } from "@/utils/livedom/nodeUtility";
import { State } from "./state";
class Node {
	constructor(
		tagName,
		attributes,
		children,
		textContent,
		parent,
		dontAddToElements
	) {
		this.tagName = tagName;
		this.attributes = attributes || {};
		this.children = children || [];
		this.textContent = textContent || "";
		this.parent = parent || null;
		this._id = Node.getNextId(); // Assigning the next available id
		this.boundStates = []; // Track bound states here
		// Singleton tags list
		this.singletonTags = ["img", "input", "br", "hr", "meta", "link"];

		if (!dontAddToElements) Node.elementsBy_id[this._id] = this; // Adding the element to the elementsById map

		if (this.tagName === "style") this.liveAttributes = { ...attributes };
		else
			this.liveAttributes = {
				...attributes,
				onClick: `{(e) => {\n e.stopPropagation();setRLiveSelectedElement(["${this._id}"]);}} \n`,
				className:
					"selectedElementPosition ${showSelectedItem && Array.isArray(rLiveSelectedElement) && rLiveSelectedElement.includes( " +
					`\"${this._id}\"` +
					") ?'showSelectedElement" +
					`${(this._id % 2) + 1}` +
					"':''}",
			};
		this.attributes["onClick"] &&
			this.setLiveAttribute("onClick", this.attributes["onClick"]);
		this.attributes["className"] &&
			this.setLiveAttribute("className", this.attributes["className"]);
	}

	static elementsBy_id = {};

	bindState(state) {
		if (!(state instanceof State)) {
			throw new Error("Argument must be an instance of State");
		}
		if (!this.boundStates.includes(state)) {
			this.boundStates.push(state);
		}
	}

	unbindState(state) {
		if (!(state instanceof State)) {
			throw new Error("Argument must be an instance of State");
		}
		const index = this.boundStates.indexOf(state);
		if (index !== -1) {
			this.boundStates.splice(index, 1);
		}
	}

	getBoundStates() {
		return this.boundStates;
	}

	static getNextId() {
		if (!Node.counter) {
			Node.counter = 1;
		}
		return Node.counter++;
	}

	static getElementBy_id(id) {
		if (id === "*") return Node.elementsBy_id;
		return Node.elementsBy_id[id];
	}
	getElementBy_id(id) {
		if (id === "*") return Node.elementsBy_id;
		return Node.elementsBy_id[id];
	}

	setAttribute(name, value) {
		if (name === "_id") {
			throw new Error("_id attribute cannot be set manually.");
		}
		this.attributes[name] = value;
		this.setLiveAttribute(name, value);
	}

	setLiveAttribute(name, value) {
		if (name === "onClick" && this.tagName !== "style") {
			let onclick = `\n e.stopPropagation(); setRLiveSelectedElement(["${this._id}"]);`;
			this.liveAttributes["onClick"] = addOnClick(this, onclick);
		} else if (name === "className" && this.tagName !== "style") {
			let showSelected =
				"selectedElementPosition ${showSelectedItem && Array.isArray(rLiveSelectedElement) && rLiveSelectedElement.includes( " +
				`\"${this._id}\"` +
				") ?'showSelectedElement" +
				`${(this._id % 2) + 1}` +
				"':''}";

			this.liveAttributes["className"] = addToClassList(
				this,
				`${showSelected}`,
				true
			);
		} else this.liveAttributes[name] = value;
	}

	removeAttribute(name) {
		delete this.attributes[name];
	}

	appendChild(child) {
		// Check if the tag is a singleton tag
		const isSingletonTag = this.singletonTags.includes(this.tagName);

		if (isSingletonTag) {
			console.warn(
				`Cannot append child to <${this.tagName}> tag, it is a singleton tag.`
			);
			return;
		}

		if (child instanceof Node) child.parent = this;

		// If it's not a singleton tag, proceed with rendering content
		if (!isSingletonTag) this.children.push(child);
		else this.parent.children.push(child);
	}

	removeChild(child) {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			this.children.splice(index, 1);
		}
	}

	clone() {
		let strNode = stringify(this);
		let nodeObj = parse(strNode);

		let node = objectToNode(nodeObj, true);

		return node;
	}

	render(config) {
		let html = `<${this.tagName}`;
		if (config?.show_id) html = `<${this.tagName} _id="${this._id}"`;
		// Add attributes
		for (const [key, value] of Object.entries(this.attributes)) {
			if (key === "className") html += ` ${key}= {\`${value}\`} `;
			else if (key === "style" || key === "onClick")
				html += ` ${key}=${value}`;
			else if (value === "") {
				html += ` ${key}`;
			} else {
				html += ` ${key}="${value}"`;
			}
		}

		// Check if the tag is a singleton tag
		const isSingletonTag = this.singletonTags.includes(this.tagName);

		// If it's not a singleton tag, proceed with rendering content
		if (!isSingletonTag) {
			html += ">" + "\r\n";

			// Add text content
			if (this.textContent) {
				html += this.textContent;
			}

			// Render children
			this.children.forEach((child) => {
				if (child instanceof Node) {
					html += child.render(config);
				} else {
					html += child + "\r\n";
				}
			});

			html += `</${this.tagName}>` + "\r\n";
		} else {
			// If it's a singleton tag, close it immediately
			html += " />" + "\r\n";
		}

		return html;
	}

	render4live(config) {
		let html = `<${this.tagName}`;
		if (config?.show_id) html = `<${this.tagName} _id="${this._id}"`;
		// Add attributes
		for (const [key, value] of Object.entries(this.liveAttributes)) {
			if (key === "className") html += ` ${key}= {\`${value}\`} `;
			else if (key === "style" || key === "onClick" || key === "_value")
				html += ` ${key}=${value}`;
			else if (value === "") {
				html += ` ${key}`;
			} else {
				html += ` ${key}="${value}"`;
			}
		}

		// Check if the tag is a singleton tag
		const isSingletonTag = this.singletonTags.includes(this.tagName);

		// If it's not a singleton tag, proceed with rendering content
		if (!isSingletonTag) {
			html += ">" + "\r\n";

			// Add text content
			if (this.textContent) {
				html += this.textContent;
			}

			// Render children
			this.children.forEach((child) => {
				if (child instanceof Node) {
					html += child.render4live(config);
				} else {
					html += child + "\r\n";
				}
			});

			html += `</${this.tagName}>` + "\r\n";
		} else {
			// If it's a singleton tag, close it immediately
			html += " />" + "\r\n";
		}

		return html;
	}
}

export { Node };
