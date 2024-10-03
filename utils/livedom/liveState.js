import React, { useEffect } from "react";
function liveState() {
	const state = React.useRef({});

	const createState = (k, v) => {
		let init = state.current[k] ? state.current[k] : v ? v : "";

		const [newState, setNewState] = React.useState(init);
		React.useEffect(() => {
			state.current[k] = newState;
		}, [newState]);
		return [newState, setNewState];
	};

	return [state, (k, v) => createState(k, v)];
}

function liveRef() {
	const state = React.useRef({});

	const createRef = (k, v) => {
		let init = state.current[k] ? [...state.current[k]?.current] : v ? v : "";
		const newRef = React.useRef(init);
		React.useEffect(() => {
			state.current[k] = newRef;
		}, [newRef]);
		return newRef;
	};

	return [state, (k, v) => createRef(k, v)];
}
export { liveState, liveRef };
