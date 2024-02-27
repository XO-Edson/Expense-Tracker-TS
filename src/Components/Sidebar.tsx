import { useNavigate } from "react-router-dom";
import useSupabase from "../Hooks/useSupabase";

type DashboardHeaderProps = {
  userEmail: string;
};

const Sidebar = ({ userEmail }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { supabase } = useSupabase();

  const logOut = () => {
    supabase.auth.signOut();
    navigate("/");
  };

  return (
    <section className="sidebar">
      <div className="email-info">
        <div>
          <p>{userEmail}</p>
        </div>
        <div className="navigation">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/transactions")}>
            Transactions
          </button>
          <button onClick={() => navigate("/statistics")}>Statistics</button>
        </div>

        <button onClick={logOut}>Log Out</button>
      </div>
    </section>
  );
};

export default Sidebar;
