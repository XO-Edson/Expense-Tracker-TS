import { useNavigate } from "react-router-dom";
import useLocalStorage from "../Hooks/useLocalStorage";
import useSupabase from "../Hooks/useSupabase";
import Sidebar from "./Sidebar";
import { Line } from "react-chartjs-2";
import SavingsPopup from "./SavingsPopup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";

import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Savingstype } from "../SupabaseContext/Supabase";
import { useEffect } from "react";
import Header from "./Header";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

type DashboardProps = {
  user: any;
  isLoading: boolean;
};

const Dashboard = ({ user, isLoading }: DashboardProps) => {
  const {
    balance,
    togglePopup,
    popup,
    accSavings,
    allTransactions,
    setEdit,
    setEditSavings,
  } = useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue1, storedValue2, setValue, removeItem } = useLocalStorage(
    "transactions",
    allTransactions,
    "savings",
    initializedAccSavings
  );

  function toggleAddSavings() {
    togglePopup();
    setEdit(false);
  }

  useEffect(() => {
    setValue("savings", initializedAccSavings);
    console.log(storedValue1);
  }, [accSavings]);

  const incomes = storedValue1
    .filter((values) => values.incomeCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  const expenses = storedValue1
    .filter((values) => values.expenseCategory)
    .reduce((total, obj) => total + obj.amount, 0);

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

  function handleEditPopup(entryId: any) {
    const selectedEntry = storedValue2.find(
      (value: { id: any }) => value.id === entryId
    );

    if (selectedEntry) {
      console.log(selectedEntry);

      setEditSavings({ ...selectedEntry });

      togglePopup();
    }
  }

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
          <Header />
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

            <div className="savings-container">
              <div>
                <button className="add-btn" onClick={toggleAddSavings}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              {storedValue2?.map((savings, index) => (
                <div key={index} className="savings">
                  <div className="savings-header">
                    <h3>{savings.category}</h3>
                    <button onClick={() => handleEditPopup(savings.id)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  </div>

                  <div className="savings-body">
                    <div>
                      <p>DEPOSIT: {savings.depositAmount}</p>
                      <p>TARGET: {savings.targetAmount}</p>

                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width:
                              savings.depositAmount && savings.targetAmount
                                ? `${
                                    (savings.depositAmount /
                                      savings.targetAmount) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        ></div>
                        <h4>
                          {savings.depositAmount && savings.targetAmount
                            ? Math.round(
                                (savings.depositAmount / savings.targetAmount) *
                                  100
                              )
                            : 0}
                          %
                        </h4>
                      </div>
                    </div>

                    <div>
                      <button onClick={() => removeItem("savings", savings.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
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
