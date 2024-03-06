import useLocalStorage from "../Hooks/useLocalStorage";
import useSupabase from "../Hooks/useSupabase";
import Sidebar from "./Sidebar";
import TransactionsPopup from "./TransactionsPopup";
import { useTable } from "react-table";
import { useEffect, useMemo } from "react";
import { Savingstype } from "../SupabaseContext/Supabase";
import Header from "./Header";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export const Transactions = () => {
  const {
    balance,
    togglePopup,
    popup,

    allTransactions,

    setEdit,
    setEditData,
    accSavings,
  } = useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue1, setValue, clear, removeItem } = useLocalStorage(
    "transactions",
    allTransactions,
    "savings",
    initializedAccSavings
  );

  console.log(storedValue1);

  const incomes = storedValue1
    .filter((values) => values.incomeCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  const expenses = storedValue1
    .filter((values) => values.expenseCategory)
    .reduce((total, obj) => total + obj.amount, 0);

  console.log(allTransactions);

  useEffect(() => {
    setValue("transactions", allTransactions);

    console.log(storedValue1);
  }, [allTransactions]);

  function handleEditPopup(entryId: any) {
    const selectedEntry = storedValue1.find(
      (value: { id: any }) => value.id === entryId
    );

    if (selectedEntry) {
      console.log(selectedEntry);

      setEditData({ ...selectedEntry });

      togglePopup();
    }
  }

  function toggleAddtransaction() {
    togglePopup();
    setEdit(false);
  }

  const data = storedValue1;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      data,
      columns: useMemo(
        () => [
          {
            Header: "Amount",
            accessor: "amount",
          },
          {
            Header: "Category",
            accessor: (row: any) =>
              `${row.incomeCategory || ""}${
                row.expenseCategory ? ` ${row.expenseCategory}` : ""
              }`,
            Cell: ({ value }: { value: string }) => <span>{value}</span>,
          },
          {
            Header: "Date",
            accessor: "date",
            Cell: ({ value }: any) => (
              <span>{new Date(value).toLocaleDateString()}</span>
            ),
          },
        ],
        []
      ),
    });

  return (
    <main>
      <Header />
      <Sidebar userEmail={""} />

      <section className="transactions">
        <h2>TRANSACTIONS</h2>
        <button onClick={toggleAddtransaction}>Add Transaction</button>
        {popup && <TransactionsPopup />}

        <h5>Balance: {balance(incomes, expenses)}</h5>

        <section className="transactions-display">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")} </td>
                    ))}
                    <div className="table-buttons">
                      <button
                        onClick={() =>
                          handleEditPopup(row.original && row.original.id)
                        }
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        onClick={() =>
                          removeItem(
                            "transactions",
                            row.original && row.original.id
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </section>

      <section className="transactions-card">
        <div className="card">
          <h5>Available Balance</h5>

          <h1>$ {balance(incomes, expenses)}</h1>
          <p>**** 1234</p>
        </div>
      </section>
    </main>
  );
};
