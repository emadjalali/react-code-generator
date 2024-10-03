import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function EditableTable({ data, setData, forcePlusButton }) {
	const [editedData, setEditedData] = useState({ ...data });
	const [showAddInputs, setShowAddInputs] = useState(false);
	const [newKey, setNewKey] = useState(null);
	const [newValue, setNewValue] = useState(null);
	const newKeyInputRef = useRef(null);
	const newValueInputRef = useRef(null);
	const [currentInput, setCurrentInput] = useState();

	const handleValueChange = (e, key) => {
		setData({
			...data,
			[key]: e.target.value,
		});
	};

	const handleKeyChange = (e, oldKey) => {
		let newData = { ...data };
		delete newData[oldKey];
		Reflect.ownKeys(data).map((key) => {
			if (e.target.value !== "") {
				if (key === oldKey) newData[e.target.value] = data[key];
				else newData[key] = data[key];
			}
		});
		setData(newData);
		setCurrentInput({ key: e.target.value, index: 0 });
	};

	const handleAddRecord = () => {
		setShowAddInputs(true);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Delete") {
			setShowAddInputs(false);
			setNewKey(null);
			setNewValue(null);
		}
	};

	useEffect(() => {
		if (currentInput && document.getElementById(currentInput.key)?.children) {
			let el = document.getElementById(currentInput.key).children[
				currentInput.index
			].children[0];
			el.focus();
		}
	}, [currentInput]);
	useEffect(() => {
		if (showAddInputs && newKeyInputRef.current) {
			newKeyInputRef.current.focus();
			newKeyInputRef.current.select();
		} else {
			setNewKey(null);
			setNewValue(null);
		}
	}, [showAddInputs]);
	useEffect(() => {
		if (showAddInputs) {
			if (newKey && newValue) {
				setData({
					...data,
					[newKey]: newValue,
				});
				setCurrentInput({ key: newKey, index: 0 });
				// setShowAddInputs(false);
			}
		}
	}, [newKey]);

	useEffect(() => {
		if (showAddInputs) {
			if (newKey && newValue) {
				setData({
					...data,
					[newKey]: newValue,
				});
				setCurrentInput({ key: newKey, index: 1 });
			}
		}
	}, [newValue]);

	useEffect(() => {
		setShowAddInputs(false);
	}, [data]);

	return (
		<div>
			{(data || forcePlusButton) && (
				<div
					style={{
						width: "36px",
						height: "36px",
						fontSize: "36px",
						color: "#2a76ff",
						marginBottom: "10px",
						justifyContent: "start",
						display: "inline-block",
						borderRadius: "100%",
						cursor: "pointer",
					}}
					onMouseDown={(e) => {
						e.target.style.marginLeft = "1px";
						e.target.style.scale = 0.97;
					}}
					onMouseUp={(e) => {
						e.target.style.marginLeft = "0";
						e.target.style.scale = 1;
					}}
					onMouseLeave={(e) => {
						e.target.style.marginLeft = "0";
						e.target.style.scale = 1;
					}}
					onClick={handleAddRecord}>
					<FontAwesomeIcon
						icon={faPlusCircle}
						style={{ pointerEvents: "none" }}
					/>
				</div>
			)}

			<table>
				<tbody id='tableBody'>
					{data &&
						Reflect.ownKeys(data).map((key) => (
							<tr key={key} id={key}>
								<td>
									<input
										type='text'
										value={key}
										onChange={(e) => handleKeyChange(e, key)}
									/>
								</td>{" "}
								:{" "}
								<td>
									<input
										type='text'
										value={data[key]}
										onChange={(e) => handleValueChange(e, key)}
									/>
								</td>
							</tr>
						))}
					{showAddInputs && (
						<tr>
							<td>
								<input
									type='text'
									ref={newKeyInputRef}
									placeholder='New Key'
									value={newKey}
									onChange={(e) => setNewKey(e.target.value)}
									onKeyDown={handleKeyPress}
								/>
							</td>{" "}
							:{" "}
							<td>
								<input
									type='text'
									placeholder='New Value'
									value={newValue}
									onChange={(e) => setNewValue(e.target.value)}
									onKeyDown={handleKeyPress}
								/>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

export default EditableTable;
