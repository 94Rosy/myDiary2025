import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ResetPassword from "../components/ResetPassword";
import MainPage from "../pages/main/MainPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import EmotionBoardPage from "../pages/emotionBoard/EmotionBoardPage";
import ContactBoardPage from "../pages/contact/ContactBoardPage";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/emotionList" element={<EmotionBoardPage />} />
        <Route path="/contact" element={<ContactBoardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
