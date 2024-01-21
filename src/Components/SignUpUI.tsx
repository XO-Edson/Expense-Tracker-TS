import { useNavigate } from "react-router-dom";
import { useSupabase } from "../Supabase/Supabase";
import { Auth } from "@supabase/auth-ui-react";
import { useEffect } from "react";

const SignUpUI = () => {
  const navigate = useNavigate();
  const { supabase } = useSupabase();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("SIGNED_IN", session);
        navigate("/dashboard");
      } else {
        console.log(event, session);
      }
    });

    return () => {};
  }, [navigate, supabase.auth]);

  return (
    <div>
      <h1>Expense tracker</h1>
      <Auth supabaseClient={supabase} theme="dark" providers={["google"]} />
    </div>
  );
};

export default SignUpUI;
