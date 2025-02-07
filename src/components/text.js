<div className="hs-dropdown relative inline-flex">
	<button
		id="hs-dropdown-custom-icon-trigger"
		type="button"
		className="hs-dropdown-toggle flex justify-center items-center size-9 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
		aria-haspopup="menu"
		aria-expanded="false"
		aria-label="Dropdown"
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

	<div
		className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
		role="menu"
		aria-orientation="vertical"
		aria-labelledby="hs-dropdown-custom-icon-trigger"
	>
		<div className="p-1 space-y-0.5">
			<button className={secondaryButton} onClick={updateSubject}>
				Save
			</button>
			<button
				className={destructiveButton}
				onClick={() => setEditingSubject(null)}
			>
				Cancel
			</button>
		</div>
	</div>
</div>;
