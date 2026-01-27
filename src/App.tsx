// src/App.tsx (update)
import { BrowserRouter as Router, Routes, Route } from "react-router";
import FileManager from "./pages/FileManager";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Integrations from "./pages/Integrations";
import ApiKeys from "./pages/ApiKeys";
import Calls from "./pages/Calls";
import Call from "./pages/Call";
import CallDetail from "./pages/CallDetail";
import PhoneNumbers from "./pages/PhoneNumbers";
import Assistants from "./pages/Assistants";
import Organizations from "./pages/Organization";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant"
import Profile from "./pages/Profile";

export default function App() {
  return (
      <>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assistants" element={<Assistants />} />

              <Route path="/calls" element={<Calls />} />
              <Route path="/call/:id" element={<CallDetail />} /> {/* Individual call detail */}
              <Route path="/call" element={<Call />} /> {/* Analytics page */}

              <Route path="/phonenumbers" element={<PhoneNumbers />} />
              <Route path="/organization" element={<Organizations />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/files" element={<FileManager />} />
              <Route path="/apikeys" element={<ApiKeys />} />

              <Route path="/assistant" element={<Assistant />} />
              <Route path="/assistants/new" element={<Assistant />} />
              <Route path="/assistants/:id" element={<Assistant />} />
            </Route>
          </Routes>
        </Router>
      </>
  );
}