import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  FileSpreadsheetIcon,
  FileDownIcon,
  Download,
} from "lucide-react";

const ExportButtons = ({ reader, startTime, endTime, fetchExportData }) => {
  const [exporting, setExporting] = useState(null); // 'csv' | 'excel' | 'pdf' | null
  const [progress, setProgress] = useState(0);

  // Simulate progress bar animation when exporting
  useEffect(() => {
    let interval;
    if (exporting) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 95) return prev + Math.random() * 10; // ramp up
          return prev;
        });
      }, 300);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [exporting]);

  const handleExport = async (type) => {
    setExporting(type);
    try {
      await fetchExportData({ type, readerName: reader, startTime, endTime });
      setProgress(100); // complete progress
      setTimeout(() => setExporting(null), 500); // small delay to show 100%
    } catch (err) {
      setExporting(null);
      setProgress(0);
    }
  };

  return (
    <section className="space-y-3">
      <h2 className="text-base md:text-lg font-semibold flex items-center gap-2">
        <Download className="h-5 w-5" /> Export
      </h2>

      <div className="flex flex-wrap gap-2">
        {["csv", "excel", "pdf"].map((type) => (
          <Button
            key={type}
            className="bg-zinc-800 border border-zinc-500 text-white relative"
            onClick={() => handleExport(type)}
            disabled={!!exporting || !reader || !startTime || !endTime}
          >
            {type === "csv" && <FileTextIcon className="w-4 h-4 mr-2" />}
            {type === "excel" && (
              <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
            )}
            {type === "pdf" && <FileDownIcon className="w-4 h-4 mr-2" />}
            {exporting === type ? "Exporting..." : type.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Progress Bar */}
      {exporting && (
        <div className="w-full bg-zinc-700 rounded h-2 mt-2 overflow-hidden">
          <div
            className="bg-blue-500 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status text */}
      {exporting && (
        <p className="text-xs text-zinc-400 mt-1">
          Preparing {exporting.toUpperCase()} export… {Math.floor(progress)}%
        </p>
      )}
    </section>
  );
};

export default ExportButtons;
