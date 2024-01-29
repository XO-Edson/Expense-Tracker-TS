import { useNavigate } from "react-router-dom";
import { useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { supabase, income, accExpenses, balance } = useSupabase();

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

  const totalExpenses = accExpenses.reduce(
    (sum, obj) => sum + (obj.amount || 0),
    0
  );

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
        <main>
          <Sidebar userEmail={user.email} />

          <article>
            <h2>Dashboard</h2>
            <p>hahahha</p>

            {/* Card Feature */}
            <div className="card">
              <h5>Available Balance</h5>

              <h1>$ {balance()}</h1>
              <p>**** 1234</p>
            </div>

            <div className="summary">
              <div className="income">
                <h5>Income</h5>
                <p>$ {income.amount}</p>
              </div>

              <div className="spendings">
                <h5>Spendings</h5>
                <p>${totalExpenses}</p>
              </div>
            </div>

            <div className="recent-transactions">
              <h4>Recent Transactions</h4>

              <section className="transactions-display">
                {accExpenses.map((accEx, index) => (
                  <ul key={index}>
                    <li>{accEx.expenseCategory}</li>
                    <li>{accEx.amount}</li>
                  </ul>
                ))}
              </section>
            </div>
          </article>

          <article>
            <div>
              <p>GRAPH</p>
            </div>
          </article>
        </main>
      )}
    </>
  );
};

export default Dashboard;
