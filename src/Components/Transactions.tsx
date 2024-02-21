import { useLocalStorage, useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";
import TransactionsPopup from "./TransactionsPopup";
import { useTable } from "react-table";
import { useEffect, useMemo } from "react";

export const Transactions = () => {
  const {
    balance,
    togglePopup,
    popup,

    tableData,
    setEntry,
    entry,
    allTransactions,
    edit,
  } = useSupabase();

  const { storedValue, setValue, clear } = useLocalStorage(
    "transactions",
    allTransactions
  );

  console.log(allTransactions);

  useEffect(() => {
    setValue("transactions", allTransactions);
    console.log(storedValue);
  }, [allTransactions]);

  /*  useEffect(() => {
    console.log(allTransactions);
    console.log(storedValue);
  }, [storedValue]); */

  function handleEditPopup(entryId: any) {
    const selectedEntry = storedValue.find((value) => value.id === entryId);

    if (selectedEntry) {
      // Populate the editData state with the data of the selected entry

      // Open the edit popup

      console.log(entryId);
      console.log(selectedEntry);
      console.log(edit);

      togglePopup();
    }
  }
  const data = storedValue;

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
            accessor: "category",
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
      <Sidebar userEmail={""} />

      <section>
        <h2>TRANSACTIONS</h2>
        <button onClick={togglePopup}>Add Transaction</button>
        {popup && <TransactionsPopup />}

        <h5>Balance: {balance()}</h5>

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
                    <button onClick={() => handleEditPopup(row.original.id)}>
                      edit
                    </button>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </section>

      <section>
        <div className="card">
          <h5>Available Balance</h5>

          <h1>$ {balance()}</h1>
          <p>**** 1234</p>
        </div>
      </section>
    </main>
  );
};
