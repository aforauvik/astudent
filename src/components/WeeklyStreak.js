"use client";

import {useState, useEffect} from "react";
import {supabase} from "../lib/supabaseClient";
import {useRouter} from "next/navigation";
import {LuAlarmClock} from "react-icons/lu";
import {FaFireAlt} from "react-icons/fa";
import {AiOutlineFire} from "react-icons/ai";
import {PiFireSimpleBold} from "react-icons/pi";

const WeeklyStreak = () => {
	const [weeklyData, setWeeklyData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const days = [
		{key: "Mon", label: "M", fullName: "Monday"},
		{key: "Tue", label: "T", fullName: "Tuesday"},
		{key: "Wed", label: "W", fullName: "Wednesday"},
		{key: "Thu", label: "T", fullName: "Thursday"},
		{key: "Fri", label: "F", fullName: "Friday"},
		{key: "Sat", label: "S", fullName: "Saturday"},
		{key: "Sun", label: "S", fullName: "Sunday"},
	];

	useEffect(() => {
		fetchWeeklyData();

		// Set up real-time subscription for productivity changes
		const productivitySubscription = supabase
			.channel("weekly-streak-productivity")
			.on(
				"postgres_changes",
				{event: "*", schema: "public", table: "productivity"},
				() => {
					fetchWeeklyData(); // Refresh when productivity changes
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(productivitySubscription);
		};
	}, []);

	const fetchWeeklyData = async () => {
		setIsLoading(true);
		const {data: sessionData, error: sessionError} =
			await supabase.auth.getSession();

		if (sessionError || !sessionData?.session) {
			await supabase.auth.signOut();
			router.push("/");
			return;
		}

		const userId = sessionData.session.user.id;
		const weeklyStats = {};

		// Get the current week's dates using local time
		const today = new Date();
		const localToday = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const startOfWeek = new Date(localToday);
		startOfWeek.setDate(localToday.getDate() - localToday.getDay() + 1); // Monday

		// Fetch productivity data for the current week
		const {data: productivityData, error: productivityError} = await supabase
			.from("productivity")
			.select("*")
			.eq("user_id", userId)
			.gte("date", startOfWeek.toISOString().split("T")[0])
			.lte("date", localToday.toISOString().split("T")[0]);

		console.log("Productivity Debug:", {
			productivityData,
			error: productivityError,
			today: localToday.toISOString().split("T")[0],
			startOfWeek: startOfWeek.toISOString().split("T")[0],
		});

		// Debug: Log the first record structure to see what fields exist
		if (productivityData && productivityData.length > 0) {
			console.log("First record structure:", productivityData[0]);
		}

		// Debug: Log the processed weekly stats
		console.log("Weekly Stats:", weeklyStats);

		if (productivityError) {
			console.error("Error fetching productivity data:", productivityError);
			setIsLoading(false);
			return;
		}

		if (productivityData) {
			// Process each day of the week
			days.forEach((day) => {
				// Find the date for this day of the week
				const dayDate = new Date(startOfWeek);
				const dayIndex = days.findIndex((d) => d.key === day.key);
				dayDate.setDate(startOfWeek.getDate() + dayIndex);

				// Find productivity data for this specific date
				const dayProductivity = productivityData.find((productivity) => {
					const productivityDate = new Date(productivity.date);
					const productivityLocalDate = new Date(
						productivityDate.getFullYear(),
						productivityDate.getMonth(),
						productivityDate.getDate()
					);
					const dayLocalDate = new Date(
						dayDate.getFullYear(),
						dayDate.getMonth(),
						dayDate.getDate()
					);
					return productivityLocalDate.getTime() === dayLocalDate.getTime();
				});

				if (dayProductivity) {
					// Determine status based on completed minutes if status is not set
					let status = dayProductivity.status;
					if (!status && dayProductivity.completed_minutes > 0) {
						status = "success";
					} else if (!status) {
						status = "no_plan";
					}

					weeklyStats[day.key] = {
						planned: dayProductivity.planned_minutes || 0,
						completed: dayProductivity.completed_minutes || 0,
						success: status === "success",
						failed: status === "failed",
						noPlan: status === "no_plan",
					};
				} else {
					// No data for this day, show as no plan
					weeklyStats[day.key] = {
						planned: 0,
						completed: 0,
						success: false,
						failed: false,
						noPlan: true,
					};
				}
			});

			setWeeklyData(weeklyStats);
		} else {
			// No data found, set empty stats
			days.forEach((day) => {
				weeklyStats[day.key] = {
					planned: 0,
					completed: 0,
					success: false,
					failed: false,
					noPlan: true,
				};
			});
			setWeeklyData(weeklyStats);
		}
		setIsLoading(false);
	};

	const getDayStatus = (dayKey) => {
		const dayData = weeklyData[dayKey];
		if (!dayData)
			return "bg-gray-100 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500";

		// Get current day of week (0 = Sunday, 1 = Monday, etc.)
		const today = new Date();
		const currentDayIndex = today.getDay();

		// Convert to our days array index (Monday = 0, Tuesday = 1, etc.)
		const currentDayIndexInArray =
			currentDayIndex === 0 ? 6 : currentDayIndex - 1;
		const currentDayKey = days[currentDayIndexInArray].key;

		// Find the index of the day we're checking
		const dayIndex = days.findIndex((day) => day.key === dayKey);

		// Debug: Log the status calculation
		console.log(`Day ${dayKey}:`, {
			dayData,
			currentDayIndex,
			currentDayIndexInArray,
			currentDayKey,
			dayIndex,
			isFuture: dayIndex > currentDayIndexInArray,
			status: dayData?.status,
			success: dayData?.success,
			failed: dayData?.failed,
			noPlan: dayData?.noPlan,
		});

		// If this day is in the future, show gray
		if (dayIndex > currentDayIndexInArray) {
			return "bg-gray-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-500";
		}

		// Use database status directly
		if (dayData.noPlan) {
			return "bg-gray-100 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500";
		}

		if (dayData.success) {
			return "bg-emerald-500 text-white";
		}

		if (dayData.failed) {
			return "bg-red-500 text-white";
		}

		return "bg-gray-100 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500";
	};

	if (isLoading) {
		return (
			<div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
				<div className="p-4 md:p-5">
					<div className="flex items-center gap-x-2">
						<h3 className="text-sm font-semibold text-gray-400 dark:text-neutral-500">
							Weekly Streak
						</h3>
					</div>
					<div className="mt-3 flex gap-2">
						{[1, 2, 3, 4, 5, 6, 7].map((i) => (
							<div
								key={i}
								className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-neutral-700 animate-pulse"
							></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div className="p-4 md:p-5">
				<PiFireSimpleBold className=" text-2xl mb-3 text-red-500 dark:text-red-500" />
				<div className="flex items-center gap-x-2">
					<h3 className="text-sm font-regular text-gray-400 dark:text-neutral-500">
						Weekly Streak
					</h3>
				</div>
				<div className="mt-2 flex gap-2">
					{days.map((day) => (
						<div
							key={day.key}
							className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${getDayStatus(
								day.key
							)}`}
							title={`${day.fullName}: ${
								weeklyData[day.key]?.planned
									? Math.round((weeklyData[day.key].planned / 60) * 10) / 10 +
									  "h planned"
									: "No tasks"
							} - ${
								weeklyData[day.key]?.completed
									? Math.round((weeklyData[day.key].completed / 60) * 10) / 10 +
									  "h completed"
									: "0h completed"
							}`}
						>
							{day.label}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WeeklyStreak;
