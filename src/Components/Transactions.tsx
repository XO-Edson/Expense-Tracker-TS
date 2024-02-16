import { useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";
import TransactionsPopup from "./TransactionsPopup";
import { useTable } from "react-table";
import { useMemo } from "react";

export const Transactions = () => {
  const {
    balance,
    togglePopup,
    popup,

    tableData,
  } = useSupabase();

  const data = tableData;

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
