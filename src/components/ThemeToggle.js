import {IoMdSunny, IoMdMoon} from "react-icons/io";

export default function ThemeToggle({isDarkMode, onToggle}) {
	return (
		<button
			onClick={onToggle}
			className="p-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-300 w-full flex items-center gap-2 justify-start text-left"
			aria-label="Toggle dark mode"
		>
			{isDarkMode ? (
				<IoMdSunny className="text-base transition-transform duration-300" />
			) : (
				<IoMdMoon className="text-base transition-transform duration-300" />
			)}
			<span className="text-sm font-medium">
				{isDarkMode ? "Light Mode" : "Dark Mode"}
			</span>
		</button>
	);
}
