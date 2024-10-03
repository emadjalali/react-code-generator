import { useEffect } from "react";
import EditableTable from "../editabletable";
import Initdata from "./initdata";
export default function States({
	states,
	liveStates,
	addState,
	liveFunctions,
	setLiveFunctions,
	compDidMount,
	setCompDidMount,
	setRerenderPreview,
}) {
	return (
		<div>
			<EditableTable data={states} setData={addState} />
			<Initdata
				liveFunctions={liveFunctions}
				setLiveFunctions={setLiveFunctions}
				states={states}
				liveStates={liveStates}
				addState={addState}
				compDidMount={compDidMount}
				setCompDidMount={setCompDidMount}
				setRerenderPreview={setRerenderPreview}
			/>
		</div>
	);
}
