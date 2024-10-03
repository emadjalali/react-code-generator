"use client";

import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { parse, stringify } from "flatted";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";

import { liveDom } from "@/utils";
import { Node } from "@/utils/livedom/node";
import { liveNodeRender, objectToNode } from "@/utils/livedom/node4live";
import { Button, Menu, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
	addToClassList,
	removeFromClassList,
	getClassList,
} from "@/utils/livedom/nodeUtility";
import Tools from "@/components/ui/tools";
import { StyleJsx } from "@/utils/livedom";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

const styleJsxStyleObj = new liveDom.StyleJsx();
const initialJsxStyle = () =>
	"{`" + styleJsxStyleObj.allClassesToString() + "`}";

const initRootNode = {
	tagName: "div",
	openTag: `<div style={{minHeight:"400px", }} className={\`container _0  \`} onClick={()=>{
		setRLiveSelectedElement("0")}}>`,
	closeTag: `</div>`,
	children: [],
	id: "0",
	classNames: ["container", "_0"],
	inlineStyles: { minHeight: "400px" },
	attribs: {
		classNames: ["container", "_0"],
		inlineStyles: { minHeight: "400px" },
	},
	styleJsx: {
		_0: { "background-color": "gray" },
	},

	type: "styleJsx",
	property: {},
};

export default function Home() {
	const [anchorElSave, setAnchorElSave] = useState(null);
	const [anchorElLoad, setAnchorElLoad] = useState(null);
	const [rerenderPreview, setRerenderPreview] = useState(0);
	const [showFileInput, setShowFileInput] = useState(false);
	// const [rootNode] = useState(new liveDom.Node(initRootNode));
	const [rootNode] = useState(new liveDom.LiveNode(initRootNode));
	const [liveStates, setLiveStates] = useState(liveDom.State.allStates);
	const [liveFunctions, setLiveFunctions] = useState("");
	const [compDidMount, setCompDidMount] = useState("");

	const [node2, setNode2] = useState(null);
	const [styleJsxStyleObject, setStyleJsxStyleObject] =
		useState(styleJsxStyleObj);
	const [selectedNode, setSelectedNode] = useState(null);

	const [, createLiveState] = liveDom.liveState();
	const [, createLiveRef] = liveDom.liveRef();

	const [nodes, setNodes] = useState(rootNode);
	const [codes, setCodes] = useState("");
	const [showSelectedItem, setShowSelectedItem] = useState(false);
	const [providerShowSelectedItem, setProviderShowSelectedItem] =
		useState(null);
	// const str = liveDom.parser.prepareLiveCode(nodes);
	const [liveCode, setLiveCode] = useState();
	const [statusBar, setStatusBar] = useState("status");
	const [rLiveSelectedElement, setRLiveSelectedElement] = useState(null);

	const handleClick = (event, fn) => {
		fn(event.currentTarget);
	};

	const handleClose = (fn) => {
		fn(null);
	};

	useEffect(() => {
		setRerenderPreview((prev) => (prev + 1) % 10);
	}, [liveFunctions]);

	useEffect(() => {
		// if (showSelectedItem)
		// 	liveDom.LiveNode.allNodes[rLiveSelectedElement].addClassNames(
		// 		"selectedElement"
		// 	);
		// else
		// 	liveDom.LiveNode.allNodes[rLiveSelectedElement].removeClassNames(
		// 		"selectedElement"
		// 	);
		setNodes(liveDom.LiveNode.allNodes["0"]);
	}, [showSelectedItem]);

	useEffect(() => {
		if (showSelectedItem)
			// liveDom.LiveNode.allNodes[rLiveSelectedElement].addClassNames(
			// 	"selectedElement"
			// );
			setNodes(liveDom.LiveNode.allNodes["0"]);
		setStatusBar(`item ${rLiveSelectedElement} selected`);
		// if (node2 instanceof Node)
		if (showSelectedItem)
			setProviderShowSelectedItem(
				Node.getElementBy_id(rLiveSelectedElement[0])
			);
		rLiveSelectedElement &&
			setSelectedNode(Node.getElementBy_id(rLiveSelectedElement[0]));
	}, [rLiveSelectedElement]);

	useEffect(() => {
		let jsx = liveDom.LiveNode.toJsx();
		let allLiveStates = liveDom.State.allLiveStatesToString();
		let newCode = liveDom.prepareLiveCode(
			jsx,
			`${allLiveStates} \n${liveFunctions}`,
			compDidMount,
			liveDom.State.renderInitValue()
		);
		// setLiveCode(newCode);
		let htmlCode;
		if (node2 === null) {
			let newState = new liveDom.State({
				name: "mystate",
				setterName: "setMystate",
			});

			// console.log("###### >>> ", liveDom.State.allStates);

			// allLiveStates = liveDom.State.allLiveStatesToString();
			// newCode = liveDom.prepareLiveCode(jsx, allLiveStates);
			// Example usage:
			const myDiv = new Node("div");
			const stylejsx = new Node("style");

			stylejsx.setAttribute("jsx", "");
			stylejsx.textContent = initialJsxStyle();
			myDiv.appendChild(stylejsx);

			const myImg = new Node("img");
			myImg.setAttribute("src", "next.svg");

			myImg.setAttribute("alt", "Sample Image");

			const myBr = new Node("br");

			myDiv.setAttribute("className", "test test2");

			myDiv.appendChild(myImg);
			myDiv.appendChild(myBr);
			myDiv.textContent = "Some text inside div.";

			// Generate HTML code

			setNode2(myDiv);
			setSelectedNode(myDiv);
			setRLiveSelectedElement([myDiv._id.toString()]);
			// htmlCode = myDiv.render({ liveCode: false });
			htmlCode = myDiv.render({ show_id: true });

			// htmlCode = liveNodeRender(myDiv);
		} else {
			// htmlCode = node2.render({ liveCode: false });
			// htmlCode = node2.render();

			htmlCode = node2.render4live({ show_id: true });
			// htmlCode = liveNodeRender(node2);
		}
		newCode = liveDom.prepareLiveCode(
			htmlCode,
			`${allLiveStates} \n${liveFunctions}`,
			compDidMount,
			liveDom.State.renderInitValue()
		);
		setLiveCode(newCode);
	}, [nodes, codes, node2, selectedNode, rerenderPreview]);

	useEffect(() => {
		if (node2 != null) {
			let allLiveStates = liveDom.State.allLiveStatesToString();

			let indexOfStyleElement = node2.children.findIndex(
				(node) => node.tagName === "style"
			);
			let styleElement = node2.children[indexOfStyleElement];
			node2.removeChild(styleElement);
			const stylejsx = new Node("style");
			stylejsx.setAttribute("jsx", "");
			stylejsx.textContent = initialJsxStyle();
			node2.appendChild(stylejsx);
			let htmlCode = node2.render4live({ show_id: true });
			let newCode = liveDom.prepareLiveCode(
				htmlCode,
				allLiveStates,
				compDidMount,
				liveDom.State
			);
			setLiveCode(newCode);
		}
	}, [styleJsxStyleObject]);
	useEffect(() => {
		// console.log("selected node in Page @@@@@@ ", selectedNode);
	}, [selectedNode]);
	const selectElemet = (x) => {
		// liveDom.LiveNode.allNodes[rLiveSelectedElement].removeClassNames(
		// 	"selectedElement"
		// );
		setRLiveSelectedElement(x);
	};

	useEffect(() => {}, [liveCode]);
	useEffect(() => {
		return () => {
			Node.elementsBy_id = [];
			delete Node.counter;
		};
	}, []);

	const loadFromFile = async (e) => {
		handleClose(setAnchorElLoad);
		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = e.target.result;
			let nodeStyle = parse(text);
			Node.elementsBy_id = [];
			let node = objectToNode(nodeStyle.node);

			let style = nodeStyle.style;
			styleJsxStyleObj.cssClasses = style.cssClasses;
			setNode2(node);
			setSelectedNode(node);
			// setRerenderPreview((prev) => (prev + 1) % 10);
		};
		reader.readAsText(e.target.files[0]);
		setShowFileInput(false);
	};

	const loadElementFromFile = async (e) => {
		handleClose(setAnchorElLoad);
		const reader = new FileReader();
		reader.onload = async (e) => {
			const text = e.target.result;
			let nodeStyle = parse(text);

			delete nodeStyle.node._id;
			let node = objectToNode(nodeStyle.node);
			let style = nodeStyle.style;
			styleJsxStyleObj.cssClasses = {
				...styleJsxStyleObj.cssClasses,
				...style.cssClasses,
			};
			selectedNode.appendChild(node);
			setSelectedNode(node);
		};
		reader.readAsText(e.target.files[0]);
		setShowFileInput(false);
	};
	const saveToFile = async (node, styleJsxStyleObj) => {
		Object.keys(Node.elementsBy_id).forEach((key) => {
			let id = Node.elementsBy_id[key]._id;
			if (id.toString().includes("clone")) {
				delete Node.elementsBy_id[key];
			}
		});
		const nodeStyle = { node: node, style: styleJsxStyleObj };
		const json = stringify(nodeStyle);
		// await fetch("/api", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-type": "application/json",
		// 	},
		// 	body: JSON.stringify(json),
		// });
		const fileName = "ui4reactSavedFile";
		const blob = new Blob([json], { type: "application/json" });
		const href = URL.createObjectURL(blob);

		// create "a" HTLM element with href to file
		const link = document.createElement("a");
		link.href = href;
		link.download = fileName + ".json";
		document.body.appendChild(link);
		link.click();

		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	const exportToFile = async () => {
		const jsxString = node2.render();
		const fileName = "ui4reactSavedFile";
		const blob = new Blob([jsxString], { type: "text/plain" });
		const href = URL.createObjectURL(blob);

		// create "a" HTLM element with href to file
		const link = document.createElement("a");
		link.href = href;
		link.download = fileName + ".txt";
		document.body.appendChild(link);
		link.click();

		// clean up "a" element & remove ObjectURL
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};
	const memorizedProvider = useMemo(
		() => (
			<LiveProvider
				code={liveCode}
				noInline
				scope={{
					useState: useState,
					setRLiveSelectedElement: selectElemet,
					rLiveSelectedElement: rLiveSelectedElement,
					showSelectedItem: showSelectedItem,
					gsap: gsap,
					liveState: createLiveState,
					liveRef: createLiveRef,
					Image: Image,
				}}>
				<div
					className='d-flex flex-column justify-content-between col-12'
					style={{
						height: "50%",
						maxHeight: "50vh",
						border: "4px solid #f2f2f2",
						overflow: "auto",
						paddingLeft: "0px",
					}}>
					<div style={{ width: "100%" }}>
						<LivePreview />
					</div>
				</div>

				<div
					className='row '
					style={{
						height: "50%",
						backgroundColor: "black",
						overflow: "auto",
					}}>
					<LiveEditor />
					<LiveError />
				</div>
			</LiveProvider>
		),
		[liveCode, providerShowSelectedItem, showSelectedItem]
	);
	return (
		<main>
			<div style={{ width: "100vw", height: "100vh" }}>
				<div
					className='container-fluid'
					style={{ width: "100%", height: "100%" }}>
					<div className='row'>
						<div className='col-6 container-fluid'>
							<div className='row pt-2 ' style={{ minHeight: "70%" }}>
								<div
									className='col-12'
									style={{ backgroundColor: "#f2fbff" }}>
									<Tools
										styleJsxStyleObj={styleJsxStyleObj}
										setStyleJsxStyleObject={setStyleJsxStyleObject}
										setRerenderPreview={setRerenderPreview}
										node={node2}
										setNode2={setNode2}
										selectedNode={selectedNode}
										setSelectedNode={setSelectedNode}
										liveCode={liveCode}
										setLiveCode={setLiveCode}
										rLiveSelectedElement={rLiveSelectedElement}
										setRLiveSelectedElement={setRLiveSelectedElement}
										liveNode={nodes}
										nodes={nodes}
										setNodes={setNodes}
										setCodes={setCodes}
										liveDom={liveDom}
										liveStates={liveStates}
										setLiveStates={setLiveStates}
										liveFunctions={liveFunctions}
										setLiveFunctions={setLiveFunctions}
										compDidMount={compDidMount}
										setCompDidMount={setCompDidMount}
									/>
								</div>
							</div>

							<div className='row' style={{ minHeight: "30%" }}></div>
						</div>
						<div className='col-6 container-fluid'>
							<div className='row' style={{ alignItems: "center" }}>
								<div className='col-1'>
									<label class='switch'>
										<input
											onClick={() =>
												setShowSelectedItem((prev) => !prev)
											}
											type='checkbox'
											checked={showSelectedItem}
										/>
										<span class='slider round'></span>
									</label>
								</div>
								<div className='col-5 ms-3'>
									<label>Show Selected Element</label>
								</div>
								<div className='col-5'>
									<div style={{ display: "inline-block" }}>
										<Button
											variant='outlined'
											style={{ width: "80px" }}
											endIcon={<ExpandMoreIcon />}
											onClick={(e) =>
												handleClick(e, setAnchorElSave)
											}>
											SAVE
										</Button>
										<Menu
											anchorEl={anchorElSave}
											open={Boolean(anchorElSave)}
											onClose={() => handleClose(setAnchorElSave)}
											PaperProps={{ style: { width: "193px" } }}
											// style={{ width: "100%" }}
										>
											<MenuItem
												onClick={() =>
													saveToFile(node2, styleJsxStyleObj)
												}>
												&nbsp; &nbsp; Save
											</MenuItem>
											<MenuItem
												onClick={() => {
													let newstylejsx = new StyleJsx();
													let [
														classnames,
														,
														conditionalclassnames,
													] = getClassList(selectedNode);
													classnames.forEach(
														(cl) =>
															(newstylejsx.cssClasses[cl] =
																styleJsxStyleObj.cssClasses[cl])
													);
													conditionalclassnames.forEach(
														(cl) =>
															(newstylejsx.cssClasses[cl] =
																styleJsxStyleObj.cssClasses[cl])
													);
													saveToFile(selectedNode, newstylejsx);
												}}>
												&nbsp; &nbsp; Save an Element
											</MenuItem>
										</Menu>
									</div>
									&nbsp;
									<div style={{ display: "inline-block" }}>
										<Button
											variant='outlined'
											style={{ width: "80px" }}
											endIcon={<ExpandMoreIcon />}
											onClick={(e) =>
												handleClick(e, setAnchorElLoad)
											}>
											LOAD
										</Button>
										<Menu
											anchorEl={anchorElLoad}
											open={Boolean(anchorElLoad)}
											onClose={() => handleClose(setAnchorElLoad)}
											PaperProps={{ style: { width: "193px" } }}
											// style={{ width: "100%" }}
										>
											<MenuItem
											// onClick={
											// 	() => {}
											// 	// saveToFile(node2, styleJsxStyleObj)
											// }>
											>
												<Button
													component='label'
													role={undefined}
													style={{
														width: "100%",
														justifyContent: "start",
													}}
													tabIndex={-1}>
													&nbsp; &nbsp;Load
													<VisuallyHiddenInput
														onChange={loadFromFile}
														type='file'
													/>
												</Button>
											</MenuItem>
											<MenuItem
											// onClick={
											// 	() => {}
											// 	// saveToFile(node2, styleJsxStyleObj)
											// }>
											>
												<Button
													component='label'
													role={undefined}
													style={{
														width: "100%",
														justifyContent: "start",
													}}
													tabIndex={-1}>
													&nbsp; &nbsp;Load an Element
													<VisuallyHiddenInput
														onChange={loadElementFromFile}
														type='file'
													/>
												</Button>
											</MenuItem>
										</Menu>
									</div>
									{/* <Button
											onClick={() => {
												saveToFile();
											}}>
											Save
										</Button>{" "} */}
									{/* </div>
									<div className='col-2'> */}
									{/* <Button
											onClick={() => {
												setShowFileInput((prev) => !prev);
											}}>
											Load
										</Button>{" "} */}
									{/* </div>

									<div className='col-2'> */}
									&nbsp;
									<Button
										variant='outlined'
										onClick={() => {
											exportToFile();
										}}>
										Export
									</Button>
								</div>

								{showFileInput && (
									<div>
										<input
											type='file'
											onChange={(e) => loadFromFile(e)}
										/>
									</div>
								)}
							</div>
							<div className='row'></div>

							<div
								className='row'
								style={{
									height: "60px",
									backgroundColor: "#f7f7e1",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "0px 10px",
								}}>
								{statusBar}
								<Button
									variant='contained'
									style={{
										width: "180px",
										margin: "10px",
									}}
									onClick={(e) => {
										if (selectedNode?.parent instanceof Node) {
											// setSelectedNode(selectedNode?.parent);
											setRLiveSelectedElement([
												selectedNode.parent._id.toString(),
											]);
										}
									}}>
									Select Parent
								</Button>
							</div>
							<div className='row'>{memorizedProvider}</div>
						</div>
					</div>
				</div>
			</div>
			<style jsx>{``}</style>
		</main>
	);
}
