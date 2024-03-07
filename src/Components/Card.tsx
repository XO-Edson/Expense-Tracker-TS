import useLocalStorage from "../Hooks/useLocalStorage";
import useSupabase from "../Hooks/useSupabase";
import { Savingstype } from "../SupabaseContext/Supabase";

const Card = () => {
  const { balance, allTransactions, accSavings } = useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue1 } = useLocalStorage(
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

  return (
    <div>
      <div className="card">
        <div>
          <h3>Available Balance</h3>

          <h1>$ {balance(incomes, expenses)}</h1>
        </div>
        <p>**** 1234</p>
      </div>
    </div>
  );
};

export default Card;
