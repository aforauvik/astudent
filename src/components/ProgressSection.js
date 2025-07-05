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

const ProgressSection = () => {
	const [subjects, setSubjects] = useState([]);
	const [subjectInput, setSubjectInput] = useState("");
	const [editingSubject, setEditingSubject] = useState(null);
	const [editText, setEditText] = useState("");
	const [openDropdown, setOpenDropdown] = useState(null);
	const dropdownRef = useRef(null); // Reference for dropdown

	useEffect(() => {
		fetchSubjects();
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

	const fetchSubjects = async () => {
		const {data: sessionData, error: sessionError} =
			await supabase.auth.getSession();

		if (sessionError || !sessionData?.session) {
			console.error("No active session found", sessionError);
			return;
		}

		const userId = sessionData.session.user.id;

		const {data, error} = await supabase
			.from("progress")
			.select("*")
			.eq("user_id", userId)
			.order("created_at", {ascending: true});
		if (!error) setSubjects(data || []);
	};

	const addSubject = async () => {
		const {data: userData, error: userError} = await supabase.auth.getUser();

		if (userError || !userData?.user) {
			console.error("User not authenticated", userError);
			return;
		}

		const userId = userData.user.id;

		if (subjectInput.trim()) {
			const {error} = await supabase
				.from("progress")
				.insert([{name: subjectInput, progress: 0, user_id: userId}]);
			if (!error) {
				fetchSubjects();
				setSubjectInput("");
			}
		}
	};

	const updateProgress = async (id, progress) => {
		const {error} = await supabase
			.from("progress")
			.update({progress})
			.eq("id", id);
		if (!error) {
			fetchSubjects();
		}
	};

	const deleteSubject = async (id) => {
		const {data: userData} = await supabase.auth.getUser();

		const {error} = await supabase
			.from("progress")
			.delete()
			.eq("id", id)
			.eq("user_id", userData.user.id);
		if (!error) {
			fetchSubjects();
		}
	};

	const startEditing = (subject) => {
		setEditingSubject(subject.id);
		setEditText(subject.name);
	};

	const updateSubject = async () => {
		if (editText.trim()) {
			const {error} = await supabase
				.from("progress")
				.update({name: editText})
				.eq("id", editingSubject);
			setOpenDropdown(null); // Close the dropdown after update
			if (!error) {
				fetchSubjects();
				setEditingSubject(null);
				setEditText("");
			}
		}
	};

	const toggleDropdown = (taskId) => {
		setOpenDropdown(openDropdown === taskId ? null : taskId); // Toggle dropdown for each task
	};

	return (
		<div className="p-4 mt-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-950 dark:border-neutral-900 sm:w-1/2 w-full">
			<h2 className="text-lg font-semibold mb-4">🎉 Track</h2>
			<div className="flex rounded-lg shadow-sm">
				<input
					type="text"
					value={subjectInput}
					onChange={(e) => setSubjectInput(e.target.value)}
					className={inputStyle}
					placeholder="e.g. CS50 - C Assignment"
				/>
				<button type="button" onClick={addSubject} className={addButton}>
					Add
				</button>
			</div>
			<div className="mt-4">
				<h2 className="text-sm font-semibold my-4 text-gray-500 dark:text-neutral-400 ">
					Projects, Topics, Assignments
				</h2>

				{subjects.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 dark:text-neutral-500">
						<p className="text-sm text-gray-500 dark:text-neutral-400 text-center py-4">
							No progress tracked yet! Add your first project or assignment
							above.
						</p>
					</div>
				) : (
					subjects.map((subject) => (
						<div key={subject.id} className="flex items-start mt-2 space-x-2">
							{editingSubject === subject.id ? (
								<>
									<input
										type="text"
										value={editText}
										className={inputStyle}
										onChange={(e) => setEditText(e.target.value)}
									/>
									<button className={secondaryButton} onClick={updateSubject}>
										Save
									</button>
									<button
										className={destructiveButton}
										onClick={() => {
											setEditingSubject(null);
											setOpenDropdown(null);
										}}
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<div className="flex-1">
										<p className={listStyle}>{subject.name}</p>
										<div className="max-w-full flex items-center gap-x-1 mt-2">
											{/* Progress bar segments - 10 bars with 10% each */}
											{Array.from({length: 10}, (_, index) => {
												const segmentValue = (index + 1) * 10;
												const isFilled = subject.progress >= segmentValue;
												const isCompleted = subject.progress === 100;

												// Determine color based on progress
												let colorClass = "bg-gray-300 dark:bg-neutral-600"; // Default for unfilled
												if (isFilled) {
													if (isCompleted) {
														colorClass = "bg-green-600 dark:bg-green-600"; // 100% - Green
													} else if (
														subject.progress >= 61 &&
														subject.progress <= 90
													) {
														colorClass = "bg-teal-500 dark:bg-teal-600"; // 70-90% - Teal
													} else if (
														subject.progress >= 41 &&
														subject.progress <= 60
													) {
														colorClass = "bg-orange-400 dark:bg-orange-400"; // 31-70% - Orange
													} else if (subject.progress <= 40) {
														colorClass = "bg-red-500 dark:bg-red-500"; // 0-30% - Red
													} else {
														colorClass = "bg-blue-600 dark:bg-blue-500"; // 91-99% - Blue
													}
												}

												return (
													<div
														key={index}
														className={`w-full h-2 flex flex-col rounded-sm justify-center overflow-hidden text-xs text-white text-center whitespace-nowrap transition duration-500 ${colorClass}`}
														role="progressbar"
														aria-valuenow={Math.min(
															Math.max(subject.progress - index * 10, 0),
															10
														)}
														aria-valuemin="0"
														aria-valuemax="10"
													></div>
												);
											})}
											<div>
												<div className="w-10 text-end">
													<span className="text-sm text-gray-800 dark:text-white">
														{subject.progress}%
													</span>
												</div>
											</div>
										</div>
									</div>
									<select
										value={subject.progress}
										onChange={(e) =>
											updateProgress(subject.id, Number(e.target.value))
										}
										className="py-3 px-4 block w-20 border-gray-200 rounded-lg font-semibold text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
									>
										{Array.from({length: 11}, (_, index) => (
											<option key={index} value={index * 10}>
												{index * 10}%
											</option>
										))}
									</select>
									<div
										className="relative inline-flex"
										ref={openDropdown === subject.id ? dropdownRef : null}
									>
										<button
											onClick={() => toggleDropdown(subject.id)}
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
										{openDropdown === subject.id && (
											<div className="p-1 space-y-0.5 absolute z-50 right-10 mt-2 bg-white shadow-md rounded-lg dark:bg-neutral-800 dark:border dark:border-neutral-700">
												<button
													className="flex items-center gap-x-3.5 w-full py-2 px-3 rounded-lg text-sm text-blue-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-blue-600 dark:hover:bg-blue-800/30 dark:hover:text-blue-600 dark:focus:bg-blue-800/30"
													onClick={() => startEditing(subject)}
												>
													Edit
												</button>
												<button
													className="flex items-center gap-x-3.5 w-full py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-red-500 dark:hover:bg-red-800/30 dark:hover:text-red-500 dark:focus:bg-red-800/30"
													onClick={() => deleteSubject(subject.id)}
												>
													Delete
												</button>
											</div>
										)}
									</div>
								</>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ProgressSection;
