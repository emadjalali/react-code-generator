import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlus,
	faPlusCircle,
	faRemove,
} from "@fortawesome/free-solid-svg-icons";
import EditableTable from "@/components/ui/editabletable";
import {
	addToClassList,
	removeFromClassList,
	getClassList,
} from "@/utils/livedom/nodeUtility";
export default function ClassName({
	node,
	stylejsxobj,
	setStyleJsxStyleObject,
	setRerenderPreview,
}) {
	const [classNames, setClassNames] = useState([]);
	const [classLiterals, setClassLiterals] = useState([]);
	const [conditionalClassName, setConditionalClassName] = useState([]);
	const [selectedClass, setSelectedClass] = useState();

	const [classInStyleJsx, setclassInStyleJsx] = useState();
	const [addClassShow, setAddClassShow] = useState(false);
	const newKeyInputRef = useRef(null);

	useEffect(() => {
		if (classInStyleJsx) {
			let newStyleObj = { ...stylejsxobj };
			newStyleObj.cssClasses[selectedClass] = classInStyleJsx;
			setStyleJsxStyleObject(newStyleObj);
		}
	}, [classInStyleJsx]);
	useEffect(() => {
		let [classNameArray, extractedLiterals, conditionalClassName] =
			getClassList(node);
		setClassNames(classNameArray);
		setClassLiterals(conditionalClassName);
	}, [node]);
	useEffect(() => {
		if (addClassShow) newKeyInputRef.current.focus();
	}, [addClassShow]);

	const handleKeyPress = (e) => {
		if (e.keyCode === 13) {
			if (e.target.value.trim() !== "") {
				addToClassList(node, e.target.value.trim());
				setSelectedClass(e.target.value.trim());
				let [classNameArray, extractedLiterals, conditionalClassName] =
					getClassList(node);
				setClassNames(classNameArray);
				setRerenderPreview((prev) => (prev + 1) % 10);
			}
			setAddClassShow(false);
		}
	};

	const removeClassName = () => {
		if (selectedClass) {
			removeFromClassList(node, selectedClass);
			let [classNameArray, extractedLiterals, conditionalClassName] =
				getClassList(node);
			setClassNames(classNameArray);
			setSelectedClass(null);
			setRerenderPreview((prev) => (prev + 1) % 10);
		}
	};
	return (
		<>
			<button
				onClick={() => {
					setAddClassShow(true);
				}}
				style={{
					borderRadius: "8px",
					marginBottom: "10px",
					marginRight: "10px",
				}}>
				<FontAwesomeIcon icon={faPlus} style={{ pointerEvents: "none" }} />{" "}
				{"  "}
				add className
			</button>
			<button
				onClick={removeClassName}
				style={{
					borderRadius: "8px",
					marginBottom: "10px",
					marginRight: "10px",
				}}>
				<FontAwesomeIcon
					icon={faRemove}
					style={{ pointerEvents: "none" }}
					onClick={() => {
						stylejsxobj.addCssToStyleJsx({
							[selectedClass]: {},
						});
						setclassInStyleJsx(stylejsxobj.cssClasses[selectedClass]);
					}}
				/>{" "}
				{"  "}
				remove className
			</button>
			{addClassShow && (
				<>
					<br />
					<input
						style={{
							borderRadius: "4px",

							marginBottom: "10px",
							marginRight: "0px",
						}}
						ref={newKeyInputRef}
						placeholder='Press Enter to Add'
						onKeyDown={handleKeyPress}
					/>
				</>
			)}
			<br />
			{Array.isArray(classNames) &&
				classNames.map((classname) => (
					<span
						style={{
							border:
								classname === selectedClass ? "1px solid yellow" : "",
						}}
						className='classnameStyle'
						onMouseDown={(e) => (e.target.style.scale = 0.97)}
						onMouseUp={(e) => (e.target.style.scale = 1)}
						onMouseLeave={(e) => (e.target.style.scale = 1)}
						onClick={() => {
							let cssclasses = extractProperties(
								stylejsxobj.cssClasses,
								[classname]
							);

							setSelectedClass(classname);
							setclassInStyleJsx(cssclasses[classname]);
							// const tableContainer =
							// 	document.getElementById("tableContainer");
							// tableContainer.innerHTML = "";
							// console.log("stylejsxobj.cssClasses ", cssclasses);
						}}>
						{classname}{" "}
					</span>
				))}
			<br />
			{Array.isArray(classLiterals) &&
				classLiterals.map((classliteral) => (
					<span
						className='classliteralStyle'
						onMouseDown={(e) => (e.target.style.scale = 0.97)}
						onMouseUp={(e) => (e.target.style.scale = 1)}
						onMouseLeave={(e) => (e.target.style.scale = 1)}
						onClick={() => {
							let cssclasses = extractProperties(
								stylejsxobj.cssClasses,
								[classliteral]
							);
							// const tableContainer =
							// 	document.getElementById("tableContainer");
							// tableContainer.innerHTML = "";
						}}>
						{classliteral}
					</span>
				))}
			<br />
			<div style={{ marginTop: "24px" }}>
				{createClassNameTags(
					selectedClass,
					classInStyleJsx,
					setclassInStyleJsx,
					stylejsxobj
				)}
			</div>
			<style jsx>{`
				.classnameStyle {
					display: inline-block;
					background-color: #b6b6ff;
					padding: 2px 4px;
					border-radius: 5px;
					filter: drop-shadow(1px 1px 3px black);
					margin: 2px 4px;
					width: min-content;
					cursor: pointer;
					user-select: none;
				}
				.classliteralStyle {
					display: inline-block;
					background-color: #ffb6b6;
					padding: 2px 4px;
					border-radius: 5px;
					filter: drop-shadow(1px 1px 3px black);
					margin: 4px 3px;
					width: min-content;
					cursor: pointer;
					user-select: none;
				}
			`}</style>
		</>
	);
}

function createClassNameTags(
	selectedClass,
	classInStyleJsx,
	setclassInStyleJsx,
	stylejsxobj
) {
	let html = "";
	let className;
	let table;
	if (classInStyleJsx)
		// for (const [key, value] of Object.entries(cssClass)) {
		// 	className = key;
		// 	// table = createEditableTable(value);
		// 	table = value;
		for (const [keyP, valueP] of Object.entries(classInStyleJsx)) {
			html += ` ${keyP}: ${valueP}`;
		}
	// }

	return (
		<form action=''>
			<fieldset>
				<legend>
					<small style={{ color: "gray" }}>{"<style jsx>"}</small> {"  "}
					{selectedClass && (
						<>
							<b
								style={{
									padding: "3px 6px",
									borderRadius: "8px",
									backgroundColor: "#b7b6ff",
								}}>
								.{selectedClass}
							</b>
							{"      "}
							{!classInStyleJsx && (
								<FontAwesomeIcon
									icon={faPlusCircle}
									style={{ color: "green", cursor: "pointer" }}
									onClick={() => {
										stylejsxobj.addCssToStyleJsx({
											[selectedClass]: {},
										});
										setclassInStyleJsx(
											stylejsxobj.cssClasses[selectedClass]
										);
									}}
								/>
							)}
						</>
					)}
					{"      "}
				</legend>
				<div id='tableContainer'>
					<EditableTable
						data={classInStyleJsx}
						setData={setclassInStyleJsx}
					/>
				</div>
			</fieldset>
		</form>
	);
}

function extractProperties(obj, propertiesToExtract) {
	const extractedProperties = {};
	propertiesToExtract.forEach((property) => {
		if (obj.hasOwnProperty(property)) {
			extractedProperties[property] = obj[property];
		}
	});
	return extractedProperties;
}
