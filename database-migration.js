// Database Migration Script
// Run this script to add sort_order fields to your existing tables

import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateDatabase() {
	console.log("Starting database migration...");

	try {
		// Add sort_order column to tasks table
		console.log("Adding sort_order to tasks table...");
		const {error: tasksError} = await supabase.rpc("exec_sql", {
			sql: `
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
        
        UPDATE tasks 
        SET sort_order = EXTRACT(EPOCH FROM created_at)::INTEGER 
        WHERE sort_order = 0 OR sort_order IS NULL;
      `,
		});

		if (tasksError) {
			console.error("Error updating tasks table:", tasksError);
		} else {
			console.log("✅ Tasks table updated successfully");
		}

		// Add sort_order column to remember_tasks table
		console.log("Adding sort_order to remember_tasks table...");
		const {error: rememberError} = await supabase.rpc("exec_sql", {
			sql: `
        ALTER TABLE remember_tasks 
        ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
        
        UPDATE remember_tasks 
        SET sort_order = EXTRACT(EPOCH FROM created_at)::INTEGER 
        WHERE sort_order = 0 OR sort_order IS NULL;
      `,
		});

		if (rememberError) {
			console.error("Error updating remember_tasks table:", rememberError);
		} else {
			console.log("✅ Remember_tasks table updated successfully");
		}

		// Add sort_order column to progress table
		console.log("Adding sort_order to progress table...");
		const {error: progressError} = await supabase.rpc("exec_sql", {
			sql: `
        ALTER TABLE progress 
        ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
        
        UPDATE progress 
        SET sort_order = EXTRACT(EPOCH FROM created_at)::INTEGER 
        WHERE sort_order = 0 OR sort_order IS NULL;
      `,
		});

		if (progressError) {
			console.error("Error updating progress table:", progressError);
		} else {
			console.log("✅ Progress table updated successfully");
		}

		console.log("🎉 Database migration completed successfully!");
		console.log("");
		console.log("Next steps:");
		console.log("1. Restart your development server");
		console.log("2. Test the drag-and-drop functionality");
		console.log("3. Verify that the order persists after page refresh");
	} catch (error) {
		console.error("Migration failed:", error);
	}
}

// Run the migration
migrateDatabase();
