import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { SingUp } from "./components/SingUp";
import { Home } from "./container/Home";

function App() {
  return (
    <div className="bg-base-200">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<SingUp />} />
      </Routes>
    </div>
  );
}

export default App;