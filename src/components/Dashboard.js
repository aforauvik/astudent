"use client";

import Footer from "./Footer";
import NavBar from "./NavBar";
import ProgressSection from "./ProgressSection";
import RememberSection from "./RememberSection";
import TaskSection from "./TaskSection";

const Dashboard = () => {
	return (
		<div className="">
			<NavBar />
			<div className="p-4 max-w-[90rem] flex flex-col mx-auto size-full">
				<div className="flex gap-4 flex-wrap sm:flex-nowrap">
					<TaskSection title="To Do" />

					<RememberSection title="To Remember" />
				</div>
				<ProgressSection />
			</div>
			<Footer />
		</div>
	);
};

export default Dashboard;
