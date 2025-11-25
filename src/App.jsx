import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import EventsPage from "./Pages/Events.jsx";
import CalendarPage from "./Pages/CalendarPage.jsx";
import EventDetailsPage from "./Pages/EventDetailsPage.jsx";
import MyEventsPage from "./Pages/MyEventsPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import GroupsPage from "./Pages/GroupsPage.jsx";

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
            <Route path="/events/:eventId" element={<EventDetailsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/my-events" element={<MyEventsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/groups" element={<GroupsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
