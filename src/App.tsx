import SignUpUI from "./Components/SignUpUI";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Transactions } from "./Components/Transactions";
import Dashboard from "./Components/Dashboard";
import { useEffect, useState } from "react";
import useSupabase from "./Hooks/useSupabase";
import Header from "./Components/Header";

function App() {
  const [user, setUser] = useState<any>("h");
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user data:", error);
        } else if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [navigate, supabase.auth]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SignUpUI />} />

        <Route
          path="/dashboard"
          element={<Dashboard user={user} isLoading={isLoading} />}
        />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </>
  );
}

export default App;
