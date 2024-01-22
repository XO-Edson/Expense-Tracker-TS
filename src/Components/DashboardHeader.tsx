import { useNavigate } from "react-router-dom";
import { useSupabase } from "../Supabase/Supabase";

type DashboardHeaderProps = {
  userEmail: string;
};

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const logOut = () => {
    supabase.auth.signOut();
    navigate("/");
  };
  return (
    <header>
      <h2>Dashboard</h2>
      <div className="email-info">
        <p>{userEmail}</p>
        <button onClick={logOut}>Log Out</button>
      </div>
    </header>
  );
};

export default DashboardHeader;
