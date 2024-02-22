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
        try {
          console.log("Entry found for edit. Updating stored value...");

          setStoredValue((prevStoredValue) => {
            console.log("Previous stored value:", prevStoredValue);

            const updatedStoredValue = [...prevStoredValue];

            updatedStoredValue[indexToEdit] = editData;

            console.log("Updated stored value:", updatedStoredValue);

            localStorage.setItem(
              "transactions",
              JSON.stringify(updatedStoredValue)
            );

            console.log("Local storage updated.");

            return updatedStoredValue;
          });
        } catch (error) {
          console.error("Error updating stored value:", error);
        }
      } else {
        console.error("Item not found for edit.");
        // Handle the case where the item to edit is not found
      }
      togglePopup();
    } else {
      setEdit(false);
      console.log(edit);

      addExp();

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
              value={editData.category || ""}
              onChange={(e) =>
                setEditData((prevEditData: any) => ({
                  ...prevEditData,
                  category: e.target.value,
                }))
              }
            />

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
        )}

        <button onClick={handleAddOrEdit}>{edit ? "EDIT" : "ADD"}</button>
      </article>
    </div>
  );
};

export default TransactionsPopup;
