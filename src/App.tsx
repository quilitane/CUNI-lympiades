import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/CUNI-lympiades/admin" element={<AdminPage />} />
          <Route path="/CUNI-lympiades/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/UNI-lympiades/" />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
