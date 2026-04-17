import Navbar from "../components/Navbar";
import VideoCapture from "../components/VideoCapture";

function Dashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1c3d7a 0%, #0b1228 45%, #040814 100%)",
        color: "#ffffff",
      }}
    >
      <Navbar />
      <VideoCapture />
    </main>
  );
}

export default Dashboard;
