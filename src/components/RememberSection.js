"use client";

import {useState, useEffect, useRef} from "react";
import {supabase} from "../lib/supabaseClient";
import {
	inputStyle,
	smallButton,
	addButton,
	destructiveButton,
	secondaryButton,
	listStyle,
} from "../app/AllStyles";

const RememberSection = ({title}) => {
	const [tasks, setTasks] = useState([]);
	const [taskInput, setTaskInput] = useState("");
	const [editingTask, setEditingTask] = useState(null);
	const [editText, setEditText] = useState("");
	const [openDropdown, setOpenDropdown] = useState(null);
	const dropdownRef = useRef(null); // Reference for dropdown

	useEffect(() => {
		fetchTasks();

		// Add event listener to close dropdown if clicked outside
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setOpenDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		// Cleanup the event listener when component is unmounted
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const fetchTasks = async () => {
		const {data: sessionData, error: sessionError} =
			await supabase.auth.getSession();

		if (sessionError || !sessionData?.session) {
			console.error("No active session found", sessionError);
			return;
		}

		const userId = sessionData.session.user.id;

		const {data, error} = await supabase
			.from("remember_tasks")
			.select("*")
			.eq("user_id", userId)
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
			const {error} = await supabase
				.from("remember_tasks")
				.insert([{text: taskInput, done: false, user_id: userId}]);

			if (!error) {
				fetchTasks();
				setTaskInput("");
			}
		}
	};

	const toggleTask = async (index) => {
		const task = tasks[index];
		const {data: userData} = await supabase.auth.getUser();

		const {error} = await supabase
			.from("remember_tasks")
			.update({done: !task.done})
			.eq("id", task.id)
			.eq("user_id", userData.user.id);

		if (!error) {
			setTasks(tasks.map((t, i) => (i === index ? {...t, done: !t.done} : t)));
		}
	};

	const deleteTask = async (id) => {
		const {data: userData} = await supabase.auth.getUser();

		const {error} = await supabase
			.from("remember_tasks")
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
				.from("remember_tasks")
				.update({text: editText})
				.eq("id", editingTask);
			setOpenDropdown(null); // Close the dropdown after update
			if (!error) {
				fetchTasks();
				setEditingTask(null);
				setEditText("");
			}
		}
	};

	const toggleDropdown = (taskId) => {
		setOpenDropdown(openDropdown === taskId ? null : taskId); // Toggle dropdown for each task
	};

	return (
		<div className="p-4 mt-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-950 dark:border-neutral-900 sm:w-1/2 w-full">
			<h2 className="text-lg font-semibold mb-4">🗒️ Remember</h2>
			<div className="flex rounded-lg shadow-sm">
				<input
					type="text"
					value={taskInput}
					onChange={(e) => setTaskInput(e.target.value)}
					className={inputStyle}
					placeholder="e.g. CS101 Midterm - Tuesday at 2 PM"
				/>
				<button type="button" onClick={addTask} className={addButton}>
					Add
				</button>
			</div>
			<ul className="mt-4">
				<h2 className="text-sm font-semibold my-4 text-gray-500 dark:text-neutral-400 ">
					Things To Remember
				</h2>
				{tasks.length === 0 ? (
					<li className="text-sm text-gray-500 dark:text-neutral-400 text-center py-4">
						No things to remember yet! Add your first reminder above.
					</li>
				) : (
					tasks.map((task, index) => (
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
											className={`text-sm text-neutral-950 dark:text-white ${
												task.done ? "line-through" : ""
											}`}
										>
											{task.text}
										</span>
										<input
											type="checkbox"
											className="shrink-0 ms-auto mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
											checked={task.done}
											onChange={() => toggleTask(index)}
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
			</ul>
		</div>
	);
};

export default RememberSection;
