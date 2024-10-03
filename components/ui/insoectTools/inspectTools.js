import { useState, useEffect, useRef } from "react";

import EditableTable from "@/components/ui/editabletable";
import ClassName from "./className";
import Style from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faPlusCircle,
	faRemove,
} from "@fortawesome/free-solid-svg-icons";
import {
	addToClassList,
	removeFromClassList,
	getClassList,
} from "@/utils/livedom/nodeUtility";

export default function InspectTools({
	node,
	stylejsxobj,
	setStyleJsxStyleObject,
	setRerenderPreview,
}) {
	useEffect(() => {
		let tablinks = document.getElementsByClassName("tablinks");
		tablinks[0].click();
	}, []);

	const changeTab = (e, tabName) => {
		let tabcontent = document.getElementsByClassName("tabcontent");
		for (let i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
		let tablinks = document.getElementsByClassName("tablinks");
		for (let i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
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
					className='tablinks'
					onClick={(e) => changeTab(e, "className")}>
					className
				</button>
				<button className='tablinks' onClick={(e) => changeTab(e, "style")}>
					style
				</button>
				<button
					className='tablinks'
					onClick={(e) => changeTab(e, "events")}>
					events
				</button>
			</div>

			<div id='className' className='tabcontent'>
				<ClassName
					node={node}
					stylejsxobj={stylejsxobj}
					setStyleJsxStyleObject={setStyleJsxStyleObject}
					setRerenderPreview={setRerenderPreview}
				/>
			</div>

			<div id='style' className='tabcontent'>
				<Style
					node={node}
					stylejsxobj={stylejsxobj}
					setStyleJsxStyleObject={setStyleJsxStyleObject}
					setRerenderPreview={setRerenderPreview}
				/>
			</div>

			<div id='events' className='tabcontent'>
				<h3>Tokyo</h3>
				<p>Tokyo is the capital of Japan.</p>
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
				.tabcontent {
					display: none;
					padding: 6px 12px;
					border: 1px solid #ccc;
					border-top: none;
				}
			`}</style>
		</div>
	);
}
