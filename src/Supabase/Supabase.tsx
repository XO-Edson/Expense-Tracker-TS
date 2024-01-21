import { ReactNode, createContext, useContext } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

type SupaBaseProviderProps = {
  children: ReactNode;
};

type ContextProps = {
  supabase: SupabaseClient;
};

const SupabaseContext = createContext<ContextProps | undefined>(undefined);

const SupabaseProvider = ({ children }: SupaBaseProviderProps) => {
  const supabase = createClient(
    "https://dlqwbcnampbxxuowszdl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscXdiY25hbXBieHh1b3dzemRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTMwMjQsImV4cCI6MjAyMTIyOTAyNH0.aic0gbTZB4xzclit1TefvdTan9XgNRu5RHpRp0OjBs0"
  );

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

/* hook */

const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

export { SupabaseProvider, useSupabase };
