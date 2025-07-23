"use client";

import {useState, useEffect} from "react";
import {supabase} from "../lib/supabaseClient";
import {useRouter} from "next/navigation";
import {LuClock} from "react-icons/lu";
import {LuAlarmClock} from "react-icons/lu";
import {IoMdRefresh} from "react-icons/io";
import WeeklyStreak from "./WeeklyStreak";

const Productivity = ({onRefresh}) => {
	const [totalMinutes, setTotalMinutes] = useState(0);
	const [completedMinutes, setCompletedMinutes] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [currentDate, setCurrentDate] = useState(
		new Date().toISOString().split("T")[0]
	);
	const router = useRouter();

	// Get today's day string (e.g., 'Tue')
	const jsDayToString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const today = new Date();
	const todayDayString = jsDayToString[today.getDay()];

	useEffect(() => {
		fetchProductivityData();

		// Check for date change every minute
		const interval = setInterval(() => {
			const newDate = new Date().toISOString().split("T")[0];
			if (newDate !== currentDate) {
				setCurrentDate(newDate);
				fetchProductivityData(); // Refresh data for new day
			}
		}, 60000); // Check every minute

		// Set up real-time subscription for tasks
		const tasksSubscription = supabase
			.channel("tasks-changes")
			.on(
				"postgres_changes",
				{event: "*", schema: "public", table: "tasks"},
				() => {
					fetchProductivityData(); // Refresh when tasks change
				}
			)
			.subscribe();

		// Set up real-time subscription for productivity
		const productivitySubscription = supabase
			.channel("productivity-changes")
			.on(
				"postgres_changes",
				{event: "*", schema: "public", table: "productivity"},
				() => {
					fetchProductivityData(); // Refresh when productivity changes
				}
			)
			.subscribe();

		return () => {
			clearInterval(interval);
			supabase.removeChannel(tasksSubscription);
			supabase.removeChannel(productivitySubscription);
		};
	}, [currentDate]);

	const fetchProductivityData = async () => {
		setIsLoading(true);
		const {data: sessionData, error: sessionError} =
			await supabase.auth.getSession();

		if (sessionError || !sessionData?.session) {
			await supabase.auth.signOut();
			router.push("/");
			return;
		}

		const userId = sessionData.session.user.id;

		// Fetch all tasks for the user
		const {data: tasksData, error: tasksError} = await supabase
			.from("tasks")
			.select("*")
			.eq("user_id", userId)
			.order("sort_order", {ascending: true});

		if (!tasksError && tasksData) {
			// Calculate total minutes from daily tasks and today's specific tasks
			let totalMinutes = 0;

			tasksData.forEach((task) => {
				if (task.duration) {
					// Include daily tasks
					if (task.day_of_week === "Daily") {
						totalMinutes += task.duration;
					}
					// Include today's specific tasks
					else if (task.day_of_week === todayDayString) {
						totalMinutes += task.duration;
					}
				}
			});

			setTotalMinutes(totalMinutes);
		}

		// Fetch completed minutes for today
		const {data: productivityData, error: productivityError} = await supabase
			.from("productivity")
			.select("completed_minutes")
			.eq("user_id", userId)
			.eq("date", currentDate)
			.single();

		if (!productivityError && productivityData) {
			setCompletedMinutes(productivityData.completed_minutes);
		} else {
			setCompletedMinutes(0);
		}

		setIsLoading(false);
	};

	const formatTotalTime = (minutes) => {
		if (minutes === 0) return "0 minutes";

		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		if (hours === 0) {
			return `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
		} else if (remainingMinutes === 0) {
			return `${hours} hour${hours !== 1 ? "s" : ""}`;
		} else {
			return `${hours} hour${
				hours !== 1 ? "s" : ""
			} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
		}
	};

	// Function to manually refresh productivity data
	const refreshProductivity = () => {
		fetchProductivityData();
	};

	if (isLoading) {
		return (
			<div className="max-w-[85rem] px-4 py-6 sm:px-6 lg:px-8 mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
					{/* Loading Cards */}
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
						>
							<div className="p-4 md:p-5">
								<div className="flex items-center gap-x-2">
									<div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
								</div>
								<div className="mt-1 flex items-center gap-x-2">
									<div className="h-6 w-20 bg-gray-200 dark:bg-neutral-700 rounded animate-pulse"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full mx-auto">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-lg text-neutral-800 dark:text-white font-semibold">
						🎉 Productivity Overview
					</h2>
				</div>
				<div className="hidden lg:flex items-center justify-end gap-x-2">
					<h3 className="text-sm font-semibold text-gray-400 dark:text-neutral-500">
						Today
					</h3>
					<h3 className="text-sm font-medium text-gray-800 dark:text-neutral-200">
						{new Date(currentDate).toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</h3>
					<button
						onClick={refreshProductivity}
						className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
						title="Refresh productivity data"
					>
						<IoMdRefresh className="text-sm" />
					</button>
				</div>
			</div>
			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 w-full">
				{/* Planned Card */}
				<div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
					<div className="p-4 md:p-5">
						<LuAlarmClock className=" text-2xl mb-3 text-blue-600 dark:text-blue-400" />
						<div className="flex items-center gap-x-2">
							<h3 className="text-sm font-regular text-gray-400 dark:text-neutral-500">
								Planned
							</h3>
						</div>

						<div className="mt-1 flex items-center gap-x-2">
							<h3 className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400">
								{formatTotalTime(totalMinutes)}
							</h3>
						</div>
					</div>
				</div>
				{/* End Planned Card */}

				{/* Completed Card */}
				<div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
					<div className="p-4 md:p-5">
						<LuAlarmClock className=" text-2xl mb-3 text-green-600 dark:text-green-400" />
						<div className="flex items-center gap-x-2">
							<h3 className="text-sm font-regular text-gray-400 dark:text-neutral-500">
								Completed
							</h3>
						</div>

						<div className="mt-1 flex items-center gap-x-2">
							<h3 className="text-lg sm:text-xl font-semibold text-green-600 dark:text-green-400">
								{formatTotalTime(completedMinutes)}
							</h3>
						</div>
					</div>
				</div>
				{/* End Completed Card */}

				{/* Remaining Card */}
				<div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
					<div className="p-4 md:p-5">
						<LuAlarmClock className=" text-2xl mb-3 text-orange-600 dark:text-orange-400" />
						<div className="flex items-center gap-x-2">
							<h3 className="text-sm font-regular text-gray-400 dark:text-neutral-500">
								Remaining
							</h3>
						</div>

						<div className="mt-1 flex items-center gap-x-2">
							<h3
								className={`text-lg sm:text-xl font-semibold ${
									totalMinutes - completedMinutes >= 0
										? "text-orange-600 dark:text-orange-400"
										: "text-red-600 dark:text-red-400"
								}`}
							>
								{formatTotalTime(Math.max(0, totalMinutes - completedMinutes))}
							</h3>
						</div>
					</div>
				</div>
				{/* End Remaining Card */}

				{/* Weekly Streak Card */}
				<WeeklyStreak />
				{/* End Weekly Streak Card */}
			</div>
			{/* End Grid */}
		</div>
	);
};

export default Productivity;
