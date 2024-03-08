import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { useTable } from "react-table";
import useSupabase from "../Hooks/useSupabase";
import { Savingstype } from "../SupabaseContext/Supabase";
import useLocalStorage from "../Hooks/useLocalStorage";
import { useEffect, useMemo } from "react";

const TransactionsTable = () => {
  const { setEditData, togglePopup, allTransactions, accSavings } =
    useSupabase();

  const initializedAccSavings: Savingstype[] = accSavings || [];

  const { storedValue1, removeItem, setValue } = useLocalStorage(
    "transactions",
    allTransactions,
    "savings",
    initializedAccSavings
  );

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

  useEffect(() => {
    setValue("transactions", allTransactions);
  }, [allTransactions]);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
              <td>
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransactionsTable;
