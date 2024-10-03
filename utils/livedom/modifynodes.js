import { parsStyles, toCssClass } from "./parser";
import { Node } from "./oldnode";
function addChild(nodes, elId, child, originId, type, classNames) {
	if (elId.length === 1) {
		let id;
		if (nodes.children.length === 0) {
			id = `${originId}-0`;
		} else {
			let lastChildId = nodes.children[nodes.children.length - 1].id;
			let lastChildIdArray = lastChildId.split("-");
			id = `${originId}-${
				Number(lastChildIdArray[lastChildIdArray.length - 1]) + 1
			}`;
		}
		classNames.push(`_${id}`);
		child.openTag = `<${
			child.tagName
		} id="${id}${type}" className="${classNames.join(" ")}" onClick={(e)=>{
			e.stopPropagation()
			setRLiveSelectedElement("${id}")}} ${child.attribs}`;
		child.openTag = child.openTag.concat(child.closeTag === "" ? "/>" : ">");
		let nChild = `${child.openTag} ${child.closeTag} `;

		nodes.children.push({
			node: nChild,
			children: [],
			id: id,
			style: {},
			type: type,
			openTag: child.openTag,
			closeTag: child.closeTag,
			classNames: classNames,
		});
	} else {
		let idChars = elId.split("-");
		let childIndex = nodes.children.findIndex((el) => {
			let elIdChars = el.id.split("-");
			return idChars[1] === elIdChars[elIdChars.length - 1];
		});
		addChild(
			nodes.children[childIndex],
			elId.slice(idChars[0].length + 1),
			child,
			originId,
			type,
			classNames
		);
	}

	return { ...nodes };
}
function addNode(nodes, elId, child, type, classNames) {
	// let init = {
	// 	id: "0",
	// 	openTag: "",
	// 	closeTag: "",
	// 	children: "",
	// 	inlineStyles: "",
	// };
	// let n = new Node(init);
	// console.log("n.getId() ", n.getId());
	nodes = addChild(nodes, elId, child, elId, type, classNames);
	let updatedStyle = parsStyles(nodes);
	nodes.styleTag = {
		node: `<style jsx>{\` ${updatedStyle}
		\`}</style>`,
		children: [],
		id: "style",
		type: "style",
	};
	return nodes;
}
export { addNode };
