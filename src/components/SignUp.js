"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {supabase} from "../lib/supabaseClient";
import {inputStyle, logo} from "../app/AllStyles";

const SignUp = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		if (!termsAccepted) {
			setError("You must accept the terms and conditions");
			return;
		}
		setError("");
		setLoading(true);

		const {data, error} = await supabase.auth.signUp({
			name,
			email,
			password,
			options: {
				data: {
					display_name: name,
				},
			},
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		router.push("/success");
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
							Sign up
						</h1>
						<p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
							Already have an account?{" "}
							<a
								className="text-blue-600 decoration-2 font-semibold hover:underline focus:outline-none focus:underline dark:text-blue-500"
								href="/signin"
							>
								Sign in here
							</a>
						</p>
					</div>

					<div className="mt-5">
						<form onSubmit={handleSubmit}>
							<div className="grid gap-y-4">
								<div>
									<label className="block text-sm mb-2 font-semibold text-neutral-900 dark:text-white">
										Name
									</label>
									<input
										type="text"
										className="py-3 px-4 block w-full border-gray-200 font-semibold rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
										value={name}
										onChange={(e) => setName(e.target.value)}
										required
									/>
								</div>
								<div>
									<label className="block text-sm mb-2 font-semibold text-neutral-900 dark:text-white">
										Email Address
									</label>
									<input
										type="email"
										className="py-3 px-4 block w-full border-gray-200 font-semibold rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>

								<div>
									<label className="block text-sm mb-2 font-semibold text-neutral-900 dark:text-white">
										Password
									</label>
									<input
										type="password"
										className="py-3 px-4 block w-full border-gray-200 font-semibold rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</div>

								<div>
									<label className="block text-sm mb-2 font-semibold text-neutral-900 dark:text-white">
										Confirm Password
									</label>
									<input
										type="password"
										className="py-3 px-4 block w-full border-gray-200 font-semibold rounded-lg text-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>

								{error && <p className="text-sm text-red-500">{error}</p>}

								<div className="flex items-center">
									<input
										type="checkbox"
										className="shrink-0 border-gray-200 rounded text-blue-600 dark:bg-neutral-800 dark:border-neutral-700"
										checked={termsAccepted}
										onChange={(e) => setTermsAccepted(e.target.checked)}
									/>
									<label className="ml-3 text-sm text-neutral-900 dark:text-white">
										I accept the{" "}
										<a
											href="#"
											className="text-blue-600 dark:text-blue-500 hover:underline"
										>
											Terms and Conditions
										</a>
									</label>
								</div>

								<button
									type="submit"
									className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
									disabled={loading}
								>
									{loading ? "Signing Up..." : "Sign Up"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
