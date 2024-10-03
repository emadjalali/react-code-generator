import { parse, stringify } from "flatted";
import { Node } from "./node";
import { addToClassList } from "./nodeUtility";

// class Node4Live extends Node {
// 	constructor(tagName, attributes, children, textContent, parent) {
// 		super(tagName, attributes, children, textContent, parent);
// 	}

// 	render(config) {
// 		let html;
// 		// Add attributes
// 		if (config?.liveCode) {
// 			html = `<${this.tagName} _id="${this._id}"`;
// 			if (!this.attributes?.onClick)
// 				this.attributes["onClick"] = "{(e)=>{}}";

// 			// if (!this.attributes?.style) this.attributes["style"] = "{{}}";
// 			this.attributes["className"] =
// 				"{rLiveSelectedElement === " +
// 				`\"${this._id}\"` +
// 				"?'showSelectedElement':''}";

// 			for (const [key, value] of Object.entries(this.attributes)) {
// 				if (key === "onClick")
// 					html += ` ${key}=  ${value.slice(0, -2)}
// 						e.stopPropagation()
// 						setRLiveSelectedElement("${this._id}")}}`;
// 				else if (key === "style" || key === "className") {
// 					html += ` ${key}= ${value}`;
// 					console.log("*****   ", html);
// 				} else html += ` ${key}="${value}"`;
// 			}
// 		} else {
// 			this.attributes["className"] = "";
// 			html = `<${this.tagName}`;
// 			for (const [key, value] of Object.entries(this.attributes)) {
// 				if (key === "style" || key === "onClick")
// 					html += ` ${key}=${value}`;
// 				else html += ` ${key}="${value}"`;
// 			}
// 		}

// 		// Check if the tag is a singleton tag
// 		const isSingletonTag = this.singletonTags.includes(this.tagName);

// 		// If it's not a singleton tag, proceed with rendering content
// 		if (!isSingletonTag) {
// 			html += ">";

// 			// Add text content
// 			if (this.textContent) {
// 				html += this.textContent;
// 			}

// 			// Render children
// 			this.children.forEach((child) => {
// 				if (child instanceof Node) {
// 					html += child.render({ liveCode: config?.liveCode });
// 				} else {
// 					html += child;
// 				}
// 			});

// 			html += `</${this.tagName}>`;
// 		} else {
// 			// If it's a singleton tag, close it immediately
// 			html += " />";
// 		}

// 		return html;
// 	}
// 	renderShadow() {
// 		let html = `<div style={{position: "relative" , height: "300px"}}>
// 		<div style={{position: "absolute" , left: "0" , top: "0"}}> ${this.render({
// 			liveCode: false,
// 		})} </div> <div style={{position: "absolute", left: "0" , top: "0"}}>${this.render(
// 			{ liveCode: true }
// 		)} </div>  </div>`;
// 		return html;
// 	}

function objectToNode(obj, clone) {
	if (obj === null) {
		throw new Error("Input must be a non-null object");
	}
	if (typeof obj !== "object") {
		return obj.toString();
	}

	const element = new Node(
		obj.tagName,
		obj.attributes,
		[],
		obj.textContent,
		obj.parent
	);
	if (obj._id) {
		delete Node.elementsBy_id[element._id];
		if (clone) {
			element._id = `clone_${obj._id}`;
			Node.elementsBy_id[element._id] = element;
		} else {
			element._id = obj._id;

			element.tagName !== "style" &&
				element.setLiveAttribute(
					"onClick",
					element.attributes?.onClick ? element.attributes.onClick : null
				);
			element.tagName !== "style" &&
				element.setLiveAttribute(
					"className",
					element.attributes?.className
						? element.attributes.className
						: null
				);

			Node.elementsBy_id[obj._id] = element;
		}
	}

	if (Array.isArray(obj.children)) {
		obj.children.forEach((child) => {
			const childElement = objectToNode(child, clone);
			element.appendChild(childElement);
		});
	}

	return element;
}

function preRender(node) {
	node.children.forEach((child, index) => {
		if (child instanceof Node && child.tagName !== "style") {
			let onclick = child.attributes["onClick"]
				? child.attributes["onClick"]
				: "{(e) => {}}";
			if (!onclick.includes("e.stopPropagation()")) {
				let indexOfStart = onclick.indexOf("{", 1);
				onclick =
					onclick.slice(0, indexOfStart + 1) +
					` e.stopPropagation(); setRLiveSelectedElement(["${child._id.replace(
						"clone_",
						""
					)}"]); ` +
					onclick.slice(indexOfStart + 1);
			}
			child.setAttribute("onClick", onclick);

			let showSelected =
				"${showSelectedItem && Array.isArray(rLiveSelectedElement) && rLiveSelectedElement.includes( " +
				`\"${child._id.replace("clone_", "")}\"` +
				") ?'showSelectedElement" +
				`${(index % 2) + 1}` +
				"':''}";
			addToClassList(child, showSelected);

			let styles;
			if (child.attributes["style"]) {
				if (!child.attributes["style"].includes("position")) {
					styles =
						child.attributes["style"].slice(0, -2) +
						" ,position: 'relative' }}";
				} else {
					styles = child.attributes["style"];
				}
			} else {
				styles = "{{position: 'relative'}}";
			}
			child.setAttribute("style", styles);
		}
		if (child.children?.length > 0) {
			preRender(child);
		}
	});
}

function liveNodeRender(node) {
	let keys = Object.keys(Node.elementsBy_id);

	keys.forEach((key) => {
		let id = Node.elementsBy_id[key]._id;
		if (id.toString().includes("clone")) {
			delete Node.elementsBy_id[key];
		}
	});
	console.log(" ====> ", Node.elementsBy_id);

	let newNode = node.clone();
	const myDiv = new Node("div");
	myDiv.appendChild(newNode);
	preRender(myDiv);
	let render = myDiv.children[0].render({ show_id: true });
	delete Node.elementsBy_id[myDiv];
	return render;
}

function nodeSave(node) {
	const json = stringify(node);
	localStorage.setItem("Node", json);
	console.log(`Node instance saved to localStorage`);
}

function nodeLoad() {
	const json = localStorage.getItem("Node");
	if (!json) return null;
	const obj = parse(json);
	console.log("this.loadChildren(obj)");
	const element = objectToNode(obj);

	return element;
}

export { liveNodeRender, nodeSave, nodeLoad, objectToNode };
