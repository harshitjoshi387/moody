import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import VideoCapture from "../components/VideoCapture";
import { clearSessionUser, getSessionUser } from "../utils/devAuth";
import DashboardUI from "./DashboardUI"; // ✅ NEW

function Dashboard() {
  const navigate = useNavigate();
  const user = getSessionUser();

  const handleLogout = () => {
    clearSessionUser();
    navigate("/login");
  };

  return (
    <main className="dashboard-page">
      <Navbar user={user} onLogout={handleLogout} />

      {/* 👇 Yeh tumhara UI */}
      <DashboardUI />

      {/* 👇 Yeh tumhara camera */}
      <VideoCapture />
    </main>
  );
}

export default Dashboard;