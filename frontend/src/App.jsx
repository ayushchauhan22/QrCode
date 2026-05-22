import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import AdminScanner from './pages/AdminScanner'
import { AuthRoute } from './components/AuthRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute mode="protected">
              <Home />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute mode="guest">
              <Login />
            </AuthRoute>
          }
        />
        <Route 
          path="/signup" 
          element={
            <Signup />
          } 
        />
        <Route
          path="/admin"
          element={
            <AuthRoute mode="admin">
              <AdminScanner />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
