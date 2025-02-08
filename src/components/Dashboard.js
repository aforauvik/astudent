"use client";

import Footer from "./Footer";
import MoreButton from "./More";
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
					{/* <MoreButton /> */}
					<RememberSection title="To Remember" />
				</div>
				<ProgressSection />
			</div>
			<Footer />
		</div>
	);
};

export default Dashboard;
