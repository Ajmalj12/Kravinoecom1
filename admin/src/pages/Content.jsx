import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Content = ({ token }) => {
  const [page, setPage] = useState('global');
  const [items, setItems] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [uploadKey, setUploadKey] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [pendingChanges, setPendingChanges] = useState({});
  const [saving, setSaving] = useState(false);

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
      if (res.data.success) { 
        fetch(); 
        // Remove from pending changes
        setPendingChanges(prev => {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        });
      }
      else toast.error(res.data.message || 'Failed to save');
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
  };

  const handleInputChange = (key, value) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }));
  };

  const saveAllChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.info('No changes to save');
      return;
    }
    
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(pendingChanges)) {
        await saveItem(key, value);
      }
      toast.success('All changes saved successfully');
    } catch (e) {
      toast.error('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newKey) { toast.error('Key required'); return; }
    handleInputChange(newKey, newValue);
    setNewKey(''); setNewValue('');
  };

  const uploadImageWithKey = async (e, key) => {
    e.preventDefault();
    if (!key || !file) { 
      toast.error('Please select an image file first'); 
      return; 
    }
    try {
      const form = new FormData();
      form.append('page', page);
      form.append('key', key);
      form.append('image', file);
      const res = await axios.post(backendUrl + '/api/page/upload', form, { 
        headers: { 
          token,
          'Content-Type': 'multipart/form-data'
        } 
      });
      if (res.data.success) { 
        toast.success('Image uploaded successfully');
        // Update the input field immediately with the uploaded URL
        const uploadedUrl = res.data.item.value;
        setPendingChanges(prev => ({ ...prev, [key]: uploadedUrl }));
        
        setFile(null); 
        setFileName('');
        // Clear file input
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
      }
      else toast.error(res.data.message || 'Upload failed');
    } catch (e) { 
      console.error('Upload error:', e);
      toast.error(e.response?.data?.message || e.message); 
    }
  };

  const getValue = (key) => pendingChanges[key] || items.find(i => i.key === key)?.value || '';

  const FooterEditor = () => (
    <div className="bg-white p-4 rounded border mb-6">
      <h2 className="font-medium mb-3">Footer</h2>
      {[
        { key: 'siteName', label: 'Site Name', page: 'global' },
        { key: 'footerAbout', label: 'Footer About', page: 'global' },
        { key: 'phone', label: 'Phone', page: 'global' },
        { key: 'email', label: 'Email', page: 'global' },
        { key: 'copyright', label: 'Copyright', page: 'global' },
      ].map(({ key, label }) => (
        <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
          <div className="text-sm font-medium">{label}</div>
          <input className="border px-2 py-1 text-sm md:col-span-2" value={getValue(key)} onChange={(e)=>handleInputChange(key, e.target.value)} />
        </div>
      ))}
    </div>
  );

  const HeroEditor = () => (
    <div className="bg-white p-4 rounded border mb-6">
      <h2 className="font-medium mb-3">Hero (Home)</h2>
      {[
        { key: 'heroLabel', label: 'Label' },
        { key: 'heroHeading', label: 'Heading' },
        { key: 'heroSubheading', label: 'Subheading' },
        { key: 'heroCtaText', label: 'CTA Text' },
        { key: 'heroCtaLink', label: 'CTA Link' },
        { key: 'heroRightNote', label: 'Right Note (if no image)' },
      ].map(({ key, label }) => (
        <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
          <div className="text-sm font-medium">{label}</div>
          <input className="border px-2 py-1 text-sm md:col-span-2" value={getValue(key)} onChange={(e)=>handleInputChange(key, e.target.value)} />
        </div>
      ))}
      <div className="grid md:grid-cols-3 gap-2 items-center">
        <div className="text-sm font-medium">Hero Image</div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input className="border px-2 py-1 text-sm flex-1" value={getValue('heroImage')} onChange={(e)=>handleInputChange('heroImage', e.target.value)} />
        </div>
        <div className="md:col-start-2 md:col-span-2 flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <input type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0]); setFileName(e.target.files[0]?.name || '');}} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="border px-2 py-1 text-sm bg-white cursor-pointer flex items-center justify-between">
              <span className="text-gray-600">{fileName || 'Choose file'}</span>
              <span className="text-xs text-gray-400">Browse</span>
            </div>
          </div>
          <button onClick={async (e)=>{ e.preventDefault(); await uploadImageWithKey(e, 'heroImage'); }} className="bg-black text-white px-4 py-1 rounded">Upload</button>
        </div>
      </div>
    </div>
  );

  const AboutEditor = () => (
    <div className="bg-white p-4 rounded border mb-6">
      <h2 className="font-medium mb-3">About Page</h2>
      {[
        { key: 'title1', label: 'Title Part 1 (e.g., ABOUT)' },
        { key: 'title2', label: 'Title Part 2 (e.g., US)' },
        { key: 'body1', label: 'Main Description' },
        { key: 'body2', label: 'Why Shop With Us Title' },
        { key: 'body3', label: 'Mission Section Title' },
        { key: 'body4', label: 'Mission Description' },
        { key: 'whyTitle1', label: 'Why Choose Us - Title Part 1' },
        { key: 'whyTitle2', label: 'Why Choose Us - Title Part 2' },
        { key: 'why1Title', label: 'Quality Assurance Title' },
        { key: 'why1Body', label: 'Quality Assurance Description' },
        { key: 'why2Title', label: 'Convenience Title' },
        { key: 'why2Body', label: 'Convenience Description' },
        { key: 'why3Title', label: 'Customer Service Title' },
        { key: 'why3Body', label: 'Customer Service Description' },
      ].map(({ key, label }) => (
        <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
          <div className="text-sm font-medium">{label}</div>
          {key.includes('Body') || key.includes('Description') ? (
            <textarea className="border px-2 py-1 text-sm md:col-span-2 h-20 resize-none" value={getValue(key)} onChange={(e)=>handleInputChange(key, e.target.value)} />
          ) : (
            <input className="border px-2 py-1 text-sm md:col-span-2" value={getValue(key)} onChange={(e)=>handleInputChange(key, e.target.value)} />
          )}
        </div>
      ))}
      <div className="grid md:grid-cols-3 gap-2 items-center">
        <div className="text-sm font-medium">About Hero Image</div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input className="border px-2 py-1 text-sm flex-1" value={getValue('heroImage')} onChange={(e)=>handleInputChange('heroImage', e.target.value)} />
        </div>
        <div className="md:col-start-2 md:col-span-2 flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <input type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0]); setFileName(e.target.files[0]?.name || '');}} id="aboutImageUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="border px-2 py-1 text-sm bg-white cursor-pointer flex items-center justify-between">
              <span className="text-gray-600">{fileName || 'Choose file'}</span>
              <span className="text-xs text-gray-400">Browse</span>
            </div>
          </div>
          <button onClick={async (e)=>{ e.preventDefault(); await uploadImageWithKey(e, 'heroImage'); }} className="bg-black text-white px-4 py-1 rounded">Upload About Image</button>
        </div>
      </div>
    </div>
  );

  const ContactEditor = () => (
    <div className="bg-white p-4 rounded border mb-6">
      <h2 className="font-medium mb-3">Contact Page</h2>
      {[
        { key: 'title1', label: 'Title Part 1 (e.g., Let\'s)' },
        { key: 'title2', label: 'Title Part 2 (e.g., Connect)' },
        { key: 'subtitle', label: 'Page Subtitle' },
        { key: 'addressTitle', label: 'Address Section Title' },
        { key: 'address', label: 'Store Address' },
        { key: 'infoTitle', label: 'Contact Info Title' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'email', label: 'Email Address' },
        { key: 'careersTitle', label: 'Careers Section Title' },
        { key: 'careersBody', label: 'Careers Description' },
      ].map(({ key, label }) => (
        <div key={key} className="grid md:grid-cols-3 gap-2 items-center mb-2">
          <div className="text-sm font-medium">{label}</div>
          {key.includes('Body') || key.includes('subtitle') || key.includes('address') ? (
            <textarea className="border px-2 py-1 text-sm md:col-span-2 h-20 resize-none" value={getValue(key)} onChange={(e)=>handleInputChange(key, e.target.value)} />
          ) : (
            <input className="border px-2 py-1 text-sm md:col-span-2" value={getValue(key)} onChange={(e)=>handleInputChange(key, e.target.value)} />
          )}
        </div>
      ))}
      <div className="grid md:grid-cols-3 gap-2 items-center">
        <div className="text-sm font-medium">Contact Hero Image</div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input className="border px-2 py-1 text-sm flex-1" value={getValue('heroImage')} onChange={(e)=>handleInputChange('heroImage', e.target.value)} />
        </div>
        <div className="md:col-start-2 md:col-span-2 flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <input type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0]); setFileName(e.target.files[0]?.name || '');}} id="contactImageUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="border px-2 py-1 text-sm bg-white cursor-pointer flex items-center justify-between">
              <span className="text-gray-600">{fileName || 'Choose file'}</span>
              <span className="text-xs text-gray-400">Browse</span>
            </div>
          </div>
          <button onClick={async (e)=>{ e.preventDefault(); await uploadImageWithKey(e, 'heroImage'); }} className="bg-black text-white px-4 py-1 rounded">Upload Contact Image</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Content Management</h1>
      <div className="bg-white p-4 rounded border mb-4 flex items-center gap-3">
        <label>Page</label>
        <select className="border px-3 py-2" value={page} onChange={(e)=>setPage(e.target.value)}>
          <option value="global">Footer</option>
          <option value="home">Home (Hero)</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
        </select>
      </div>

      {page === 'global' && <FooterEditor />}
      {page === 'home' && <HeroEditor />}
      {page === 'about' && <AboutEditor />}
      {page === 'contact' && <ContactEditor />}

      {/* Save Button */}
      {Object.keys(pendingChanges).length > 0 && (
        <div className="bg-white p-4 rounded border mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length > 1 ? 's' : ''}
          </div>
          <button 
            onClick={saveAllChanges} 
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded font-medium"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Content; 