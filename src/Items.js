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
    <div style={{ maxWidth: 700, margin: '30px auto' }}>
      <button onClick={onLogout} style={{ float: 'left' }}>تسجيل الخروج</button>
      <h2>جدول المواد</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="name" placeholder="اسم المادة" value={form.name} onChange={handleChange} required style={{ width: 120, marginRight: 5 }} />
    <input name="priceUSD" type="number" placeholder="السعر بالدولار" value={form.priceUSD} onChange={handleChange} style={{ width: 120, marginRight: 5 }} />
    <input name="priceIQD" type="number" placeholder="السعر بالدينار" value={form.priceIQD} onChange={handleChange} style={{ width: 120, marginRight: 5 }} />
        <input name="date" type="date" value={form.date} onChange={handleChange} required style={{ width: 140, marginRight: 5 }} />
        <button type="submit">{editId ? 'تعديل' : 'إضافة'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', priceUSD: '', priceIQD: '', date: '' }); }}>إلغاء</button>}
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table border="1" cellPadding="6" style={{ width: '100%', textAlign: 'center' }}>
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
