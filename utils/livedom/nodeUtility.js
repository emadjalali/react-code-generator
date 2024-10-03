function extractTemplateLiterals(inputString) {
	const templateLiterals = [];
	const regex = /\${([^}]+?)}/g;
	let match;

	while ((match = regex.exec(inputString)) !== null) {
		templateLiterals.push(match[1]);
	}

	return templateLiterals;
}

function extractContentBetweenBraces(inputString) {
	const regex = /{([^{}]*)}/;
	const matches = inputString.match(regex);

	if (matches && matches.length > 0) {
		const jsonString = matches[0].replace(/'/g, '"'); // Replacing single quotes with double quotes
		return jsonString; // Return the entire match (including braces)
	} else {
		return null; // Return null if no content found between braces
	}
}

function extractTernaryOperands(ternaryExpression) {
	// Regular expression to match ternary conditional expressions
	const regex = /([^?]+)\s*\?\s*([^:]+)\s*:\s*([^;]+)/;
	const match = ternaryExpression.match(regex);

	if (match) {
		const condition = match[1].trim();
		const trueValue = match[2].trim();
		const falseValue = match[3].trim();
		return [condition, trueValue, falseValue];
	} else {
		return null; // Return null if no match is found
	}
}

function addToClassList(node, className, justReturnNewClassList) {
	let classNames = node.attributes["className"]
		? node.attributes["className"]
		: "";

	if (!classNames.includes(className)) {
		let newClassName = classNames + " " + className;
		if (justReturnNewClassList) return newClassName;
		else node.setAttribute("className", newClassName);
	}
}

function removeFromClassList(node, className) {
	let classNames = node.attributes["className"]
		? node.attributes["className"]
		: "";

	if (classNames.includes(className)) {
		classNames = classNames.replace(className, "");

		node.setAttribute("className", classNames);
	}
}

function getClassList(node) {
	let classNameString = "";
	let result = [[], [], []];

	if (node?.attributes["className"]) {
		classNameString = node.attributes["className"];
		const extractedLiterals = extractTemplateLiterals(classNameString);
		let conditionalClassName;
		extractedLiterals.forEach((literal) => {
			const operands = extractTernaryOperands(literal);

			conditionalClassName = [eval(operands[1]), eval(operands[2])].filter(
				(el) => el !== "" && el !== " "
			);

			literal = "${" + literal + "}";
			classNameString = classNameString.replace(literal, "");
		});

		let classNameArray = classNameString.trim().split(/\s+/);
		classNameArray = classNameArray.filter((el) => el !== "");
		result = [classNameArray, extractedLiterals, conditionalClassName];
	}
	return result;
}

function getInlineStyle(node) {
	let styleString = "";

	if (node?.attributes["style"]) {
		styleString = node.attributes["style"];
		let jsonString = extractContentBetweenBraces(styleString);

		try {
			const validJsonString = jsonString.replace(
				/(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
				'"$2":'
			);
			const jsonObject = JSON.parse(validJsonString);
			return jsonObject;
		} catch (error) {
			console.error("Error parsing JSON:", error);
			return null;
		}
	}
}

function updateInlineStyle(node, styleObj) {
	let styleString = "";
	Reflect.ownKeys(styleObj).map(
		(key, index) =>
			(styleString +=
				key +
				": " +
				`'${styleObj[key]}'${
					index !== Reflect.ownKeys(styleObj).length - 1 ? "," : ""
				}`)
	);
	let newStyle = "{{" + styleString + "}}";
	node && node.setAttribute("style", newStyle);
}
function addOnClick(node, fn) {
	if (node.tagName !== "style") {
		let onclick = node.attributes["onClick"]
			? node.attributes["onClick"]
			: "{(e) => {}}";

		let indexOfStart = onclick.indexOf("{", 1);
		onclick =
			onclick.slice(0, indexOfStart + 1) +
			fn +
			onclick.slice(indexOfStart + 1);
		return onclick;
	}
}

export {
	getClassList,
	addToClassList,
	removeFromClassList,
	getInlineStyle,
	updateInlineStyle,
	addOnClick,
};
