function convertStyles(inputString) {
	// Split the input string by class names
	const classNames = inputString.split(/\s+(?=\.[a-zA-Z])/);

	// Initialize an object to store the converted styles
	const convertedStyles = {};

	// Iterate over each class name
	classNames.forEach((className) => {
		if (className) {
			// Extract class name and styles
			let [, name, stylesString] = /(\.[a-zA-Z]+)\s+\{(.+?)\}/.exec(
				className
			);
			if (name[0] === ".") name = name.substring(1);

			// Split styles by semi-colon and trim each style
			const styles = stylesString
				.trim()
				.split(";")
				.map((style) => style.trim())
				.slice(0, -1);

			// Initialize an object to store the converted styles for this class
			const convertedClassStyles = {};

			// Iterate over each style
			styles.forEach((style) => {
				// Split style by colon
				const [property, value] = style
					.split(":")
					.map((part) => part.trim());

				// Add property and value to converted class styles
				convertedClassStyles[property] = `${value}`;
			});

			// Add converted class styles to the result
			convertedStyles[name] = convertedClassStyles;
		}
	});

	return convertedStyles;
}
class StyleJsx {
	id;
	type;
	cssClasses;
	constructor(cssClass) {
		this.id = "styleJsx";
		this.type = "styleJsx";
		this.cssClasses = {
			fadeMeIn: {
				transition: "opacity 0.3s, visibility 0.3s",
				opacity: "1",
				visibility: "visible",
			},
			fadeMeOut: {
				transition: "opacity 0.3s, visibility 0.3s",
				opacity: "0",
				visibility: "hidden",
			},
			selectedElementPosition: {
				position: "relative",
			},
			test: {
				"background-color": "gray",
			},
		};
		if (cssClass && Object.keys(cssClass).length > 0)
			this.addCssToStyleJsx(cssClass);
	}
	addCssToStyleJsx(cssClass) {
		let className = Object.keys(cssClass)[0];
		let style = cssClass[className];
		let styleKeys = Object.keys(style);
		if (!this.cssClasses[className]) this.cssClasses[className] = {};
		// if (Object.keys)
		styleKeys.forEach((key) => {
			// if (!this.cssClasses[className]) this.cssClasses[className] = {};
			this.cssClasses[className][key] = style[key];
		});
	}
	allClassesToString() {
		let cssClassesString = "";
		let cssClassesKeys = Object.keys(this.cssClasses);
		cssClassesKeys.forEach((classKey) => {
			let styleString = "";
			let style = this.cssClasses[classKey];
			let styleKeys = Object.keys(style);
			styleKeys.forEach(
				(key) =>
					(styleString = styleString.concat(` ${key}: ${style[key]};`))
			);
			cssClassesString = cssClassesString.concat(
				` .${classKey} { ${styleString} } `
			);
		});
		return cssClassesString;
	}
	// loadFromNode(node) {
	// 	console.log(convertStyles(eval(node.textContent)));
	// 	this.cssClasses = convertStyles(eval(node.textContent));
	// }
	getStyleJsxElement() {
		return `<style jsx>{\` ${this.allClassesToString()} 
		

		.selectedElement{
			border: 2px solid red;
		}
		
		\`}</style>`;
	}
}

export { StyleJsx };
