"use client";

import {useState, useEffect, Suspense} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import {supabase} from "../../lib/supabaseClient";
import {inputStyle, logo} from "../AllStyles";

function ResetPasswordContent() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [isValidReset, setIsValidReset] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		// Check if this is a valid reset password flow
		const checkResetFlow = async () => {
			const resetParam = searchParams.get("reset");
			const {
				data: {session},
			} = await supabase.auth.getSession();

			// If user has a session and reset param is present, this is a valid reset flow
			if (session && resetParam === "true") {
				setIsValidReset(true);
			} else if (!session) {
				// No session, redirect to signin
				router.push("/signin");
			} else {
				// Has session but no reset param, redirect to dashboard
				router.push("/dashboard");
			}
		};

		checkResetFlow();
	}, [router, searchParams]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			return;
		}

		setLoading(true);

		const {data, error} = await supabase.auth.updateUser({
			password: password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		setMessage("Password updated successfully! Redirecting to dashboard...");
		setLoading(false);

		// Redirect to dashboard after a short delay
		setTimeout(() => {
			router.push("/dashboard");
		}, 2000);
	};

	// Show loading state while checking authentication
	if (!isValidReset) {
		return (
			<div className="w-full max-w-md mx-auto p-6">
				<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
					<div className="p-4 sm:p-7">
						<div className="text-center">
							<Link href="/">
								<div className="flex justify-center mb-6">{logo}</div>
							</Link>
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
								Verifying reset link...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md mx-auto p-6">
			<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
				<div className="p-4 sm:p-7">
					<div className="text-center">
						<Link href="/">
							<div className="flex justify-center mb-6">{logo}</div>
						</Link>
						<h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
							Reset Password
						</h1>

						<p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
							Enter your new password below.
						</p>
					</div>

					<div className="mt-5">
						<form onSubmit={handleSubmit}>
							<div className="grid gap-y-4">
								<div>
									<label className="block font-semibold text-sm mb-2 text-neutral-900 dark:text-white">
										New Password
									</label>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className={inputStyle}
										required
										minLength={6}
									/>
								</div>
								<div>
									<label className="block font-semibold text-sm mb-2 text-neutral-900 dark:text-white">
										Confirm New Password
									</label>
									<input
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className={inputStyle}
										required
										minLength={6}
									/>
								</div>

								{error && <p className="text-sm text-red-500">{error}</p>}
								{message && <p className="text-sm text-green-500">{message}</p>}

								<button
									type="submit"
									className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
									disabled={loading}
								>
									{loading ? "Updating..." : "Update Password"}
								</button>

								<div className="text-center">
									<Link
										href="/signin"
										className="text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-semibold dark:text-blue-500"
									>
										Back to Sign In
									</Link>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function ResetPassword() {
	return (
		<Suspense
			fallback={
				<div className="w-full max-w-md mx-auto p-6">
					<div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
						<div className="p-4 sm:p-7">
							<div className="text-center">
								<Link href="/">
									<div className="flex justify-center mb-6">{logo}</div>
								</Link>
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
								<p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
									Loading...
								</p>
							</div>
						</div>
					</div>
				</div>
			}
		>
			<ResetPasswordContent />
		</Suspense>
	);
}
