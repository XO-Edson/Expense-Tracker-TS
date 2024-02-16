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
      date: new Date(),
    };

    // Update tableData with the new transaction
    setTableData([...tableData, newTransaction]);

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

export { SupabaseProvider, useSupabase };
