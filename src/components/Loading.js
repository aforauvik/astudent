"use client";

const LoadingState = () => {
	return (
		<div className="flex justify-center items-center py-8">
			<div
				className="animate-spin inline-block w-6 h-6 border-4 border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
				role="status"
				aria-label="loading"
			>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
};

export default LoadingState;
