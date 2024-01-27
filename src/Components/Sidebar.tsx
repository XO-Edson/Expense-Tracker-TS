import { useNavigate } from "react-router-dom";
import { useSupabase } from "../Supabase/Supabase";

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
          <h2>Dashboard</h2>
          <p>{userEmail}</p>
        </div>

        <div className="navigation">
          <button onClick={() => navigate("/transactions")}>
            Transactions
          </button>
        </div>

        <button onClick={logOut}>Log Out</button>
      </div>
    </section>
  );
};

export default Sidebar;
