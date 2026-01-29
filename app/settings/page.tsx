"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

type TabType = "account" | "edit-profile" | "payment-methods";

export default function SettingsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("account");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Edit Profile state
  const [profileFullName, setProfileFullName] = useState("Thomas.D");
  const [profileEmail, setProfileEmail] = useState("Info@gmail.com");
  const [contactNumber, setContactNumber] = useState("+0 333 421 423");
  const [address, setAddress] = useState("2485 S McCall Rd");
  const [state, setState] = useState("Florida");
  const [country, setCountry] = useState("United States");
  const [timeZone, setTimeZone] = useState("GMT-6");
  const [website, setWebsite] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [privacyOption1, setPrivacyOption1] = useState(true);
  const [privacyOption2, setPrivacyOption2] = useState(false);

  // Payment Methods state
  const [nameOnCard, setNameOnCard] = useState("Thomas.D");
  const [cardNumber, setCardNumber] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [billingFullName, setBillingFullName] = useState("Thomas.D");
  const [billingAddress, setBillingAddress] = useState("4085 Gleason Drives");
  const [billingCity, setBillingCity] = useState("West Derickshire");
  const [billingZip, setBillingZip] = useState("50703");
  const [billingCountry, setBillingCountry] = useState("United States");

  const handleSave = async () => {
    setIsSaving(true);
    // Here you would implement the actual save logic
    // For now, we'll just simulate a save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Settings saved!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Banner */}
      <div className="bg-[#F5F5DC] text-gray-700 text-center py-3 text-sm">
        Check your inbox so you can quickly complete your verification.
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <span className="text-[#8BC34A] font-bold tracking-widest text-lg uppercase">
              Community Fundings
            </span>
          </Link>
          <div className="flex items-center">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
            )}
          </div>
        </div>
      </header>

      {/* Settings Header with green background */}
      <div className="bg-[#F5F9F0]">
        <div className="max-w-4xl mx-auto w-full px-6 pt-8 pb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

          {/* Tabs */}
          <div className="border-b border-[#8BC34A]/30">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("account")}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === "account"
                    ? "text-gray-900 border-b-2 border-[#8BC34A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Account
              </button>
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

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">

        {/* Account Tab Content */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Thomas.D"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                />
              </div>

              {/* Old Password */}
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

              {/* New Password */}
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

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Edit Profile Tab Content */}
        {activeTab === "edit-profile" && (
          <div className="space-y-8">
            {/* Section Title */}
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Edit Profile
            </h2>

            {/* Profile Photo */}
            <div className="relative w-24 h-24">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
              )}
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#8BC34A] rounded-full flex items-center justify-center text-white shadow-md hover:bg-[#7CB342] transition-colors">
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
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="profileFullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full name
                  </label>
                  <input
                    id="profileFullName"
                    type="text"
                    value={profileFullName}
                    onChange={(e) => setProfileFullName(e.target.value)}
                    placeholder="Thomas.D"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                  </p>
                </div>
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
                    placeholder="Info@gmail.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              {/* Row 2: Contact Number & Address */}
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
                    placeholder="+0 333 421 423"
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
                    placeholder="2485 S McCall Rd"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A]"
                  />
                </div>
              </div>

              {/* Row 3: State & Country */}
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
                    placeholder="Florida"
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

              {/* Divider */}
              <div className="border-t border-gray-200 pt-6">
                {/* Row 4: Time Zone & Website */}
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
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
                      <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* About You */}
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

              {/* Privacy */}
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

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-4 pt-4">
                <button className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors">
                  View Profile
                </button>
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

        {/* Payment Methods Tab Content */}
        {activeTab === "payment-methods" && (
          <div className="space-y-8">
            {/* Section Title */}
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Edit Payments Details
            </h2>

            {/* Payment Card Fields */}
            <div className="space-y-6">
              {/* Row 1: Name on Card & Credit Card Number */}
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

              {/* Row 2: Security Code, Expiration Date, CVC */}
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

              {/* Divider */}
              <div className="border-t border-gray-200 pt-8">
                {/* Billing Address Section */}
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Billing Address
                </h3>

                {/* Row 3: Full Name & Billing Address */}
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

                {/* Row 4: City, Zip, Country */}
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

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-4 pt-8">
                <button className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-colors">
                  View Profile
                </button>
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

      {/* Footer */}
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
