
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

const Home = () => {
  return (
    <div className="home-page">
      <h1>Good Chai Makes Every Day Better.</h1>
      <p>Freshly Brewed. Just for You.</p>

      <div className="home-actions">
        <Link to="/register">Create Account</Link>
        <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
