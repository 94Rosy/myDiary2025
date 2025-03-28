import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Login from "../components/login/Login";
import Signup from "../components/signup/Signup";
import ResetPassword from "../components/login/ResetPassword";
import MainPage from "../pages/main/MainPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import EmotionBoardPage from "../pages/emotionBoard/EmotionBoardPage";

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
        <Route path="/emotions" element={<EmotionBoardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
