import { useEffect, useState } from "react";
import { Savingstype } from "../SupabaseContext/Supabase";
import useSupabase from "../Hooks/useSupabase";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "../Hooks/useLocalStorage";

const SavingsPopup = () => {
  const {
    togglePopup,
    accSavings,
    setAccSavings,
    editData,
    edit,
    setEdit,
    allTransactions,
  } = useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue2, setStoredValue2 } = useLocalStorage(
    "transactions",
    allTransactions,
    "savings",
    initializedAccSavings
  );

  console.log(accSavings);
  console.log(edit);

  const handleInputClick = (e: any) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };

  const [savings, setSavings] = useState<Savingstype>({
    id: uuidv4(),
    category: "",
    targetAmount: undefined,
    depositAmount: undefined,
  });

  function addSavings() {
    setAccSavings((prevAcc: any) => [...(prevAcc || []), { ...savings }]);
    togglePopup();
    console.log(accSavings);
  }

  useEffect(() => {
    console.log("Updated editData:", editData);
  }, [editData]);

  const handleAddOrEdit = () => {
    if (edit) {
      // Find the index of the entry to be edited
      const indexToEdit = storedValue2.findIndex(
        (value: { id: any }) => value.id === editData.id
      );

      console.log("Index to edit:", indexToEdit);
      console.log("Edit data:", editData);

      if (indexToEdit !== -1) {
        // Retrieve existing data from localStorage
        const existingDataString = localStorage.getItem("savings");
        // Parse existing data or initialize as an empty array if it doesn't exist
        const existingData: any[] = existingDataString
          ? JSON.parse(existingDataString)
          : [];
        // Create a copy of existingData
        const updatedData = [...existingData];
        // Update the specific entry in the copy of existingData
        updatedData[indexToEdit] = editData;

        // Update localStorage with the updated data
        localStorage.setItem("savings", JSON.stringify(updatedData));
        console.log("Local storage updated.");

        // Update the storedValue state with the updated data
        setStoredValue2((prevStoredValue) => {
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
      addSavings();

      // Edit existing data
      // Call the appropriate function to edit data using editData state
      // Reset input fields or close the popup after editing
    }
  };

  useEffect(() => {
    console.log("Stored Value:", storedValue2);
  }, [storedValue2]); // Log storedValue after it's updated

  return (
    <div>
      <div className="savings-plan-background" onClick={togglePopup}>
        <div className="savings-plan" onClick={handleInputClick}>
          {edit ? (
            <div className="savings-plan-container">
              <h3>Category</h3>
              <input
                type="text"
                value={editData?.category}
                onChange={(e) =>
                  setSavings({ ...editData, category: e.target.value })
                }
              />
              <h3>Target amount</h3>
              <input
                type="number"
                value={editData?.targetAmount}
                onChange={(e) =>
                  setSavings({
                    ...editData,
                    targetAmount: parseInt(e.target.value, 10) || undefined,
                  })
                }
              />

              <h3>Deposit Amount</h3>
              <input
                type="number "
                value={editData?.depositAmount}
                onChange={(e) =>
                  setSavings({
                    ...editData,
                    depositAmount: parseInt(e.target.value, 10) || undefined,
                  })
                }
              />

              <button onClick={addSavings}>Add</button>
            </div>
          ) : (
            <div className="savings-plan-container">
              <h3>Category</h3>
              <input
                type="text"
                value={savings?.category}
                onChange={(e) =>
                  setSavings({ ...savings, category: e.target.value })
                }
              />
              <h3>Target amount</h3>
              <input
                type="number"
                value={savings?.targetAmount}
                onChange={(e) =>
                  setSavings({
                    ...savings,
                    targetAmount: parseInt(e.target.value, 10) || undefined,
                  })
                }
              />

              <h3>Deposit Amount</h3>
              <input
                type="number "
                value={savings?.depositAmount}
                onChange={(e) =>
                  setSavings({
                    ...savings,
                    depositAmount: parseInt(e.target.value, 10) || undefined,
                  })
                }
              />

              <button onClick={handleAddOrEdit}>Add</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsPopup;
