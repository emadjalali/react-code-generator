import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { addOnClick } from "@/utils/livedom/nodeUtility";
import { useEffect, useState } from "react";
export default function Events({
	node,
	states,
	liveStates,
	setStates,
	liveFunctions,
	setLiveFunctions,
	setRerenderPreview,
}) {
	const [selectedState, setSelectedState] = useState("");
	const handleOnClickRadioChange = (e) => {
		let value = e.target.value;
		if (value === "No") {
			1;
		} else if (value === "Add") {
			node.setAttribute(
				"onClick",
				addOnClick(
					node,
					"result.current.push(e.target.getAttribute('_value'));\n console.log('result is' , e.target.getAttribute('_value'));"
				)
			);
		} else if (value === "Replace") {
			node.setAttribute(
				"onClick",
				addOnClick(
					node,
					"result.current= [e.target.getAttribute('_value')];\n console.log('result is' , e.target.getAttribute('_value'));"
				)
			);
		}
		setRerenderPreview((prev) => (prev + 1) % 10);

		// addOnClick(node);
	};

	const handleStateSelect = (e) => {
		let boundstates = node?.getBoundStates();
		let value = e.target.value.trim();
		if (e.target.value !== "") {
			node.setAttribute("_value", `{${e.target.value}}`);

			node.bindState(liveStates[value]);
		} else if (boundstates?.length > 0) node.unbindState(boundstates[0]);
		setSelectedState(value);
		setRerenderPreview((prev) => (prev + 1) % 10);
	};

	useEffect(() => {
		// console.log("======> ", node?.getBoundStates());
		let boundstates = node?.getBoundStates();
		if (boundstates?.length > 0) setSelectedState(boundstates[0].name);
		else setSelectedState("");
	}, [node]);
	return (
		<div>
			<form action=''>
				<fieldset>
					<legend>
						<small style={{ color: "gray" }}>{"onClick"}</small> {"  "}
					</legend>
					<FormControl>
						<FormLabel id='demo-radio-buttons-group-label'>
							Change result's value:
						</FormLabel>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							defaultValue='No'
							name='radio-buttons-group'
							onChange={handleOnClickRadioChange}>
							<FormControlLabel
								value='No'
								control={<Radio />}
								label='Do not change.'
							/>
							{/* <FormControlLabel
								value='Add'
								control={<Radio />}
								label='Add my value to the result.'
							/> */}
							<FormControlLabel
								value='Replace'
								control={<Radio />}
								label="Replace result's value with my value."
							/>
						</RadioGroup>
					</FormControl>
				</fieldset>
				<fieldset>
					<FormLabel id='demo-radio-buttons-group-label'>
						Bind an element to a state
					</FormLabel>
					<br />
					<FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
						<InputLabel id='demo-simple-select-standard-label'>
							states
						</InputLabel>
						<Select
							labelId='demo-simple-select-standard-label'
							id='demo-simple-select-standard'
							value={selectedState}
							onChange={handleStateSelect}
							label='State'>
							<MenuItem value=''>
								<em>None</em>
							</MenuItem>
							{Object.keys(states).map((state) => (
								<MenuItem value={state}> {state}</MenuItem>
							))}
						</Select>
					</FormControl>
				</fieldset>
			</form>
		</div>
	);
}
