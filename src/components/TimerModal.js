"use client";

import {useEffect, useState, useRef} from "react";
import {IoIosCloseCircle} from "react-icons/io";

const TimerModal = ({isOpen, onClose}) => {
	// Countdown timer state
	const [timerDuration, setTimerDuration] = useState(null); // in seconds
	const [timerStart, setTimerStart] = useState(null); // Date.now()
	const [timerInterval, setTimerInterval] = useState(null);
	const [timerNow, setTimerNow] = useState(Date.now());

	const audioRef = useRef(null);

	// Helper: duration options
	const timerOptions = [
		{label: "30 Minutes", value: 30 * 60},
		{label: "1 Hour", value: 60 * 60},
		{label: "1.5 Hours", value: 90 * 60},
		{label: "2 Hours", value: 120 * 60},
	];

	// Timer effect
	useEffect(() => {
		if (timerStart && timerDuration) {
			const interval = setInterval(() => {
				setTimerNow(Date.now());
			}, 1000);
			setTimerInterval(interval);
			return () => clearInterval(interval);
		} else if (timerInterval) {
			clearInterval(timerInterval);
			setTimerInterval(null);
		}
	}, [timerStart, timerDuration]);

	// Calculate time passed and left
	let timePassed = 0;
	let timeLeft = 0;
	if (timerStart && timerDuration) {
		timePassed = Math.floor((timerNow - timerStart) / 1000);
		timeLeft = Math.max(timerDuration - timePassed, 0);
	}

	// Play sound when timer is up
	useEffect(() => {
		if (timeLeft === 0 && timerStart && audioRef.current) {
			audioRef.current.play();
		}
	}, [timeLeft, timerStart]);

	const startTimer = (duration) => {
		setTimerDuration(duration);
		setTimerStart(Date.now());
		setTimerNow(Date.now());
	};

	const resetTimer = () => {
		setTimerDuration(null);
		setTimerStart(null);
		setTimerNow(Date.now());
	};

	const handleClose = () => {
		resetTimer();
		onClose();
	};

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
			<div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 w-full max-w-xs relative">
				<button
					onClick={handleClose}
					className="absolute text-xl top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
				>
					<IoIosCloseCircle />
				</button>
				<h2 className="text-lg font-bold mb-4 text-center">Countdown Timer</h2>
				<audio ref={audioRef} src="/time-up.mp3" preload="auto" />
				{!timerStart ? (
					<div className="flex flex-col gap-3">
						{timerOptions.map((opt) => (
							<button
								key={opt.value}
								onClick={() => startTimer(opt.value)}
								className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
							>
								{opt.label}
							</button>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center gap-4">
						<div className="flex flex-col items-center">
							<span className="text-xs text-gray-400 mb-1">Time Passed</span>
							<span className="text-2xl font-mono text-blue-600 dark:text-blue-400">
								{formatTime(timePassed)}
							</span>
						</div>
						<div className="flex flex-col items-center">
							<span className="text-xs text-gray-400 mb-1">Time Left</span>
							<span
								className={`text-2xl font-mono ${
									timeLeft === 0
										? "text-emerald-600 dark:text-emerald-400"
										: "text-blue-600 dark:text-blue-400"
								}`}
							>
								{formatTime(timeLeft)}
							</span>
						</div>
						{timeLeft === 0 && (
							<p className="text-center text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
								Time's up!
							</p>
						)}
						<div className="flex gap-2 mt-4">
							<button
								onClick={resetTimer}
								className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-neutral-700 transition"
							>
								Reset
							</button>
							<button
								onClick={handleClose}
								className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
							>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TimerModal;
