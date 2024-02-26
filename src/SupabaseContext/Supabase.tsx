import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

type SupaBaseProviderProps = {
  children: ReactNode;
};

type IncomeType = {
  id: any;
  amount?: number;
  incomeCategory: string;
  date: Date;
};

type ExpenseType = {
  id: any;
  amount?: number;
  expenseCategory: string;
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
  balance: (incomes: any, exoenses: any) => number;
  addExp: (incomes: any, expenses: any) => void;
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
  editData: any;
  setEditData: (e: any) => void;

  edit: boolean;
  setEdit: (e: any) => void;
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
    id: uuidv4(),
    amount: undefined,
    incomeCategory: "",
    date: new Date(),
  });

  const [expense, setExpense] = useState<ExpenseType>({
    id: uuidv4(),
    amount: undefined,
    expenseCategory: "",
    date: new Date(),
  });

  const [editData, setEditData] = useState({
    id: undefined,
    amount: undefined,
    incomeCategory: "", // Set initial value to an empty string
    expenseCategory: "", // Set initial value to an empty string
    date: new Date(),
  });

  const [accExpenses, setAccExpenses] = useState<ExpenseType[]>([]);
  const [accIncome, setAccIncome] = useState<IncomeType[]>([]);

  const [accSavings, setAccSavings] = useState<Savingstype[]>();

  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);

  const [popup, setPopup] = useState<boolean>(false);

  const [tableData, setTableData] = useState<any>([]);

  const [entry, setEntry] = useState<boolean>(false);

  const [edit, setEdit] = useState<boolean>(true);

  function togglePopup() {
    setPopup((prev) => !prev);
    setEdit(true);
  }

  const balance = (incomes: any, expenses: any): number => {
    return incomes - expenses;
  };

  const addExp = (incomes: any, expenses: any) => {
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

    const newId = uuidv4();

    const newTransaction = {
      id: newId,

      amount:
        income.amount !== undefined
          ? income.amount
          : expense.amount !== undefined
          ? expense.amount
          : 0,

      category:
        income.incomeCategory !== ""
          ? income.incomeCategory
          : expense.expenseCategory !== ""
          ? expense.expenseCategory
          : "",

      date: income.date || expense.date,
    };

    // Update tableData with the new transaction
    setTableData([...tableData, newTransaction]);

    console.log(allTransactions);
    setIncome({
      id: newId,
      amount: undefined,
      incomeCategory: "",
      date: new Date(),
    });
    setExpense({
      id: newId,
      amount: undefined,
      expenseCategory: "",
      date: new Date(),
    });

    balance(incomes, expenses);
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
        editData,
        setEditData,

        edit,
        setEdit,
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
  const setValue = (key: string, value: any[]) => {
    try {
      setStoredValue((prevValue) => {
        const newValue = [...prevValue];
        value.forEach((item) => {
          // Check if item with the same id exists
          const existingItem = newValue.find(
            (existing) => existing.id === item.id
          );
          if (!existingItem) {
            newValue.push(item);
          }
        });
        localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const removeItem = (key: string, id: any) => {
    try {
      // Retrieve transactions from local storage
      const storedData = localStorage.getItem(key);
      let transactionsLocalStorage;

      // Parse storedData if it's not null, otherwise use an empty array
      if (storedData !== null) {
        transactionsLocalStorage = JSON.parse(storedData);
      } else {
        transactionsLocalStorage = [];
      }

      // Filter transactions to remove the item with the given ID
      const updatedTransactions = transactionsLocalStorage.filter(
        (transaction: { id: any }) => transaction.id !== id
      );

      // Update local storage with the filtered transactions
      localStorage.setItem(key, JSON.stringify(updatedTransactions));

      // Optionally, you can update the state with the filtered transactions
      setStoredValue(updatedTransactions);
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
