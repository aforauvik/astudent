"use client";
import {useState, useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "../lib/supabaseClient";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

import {
	inputStyle,
	smallButton,
	secondaryButton,
	destructiveButton,
	addButton,
	listStyle,
} from "../app/AllStyles";

import {LuAlarmClock} from "react-icons/lu";
import {TiMediaPause} from "react-icons/ti";
import {TiMediaPlay} from "react-icons/ti";
import {TiMediaStop} from "react-icons/ti";
import {IoIosCloseCircle} from "react-icons/io";
import {IoPlayCircle} from "react-icons/io5";
import {LuGripVertical} from "react-icons/lu";
import LoadingState from "./Loading";
import EmptyState from "./EmptyState";

// Sortable Task Item Component
const SortableTaskItem = ({
	task,
	editingTask,
	editText,
	setEditText,
	updateTask,
	setEditingTask,
	setOpenDropdown,
	toggleTask,
	toggleDropdown,
	openDropdown,
	dropdownRef,
	inputStyle,
	secondaryButton,
	destructiveButton,
	listStyle,
	startEditing,
	deleteTask,
}) => {
	const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
		useSortable({id: task.id});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<li
			ref={setNodeRef}
			style={style}
			className="flex items-center mt-2 space-x-2"
		>
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
					<button
						{...attributes}
						{...listeners}
						className="p-1 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 cursor-grab active:cursor-grabbing"
						title="Drag to reorder"
					>
						<LuGripVertical size={16} />
					</button>
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
							className="flex justify-center items-center size-9 text-sm font-semibold rounded-lg bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-950 dark:border-neutral-950 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
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
	);
};

const TaskSection = ({title}) => {
	const [tasks, setTasks] = useState([]);
	const [taskInput, setTaskInput] = useState("");
	const [editingTask, setEditingTask] = useState(null);
	const [editText, setEditText] = useState("");
	const [openDropdown, setOpenDropdown] = useState(null);
	const [activeDay, setActiveDay] = useState("Daily");
	const [isLoading, setIsLoading] = useState(true);

	// Timer state
	const [timerDuration, setTimerDuration] = useState(null);
	const [timerStart, setTimerStart] = useState(null);
	const [timerInterval, setTimerInterval] = useState(null);
	const [timerNow, setTimerNow] = useState(Date.now());
	const [showTimerOptions, setShowTimerOptions] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [pausedTime, setPausedTime] = useState(0);
	const [pauseStartTime, setPauseStartTime] = useState(null);

	const dropdownRef = useRef(null);
	const audioRef = useRef(null);
	const router = useRouter();

	// DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

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

	// Timer options
	const timerOptions = [
		{label: "5m", value: 5 * 60},
		{label: "15m", value: 15 * 60},
		{label: "25m ⭐️", value: 25 * 60},
		{label: "30m", value: 30 * 60},
		{label: "1h", value: 60 * 60},
		// {label: "1.5h", value: 90 * 60},
		// {label: "2h", value: 120 * 60},
	];

	// Timer effect
	useEffect(() => {
		if (timerStart && timerDuration && !isPaused) {
			const interval = setInterval(() => {
				setTimerNow(Date.now());
			}, 1000);
			setTimerInterval(interval);
			return () => clearInterval(interval);
		} else if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}
	}, [timerStart, timerDuration, isPaused]);

	// Calculate time passed and left
	let timePassed = 0;
	let timeLeft = 0;
	if (timerStart && timerDuration) {
		const currentPausedTime =
			isPaused && pauseStartTime
				? pausedTime + Math.floor((Date.now() - pauseStartTime) / 1000)
				: pausedTime;
		timePassed = Math.floor((timerNow - timerStart) / 1000) - currentPausedTime;
		timeLeft = Math.max(timerDuration - timePassed, 0);
	}

	// Play sound when timer is up
	useEffect(() => {
		if (timeLeft === 0 && timerStart && audioRef.current) {
			audioRef.current.play();
		}
	}, [timeLeft, timerStart]);

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
		setIsLoading(true);
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
			.order("sort_order", {ascending: true})
			.order("created_at", {ascending: true});

		if (!error) {
			setTasks(data || []);
		}
		setIsLoading(false);
	};

	// New: syncTasks (no spinner)
	const syncTasks = async () => {
		const {data: sessionData, error: sessionError} =
			await supabase.auth.getSession();
		if (sessionError || !sessionData?.session) return;
		const userId = sessionData.session.user.id;
		const {data, error} = await supabase
			.from("tasks")
			.select("*")
			.eq("user_id", userId)
			.order("sort_order", {ascending: true})
			.order("created_at", {ascending: true});
		if (!error) setTasks(data || []);
	};

	const addTask = async () => {
		const {data: userData, error: userError} = await supabase.auth.getUser();

		if (userError || !userData?.user) {
			console.error("User not authenticated", userError);
			return;
		}

		const userId = userData.user.id;

		if (taskInput.trim()) {
			const maxSortOrder =
				tasks.length > 0 ? Math.max(...tasks.map((t) => t.sort_order || 0)) : 0;
			const newSortOrder = maxSortOrder + 1;

			const {data, error} = await supabase
				.from("tasks")
				.insert([
					{
						text: taskInput,
						done: false,
						user_id: userId,
						day_of_week: activeDay,
						sort_order: newSortOrder,
					},
				])
				.select();

			if (!error && data && data.length > 0) {
				// Optimistically update local state
				setTasks([...tasks, data[0]]);
				setTaskInput("");
				// Optionally sync in background
				syncTasks();
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
			// Optimistically update local state
			setTasks(tasks.map((t) => (t.id === taskId ? {...t, done: !t.done} : t)));
			// Optionally sync in background
			syncTasks();
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
			// Optimistically update local state
			setTasks(tasks.filter((task) => task.id !== id));
			// Optionally sync in background
			syncTasks();
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
				// Optimistically update local state
				setTasks(
					tasks.map((t) => (t.id === editingTask ? {...t, text: editText} : t))
				);
				setEditingTask(null);
				setEditText("");
				// Optionally sync in background
				syncTasks();
			}
		}
	};

	const toggleDropdown = (taskId) => {
		setOpenDropdown(openDropdown === taskId ? null : taskId);
	};

	// Handle drag end
	const handleDragEnd = async (event) => {
		const {active, over} = event;

		if (active.id !== over.id) {
			const oldIndex = tasks.findIndex((item) => item.id === active.id);
			const newIndex = tasks.findIndex((item) => item.id === over.id);

			// Optimistically update local state
			const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
			setTasks(reorderedTasks);

			// Update sort_order for all affected items
			const updates = reorderedTasks.map((task, index) => ({
				id: task.id,
				sort_order: index + 1,
			}));

			// Batch update all items with new sort_order values
			for (const update of updates) {
				await supabase
					.from("tasks")
					.update({sort_order: update.sort_order})
					.eq("id", update.id);
			}
			// Optionally sync in background
			syncTasks();
		}
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

	const startTimer = (duration) => {
		setTimerDuration(duration);
		setTimerStart(Date.now());
		setTimerNow(Date.now());
		setShowTimerOptions(false);
		setIsPaused(false);
		setPausedTime(0);
		setPauseStartTime(null);
	};

	const resetTimer = () => {
		setTimerDuration(null);
		setTimerStart(null);
		setTimerNow(Date.now());
		setShowTimerOptions(false);
		setIsPaused(false);
		setPausedTime(0);
		setPauseStartTime(null);
	};

	const pauseTimer = () => {
		if (timerStart && timerDuration && !isPaused) {
			setIsPaused(true);
			setPauseStartTime(Date.now());
		}
	};

	const resumeTimer = () => {
		if (timerStart && timerDuration && isPaused) {
			setIsPaused(false);
			// Add the time that was paused to the total paused time
			const pauseDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
			setPausedTime(pausedTime + pauseDuration);
			setPauseStartTime(null);
			setTimerNow(Date.now()); // Update timer now to current time
		}
	};

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	return (
		<div className="p-4 mt-2 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-950 dark:border-neutral-900 md:w-full sm:w-1/2 w-full">
			<div className="flex flex-row justify-between items-start">
				<h2 className="text-lg text-neutral-800 dark:text-white font-semibold mb-4">
					🔥 Do
				</h2>

				<div className="flex items-center gap-2">
					{/* Timer display */}
					{timerStart && timerDuration && (
						<div className="flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
							{/* <button
								onClick={isPaused ? resumeTimer : pauseTimer}
								className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
								title={isPaused ? "Resume" : "Pause"}
							>
								{isPaused ? <TiMediaPlay /> : <TiMediaPause />}
							</button> */}
							<span className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
								{formatTime(timeLeft)}
							</span>

							<button
								onClick={resetTimer}
								className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
								title="Stop"
							>
								<IoIosCloseCircle />
							</button>
						</div>
					)}

					{/* Timer button */}
					<div className="relative flex justify-center items-center gap-1">
						<button
							onClick={() => setShowTimerOptions(!showTimerOptions)}
							className="px-2 py-1 w-full justify-center items-center flex gap-1 rounded-md border border-emerald-500/25 bg-emerald-400/30 dark:bg-emerald-900/30 text-emerald-500  font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
						>
							<span className="text-xs  text-emerald-500">Pomodoro Timer</span>{" "}
							<LuAlarmClock className="text-lg" />
						</button>

						{/* Timer options dropdown */}
						{showTimerOptions && (
							<div className="absolute right-0 top-full mt-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-10 min-w-[120px]">
								{timerOptions.map((opt) => (
									<button
										key={opt.value}
										onClick={() => startTimer(opt.value)}
										className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg"
									>
										{opt.label}
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col">
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
				<div className="flex bg-gray-100 dark:bg-neutral-900 p-1 rounded-lg">
					{days.map((day) => (
						<button
							key={day.value}
							onClick={() => setActiveDay(day.value)}
							className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
								activeDay === day.value
									? "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm"
									: "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
							}`}
						>
							<span className="sm:hidden">{day.mobileLabel}</span>
							<span className="hidden sm:inline">{day.value}</span>
						</button>
					))}
				</div>
			</div>

			<div className="mt-4">
				<h2 className="text-sm font-semibold my-4 text-gray-500 dark:text-neutral-400">
					{activeDay === "Daily"
						? "Daily"
						: days.find((day) => day.value === activeDay)?.label}
				</h2>
				{isLoading ? (
					<LoadingState />
				) : filteredTasks.length === 0 ? (
					<EmptyState
						imageState="taskEmptyImage"
						description="emptyTaskMessage"
					/>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={filteredTasks.map((task) => task.id)}
							strategy={verticalListSortingStrategy}
						>
							<ul>
								{filteredTasks.map((task) => (
									<SortableTaskItem
										key={task.id}
										task={task}
										editingTask={editingTask}
										editText={editText}
										setEditText={setEditText}
										updateTask={updateTask}
										setEditingTask={setEditingTask}
										setOpenDropdown={setOpenDropdown}
										toggleTask={toggleTask}
										toggleDropdown={toggleDropdown}
										openDropdown={openDropdown}
										dropdownRef={dropdownRef}
										inputStyle={inputStyle}
										secondaryButton={secondaryButton}
										destructiveButton={destructiveButton}
										listStyle={listStyle}
										startEditing={startEditing}
										deleteTask={deleteTask}
									/>
								))}
							</ul>
						</SortableContext>
					</DndContext>
				)}

				{/* Show today's tasks under Daily, if any and if activeDay is Daily */}
				{activeDay === "Daily" && todayTasks.length > 0 && !isLoading && (
					<>
						<h3 className="text-sm font-semibold mt-6 mb-4 text-gray-400 dark:text-neutral-400">
							{todayFullDayName} Only
						</h3>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={todayTasks.map((task) => task.id)}
								strategy={verticalListSortingStrategy}
							>
								<ul>
									{todayTasks.map((task) => (
										<SortableTaskItem
											key={task.id}
											task={task}
											editingTask={editingTask}
											editText={editText}
											setEditText={setEditText}
											updateTask={updateTask}
											setEditingTask={setEditingTask}
											setOpenDropdown={setOpenDropdown}
											toggleTask={toggleTask}
											toggleDropdown={toggleDropdown}
											openDropdown={openDropdown}
											dropdownRef={dropdownRef}
											inputStyle={inputStyle}
											secondaryButton={secondaryButton}
											destructiveButton={destructiveButton}
											listStyle={listStyle}
											startEditing={startEditing}
											deleteTask={deleteTask}
										/>
									))}
								</ul>
							</SortableContext>
						</DndContext>
					</>
				)}
			</div>
			<audio ref={audioRef} src="/time-up.mp3" preload="auto" />
		</div>
	);
};

export default TaskSection;
