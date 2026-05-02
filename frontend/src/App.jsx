import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./Pages/Home";
// import FaceExpression from "./component/FaceExpression";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/mood-scan" element={<FaceExpression />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;