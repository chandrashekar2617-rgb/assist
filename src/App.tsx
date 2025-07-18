import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/useAuthUser';

function App() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // If user is not authenticated, show landing page or auth form
  if (showAuth) {
    return (
      <AuthForm 
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

export default App;