import { useSupabase } from "../SupabaseContext/Supabase";

const Popup = () => {
  const { income, setIncome, expense, setExpense, addExp, togglePopup } =
    useSupabase();

  const handleInputClick = (e: any) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };

  return (
    <div className="input-fields-background" onClick={togglePopup}>
      <article className="input-fields" onClick={handleInputClick}>
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
            onChange={(e) => setIncome({ ...income, category: e.target.value })}
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
  );
};

export default Popup;
