import { useNavigate } from "react-router-dom";
import { useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";
import { Line } from "react-chartjs-2";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import SavingsPopup from "./SavingsPopup";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

type DashboardProps = {
  user: any;
  isLoading: boolean;
};

const Dashboard = ({ user, isLoading }: DashboardProps) => {
  const {
    tableData,
    accExpenses,
    accIncome,
    balance,
    togglePopup,
    popup,
    accSavings,
  } = useSupabase();

  console.log(accSavings);

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

            {/* Card Column */}
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
                {tableData.map((accTransactions: any, index: number) => (
                  <ul key={index}>
                    <li>{accTransactions.category}</li>
                    <li>{accTransactions.amount}</li>
                    <li>
                      {new Date(accTransactions.date).toLocaleDateString()}
                    </li>
                  </ul>
                ))}
              </section>
            </div>
          </article>

          {/* Graph column */}
          <article className="graph-column">
            <div className="graph">
              <p>GRAPH</p>
              <Line data={data} />
            </div>

            <h3>Savings Plan</h3>
            {popup && <SavingsPopup />}

            <div className="savings-container">
              <button onClick={togglePopup}>+</button>
              {accSavings?.map((savings) => (
                <div className="savings">
                  <h4>{savings.category}</h4>
                  <p>DEPOSIT: {savings.depositAmount}</p>
                  <p>TARGET: {savings.targetAmount}</p>

                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width:
                          savings.depositAmount && savings.targetAmount
                            ? `${
                                (savings.depositAmount / savings.targetAmount) *
                                100
                              }%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </main>
      )}
    </>
  );
};

export default Dashboard;
