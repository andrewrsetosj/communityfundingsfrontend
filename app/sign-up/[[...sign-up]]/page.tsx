"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: { message: string }[] };
      setError(clerkError.errors?.[0]?.message || "Failed to sign up with Google");
    }
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Verification Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Header */}
          <header className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <Link href="/">
                <span className="text-[#8BC34A] font-bold tracking-widest text-lg uppercase">
                  Community Fundings
                </span>
              </Link>
              <div className="text-sm text-gray-600">
                Have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-[#8BC34A] hover:text-[#7CB342] font-medium"
                >
                  Log in
                </Link>
              </div>
            </div>
          </header>

          {/* Verification Content */}
          <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Verify your email
              </h1>
              <p className="text-gray-600 mb-8">
                We&apos;ve sent a verification code to {email}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleVerification} className="space-y-6">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] placeholder:text-[#8BC34A]/60"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#8BC34A] text-white py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-[#F5F0E8]">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"
            alt="Interior design"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/">
              <span className="text-[#8BC34A] font-bold tracking-widest text-lg uppercase">
                Community Fundings
              </span>
            </Link>
            <div className="text-sm text-gray-600">
              Have an account?{" "}
              <Link
                href="/sign-in"
                className="text-[#8BC34A] hover:text-[#7CB342] font-medium"
              >
                Log in
              </Link>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Sign up</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] placeholder:text-[#8BC34A]/60"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] placeholder:text-[#8BC34A]/60 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Newsletter Checkbox */}
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="w-4 h-4 mt-0.5 border-gray-300 rounded text-[#8BC34A] focus:ring-[#8BC34A]"
                />
                <span className="ml-3 text-sm text-gray-600">
                  Send me a weekly mix of handpicked projects, plus occasional
                  Kickstarter news
                </span>
              </label>

              {/* CAPTCHA Container for Clerk bot protection */}
              <div id="clerk-captcha" />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#8BC34A] text-white py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>

              {/* Policy Text */}
              <p className="text-sm text-gray-500">
                By signing up, you agree to our{" "}
                <Link href="/privacy" className="text-[#8BC34A] hover:underline">
                  Privacy Policy
                </Link>
                ,{" "}
                <Link href="/cookies" className="text-[#8BC34A] hover:underline">
                  Cookie Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="text-[#8BC34A] hover:underline">
                  Terms of Use
                </Link>
                .
              </p>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#F5F0E8]">
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"
          alt="Interior design"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
