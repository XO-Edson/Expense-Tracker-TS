import { useNavigate } from "react-router-dom";
import useLocalStorage from "../Hooks/useLocalStorage";
import useSupabase from "../Hooks/useSupabase";
import Sidebar from "./Sidebar";
import { Line } from "react-chartjs-2";
import SavingsPopup from "./SavingsPopup";

import { Savingstype } from "../SupabaseContext/Supabase";
import { useEffect } from "react";
import Header from "./Header";
import Card from "./Card";
import SavingsPlan from "./SavingsPlan";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

type DashboardProps = {
  user: any;
  //isLoading: boolean;
};

const Dashboard = ({ user /* isLoading */ }: DashboardProps) => {
  const { popup, accSavings, allTransactions } = useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue1, setValue } = useLocalStorage(
    "transactions",
    allTransactions,
    "savings",
    initializedAccSavings
  );

  useEffect(() => {
    setValue("savings", initializedAccSavings);
  }, [accSavings]);

  const formatDate = (date: Date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
    return formattedDate;
  };

  const formattedLabels = storedValue1.map((transactions) =>
    formatDate(transactions.date)
  );

  const data = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Expenses",
        data: storedValue1
          .filter((expense) => {
            return expense.expenseCategory;
          })
          .map((obj) => obj.amount),
        borderColor: "red",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: "Income",
        data: storedValue1
          .filter((income) => {
            return income.incomeCategory;
          })
          .map((obj) => obj.amount),
        borderColor: "#008000",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  const navigate = useNavigate();

  const filterIncomes = storedValue1.filter(
    (incomes) => incomes.incomeCategory
  );

  const filterExpenses = storedValue1.filter(
    (expense) => expense.expenseCategory
  );

  const totalExpenses = filterExpenses.reduce(
    (sum, obj) => sum + (obj.amount || 0),
    0
  );

  const totalIncome = filterIncomes.reduce(
    (sum, obj) => sum + (obj.amount || 0),
    0
  );

  const reversedArray = storedValue1.reverse();

  /*  if (isLoading) {
    return <p>Loading...</p>;
  }
 */
  return (
    <>
      {!user ? (
        <div className="redirect">
          <h3>User is not logged in</h3>
          <button onClick={() => navigate("/")}>Homepage</button>
        </div>
      ) : (
        <main>
          <Header />
          <Sidebar userEmail={user.email || user} />

          <article>
            <h2>Dashboard</h2>

            {/* Card Column */}
            <Card />

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

              <section className="transactions-display-dashboard">
                {reversedArray.map((accTransactions: any, index: number) => (
                  <ul key={index}>
                    <li>
                      {accTransactions.incomeCategory ||
                        accTransactions.expenseCategory}
                    </li>
                    <li>
                      {accTransactions.incomeCategory
                        ? `+${accTransactions.amount}`
                        : `-${accTransactions.amount}`}
                    </li>
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
              <h5>GRAPH</h5>
              <Line
                data={data}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                }}
              />
            </div>

            <h3 className="heading">Savings Plan</h3>
            {popup && <SavingsPopup />}

            <div>
              <SavingsPlan />
            </div>
          </article>
        </main>
      )}
    </>
  );
};

export default Dashboard;
