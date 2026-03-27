import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi } from "../api/users";
import { useSubscription } from "../context/SubscriptionContext";

/**
 * Profile Page - Step 1/4
 */
function Profile() {
  const navigate = useNavigate();
  const { user, setUser, clearSelections, resetFlow } = useSubscription();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derive existingUser and subscribedUser states from Context
  const existingUser = user && !user.subscription ? user : null;
  const subscribedUser = user && user.subscription ? user : null;

  const handleLogout = () => {
    resetFlow();
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
  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
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
      setUser(response.user);
      clearSelections(); // clear previous abandoned flow if any
      navigate("/plan");
    } catch (err) {
      // If user already exists, fetch their data and show logged in view
      if (
        err.response?.status === 409 &&
        err.response?.data?.error === "Username already exists"
      ) {
        try {
          const userResponse = await usersApi.getByUsername(userData.username);
          setUser({ ...userResponse.user, subscription: userResponse.subscription });
          clearSelections();
        } catch {
          setError("Failed to fetch user data. Please try again.");
        }
        return;
      }
      // Or if it failed to create user
      setError(
        err.response?.data?.error || "Failed to create user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Render logic continues below...

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
  if (subscribedUser) {
    const { subscription } = subscribedUser;

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
              {subscribedUser.age && (
                <div>
                  <span className="text-gray-500 text-xs">Age</span>
                  <p className="text-white font-medium">
                    {subscribedUser.age} years
                  </p>
                </div>
              )}
              {(subscribedUser.weight || subscribedUser.height) && (
                <div>
                  <span className="text-gray-500 text-xs">Body Stats</span>
                  <p className="text-white font-medium">
                    {subscribedUser.weight && `${subscribedUser.weight} kg`}
                    {subscribedUser.weight && subscribedUser.height && " / "}
                    {subscribedUser.height && `${subscribedUser.height} cm`}
                  </p>
                </div>
              )}
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
                  {subscription.plan_name}
                </p>
                <p className="text-brutal-black/70 text-sm">
                  {formatPrice(subscription.final_price)} {subscription.coupon_code && <span className="ml-1 text-xs">({subscription.coupon_code} Applied)</span>} 
                </p>
              </div>
              <div className="px-3 py-1 bg-accent border-2 border-brutal-black">
                <span className="text-xs font-bold uppercase text-brutal-black">
                  {subscription.status}
                </span>
              </div>
            </div>
          </div>

          {/* Renewal Info */}
          <div className="flex justify-between items-center py-4 px-4 bg-secondary border-2 border-brutal-black">
            <div>
              <span className="text-gray-300 text-xs block">Subscribed On</span>
              <span className="text-white font-bold">
                {formatDate(subscription.created_at)}
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
      </form>
    </div>
  );
}

export default Profile;
