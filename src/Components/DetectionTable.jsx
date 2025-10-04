import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/Components/ui/table";
import TableSkeleton from "./TableSkeleton";
import { Button } from "@/Components/ui/button";

const DetectionTable = ({ loading, error, slice, resetFilters }) => {
  // Format helper for date/time
  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB"); // DD/MM/YYYY
  const formatTime = (date) => new Date(date).toLocaleTimeString("en-GB"); // HH:MM:SS

  return (
    <section>
      <h2 className="text-base md:text-lg font-semibold mb-3">
        📋 Detection List
      </h2>
      <div className="overflow-x-auto border border-zinc-700 rounded-lg min-h-[300px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-900 border-b border-zinc-700">
              {[
                "TDR Tag Number",
                "Macsha ID",
                "Reader",
                "Date Read",
                "Time Read",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-white font-medium whitespace-nowrap"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && <TableSkeleton />}
            {error && !loading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-red-400"
                >
                  {error}
                  <div className="mt-2">
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && slice.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-zinc-400"
                >
                  No data found. Adjust your filters.
                  <div className="mt-2">
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              slice
                .filter((d) => d.TDRTagNumber) // Only show mapped rows
                .map((d, idx) => (
                  <TableRow
                    key={idx}
                    className="border-b border-zinc-800 hover:bg-zinc-900 transition"
                  >
                    {/* TDRTagNum */}
                    <TableCell>{d.TDRTagNumber}</TableCell>

                    {/* Macsha ID */}
                    <TableCell className="truncate whitespace-nowrap">
                      {d.MacshaTagNumber || "-"}
                    </TableCell>

                    {/* Reader */}
                    <TableCell>{d.ReaderName}</TableCell>

                    {/* Date Read */}
                    <TableCell>
                      {d.TimeRead ? formatDate(d.TimeRead) : "-"}
                    </TableCell>

                    {/* Time Read */}
                    <TableCell>
                      {d.TimeRead ? formatTime(d.TimeRead) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default DetectionTable;
