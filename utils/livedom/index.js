import * as parser from "./parser";
import * as modifyNodes from "./modifynodes";
import { Node, LiveNode } from "./oldnode";
import { StyleJsx } from "./stylejsx";
import { liveState, liveRef } from "./liveState";
import { State } from "./state";

export function prepareLiveCode(jsx, states, compDidMount, stateClass) {
	jsx = `<div> ${jsx}  <style jsx global> {${` \`
	
	.showSelectedElement1::before{
		pointer-events: none;
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgb(0 134 255 / 20%); 
	  }
	  .showSelectedElement2::before{
		pointer-events: none;
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgb(255 134 0 / 20%); 
	  }
	\` `} }  </style> </div>`;
	let codeString = `
	const getRandomInt = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	const usePreviousValue = value => {
		const ref = React.useRef();
		React.useEffect(() => {
			
		  ref.current = value;
		});
		
		return ref.current;
	  };

	const Comp=()=>{
		//const result = liveRef("result",[]);
		const result = React.useRef([]);
		${states}
		const initData = () => {
			${stateClass}
		  }

		React.useEffect(()=> {
			initData();
			${compDidMount}
		},[])
		return(${jsx})
		}
		render(<Comp setRLiveSelectedElement={setRLiveSelectedElement}/>)
		`;
	return codeString;
}

export {
	parser,
	modifyNodes,
	Node,
	LiveNode,
	StyleJsx,
	liveState,
	liveRef,
	State,
};
