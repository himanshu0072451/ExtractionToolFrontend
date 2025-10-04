import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import axios from "axios";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [readers, setReaders] = useState([]);
  const [loadingReaders, setLoadingReaders] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    allowedReaders: "",
  });

  const [newReader, setNewReader] = useState({ readerId: "", readerName: "" });

  const [message, setMessage] = useState("");

  const fetchReaders = async () => {
    setLoadingReaders(true);
    try {
      const res = await axios.get("/readers", getAuthHeaders());
      setReaders(res.data);
    } catch (err) {
      console.error(err);
      setReaders([]);
    } finally {
      setLoadingReaders(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get("/admin/users", getAuthHeaders());
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchReaders();
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) {
      setMessage("Username and password are required");
      return;
    }
    try {
      await axios.post(
        "/admin/add-user",
        {
          username: newUser.username,
          password: newUser.password,
          allowedReaders: newUser.allowedReaders
            ? newUser.allowedReaders.split(",").map((r) => r.trim())
            : [],
        },
        getAuthHeaders()
      );
      setMessage("User added successfully");
      setNewUser({ username: "", password: "", allowedReaders: "" });
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add user");
    }
  };

  const handleAddReader = async () => {
    if (!newReader.readerId || !newReader.readerName) {
      setMessage("Reader ID and Name are required");
      return;
    }
    try {
      await axios.post("/admin/add-reader", newReader, getAuthHeaders());
      setMessage("Reader added successfully");
      setNewReader({ readerId: "", readerName: "" });
      fetchReaders();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add reader");
    }
  };

  return (
    <section className="space-y-6 text-gray-100 bg-black min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
        ⚙️ Admin Portal
      </h1>

      {message && (
        <div className="text-gray-300 font-medium border border-gray-700 bg-black/40 p-2 rounded">
          {message}
        </div>
      )}

      {/* Add User Form */}
      <div className="border border-gray-700 rounded-lg p-4 space-y-3 bg-black/30">
        <h2 className="font-semibold text-white">➕ Add New User</h2>
        <div className="flex flex-wrap gap-2">
          <Input
            className="bg-black border border-gray-600 text-white placeholder-gray-500"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <Input
            type="password"
            className="bg-black border border-gray-600 text-white placeholder-gray-500"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <Input
            className="bg-black border border-gray-600 text-white placeholder-gray-500"
            placeholder="Allowed Readers (comma separated)"
            value={newUser.allowedReaders}
            onChange={(e) =>
              setNewUser({ ...newUser, allowedReaders: e.target.value })
            }
          />
          <Button className="bg-gray-800 text-white hover:bg-gray-700">
            Add User
          </Button>
        </div>
      </div>

      {/* Add Reader Form */}
      <div className="border border-gray-700 rounded-lg p-4 space-y-3 bg-black/30">
        <h2 className="font-semibold text-white">➕ Add New Reader</h2>
        <div className="flex flex-wrap gap-2">
          <Input
            className="bg-black border border-gray-600 text-white placeholder-gray-500"
            placeholder="Reader ID"
            value={newReader.readerId}
            onChange={(e) =>
              setNewReader({ ...newReader, readerId: e.target.value })
            }
          />
          <Input
            className="bg-black border border-gray-600 text-white placeholder-gray-500"
            placeholder="Reader Name"
            value={newReader.readerName}
            onChange={(e) =>
              setNewReader({ ...newReader, readerName: e.target.value })
            }
          />
          <Button className="bg-gray-800 text-white hover:bg-gray-700">
            Add Reader
          </Button>
        </div>
      </div>

      {/* List Readers */}
      <div className="border border-gray-700 rounded-lg p-4 bg-black/30">
        <h2 className="font-semibold mb-2 text-white">📋 Readers List</h2>
        <div className="overflow-x-auto min-h-[150px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 border-b border-gray-700">
                {["Reader ID", "Reader Name"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-gray-200 font-medium whitespace-nowrap"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingReaders ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center py-6 text-gray-400"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : Object.keys(readers).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center py-6 text-gray-500"
                  >
                    No readers found
                  </TableCell>
                </TableRow>
              ) : (
                Object.entries(readers).map(([id, name]) => (
                  <TableRow
                    key={id}
                    className="border-b border-gray-800 hover:bg-gray-900 transition"
                  >
                    <TableCell className="text-white">{id}</TableCell>
                    <TableCell className="text-gray-300">{name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
