import { useEffect } from "react";
import { useLocalStorage, useSupabase } from "../SupabaseContext/Supabase";
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
    setEdit,
    addExp,
    edit,
    setEditData,
    editData,
    allTransactions,
  } = useSupabase();

  const { storedValue, setStoredValue } = useLocalStorage(
    "transactions",
    allTransactions
  );

  const incomes = storedValue
    .filter((values) => values.incomeCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  const expenses = storedValue
    .filter((values) => values.expenseCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  const handleInputClick = (e: any) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };

  const toggleEntryField = () => {
    setEntry((prev: any) => !prev);
  };

  useEffect(() => {
    console.log("Updated editData:", editData);
  }, [editData]);

  const handleAddOrEdit = () => {
    if (edit) {
      // Find the index of the entry to be edited
      const indexToEdit = storedValue.findIndex(
        (value: { id: any }) => value.id === editData.id
      );

      console.log("Index to edit:", indexToEdit);
      console.log("Edit data:", editData);

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
        console.log("Local storage updated.");

        // Update the storedValue state with the updated data
        setStoredValue((prevStoredValue) => {
          const updatedStoredValue = [...prevStoredValue];
          updatedStoredValue[indexToEdit] = editData;
          console.log("Updated stored value:", updatedStoredValue);
          return updatedStoredValue;
        });

        // Close the popup after updating the data
        togglePopup();
      }
    } else {
      setEdit(false);
      console.log(edit);

      addExp(incomes, expenses);

      // Edit existing data
      // Call the appropriate function to edit data using editData state
      // Reset input fields or close the popup after editing
    }
  };

  useEffect(() => {
    console.log("Stored Value:", storedValue);
  }, [storedValue]); // Log storedValue after it's updated

  return (
    <div className="input-fields-background" onClick={togglePopup}>
      <article className="input-fields" onClick={handleInputClick}>
        <div>
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

            {/* convert to income/expense category */}

            <DateTimePicker
              onChange={(newDate) =>
                setEditData((prevEditData: any) => ({
                  ...prevEditData,
                  date: newDate,
                }))
              }
              value={editData.date}
            />
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
            <DateTimePicker
              onChange={(newDate) =>
                entry
                  ? setIncome({ ...income, date: newDate })
                  : setExpense({ ...expense, date: newDate })
              }
              value={entry ? income.date : expense.date}
            />
          </div>
        )}

        <button onClick={handleAddOrEdit}>{edit ? "EDIT" : "ADD"}</button>
      </article>
    </div>
  );
};

export default TransactionsPopup;
