import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";

import IfForm from "./ifform";
import { IfClause } from "@/utils/livedom/ifclause";
const myIfClause = new IfClause();
export default function Initdata({
	liveFunctions,
	setLiveFunctions,
	states,
	liveStates,
	addState,
	compDidMount,
	setCompDidMount,
	setRerenderPreview,
}) {
	const [initData, setInitData] = useState("");
	const [initFunc, setInitFunc] = useState("");
	const [selectedState, setSelectedState] = useState("");
	const [generateInitData, setGenerateInitData] = useState("none");
	const [ifClauses, setIfClauses] = useState([]);
	const [aGenerationType, setAGenerationType] = useState("generate");
	const [countDependance, setCountDependance] = useState("the value");
	const [propInput, setPropInput] = useState();
	const [a_maxInput, setA_maxInput] = useState();
	const [a_mulInput, setA_mulInput] = useState();
	const [b_minInput, setB_minInput] = useState();
	const [b_maxInput, setB_maxInput] = useState();
	const [b_mulInput, setB_mulInput] = useState();

	const [lessMoreEqualValues, setLessMoreEqualValues] = useState([]);

	useEffect(() => {
		if (liveStates[selectedState]?.initValue) {
			let gen = liveStates[selectedState].initValue?.generateValue
				? "generate"
				: "none";
			setGenerateInitData(gen);
		}

		// console.log("states > ", states);
	}, [selectedState]);
	useEffect(() => {
		console.log("ifClauses > ", ifClauses);
	}, [ifClauses]);
	useEffect(() => {
		// setLiveFunctions(
		// 	`const initdata = () => {\n ${initFunc} \n ${myIfClause.render()} \n}\n`
		// );
		// setCompDidMount((prev) => `${prev} initdata();\n`);
	}, [initFunc]);
	const getRandomInt = (a, b) => {};
	const generateValue = (stateName, range = "{ min: 1, max: 9, mul: 1 }") => {
		const capitalized =
			stateName.charAt(0).toUpperCase() + stateName.slice(1);
		const setterName = `set${capitalized}`;
		let func = `let ${stateName} = getRandomInt(${range}.min, ${range}.max);
		${stateName} = ${stateName} - (${stateName} % ${range}.mul);
		${stateName} = ${stateName} < ${range}.min ? ${stateName} + ${range}.mul : ${stateName};
		${setterName}(${stateName});\n`;
		// func = initFunc + "\n" + func;

		liveStates[selectedState].initValue = {
			...liveStates[selectedState].initValue,
			generateValue: true,
			code: func,
		};

		setRerenderPreview((prev) => (prev + 1) % 10);

		// setInitFunc(func);
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
		// func = initFunc + "\n" + func;

		liveStates[selectedState].initValue = {
			...liveStates[selectedState].initValue,
			generateValue: true,
			code: func,
		};

		setRerenderPreview((prev) => (prev + 1) % 10);
		// setInitFunc(func);
		// setLiveFunctions(`const initdata = () => {\n ${func} \n}\n`);
		// setCompDidMount((prev) => `${prev} initdata();\n`);
	};
	const ifClauseForm = () => {
		let ifclauses = new IfClause();
		myIfClause.nestedIfs.push(ifclauses);
		setIfClauses([...myIfClause.nestedIfs]);
	};

	const compareAandBMMM = (
		lessMoreEqualValues = ["<", ">", "="],
		propInput = 2,
		a_maxInput = 19,
		a_mulInput = 3,
		b_minInput = 2,
		b_maxInput = 19,
		b_mulInput = 3
	) => {
		setStates({ ...states, a: null, b: null, op: null });
		setCompDidMount((prev) => `${prev} initdata();\n`);
		let func =
			`const initdata = () => {\n` +
			`let array = [${lessMoreEqualValues.map((el) => `"${el}"`)}];\n` +
			`let operator = array[getRandomInt(0,${lessMoreEqualValues.length} - 1)];\n` +
			`let a,b,temp1, temp2;\n ` +
			`temp1 = getRandomInt(${propInput} + ${
				a_mulInput - (propInput % a_mulInput)
			},Math.min(${a_maxInput}, ${b_maxInput} - ${
				b_maxInput % b_mulInput
			} - 1));\n temp1 = temp1 - (temp1%${a_mulInput});\n` +
			`temp2 = operator === "=" ? temp1 :  getRandomInt(Math.max(temp1 + ${b_mulInput} - (temp1 % ${b_mulInput}), ${
				b_minInput + b_mulInput - (b_minInput % b_mulInput)
			}) , ${b_maxInput});\n temp2=temp2 - (temp2%${b_mulInput}); \n` +
			`operator === "<" ? a = temp1 : a = temp2 ;\n` +
			`operator === "<" ? b = temp2 : b = temp1 ;\n` +
			`setA(a); setB(b);setOp(operator);}\n `; // +
		// `console.log("a operator b " ,a , " ",operator, " " , b )}`;
		setLiveFunctions((prev) => prev + " " + func);
	};
	const compareAandBARR = (
		lessMoreEqualValues = ["<", ">", "="],
		a = [10, 50, 100, 500],
		b = [10, 50, 100, 500]
	) => {
		setStates({ ...states, a: null, b: null, op: null });
		setCompDidMount((prev) => `${prev} initdata();\n`);
		let func =
			`const initdata = () => {\n` +
			`let array = [${lessMoreEqualValues.map((el) => `"${el}"`)}];\n` +
			`let operator = array[getRandomInt(0,${lessMoreEqualValues.length} - 1)];\n` +
			`let a,b,temp1, temp2;\n ` +
			`temp1 = a[getRandomInt(0,${a.length} -1 )];\n` +
			`temp2 = b[getRandomInt(0,${a.length} -1 )];\n` +
			`operator === "<" ? a = temp1 : a = temp2 ;\n` +
			`operator === "<" ? b = temp2 : b = temp1 ;\n` +
			`setA(a); setB(b);setOp(operator);}\n `;
	};
	// const lessMoreEqualChange = (value) => {
	// 	if (lessMoreEqualValues.includes(value)) {
	// 		setLessMoreEqualValues(lessMoreEqualValues.filter((v) => v !== value));
	// 	} else {
	// 		setLessMoreEqualValues([...lessMoreEqualValues, value]);
	// 	}
	// };

	const handlePropInput = (e) => {
		if (selectedState !== "") {
			let prop = e.target.value;

			if (liveStates[selectedState]?.initValue) {
				liveStates[selectedState].initValue = {
					...liveStates[selectedState].initValue,
					generateValue: true,
					propName: prop,
				};
				// console.log(">>>>>>>>>>>>>>>>>>>>>>> ", liveStates[selectedState]);
			}

			setPropInput(e.target.value);
		}
	};
	// const handleA_maxChange = (e) => {
	// 	setA_maxInput(Number(e.target.value));
	// };
	// const handleA_mulChange = (e) => {
	// 	setA_mulInput(Number(e.target.value));
	// };

	// const handleB_minChange = (e) => {
	// 	setB_minInput(Number(e.target.value));
	// };
	// const handleB_maxChange = (e) => {
	// 	setB_maxInput(Number(e.target.value));
	// };
	// const handleB_mulChange = (e) => {
	// 	setB_mulInput(Number(e.target.value));
	// };

	const handleChange = (event) => {
		setInitData(event.target.value);
	};

	const handleGenerationType = () => {};

	return (
		<div>
			<br />
			<br />
			{initData === "a<=>b" && false && (
				<div>
					<label for='propInput'>a-min &nbsp;</label>
					<input
						id='propInput'
						type='number'
						value={propInput}
						style={{ width: "120px" }}
						onChange={handlePropInput}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<label for='a_maxInput'>a-max &nbsp;</label>
					<input
						id='a_maxInput'
						type='number'
						value={a_maxInput}
						style={{ width: "120px" }}
						onChange={handleA_maxChange}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<label for='a_mulInput'>a-mul &nbsp;</label>
					<input
						id='a_mulInput'
						type='number'
						value={a_mulInput}
						style={{ width: "120px" }}
						onChange={handleA_mulChange}
					/>
					<br />
					<br />
					<label for='b_minInput'>b-min &nbsp;</label>
					<input
						id='b_minInput'
						type='number'
						value={b_minInput}
						style={{ width: "120px" }}
						onChange={handleB_minChange}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<label for='b_maxInput'>b-max &nbsp;</label>
					<input
						id='b_maxInput'
						type='number'
						value={b_maxInput}
						style={{ width: "120px" }}
						onChange={handleB_maxChange}
					/>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<label for='b_mulInput'>b-mul &nbsp;</label>
					<input
						id='b_mulInput'
						type='number'
						value={b_mulInput}
						style={{ width: "120px" }}
						onChange={handleB_mulChange}
					/>
					<div style={{ fontSize: "36px" }}>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<label>
							{"<"}
							<input
								type='checkbox'
								value='<'
								checked={lessMoreEqualValues.includes("<")}
								onChange={() => lessMoreEqualChange("<")}
							/>
						</label>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<label>
							{">"}
							<input
								type='checkbox'
								value='>'
								checked={lessMoreEqualValues.includes(">")}
								onChange={() => lessMoreEqualChange(">")}
							/>
						</label>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<label>
							{"="}
							<input
								type='checkbox'
								value='='
								checked={lessMoreEqualValues.includes("=")}
								onChange={() => lessMoreEqualChange("=")}
							/>
						</label>
						<div style={{ fontSize: "20px" }}>
							Selected values: {JSON.stringify(lessMoreEqualValues)}
						</div>
					</div>
				</div>
			)}

			{initData === "a<=>b" ||
				(true && (
					<div>
						{" "}
						<FormControl fullWidth>
							<InputLabel id='select-state-label'>
								Select a state
							</InputLabel>
							<Select
								labelId='select-state-label'
								id='select-state'
								defaultValue=' '
								value={selectedState}
								label='Select a state'
								onChange={(e) => setSelectedState(e.target.value)}>
								<MenuItem value=' '>
									<em>None</em>
								</MenuItem>

								{Object.keys(states).map((state) => (
									<MenuItem value={state}> {state}</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl>
							<br />

							{selectedState !== "" && selectedState !== " " && (
								<RadioGroup
									row
									labelId='initialValueLabel'
									aria-labelledby='initialValueLabel'
									// defaultValue={generateInitData}
									value={generateInitData}
									name='initData-radio-buttons-group'
									onChange={(e) => {
										liveStates[selectedState].initValue = {
											...liveStates[selectedState]?.initValue,
											generateValue: true,
										};

										setGenerateInitData(e.target.value);
									}}>
									<FormLabel
										id='initialValueLabel'
										sx={{ alignSelf: "center" }}>
										initial value
									</FormLabel>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<FormControlLabel
										value='none'
										control={<Radio />}
										label='None'
									/>
									<FormControlLabel
										value='generate'
										control={<Radio />}
										label='generate'
									/>
								</RadioGroup>
							)}

							{generateInitData === "generate" && (
								<>
									<div>
										<button
											onClick={() => {
												generateValue(
													selectedState,
													//liveStates[propInput]?.value
													propInput
												);
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
										<label for='propInput'>Prop Name &nbsp;</label>
										<input
											id='propInput'
											value={propInput}
											style={{ width: "120px" }}
											onChange={handlePropInput}
										/>
									</div>
									<br />
									{ifClauses?.length > 0 && (
										<div
											id='ifclauseplaceholder'
											style={{
												border: "1px solid gray",
												padding: "10px",
												width: "100%",
											}}>
											{ifClauses.map((el, index) => (
												<div>
													<IfForm
														keyIndex={index}
														generateValue={generateValue}
														pickValue={generateValue}
														setIfClauses={setIfClauses}
														ifClauses={el}
														selectedState={selectedState}
														setInitFunc={setInitFunc}
													/>
												</div>
											))}
										</div>
									)}
									{/* <FormLabel id='generationtype-radio-buttons-group-label'>
										generation type
									</FormLabel>
									<RadioGroup
										row
										aria-labelledby='generationtype-radio-buttons-group-label'
										defaultValue='generate'
										name='radio-buttons-group'
										onChange={(e) =>
											setAGenerationType(e.target.value)
										}>
										<FormControlLabel
											value='generate'
											control={<Radio />}
											label='generate(needs min, max, and mul)'
										/>
										<FormControlLabel
											value='pick'
											control={<Radio />}
											label='pick from a list'
										/>
									</RadioGroup> */}
									{/* <br />
									<div>
										<label for='propInput'>between &nbsp;</label>
										<input
											id='propInput'
											type='number'
											defaultValue={1}
											value={propInput}
											style={{ width: "50px" }}
											// onChange={handleA_minChange}
										/>
										&nbsp;&nbsp;&nbsp;&nbsp;
										<label for='a_maxInput'>and &nbsp;</label>
										<input
											id='a_maxInput'
											type='number'
											defaultValue={1}
											value={a_maxInput}
											style={{ width: "50px" }}
											// onChange={handleA_maxChange}
										/>
									</div> */}
									{/* <FormLabel id='generate-radio-buttons-group-label'>
										each value must be:
									</FormLabel>
									<RadioGroup
										row
										aria-labelledby='generate-radio-buttons-group-label'
										defaultValue='generate'
										name='generate-radio-buttons-group'
										onChange={(e) =>
											setAGenerationType(e.target.value)
										}>
										<FormControlLabel
											value='generate'
											control={<Radio />}
											label="doesn't matter"
										/>
										<FormControlLabel
											value='pick'
											control={<Radio />}
											label='unique'
										/>
										<FormControlLabel
											value='pick'
											control={<Radio />}
											label='the same'
										/>
									</RadioGroup> */}

									<button
										style={{ height: "35px", borderRadius: "8px" }}
										onClick={() => {
											// setLiveFunctions(
											// 	`const initdata = () => {\n ${initFunc} \n ${myIfClause.render()} \n}\n`
											// );
											// setCompDidMount(
											// 	(prev) => `${prev} initdata();\n`
											// );
										}}>
										add
									</button>
								</>
							)}
						</FormControl>
						<br />
						<br />
						<FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id='simple-select-standard-label'>
								initdata
							</InputLabel>
							<Select
								labelId='simple-select-standard-label'
								id='demo-simple-select-standard'
								defaultValue=''
								value={initData}
								onChange={handleChange}
								label='initData'>
								<MenuItem value=''>
									<em>None</em>
								</MenuItem>
								<MenuItem value={"MMMa+b=c"}> a + b = c</MenuItem>
								<MenuItem value={"MMMa-b=c"}> a - b = c</MenuItem>
								<MenuItem value={"a<=>b"}> a {"<=>"} b </MenuItem>
								<MenuItem value={"ARRa+b=c"}>ARR a + b = c</MenuItem>
								<MenuItem value={"ARRa-b=c"}>ARR a - b = c</MenuItem>
								<MenuItem value={"ARRa<=>b"}>ARR a {"<=>"} b </MenuItem>
							</Select>
						</FormControl>
					</div>
				))}
		</div>
	);
}
