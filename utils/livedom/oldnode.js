import { StyleJsx } from "./stylejsx";
import {
	toJsxFunc,
	inlineStyleToString,
	attribsToString,
	actionsToString,
	updateAttribsByProperty,
} from "./helper";

class Node {
	id;
	tagName;
	openTag;
	closeTag;
	attribs;
	children;
	inlineStyles = {};
	classNames;
	actions;
	type;
	styleJsx;
	property = {};

	constructor(init) {
		const {
			id,
			tagName,
			openTag,
			closeTag,
			attribs,
			children,
			inlineStyles,
			classNames,
			actions,
			type,
			property,
			styleJsx,
		} = init || {};

		this.id = id;
		this.tagName = tagName;
		this.openTag = openTag;
		this.closeTag = closeTag;
		this.attribs = attribs;
		this.children = children;
		this.inlineStyles = inlineStyles || {};
		this.classNames = classNames;
		this.actions = actions;
		this.type = type;
		this.property = property || {};
		if (styleJsx) this.styleJsx = new StyleJsx(styleJsx);
	}
	getId() {
		return this.id;
	}
	getType() {
		return this.type;
	}
	getFields() {
		return {
			id: this.id,
			openTag: this.openTag,
			closeTag: this.closeTag,
			children: this.children,
			inlineStyles: this.inlineStyles,
			classNames: this.classNames,
			actions: this.actions,
			type: this.type,
			text: this.text,
			styleJsx: this.styleJsx,
		};
	}
	getLastChildID() {
		let id;
		if (this.children.length !== 0) {
			let lastChildId = this.children[this.children.length - 1].id;
			let lastChildIdArray = lastChildId.split("-");
			id = Number(lastChildIdArray[lastChildIdArray.length - 1]);
		} else id = -1;
		return id;
	}

	addNode(child, type, classNames, inlineStyles, actions) {
		const id = `${this.id}-${this.getLastChildID() + 1}`;
		let { attribs } = child;
		attribs.classNames = classNames;
		attribs.inlineStyles = inlineStyles;
		attribs.id = `${id}${type}`;

		let openTag = `<${child.tagName} ${attribsToString(
			attribs
		)} ${actionsToString(actions)}`;

		openTag = openTag.concat(child.closeTag === "" ? "/>" : ">");
		if (type === "text") openTag = "<>";

		const newChild = new Node({
			id: id,
			tagName: child.tagName,
			openTag: openTag,
			closeTag: child.closeTag,
			children: type === "text" ? child.text : [],
			type: type,
			classNames: classNames,
		});
		this.children.push(newChild);
		return newChild;
	}
	addInlineStyle(style) {
		let allStyles = "";
		if (!style) return "";
		let styleKeys = Object.keys(style);

		styleKeys.forEach((key) => (this.inlineStyles[key] = style[key]));
		this.attribs = { ...this.attribs, inlineStyles: this.inlineStyles };

		let attribsString = attribsToString(this.attribs);
		let actionString = actionsToString(this.actions);
		this.openTag = `<${this.tagName} ${attribsString} ${actionString}`;
		this.openTag = this.openTag.concat(this.closeTag === "" ? "/>" : ">");
	}

	addClassNames(classNames) {
		this.classNames.push(classNames);
		this.attribs = { ...this.attribs, classNames: this.classNames };
		let attribsString = attribsToString(this.attribs);
		let actionString = actionsToString(this.actions);

		this.openTag = `<${this.tagName} ${attribsString} ${actionString}`;
		this.openTag = this.openTag.concat(this.closeTag === "" ? "/>" : ">");
	}

	removeClassNames(classNames) {
		this.classNames = this.classNames.filter((c) => c != classNames);
		this.attribs = { ...this.attribs, classNames: this.classNames };
		let attribsString = attribsToString(this.attribs);
		let actionString = actionsToString(this.actions);

		this.openTag = `<${this.tagName} ${attribsString} ${actionString}`;
		this.openTag = this.openTag.concat(this.closeTag === "" ? "/>" : ">");
	}
}
class LiveNode extends Node {
	static allNodes = {};
	constructor(init) {
		super(init);
		LiveNode.allNodes[`${this.id}`] = this;
	}
	getFields() {
		return super.getFields();
	}
	addNode(child, type, classNames, inlineStyles, actions) {
		const id = `${this.id}-${this.getLastChildID() + 1}`;

		let attribs = child.attribs;
		attribs.classNames = classNames;
		attribs.inlineStyles = inlineStyles;
		attribs.id = `${id}${type}`;
		// updateAttribsByProperty(attribs, this.property);

		let nodeActions = actions;
		if (type != "text")
			nodeActions.onClick = `(e)=>{
			e.stopPropagation()
			setRLiveSelectedElement("${id}")}`;

		child.openTag = `<${child.tagName} ${attribsToString(
			attribs
		)} ${actionsToString(nodeActions)}`;

		child.openTag = child.openTag.concat(child.closeTag === "" ? "/>" : ">");
		if (type === "text") child.openTag = "<>";

		let init = {
			id: id,
			tagName: child.tagName,
			openTag: child.openTag,
			closeTag: child.closeTag,
			attribs: attribs,
			children: type === "text" ? child.text : [],
			type: type,
			classNames: classNames,
			inlineStyles: inlineStyles,
			actions: nodeActions,
			property: {},
		};
		let newLiveNode = new LiveNode(init);
		this.children.push(newLiveNode);
		LiveNode.allNodes[`${newLiveNode.id}`] = newLiveNode;
	}

	addAttrib() {}

	updateProperty(property) {
		let propertyName = property.name;
		let propertyValue = property.value;
		if (propertyName === "conditionalOpacity") {
			let type = propertyValue.type;
			if (type === "Discrete") {
				let classNameValue = `${propertyValue.variable} ${propertyValue.comparisonSign} ${propertyValue.value}`;
				classNameValue = `${"${"} ${classNameValue} ? 'fadeMeIn' : 'fadeMeOut' ${"}"} `;
				this.property.conditionalOpacity = { classNames: classNameValue };
			}
			this.addClassNames(this.property.conditionalOpacity.classNames);
		}
	}

	static toJsx() {
		return toJsxFunc(LiveNode.allNodes["0"]);
	}
}
export { Node, LiveNode };
