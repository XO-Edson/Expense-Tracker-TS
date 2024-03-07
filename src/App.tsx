import SignUpUI from "./Components/SignUpUI";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Transactions } from "./Components/Transactions";
import Dashboard from "./Components/Dashboard";
import { useEffect, useState } from "react";
import useSupabase from "./Hooks/useSupabase";

function App() {
  const [user, setUser] = useState<any>();
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
      <Routes>
        <Route path="/" element={<SignUpUI setUser={setUser} />} />

        <Route
          path="/dashboard"
          element={<Dashboard user={user} isLoading={isLoading} />}
        />
        <Route path="/transactions" element={<Transactions user={user} />} />
      </Routes>
    </>
  );
}

export default App;
