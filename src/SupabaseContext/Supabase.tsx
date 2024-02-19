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
  date: Date;
};

type ExpenseType = {
  amount?: number;
  category: string;
  date: Date;
};

export type Savingstype = {
  category: string;
  targetAmount?: number;
  depositAmount?: number;
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
  entry: Boolean;
  setEntry: (e: any) => void;
  accSavings?: Savingstype[];
  setAccSavings: (e: any) => void;
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
    date: new Date(),
  });

  const [expense, setExpense] = useState<ExpenseType>({
    amount: undefined,
    category: "",
    date: new Date(),
  });

  const [accExpenses, setAccExpenses] = useState<ExpenseType[]>([]);
  const [accIncome, setAccIncome] = useState<IncomeType[]>([]);

  const [accSavings, setAccSavings] = useState<Savingstype[]>();

  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);

  const [popup, setPopup] = useState<boolean>(false);

  const [tableData, setTableData] = useState<any>([]);

  const [entry, setEntry] = useState<boolean>(false);

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
      date: income.date || expense.date,
    };

    // Update tableData with the new transaction
    setTableData([...tableData, newTransaction]);

    // Combine newly added income and expense with existing entries
    const allIncome = [...accIncome, income];
    const allExpenses = [...accExpenses, expense];
    const accTransactions = [...allIncome, ...allExpenses];

    setAccIncome((prevIncome) => [...prevIncome, income]);
    setAccExpenses((prevExpenses) => [...prevExpenses, expense]);

    // Filter out undefined entries
    const filteredTransactions = accTransactions.filter(
      (item) => item.amount !== undefined
    );

    // Update transactions with the filtered data
    setAllTransactions(filteredTransactions);

    setIncome({ amount: undefined, category: "", date: new Date() });
    setExpense({ amount: undefined, category: "", date: new Date() });

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
        entry,
        setEntry,
        accSavings,
        setAccSavings,
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

/* local storage hook */

const useLocalStorage = (key: string, initialValue: any[]) => {
  const [storedValue, setStoredValue] = useState<any[]>(() => {
    try {
      const item = localStorage.getItem(key);
      // Parse stored JSON or if none, return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error("Error loading from local storage:", error);
      return initialValue;
    }
  });

  // Set a new value in local storage
  const setValue = (value: any[]) => {
    try {
      setStoredValue(() => {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
      });
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const removeItem = () => {
    try {
      // Remove from local storage
      localStorage.removeItem(key);
      // Reset the stored value to an empty array
      setStoredValue([]);
    } catch (error) {
      console.error("Error removing from local storage:", error);
    }
  };

  // Clear all items from local storage
  const clear = () => {
    try {
      // Clear local storage
      localStorage.clear();
      // Reset the stored value to an empty array
      setStoredValue([]);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  return { storedValue, setValue, removeItem, clear, setStoredValue };
};

export { SupabaseProvider, useSupabase, useLocalStorage };
