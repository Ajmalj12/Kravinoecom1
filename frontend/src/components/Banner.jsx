import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const Banner = ({ section = "hero" }) => {
  const { backendUrl } = useContext(ShopContext);
  const [banner, setBanner] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/banner/list", { params: { section } });
        if (res.data.success && res.data.banners.length > 0) {
          setBanner(res.data.banners[0]);
          setCurrentImageIndex(0);
        } else {
          setBanner(null);
        }
      } catch { setBanner(null); }
    };
    load();
  }, [backendUrl, section]);

  useEffect(() => {
    if (!banner || !banner.images || banner.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % banner.images.length);
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [banner]);

  if (!banner || !banner.images || banner.images.length === 0) return null;

  const sortedImages = banner.images.sort((a, b) => a.order - b.order);
  const currentImage = sortedImages[currentImageIndex];

  return (
    <div className="relative w-full overflow-hidden rounded my-6" style={{ aspectRatio: '3000/1200' }}>
      {/* Main Image */}
      <img 
        src={currentImage.url} 
        alt={currentImage.alt || banner.title || 'Banner'} 
        className="w-full h-full object-cover transition-opacity duration-500" 
      />
      
      {/* Banner Content Overlay */}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="text-center text-white px-4">
          {banner.title && (
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
          )}
          {banner.description && (
            <p className="text-sm md:text-lg mb-4 max-w-2xl">{banner.description}</p>
          )}
        </div>
      </div>

      {/* Carousel Indicators */}
      {sortedImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sortedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {sortedImages.length > 1 && (
        <>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
          >
            &#8249;
          </button>
          <button
            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;