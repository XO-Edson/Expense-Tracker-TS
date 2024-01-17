import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import ReactFirebaseUI from "firebaseui-react";

import { auth } from "../Firebase/Firebase";

const REDIRECT = "/Dashboard";

const SignUpUI = () => {
  const signInConfig = {
    signInFlow: "popup",
    signInsuccessUrl: REDIRECT,
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID,
    ],
  };

  return (
    <div>
      <h1>Expense tracker</h1>

      <ReactFirebaseUI auth={auth} config={signInConfig} />
      <button>Close Dialog</button>
    </div>
  );
};

export default SignUpUI;
