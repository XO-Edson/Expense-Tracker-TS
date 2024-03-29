import useLocalStorage from "../Hooks/useLocalStorage";
import useSupabase from "../Hooks/useSupabase";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
/*import "react-calendar/dist/Calendar.css"; */

import { Savingstype } from "../SupabaseContext/Supabase";

const TransactionsPopup = () => {
  const {
    income,
    setIncome,
    expense,
    setExpense,

    togglePopup,
    entry,
    setEntry,
    setEdit,
    addExp,
    edit,
    setEditData,
    editData,
    allTransactions,
    accSavings,
  } = useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue1, setStoredValue1 } = useLocalStorage(
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

  const handleInputClick = (e: any) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };

  const toggleEntryField = () => {
    setEntry((prev: any) => !prev);
  };

  const handleAddOrEdit = () => {
    if (edit) {
      // Find the index of the entry to be edited
      const indexToEdit = storedValue1.findIndex(
        (value: { id: any }) => value.id === editData.id
      );

      if (indexToEdit !== -1) {
        // Retrieve existing data from localStorage
        const existingDataString = localStorage.getItem("transactions");
        // Parse existing data or initialize as an empty array if it doesn't exist
        const existingData: any[] = existingDataString
          ? JSON.parse(existingDataString)
          : [];
        // Create a copy of existingData
        const updatedData = [...existingData];
        // Update the specific entry in the copy of existingData
        updatedData[indexToEdit] = editData;

        // Update localStorage with the updated data
        localStorage.setItem("transactions", JSON.stringify(updatedData));

        // Update the storedValue state with the updated data
        setStoredValue1((prevStoredValue) => {
          const updatedStoredValue = [...prevStoredValue];
          updatedStoredValue[indexToEdit] = editData;

          return updatedStoredValue;
        });

        // Close the popup after updating the data
        togglePopup();
      }
    } else {
      setEdit(false);
      console.log(edit);

      addExp(incomes, expenses);
    }
  };

  return (
    <div className="input-fields-background" onClick={togglePopup}>
      <article className="input-fields" onClick={handleInputClick}>
        <div className="popup-buttons">
          <button onClick={toggleEntryField}>Income</button>
          <button onClick={toggleEntryField}>Expense</button>
        </div>

        {edit ? (
          <div className="inputs">
            <h4>Total {entry ? "Income" : "Expenses"}:</h4>
            <input
              type="number"
              value={editData.amount || ""}
              onChange={(e) => {
                setEditData({
                  ...editData,
                  amount: parseInt(e.target.value, 10),
                });
                console.log("Updated editData:", editData);
              }}
            />

            <input
              type="text"
              value={editData.incomeCategory || editData.expenseCategory}
              onChange={(e) =>
                setEditData((prevEditData: any) => ({
                  ...prevEditData,
                  incomeCategory: editData.incomeCategory ? e.target.value : "",
                  expenseCategory: editData.incomeCategory
                    ? ""
                    : e.target.value,
                }))
              }
            />

            <div>
              <DatePicker
                onChange={(newDate) =>
                  setEditData((prevEditData: any) => ({
                    ...prevEditData,
                    date: newDate,
                  }))
                }
                value={editData.date}
              />
            </div>
          </div>
        ) : (
          <div className="inputs">
            <h4>Total {entry ? "Income" : "Expenses"}:</h4>
            <input
              type="number"
              value={entry ? income.amount || "" : expense.amount || ""}
              onChange={(e) => {
                entry
                  ? setIncome({
                      ...income,
                      amount: parseInt(e.target.value, 10),
                    })
                  : setExpense({
                      ...expense,
                      amount: parseInt(e.target.value, 10),
                    });
              }}
            />
            <h4>{entry ? "Income" : "Expense"} Category:</h4>
            <input
              type="text"
              value={
                entry
                  ? income.incomeCategory || ""
                  : expense.expenseCategory || ""
              }
              onChange={(e) =>
                entry
                  ? setIncome({ ...income, incomeCategory: e.target.value })
                  : setExpense({ ...expense, expenseCategory: e.target.value })
              }
            />
            <h4>Date:</h4>
            <div>
              <DatePicker
                onChange={(newDate) =>
                  entry
                    ? setIncome({ ...income, date: newDate })
                    : setExpense({ ...expense, date: newDate })
                }
                value={entry ? income.date : expense.date}
              />
            </div>
          </div>
        )}

        <button onClick={handleAddOrEdit}>{edit ? "EDIT" : "ADD"}</button>
      </article>
    </div>
  );
};

export default TransactionsPopup;
