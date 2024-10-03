import { useState, useRef, useEffect } from "react";
// import { liveDom } from "@/utils";
import { parse, stringify } from "flatted";
import {
	Dropdown,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button,
} from "reactstrap";

import gsap from "gsap";
import { Node } from "@/utils/livedom/node";
import {
	liveNodeRender,
	nodeSave,
	nodeLoad,
	addClassName,
	objectToNode,
} from "@/utils/livedom/node4live";
import InspectTools from "./insoectTools/inspectTools";
import Elements from "./elements";
import Layout from "./layout";
import States from "./states/states";
import Events from "./events/events";
import { State } from "@/utils/livedom/state";
import { liveState } from "@/utils/livedom";

const elements = {
	div: {
		tagName: "div",
		closeTag: "</div>",
		attribs: {},
	},
	button: {
		tagName: "button",
		closeTag: "</button>",
		attribs: {},
	},
	img: (src) => {
		return {
			tagName: "img",
			closeTag: "",
			attribs: { src: `${src}` },
		};
	},
	text: (text) => {
		return {
			tagName: "",
			closeTag: "</>",
			attribs: {},
			text: text,
		};
	},
};

// including min and max
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function Tools({
	styleJsxStyleObj,
	setStyleJsxStyleObject,
	setRerenderPreview,
	node,
	setNode2,
	selectedNode,
	setSelectedNode,
	rLiveSelectedElement,
	nodes,
	setNodes,
	setRLiveSelectedElement,
	setCodes,
	liveNode,
	liveDom,
	liveStates,
	setLiveStates,
	liveFunctions,
	setLiveFunctions,
	compDidMount,
	setCompDidMount,
}) {
	const states = {};
	Object.keys(liveStates).forEach(
		(key) => (states[key] = liveStates[key].value)
	);
	const [activeTab, setActiveTab] = useState(); // Set initial active tab
	const tabs = ["Events & Properties", "States & Sets", "View"];
	const [toolSet, setToolSet] = useState("elements");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropDownVar, setDropDownVar] = useState();
	const [comparisonDropDownVar, setComparisonDropDownVar] = useState();
	const toggle = () => setDropdownOpen((prevState) => !prevState);
	const inputKey = useRef();
	const inputValue = useRef();
	const inputText = useRef();
	const inputMin = useRef();
	const inputMax = useRef();
	const inputVarName = useRef();
	const inputOpacityDiscrete = useRef();
	const opacityForm = useRef();
	const [codeStates, setCodeStates] = useState([]);
	let stateItems = codeStates.map((s, i) => {
		return (
			<DropdownItem key={i} onClick={() => setDropDownVar(s)}>
				{s}
			</DropdownItem>
		);
	});

	useEffect(() => {
		let toolstablinks = document.getElementsByClassName("toolstablinks");
		toolstablinks[2].click();
	}, []);

	useEffect(() => {
		// console.log("selected node is #### ", selectedNode);
	}, [selectedNode]);

	const addState = (data) => {
		try {
			let newState;
			Object.keys(data).map((key) => {
				const word = key;
				const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
				newState = new State({
					name: key,
					setterName: `set${capitalized}`,
					value: data[key],
				});
			});

			// setLiveStates({ ...liveStates, [newState.name]: newState });
			setRerenderPreview((prev) => (prev + 1) % 10);
		} catch (e) {}
	};
	const deleteElement = (nodes, elId, originId) => {
		if (originId.length < 3) {
			alert("this node cannot be deleted");
			return;
		}
		if (elId.length === 3) {
			let idChars = elId.split("-");
			let childIndex = nodes.children.findIndex((el) => {
				let elIdChars = el.id.split("-");
				return idChars[1] === elIdChars[elIdChars.length - 1];
			});
			let child1 = nodes.children.slice(0, childIndex);
			let child2 = [];
			if (childIndex < nodes.children.length - 1)
				child2 = nodes.children.slice(childIndex + 1);
			nodes.children = [...child1, ...child2];
			setRLiveSelectedElement(originId.substring(0, originId.length - 2));
		} else {
			let idChars = elId.split("-");
			let childIndex = nodes.children.findIndex((el) => {
				let elIdChars = el.id.split("-");
				return idChars[1] === elIdChars[elIdChars.length - 1];
			});
			deleteElement(
				nodes.children[childIndex],
				elId.slice(idChars[0].length + 1),
				originId
			);
		}
		let updatedStyle = parsStyles(nodes);
		let styleElIndex = nodes.children.findIndex((el) => {
			return el.id === "style";
		});

		// let classStyle = `._${elId} { ${style} }`;
		nodes.children[styleElIndex] = {
			node: `<style jsx>{\` ${updatedStyle}
			\`}</style>`,
			children: [],
			id: "style",
		};
		setNodes({ ...nodes });
	};

	const changeTab = (e, tabName) => {
		let toolstabcontent = document.getElementsByClassName("toolstabcontent");
		for (let i = 0; i < toolstabcontent.length; i++) {
			toolstabcontent[i].style.display = "none";
		}
		// let toolstablinks = document.getElementsByClassName("toolstablinks");
		// for (let i = 0; i < toolstablinks.length; i++) {
		// 	toolstablinks[i].className = toolstablinks[i].className.replace(" active", "");
		// }
		document.getElementById(tabName).style.display = "block";
		// document.getElementById(tabName).style.transform = "rotate(-90deg)";
		setActiveTab(tabName);
		// e.currentTarget.className += " active";
		// if (tabName === "className" ) {

		// }
	};

	const updateNodeStyles = (nodes, elId, style, originId) => {
		let keys = style.map((el) => el[0]);
		let values = style.map((el) => el[1]);
		if (originId.length < 3 && elId < 3) {
			keys.forEach((k, index) => (nodes.style[k] = values[index]));
		}
		if (elId.length === 3) {
			let idChars = elId.split("-");
			let childIndex = nodes.children.findIndex((el) => {
				let elIdChars = el.id.split("-");
				return idChars[1] === elIdChars[elIdChars.length - 1];
			});
			keys.forEach(
				(k, index) => (nodes.children[childIndex].style[k] = values[index])
			);
		} else {
			let idChars = elId.split("-");
			let childIndex = nodes.children.findIndex((el) => {
				let elIdChars = el.id.split("-");
				return idChars[1] === elIdChars[elIdChars.length - 1];
			});
			updateNodeStyles(
				nodes.children[childIndex],
				elId.slice(idChars[0].length + 1),
				style,
				originId
			);
		}
		return nodes;
	};
	if (toolSet === "oldTools") {
		return (
			<div className='container-fluid '>
				<div className='row container-fluid'>
					<div className='row m-1 '>
						<button
							onClick={() => {
								const myDiv = new Node("div");
								myDiv.setAttribute("className", "row");
								myDiv.setAttribute(
									"style",
									'{{minHeight: "10px", backgroundColor: "yellow"}}'
								);
								myDiv.setAttribute(
									"onClick",
									'{(e)=> {console.log("Clicked!")}}'
								);

								selectedNode2.appendChild(myDiv);
								setRerenderPreview((prev) => (prev + 1) % 10);
								// let htmlCode = node2.render({ liveCode: false });
								// console.log("----", htmlCode);
								// setSelectedNode2(myDiv);

								// liveDom.LiveNode.allNodes[rLiveSelectedElement].addNode(
								// 	elements.div,
								// 	"row",
								// 	["row"],
								// 	{ minHeight: "10px", backgroundColor: "yellow" },
								// 	{}
								// );
								// setNodes(liveDom.LiveNode.allNodes["0"]);
							}}>
							Add row
						</button>
					</div>
					<div className='row m-1'>
						<button
							onClick={() => {
								liveDom.LiveNode.allNodes[rLiveSelectedElement].addNode(
									elements.div,
									"col",
									["col-3"],
									{ minHeight: "10px", backgroundColor: "green" },
									{}
								);

								setNodes(liveDom.LiveNode.allNodes["0"]);
							}}>
							Add Col
						</button>
					</div>
					<div className='row m-1'>
						<button
							onClick={() => {
								liveDom.LiveNode.allNodes[rLiveSelectedElement].addNode(
									elements.button,
									"button",
									[],
									{},
									{}
								);
								setNodes(liveDom.LiveNode.allNodes["0"]);
							}}>
							Add Button
						</button>
					</div>
					<div className='row m-1'>
						<button
							onClick={() => {
								liveDom.LiveNode.allNodes[rLiveSelectedElement].addNode(
									elements.img("next.svg"),
									"img",
									[],
									{},
									{}
								);
								setNodes(liveDom.LiveNode.allNodes["0"]);
							}}>
							Add Image
						</button>
					</div>

					<div className='row m-1'>
						<button
							onClick={() =>
								deleteElement(
									nodes,
									rLiveSelectedElement,
									rLiveSelectedElement
								)
							}>
							Delete Element
						</button>
					</div>

					<div className='row m-1'>
						<button
							onClick={() =>
								addChild(
									nodes,
									rLiveSelectedElement,
									`<div style={{minHeight:"10px", backgroundColor:"yellow"}} 
					>></div>`,
									rLiveSelectedElement,
									"",
									"div"
								)
							}>
							Add Div
						</button>
					</div>
					<div className='row m-1'>
						<button
							onClick={() => {
								let id = rLiveSelectedElement;
								let idChars = id.split("-");
								let parentId = id.substring(
									0,
									id.length - idChars[idChars.length - 1].length - 1
								);
								addStyle(nodes, id, [["position", "absolute"]]);
								addStyle(nodes, parentId, [["position", "relative"]]);
							}}>
							Make it fixed
						</button>
					</div>

					<div className='row m-1 align-items-center'>
						<div className='col-3'>
							<button
								onClick={() =>
									// 	addChild(
									// 		nodes,
									// 		rLiveSelectedElement,
									// 		`<div style={{minHeight:"10px", backgroundColor:"yellow"}}
									// >> ${inputText.current.value} </div>`,
									// 		rLiveSelectedElement,
									// 		"",
									// 		"div"
									// 	)
									{
										liveDom.LiveNode.allNodes[
											rLiveSelectedElement
										].addNode(elements.text("next.svg"), "text", []);
										setNodes(liveDom.LiveNode.allNodes["0"]);
									}
								}>
								Add Text
							</button>
						</div>
						<div className='col-9'>
							<span>Text</span>
							<input type='text' ref={inputText} />
						</div>
					</div>

					<div className='row m-1 align-items-center'>
						<div className='col-3'>
							<button
								onClick={() =>
									// addStyle(nodes, rLiveSelectedElement, [
									// 	[inputKey.current.value, inputValue.current.value],
									// ])
									{
										let string = inputKey.current.value;
										let obj;
										eval("obj=" + string);

										liveDom.LiveNode.allNodes[
											rLiveSelectedElement
										].addInlineStyle(obj);
										setNodes(liveDom.LiveNode.allNodes["0"]);
									}
								}>
								Update Inline Style
							</button>
						</div>
						<div className='col-6'>
							<span>Key</span>
							<input type='text' ref={inputKey} />
						</div>
					</div>

					<div className='row m-1'>
						<div className='col-3'>
							<button
								onClick={() => {
									let stateName = inputVarName.current.value;

									liveDom.State.addState({
										name: stateName,
										setterName: `set${stateName
											.slice(0, 1)
											.toUpperCase()}${stateName.slice(1)}`,
										value: 25,
									});

									let code = liveDom.prepareLiveCode(
										liveDom.LiveNode.toJsx(),
										liveDom.State.allLiveStatesToString()
									);
									setCodes(code);
									let cStates = [...codeStates];
									cStates.push(stateName);

									setCodeStates(cStates);

									// setCodes(
									// `const [${inputVarName.current.value},set${inputVarName.current.value}] = React.useState(getRandomInt(${inputMin.current.value},${inputMax.current.value}))`
									// )
								}}>
								Add State
							</button>
						</div>
						<div className='col-3'>
							<span>StateName</span>
							<input type='text' ref={inputVarName} />
						</div>
						<div className='col-2'>
							<span>Min</span>
							<input type='text' ref={inputMin} />
						</div>
						<div className='col-2'>
							<span>Max</span>
							<input type='text' ref={inputMax} />
						</div>
						<div className='col-2'></div>
					</div>
				</div>
				<hr />
				<div className='row container-fluid m-3'>
					<div className='row m-1 '>
						<div className='col-3 container-fluid '>
							<div className='row justify-content-start'>
								<Dropdown
									className='me-2'
									isOpen={dropdownOpen}
									toggle={toggle}
									direction='down'>
									<DropdownToggle caret color='primary'>
										State
									</DropdownToggle>
									<DropdownMenu>
										{/* <DropdownItem onClick={() => setDropDownVar("x")}>
									x
								</DropdownItem> */}
										{stateItems}
									</DropdownMenu>
								</Dropdown>
							</div>
							<div className='row justify-content-center'>
								{dropDownVar}{" "}
							</div>
						</div>

						<div className='col-3 container-fluid '>
							<div className='row justify-content-start'>
								<UncontrolledDropdown className='me-2' direction='down'>
									<DropdownToggle caret color='primary'>
										{"< = >"}
									</DropdownToggle>
									<DropdownMenu>
										<DropdownItem
											onClick={() => setComparisonDropDownVar("==")}>
											{"=="}
										</DropdownItem>
										<DropdownItem
											onClick={() => setComparisonDropDownVar("<")}>
											{"<"}
										</DropdownItem>
										<DropdownItem
											onClick={() => setComparisonDropDownVar(">")}>
											{">"}
										</DropdownItem>
										<DropdownItem
											onClick={() => setComparisonDropDownVar("<=")}>
											{"<="}
										</DropdownItem>
										<DropdownItem
											onClick={() => setComparisonDropDownVar(">=")}>
											{">="}
										</DropdownItem>
										<DropdownItem
											onClick={() => setComparisonDropDownVar("!=")}>
											{"!="}
										</DropdownItem>
									</DropdownMenu>
								</UncontrolledDropdown>
							</div>
							<div className='row justify-content-center'>
								{comparisonDropDownVar}
							</div>
						</div>
						<div
							id='gsaptest'
							className='gsaptest col-6 container-fluid mt-2'>
							<div className='row'>
								<form ref={opacityForm}>
									<input
										id='Discrete'
										type='radio'
										name='condOpacityType'
										value='Discrete'
										defaultChecked
									/>
									<label for='Discrete'>Discrete</label>
									<input
										className='ms-4'
										id='Continues'
										type='radio'
										name='condOpacityType'
										value='Continues'
									/>
									<label for='Continues'>Continues</label>
								</form>
							</div>

							<div className='row mt-1'>
								<input
									style={{ width: "20%" }}
									ref={inputOpacityDiscrete}
								/>
								<lable style={{ width: "70%" }}>then opacity 1 </lable>
							</div>
						</div>
					</div>
					<Button
						onClick={() => {
							let formdata = new FormData(opacityForm.current);
							let type = formdata.get("condOpacityType");
							let variable = dropDownVar;
							let comparisonSign = comparisonDropDownVar;
							liveDom.LiveNode.allNodes[
								rLiveSelectedElement
							].updateProperty({
								name: "conditionalOpacity",
								value: {
									type: type,
									variable: variable,
									comparisonSign: comparisonSign,
									value: inputOpacityDiscrete.current.value,
								},
							});
							setNodes(liveDom.LiveNode.allNodes["0"]);
						}}>
						{" "}
						Set{" "}
					</Button>
				</div>
			</div>
		);
	}

	if (toolSet === "inspect") {
		return (
			<InspectTools
				node={selectedNode}
				stylejsxobj={styleJsxStyleObj}
				setStyleJsxStyleObject={setStyleJsxStyleObject}
				setRerenderPreview={setRerenderPreview}
			/>
		);
	}

	if (toolSet === "elements") {
		return (
			<div className='container-fluid row'>
				<div className='col-1'>
					<div className='sidebar'>
						<ul>
							{tabs.map((tab, index) => (
								<li
									key={index}
									className={`${
										activeTab === tab ? "active" : ""
									} toolstablinks`}
									onClick={(e) => changeTab(e, tab)}>
									<span style={{ transform: "rotate(-90deg)" }}>
										{tab}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div id='View' className='toolstabcontent col-11'>
					<div style={{ minHeight: "200px" }}>
						<Elements
							node={selectedNode}
							stylejsxobj={styleJsxStyleObj}
							setStyleJsxStyleObject={setStyleJsxStyleObject}
							setSelectedNode={setSelectedNode}
							setRLiveSelectedElement={setRLiveSelectedElement}
							setRerenderPreview={setRerenderPreview}
						/>
					</div>
					<div style={{ minHeight: "200px" }}>
						<Layout
							node={selectedNode}
							stylejsxobj={styleJsxStyleObj}
							setStyleJsxStyleObject={setStyleJsxStyleObject}
							setSelectedNode={setSelectedNode}
							setRLiveSelectedElement={setRLiveSelectedElement}
							setRerenderPreview={setRerenderPreview}
						/>
					</div>
					<InspectTools
						node={selectedNode}
						stylejsxobj={styleJsxStyleObj}
						setStyleJsxStyleObject={setStyleJsxStyleObject}
						setRerenderPreview={setRerenderPreview}
					/>
				</div>
				<div id='States & Sets' className='toolstabcontent col-11'>
					<States
						states={states}
						liveStates={liveStates}
						addState={addState}
						liveFunctions={liveFunctions}
						setLiveFunctions={setLiveFunctions}
						compDidMount={compDidMount}
						setCompDidMount={setCompDidMount}
						setRerenderPreview={setRerenderPreview}
					/>
				</div>
				<div id='Events & Properties' className='toolstabcontent col-11'>
					<Events
						node={selectedNode}
						states={states}
						liveStates={liveStates}
						setStates={addState}
						liveFunctions={liveFunctions}
						setLiveFunctions={setLiveFunctions}
						setRerenderPreview={setRerenderPreview}
					/>
				</div>
				<style jsx>{`
					.sidebar {
						height: 100%;
						width: 45px; /* Adjust the width as needed */
						position: fixed;
						top: 0;
						left: 0;
						display: flex; /* Use flexbox */
						flex-direction: column; /* Arrange items vertically */
						background-color: #333; /* Adjust background color as needed */
					}

					.sidebar ul {
						list-style-type: none;
						padding: 0;
						flex: 1; /* Make the UL take up remaining vertical space */
						display: flex; /* Use flexbox */
						flex-direction: column; /* Arrange items vertically */
					}

					.sidebar li {
						flex: 1; /* Each tab takes up equal vertical space */
						text-align: center;
						color: white; /* Adjust text color as needed */
						cursor: pointer;
						display: flex; /* Use flexbox */
						align-items: center; /* Center content vertically */
						justify-content: center; /* Center content horizontally */
						transform: rotate(
							-0deg
						); /* Rotate text to vertical position */
						transform-origin: left top; /* Set rotation origin */
						white-space: nowrap; /* Prevent text wrapping */
					}

					.sidebar li.active {
						background-color: #555; /* Adjust background color for active tab */
					}
					.toolstabcontent {
						display: none;
						padding: 6px 12px;
						border: 1px solid #ccc;
						border-top: none;
					}
				`}</style>
			</div>
		);
	}
}
