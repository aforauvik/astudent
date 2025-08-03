"use client";

import {useState} from "react";
import Link from "next/link";
import {supabase} from "../../lib/supabaseClient";
import {inputStyle, logo} from "../AllStyles";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		setLoading(true);

		const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password?reset=true`,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		setMessage("Password reset link has been sent to your email address.");
		setLoading(false);
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
							Forgot Password
						</h1>

						<p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
							Enter your email address and we'll send you a link to reset your
							password.
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

								{error && <p className="text-sm text-red-500">{error}</p>}
								{message && <p className="text-sm text-green-500">{message}</p>}

								<button
									type="submit"
									className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
									disabled={loading}
								>
									{loading ? "Sending..." : "Send Reset Link"}
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
};

export default ForgotPassword;
