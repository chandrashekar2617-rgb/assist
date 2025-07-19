import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user.name}!</h1>
          <p className="text-gray-600 mb-6">You are successfully logged in.</p>
          <button
            onClick={() => {
              import('firebase/auth').then(({ signOut }) => {
                signOut(import('./firebase/config').then(m => m.auth));
              });
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
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