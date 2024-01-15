import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, createContext, useEffect, useState } from "react";
import { auth } from "./Firebase";

type authUser = {
  user?: string;
  isLoading: boolean;
};

type contextData = {
  authUser: authUser;
  auth: () => void;
};

type AuthUserProviderProp = {
  children: ReactNode;
};

const AuthUserContext = createContext<contextData>({
    authUser: undefined,
    auth:void
});

export default function useFireBaseAuth() {
    const [authUser, setAuthUser] = useState();
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        
        onAuthStateChanged(auth,onAuthStateChanged)
    },[])
}

export const AuthUserProvider = ({ children }: AuthUserProviderProp) => {
 

  const auth = useFireBaseAuth();
  return (
    <AuthUserContext.Provider value={{ auth }}>
      {children}
    </AuthUserContext.Provider>
  );
};


