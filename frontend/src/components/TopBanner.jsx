import { useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const TopBanner = () => {
  const { backendUrl } = useContext(ShopContext);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/banner/list?section=top`);
      const data = await response.json();
      
      console.log('Top Banner API Response:', data);
      
      if (data.success && data.banners.length > 0) {
        // Transform banner data exactly like HeroBanner
        const transformedBanners = data.banners.flatMap(banner => 
          banner.images && banner.images.length > 0 
            ? banner.images.sort((a, b) => a.order - b.order).map((image, index) => ({
                id: `${banner._id}-${index}`,
                title: banner.title || 'Special Offer',
                description: banner.description || 'Great deals await you',
                image: image.url,
                alt: image.alt || banner.title,
                text: image.text,
                link: image.link,
                _id: `${banner._id}-${index}`
              }))
            : []
        );
        
        console.log('Transformed top banners:', transformedBanners);
        setBanners(transformedBanners);
      } else {
        console.log('No top banners found');
        setBanners([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top banners:', error);
      setBanners([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-lg mx-auto my-8"></div>
    );
  }

  if (banners.length === 0) {
    console.log('TopBanner: No banners to display, returning null');
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden rounded-lg mx-4 my-8">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className="w-full h-full flex-shrink-0 relative cursor-pointer"
            onClick={() => banner.link && window.open(banner.link, '_blank')}
          >
            <img
              src={banner.image}
              alt={banner.alt || 'Banner'}
              className="w-full h-full object-cover"
            />
            
            {/* Text Overlay */}
            {banner.text && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-2xl">
                  <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{banner.text}</h2>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopBanner;
