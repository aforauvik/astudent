"use client";
import {useState, useEffect} from "react";
import {supabase} from "../lib/supabaseClient";
import {
	inputStyle,
	smallButton,
	secondaryButton,
	destructiveButton,
	addButton,
	listStyle,
} from "../app/AllStyles";

const TaskSection = ({title}) => {
	const [tasks, setTasks] = useState([]);
	const [taskInput, setTaskInput] = useState("");
	const [editingTask, setEditingTask] = useState(null);
	const [editText, setEditText] = useState("");

	useEffect(() => {
		fetchTasks();
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
			.from("tasks")
			.select("*")
			.eq("user_id", userId);

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
				.from("tasks")
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
			.from("tasks")
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
			if (!error) {
				fetchTasks();
				setEditingTask(null);
				setEditText("");
			}
		}
	};

	return (
		<div className="p-4 mt-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-950 dark:border-neutral-900 w-1/2">
			<h2 className="text-lg font-semibold mb-4">🔥 Do</h2>
			<div className="flex rounded-lg shadow-sm">
				<input
					type="text"
					value={taskInput}
					onChange={(e) => setTaskInput(e.target.value)}
					className={inputStyle}
					placeholder="I need to do..."
				/>
				<button type="button" onClick={addTask} className={addButton}>
					Add
				</button>
			</div>
			<ul className="mt-4">
				<h2 className="text-sm font-semibold my-4 text-gray-500 dark:text-neutral-400 ">
					Today's To Do
				</h2>
				{tasks.map((task, index) => (
					<li key={task.id} className="flex items-center mt-2 space-x-2">
						{editingTask === task.id ? (
							<>
								<input
									type="text"
									value={editText}
									onChange={(e) => setEditText(e.target.value)}
									className={inputStyle}
								/>
								<button className={smallButton} onClick={updateTask}>
									Save
								</button>
								<button
									className={destructiveButton}
									onClick={() => setEditingTask(null)}
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
										onChange={() => toggleTask(index)}
									/>
								</label>
								<button
									className={secondaryButton}
									onClick={() => startEditing(task)}
								>
									Edit
								</button>
								<button
									className={destructiveButton}
									onClick={() => deleteTask(task.id)}
								>
									Delete
								</button>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default TaskSection;
