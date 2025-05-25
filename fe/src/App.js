import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { checkApiConnection } from "./utils/util.js";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import EditTransaction from "./pages/EditTransaction";
import FinancialDetail from "./components/FinancialDetail";
import FinancialPlanning from "./components/FinancialPlanning";
import "./App.css";
import Profile from "./components/Profile.js";
import Categories from "./components/Categories.js";

function App() {
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkApiConnection();
      setIsApiConnected(connected);
      setIsLoading(false);
    };

    checkConnection();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isApiConnected) {
    return (
      <div>
        Cannot connect to API. Please make sure the backend server is running on
        port 5001.
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit/:id" element={<EditTransaction />} />
        <Route path="/detail" element={<FinancialDetail />} />
        <Route path="/planning" element={<FinancialPlanning />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/categories" element={<Categories/>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
