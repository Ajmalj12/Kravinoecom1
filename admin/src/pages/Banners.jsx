import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Banners = ({ token }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [productId, setProductId] = useState("");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState("home");

  const fetchBanners = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/banner/list", { params: { includeInactive: true } });
      if (res.data.success) setBanners(res.data.banners);
    } catch {}
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/product/list");
      if (res.data.success) setProducts(res.data.products);
    } catch {}
  };

  useEffect(() => { fetchBanners(); fetchProducts(); }, []);

  const filtered = products.filter(p => {
    const t = (p.name + " " + p._id).toLowerCase();
    return t.includes(query.toLowerCase());
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image || !productId) { toast.error("Image and Product required"); return; }
    try {
      setLoading(true);
      const form = new FormData();
      form.append("image", image);
      form.append("productId", productId);
      form.append("title", title);
      form.append("position", position);
      const res = await axios.post(backendUrl + "/api/banner/add", form, { headers: { token } });
      if (res.data.success) {
        toast.success("Banner added");
        setImage(null); setTitle(""); setProductId(""); setQuery(""); setOpen(false); setPosition("home");
        fetchBanners();
      } else {
        toast.error(res.data.message || "Failed to add");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally { setLoading(false); }
  };

  const toggleActive = async (b) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/update", { id: b._id, active: !b.active }, { headers: { token } });
      if (res.data.success) fetchBanners();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const updateBanner = async (b, data) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/update", { id: b._id, ...data }, { headers: { token } });
      if (res.data.success) { toast.success("Updated"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to update");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/remove", { id }, { headers: { token } });
      if (res.data.success) { toast.success("Removed"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to remove");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const ProductPicker = ({ value, onChange }) => {
    const [q, setQ] = useState("");
    const [o, setO] = useState(false);
    const items = products.filter(p => (p.name + " " + p._id).toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="relative">
        <div className="border rounded">
          <input
            value={q}
            onChange={(e)=>{ setQ(e.target.value); setO(true); }}
            onFocus={()=>setO(true)}
            placeholder={value ? products.find(p=>p._id===value)?.name + " ("+String(value).slice(-6)+")" : "Search product"}
            className="w-full px-2 py-1 text-sm outline-none"
          />
        </div>
        {o && (
          <div className="absolute z-10 mt-1 w-full max-h-52 overflow-auto bg-white border rounded shadow">
            {items.slice(0,20).map(p => (
              <div key={p._id} className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm" onMouseDown={()=>{ onChange(p._id); setQ(p.name); setO(false); }}>
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-gray-500">{p._id}</div>
              </div>
            ))}
            {items.length===0 && <div className="px-2 py-1 text-xs text-gray-500">No results</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Banners</h1>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded border">
        <div>
          <label className="block text-sm mb-1">Title (optional)</label>
          <input className="border px-3 py-2 w-full" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Select Product</label>
          <ProductPicker value={productId} onChange={setProductId} />
        </div>
        <div>
          <label className="block text-sm mb-1">Position</label>
          <select className="border px-3 py-2" value={position} onChange={(e)=>setPosition(e.target.value)}>
            <option value="top">Top banner (site-wide)</option>
            <option value="home">Home banner</option>
            <option value="footer">Footer banner</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Banner Image</label>
          <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files[0])} />
        </div>
        <button disabled={loading} className="bg-black text-white px-6 py-2 rounded disabled:opacity-60">{loading? 'Uploading...' : 'Add Banner'}</button>
      </form>

      <h2 className="text-lg font-semibold mt-8 mb-3">Existing Banners</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {banners.map((b)=> (
          <div key={b._id} className="bg-white border rounded p-3 space-y-2">
            <div className="flex items-center gap-3">
              <img src={b.image} alt={b.title} className="w-24 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="text-sm font-medium">{b.title || 'Untitled'}</div>
                <div className="text-xs text-gray-500">Product: {b.productId}</div>
              </div>
              <button onClick={()=>remove(b._id)} className="text-red-600 text-sm">Remove</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <input className="border px-2 py-1 text-sm" defaultValue={b.title} onBlur={(e)=>updateBanner(b,{ title: e.target.value })} />
              <select className="border px-2 py-1 text-sm" defaultValue={b.position} onChange={(e)=>updateBanner(b,{ position: e.target.value })}>
                <option value="top">Top</option>
                <option value="home">Home</option>
                <option value="footer">Footer</option>
              </select>
              <div className="flex items-center gap-2">
                <label className="text-sm">Active</label>
                <input type="checkbox" checked={b.active} onChange={()=>toggleActive(b)} />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1">Change product</label>
              <ProductPicker value={b.productId} onChange={(val)=>updateBanner(b,{ productId: val })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners; 