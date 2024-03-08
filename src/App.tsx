import { Route, Routes } from "react-router-dom";
import { Transactions } from "./Components/Transactions";
import Dashboard from "./Components/Dashboard";
import { useState } from "react";

function App() {
  const [user] = useState<any>("Guest");
  /*  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();

  const navigate = useNavigate();

  useEffect(() => {
    setUser("Guest");

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
  }, [navigate, supabase.auth]); */

  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/transactions" element={<Transactions user={user} />} />
        <Route path="*" element={<Dashboard user={user} />} />
      </Routes>
    </>
  );
}

export default App;
