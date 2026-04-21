import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, clearToken, setToken } from '../config';

function useLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [message,  setMessage]  = useState('');
  const [status,   setStatus]   = useState(''); // 'error' | 'success'
  const [loading,  setLoading]  = useState(false);
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setStatus('');

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username: email, password }),
      });

      console.log('[useLogin] Login status:', res.status);

      if (!res.ok) {
        const err = await res.json();
        console.error('[useLogin] Login error:', err);
        // ← handle both string and array detail
        if (Array.isArray(err.detail)) {
          throw new Error(err.detail.map((e) => e.msg).join(', '));
        }
        throw new Error(err.detail ?? 'Invalid credentials.');
      }

      const data = await res.json();
      console.log('[useLogin] Token received:', !!data.access_token);

      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!meRes.ok) throw new Error('Failed to verify admin status.');

      const me = await meRes.json();
      console.log('[useLogin] User:', me.username, '| is_admin:', me.is_admin);

      if (!me.is_admin) {
        throw new Error('Access denied. Admin accounts only.');
      }

      setToken(data.access_token);
      setMessage('Login successful! Redirecting...');
      setStatus('success');
      navigate('/dashboard');

    } catch (err) {
      console.error('[useLogin] Error:', err.message);
      // ← always convert to string
      setMessage(typeof err.message === 'string' ? err.message : JSON.stringify(err.message));
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    navigate('/login');
  };

  return {
    email,    setEmail,
    password, setPassword,
    message,
    status,
    loading,
    handleLogin,
    logout,
  };
}

export default useLogin;