// src/App.tsx (update)
import { BrowserRouter as Router, Routes, Route } from "react-router";
import FileManager from "./pages/FileManager";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Qall Pages
import Integrations from "./pages/Integrations";
import ApiKeys from "./pages/ApiKeys";
import Calls from "./pages/Calls";
import Call from "./pages/Call";
import CallDetail from "./pages/CallDetail"; // Add this new page
import PhoneNumbers from "./pages/PhoneNumbers";
import Assistants from "./pages/Assistants";
import Organizations from "./pages/Organization";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant"

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
              <Route path="/call/:id" element={<CallDetail />} /> {/* New route */}
              <Route path="/call" element={<Call />} />
              <Route path="/phonenumbers" element={<PhoneNumbers />} />
              <Route path="/organization" element={<Organizations />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/files" element={<FileManager />} />
              <Route path="/apikeys" element={<ApiKeys />} />
              <Route path="/assistant" element={<Assistant />} />
            </Route>
          </Routes>
        </Router>
      </>
  );
}