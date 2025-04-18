"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 16;
  };

  const handleSignupWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validatePassword(password)) {
      setError("Password must be at least 16 characters long");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("An error occurred during signup");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An error occurred during Google signup");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--background] p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="text-[--primary] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {success ? (
          <div className="p-4 text-center bg-green-50 text-green-800 rounded">
            <p>
              Registration successful! Please check your email to verify your
              account.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              <button
                onClick={handleSignupWithGoogle}
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 p-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <Image
                  src="/images/google-logo.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span>Sign up with Google</span>
              </button>

              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-300"></div>
                <p className="mx-4 text-sm text-gray-500">or</p>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <form onSubmit={handleSignupWithEmail} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[--primary] focus:border-[--primary]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[--primary] focus:border-[--primary]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 16 characters long
                  </p>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[--primary] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--primary] transition"
                >
                  {loading ? "Processing..." : "Sign up with Email"}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
