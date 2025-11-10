import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
