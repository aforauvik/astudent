"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {supabase} from "../lib/supabaseClient";
import {inputStyle, logo} from "../app/AllStyles";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const {data, error} = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		router.push("/dashboard");
	};

	return (
		<div className="w-full max-w-md mx-auto p-6">
			<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
				<div className="p-4 sm:p-7">
					<div className="text-center">
						<Link href="/">
							<div className="flex justify-center mb-6">{logo}</div>
						</Link>
						<h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
							Sign in
						</h1>

						<p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
							Don't have an account yet?{" "}
							<Link
								href="/signup"
								className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-semibold dark:text-blue-500"
							>
								Sign up here
							</Link>
						</p>
					</div>

					<div className="mt-5">
						<form onSubmit={handleSubmit}>
							<div className="grid gap-y-4">
								<div>
									<label className="block font-semibold text-sm mb-2 text-neutral-900 dark:text-white">
										Email Address
									</label>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>
								<div>
									<div className="flex justify-between items-center">
										<label className="font-semibold block text-sm mb-2 text-neutral-900 dark:text-white">
											Password
										</label>
										{/* <Link
											href="/resetpassword"
											className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-semibold dark:text-blue-500"
										>
											Forgot password?
										</Link> */}
									</div>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className={inputStyle}
										required
									/>
								</div>
								{error && <p className="text-sm text-red-500">{error}</p>}

								<button
									type="submit"
									className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
									disabled={loading}
								>
									{loading ? "Signing In..." : "Sign In"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
