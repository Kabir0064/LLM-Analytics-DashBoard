import React from 'react';
import { useAuth } from 'react-oidc-context';
import Dashboard from './pages/Dashboard';
import AppLayout from './components/layout/AppLayout';

function App() {
  const auth = useAuth();

  if (auth.isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (auth.error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {auth.error.message}</div>;

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">LLM Analytics Dashboard</h1>
        <button
          onClick={() => auth.signinRedirect({ extraQueryParams: { prompt: 'login' } })}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Sign in with Cognito
        </button>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <div className="font-semibold text-lg">Welcome, {auth.user?.profile?.email}</div>
        <button
          onClick={() => auth.removeUser()}
          className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
        >
          Sign out
        </button>
      </div>
      <Dashboard />
    </AppLayout>
  );
}

export default App;

// import Dashboard from './pages/Dashboard';
// import AppLayout from './components/layout/AppLayout';

// function App() {
//   try {
//     return (
//       <AppLayout>
//         <Dashboard />
//       </AppLayout>
//     );
//   } catch (error) {
//     return (
//       <div style={{ padding: '20px', color: 'red' }}>
//         <h1>Error in App</h1>
//         <pre>{error.toString()}</pre>
//       </div>
//     );
//   }
// }

// export default App;