"use client";

export default function ExportedPage() {
	return (
		<div className={`test test2 container-fluid`}>
			<style jsx>
				{`
					.fadeMeIn {
						transition: opacity 0.3s, visibility 0.3s;
						opacity: 1;
						visibility: visible;
					}
					.fadeMeOut {
						transition: opacity 0.3s, visibility 0.3s;
						opacity: 0;
						visibility: hidden;
					}
					.selectedElementPosition {
						position: relative;
					}
					.test {
						background-color: gray;
					}
				`}
			</style>
			<img src='next.svg' alt='Sample Image' />
			<br />
			Some text inside div.
			<div
				className={`row container-fluid`}
				style={{ height: "100px", backgroundColor: "red" }}>
				<div
					className={`col-3`}
					style={{ backgroundColor: "yellow" }}></div>
				<div
					className={`col-3`}
					style={{ backgroundColor: "yellow" }}></div>
			</div>
		</div>
	);
}
