import React from "react";
import { themeClass } from "./theme-config";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T, index: number) => React.ReactNode;
}

interface PaginatedTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  isDark?: boolean;
  itemsPerPage?: number;
  emptyMessage?: string;
}

function PaginatedTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  isDark = false,
  itemsPerPage = 10,
  emptyMessage = "No records found.",
}: PaginatedTableProps<T>) {
  const [page, setPage] = React.useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div
      className={`overflow-x-auto shadow-md rounded-xl ${
        isDark ? "bg-slate-800 border border-slate-700" : "bg-white"
      }`}
    >
      <table className="min-w-full divide-y divide-slate-200">
        <thead
          className={
            isDark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"
          }
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody
          className={
            isDark
              ? "divide-y divide-slate-700 text-slate-200"
              : "divide-y divide-slate-200 text-slate-700"
          }
        >
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-sm">
                Loading...
              </td>
            </tr>
          ) : currentData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            currentData.map((item, rowIndex) => (
              <tr
                key={item.id}
                className={`${
                  isDark
                    ? "hover:bg-slate-700 transition-colors"
                    : "hover:bg-slate-50 transition-colors"
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {col.render
                      ? col.render(item, startIndex + rowIndex)
                      : (item[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`flex justify-between items-center px-6 py-3 border-t ${
            isDark ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600"
          }`}
        >
          <span className="text-xs">
            Page {page} of {totalPages}
          </span>

          <div className="flex space-x-2">
            <button
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              className={`px-3 py-1 rounded-md border text-xs ${
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : isDark
                  ? "border-slate-600 hover:bg-slate-700"
                  : "border-slate-300 hover:bg-slate-100"
              }`}
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
              className={`px-3 py-1 rounded-md border text-xs ${
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : isDark
                  ? "border-slate-600 hover:bg-slate-700"
                  : "border-slate-300 hover:bg-slate-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaginatedTable;
