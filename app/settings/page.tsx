"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import { syncClerkToBackendToken } from "@/lib/backendToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type TabType = "account" | "edit-profile" | "payment-methods";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("edit-profile");
  const [isDirty, setIsDirty] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("United States");
  const [timeZone, setTimeZone] = useState("");
  const [website, setWebsite] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [privacyOption1, setPrivacyOption1] = useState(true);
  const [privacyOption2, setPrivacyOption2] = useState(false);

  const allInterests = [
    "Art", "Comics", "Crafts", "Dance", "Design",
    "Fashion", "Film & Video", "Food", "Games",
    "Journalism", "Music", "Photography", "Publishing",
    "Technology", "Theater",
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const MAX_INTERESTS = 5;

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingFullName, setBillingFullName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [billingCountry, setBillingCountry] = useState("United States");

  useEffect(() => {
    if (!isLoaded || !user) return;

    const clerkName = user.fullName || "";
    const clerkEmail = user.primaryEmailAddress?.emailAddress || "";

    setFullName(clerkName);
    setEmail(clerkEmail);

    setProfileFirstName(user.firstName || "");
    setProfileLastName(user.lastName || "");
    setProfileEmail(clerkEmail);

    setNameOnCard(clerkName);
    setBillingFullName(clerkName);
  }, [isLoaded, user]);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    async function fetchCreator() {
      try {
        const res = await fetch(`${API_URL}/api/users/${user!.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.name) setProfileFirstName(data.name);
        if (data.last_name) setProfileLastName(data.last_name);
        if (data.email) setProfileEmail(data.email);
        if (data.bio) setAboutYou(data.bio);
        if (data.phone_number) setContactNumber(data.phone_number);
        if (data.address) setAddress(data.address);
        if (data.state) setState(data.state);
        if (data.time_zone) setTimeZone(data.time_zone);
        if (data.website) setWebsite(data.website);
      } catch (err) {
        console.error("Error fetching creator profile:", err);
      }
    }

    fetchCreator();

    const token = localStorage.getItem("cf_backend_token");
    if (token) {
      fetch(`${API_URL}/api/users/me/interests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data: { name: string }[]) => setSelectedInterests(data.map((d) => d.name)))
        .catch((err) => console.error("Error fetching interests:", err));
    }
  }, [isLoaded, user?.id]);

  const toggleInterest = (name: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(name)) return prev.filter((i) => i !== name);
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, name];
    });
    setIsDirty(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;
      if (!confirm("Are you sure you want to leave? All changes will be lost.")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  async function handleProfileImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);

      await user.setProfileImage({ file });
      await user.reload();
      await syncClerkToBackendToken(user);

      setIsDirty(true);
    } catch (err) {
      console.error("Error updating profile image:", err);
      alert("Failed to update profile photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);

    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileFirstName,
          last_name: profileLastName,
          bio: aboutYou,
          phone_number: contactNumber,
          address,
          state,
          time_zone: timeZone,
          website,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");

      const token = localStorage.getItem("cf_backend_token");
      if (token) {
        await fetch(`${API_URL}/api/users/me/interests`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ interest_names: selectedInterests }),
        });
      }

      setIsDirty(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white" onInput={() => setIsDirty(true)}>
      <Header />

      <div className="bg-[#F5F9F0]">
        <div className="max-w-4xl mx-auto w-full px-6 pt-8 pb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

          <div className="border-b border-[#8BC34A]/30">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("edit-profile")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "edit-profile"
                    ? "text-gray-900 border-b-2 border-[#8BC34A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab("payment-methods")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "payment-methods"
                    ? "text-gray-900 border-b-2 border-[#8BC34A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Payment Methods
              </button>
            </nav>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {activeTab === "edit-profile" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Edit Profile
            </h2>

            <div className="relative w-24 h-24">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-24 h-24"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto || !user}
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#8BC34A] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#7CB342] transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </div>

            <p className="text-sm text-gray-500 -mt-4">
              {isUploadingPhoto ? "Uploading photo..." : "Click the pencil to change your profile photo."}
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="profileFirstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="profileFirstName"
                    type="text"
                    value={profileFirstName}
                    onChange={(e) => setProfileFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profileLastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="profileLastName"
                    type="text"
                    value={profileLastName}
                    onChange={(e) => setProfileLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="profileEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="profileEmail"
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="contactNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contact Number
                  </label>
                  <input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Phone number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Country
                  </label>
                  <div className="relative">
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] appearance-none bg-white"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="timeZone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Time Zone
                    </label>
                    <input
                      id="timeZone"
                      type="text"
                      value={timeZone}
                      onChange={(e) => setTimeZone(e.target.value)}
                      placeholder="GMT-6"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      e.g. EST, PST, GMT-6
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Website
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder=""
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                      />
                      <button
                        type="button"
                        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="aboutYou"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  About You
                </label>
                <textarea
                  id="aboutYou"
                  value={aboutYou}
                  onChange={(e) => setAboutYou(e.target.value)}
                  placeholder="Enter Description"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] resize-none"
                />
                <p className="mt-2 text-xs text-gray-500">
                  We suggest a short bio. If it&apos;s 300 characters or less it&apos;ll look great on your profile.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Your Interests</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Select up to {MAX_INTERESTS} interests. {selectedInterests.length} of {MAX_INTERESTS} selected.
                </p>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    const isDisabled = !isSelected && selectedInterests.length >= MAX_INTERESTS;
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          isSelected
                            ? "bg-[#8BC34A] text-white border-[#8BC34A]"
                            : isDisabled
                              ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-300 hover:border-[#8BC34A] hover:text-[#8BC34A]"
                        }`}
                      >
                        {isSelected ? `${interest} ×` : interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="oldPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Old Password
                    </label>
                    <input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Privacy</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyOption1}
                      onChange={(e) => setPrivacyOption1(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"
                    />
                    <span className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyOption2}
                      onChange={(e) => setPrivacyOption2(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"
                    />
                    <span className="text-sm text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-4">
                <Link
                  href={user?.id ? `/profile/${user.id}` : "#"}
                  className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                  >
                View Profile
                </Link>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "payment-methods" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Edit Payments Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="nameOnCard"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name on card
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg
                        className="w-6 h-4"
                        viewBox="0 0 24 16"
                        fill="none"
                      >
                        <rect width="24" height="16" rx="2" fill="#8BC34A" />
                        <rect x="2" y="4" width="8" height="3" rx="0.5" fill="#FFF" />
                        <rect x="2" y="9" width="5" height="2" rx="0.5" fill="#FFF" opacity="0.7" />
                      </svg>
                    </div>
                    <input
                      id="nameOnCard"
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Thomas.D"
                      className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Credit card number
                  </label>
                  <div className="relative">
                    <input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card number"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                    <svg
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="securityCode"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Security code
                  </label>
                  <input
                    id="securityCode"
                    type="password"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    placeholder="******"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Expiration date
                  </label>
                  <input
                    id="expirationDate"
                    type="text"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvc"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVV"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Billing Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="billingFullName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full name
                    </label>
                    <input
                      id="billingFullName"
                      type="text"
                      value={billingFullName}
                      onChange={(e) => setBillingFullName(e.target.value)}
                      placeholder="Thomas.D"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="billingAddress"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Billing address
                    </label>
                    <input
                      id="billingAddress"
                      type="text"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="4085 Gleason Drives"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="billingCity"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      City
                    </label>
                    <input
                      id="billingCity"
                      type="text"
                      value={billingCity}
                      onChange={(e) => setBillingCity(e.target.value)}
                      placeholder="West Derickshire"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="billingZip"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Zip
                    </label>
                    <input
                      id="billingZip"
                      type="text"
                      value={billingZip}
                      onChange={(e) => setBillingZip(e.target.value)}
                      placeholder="50703"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="billingCountry"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Country
                    </label>
                    <div className="relative">
                      <select
                        id="billingCountry"
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] appearance-none bg-white"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                      </select>
                      <svg
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 pt-8">
                <Link
                  href={user?.id ? `/profile/${user.id}` : "#"}
                  className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                  >
                View Profile
                </Link>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 mb-4 md:mb-0">
            <span className="text-[#8BC34A] font-bold mr-2">CF</span>
            Community Funding, PBC © 2022
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-[#8BC34A] transition-colors">
              Trust and Safety
            </Link>
            <Link href="#" className="hover:text-[#8BC34A] transition-colors">
              Lorem ipsum
            </Link>
            <Link href="#" className="hover:text-[#8BC34A] transition-colors">
              Lorem ipsum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}