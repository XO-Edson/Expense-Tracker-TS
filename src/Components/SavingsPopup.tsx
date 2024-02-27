import { useState } from "react";
import { Savingstype } from "../SupabaseContext/Supabase";
import useSupabase from "../Hooks/useSupabase";

const SavingsPopup = () => {
  const { togglePopup, accSavings, setAccSavings } = useSupabase();

  const handleInputClick = (e: any) => {
    e.stopPropagation(); // Prevent click event from propagating to the background
  };

  const [savings, setSavings] = useState<Savingstype>({
    category: "",
    targetAmount: undefined,
    depositAmount: undefined,
  });

  function addSavings() {
    setAccSavings((prevAcc: any) => [...(prevAcc || []), { ...savings }]);
    togglePopup();
    console.log(accSavings);
  }

  return (
    <div>
      <div className="savings-plan-background" onClick={togglePopup}>
        <div className="savings-plan" onClick={handleInputClick}>
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

            <button onClick={addSavings}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsPopup;
