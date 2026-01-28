import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";

import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Assistants from "./pages/Assistants";
import Assistant from "./pages/Assistant";
import Calls from "./pages/Calls";
import Call from "./pages/Call";
import CallDetail from "./pages/CallDetail";
import PhoneNumbers from "./pages/PhoneNumbers";
import Organizations from "./pages/Organization";
import Profile from "./pages/Profile";
import Integrations from "./pages/Integrations";
import FileManager from "./pages/FileManager";
import ApiKeys from "./pages/ApiKeys";

// Auth pages you already have
import SignIn from "./pages/authPages/SignIn";
import SignUp from "./pages/authPages/SignUp";
import Logout from "./pages/authPages/Logout";

// Guards + logout route component (create below)
import { RequireAuth, RequireGuest } from "./services/auth/routeGuards";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Public (guest-only) */}
        <Route
          path="/signin"
          element={
            <RequireGuest>
              <SignIn />
            </RequireGuest>
          }
        />
        <Route
          path="/signup"
          element={
            <RequireGuest>
              <SignUp />
            </RequireGuest>
          }
        />

        {/* Logout (can be used by anyone; it will clear session then redirect) */}
        <Route path="/logout" element={<Logout />} />

        {/* Protected app */}
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/assistants" element={<Assistants />} />
          <Route path="/assistants/new" element={<Assistant />} />
          <Route path="/assistants/:id" element={<Assistant />} />
          <Route path="/assistant" element={<Assistant />} />

          <Route path="/calls" element={<Calls />} />
          <Route path="/call/:id" element={<CallDetail />} />
          <Route path="/call" element={<Call />} />

          <Route path="/phonenumbers" element={<PhoneNumbers />} />
          <Route path="/organization" element={<Organizations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/files" element={<FileManager />} />
          <Route path="/apikeys" element={<ApiKeys />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}