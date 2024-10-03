"use client";
import {
	getPanelElement,
	getPanelGroupElement,
	getResizeHandleElement,
	Panel,
	PanelGroup,
	PanelResizeHandle,
} from "react-resizable-panels";
import { useRef, useEffect } from "react";

export default function Example() {
	const refs = useRef();

	useEffect(() => {
		const groupElement = getPanelGroupElement("group");
		const leftPanelElement = getPanelElement("left-panel");
		const rightPanelElement = getPanelElement("right-panel");
		const resizeHandleElement = getResizeHandleElement("resize-handle");

		// If you want to, you can store them in a ref to pass around
		refs.current = {
			groupElement,
			leftPanelElement,
			rightPanelElement,
			resizeHandleElement,
		};
	}, []);

	return (
		<PanelGroup direction='horizontal' id='group'>
			<Panel id='left-panel'>
				<div
					style={{
						backgroundColor: "blue",
						width: "100%",
						height: "100%",
					}}></div>
			</Panel>
			<PanelResizeHandle id='resize-handle' />
			<Panel id='right-panel'>Something{/* ... */}</Panel>
		</PanelGroup>
	);
}
