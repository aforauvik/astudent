"use client";

import {useEffect, useState} from "react";

const CurrentDateTime = () => {
	const [currentDateTime, setCurrentDateTime] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const options = {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
				// hour: "2-digit",
				// minute: "2-digit",
				// second: "2-digit",
			};
			setCurrentDateTime(now.toLocaleString("en-US", options));
		}, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<h2 className="text-sm font-semibold py-3 px-4 dark:text-neutral-500 hidden sm:block">
				{currentDateTime}
			</h2>
		</div>
	);
};

export default CurrentDateTime;
