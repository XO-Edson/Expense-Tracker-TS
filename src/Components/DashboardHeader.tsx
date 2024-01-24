import { useNavigate } from "react-router-dom";
import { useSupabase } from "../Supabase/Supabase";
import { useState } from "react";

type DashboardHeaderProps = {
  userEmail: string;
};

type IncomeType = {
  amount?: number;
  incomeCategory: string;
};

type ExpenseType = {
  amount?: number;
  expenseCategory: string;
};

const DashboardHeader = ({ userEmail }: DashboardHeaderProps) => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const logOut = () => {
    supabase.auth.signOut();
    navigate("/");
  };

  const [income, setIncome] = useState<IncomeType>({
    amount: undefined,
    incomeCategory: "",
  });

  const [expense, setExpense] = useState<ExpenseType>({
    amount: undefined,
    expenseCategory: "",
  });

  const [accExpenses, setAccExpenses] = useState<ExpenseType[]>([]);

  const balance = (): IncomeType | undefined => {
    if (income.amount !== undefined && expense.amount !== undefined) {
      return { amount: income.amount - expense.amount, incomeCategory: "" };
    } else {
      return undefined;
    }
  };

  const addExp = () => {
    setAccExpenses((prevExpenses) => [...prevExpenses, expense]);
    setExpense({ amount: undefined, expenseCategory: "" });

    const newIncome = balance();
    if (newIncome !== undefined) {
      setIncome(newIncome);
    }
  };

  console.log(income);

  return (
    <>
      <header>
        <h2>Dashboard</h2>
        <div className="email-info">
          <p>{userEmail}</p>
          <button onClick={logOut}>Log Out</button>
        </div>
      </header>

      <main>
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
              setExpense({ ...expense, amount: parseInt(e.target.value, 10) });
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

        <h5>Balance:{income.amount}</h5>

        {/* Display */}
      </main>
      <section className="display-box">
        {accExpenses.map((accEx, index) => (
          <div key={index}>
            <li>{accEx.amount}</li>
            <li>{accEx.expenseCategory}</li>
          </div>
        ))}
      </section>
    </>
  );
};

export default DashboardHeader;
