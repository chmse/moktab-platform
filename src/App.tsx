import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProfessorsPage from './pages/ProfessorsPage';
import ProfessorProfilePage from './pages/ProfessorProfilePage';
import ScientificWorksPage from './pages/ScientificWorksPage';
import WorkDetailPage from './pages/WorkDetailPage';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentsPage from './pages/StudentsPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterProfessorPage from './pages/RegisterProfessorPage';
import RegisterStudentPage from './pages/RegisterStudentPage';
import CommunityPage from './pages/CommunityPage';
import TopicDetail from './pages/TopicDetail';
import AdminConsole from './pages/AdminConsole';

import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'professor' | 'student' }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)' }}>
      <p style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>جاري التحقق من الوصول...</p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (role && profile?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface)' }}>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="professors" element={<ProfessorsPage />} />
          <Route path="professors/:id" element={<ProfessorProfilePage />} />
          <Route path="works" element={<ScientificWorksPage />} />
          <Route path="works/:id" element={<WorkDetailPage />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute role="professor">
                <ProfessorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="students" element={<StudentsPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/:id" element={<TopicDetail />} />
          <Route path="about" element={<AboutPage />} />

          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <AdminConsole />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/professor" element={<RegisterProfessorPage />} />
        <Route path="/register/student" element={<RegisterStudentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
