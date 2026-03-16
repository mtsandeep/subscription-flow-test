import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Profile from './pages/Profile';
import Plan from './pages/Plan';
import Coupon from './pages/Coupon';
import Summary from './pages/Summary';

const steps = [
  { path: '/profile', label: 'Profile' },
  { path: '/plan', label: 'Plan' },
  { path: '/coupon', label: 'Coupon' },
  { path: '/summary', label: 'Summary' },
];

function ProgressIndicator() {
  const location = useLocation();
  const currentStep = steps.findIndex(s => s.path === location.pathname);

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.path} className="flex items-center">
          {/* Step Circle */}
          <div
            className={`w-10 h-10 flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              index <= currentStep
                ? 'bg-primary text-brutal-black border-2 border-brutal-black outline outline-2 outline-white/30 outline-offset-[-4px]'
                : 'bg-dark text-gray-500 border-2 border-gray-500'
            }`}
          >
            {index + 1}
          </div>

          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-1 transition-all duration-300 ${
                index < currentStep ? 'bg-primary border-y border-brutal-black/50' : 'bg-dark border-y border-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-dark-darkest">
      {/* Stylish Header */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-secondary rounded-full blur-3xl" />
        </div>

        {/* Main Header Content */}
        <div className="relative border-b-4 border-brutal-black bg-dark">
          <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-2">
              {/* Decorative Box */}
              <div className="w-10 h-10 bg-primary border-2 border-brutal-black shadow-brutal-sm flex items-center justify-center">
                <span className="text-brutal-black font-bold text-lg">EG</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  <span className="text-primary">Eazy</span>
                  <span className="text-secondary">Gym</span>
                  <span className="text-white"> Subscribe</span>
                </h1>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-sm ml-13 pl-0.5">
              Your fitness journey starts here in 4 simple steps
            </p>

            {/* Decorative Line */}
            <div className="flex gap-1 mt-4">
              <div className="h-1 w-12 bg-primary" />
              <div className="h-1 w-8 bg-secondary" />
              <div className="h-1 w-4 bg-accent" />
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <ProgressIndicator />
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/coupon" element={<Coupon />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
