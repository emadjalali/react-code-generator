import { useState, useRef, useEffect } from "react";
import {
	addToClassList,
	removeFromClassList,
	getClassList,
} from "@/utils/livedom/nodeUtility";
import { Button } from "@mui/material";
import { Node } from "@/utils/livedom/node";

export default function Layout({
	node,
	stylejsxobj,
	setStyleJsxStyleObject,
	setSelectedNode,
	setRLiveSelectedElement,
	setRerenderPreview,
}) {
	const [colValue, setColValue] = useState(1);
	useEffect(() => {
		let layouttablinks = document.getElementsByClassName("layouttablinks");
		layouttablinks[0].click();
	}, []);

	const changeTab = (e, tabName) => {
		let layouttabcontent =
			document.getElementsByClassName("layouttabcontent");
		for (let i = 0; i < layouttabcontent.length; i++) {
			layouttabcontent[i].style.display = "none";
		}
		let layouttablinks = document.getElementsByClassName("layouttablinks");
		for (let i = 0; i < layouttablinks.length; i++) {
			layouttablinks[i].className = layouttablinks[i].className.replace(
				" active",
				""
			);
		}
		document.getElementById(tabName).style.display = "block";
		e.currentTarget.className += " active";
		// if (tabName === "className" ) {

		// }
	};
	return (
		<div>
			<div className='tab'>
				<button
					className='layouttablinks'
					onClick={(e) => changeTab(e, "bootstrap")}>
					bootstrap
				</button>
				<button
					className='layouttablinks'
					onClick={(e) => changeTab(e, "css-grid")}>
					css-grid
				</button>
			</div>
			<div>
				<div id='bootstrap' className='layouttabcontent'>
					<button
						style={{ height: "35px", borderRadius: "8px" }}
						onClick={() => {
							let allrows = [];
							Object.values(node.getElementBy_id("*")).forEach(
								(element) => {
									if (getClassList(element)[0].includes("row")) {
										allrows.push(element._id.toString());
									}
								}
							);
							setRLiveSelectedElement(allrows);
						}}>
						select all rows
					</button>
					&nbsp;&nbsp;
					<button
						style={{ height: "35px", borderRadius: "8px" }}
						onClick={() => {
							let allrows = [];
							Object.values(node.getElementBy_id("*")).forEach(
								(element) => {
									let colRegex = /col-[0-9][0-2]?/;
									let containsCol = getClassList(element)[0].some(
										(el) => {
											return colRegex.test(el);
										}
									);
									if (containsCol) {
										allrows.push(element._id.toString());
									}
								}
							);
							setRLiveSelectedElement(allrows);
						}}>
						select all cols
					</button>
					<br />
					<br />
					<Button
						variant='contained'
						style={{ width: "130px" }}
						onClick={() => {
							addToClassList(node, "container-fluid");
							const myDiv = new Node("div");
							myDiv.setAttribute("className", "row");
							node.appendChild(myDiv);
							setSelectedNode(myDiv);
							setRLiveSelectedElement([myDiv._id]);
						}}>
						add row
					</Button>
					&nbsp;&nbsp;
					<Button
						variant='contained'
						style={{ width: "160px" }}
						onClick={() => {
							addToClassList(node, "container-fluid");
							const myDiv = new Node("div");
							myDiv.setAttribute("className", `col-${colValue}`);
							node.appendChild(myDiv);
							setSelectedNode(myDiv);
							setRLiveSelectedElement([myDiv._id]);
						}}>
						add col-&nbsp;{" "}
						<input
							style={{ width: "40px", height: "26px" }}
							value={colValue}
							onChange={(e) => setColValue(e.target.value)}
							onClick={(e) => {
								e.stopPropagation();
							}}
						/>
					</Button>
				</div>

				<div id='css-grid' className='layouttabcontent'></div>
			</div>

			<style jsx>{`
				/* Style the tab */
				.tab {
					overflow: hidden;
					border: 1px solid #ccc;
					background-color: #f1f1f1;
				}

				/* Style the buttons inside the tab */
				.tab button {
					background-color: inherit;
					float: left;
					border: none;
					outline: none;
					cursor: pointer;
					padding: 14px 16px;
					transition: 0.3s;
					font-size: 17px;
				}

				/* Change background color of buttons on hover */
				.tab button:hover {
					background-color: #ddd;
				}

				/* Create an active/current tablink className */
				.tab button.active {
					background-color: #ccc;
				}

				/* Style the tab content */
				.layouttabcontent {
					display: none;
					padding: 6px 12px;
					border: 1px solid #ccc;
					border-top: none;
				}
			`}</style>
		</div>
	);
}
