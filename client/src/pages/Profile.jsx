import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi } from "../api/users";

/**
 * Profile Page - Step 1/4
 *
 * TODO: Collect user information:
 * - Username (required, unique)
 * - Name (required)
 * - Age (optional)
 * - Weight in kg (optional)
 * - Height in cm (optional)
 *
 * REQUIREMENTS:
 * - On submit, call POST /api/users to create user
 * - Store user details for subsequent pages
 * - Navigate to /plan on success
 * - Data should persist so if user refreshes at any step,
 *   they come back to profile page with filled data
 *
 * HINT: How will you pass this data to other pages?
 * - Context? LocalStorage? URL params? Something else?
 */
function Profile() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingUser, setExistingUser] = useState(null);

  // Mock data for subscribed user
  const subscribedUser = {
    name: "John Doe",
    username: "johndoe",
    age: 28,
    weight: 75.5,
    height: 178,
    plan: {
      name: "Pro",
      price: 299900,
    },
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  };

  const handleLogout = () => {
    setIsSubscribed(false);
    setExistingUser(null);
    setError(null);
  };

  const handleContinue = () => {
    navigate("/plan");
  };

  // Format price to INR
  const formatPrice = (paise) => {
    const rupees = paise / 100;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(rupees);
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const userData = {
      username: formData.get("username"),
      name: formData.get("name"),
      age: formData.get("age") || null,
      weight: formData.get("weight") || null,
      height: formData.get("height") || null,
    };

    try {
      const response = await usersApi.create(userData);
      navigate("/plan");
    } catch (err) {
      // If user already exists, fetch their data and show logged in view
      if (
        err.response?.status === 409 &&
        err.response?.data?.error === "Username already exists"
      ) {
        try {
          const userResponse = await usersApi.getByUsername(userData.username);
          setExistingUser(userResponse.user);
        } catch {
          setError("Failed to fetch user data. Please try again.");
        }
        return;
      }
      setError(
        err.response?.data?.error || "Failed to create user. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Existing User View (logged in, no plan yet)
  if (existingUser) {
    return (
      <div className="brutal-card">
        {/* Card Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="inline-block bg-secondary px-3 py-1 border-2 border-brutal-black shadow-brutal-sm">
              <span className="text-xs font-bold uppercase tracking-wider">
                Welcome Back
              </span>
            </div>
            <div
              className="inline-block bg-dark px-3 py-1 border-2 border-brutal-black shadow-brutal-sm hover:shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              onClick={handleLogout}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white">
                <svg
                  className="inline-block align-middle mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Hello, {existingUser.name.split(" ")[0]}!
          </h2>
        </div>

        {/* Success Message */}
        <div className="p-3 bg-green-500/20 border-2 border-green-500 text-green-400 text-sm mb-6">
          User already exists and successfully logged in
        </div>

        {/* User Details */}
        <div className="space-y-3 mb-8">
          <div className="p-4 bg-dark border-2 border-brutal-black">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 text-xs">Name</span>
                <p className="text-white font-medium">{existingUser.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Username</span>
                <p className="text-white font-medium">
                  @{existingUser.username}
                </p>
              </div>
              {existingUser.age && (
                <div>
                  <span className="text-gray-500 text-xs">Age</span>
                  <p className="text-white font-medium">
                    {existingUser.age} years
                  </p>
                </div>
              )}
              {(existingUser.weight || existingUser.height) && (
                <div>
                  <span className="text-gray-500 text-xs">Body Stats</span>
                  <p className="text-white font-medium">
                    {existingUser.weight && `${existingUser.weight} kg`}
                    {existingUser.weight && existingUser.height && " / "}
                    {existingUser.height && `${existingUser.height} cm`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="btn-primary w-full text-lg"
          >
            Continue to Plan Selection →
          </button>
        </div>
      </div>
    );
  }

  // Subscribed User View
  if (isSubscribed) {
    return (
      <div className="brutal-card">
        {/* Card Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="inline-block bg-secondary px-3 py-1 border-2 border-brutal-black shadow-brutal-sm">
              <span className="text-xs font-bold uppercase tracking-wider">
                Welcome Back
              </span>
            </div>
            <div
              className="inline-block bg-dark px-3 py-1 border-2 border-brutal-black shadow-brutal-sm hover:shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
              onClick={handleLogout}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white">
                <svg
                  className="inline-block align-middle mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {subscribedUser.name.split(" ")[0]}!
          </h2>
          <p className="text-gray-400">Here's your membership overview</p>
        </div>

        {/* User Details */}
        <div className="space-y-3 mb-8">
          {/* Account Info */}
          <div className="p-4 bg-dark border-2 border-brutal-black">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 text-xs">Name</span>
                <p className="text-white font-medium">{subscribedUser.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Username</span>
                <p className="text-white font-medium">
                  @{subscribedUser.username}
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Age</span>
                <p className="text-white font-medium">
                  {subscribedUser.age} years
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Body Stats</span>
                <p className="text-white font-medium">
                  {subscribedUser.weight} kg / {subscribedUser.height} cm
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="p-4 bg-primary border-2 border-brutal-black shadow-brutal">
            <h3 className="text-sm font-bold text-brutal-black uppercase tracking-wider mb-3">
              Current Plan
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-brutal-black">
                  {subscribedUser.plan.name}
                </p>
                <p className="text-brutal-black/70 text-sm">
                  {formatPrice(subscribedUser.plan.price)}/month
                </p>
              </div>
              <div className="px-3 py-1 bg-accent border-2 border-brutal-black">
                <span className="text-xs font-bold uppercase text-brutal-black">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Renewal Info */}
          <div className="flex justify-between items-center py-4 px-4 bg-secondary border-2 border-brutal-black">
            <div>
              <span className="text-gray-300 text-xs block">Next Renewal</span>
              <span className="text-white font-bold">
                {formatDate(subscribedUser.renewalDate)}
              </span>
            </div>
            <button className="px-4 py-2 bg-white text-brutal-black font-bold border-2 border-brutal-black shadow-brutal-sm hover:shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              Manage Plan
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button className="btn-outline w-full">Update Profile</button>
          <button className="text-gray-500 text-sm hover:text-gray-300 w-full text-center">
            View Payment History
          </button>
        </div>
        {/* Demo Toggle */}
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => setIsSubscribed(false)}
            className="text-xs text-gray-500 hover:text-gray-300 underline"
          >
            [Demo] Switch to New User
          </button>
        </div>
      </div>
    );
  }

  // New User Form View
  return (
    <div className="brutal-card">
      {/* Card Header */}
      <div className="mb-8">
        <div className="inline-block bg-secondary px-3 py-1 border-2 border-brutal-black shadow-brutal-sm mb-4">
          <span className="text-xs font-bold uppercase tracking-wider">
            Step 1 of 4
          </span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
        <p className="text-gray-400">
          Tell us a bit about yourself to get started
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="label-brutal">
            Username <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="input-brutal"
            placeholder="johndoe"
          />
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="name" className="label-brutal">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="input-brutal"
            placeholder="John Doe"
          />
        </div>

        {/* Optional Fields Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="age" className="label-brutal">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              min="1"
              max="150"
              className="input-brutal"
              placeholder="25"
            />
          </div>

          <div>
            <label htmlFor="weight" className="label-brutal">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="1"
              step="0.1"
              className="input-brutal"
              placeholder="70.5"
            />
          </div>

          <div>
            <label htmlFor="height" className="label-brutal">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              min="1"
              step="0.1"
              className="input-brutal"
              placeholder="175"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border-2 border-red-500 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating Profile..." : "Continue to Plan Selection →"}
          </button>
        </div>
        {/* Demo Toggle */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsSubscribed(true)}
            className="text-xs text-gray-500 hover:text-gray-300 underline"
          >
            [Demo] Switch to Subscribed User
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
