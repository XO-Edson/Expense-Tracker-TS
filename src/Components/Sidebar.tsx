import { useNavigate } from "react-router-dom";

type DashboardHeaderProps = {
  userEmail: string;
};

const Sidebar = ({ userEmail }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const logOut = () => {
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
        </div>

        <button onClick={logOut}>Log Out</button>
      </div>
    </section>
  );
};

export default Sidebar;
