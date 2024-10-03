function toJsxFunc(node) {
	if (node?.styleJsx) {
		return `${node.openTag} ${toJsxFunc({
			id: node.id,
			children: node.children,
			node: node.node,
			openTag: "",
			closeTag: "",
			classNames: node.classNames,
			type: node.type,
		})}  ${node.styleJsx.getStyleJsxElement()} ${node.closeTag}`;
	}
	if (node.type === "text") return node.children;
	if (node.children.length === 0) {
		return `${node.openTag} ${node.closeTag}`;
	}

	if (node.children.length === 1) {
		return `${node.openTag} ${toJsxFunc(node.children[0])} ${node.closeTag}`;
	}
	if (node.children.length > 1) {
		return `${node.openTag} ${toJsxFunc(node.children[0])} ${toJsxFunc({
			id: node.id,
			children: node.children.slice(1),
			node: "",
			openTag: "",
			closeTag: "",
			type: node.type,
		})} ${node.closeTag}`;
	}
}

function toCssClasses(className, styles) {
	let allStyles = "";
	// if (!styles) return "";
	let keys = Object.keys(styles);
	keys.forEach((k) => (allStyles = allStyles.concat(` ${k}: ${styles[k]};`)));
	return `.${className} { ${allStyles} }`;
}

function toStyleJsxFunc(node) {
	if (node.children.length === 0) return toCssClass(`_${node.id}`, node.style);
	if (node.children.length === 1)
		return `${toCssClass(`_${node.id}`, node.style)} ${toStyle(
			node.children[0]
		)}`;
	if (node.children.length > 1)
		return `${toStyle(node.children[0])} ${toStyle({
			id: node.id,
			children: node.children.slice(1),
			node: "",
			style: node.style,
		})}`;
}

function inlineStyleToString(inlineStyle) {
	let inlineStyleString = "";
	if (!inlineStyle) return "{{}}";
	let inlineStyleKeys = Object.keys(inlineStyle);
	inlineStyleKeys.forEach((styleKey) => {
		inlineStyleString = inlineStyleString.concat(
			`${styleKey}: \`${inlineStyle[styleKey]}\`, `
		);
	});
	return `{{ ${inlineStyleString} }}`;
}

function attribsToString(attribs) {
	let attribsString = "";
	let attribsKeys = Object.keys(attribs);
	attribsKeys.forEach((key) => {
		let value;
		if (key === "inlineStyles") {
			value = `${inlineStyleToString(attribs.inlineStyles)}`;
			key = "style";
		} else if (key === "classNames") {
			value = `{\`${attribs.classNames.join(" ")}\`}`;
			key = "className";
		} else value = `{\`${attribs[key]}\`}`;
		attribsString = attribsString.concat(`${key}=${value} `);
	});
	return attribsString;
}

function actionsToString(actions) {
	let actionsString = "";
	if (!actions) return "";
	let actionsKeys = Object.keys(actions);
	actionsKeys.forEach((key) => {
		let value = `${actions[key]}`;
		actionsString = actionsString.concat(`${key}={${value}} `);
	});
	return actionsString;
}

function updateAttribsByProperty(attribs, property) {
	if (property.conditionalOpacity) {
		attribs.classNames.push(property.conditionalOpacity.classNames);
	}
}

export {
	toJsxFunc,
	inlineStyleToString,
	attribsToString,
	actionsToString,
	updateAttribsByProperty,
};
