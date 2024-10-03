import { useState, useRef, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatTextdirectionLToRIcon from "@mui/icons-material/FormatTextdirectionLToR";
import FormatTextdirectionRToLIcon from "@mui/icons-material/FormatTextdirectionRToL";
import { styled } from "@mui/material/styles";
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

import {
	faPlus,
	faPlusCircle,
	faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { Node } from "@/utils/livedom/node";

import {
	addToClassList,
	removeFromClassList,
	getClassList,
	getInlineStyle,
	updateInlineStyle,
} from "@/utils/livedom/nodeUtility";

const getSpecificStyleInClass = (node, stylejsxobj, style) => {
	let classList = getClassList(node)[0];
	let result = "unset";

	for (const [keyP, valueP] of Object.entries(stylejsxobj.cssClasses)) {
		if (classList.includes(keyP)) {
			for (const [key, value] of Object.entries(valueP)) {
				if (key === style) result = value;
			}
		}
	}

	return result;
};

export default function Elements({
	node,
	stylejsxobj,
	setStyleJsxStyleObject,
	setSelectedNode,
	setRLiveSelectedElement,
	setRerenderPreview,
}) {
	const [anchorEl, setAnchorEl] = useState(null);
	const inlineWidth = () =>
		getInlineStyle(node)?.width ? getInlineStyle(node).width : "unset";
	const inlineHeight = () =>
		getInlineStyle(node)?.height ? getInlineStyle(node).height : "unset";
	const classWidth = () => getSpecificStyleInClass(node, stylejsxobj, "width");
	const classHeight = () =>
		getSpecificStyleInClass(node, stylejsxobj, "height");

	const [widthInput, setWidthInput] = useState();
	const [heightInput, setHeightInput] = useState();
	const [srcInput, setSrcInput] = useState();
	const [altInput, setAltInput] = useState("");
	const [textInput, setTextInput] = useState("");
	const [inlineStyle, setInlineStyle] = useState({});

	useEffect(() => {
		if (inlineStyle && Object.keys(inlineStyle).length > 0) {
			updateInlineStyle(node, inlineStyle);
			setRerenderPreview((prev) => (prev + 1) % 10);
		}
	}, [inlineStyle]);

	useEffect(() => {
		setInlineStyle(getInlineStyle(node));
		let inWidth = inlineWidth();
		let clWidth = classWidth();
		let inHeight = inlineHeight();
		let clHeight = classHeight();
		setSrcInput(node?.attributes["src"]);
		setAltInput(node?.attributes["alt"]);
		setTextInput(node?.textContent);
		if (inWidth !== "unset") setWidthInput(inWidth);
		else setWidthInput(clWidth);
		if (inHeight !== "unset") setHeightInput(inHeight);
		else setHeightInput(clHeight);
	}, [node]);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (item) => {
		if (item === "div") {
			const myDiv = new Node("div");
			node.appendChild(myDiv);
			setSelectedNode(myDiv);
			setRLiveSelectedElement([myDiv._id]);
		}
		if (item === "img") {
			const myImg = new Node("img");
			node.appendChild(myImg);
			setSelectedNode(myImg);
			setRLiveSelectedElement([myImg._id]);
		}
		if (item === "layer") {
			let positionClass = getSpecificStyleInClass(
				node,
				stylejsxobj,
				"position"
			);
			let positionInline = getInlineStyle(node)?.position;
			if (positionInline !== "absolute" && positionClass !== "absolute") {
				updateInlineStyle(node, { ...inlineStyle, position: "relative" });
			}

			const myDiv = new Node("div");
			myDiv.setAttribute(
				"style",
				"{{position: 'absolute', left: '0', top: '0' , width: '100%' , height: '100%'}}"
			);
			node.appendChild(myDiv);
			setSelectedNode(myDiv);
			setRLiveSelectedElement([myDiv._id]);
		}
		// Do something with the selected item
		handleClose();
	};

	const handleSrcChange = (e) => {
		try {
			node.setAttribute("src", e.target.value);
			setSrcInput(e.target.value);
			setRerenderPreview((prev) => (prev + 1) % 10);
		} catch (e) {}
	};
	const handleAltChange = (e) => {
		try {
			node.setAttribute("alt", e.target.value);
			setAltInput(e.target.value);
			setRerenderPreview((prev) => (prev + 1) % 10);
		} catch (e) {}
	};
	const handleWidthChange = (e) => {
		if (e.target.value === "") {
			let clWidth = classWidth();
			setWidthInput(clWidth);
			setInlineStyle({ ...inlineStyle, width: clWidth });
		} else {
			setWidthInput(e.target.value);
			setInlineStyle({ ...inlineStyle, width: e.target.value });
		}
	};
	const handleHeightChange = (e) => {
		if (e.target.value === "") {
			let clHeight = classHeight();
			setHeightInput(clHeight);
			setInlineStyle({ ...inlineStyle, height: clHeight });
		} else {
			setHeightInput(e.target.value);
			setInlineStyle({ ...inlineStyle, height: e.target.value });
		}
	};

	const handleTextChange = (e) => {
		try {
			node.textContent = e.target.value;
			setTextInput(e.target.value);
			setRerenderPreview((prev) => (prev + 1) % 10);
		} catch (e) {}
	};

	return (
		<div style={{ marginBottom: "20px", border: "1px solid lightgray" }}>
			<div style={{ padding: "10px" }}>
				<Button
					variant='contained'
					style={{ width: "200px" }}
					endIcon={<ExpandMoreIcon />}
					onClick={handleClick}>
					Add Element
				</Button>
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleClose}
					PaperProps={{ style: { width: "193px" } }}
					// style={{ width: "100%" }}
				>
					<MenuItem onClick={() => handleMenuItemClick("div")}>
						&nbsp;
						<FontAwesomeIcon
							icon={faPlus}
							style={{ pointerEvents: "none" }}
						/>
						&nbsp; div
					</MenuItem>
					<MenuItem onClick={() => handleMenuItemClick("img")}>
						&nbsp;
						<FontAwesomeIcon
							icon={faPlus}
							style={{ pointerEvents: "none" }}
						/>
						&nbsp; img
					</MenuItem>
					<MenuItem onClick={() => handleMenuItemClick("layer")}>
						&nbsp;
						<FontAwesomeIcon
							icon={faPlus}
							style={{ pointerEvents: "none" }}
						/>
						&nbsp; layer
					</MenuItem>

					{/* Add more menu items as needed */}
				</Menu>
				&nbsp;&nbsp;&nbsp;
				<button
					style={{ height: "35px", borderRadius: "8px" }}
					onClick={() => {
						node.parent.removeChild(node);

						setSelectedNode(node.parent);
						setRLiveSelectedElement([`${node.parent._id}`]);
					}}>
					REMOVE SELECTED ELEMENT
				</button>
				<br />
				<br />
				<IconButton
					// style={{ width: "200px" }}
					onClick={() =>
						setInlineStyle({ ...inlineStyle, direction: "ltr" })
					}>
					<FormatTextdirectionLToRIcon />
				</IconButton>
				&nbsp;
				<IconButton
					variant='contained'
					// style={{ width: "200px" }}
					onClick={() =>
						setInlineStyle({ ...inlineStyle, direction: "rtl" })
					}>
					<FormatTextdirectionRToLIcon />
				</IconButton>
			</div>
			<div className='styleProperties'>
				{node?.tagName === "img" && (
					<>
						<span className='widthStyle'>
							<label for='srcInput'>
								&nbsp; &nbsp; &nbsp; &nbsp; src &nbsp;
							</label>
							<input
								id='srcInput'
								type='text'
								value={srcInput}
								style={{ width: "120px" }}
								onChange={handleSrcChange}
							/>
						</span>
						<span className='heightStyle'>
							<label for='altInput'>
								&nbsp; &nbsp; &nbsp; &nbsp; alt &nbsp;
							</label>
							<input
								id='altInput'
								type='text'
								value={altInput}
								style={{ width: "120px" }}
								onChange={handleAltChange}
							/>
						</span>
					</>
				)}
				<span className='widthStyle'>
					<label for='widthInput'>
						&nbsp; &nbsp; &nbsp; &nbsp; width &nbsp;
					</label>
					<input
						id='widthInput'
						type='text'
						value={widthInput}
						style={{ width: "120px" }}
						onChange={handleWidthChange}
					/>
				</span>
				<span className='heightStyle'>
					<label for='heightInput'>
						&nbsp; &nbsp; &nbsp; &nbsp;height &nbsp;
					</label>
					<input
						id='heightInput'
						type='text'
						value={heightInput}
						style={{ width: "120px" }}
						onChange={handleHeightChange}
					/>
				</span>
				<span className='widthStyle'>
					<label for='minWidthInput'>min-width &nbsp;</label>
					<input
						id='minWidthInput'
						type='text'
						className='class1 class2 class3'
						style={{ width: "120px" }}
						onChange={(e) => {}}
					/>
				</span>
				<span className='heightStyle'>
					<label for='minHeightInput'>min-height &nbsp;</label>
					<input
						id='minHeightInput'
						type='text'
						style={{ width: "120px" }}
						onChange={(e) => {}}
					/>
				</span>
				<span className='textStyle'>
					<label for='textInput'>text &nbsp;</label>
					<input
						id='textInput'
						type='text'
						value={textInput}
						style={{ width: "371px" }}
						onChange={handleTextChange}
					/>
				</span>
			</div>
			{/* <div>
				<button
					onClick={() => {
						const myDiv = new Node("div");
						node.appendChild(myDiv);
						setSelectedNode(myDiv);
						setRLiveSelectedElement([myDiv._id]);
					}}
					style={{
						borderRadius: "8px",
						marginBottom: "10px",
						marginRight: "10px",
					}}>
					<FontAwesomeIcon
						icon={faPlus}
						style={{ pointerEvents: "none" }}
					/>{" "}
					{"  "}
					div
				</button>

				<button
					onClick={() => {}}
					style={{
						borderRadius: "8px",
						marginBottom: "10px",
						marginRight: "10px",
					}}>
					<FontAwesomeIcon
						icon={faPlus}
						style={{ pointerEvents: "none" }}
					/>{" "}
					{"  "}
					img
				</button>
			</div> */}

			<style jsx>{`
				.styleProperties {
					display: grid;
					grid-template-columns: 220px 220px;
					grid-template-rows: 40px 40px 40px 40px 40px;
					column-gap: 30px;
					justify-items: end;
					margin-top: 20px;

					margin-left: 0px;
				}

				.widthStyle {
					grid-column-start: 1;
				}

				.heightStyle {
					grid-column-start: 2;
				}
				.textStyle {
					grid-column-start: 1;
					grid-column-end: 3;
				}
			`}</style>
		</div>
	);
}
