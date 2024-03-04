import { useNavigate } from "react-router-dom";
import useSupabase from "../Hooks/useSupabase";
import { Auth } from "@supabase/auth-ui-react";
import { useEffect } from "react";
import Header from "./Header";

const SignUpUI = () => {
  const navigate = useNavigate();
  const { supabase } = useSupabase();

  const guestSignIn = () => {
    navigate("/dashboard");
  };

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
    <section className="signup">
      <Header />
      <h1>Welcome</h1>

      <Auth
        supabaseClient={supabase}
        theme="dark"
        providers={["google"]}
        /* appearance={{
          extend: false,
          className: {
            input: "signup-input",
          },
        } }*/
      />
      <button onClick={guestSignIn}>Sign in as Guest</button>
    </section>
  );
};

export default SignUpUI;
