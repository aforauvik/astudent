"use client";

import {useState} from "react";
import {IoIosCloseCircle} from "react-icons/io";

const DurationModal = ({isOpen, onClose, taskText, onSave}) => {
	const [selectedDuration, setSelectedDuration] = useState(null);

	const durationOptions = [
		{label: "5 minutes", value: 5},
		{label: "10 minutes", value: 10},
		{label: "15 minutes", value: 15},
		{label: "30 minutes", value: 30},
		{label: "1 hour", value: 60},
		{label: "2 hours", value: 120},
		{label: "3 hours", value: 180},
		{label: "4 hours", value: 240},
	];

	const handleSave = () => {
		if (selectedDuration) {
			onSave(selectedDuration);
			setSelectedDuration(null);
			onClose();
		}
	};

	const handleClose = () => {
		setSelectedDuration(null);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
			<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 w-full max-w-sm relative">
				<button
					onClick={handleClose}
					className="absolute text-xl top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
				>
					<IoIosCloseCircle />
				</button>

				<h2 className="text-lg font-bold mb-4 text-center text-gray-900 dark:text-white">
					Set Task Duration
				</h2>

				<div className="mb-4">
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
						Task:{" "}
						<span className="font-medium text-gray-900 dark:text-white">
							{taskText}
						</span>
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3 mb-6">
					{durationOptions.map((option) => (
						<button
							key={option.value}
							onClick={() => setSelectedDuration(option.value)}
							className={`py-3 px-4 text-sm rounded-lg border-2 transition-colors ${
								selectedDuration === option.value
									? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
									: "border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-neutral-700"
							}`}
						>
							{option.label}
						</button>
					))}
				</div>

				<div className="flex gap-3">
					<button
						onClick={handleClose}
						className="flex-1 py-3 px-4 text-sm rounded-lg border border-gray-300 dark:border-neutral-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={!selectedDuration}
						className="flex-1 py-3 px-4 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default DurationModal;
