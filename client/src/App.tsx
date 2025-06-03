import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import {AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { UiProvider } from './contexts/UiContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Households from './pages/Households';
import NewHousehold from './pages/NewHousehold';
import EditHousehold from './pages/EditHousehold';
import NewPerson from './pages/NewPerson';
import EditPerson from './pages/EditPerson';
import PersonDetails from './pages/PersonDetails';
import HouseholdDetails from './pages/HouseholdDetails';
import Surveyors from './pages/Surveyors';
import Interviews from './pages/Interviews';
import Users from './pages/Users';
import Persons from './pages/Persons';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordForm from './pages/ResetPasswordForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <UiProvider>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPasswordForm />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="households" element={<Households />} />
                  <Route path="households/new" element={<ProtectedRoute requireAdmin={true}><NewHousehold /></ProtectedRoute>} />
                  <Route path="households/:id" element={<HouseholdDetails />} />
                  <Route path="households/:id/edit" element={<ProtectedRoute requireAdmin={true}><EditHousehold /></ProtectedRoute>} />
                  <Route path="households/:id/persons/new" element={<ProtectedRoute requireAdmin={true}><NewPerson /></ProtectedRoute>} />
                  <Route path="persons" element={<Persons />} />
                  <Route path="persons/:id" element={<PersonDetails />} />
                  <Route path="persons/:id/edit" element={<ProtectedRoute requireAdmin={true}><EditPerson /></ProtectedRoute>} />
                  <Route path="surveyors" element={<ProtectedRoute requireAdmin={true}><Surveyors /></ProtectedRoute>} />
                  <Route path="interviews" element={<ProtectedRoute requireAdmin={true}><Interviews /></ProtectedRoute>} />
                  <Route path="users" element={<ProtectedRoute requireAdmin={true}><Users /></ProtectedRoute>} />
                </Route>
              </Routes>
            </AnimatePresence>
          </UiProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;