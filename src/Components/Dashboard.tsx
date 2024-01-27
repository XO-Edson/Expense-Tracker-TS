import { useSupabase } from "../Supabase/Supabase";

/* type DashboardHeaderProps = {
  userEmail: string;
}; */

const Dashboard = () => {
  const { accExpenses } = useSupabase();

  return (
    <>
      {/* Display */}
      <section className="display-box">
        {accExpenses.map((accEx, index) => (
          <div key={index}>
            <li>{accEx.amount}</li>
            <li>{accEx.expenseCategory}</li>
          </div>
        ))}
      </section>
    </>
  );
};

export default Dashboard;
