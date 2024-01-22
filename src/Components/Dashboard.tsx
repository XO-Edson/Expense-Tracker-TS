import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../Supabase/Supabase";
import DashboardHeader from "./DashboardHeader";

const Dashboard = () => {
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

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {!user ? (
        <div className="redirect">
          <h3>User is not logged in</h3>
          <button onClick={() => navigate("/")}>Homepage</button>
        </div>
      ) : (
        <DashboardHeader userEmail={user.email} />
      )}
    </>
  );
};

export default Dashboard;
