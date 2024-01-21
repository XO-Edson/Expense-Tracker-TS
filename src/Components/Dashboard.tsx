import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../Supabase/Supabase";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const logOut = () => {
    supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user data:", error);
          navigate("/");
        } else if (data?.user) {
          setUser(data.user);
          console.log("User data:", data.user);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    getUserData();
  }, [navigate, supabase.auth]);

  console.log(user);

  return (
    <>
      {Object.keys(user).length !== 0 ? (
        <>
          <div>Dashboard</div>
          <button onClick={logOut}>Log Out</button>
        </>
      ) : (
        <>
          <h1>User is not logged in</h1>
          <button
            onClick={() => {
              navigate("/");
            }}
          >
            Homepage
          </button>
        </>
      )}
    </>
  );
};

export default Dashboard;
