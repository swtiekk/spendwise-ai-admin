import { useState, useMemo } from "react";
import { mockUsers } from "../data/mockData";

export function useUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const deactivateUser = (id) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, status: "flagged" } : u
    );
    setUsers(updated);
    setSelected(null);
  };

  const exportCSV = () => {
    const headers = ["UserID","Income","Spent","Savings","Score","Alerts"];
    const rows = users.map(u => [
      u.id, u.income, u.spent, u.savings, u.spendingScore, u.alerts
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers,...rows].map(e=>e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "users_report.csv";
    link.click();
  };

  const refreshDataset = () => {
    setStatusMessage("Dataset refreshed. ML retraining started.");
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || u.status === filter;
      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  const counts = useMemo(() => ({
    all: users.length,
    active: users.filter(u => u.status === "active").length,
    warning: users.filter(u => u.status === "warning").length,
    flagged: users.filter(u => u.status === "flagged").length,
  }), [users]);

  return {
    users,
    search, setSearch,
    filter, setFilter,
    selected, setSelected,
    statusMessage,
    filtered,
    counts,
    deactivateUser,
    exportCSV,
    refreshDataset
  };
}