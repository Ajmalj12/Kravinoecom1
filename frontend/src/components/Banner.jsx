import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const Banner = ({ position = "home" }) => {
  const { backendUrl } = useContext(ShopContext);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(backendUrl + "/api/banner/list", { params: { position } });
        if (res.data.success && res.data.banners.length > 0) {
          setBanner(res.data.banners[0]);
        } else {
          setBanner(null);
        }
      } catch { setBanner(null); }
    };
    load();
  }, [backendUrl, position]);

  if (!banner) return null;

  return (
    <Link to={`/product/${banner.productId}`} className="block my-6">
      <div className="relative w-full h-48 md:h-64 lg:h-72 overflow-hidden rounded">
        <img src={banner.image} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
        {banner.title && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded text-sm">
            {banner.title}
          </div>
        )}
      </div>
    </Link>
  );
};

export default Banner; 