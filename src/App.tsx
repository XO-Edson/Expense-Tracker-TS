import SignUpUI from "./Components/SignUpUI";
import { Route, Routes } from "react-router-dom";
import { Transactions } from "./Components/Transactions";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpUI />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </>
  );
}

export default App;
