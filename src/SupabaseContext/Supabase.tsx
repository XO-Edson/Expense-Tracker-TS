import { ReactNode, createContext, useContext, useState } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

type SupaBaseProviderProps = {
  children: ReactNode;
};

type IncomeType = {
  amount?: number;
  incomeCategory: string;
};

type ExpenseType = {
  amount?: number;
  expenseCategory: string;
};

type ContextProps = {
  supabase: SupabaseClient;
  balance: () => number;
  addExp: () => void;
  accExpenses: ExpenseType[];
  income: IncomeType;
  expense: ExpenseType;
  setIncome: (e: any) => void;
  setExpense: (e: any) => void;
};

const SupabaseContext = createContext<ContextProps | undefined>(undefined);

const SupabaseProvider = ({ children }: SupaBaseProviderProps) => {
  const supabase = createClient(
    "https://dlqwbcnampbxxuowszdl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscXdiY25hbXBieHh1b3dzemRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTMwMjQsImV4cCI6MjAyMTIyOTAyNH0.aic0gbTZB4xzclit1TefvdTan9XgNRu5RHpRp0OjBs0"
  );

  const [income, setIncome] = useState<IncomeType>({
    amount: undefined,
    incomeCategory: "",
  });

  const [expense, setExpense] = useState<ExpenseType>({
    amount: undefined,
    expenseCategory: "",
  });

  const [accExpenses, setAccExpenses] = useState<ExpenseType[]>([]);

  const balance = (): number => {
    if (income.amount !== undefined) {
      const totalExpenses = accExpenses.reduce(
        (sum, obj) => sum + (obj.amount || 0),
        0
      );

      return income.amount - totalExpenses;
    } else {
      return 0;
    }
  };

  const addExp = () => {
    setAccExpenses((prevExpenses) => [...prevExpenses, expense]);
    setExpense({ amount: undefined, expenseCategory: "" });

    balance();
  };

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        balance,
        addExp,
        accExpenses,
        income,
        expense,
        setIncome,
        setExpense,
      }}
    >
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
