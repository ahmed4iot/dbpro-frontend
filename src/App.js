import React, { useState } from 'react';
import Login from './Login';
import Items from './Items';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (tok) => {
    setToken(tok);
    localStorage.setItem('token', tok);
  };
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return token ? <Items token={token} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}

export default App;
