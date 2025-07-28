// Database Migration Script for Task Start Time
// Run this script to add start_time field to your tasks table

import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateDatabase() {
	console.log("Starting database migration for task start time...");

	try {
		// Add start_time column to tasks table
		console.log("Adding start_time to tasks table...");
		const {error: tasksError} = await supabase.rpc("exec_sql", {
			sql: `
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT NULL;
      `,
		});

		if (tasksError) {
			console.error("Error updating tasks table:", tasksError);
		} else {
			console.log("✅ Tasks table updated successfully with start_time field");
		}

		console.log("🎉 Database migration completed successfully!");
		console.log("");
		console.log("Next steps:");
		console.log("1. Restart your development server");
		console.log("2. Test the task start time functionality");
		console.log("3. Verify that start time is saved and displayed correctly");
	} catch (error) {
		console.error("Migration failed:", error);
	}
}

migrateDatabase();
