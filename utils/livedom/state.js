class State {
	static allStates = {};
	name;
	setterName;
	value;
	initValue;
	constructor(init) {
		this.name = init?.name;
		this.setterName = init?.setterName;
		this.value = init?.value;
		this.initValue = { generateValue: false }; // {generateValue: true , code: '' , propName: '', ifClause:ifClause}
		State.allStates[`${this.name}`] = this;
	}
	static addState(state) {
		// let newState = new State(state);
		State.allStates[`${state.name}`] = state;
	}
	toLiveString() {
		return `[${this.name},${this.setterName}] = liveState()`;
	}
	toExportString() {
		return `[${this.name},${this.setterName}] = liveState()`;
	}
	static renderInitValue() {
		let allStatesString = " ";
		let stateKey = Object.keys(State.allStates);
		stateKey.forEach((key) => {
			if (State.allStates[key]?.initValue.code)
				allStatesString =
					allStatesString + `${State.allStates[key]?.initValue.code}\n`;
			if (State.allStates[key]?.initValue.ifClause?.render())
				allStatesString =
					allStatesString +
					`${State.allStates[key]?.initValue.ifClause?.render()}\n`;
		});
		return allStatesString;
	}
	static allLiveStatesToString() {
		let allStatesString = "";
		let stateKey = Object.keys(State.allStates);

		stateKey.forEach(
			(key) =>
				// (allStatesString = allStatesString.concat(
				// 	`const [${State.allStates[key].name},${
				// 		State.allStates[key].setterName
				// 	}] = liveState("${key}"${
				// 		State.allStates[key].value
				// 			? `,${State.allStates[key].value}`
				// 			: ""
				// 	}); \n`
				// ))
				(allStatesString = allStatesString.concat(
					`const [${State.allStates[key].name},${
						State.allStates[key].setterName
					}] = ${
						State.allStates[key].value
							? `useState(${State.allStates[key].value})`
							: "useState()"
					}; \n`
				))
		);

		return allStatesString;
	}
}
export { State };
