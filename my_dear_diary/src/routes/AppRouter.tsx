import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import MainPage from "../pages/MainPage";
import DashboardPage from "../pages/DashboardPage";
import EmotionBoardPage from "../pages/EmotionBoardPage";
import ContactBoardPage from "../pages/ContactBoardPage";

const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/emotionList" element={<EmotionBoardPage />} />
        <Route path="/contact" element={<ContactBoardPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
