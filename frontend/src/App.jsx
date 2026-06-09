import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DelegadoDashboard from './pages/DelegadoDashboard';
import HabitanteDashboard from './pages/HabitanteDashboard';
import Habitantes from './pages/Habitantes';
import Tareas from './pages/Tareas';
import Multas from './pages/Multas';
import Pagos from './pages/Pagos';
import QRScanner from './pages/QRScanner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas del Delegado */}
              <Route 
                path="/delegado/dashboard" 
                element={
                  <ProtectedRoute requiredRole="delegado">
                    <DelegadoDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/delegado/habitantes" 
                element={
                  <ProtectedRoute requiredRole="delegado">
                    <Habitantes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/delegado/tareas" 
                element={
                  <ProtectedRoute requiredRole="delegado">
                    <Tareas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/delegado/multas" 
                element={
                  <ProtectedRoute requiredRole="delegado">
                    <Multas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/delegado/pagos" 
                element={
                  <ProtectedRoute requiredRole="delegado">
                    <Pagos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/delegado/scanner" 
                element={
                  <ProtectedRoute requiredRole="delegado">
                    <QRScanner />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas del Habitante */}
              <Route 
                path="/habitante/dashboard" 
                element={
                  <ProtectedRoute requiredRole="habitante">
                    <HabitanteDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
