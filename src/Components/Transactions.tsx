import { useState } from "react";
import { useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";

export const Transactions = () => {
  const {
    income,
    expense,
    balance,
    setIncome,
    setExpense,
    addExp,
    allTransactions,
  } = useSupabase();

  console.log(allTransactions);

  const [popup, setPopup] = useState(false);

  function onClose() {
    setPopup((prev) => !prev);
  }

  return (
    <main>
      <Sidebar userEmail={""} />
      <section>
        <h2>TRANSACTIONS</h2>

        <div className="input-fields-background">
          <article className="input-fields">
            <h4>
              Total Income:
              <input
                type="number"
                value={income.amount || ""}
                onChange={(e) => {
                  setIncome({
                    ...income,
                    amount: parseInt(e.target.value, 10),
                  });
                }}
              />
            </h4>

            <h3>
              IncomeType:
              <input
                type="text"
                value={income.category || ""}
                onChange={(e) =>
                  setIncome({ ...income, category: e.target.value })
                }
              />
            </h3>

            <h4>
              Total Expenses:
              <input
                type="number"
                value={expense.amount || ""}
                onChange={(e) => {
                  setExpense({
                    ...expense,
                    amount: parseInt(e.target.value, 10),
                  });
                }}
              />
            </h4>

            <h3>
              ExpenseType:
              <input
                type="text"
                value={expense.category || ""}
                onChange={(e) =>
                  setExpense({ ...expense, category: e.target.value })
                }
              />
            </h3>

            <button onClick={addExp}>ADD</button>
          </article>
        </div>

        <h5>Balance: {balance()}</h5>

        <section className="transactions-display">
          {allTransactions.map((trans, index) => (
            <ul key={index}>
              <li>{trans.category}</li>
              <li>{trans.amount}</li>
            </ul>
          ))}
        </section>
      </section>

      <div className="card">
        <h5>Available Balance</h5>

        <h1>$ {balance()}</h1>
        <p>**** 1234</p>
      </div>
    </main>
  );
};
