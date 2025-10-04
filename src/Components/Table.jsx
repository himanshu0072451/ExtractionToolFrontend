import React, { useState, useEffect } from "react";
import Filters from "@/Components/Filters";
import ExportButtons from "@/Components/ExportButtons";
import DetectionTable from "@/Components/DetectionTable";
import PaginationFooter from "@/Components/PaginationFooter";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

// Export function with token
const fetchExportData = async ({ type, readerName, startTime, endTime }) => {
  try {
    const toastId = toast.loading(`Exporting ${type.toUpperCase()}...`);
    const formattedStart = startTime.replace("T", " ");
    const formattedEnd = endTime.replace("T", " ");
    const params = new URLSearchParams({
      readerName,
      startTime: formattedStart,
      endTime: formattedEnd,
    });

    const token = localStorage.getItem("token");
    const url = `https://extractiontool.onrender.com/api/export/${type}?${params.toString()}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      toast.info("No data to export.");
      return;
    }

    if (!response.ok) {
      if (response.status === 401) {
        toast.error("Session expired, login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const urlObject = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = urlObject;
    a.download = `export.${type === "excel" ? "xlsx" : type}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(urlObject);

    toast.success(`Exported ${type.toUpperCase()} file successfully.`, {
      id: toastId,
    });
  } catch (error) {
    console.error("Export failed:", error);
    toast.error("Export failed: " + error.message);
  }
};

export default function DeviceTable() {
  const [reader, setReader] = useState("");
  const [readerOptions, setReaderOptions] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("User");

  // Data is now **paged**
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [readerName, setReaderName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch reader names (secure)
  useEffect(() => {
    const fetchReaderNames = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://extractiontool.onrender.com/api/export/getReaderName",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired, login again.");
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to fetch reader names");
        }

        const data = await res.json();
        setReaderOptions(data);
      } catch (err) {
        console.error("Failed to fetch reader names:", err);
        toast.error("Failed to fetch reader names.");
      } finally {
        setLoading(false);
      }
    };

    fetchReaderNames();
  }, []);

  // Fetch paginated data
  const fetchData = async (pageOverride = 1) => {
    if (!reader || !startTime || !endTime) {
      setError("Please select reader and time range.");
      toast.warning("Please select reader and time range.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const formattedStart = startTime.replace("T", " ");
      const formattedEnd = endTime.replace("T", " ");

      const url = `https://extractiontool.onrender.com/api/export/data?readerName=${reader}&startTime=${formattedStart}&endTime=${formattedEnd}&page=${pageOverride}&limit=${rowsPerPage}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Session expired, login again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch data.");
      }

      const json = await res.json();
      setData(json.data); // Only current page
      setTotal(json.total); // Total count for pagination
      setPage(pageOverride);

      json.data.length === 0
        ? toast.error(`No data found. Adjust your filters`)
        : toast.success(`Loaded ${json.data.length} record(s) successfully.`);
    } catch (err) {
      setError(err.message);
      setData([]);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setReader("");
    setStartTime("");
    setEndTime("");
    setData([]);
    setPage(1);
    setError("");
    toast.info("Filters reset.");
  };

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      setUsername("User");
    }
  }, []);

  const pages = Math.ceil(total / rowsPerPage);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-10 space-y-10 relative">
      {/* Welcome Message */}
      <div className="mb-2 text-center sm:text-left">
        <p className="text-lg sm:text-2xl font-medium">
          Welcome, <span className="text-blue-400">{username}</span>
        </p>
      </div>

      {/* Header with Logout */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        {/* Title + Subtitle */}
        <div className="text-center sm:text-left space-y-2 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            RFID Detection Panel
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Select reader and time range, then press Load Data to fetch
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            toast.success("Logged out");
            setTimeout(() => (window.location.href = "/login"), 500);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md transition w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <Filters
        reader={reader}
        setReader={setReader}
        readerOptions={readerOptions}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        fetchData={() => fetchData(1)}
        loading={loading}
        setreaderName={setReaderName}
      />

      {/* Export Buttons */}
      <ExportButtons
        reader={reader}
        startTime={startTime}
        endTime={endTime}
        fetchExportData={fetchExportData}
      />

      {/* Table */}
      <DetectionTable
        loading={loading}
        error={error}
        slice={data}
        resetFilters={resetFilters}
        readerName={readerName}
      />

      {/* Pagination */}
      {data.length > 0 && (
        <PaginationFooter
          page={page}
          setPage={(p) => fetchData(p)}
          pages={pages}
          total={total}
          sliceLength={data.length}
        />
      )}
    </div>
  );
}
