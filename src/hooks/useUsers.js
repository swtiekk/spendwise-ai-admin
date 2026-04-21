import { useState, useMemo, useEffect } from 'react';
import { BASE_URL, getToken } from '../config';

export function useUsers() {
  const [users,         setUsers]         = useState([]);
  const [search,        setSearch]        = useState('');
  const [filter,        setFilter]        = useState('all');
  const [selected,      setSelected]      = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? 'Failed to load users.');
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Note: FastAPI has no deactivate endpoint yet — updates local state only
  const deactivateUser = async (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: 'flagged' } : u
    ));
    setSelected(null);
    setStatusMessage('User flagged (local only — add DELETE /admin/users/:id to backend to persist).');
  };

  const exportCSV = () => {
    const headers = ['UserID', 'Name', 'Email', 'Income Type', 'Income Cycle', 'Date Joined'];
    const rows = users.map(u => [
      u.id,
      u.name        ?? '',
      u.email       ?? '',
      u.income_type  ?? 'N/A',
      u.income_cycle ?? 'N/A',
      u.date_joined  ?? '',
    ]);
    const csv = 'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.href     = encodeURI(csv);
    link.download = 'users_report.csv';
    link.click();
  };

  const refreshDataset = () => {
    fetchUsers();
    setStatusMessage('Dataset refreshed.');
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        (u.name  ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? '').toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || u.income_type === filter;
      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  const counts = useMemo(() => ({
    all:    users.length,
    salary: users.filter(u => u.income_type === 'salary').length,
    freelance: users.filter(u => u.income_type === 'freelance').length,
    other:  users.filter(u => u.income_type === 'other').length,
  }), [users]);

  return {
    users,
    loading,
    error,
    search,        setSearch,
    filter,        setFilter,
    selected,      setSelected,
    statusMessage,
    filtered,
    counts,
    deactivateUser,
    exportCSV,
    refreshDataset,
  };
}