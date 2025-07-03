"use client";
import {useState, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "../lib/supabaseClient";
import TimerModal from "./TimerModal";
import {
	inputStyle,
	smallButton,
	secondaryButton,
	destructiveButton,
	addButton,
	listStyle,
} from "../app/AllStyles";

import {LuAlarmClock} from "react-icons/lu";

const TaskSection = ({title}) => {
	const [tasks, setTasks] = useState([]);
	const [taskInput, setTaskInput] = useState("");
	const [editingTask, setEditingTask] = useState(null);
	const [editText, setEditText] = useState("");
	const [openDropdown, setOpenDropdown] = useState(null);
	const [activeDay, setActiveDay] = useState("Daily");
	const [showTimerModal, setShowTimerModal] = useState(false);
	const dropdownRef = useRef(null);
	const router = useRouter();

	const days = [
		{value: "Daily", label: "Daily", mobileLabel: "D"},
		{value: "Mon", label: "Monday", mobileLabel: "M"},
		{value: "Tue", label: "Tuesday", mobileLabel: "T"},
		{value: "Wed", label: "Wednesday", mobileLabel: "W"},
		{value: "Thu", label: "Thursday", mobileLabel: "T"},
		{value: "Fri", label: "Friday", mobileLabel: "F"},
		{value: "Sat", label: "Saturday", mobileLabel: "S"},
		{value: "Sun", label: "Sunday", mobileLabel: "S"},
	];

	useEffect(() => {
		fetchTasks();

		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const fetchTasks = async () => {
		const {data: sessionData, error: sessionError} =
			await supabase.auth.getSession();

		if (sessionError || !sessionData?.session) {
			await supabase.auth.signOut();
			router.push("/");
			return;
		}

		const userId = sessionData.session.user.id;

		const {data, error} = await supabase
			.from("tasks")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", {ascending: true});

		if (!error) {
			setTasks(data || []);
		}
	};

	const addTask = async () => {
		const {data: userData, error: userError} = await supabase.auth.getUser();

		if (userError || !userData?.user) {
			console.error("User not authenticated", userError);
			return;
		}

		const userId = userData.user.id;

		if (taskInput.trim()) {
			const {error} = await supabase.from("tasks").insert([
				{
					text: taskInput,
					done: false,
					user_id: userId,
					day_of_week: activeDay,
				},
			]);

			if (!error) {
				fetchTasks();
				setTaskInput("");
			} else {
				console.error("Error adding task:", error);
			}
		}
	};

	const toggleTask = async (taskId) => {
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;

		const {error} = await supabase
			.from("tasks")
			.update({done: !task.done})
			.eq("id", taskId);

		if (!error) {
			setTasks(tasks.map((t) => (t.id === taskId ? {...t, done: !t.done} : t)));
		}
	};

	const deleteTask = async (id) => {
		const {data: userData} = await supabase.auth.getUser();

		const {error} = await supabase
			.from("tasks")
			.delete()
			.eq("id", id)
			.eq("user_id", userData.user.id);

		if (!error) {
			setTasks(tasks.filter((task) => task.id !== id));
		}
	};

	const startEditing = (task) => {
		setEditingTask(task.id);
		setEditText(task.text);
	};

	const updateTask = async () => {
		if (editText.trim()) {
			const {error} = await supabase
				.from("tasks")
				.update({text: editText})
				.eq("id", editingTask);
			setOpenDropdown(null);

			if (!error) {
				fetchTasks();
				setEditingTask(null);
				setEditText("");
			}
		}
	};

	const toggleDropdown = (taskId) => {
		setOpenDropdown(openDropdown === taskId ? null : taskId);
	};

	// Filter tasks for the active day
	const filteredTasks = tasks.filter((task) => task.day_of_week === activeDay);

	// Get today's day string (e.g., 'Tue')
	const jsDayToString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const fullDayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const today = new Date();
	const todayDayString = jsDayToString[today.getDay()];
	const todayFullDayName = fullDayNames[today.getDay()];

	// Filter tasks for today (e.g., 'Tue'), but not 'Daily'
	const todayTasks = tasks.filter(
		(task) => task.day_of_week === todayDayString && activeDay === "Daily"
	);

	return (
		<div className="p-4 mt-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-950 dark:border-neutral-900 sm:w-1/2 w-full">
			<div className="flex flex-row justify-between items-start">
				<h2 className="text-lg font-semibold mb-4">🔥 Do</h2>
				<button
					onClick={() => setShowTimerModal(true)}
					className="px-1 py-1 rounded-md border border-emerald-500/25 bg-emerald-500/25 text-emerald-500 font-semibold hover:bg-emerald-700 transition"
				>
					<LuAlarmClock className="text-lg" />
				</button>
			</div>

			<div className="flex flex-col space-y-3">
				<div className="flex rounded-lg shadow-sm mb-4">
					<input
						type="text"
						value={taskInput}
						onChange={(e) => setTaskInput(e.target.value)}
						className={inputStyle}
						placeholder={`e.g. 12 PM - 1 PM - Practice Math (${activeDay})`}
					/>
					<button type="button" onClick={addTask} className={addButton}>
						Add
					</button>
				</div>
				<div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-lg">
					{days.map((day) => (
						<button
							key={day.value}
							onClick={() => setActiveDay(day.value)}
							className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
								activeDay === day.value
									? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm"
									: "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
							}`}
						>
							<span className="sm:hidden">{day.mobileLabel}</span>
							<span className="hidden sm:inline">{day.value}</span>
						</button>
					))}
				</div>
			</div>

			<ul className="mt-4">
				<h2 className="text-sm font-semibold my-4 text-gray-500 dark:text-neutral-400">
					{activeDay === "Daily"
						? "Daily"
						: days.find((day) => day.value === activeDay)?.label}
				</h2>
				{filteredTasks.length === 0 ? (
					<li className="text-sm text-gray-500 dark:text-neutral-400 text-center py-4">
						No tasks yet. Add a task above!
					</li>
				) : (
					filteredTasks.map((task) => (
						<li key={task.id} className="flex items-center mt-2 space-x-2">
							{editingTask === task.id ? (
								<>
									<input
										type="text"
										value={editText}
										onChange={(e) => setEditText(e.target.value)}
										className={inputStyle}
									/>
									<button className={secondaryButton} onClick={updateTask}>
										Save
									</button>
									<button
										className={destructiveButton}
										onClick={() => {
											setEditingTask(null);
											setOpenDropdown(null);
										}}
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<label className={listStyle}>
										<span
											className={`text-sm text-gray-950 dark:text-white ${
												task.done ? "line-through" : ""
											}`}
										>
											{task.text}
										</span>
										<input
											type="checkbox"
											className="shrink-0 ms-auto mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											checked={task.done}
											onChange={() => toggleTask(task.id)}
										/>
									</label>
									<div
										className="relative inline-flex"
										ref={openDropdown === task.id ? dropdownRef : null}
									>
										<button
											onClick={() => toggleDropdown(task.id)}
											className="flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-950 dark:border-neutral-950 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
										>
											<svg
												className="flex-none size-4 text-gray-600 dark:text-neutral-500"
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<circle cx="12" cy="12" r="1" />
												<circle cx="12" cy="5" r="1" />
												<circle cx="12" cy="19" r="1" />
											</svg>
										</button>
										{openDropdown === task.id && (
											<div className="p-1 space-y-0.5 absolute z-50 right-10 mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700">
												<button
													className="flex items-center gap-x-3.5 w-full py-2 px-3 rounded-lg text-sm text-blue-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-blue-600 dark:hover:bg-blue-800/30 dark:hover:text-blue-600 dark:focus:bg-blue-800/30"
													onClick={() => startEditing(task)}
												>
													Edit
												</button>
												<button
													className="flex items-center gap-x-3.5 w-full py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-red-500 dark:hover:bg-red-800/30 dark:hover:text-red-500 dark:focus:bg-red-800/30"
													onClick={() => deleteTask(task.id)}
												>
													Delete
												</button>
											</div>
										)}
									</div>
								</>
							)}
						</li>
					))
				)}

				{/* Show today's tasks under Daily, if any and if activeDay is Daily */}
				{activeDay === "Daily" && todayTasks.length > 0 && (
					<>
						<h3 className="text-sm font-semibold mt-6 mb-4 text-gray-400 dark:text-neutral-400">
							{todayFullDayName} Only
						</h3>
						{todayTasks.map((task) => (
							<li key={task.id} className="flex items-center mt-2 space-x-2">
								{editingTask === task.id ? (
									<>
										<input
											type="text"
											value={editText}
											onChange={(e) => setEditText(e.target.value)}
											className={inputStyle}
										/>
										<button className={secondaryButton} onClick={updateTask}>
											Save
										</button>
										<button
											className={destructiveButton}
											onClick={() => {
												setEditingTask(null);
												setOpenDropdown(null);
											}}
										>
											Cancel
										</button>
									</>
								) : (
									<>
										<label className={listStyle}>
											<span
												className={`text-sm text-gray-950 dark:text-white ${
													task.done ? "line-through" : ""
												}`}
											>
												{task.text}
											</span>
											<input
												type="checkbox"
												className="shrink-0 ms-auto mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
												checked={task.done}
												onChange={() => toggleTask(task.id)}
											/>
										</label>
										<div
											className="relative inline-flex"
											ref={openDropdown === task.id ? dropdownRef : null}
										>
											<button
												onClick={() => toggleDropdown(task.id)}
												className="flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-950 dark:border-neutral-950 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
											>
												<svg
													className="flex-none size-4 text-gray-600 dark:text-neutral-500"
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<circle cx="12" cy="12" r="1" />
													<circle cx="12" cy="5" r="1" />
													<circle cx="12" cy="19" r="1" />
												</svg>
											</button>
											{openDropdown === task.id && (
												<div className="p-1 space-y-0.5 absolute z-50 right-10 mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700">
													<button
														className="flex items-center gap-x-3.5 w-full py-2 px-3 rounded-lg text-sm text-blue-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-blue-600 dark:hover:bg-blue-800/30 dark:hover:text-blue-600 dark:focus:bg-blue-800/30"
														onClick={() => startEditing(task)}
													>
														Edit
													</button>
													<button
														className="flex items-center gap-x-3.5 w-full py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-red-500 dark:hover:bg-red-800/30 dark:hover:text-red-500 dark:focus:bg-red-800/30"
														onClick={() => deleteTask(task.id)}
													>
														Delete
													</button>
												</div>
											)}
										</div>
									</>
								)}
							</li>
						))}
					</>
				)}
			</ul>
			<TimerModal
				isOpen={showTimerModal}
				onClose={() => setShowTimerModal(false)}
			/>
		</div>
	);
};

export default TaskSection;
