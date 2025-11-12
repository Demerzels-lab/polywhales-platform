import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Landing page for guest users, Dashboard for authenticated users
  return user ? <Dashboard /> : <Landing onShowAuth={() => {}} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
