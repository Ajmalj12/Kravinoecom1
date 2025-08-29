import { assets } from "../assets/assets";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const OurPolicy = () => {
  const { pageContent } = useContext(ShopContext);
  const policyTitle1 = pageContent?.policy?.policyTitle1 || 'OUR';
  const policyTitle2 = pageContent?.policy?.policyTitle2 || 'POLICY';
  const policy1Title = pageContent?.policy?.policy1Title || 'Easy Exchange Policy';
  const policy1Body = pageContent?.policy?.policy1Body || 'We offer hassle free exchange policy.';
  const policy2Title = pageContent?.policy?.policy2Title || '7 Days Return Policy';
  const policy2Body = pageContent?.policy?.policy2Body || 'We provide 7 days free return policy.';
  const policy3Title = pageContent?.policy?.policy3Title || 'Best Customer Support';
  const policy3Body = pageContent?.policy?.policy3Body || 'We provide 24/7 customer support.';

  return (
    <div className="py-20">
      <div className="text-center mb-12">
        <Title text1={policyTitle1} text2={policyTitle2} />
      </div>
      <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center text-xs sm:text-sm md:text-base text-gray-700">
        <div>
          <img src={assets.exchange_icon} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold">{policy1Title}</p>
          <p className="text-gray-400">{policy1Body}</p>
        </div>

        <div>
          <img src={assets.quality_icon} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold">{policy2Title}</p>
          <p className="text-gray-400">{policy2Body}</p>
        </div>

        <div>
          <img src={assets.support_img} className="w-12 m-auto mb-5" alt="" />
          <p className="font-semibold">{policy3Title}</p>
          <p className="text-gray-400">{policy3Body}</p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
