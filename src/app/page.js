"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {supabase} from "../lib/supabaseClient";
import SignIn from "@/components/SignIn";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		// Redirect authenticated users to dashboard
		const checkAuth = async () => {
			const {data} = await supabase.auth.getSession();
			if (data?.session) {
				router.push("/dashboard");
			}
		};
		checkAuth();
	}, []);

	return (
		<>
			<SignIn />
			<Footer />
		</>
	);
}
