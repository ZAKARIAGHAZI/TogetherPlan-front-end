import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import EventsPage from "./Pages/Events.jsx";
import CalendarPage from "./Pages/Calendar.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="events" element={<EventsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
