import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
// Import components
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/dashboard/Profile';
import GlucometryForm from './components/glucometry/GlucometryForm';
import GlucometryRecords from './components/glucometry/GlucometryRecords';
import MedicalExams from './components/exams/MedicalExams';
import Recipes from './components/recipes/Recipes';
import RecipeManagement from './components/recipes/RecipeManagement';
import AdminPanel from './components/admin/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 pb-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/glucometry/form" element={
                <ProtectedRoute>
                  <GlucometryForm />
                </ProtectedRoute>
              } />
              <Route path="/glucometry/records" element={
                <ProtectedRoute>
                  <GlucometryRecords />
                </ProtectedRoute>
              } />
              <Route path="/exams" element={
                <ProtectedRoute>
                  <MedicalExams />
                </ProtectedRoute>
              } />
              <Route path="/recipes" element={<Recipes />} />

              {/* Editor/Admin routes */}
              <Route path="/recipes/manage" element={
                <ProtectedRoute requiredRoles={['editor', 'admin']}>
                  <RecipeManagement />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
