import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import FaceExpression from "./component/FaceExpression";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/mood-scan"   element={<FaceExpression />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
