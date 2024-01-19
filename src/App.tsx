import Dashboard from "./Components/Dashboard";
import SignUpUI from "./Components/SignUpUI";
import { Route, Routes } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";

function App() {
  return (
    <div>
      <h1>Welcome</h1>
      <Routes>
        <Route path="/" element={<SignUpUI />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
