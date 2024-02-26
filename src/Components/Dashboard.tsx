import { useNavigate } from "react-router-dom";
import { useLocalStorage, useSupabase } from "../SupabaseContext/Supabase";
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
    accExpenses,
    accIncome,
    balance,
    togglePopup,
    popup,
    accSavings,
    allTransactions,
  } = useSupabase();

  const { storedValue } = useLocalStorage("transactions", allTransactions);

  const incomes = storedValue
    .filter((values) => values.incomeCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  const expenses = storedValue
    .filter((values) => values.expenseCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  console.log(incomes);
  console.log(expenses);

  const formatDate = (date: Date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
    return formattedDate;
  };

  const formattedLabels = allTransactions.map((transactions) =>
    formatDate(transactions.date)
  );

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Expenses",
        data: accExpenses
          .filter((expense) => typeof expense.amount === "number")
          .map((expense) => expense.amount),
        borderColor: "#008000",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: "Income",
        data: accIncome
          .filter((income) => typeof income.amount === "number")
          .map((income) => income.amount),
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

              <h1>$ {balance(incomes, expenses)}</h1>
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
                {storedValue.map((accTransactions: any, index: number) => (
                  <ul key={index}>
                    <li>
                      {accTransactions.incomeCategory ||
                        accTransactions.expenseCategory}
                    </li>
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
                    <h4>
                      {savings.depositAmount && savings.targetAmount
                        ? Math.round(
                            (savings.depositAmount / savings.targetAmount) * 100
                          )
                        : 0}
                      %
                    </h4>
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
