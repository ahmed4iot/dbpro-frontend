
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
  const res = await fetch('https://dbpro-backend.onrender.com/api/login', {
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      transition: 'background 0.5s',
    }}>
      <form onSubmit={handleSubmit} style={{
        maxWidth: 350,
        width: '100%',
        background: 'rgba(255,255,255,0.95)',
        padding: 32,
        borderRadius: 18,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
  <img src="/logo.png" alt="Logo" style={{ marginBottom: 18, borderRadius: '50%', boxShadow: '0 2px 8px #ccc', width: 80, height: 80, objectFit: 'cover' }} />
        <h2 style={{ marginBottom: 18, color: '#2575fc', letterSpacing: 1 }}>تسجيل الدخول</h2>
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{
            width: '100%',
            marginBottom: 14,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #bdbdbd',
            fontSize: 16,
            transition: 'box-shadow 0.2s',
            boxShadow: '0 1px 2px #eee',
            outline: 'none',
          }}
          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2575fc44'}
          onBlur={e => e.target.style.boxShadow = '0 1px 2px #eee'}
        />
        <input
          type="password"
          placeholder="كلمة السر"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            marginBottom: 18,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #bdbdbd',
            fontSize: 16,
            transition: 'box-shadow 0.2s',
            boxShadow: '0 1px 2px #eee',
            outline: 'none',
          }}
          onFocus={e => e.target.style.boxShadow = '0 0 0 2px #2575fc44'}
          onBlur={e => e.target.style.boxShadow = '0 1px 2px #eee'}
        />
        <button type="submit" style={{
          width: '100%',
          padding: '12px 0',
          background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 'bold',
          letterSpacing: 1,
          boxShadow: '0 2px 8px #bdbdbd44',
          cursor: 'pointer',
          marginBottom: 8,
          transition: 'transform 0.15s, box-shadow 0.2s',
        }}
        onMouseOver={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 4px 16px #2575fc33'; }}
        onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 2px 8px #bdbdbd44'; }}
        >دخول</button>
        {error && <div style={{ color: '#e53935', marginTop: 10, fontWeight: 'bold' }}>{error}</div>}
      </form>
    </div>
  );
}
