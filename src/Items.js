
import React, { useState, useEffect } from 'react';

export default function Items({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', priceUSD: '', priceIQD: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchItems = async () => {
  const res = await fetch('https://dbpro-backend.onrender.com/api/items', {
      headers: { Authorization: 'Bearer ' + token }
    });
    setItems(await res.json());
  };

  useEffect(() => { fetchItems(); }, []);

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
    <div className="responsive-container">
      <style>{`
        .responsive-container {
          max-width: 700px;
          margin: 30px auto;
          padding: 10px;
        }
        .responsive-form {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .responsive-form input, .responsive-form button {
          font-size: 1rem;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .responsive-form button {
          background: #1976d2;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .responsive-form button:hover {
          background: #125ea2;
        }
        .responsive-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 1rem;
        }
        .responsive-table th, .responsive-table td {
          padding: 8px 4px;
          border: 1px solid #ddd;
        }
        .responsive-table th {
          background: #f5f5f5;
        }
        @media (max-width: 600px) {
          .responsive-container {
            max-width: 98vw;
            padding: 2vw;
          }
          .responsive-form {
            flex-direction: column;
            gap: 10px;
          }
          .responsive-table, .responsive-table thead, .responsive-table tbody, .responsive-table th, .responsive-table td, .responsive-table tr {
            display: block;
            width: 100%;
          }
          .responsive-table tr {
            margin-bottom: 15px;
            border-bottom: 2px solid #eee;
          }
          .responsive-table th {
            display: none;
          }
          .responsive-table td {
            text-align: right;
            position: relative;
            padding-left: 50%;
            min-height: 32px;
          }
          .responsive-table td:before {
            position: absolute;
            left: 10px;
            top: 8px;
            white-space: nowrap;
            font-weight: bold;
            color: #1976d2;
          }
          .responsive-table td:nth-child(1):before { content: 'اسم المادة'; }
          .responsive-table td:nth-child(2):before { content: 'السعر بالدولار'; }
          .responsive-table td:nth-child(3):before { content: 'السعر بالدينار'; }
          .responsive-table td:nth-child(4):before { content: 'التاريخ'; }
          .responsive-table td:nth-child(5):before { content: 'تعديل'; }
          .responsive-table td:nth-child(6):before { content: 'حذف'; }
        }
      `}</style>
      <button onClick={onLogout} style={{ float: 'left', marginBottom: 10 }}>تسجيل الخروج</button>
      <h2 style={{ textAlign: 'center', margin: '10px 0 20px' }}>جدول المواد</h2>
      <form onSubmit={handleSubmit} className="responsive-form">
  <input name="name" placeholder="اسم المادة" value={form.name} onChange={handleChange} required />
  <input name="priceUSD" type="number" placeholder="السعر بالدولار" value={form.priceUSD} onChange={handleChange} />
  <input name="priceIQD" type="number" placeholder="السعر بالدينار" value={form.priceIQD} onChange={handleChange} />
  <input name="date" type="date" value={form.date} onChange={handleChange} required />
  <button type="submit">{editId ? 'تعديل' : 'إضافة'}</button>
  {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', priceUSD: '', priceIQD: '', date: '' }); }}>إلغاء</button>}
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
  <table className="responsive-table" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>اسم المادة</th>
            <th>السعر بالدولار</th>
            <th>السعر بالدينار</th>
            <th>التاريخ</th>
            <th>تعديل</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.priceUSD}</td>
              <td>{item.priceIQD}</td>
              <td>{item.date.slice(0,10)}</td>
              <td><button onClick={() => handleEdit(item)}>تعديل</button></td>
              <td><button onClick={() => handleDelete(item._id)}>حذف</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
