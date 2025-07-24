"use client";

import Image from "next/image";
import {IoMdClose} from "react-icons/io";

const ActiveRecallModal = ({isOpen, onClose}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
				{/* Header */}
				<div className="flex justify-center items-start mb-6">
					<h2 className="text-xl text-center justify-center font-semibold text-gray-900 dark:text-white">
						Practice Active Recall
					</h2>
					{/* <button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
					>
						<IoMdClose size={24} />
					</button> */}
				</div>

				{/* Image */}
				<div className="flex justify-center mb-4">
					<Image
						src="/recall.svg"
						alt="Active Recall"
						width={240}
						height={240}
						className="object-contain"
					/>
				</div>

				{/* Description */}
				<p className="text-gray-600 dark:text-neutral-300 text-center text-base mb-6">
					Take 5 minutes. Try to summarize what you have just learned from
					memory and write it down.
				</p>

				{/* Done Button */}
				<div className="flex justify-center mb-4">
					<button
						onClick={onClose}
						className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
					>
						I did it!
					</button>
				</div>
			</div>
		</div>
	);
};

export default ActiveRecallModal;
