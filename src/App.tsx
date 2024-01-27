import SignUpUI from "./Components/SignUpUI";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Transactions } from "./Components/Transactions";
import { useSupabase } from "./Supabase/Supabase";
import { useEffect, useState } from "react";

import Dashboard from "./Components/Dashboard";

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
          console.log("User data:", data.user);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [navigate, supabase.auth]);

  const logOut = () => {
    supabase.auth.signOut();
    navigate("/");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <section className="sidebar">
        <div className="email-info">
          <div>
            <h2>Dashboard</h2>
            <p>{user.email}</p>
          </div>

          <div className="navigation">
            <button onClick={() => navigate("/transactions")}>
              Transactions
            </button>
          </div>

          <button onClick={logOut}>Log Out</button>
        </div>
      </section>

      {!user ? (
        <div className="redirect">
          <h3>User is not logged in</h3>
          <button onClick={() => navigate("/")}>Homepage</button>
        </div>
      ) : (
        <Dashboard />
      )}

      <main>
        <Routes>
          <Route path="/" element={<SignUpUI />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
