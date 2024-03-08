import useLocalStorage from "../Hooks/useLocalStorage";
import useSupabase from "../Hooks/useSupabase";
import { Savingstype } from "../SupabaseContext/Supabase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { useEffect } from "react";

const SavingsPlan = () => {
  const { allTransactions, accSavings, setEditSavings, togglePopup, setEdit } =
    useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue2, removeItem, setValue } = useLocalStorage(
    "transactions",
    allTransactions,
    "savings",
    initializedAccSavings
  );

  function handleEditPopup(entryId: any) {
    const selectedEntry = storedValue2.find(
      (value: { id: any }) => value.id === entryId
    );

    if (selectedEntry) {
      console.log(selectedEntry);

      setEditSavings({ ...selectedEntry });

      togglePopup();
    }
  }

  function toggleAddSavings() {
    togglePopup();
    setEdit(false);
  }

  useEffect(() => {
    setValue("savings", initializedAccSavings);
  }, [accSavings]);

  return (
    <div className="savings-container">
      <div>
        <button className="add-btn" onClick={toggleAddSavings}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      {storedValue2?.map((savings, index) => (
        <div key={index} className="savings">
          <div className="savings-header">
            <h3>{savings.category}</h3>
            <button onClick={() => handleEditPopup(savings.id)}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </div>

          <div className="savings-body">
            <div>
              <p>DEPOSIT: {savings.depositAmount}</p>
              <p>TARGET: {savings.targetAmount}</p>

              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width:
                      savings.depositAmount && savings.targetAmount
                        ? `${
                            (savings.depositAmount / savings.targetAmount) * 100
                          }%`
                        : "0%",
                  }}
                ></div>
                <h4>
                  {savings.depositAmount && savings.targetAmount
                    ? Math.round(
                        (savings.depositAmount / savings.targetAmount) * 100
                      )
                    : 0}
                  %
                </h4>
              </div>
            </div>

            <div>
              <button onClick={() => removeItem("savings", savings.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavingsPlan;
