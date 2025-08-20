
import React, { useState, useEffect } from 'react';

export default function Items({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', priceUSD: '', priceIQD: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchItems = React.useCallback(async () => {
    const res = await fetch('https://dbpro-backend.onrender.com/api/items', {
      headers: { Authorization: 'Bearer ' + token }
    });
    setItems(await res.json());
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editId ? 'PUT' : 'POST';
  const url = editId ? `https://dbpro-backend.onrender.com/api/items/${editId}` : 'https://dbpro-backend.onrender.com/api/items';
      // تحويل القيم الرقمية
        // إرسال القيم كما هي أو null إذا كانت فارغة
        const body = {
          ...form,
          priceUSD: form.priceUSD === '' ? null : Number(form.priceUSD),
          priceIQD: form.priceIQD === '' ? null : Number(form.priceIQD)
        };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('خطأ في الحفظ');
      setForm({ name: '', priceUSD: '', priceIQD: '', date: '' });
      setEditId(null);
      fetchItems();
    } catch {
      setError('فشل العملية');
    }
  };

  const handleEdit = item => {
    setForm({ name: item.name, priceUSD: item.priceUSD, priceIQD: item.priceIQD, date: item.date.slice(0,10) });
    setEditId(item._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('تأكيد الحذف؟')) return;
  await fetch(`https://dbpro-backend.onrender.com/api/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    });
    fetchItems();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
      padding: '0',
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
  <img src="/logo.png" alt="Logo" style={{ margin: '36px 0 10px', borderRadius: '50%', boxShadow: '0 2px 8px #185a9d44', width: 90, height: 90, objectFit: 'cover' }} />
      <button onClick={onLogout} style={{ position: 'absolute', left: 24, top: 24, background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px #e5393544', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#b71c1c'} onMouseOut={e => e.target.style.background = '#e53935'}>تسجيل الخروج</button>
      <h2 style={{ textAlign: 'center', margin: '10px 0 24px', color: '#185a9d', letterSpacing: 1, fontWeight: 700 }}>جدول المواد</h2>
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
        padding: 24,
        marginBottom: 24,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        maxWidth: 700,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <input name="name" placeholder="اسم المادة" value={form.name} onChange={handleChange} required style={{ flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15, transition: 'box-shadow 0.2s', boxShadow: '0 1px 2px #eee', outline: 'none' }} onFocus={e => e.target.style.boxShadow = '0 0 0 2px #43cea244'} onBlur={e => e.target.style.boxShadow = '0 1px 2px #eee'} />
        <input name="priceUSD" type="number" placeholder="السعر بالدولار" value={form.priceUSD} onChange={handleChange} style={{ flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15, transition: 'box-shadow 0.2s', boxShadow: '0 1px 2px #eee', outline: 'none' }} onFocus={e => e.target.style.boxShadow = '0 0 0 2px #43cea244'} onBlur={e => e.target.style.boxShadow = '0 1px 2px #eee'} />
        <input name="priceIQD" type="number" placeholder="السعر بالدينار" value={form.priceIQD} onChange={handleChange} style={{ flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15, transition: 'box-shadow 0.2s', boxShadow: '0 1px 2px #eee', outline: 'none' }} onFocus={e => e.target.style.boxShadow = '0 0 0 2px #43cea244'} onBlur={e => e.target.style.boxShadow = '0 1px 2px #eee'} />
        <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 15, transition: 'box-shadow 0.2s', boxShadow: '0 1px 2px #eee', outline: 'none' }} onFocus={e => e.target.style.boxShadow = '0 0 0 2px #43cea244'} onBlur={e => e.target.style.boxShadow = '0 1px 2px #eee'} />
        <button type="submit" style={{ padding: '12px 24px', background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', letterSpacing: 1, boxShadow: '0 2px 8px #43cea244', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.2s' }} onMouseOver={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 4px 16px #185a9d33'; }} onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 2px 8px #43cea244'; }}>{editId ? 'تعديل' : 'إضافة'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', priceUSD: '', priceIQD: '', date: '' }); }} style={{ padding: '12px 24px', background: '#bdbdbd', color: '#333', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', letterSpacing: 1, boxShadow: '0 2px 8px #bdbdbd44', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.2s' }} onMouseOver={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 4px 16px #bdbdbd33'; }} onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 2px 8px #bdbdbd44'; }}>إلغاء</button>}
      </form>
      {error && <div style={{ color: '#e53935', fontWeight: 'bold', marginBottom: 10 }}>{error}</div>}
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 16,
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        padding: 16,
        maxWidth: 700,
        width: '100%',
        overflowX: 'auto',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '10px 4px', border: '1px solid #ddd' }}>اسم المادة</th>
              <th style={{ padding: '10px 4px', border: '1px solid #ddd' }}>السعر بالدولار</th>
              <th style={{ padding: '10px 4px', border: '1px solid #ddd' }}>السعر بالدينار</th>
              <th style={{ padding: '10px 4px', border: '1px solid #ddd' }}>التاريخ</th>
              <th style={{ padding: '10px 4px', border: '1px solid #ddd' }}>تعديل</th>
              <th style={{ padding: '10px 4px', border: '1px solid #ddd' }}>حذف</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} style={{ transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#e3f2fd'} onMouseOut={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '8px 4px', border: '1px solid #ddd' }}>{item.name}</td>
                <td style={{ padding: '8px 4px', border: '1px solid #ddd' }}>{item.priceUSD} {item.priceUSD ? '$' : ''}</td>
                <td style={{ padding: '8px 4px', border: '1px solid #ddd' }}>{item.priceIQD} {item.priceIQD ? 'ID' : ''}</td>
                <td style={{ padding: '8px 4px', border: '1px solid #ddd' }}>{item.date.slice(0,10)}</td>
                <td style={{ padding: '8px 4px', border: '1px solid #ddd' }}><button onClick={() => handleEdit(item)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#125ea2'} onMouseOut={e => e.target.style.background = '#1976d2'}>تعديل</button></td>
                <td style={{ padding: '8px 4px', border: '1px solid #ddd' }}><button onClick={() => handleDelete(item._id)} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#b71c1c'} onMouseOut={e => e.target.style.background = '#e53935'}>حذف</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
