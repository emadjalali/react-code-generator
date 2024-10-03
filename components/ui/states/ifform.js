import { useEffect, useState } from "react";
import { IfClause } from "@/utils/livedom/ifclause";
export default function IfForm({
	keyIndex,

	setIfClauses,
	ifClauses,

	selectedState,
	setInitFunc,
}) {
	const [ifClausesLocal, setIfClausesLocal] = useState([]);
	const [inputValue, setInputValue] = useState();
	const [propInput, setPropInput] = useState();
	const ifClauseForm = () => {
		let ifclauses = new IfClause();
		ifClauses.nestedIfs.push(ifclauses);
		setIfClausesLocal([...ifClauses.nestedIfs]);
	};

	const handlePropInput = (e) => {
		setPropInput(e.target.value);
	};

	const generateValue = (stateName, range = "{ min: 1, max: 9, mul: 1 }") => {
		const capitalized =
			stateName.charAt(0).toUpperCase() + stateName.slice(1);
		const setterName = `set${capitalized}`;
		let func = `let ${stateName} = getRandomInt(${range}.min, ${range}.max);
		${stateName} = ${stateName} - (${stateName} % ${range}.mul);
		${stateName} = ${stateName} < ${range}.min ? ${stateName} + ${range}.mul : ${stateName};
		${setterName}(${stateName});\n`;
		ifClauses.thenPart = func;

		setIfClausesLocal([...ifClauses.nestedIfs]);

		// setLiveFunctions(`const initdata = () => {\n ${ifClauses} ${func} \n}\n`);
		// setCompDidMount((prev) => `${prev} initdata();\n`);
	};

	const pickValue = (stateName, list = "[1]") => {
		const capitalized =
			stateName.charAt(0).toUpperCase() + stateName.slice(1);
		const setterName = `set${capitalized}`;

		let func =
			// `let List = [${list.map((el) =>
			// 	typeof el === "string" ? `"${el}"` : el
			// )}];\n` +
			`let ${stateName} = ${list}[getRandomInt(0, ${list}.length - 1)];\n
		${setterName}(${stateName});\n`;
		ifClauses.thenPart = func;

		setIfClausesLocal([...ifClauses.nestedIfs]);
		// setLiveFunctions(`const initdata = () => {\n ${func} \n}\n`);
		// setCompDidMount((prev) => `${prev} initdata();\n`);
	};

	const handleChange = (e) => {
		ifClauses.ifPart = e.target.value;
	};
	return (
		<div>
			<label for={`ifClause${keyIndex}`}>if {"("}</label>
			<input
				id={`ifClause${keyIndex}`}
				value={inputValue}
				onChange={handleChange}
			/>
			<label>{")"}</label>
			<br />
			<div>
				<button
					onClick={() => {
						generateValue(selectedState, 1, 2);
					}}
					style={{
						height: "35px",

						borderRadius: "8px",
					}}>
					generate
				</button>
				&nbsp;&nbsp;
				<button
					onClick={() => {
						pickValue(selectedState, propInput);
					}}
					style={{
						height: "35px",
						borderRadius: "8px",
					}}>
					pick from a list
				</button>
				&nbsp;&nbsp;
				<button
					onClick={() => {
						ifClauseForm();
					}}
					style={{
						height: "35px",
						borderRadius: "8px",
					}}>
					add if clause
				</button>
			</div>
			<br />
			<div>
				<label for={`propInput${keyIndex}`}>Prop Name &nbsp;</label>
				<input
					id={`propInput${keyIndex}`}
					value={propInput}
					style={{ width: "120px" }}
					onChange={handlePropInput}
				/>
			</div>
			<br />
			{ifClausesLocal.length > 0 && (
				<div
					id='ifclauseplaceholder'
					style={{
						border: "1px solid gray",
						padding: "10px",
						width: "100%",
					}}>
					{ifClausesLocal.map((el, index) => (
						<IfForm
							keyIndex={`${keyIndex}-${index}`}
							generateValue={generateValue}
							pickValue={generateValue}
							setIfClauses={setIfClauses}
							ifClauses={el}
						/>
					))}
				</div>
			)}
		</div>
	);
}
