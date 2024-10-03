class IfClause {
	ifPart;
	thenPart;
	id;
	nestedIfs;
	constructor(init) {
		this.ifPart = init?.ifPart;
		this.thenPart = init?.thenPart;
		this.id = init?.id;
		this.nestedIfs = [];
	}

	render() {
		let html = "";
		if (this.ifPart) html += `if (${this.ifPart}) {\r\n`;

		// Add thenPart
		if (this.thenPart) {
			html += this.thenPart;
		}

		// Render children
		this.nestedIfs.forEach((child) => {
			if (child instanceof IfClause) {
				html += child.render() + "\r\n";
			} else {
				html += child + "\r\n";
			}
		});
		if (this.ifPart) html += `\n}` + "\r\n";

		return html;
	}
}

export { IfClause };
