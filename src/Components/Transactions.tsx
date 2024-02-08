import { useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";
import Popup from "./Popup";

export const Transactions = () => {
  const {
    balance,
    togglePopup,
    popup,

    allTransactions,
  } = useSupabase();

  console.log(allTransactions);

  return (
    <main>
      <Sidebar userEmail={""} />
      <section>
        <h2>TRANSACTIONS</h2>
        <button onClick={togglePopup}>Add Transaction</button>
        {popup && <Popup />}

        <h5>Balance: {balance()}</h5>

        <section className="transactions-display">
          {allTransactions.map((trans, index) => (
            <ul key={index}>
              <li>{trans.category}</li>
              <li>{trans.amount}</li>
            </ul>
          ))}
        </section>
      </section>

      <div className="card">
        <h5>Available Balance</h5>

        <h1>$ {balance()}</h1>
        <p>**** 1234</p>
      </div>
    </main>
  );
};
