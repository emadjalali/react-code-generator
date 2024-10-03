// function toJsx(node) {
// 	if (node.styleTag) {
// 		return `${node.openTag} ${toJsx({
// 			id: node.id,
// 			children: node.children,
// 			node: node.node,
// 			openTag: "",
// 			closeTag: "",
// 			classNames: node.classNames,
// 			type: node.type,
// 		})}  ${node.styleTag.node} ${node.closeTag}`;
// 	}
// 	if (node.children.length === 0) {
// 		return `${node.openTag} ${node.closeTag}`;
// 	}

// 	if (node.children.length === 1) {
// 		return `${node.openTag} ${toJsx(node.children[0])} ${node.closeTag}`;
// 	}
// 	if (node.children.length > 1) {
// 		return `${node.openTag} ${toJsx(node.children[0])} ${toJsx({
// 			id: node.id,
// 			children: node.children.slice(1),
// 			node: "",
// 			openTag: "",
// 			closeTag: "",
// 			type: node.type,
// 		})} ${node.closeTag}`;
// 	}
// }

function codeParser(codes) {
	return codes;
}

function prepareLiveCode(nodes, codes) {
	let codeString = `
	const getRandomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	const Comp=()=>{
		${codeParser(codes)}
		return(${toJsx(nodes)})
		}
		render(<Comp setRLiveSelectedElement={setRLiveSelectedElement}/>)
		`;
	return codeString;
}

function elementParser(element) {
	let tagName, openTag, children, closeTag, attribs;
	element = element.trim();
	let endOfOpenTagIndex = element.search(/[^=]>/) + 2;
	let openTagWithoutAngles = element.slice(1, endOfOpenTagIndex - 1).trim();
	openTag = `<${openTagWithoutAngles}>`;
	element = `${openTag}${element.substring(endOfOpenTagIndex + 1)}`;
	endOfOpenTagIndex = openTag.length - 1;

	let endOfTagNameIndex = 2;
	while (openTag[endOfTagNameIndex] !== " ") endOfTagNameIndex++;
	tagName = openTag.substring(1, endOfTagNameIndex);

	let endOfAttribsIndex;
	if (element[element.length - 2] === "/") {
		endOfAttribsIndex = openTag.length - 3;
		children = "";
		closeTag = "";
	} else {
		endOfAttribsIndex = openTag.length - 2;
		let startOfCloseTagIndex = element.length - 1;
		while (
			startOfCloseTagIndex !== 0 &&
			element[startOfCloseTagIndex] !== "<"
		)
			startOfCloseTagIndex--;

		children = element.substring(endOfOpenTagIndex + 1, startOfCloseTagIndex);
		closeTag = `</${tagName}>`;
	}
	attribs = openTag.substring(tagName.length + 1, endOfAttribsIndex + 1);

	// console.log("openTag ", openTag);
	// console.log("children ", children);
	// console.log("attribs ", attribs);
	// console.log("closeTag ", closeTag);
	return {
		openTag: openTag,
		children: children,
		closeTag: closeTag,
		attribs: attribs,
		tagName: tagName,
	};
}

const parsStyles = (node) => {
	if (node.children.length === 0) return toCssClass(`_${node.id}`, node.style);
	if (node.children.length === 1)
		return `${toCssClass(`_${node.id}`, node.style)} ${parsStyles(
			node.children[0]
		)}`;
	if (node.children.length > 1)
		return `${parsStyles(node.children[0])} ${parsStyles({
			id: node.id,
			children: node.children.slice(1),
			node: "",
			style: node.style,
		})}`;
};

const toCssClass = (classId, styles) => {
	let allStyles = "";
	// if (!styles) return "";
	let keys = Object.keys(styles);
	keys.forEach((k) => (allStyles = allStyles.concat(` ${k}: ${styles[k]};`)));
	return `.${classId} { ${allStyles} }`;
};

const nodeRoot = {
	node: `<div style={{minHeight:"400px", backgroundColor:"red"}} className="container" onClick={()=>{
		setRLiveSelectedElement("0")}}> </div>`,
	openTag: `<div style={{minHeight:"400px", backgroundColor:"red"}} className="container" onClick={()=>{
			setRLiveSelectedElement("0")}}>`,
	closeTag: `</div>`,
	children: [
		{
			node: `<div style={{minHeight:"5px", backgroundColor:"blue"}} className="row _0-0" onClick={(e)=>{
				e.stopPropagation()
				setRLiveSelectedElement("0-0")}}> </div>`,
			openTag: `<div style={{minHeight:"5px", backgroundColor:"blue"}} className="row _0-0" onClick={(e)=>{
				e.stopPropagation()
				setRLiveSelectedElement("0-0")}}>`,
			closeTag: `</div>`,
			children: [],
			classNames: ["row", "_0-0"],
			id: "0-0",
			style: {},
			type: "row",
		},
	],

	id: "0",
	classNames: ["container", "_0"],
	style: {},
	styleTag: {
		node: `<style jsx>{\`
		\`}</style>`,
		openTag: `<style jsx>`,
		closeTag: `</style>`,
		children: [`{\` \`}`],
		id: "style",
		type: "style",
		style: {},
	},
	type: "container",
};

export {
	//toJsx,
	codeParser,
	prepareLiveCode,
	elementParser,
	parsStyles,
	toCssClass,
	nodeRoot,
};
