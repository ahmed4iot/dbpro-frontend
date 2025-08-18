import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token);
      } else {
        setError(data.message || 'خطأ في تسجيل الدخول');
      }
    } catch {
      setError('فشل الاتصال بالخادم');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>تسجيل الدخول</h2>
      <input type="text" placeholder="اسم المستخدم" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', marginBottom: 10 }} />
      <input type="password" placeholder="كلمة السر" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 10 }} />
      <button type="submit" style={{ width: '100%' }}>دخول</button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </form>
  );
}
