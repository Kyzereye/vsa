import { Routes, Route } from "react-router-dom";
import { Home, ShredVets, EventDetail, PastEvents, Admin, Login, Register, Profile, VerifyEmail, ForgotPassword, ResetPassword, Meetings } from "./pages";
import { ScrollToTop, ProtectedRoute } from "./components";
import "./App.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shredvets" element={<ShredVets />} />
        <Route path="/past-events" element={<PastEvents eventType="vsa" />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/shredvets-past-events" element={<PastEvents eventType="shredvets" />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
