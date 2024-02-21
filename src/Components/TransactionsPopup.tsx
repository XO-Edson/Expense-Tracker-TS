import { useSupabase } from "../SupabaseContext/Supabase";
import DateTimePicker from "react-datetime-picker";

const TransactionsPopup = () => {
  const {
    income,
    setIncome,
    expense,
    setExpense,

    togglePopup,
    entry,
    setEntry,
    handleAddOrEdit,
  } = useSupabase();

  const handleInputClick = (e: any) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };

  const toggleEntryField = () => {
    setEntry((prev: any) => !prev);
  };

  return (
    <div className="input-fields-background" onClick={togglePopup}>
      <article className="input-fields" onClick={handleInputClick}>
        <div>
          <button onClick={toggleEntryField}>Income</button>
          <button onClick={toggleEntryField}>Expense</button>
        </div>

        <div className="inputs">
          <h4>Total {entry ? "Income" : "Expenses"}:</h4>
          <input
            type="number"
            value={entry ? income.amount || "" : expense.amount || ""}
            onChange={(e) => {
              entry
                ? setIncome({ ...income, amount: parseInt(e.target.value, 10) })
                : setExpense({
                    ...expense,
                    amount: parseInt(e.target.value, 10),
                  });
            }}
          />
          <h4>{entry ? "Income" : "Expense"} Category:</h4>
          <input
            type="text"
            value={entry ? income.category || "" : expense.category || ""}
            onChange={(e) =>
              entry
                ? setIncome({ ...income, category: e.target.value })
                : setExpense({ ...expense, category: e.target.value })
            }
          />
          <h4>Date:</h4>
          <DateTimePicker
            onChange={(newDate) =>
              entry
                ? setIncome({ ...income, date: newDate })
                : setExpense({ ...expense, date: newDate })
            }
            value={entry ? income.date : expense.date}
          />
        </div>

        <button onClick={handleAddOrEdit}>ADD</button>
      </article>
    </div>
  );
};

export default TransactionsPopup;
