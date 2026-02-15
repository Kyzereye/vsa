import { Routes, Route } from "react-router-dom";
import { Home, AboutPage, ProgramsPage, NewsPage, GalleryPage, ShredVets, VsaPA, VsaPATraining, VsaPAMeetings, EventDetail, Events, VsaPAEvents, PastEvents, Admin, Login, Register, Profile, VerifyEmail, ForgotPassword, ResetPassword, Meetings, Membership, Training } from "./pages";
import { ScrollToTop, ProtectedRoute } from "./components";
import "./App.css";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/shredvets" element={<ShredVets />} />
        <Route path="/vsa-pa" element={<VsaPA />} />
        <Route path="/vsa-pa-events" element={<VsaPAEvents />} />
        <Route path="/vsa-pa-training" element={<VsaPATraining />} />
        <Route path="/vsa-pa-meetings" element={<VsaPAMeetings />} />
        <Route path="/events" element={<Events />} />
        <Route path="/past-events" element={<PastEvents eventType="vsa" />} />
        <Route path="/training" element={<Training />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/shredvets-past-events" element={<PastEvents eventType="shredvets" />} />
        <Route path="/vsa-pa-past-events" element={<PastEvents eventType="vsaPA" />} />
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
