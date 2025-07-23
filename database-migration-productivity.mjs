// Database Migration Script for Productivity Tracking
// Run this script to add productivity tracking fields to your tasks table

import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateDatabase() {
	console.log("Starting database migration for productivity tracking...");

	try {
		// Add completed_minutes column to tasks table
		console.log("Adding completed_minutes to tasks table...");
		const {error: tasksError} = await supabase.rpc("exec_sql", {
			sql: `
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS completed_minutes INTEGER DEFAULT 0;
      `,
		});

		if (tasksError) {
			console.error("Error updating tasks table:", tasksError);
		} else {
			console.log(
				"✅ Tasks table updated successfully with completed_minutes field"
			);
		}

		console.log("🎉 Database migration completed successfully!");
		console.log("");
		console.log("Next steps:");
		console.log("1. Restart your development server");
		console.log("2. Test the productivity tracking functionality");
		console.log("3. Verify that completed time is tracked correctly");
	} catch (error) {
		console.error("Migration failed:", error);
	}
}

migrateDatabase();
