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
			<h2 className="text-lg font-semibold mb-4">🎉 Progress</h2>
			<div className="flex rounded-lg shadow-sm">
				<input
					type="text"
					value={subjectInput}
					onChange={(e) => setSubjectInput(e.target.value)}
					className={inputStyle}
					placeholder="Add a course, topic or assignment..."
				/>
				<button type="button" onClick={addSubject} className={addButton}>
					Add
				</button>
			</div>
			<div className="mt-4">
				<h2 className="text-sm font-semibold my-4 text-gray-500 dark:text-neutral-400 ">
					Courses, Topics, Assignments
				</h2>
				{subjects.map((subject) => (
					<div key={subject.id} className="flex items-center mt-2 space-x-2">
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
								<p className={listStyle}>{subject.name}</p>
								<select
									value={subject.progress}
									onChange={(e) =>
										updateProgress(subject.id, Number(e.target.value))
									}
									className="py-3 px-4 block w-24 border-gray-200 rounded-lg font-semibold text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
								>
									<option value={0}>0%</option>
									<option value={25}>25%</option>
									<option value={50}>50%</option>
									<option value={75}>75%</option>
									<option value={100}>100%</option>
								</select>

								<div className="relative w-16 hidden sm:block">
									<svg
										className="size-full -rotate-90"
										viewBox="0 0 36 36"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle
											cx="18"
											cy="18"
											r="16"
											fill="none"
											className="stroke-current text-gray-200 dark:text-neutral-800"
											strokeWidth="2"
										></circle>

										<circle
											cx="18"
											cy="18"
											r="16"
											fill="none"
											className={`stroke-current ${
												subject.progress >= 90
													? "text-green-600"
													: subject.progress >= 75
													? "text-yellow-500"
													: subject.progress >= 50
													? "text-orange-500"
													: subject.progress >= 25
													? "text-red-500"
													: "text-gray-500"
											} dark:${
												subject.progress >= 90
													? "text-green-600"
													: subject.progress >= 75
													? "text-yellow-500"
													: subject.progress >= 50
													? "text-orange-500"
													: subject.progress >= 25
													? "text-red-500"
													: "text-gray-500"
											}`}
											strokeWidth="2"
											strokeDasharray="100"
											strokeDashoffset={100 - subject.progress}
											strokeLinecap="round"
										></circle>
									</svg>

									<div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 ">
										<span
											className={`text-center text-xs font-bold ${
												subject.progress >= 90
													? "text-green-600"
													: subject.progress >= 75
													? "text-yellow-500"
													: subject.progress >= 50
													? "text-orange-500"
													: subject.progress >= 25
													? "text-red-500"
													: "text-gray-500"
											} dark:${
												subject.progress >= 90
													? "text-green-600"
													: subject.progress >= 75
													? "text-yellow-500"
													: subject.progress >= 50
													? "text-orange-500"
													: subject.progress >= 25
													? "text-red-500"
													: "text-gray-500"
											}`}
										>
											{subject.progress}%
										</span>
									</div>
								</div>
								<div
									className="relative inline-flex"
									ref={openDropdown === subject.id ? dropdownRef : null}
								>
									<button
										onClick={() => toggleDropdown(subject.id)}
										className="flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
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
				))}
			</div>
		</div>
	);
};

export default ProgressSection;
