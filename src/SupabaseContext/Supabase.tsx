import { ReactNode, createContext, useEffect, useState } from "react";
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
  id: any;
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
  setAllTransactions: (e: any) => void;
  togglePopup: () => void;
  popup: boolean;
  tableData: any;
  entry: Boolean;
  setEntry: (e: any) => void;
  accSavings?: Savingstype[];
  setAccSavings: (e: any) => void;
  editData: any;
  setEditData: (e: any) => void;
  editSavings: any;
  setEditSavings: (e: any) => void;

  edit: boolean;
  setEdit: (e: any) => void;
};

export const SupabaseContext = createContext<ContextProps | undefined>(
  undefined
);

export const SupabaseProvider = ({ children }: SupaBaseProviderProps) => {
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
    incomeCategory: "",
    expenseCategory: "",
    date: new Date(),
  });

  const [editSavings, setEditSavings] = useState<Savingstype>();

  const [accExpenses, setAccExpenses] = useState<ExpenseType[]>([]);
  const [accIncome, setAccIncome] = useState<IncomeType[]>([]);

  const [accSavings, setAccSavings] = useState<Savingstype[]>([]);

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
        setAllTransactions,
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

        editSavings,
        setEditSavings,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
