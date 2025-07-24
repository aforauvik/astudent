"use client";

import {useState, useCallback} from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";
import ProgressSection from "./ProgressSection";
import RememberSection from "./RememberSection";
import TaskSection from "./TaskSection";
import Productivity from "./Productivity";

const Dashboard = () => {
	const [productivityKey, setProductivityKey] = useState(0);
	const [plannedMinutes, setPlannedMinutes] = useState(0);

	const refreshProductivity = useCallback(() => {
		setProductivityKey((prev) => prev + 1);
	}, []);

	const updatePlannedMinutes = useCallback((change) => {
		setPlannedMinutes((prev) => prev + change);
	}, []);

	return (
		<div className="max-w-[120rem] h-screen w-full mx-auto flex flex-col justify-between">
			<div>
				<NavBar />
				<div className="flex gap-2 px-6 flex-wrap lg:flex-nowrap md:flex-wrap sm:flex-nowrap pt-4 pb-2">
					<Productivity
						key={productivityKey}
						onRefresh={refreshProductivity}
						plannedMinutes={plannedMinutes}
						updatePlannedMinutes={updatePlannedMinutes}
					/>
				</div>

				{/* <div className="p-4 max-w-[90rem] flex flex-col mx-auto size-full">
				<div className="flex gap-4 flex-wrap sm:flex-nowrap">
					<TaskSection title="To Do" />

					<RememberSection title="To Remember" />
				</div>
				<ProgressSection />
			</div> */}

				<div className="flex gap-2 px-2 flex-wrap lg:flex-nowrap md:flex-wrap sm:flex-nowrap">
					<TaskSection
						title="To Do"
						onTaskChange={refreshProductivity}
						onDurationChange={updatePlannedMinutes}
					/>
					<RememberSection title="To Remember" />
					<ProgressSection />
				</div>
			</div>

			<div>
				<Footer />
			</div>
		</div>
	);
};

export default Dashboard;
