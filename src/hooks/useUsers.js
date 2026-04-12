import { useState, useMemo, useEffect } from "react";

const BASE_URL = 'http://192.168.1.5:8000/api';
const getToken = () => localStorage.getItem('adminToken');

export function useUsers() {
  const [users, setUsers]               = useState([]);
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState("all");
  const [selected, setSelected]         = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/admin/users/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: "flagged" } : u
    ));
    setSelected(null);
  };

  const exportCSV = () => {
    const headers = ["UserID", "Name", "Email", "Cluster", "Risk Level"];
    const rows = users.map(u => [
      u.id, u.name, u.email, u.cluster, u.risk_level
    ]);
    const csv = "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "users_report.csv";
    link.click();
  };

  const refreshDataset = () => {
    fetchUsers();
    setStatusMessage("Dataset refreshed.");
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        (u.name  ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? '').toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || u.risk_level === filter;
      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  const counts = useMemo(() => ({
    all:     users.length,
    safe:    users.filter(u => u.risk_level === "safe").length,
    caution: users.filter(u => u.risk_level === "caution").length,
    danger:  users.filter(u => u.risk_level === "danger").length,
  }), [users]);

  return {
    users,
    loading,
    search, setSearch,
    filter, setFilter,
    selected, setSelected,
    statusMessage,
    filtered,
    counts,
    deactivateUser,
    exportCSV,
    refreshDataset,
  };
}