import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Banners = ({ token }) => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("hero");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/banner/list", { params: { includeInactive: true } });
      if (res.data.success) setBanners(res.data.banners);
    } catch {}
  };

  useEffect(() => { fetchBanners(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) { toast.error("At least one image is required"); return; }
    if (!title.trim()) { toast.error("Title is required"); return; }
    try {
      setLoading(true);
      const form = new FormData();
      images.forEach(image => form.append("images", image));
      form.append("title", title);
      form.append("description", description);
      form.append("section", section);
      form.append("active", false); // Default to inactive
      const res = await axios.post(backendUrl + "/api/banner/add", form, { headers: { token } });
      if (res.data.success) {
        toast.success("Banner carousel added");
        setImages([]); setTitle(""); setDescription(""); setSection("hero");
        // Clear file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
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
      if (res.data.success) {
        toast.success(b.active ? "Banner deactivated" : "Banner activated");
        fetchBanners();
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const updateBanner = async (b, data) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/update", { id: b._id, ...data }, { headers: { token } });
      if (res.data.success) { toast.success("Updated"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to update");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const updateImageOrder = async (bannerId, newImages) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/update-order", { id: bannerId, images: newImages }, { headers: { token } });
      if (res.data.success) { toast.success("Image order updated"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to update order");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const removeImage = async (bannerId, imageIndex) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/remove-image", { id: bannerId, imageIndex }, { headers: { token } });
      if (res.data.success) { toast.success("Image removed"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to remove image");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const addMoreImages = async (bannerId, newImages) => {
    try {
      const form = new FormData();
      newImages.forEach(image => form.append("images", image));
      form.append("id", bannerId);
      const res = await axios.post(backendUrl + "/api/banner/add-images", form, { headers: { token } });
      if (res.data.success) { toast.success("Images added"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to add images");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex, banner) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...banner.images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Update order property
    newImages.forEach((img, idx) => img.order = idx);
    
    updateImageOrder(banner._id, newImages);
    setDraggedIndex(null);
  };

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/remove", { id }, { headers: { token } });
      if (res.data.success) { toast.success("Removed"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to remove");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Banners</h1>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 rounded border">
        <div>
          <label className="block text-sm mb-1">Banner Title *</label>
          <input className="border px-3 py-2 w-full" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Enter banner title" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea className="border px-3 py-2 w-full h-20 resize-none" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Enter banner description (optional)" />
        </div>
        <div>
          <label className="block text-sm mb-1">Section</label>
          <select className="border px-3 py-2" value={section} onChange={(e)=>setSection(e.target.value)}>
            <option value="hero">Hero Section</option>
            <option value="home">Home Section</option>
            <option value="footer">Footer Section</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Carousel Images * (Multiple images for carousel)</label>
          <input type="file" accept="image/*" multiple onChange={(e)=>setImages([...e.target.files])} />
          {images.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected {images.length} image{images.length > 1 ? 's' : ''}: {images.map(img => img.name).join(', ')}
            </div>
          )}
        </div>
        <button disabled={loading} className="bg-black text-white px-6 py-2 rounded disabled:opacity-60">{loading? 'Creating Carousel...' : 'Add Banner Carousel'}</button>
      </form>

      <h2 className="text-lg font-semibold mt-8 mb-3">Existing Banner Carousels</h2>
      <div className="grid md:grid-cols-1 gap-4">
        {banners.map((b)=> (
          <div key={b._id} className="bg-white border rounded p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-lg font-medium">{b.title || 'Untitled'}</div>
                <div className="text-sm text-gray-600">{b.description || 'No description'}</div>
                <div className="text-xs text-gray-500 mt-1">Section: {b.section} | {b.images?.length || 0} images</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${b.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {b.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <input type="checkbox" checked={b.active} onChange={()=>toggleActive(b)} />
                </div>
                <button onClick={()=>remove(b._id)} className="text-red-600 text-sm hover:text-red-800">Remove</button>
              </div>
            </div>
            
            {/* Carousel Images Preview with Edit Controls */}
            {b.images && b.images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Carousel Images: (Drag to reorder)</div>
                  <div className="flex gap-2">
                    <label className="bg-blue-600 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-700">
                      Add More Images
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                        if (e.target.files.length > 0) {
                          addMoreImages(b._id, [...e.target.files]);
                          e.target.value = '';
                        }
                      }} />
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {b.images.sort((a, b) => a.order - b.order).map((img, idx) => (
                    <div key={idx} className="relative group flex-shrink-0"
                         draggable
                         onDragStart={(e) => handleDragStart(e, idx)}
                         onDragOver={handleDragOver}
                         onDrop={(e) => handleDrop(e, idx, b)}>
                      <img src={img.url} alt={img.alt || b.title} className="w-24 h-16 object-cover rounded border cursor-move" />
                      <div className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">{idx + 1}</div>
                      {b.images.length > 1 && (
                        <button 
                          onClick={() => removeImage(b._id, idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white text-xs w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          title="Remove image"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Edit Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
              <div>
                <label className="block text-xs mb-1">Title</label>
                <input className="border px-2 py-1 text-sm w-full" defaultValue={b.title} onBlur={(e)=>updateBanner(b,{ title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs mb-1">Section</label>
                <select className="border px-2 py-1 text-sm w-full" defaultValue={b.section} onChange={(e)=>updateBanner(b,{ section: e.target.value })}>
                  <option value="hero">Hero</option>
                  <option value="home">Home</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1">Description</label>
                <textarea className="border px-2 py-1 text-sm w-full h-16 resize-none" defaultValue={b.description} onBlur={(e)=>updateBanner(b,{ description: e.target.value })} />
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No banner carousels created yet. Add your first carousel above.
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners; 