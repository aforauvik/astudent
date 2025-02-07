"use client";

import {createPopper} from "@popperjs/core";

import {useState, useEffect} from "react";
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

	useEffect(() => {
		fetchSubjects();
	}, []);

	const fetchSubjects = async () => {
		const {data, error} = await supabase.from("progress").select("*");
		if (!error) setSubjects(data || []);
	};

	const addSubject = async () => {
		if (subjectInput.trim()) {
			const {error} = await supabase
				.from("progress")
				.insert([{name: subjectInput, progress: 0}]);
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
		const {error} = await supabase.from("progress").delete().eq("id", id);
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

	return (
		<div className="p-4 mt-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-950 dark:border-neutral-900 w-1/2">
			<h2 className="text-lg font-semibold mb-4">🎉 Progress</h2>
			<div className="flex rounded-lg shadow-sm text-lg">
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
					<div key={subject.id} className="flex mb-2 gap-2 w-full">
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
									onClick={() => setEditingSubject(null)}
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
									className="py-3 px-4 pe-9 block w-24 border-gray-200 rounded-lg font-semibold text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
								>
									<option value={0}>0%</option>
									<option value={25}>25%</option>
									<option value={50}>50%</option>
									<option value={75}>75%</option>
									<option value={100}>100%</option>
								</select>

								<div className="relative w-20">
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

									<div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
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
								<button
									className={secondaryButton}
									onClick={() => startEditing(subject)}
								>
									Edit
								</button>
								<button
									className={destructiveButton}
									onClick={() => deleteSubject(subject.id)}
								>
									Delete
								</button>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default ProgressSection;
