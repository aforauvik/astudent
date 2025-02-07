import {supabase} from "../../lib/supabaseClient";

export default async function handler(req, res) {
	if (req.method === "GET") {
		const {data, error} = await supabase.from("tasks").select("*");
		if (error) return res.status(500).json({error: error.message});
		return res.status(200).json(data);
	}

	if (req.method === "POST") {
		const {text} = req.body;
		const {data, error} = await supabase
			.from("tasks")
			.insert([{text, done: false}]);
		if (error) return res.status(500).json({error: error.message});
		return res.status(201).json(data);
	}

	if (req.method === "PUT") {
		const {id, done} = req.body;
		const {data, error} = await supabase
			.from("tasks")
			.update({done})
			.eq("id", id);
		if (error) return res.status(500).json({error: error.message});
		return res.status(200).json(data);
	}

	if (req.method === "DELETE") {
		const {id} = req.body;
		const {data, error} = await supabase.from("tasks").delete().eq("id", id);
		if (error) return res.status(500).json({error: error.message});
		return res.status(200).json(data);
	}

	return res.status(405).json({error: "Method not allowed"});
}
