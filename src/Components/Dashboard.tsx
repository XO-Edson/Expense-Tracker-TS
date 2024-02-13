import { useNavigate } from "react-router-dom";
import { useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
  const [user, setUser] = useState<any>("guest");
  const [isLoading, setIsLoading] = useState(true);
  const { supabase, tableData, accExpenses, accIncome, balance } =
    useSupabase();

  console.log(tableData);

  const data = {
    labels: ["Jan 25", "Jan 26", "Jan 27", "Jan 28", "Jan 29", "Jan 30"],
    datasets: [
      {
        label: "Expenses",
        data: [5000, 1000, 2000, 600, 2150, 55],
        borderColor: "#008000",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: "Income",
        data: [5500, 10000, 2000, 200, 150, 505],
        borderColor: "red",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

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

  const totalIncome = accIncome.reduce(
    (sum, obj) => sum + (obj.amount || 0),
    0
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {user /*?  (
        <div className="redirect">
          <h3>User is not logged in</h3>
          <button onClick={() => navigate("/")}>Homepage</button>
        </div>
      )  */ && (
        <main>
          <Sidebar userEmail={user.email} />

          <article>
            <h2>Dashboard</h2>

            {/* Card Feature */}
            <div className="card">
              <h5>Available Balance</h5>

              <h1>$ {balance()}</h1>
              <p>**** 1234</p>
            </div>

            <div className="summary">
              <div className="income">
                <h5>Income</h5>
                <p>$ {totalIncome}</p>
              </div>

              <div className="spendings">
                <h5>Spendings</h5>
                <p>${totalExpenses}</p>
              </div>
            </div>

            <div className="recent-transactions">
              <h4>Recent Transactions</h4>

              <section className="transactions-display">
                {tableData.map((accTransactions, index) => (
                  <ul key={index}>
                    <li>{accTransactions.category}</li>
                    <li>{accTransactions.amount}</li>
                  </ul>
                ))}
              </section>
            </div>
          </article>

          <article>
            <div className="graph">
              <p>GRAPH</p>
              <Line data={data} />
            </div>

            <div className="savingsPlan">
              <h3>Savings Plan</h3>

              <div className="savings-container">
                <div className="savings"></div>
              </div>
            </div>
          </article>
        </main>
      )}
    </>
  );
};

export default Dashboard;
