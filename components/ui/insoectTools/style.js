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
	getInlineStyle,
	updateInlineStyle,
} from "@/utils/livedom/nodeUtility";
export default function Style({
	node,
	stylejsxobj,
	setStyleJsxStyleObject,
	setRerenderPreview,
}) {
	const [inlineStyle, setInlineStyle] = useState({});
	const [classLiterals, setClassLiterals] = useState([]);
	const [conditionalClassName, setConditionalClassName] = useState([]);
	const [selectedClass, setSelectedClass] = useState();

	const [classInStyleJsx, setclassInStyleJsx] = useState();
	const [addClassShow, setAddClassShow] = useState(false);
	const newKeyInputRef = useRef(null);

	useEffect(() => {
		if (inlineStyle && Object.keys(inlineStyle).length > 0) {
			updateInlineStyle(node, inlineStyle);
			setRerenderPreview((prev) => (prev + 1) % 10);
		}
	}, [inlineStyle]);

	useEffect(() => {
		setInlineStyle(getInlineStyle(node));
	}, [node]);

	return (
		<>
			<div style={{ marginTop: "24px" }}>
				<form action=''>
					<fieldset>
						<legend>
							<small style={{ color: "gray" }}>{"inline style"}</small>{" "}
						</legend>
						<div id='tableContainer'>
							<EditableTable
								data={inlineStyle}
								setData={setInlineStyle}
								forcePlusButton={true}
							/>
						</div>
					</fieldset>
				</form>
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
