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
    accExpenses,
  } = useSupabase();

  return (
    <div>
      <Sidebar userEmail={""} />
      <h4>
        Total Income:
        <input
          type="number"
          value={income.amount}
          onChange={(e) => {
            setIncome({ ...income, amount: parseInt(e.target.value, 10) });
          }}
        />
      </h4>

      <h3>
        IncomeType:
        <input
          type="text"
          value={income.incomeCategory}
          onChange={(e) =>
            setIncome({ ...income, incomeCategory: e.target.value })
          }
        />
      </h3>

      <h4>
        Total Expenses:
        <input
          type="number"
          value={expense.amount}
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
          value={expense.expenseCategory}
          onChange={(e) =>
            setExpense({ ...expense, expenseCategory: e.target.value })
          }
        />
      </h3>

      <button onClick={addExp}>ADD</button>

      <h5>Balance: {balance()}</h5>

      <section className="display-box">
        {accExpenses.map((accEx, index) => (
          <div key={index}>
            <li>{accEx.amount}</li>
            <li>{accEx.expenseCategory}</li>
          </div>
        ))}
      </section>
    </div>
  );
};
