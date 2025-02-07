"use client";

import NavBar from "./NavBar";
import ProgressSection from "./ProgressSection";
import RememberSection from "./RememberSection";
import TaskSection from "./TaskSection";

const Dashboard = () => {
	return (
		<div className="">
			<NavBar />
			<div className="p-4">
				<div className="flex gap-4">
					<TaskSection title="To Do" />
					<RememberSection title="To Remember" />
				</div>
				<ProgressSection />
			</div>
		</div>
	);
};

export default Dashboard;
