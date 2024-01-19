import { Auth } from "@supabase/auth-ui-react";
import { useSupabase } from "../Supabase/Supabase";

const SignUpUI = () => {
  const { supabase } = useSupabase();

  return (
    <div>
      <h1>Expense tracker</h1>

      <Auth supabaseClient={supabase} theme="dark" providers={["google"]} />
    </div>
  );
};

export default SignUpUI;
