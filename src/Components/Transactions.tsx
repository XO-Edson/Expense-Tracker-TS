import useLocalStorage from "../Hooks/useLocalStorage";
import useSupabase from "../Hooks/useSupabase";
import Sidebar from "./Sidebar";
import TransactionsPopup from "./TransactionsPopup";

import { useEffect } from "react";
import { Savingstype } from "../SupabaseContext/Supabase";
import Header from "./Header";

import Card from "./Card";
import TransactionsTable from "./TransactionsTable";

import { Doughnut } from "react-chartjs-2";

import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

type TransactionsProps = {
  user: any;
};

export const Transactions = ({ user }: TransactionsProps) => {
  const {
    balance,
    togglePopup,
    popup,

    allTransactions,

    setEdit,

    accSavings,
  } = useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue1, setValue } = useLocalStorage(
    "transactions",
    allTransactions,
    "savings",
    initializedAccSavings
  );

  const incomes = storedValue1
    .filter((values) => values.incomeCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  const expenses = storedValue1
    .filter((values) => values.expenseCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  useEffect(() => {
    setValue("transactions", allTransactions);
  }, [allTransactions]);

  useEffect(() => {
    console.log(storedValue1);
  }, [storedValue1]);

  function toggleAddtransaction() {
    togglePopup();
    setEdit(false);
  }

  const data = {
    labels: ["Income", "expense"],
    datasets: [
      {
        label: "Summary",
        data: [incomes, expenses],
        backgroundColor: ["green", "red"],
        borderColor: ["green", "red"],
      },
    ],
  };

  return (
    <main>
      <Header />
      <Sidebar userEmail={user.email || user} />

      <section className="transactions">
        <h2>TRANSACTIONS</h2>
        <button onClick={toggleAddtransaction}>Add Transaction</button>
        {popup && <TransactionsPopup />}

        <h4>Balance: {balance(incomes, expenses)}</h4>

        <div className="transactions-display">
          <TransactionsTable />
        </div>
      </section>

      <section className="transactions-card">
        <Card />
        <div className="doughnut-chart">
          <Doughnut data={data} />
        </div>
      </section>
    </main>
  );
};
