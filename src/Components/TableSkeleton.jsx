// components/TableSkeleton.jsx
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

const TableSkeleton = ({ columns = 9, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow
          key={rowIdx}
          className="animate-pulse border-b border-zinc-800"
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <div className="h-4 w-3/4 bg-zinc-800 rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
