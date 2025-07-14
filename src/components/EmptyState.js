"use client";

import Image from "next/image";

const imagesForStates = {
	taskEmptyImage: "/empty-task.png",
	rememberEmptyImage: "/empty-remember.png",
	trackEmptyImage: "/empty-track.png",
};

const emptyStateMessages = {
	emptyTaskMessage: "No tasks yet. Add a task above!",
	emptyRememberMessage:
		"No things to remember yet! Add your first reminder above!",
	emptyTrackMessage:
		"No progress tracked yet! Add your first project or assignment!",
};

const EmptyState = ({
	imageState = "taskEmptyImage",
	description = "Nothing here yet!",
}) => {
	const imageSrc =
		imagesForStates[imageState] || imagesForStates["taskEmptyImage"];
	return (
		<div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 dark:text-neutral-500">
			<Image
				src={imageSrc}
				width={150}
				height={150}
				alt="Empty state"
				className="mb-2"
			/>
			<p className="text-sm text-gray-500 dark:text-neutral-400 text-center py-4">
				{emptyStateMessages[description]}
			</p>
		</div>
	);
};

export default EmptyState;
