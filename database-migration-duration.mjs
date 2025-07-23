// Database Migration Script for Task Duration
// Run this script to add duration field to your tasks table

import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateDatabase() {
	console.log("Starting database migration for task duration...");

	try {
		// Add duration column to tasks table
		console.log("Adding duration to tasks table...");
		const {error: tasksError} = await supabase.rpc("exec_sql", {
			sql: `
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT NULL;
      `,
		});

		if (tasksError) {
			console.error("Error updating tasks table:", tasksError);
		} else {
			console.log("✅ Tasks table updated successfully with duration field");
		}

		console.log("🎉 Database migration completed successfully!");
		console.log("");
		console.log("Next steps:");
		console.log("1. Restart your development server");
		console.log("2. Test the task duration functionality");
		console.log("3. Verify that duration is saved and displayed correctly");
	} catch (error) {
		console.error("Migration failed:", error);
	}
}

migrateDatabase();
