import React, { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const HeroBanner = () => {
  const { backendUrl } = useContext(ShopContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/banner/list", { 
          params: { section: "hero" } 
        });
        
        if (res.data.success && res.data.banners.length > 0) {
          // Transform banner data to work with carousel
          const transformedBanners = res.data.banners.flatMap(banner => 
            banner.images && banner.images.length > 0 
              ? banner.images.sort((a, b) => a.order - b.order).map((image, index) => ({
                  id: `${banner._id}-${index}`,
                  title: banner.title || 'Special Offer',
                  description: banner.description || 'Great deals await you',
                  image: image.url,
                  alt: image.alt || banner.title,
                  text: image.text,
                  link: image.link
                }))
              : []
          );
          setBanners(transformedBanners);
        }
      } catch (error) {
        console.error('Error loading banners:', error);
        // Fallback to default banner if API fails
        setBanners([{
          id: 'default',
          title: 'Welcome to Forever',
          description: 'Discover amazing products',
          image: null
        }]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, [backendUrl]);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="relative h-[70vh] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[70vh] overflow-hidden bg-white">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="w-full h-full flex-shrink-0 relative cursor-pointer group"
            onClick={() => {
              if (banner.link) {
                window.open(banner.link, '_blank');
              }
            }}
          >
            {banner.image ? (
              <img 
                src={banner.image} 
                alt={banner.alt || banner.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-800 to-black flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h2 className="text-2xl md:text-4xl font-bold">{banner.title}</h2>
                  <p className="text-sm md:text-base mt-2 text-gray-200">{banner.description}</p>
                </div>
              </div>
            )}
            
            {/* Text Overlay */}
            {banner.text && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-2xl">
                  <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg tracking-wide">{banner.text}</h2>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if multiple banners */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white hover:text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white hover:text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if multiple banners */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 border-2 ${
                index === currentSlide 
                  ? 'bg-white border-white shadow-md' 
                  : 'bg-transparent border-white/70 hover:border-white hover:bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
