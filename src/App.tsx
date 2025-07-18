import React from 'react';
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';

function App() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // If user clicked "Get Started" or wants to authenticate, show auth form
  if (showAuth) {
    return <AuthForm onSuccess={() => setShowAuth(false)} />;
  }

  // Otherwise show landing page
  return (
    <LandingPage onGetStarted={() => setShowAuth(true)} />
  );
}

export default App;