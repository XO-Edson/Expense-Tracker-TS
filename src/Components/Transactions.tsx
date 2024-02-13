import { useSupabase } from "../SupabaseContext/Supabase";
import Sidebar from "./Sidebar";
import Popup from "./Popup";
import { useTable } from "react-table";
import { useMemo, useState } from "react";
import DateTimePicker from "react-datetime-picker";

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
        ],
        []
      ),
    });

  const [value, setValue] = useState(new Date());

  return (
    <main>
      <Sidebar userEmail={""} />
      <section>
        <h2>TRANSACTIONS</h2>
        <button onClick={togglePopup}>Add Transaction</button>
        {popup && <Popup />}

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

          {/*  {allTransactions.map((trans, index) => (
            <ul key={index}>
              <li>{trans.category}</li>
              <li>{trans.amount}</li>
            </ul>
          ))} */}
        </section>
      </section>
      <section>
        <div className="card">
          <h5>Available Balance</h5>

          <h1>$ {balance()}</h1>
          <p>**** 1234</p>
        </div>

        <div>
          <DateTimePicker onChange={setValue} value={value} />
        </div>
      </section>
    </main>
  );
};
