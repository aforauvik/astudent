"use client";

import {useState, useEffect} from "react";
import {supabase} from "../lib/supabaseClient";
import {useRouter} from "next/navigation";
import {LuAlarmClock} from "react-icons/lu";
import {FaFireAlt} from "react-icons/fa";
import {AiOutlineFire} from "react-icons/ai";
import {PiFireSimple} from "react-icons/pi";

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

		// Get the current week's dates
		const today = new Date();
		// Adjust for timezone - use local date
		const localToday = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate()
		);
		const startOfWeek = new Date(localToday);
		startOfWeek.setDate(localToday.getDate() - localToday.getDay() + 1); // Monday

		// Fetch tasks for the current week
		const {data: tasksData, error: tasksError} = await supabase
			.from("tasks")
			.select("*")
			.eq("user_id", userId)
			.order("sort_order", {ascending: true});

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
			originalToday: today.toISOString().split("T")[0],
			queryRange: `${startOfWeek.toISOString().split("T")[0]} to ${
				localToday.toISOString().split("T")[0]
			}`,
		});

		if (!tasksError && tasksData && !productivityError) {
			// Calculate planned and completed hours for each day
			days.forEach((day) => {
				const dayTasks = tasksData.filter(
					(task) => task.day_of_week === "Daily" || task.day_of_week === day.key
				);

				const plannedMinutes = dayTasks.reduce((total, task) => {
					if (task.duration) {
						return total + task.duration;
					}
					return total;
				}, 0);

				// Find productivity data for this day
				const dayProductivity = productivityData?.find((p) => {
					const taskDate = new Date(p.date);
					const today = new Date();
					const localToday = new Date(
						today.getFullYear(),
						today.getMonth(),
						today.getDate()
					);

					// For today, check multiple date formats
					if (
						day.key ===
						days[localToday.getDay() === 0 ? 6 : localToday.getDay() - 1].key
					) {
						const todayDateString = localToday.toDateString();
						const taskDateString = taskDate.toDateString();
						const todayISO = localToday.toISOString().split("T")[0];
						const taskISO = taskDate.toISOString().split("T")[0];

						return todayDateString === taskDateString || todayISO === taskISO;
					}

					// For other days, use the day of week logic
					const taskDayOfWeek = taskDate.getDay();
					const dayIndex = taskDayOfWeek === 0 ? 6 : taskDayOfWeek - 1;
					return days[dayIndex].key === day.key;
				});

				const completedMinutes = dayProductivity?.completed_minutes || 0;

				// Debug for today
				if (
					day.key ===
					days[localToday.getDay() === 0 ? 6 : localToday.getDay() - 1].key
				) {
					console.log("Today's Data:", {
						day: day.key,
						dayProductivity,
						completedMinutes,
						allProductivityData: productivityData,
					});
				}

				weeklyStats[day.key] = {
					planned: plannedMinutes,
					completed: completedMinutes,
					success: completedMinutes >= plannedMinutes && plannedMinutes > 0,
					failed: completedMinutes < plannedMinutes && plannedMinutes > 0,
					noPlan: plannedMinutes === 0,
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
		const currentDayKey =
			days[currentDayIndex === 0 ? 6 : currentDayIndex - 1].key;

		// Find the index of the day we're checking
		const dayIndex = days.findIndex((day) => day.key === dayKey);
		const currentDayIndexInArray = days.findIndex(
			(day) => day.key === currentDayKey
		);

		// If this day is in the future, show gray
		if (dayIndex > currentDayIndexInArray) {
			return "bg-gray-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-500";
		}

		// If this day has no planned tasks, show gray
		if (dayData.noPlan) {
			return "bg-gray-100 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500";
		}

		// For current day, evaluate if goals are met
		if (dayKey === currentDayKey) {
			// Check if it's after midnight (new day has started)
			const now = new Date();
			const startOfDay = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate()
			);
			const isAfterMidnight =
				now.getTime() > startOfDay.getTime() + 24 * 60 * 60 * 1000;

			if (dayData.success) {
				return "bg-emerald-500 text-white";
			} else if (dayData.failed && isAfterMidnight) {
				// Only show red if it's after midnight and goals weren't met
				return "bg-red-500 text-white";
			} else {
				// During the day, show orange if still working, green if goals met
				return dayData.success
					? "bg-emerald-500 text-white"
					: "bg-orange-300 dark:bg-orange-400 text-white dark:text-white";
			}
		}

		// For past days, show success/failure
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
				<PiFireSimple className=" text-2xl mb-3 text-orange-400 dark:text-orange-400" />
				<div className="flex items-center gap-x-2">
					<h3 className="text-sm font-regular text-gray-400 dark:text-neutral-500">
						Weekly Streak
					</h3>
				</div>
				<div className="mt-2 flex justify-between gap-2">
					{days.map((day) => (
						<div
							key={day.key}
							className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${getDayStatus(
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
