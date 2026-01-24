import { BrowserRouter as Router, Routes, Route } from "react-router";
import FileManager from "./pages/FileManager";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

// Qall Pages
import Integrations from "./pages/Integrations";
import ApiKeys from "./pages/ApiKeys";
import Calls from "./pages/Calls";
import Call from "./pages/Call";
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
          {/* Dashboard Layout */}

          <Route element={<AppLayout />}>
            {/* Qall Layout */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/assistants" element={<Assistants />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/phonenumbers" element={<PhoneNumbers />} />
            <Route path="/organization" element={<Organizations />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/files" element={<FileManager />} />
            <Route path="/apikeys" element={<ApiKeys />} />
            <Route path="/call" element={<Call />} />
            <Route path="/assistant" element={<Assistant />} />
          </Route>  
        </Routes>
      </Router>
    </>
  );
}
