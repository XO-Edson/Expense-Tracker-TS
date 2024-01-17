import { User, onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "./Firebase";

type authUserType = {
  uid: string;
  email: string;
};

type ContextData = {
  auth: {
    authUser: authUserType | null;
    isLoading: boolean;
  };
};

type AuthUserProviderProp = {
  children: ReactNode;
};

const AuthUserContext = createContext<ContextData>({
  auth: {
    authUser: {
      uid: "",
      email: "",
    },
    isLoading: true,
  },
});

export function useFireBaseAuth() {
  const [authUser, setAuthUser] = useState<authUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  return { authUser, isLoading };
}

export const AuthUserProvider = ({ children }: AuthUserProviderProp) => {
  const auth = useFireBaseAuth();

  return (
    <AuthUserContext.Provider value={{ auth }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserContext;

/* HOOK */

const useAuth = () => {
  const { auth } = useContext(AuthUserContext);

  return auth;
};

export { useAuth };
