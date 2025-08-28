import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Content = ({ token }) => {
  const [page, setPage] = useState('global');
  const [items, setItems] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const fetch = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/page/list', { params: { page } });
      if (res.data.success) setItems(res.data.items);
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  useEffect(() => { fetch(); }, [page]);

  const saveItem = async (key, value) => {
    try {
      const res = await axios.post(backendUrl + '/api/page/upsert', { page, key, value }, { headers: { token } });
      if (res.data.success) { toast.success('Saved'); fetch(); }
      else toast.error(res.data.message || 'Failed to save');
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newKey) { toast.error('Key required'); return; }
    await saveItem(newKey, newValue);
    setNewKey(''); setNewValue('');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Content Management</h1>
      <div className="bg-white p-4 rounded border mb-4 flex items-center gap-3">
        <label>Page</label>
        <select className="border px-3 py-2" value={page} onChange={(e)=>setPage(e.target.value)}>
          <option value="global">Global</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
          <option value="collection">Collection</option>
        </select>
      </div>

      <div className="bg-white p-4 rounded border mb-6">
        <h2 className="font-medium mb-3">Existing Content</h2>
        <div className="space-y-3">
          {items.map((it)=> (
            <div key={it._id} className="grid md:grid-cols-3 gap-2 items-center">
              <div className="text-sm font-medium break-words">{it.key}</div>
              <input className="border px-2 py-1 text-sm md:col-span-2" defaultValue={typeof it.value === 'string' ? it.value : JSON.stringify(it.value)} onBlur={(e)=>saveItem(it.key, e.target.value)} />
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-gray-500">No items yet.</div>}
        </div>
      </div>

      <form onSubmit={addItem} className="bg-white p-4 rounded border">
        <h2 className="font-medium mb-3">Add New</h2>
        <div className="grid md:grid-cols-3 gap-2 items-center mb-3">
          <input className="border px-2 py-1 text-sm" placeholder="key (e.g., siteName)" value={newKey} onChange={(e)=>setNewKey(e.target.value)} />
          <input className="border px-2 py-1 text-sm md:col-span-2" placeholder="value" value={newValue} onChange={(e)=>setNewValue(e.target.value)} />
        </div>
        <button className="bg-black text-white px-6 py-2 rounded">Add/Save</button>
      </form>
    </div>
  );
};

export default Content; 