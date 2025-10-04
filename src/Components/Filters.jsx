import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const Filters = ({
  reader,
  setReader,
  readerOptions,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  rowsPerPage,
  setRowsPerPage,
  fetchData,
  loading,
  setreaderName,
}) => {
  return (
    <section className="space-y-4">
      <h2 className="text-base md:text-lg font-semibold flex gap-2 items-center">
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Reader Selector */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-zinc-400">Reader</label>
          <Select
            onValueChange={(val) => {
              setReader(val); // raw value
              const selected = readerOptions.find((opt) => opt.value === val);
              setreaderName(selected?.label || val); // pass label to table
            }}
            value={reader}
          >
            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
              <SelectValue placeholder="Select Reader" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white">
              {loading ? (
                <div className="px-4 py-2 text-sm text-zinc-400 animate-pulse">
                  Loading readers...
                </div>
              ) : readerOptions.length > 0 ? (
                readerOptions.map((name) => (
                  <SelectItem key={name.value} value={name.value}>
                    {name.label}
                  </SelectItem>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-zinc-400">
                  No readers found
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Start Time */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-zinc-400">Start Time</label>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white cursor-text"
          />
        </div>

        {/* End Time */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-zinc-400">End Time</label>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-white cursor-text"
          />
        </div>

        {/* Rows Per Page */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-zinc-400">Rows per page</label>
          <Select
            onValueChange={(v) => setRowsPerPage(+v)}
            value={rowsPerPage.toString()}
          >
            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 text-white">
              {[5, 10, 20].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Load Button */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm text-transparent">.</label> {/* Spacer */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
            onClick={fetchData}
          >
            Load Data
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Filters;
