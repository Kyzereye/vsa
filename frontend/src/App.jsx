import { Routes, Route } from "react-router-dom";
import { Home, AboutPage, ProgramsPage, NewsPage, GalleryPage, ShredVets, VsaPA, VsaPATraining, VsaPAMeetings, EventDetail, Events, VsaPAEvents, PastEvents, Admin, Login, Register, Profile, VerifyEmail, ForgotPassword, ResetPassword, Meetings, Membership, Training, MeetInstructors, Leadership } from "./pages";
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
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/past-events" element={<PastEvents eventType="vsa" />} />
        <Route path="/shredvets-past-events" element={<PastEvents eventType="shredvets" />} />
        <Route path="/vsa-pa-past-events" element={<PastEvents eventType="vsaPA" />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        <Route path="/shredvets" element={<ProtectedRoute><ShredVets /></ProtectedRoute>} />
        <Route path="/vsa-pa" element={<ProtectedRoute><VsaPA /></ProtectedRoute>} />
        <Route path="/vsa-pa-events" element={<ProtectedRoute><VsaPAEvents /></ProtectedRoute>} />
        <Route path="/vsa-pa-training" element={<ProtectedRoute><VsaPATraining /></ProtectedRoute>} />
        <Route path="/vsa-pa-meetings" element={<ProtectedRoute><VsaPAMeetings /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
        <Route path="/training/instructors" element={<ProtectedRoute><MeetInstructors /></ProtectedRoute>} />
        <Route path="/leadership" element={<ProtectedRoute><Leadership /></ProtectedRoute>} />
        <Route path="/meetings" element={<ProtectedRoute><Meetings /></ProtectedRoute>} />
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
