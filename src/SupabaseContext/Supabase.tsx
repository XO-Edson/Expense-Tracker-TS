import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

type SupaBaseProviderProps = {
  children: ReactNode;
};

type IncomeType = {
  amount?: number;
  category: string;
};

type ExpenseType = {
  amount?: number;
  category: string;
};

type TransactionType = IncomeType | ExpenseType;

type ContextProps = {
  supabase: SupabaseClient;
  balance: () => number;
  addExp: () => void;
  accExpenses: ExpenseType[];
  accIncome: IncomeType[];
  income: IncomeType;
  expense: ExpenseType;
  setIncome: (e: any) => void;
  setExpense: (e: any) => void;
  user: any;
  allTransactions: TransactionType[];
  togglePopup: () => void;
  popup: boolean;
  tableData: any;
};

const SupabaseContext = createContext<ContextProps | undefined>(undefined);

const SupabaseProvider = ({ children }: SupaBaseProviderProps) => {
  const supabase = createClient(
    "https://dlqwbcnampbxxuowszdl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscXdiY25hbXBieHh1b3dzemRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NTMwMjQsImV4cCI6MjAyMTIyOTAyNH0.aic0gbTZB4xzclit1TefvdTan9XgNRu5RHpRp0OjBs0"
  );

  const [user, setUser] = useState<any>();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user data:", error);
        } else if (data?.user) {
          setUser(data.user);
          console.log("User data:", data.user);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
      }
    };

    getUserData();
  }, []);

  const [income, setIncome] = useState<IncomeType>({
    amount: undefined,
    category: "",
  });

  const [expense, setExpense] = useState<ExpenseType>({
    amount: undefined,
    category: "",
  });

  const [accExpenses, setAccExpenses] = useState<ExpenseType[]>([]);
  const [accIncome, setAccIncome] = useState<IncomeType[]>([]);

  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);

  const [popup, setPopup] = useState<boolean>(false);

  const [tableData, setTableData] = useState<any>([]);

  function togglePopup() {
    setPopup((prev) => !prev);
  }

  const balance = (): number => {
    if (income.amount !== 0) {
      const totalExpenses = accExpenses.reduce(
        (sum, obj) => sum + (obj.amount || 0),
        0
      );

      const totalIncome = accIncome.reduce(
        (sum, obj) => sum + (obj.amount || 0),
        0
      );

      return totalIncome - totalExpenses;
    } else {
      return 0;
    }
  };

  const addExp = () => {
    setIncome({ amount: undefined, category: "" });
    setExpense({ amount: undefined, category: "" });

    setAccIncome((prevIncome) => [...prevIncome, income]);
    setAccExpenses((prevExpenses) => [...prevExpenses, expense]);

    // Combine newly added income and expense with existing entries
    const allIncome = [...accIncome, income];
    const allExpenses = [...accExpenses, expense];
    const accTransactions = [...allIncome, ...allExpenses];

    // Filter out undefined entries
    const filteredTransactions = accTransactions.filter(
      (item) => item.amount !== undefined
    );

    // Update transactions with the filtered data
    setAllTransactions(filteredTransactions);

    const newTransaction = {
      amount:
        income.amount !== undefined
          ? income.amount
          : expense.amount !== undefined
          ? expense.amount
          : 0,
      category:
        income.category !== ""
          ? income.category
          : expense.category !== ""
          ? expense.category
          : "",
    };

    // Update tableData with the new transaction
    setTableData([...tableData, newTransaction]);

    balance();
    togglePopup();
  };

  return (
    <SupabaseContext.Provider
      value={{
        supabase,
        balance,
        addExp,
        accExpenses,
        accIncome,
        income,
        expense,
        setIncome,
        setExpense,
        user,
        allTransactions,
        togglePopup,
        popup,
        tableData,
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
