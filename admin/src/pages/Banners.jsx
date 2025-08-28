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
  const [imageTexts, setImageTexts] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  const [editImageTexts, setEditImageTexts] = useState([]);
  const [editImageLinks, setEditImageLinks] = useState([]);

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
      
      // Add image texts and links
      imageTexts.forEach((text, index) => {
        form.append(`imageText_${index}`, text || '');
      });
      imageLinks.forEach((link, index) => {
        form.append(`imageLink_${index}`, link || '');
      });
      
      const res = await axios.post(backendUrl + "/api/banner/add", form, { headers: { token } });
      if (res.data.success) {
        toast.success("Banner carousel added");
        setImages([]); setTitle(""); setDescription(""); setSection("hero");
        setImageTexts([]); setImageLinks([]);
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

  const startEdit = (banner) => {
    setEditingBanner(banner);
    setEditImageTexts(banner.images.map(img => img.text || ''));
    setEditImageLinks(banner.images.map(img => img.link || ''));
  };

  const cancelEdit = () => {
    setEditingBanner(null);
    setEditImageTexts([]);
    setEditImageLinks([]);
  };

  const saveEdit = async () => {
    try {
      const form = new FormData();
      form.append("id", editingBanner._id);
      form.append("title", editingBanner.title);
      form.append("description", editingBanner.description);
      form.append("section", editingBanner.section);
      form.append("active", editingBanner.active);

      // Add image texts and links for existing images
      editImageTexts.forEach((text, index) => {
        form.append(`imageText_${index}`, text || '');
      });
      editImageLinks.forEach((link, index) => {
        form.append(`imageLink_${index}`, link || '');
      });

      // Update images with new text/link data
      const updatedImages = editingBanner.images.map((img, index) => ({
        ...img,
        text: editImageTexts[index] || '',
        link: editImageLinks[index] || ''
      }));

      // Use updateImageOrder to update the banner with new image data
      const res = await axios.post(backendUrl + "/api/banner/update-order", {
        id: editingBanner._id,
        images: updatedImages
      }, { headers: { token } });

      if (res.data.success) {
        toast.success("Banner updated successfully");
        setEditingBanner(null);
        setEditImageTexts([]);
        setEditImageLinks([]);
        fetchBanners();
      } else {
        toast.error(res.data.message || "Failed to update");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const remove = async (id) => {
    try {
      const res = await axios.post(backendUrl + "/api/banner/remove", { id }, { headers: { token } });
      if (res.data.success) { toast.success("Removed"); fetchBanners(); }
      else toast.error(res.data.message || "Failed to remove");
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Banner Management</h1>
      
      {/* CREATE NEW BANNER FORM */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800">🎨 Create New Banner Carousel</h2>
        <form onSubmit={onSubmit} className="space-y-6">
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
            <option value="top">Top Banner (Between Latest & Live Offers)</option>
            <option value="middle">Middle Banner (Between Live Offers & Best Sellers)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Carousel Images * (Multiple images for carousel)</label>
          <input type="file" accept="image/*" multiple onChange={(e)=>{
            const files = [...e.target.files];
            setImages(files);
            setImageTexts(new Array(files.length).fill(''));
            setImageLinks(new Array(files.length).fill(''));
          }} />
          {images.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected {images.length} image{images.length > 1 ? 's' : ''}: {images.map(img => img.name).join(', ')}
            </div>
          )}
        </div>
        
        {/* Image Text and Link Inputs */}
        {images.length > 0 && (
          <div className="space-y-4 bg-blue-50 p-4 rounded border">
            <h3 className="text-base font-semibold text-blue-800">📝 Configure Each Image Text & Links:</h3>
            <p className="text-sm text-blue-600">Add custom text overlay and clickable links for each carousel image</p>
            {images.map((image, index) => (
              <div key={index} className="border border-blue-200 p-4 rounded bg-white shadow-sm">
                <h4 className="text-sm font-semibold mb-3 text-gray-800">🖼️ Image {index + 1}: {image.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Display Text (optional)</label>
                    <input 
                      type="text"
                      className="border border-gray-300 px-3 py-2 w-full text-sm rounded focus:border-blue-500 focus:outline-none"
                      placeholder="Text to show on this image"
                      value={imageTexts[index] || ''}
                      onChange={(e) => {
                        const newTexts = [...imageTexts];
                        newTexts[index] = e.target.value;
                        setImageTexts(newTexts);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">This text will appear as overlay on the image</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Click Link (optional)</label>
                    <input 
                      type="url"
                      className="border border-gray-300 px-3 py-2 w-full text-sm rounded focus:border-blue-500 focus:outline-none"
                      placeholder="https://example.com"
                      value={imageLinks[index] || ''}
                      onChange={(e) => {
                        const newLinks = [...imageLinks];
                        newLinks[index] = e.target.value;
                        setImageLinks(newLinks);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">URL to open when image is clicked</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button disabled={loading} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors">
          {loading? '🔄 Creating Carousel...' : '✨ Add Banner Carousel'}
        </button>
        </form>
      </div>

      {/* EXISTING BANNERS SECTION */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📋 Existing Banner Carousels</h2>
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
                <button onClick={()=>startEdit(b)} className="text-blue-600 text-sm hover:text-blue-800 font-medium">
                  ✏️ Edit Text/Links
                </button>
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
                  <option value="top">Top Banner</option>
                  <option value="middle">Middle Banner</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs mb-1">Description</label>
                <textarea className="border px-2 py-1 text-sm w-full h-16 resize-none" defaultValue={b.description} onBlur={(e)=>updateBanner(b,{ description: e.target.value })} />
              </div>
            </div>

            {/* Edit Modal for Text/Links */}
            {editingBanner && editingBanner._id === b._id && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-yellow-800">✏️ Edit Image Text & Links</h3>
                <div className="space-y-4">
                  {editingBanner.images.map((image, index) => (
                    <div key={index} className="border border-yellow-300 p-4 rounded bg-white">
                      <h4 className="text-sm font-semibold mb-3 text-gray-800">🖼️ Image {index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">Display Text</label>
                          <input 
                            type="text"
                            className="border border-gray-300 px-3 py-2 w-full text-sm rounded focus:border-yellow-500 focus:outline-none"
                            placeholder="Text to show on this image"
                            value={editImageTexts[index] || ''}
                            onChange={(e) => {
                              const newTexts = [...editImageTexts];
                              newTexts[index] = e.target.value;
                              setEditImageTexts(newTexts);
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">Click Link</label>
                          <input 
                            type="url"
                            className="border border-gray-300 px-3 py-2 w-full text-sm rounded focus:border-yellow-500 focus:outline-none"
                            placeholder="https://example.com"
                            value={editImageLinks[index] || ''}
                            onChange={(e) => {
                              const newLinks = [...editImageLinks];
                              newLinks[index] = e.target.value;
                              setEditImageLinks(newLinks);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={saveEdit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                  >
                    ✅ Save Changes
                  </button>
                  <button 
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No banner carousels created yet. Add your first carousel above.
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Banners; 