export default function handler(req, res) {
	// Define an array of three messages
	const messages = [
		"Hello from Next.js!",
		"Keep calm and code on.",
		"Stay curious, keep coding!",
	];

	// Respond with the full array of messages as JSON
	res.status(200).json({messages});
}
