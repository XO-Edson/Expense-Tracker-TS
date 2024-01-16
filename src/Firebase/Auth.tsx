import { User, onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "./Firebase";

type authUserType = {
  uid: string;
  email: string;
};

type contextData = {
  authUser: authUserType | null;
  auth: {
    authUser: authUserType | null;
    isLoading: boolean;
  };
};

type AuthUserProviderProp = {
  children: ReactNode;
};

const AuthUserContext = createContext<contextData>({
  authUser: {
    uid: "",
    email: "",
  },
  auth: {
    authUser: null,
    isLoading: true,
  },
});

const [authUser, setAuthUser] = useState<authUserType | null>(null);
const [isLoading, setIsLoading] = useState(true);

export function useFireBaseAuth() {
  const onAuthStateChangedCallBack = async (user: User | null) => {
    setIsLoading(true);

    if (!user) {
      setAuthUser(null);
      setIsLoading(false);
      return;
    }

    setAuthUser({
      uid: user.uid,
      email: user.email || "",
    });

    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedCallBack);

    return () => {
      unsubscribe();
    };
  }, [onAuthStateChanged, auth]);

  return { authUser, isLoading };
}

export const AuthUserProvider = ({ children }: AuthUserProviderProp) => {
  const auth = useFireBaseAuth();

  return (
    <AuthUserContext.Provider value={{ authUser: auth.authUser, auth }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserContext;
