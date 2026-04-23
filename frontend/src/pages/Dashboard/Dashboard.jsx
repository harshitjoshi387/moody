import { useNavigate } from "react-router-dom";
import Navbar from "../../components/dashboard/Navbar";
import VideoCapture from "../../components/dashboard/VideoCapture";
import { clearSessionUser, getSessionUser } from "../../utils/devAuth";
import DashboardUi from "./DashboardUi";

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
      <DashboardUi />
      <VideoCapture />
    </main>
  );
}

export default Dashboard;
