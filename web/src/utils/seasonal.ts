export const getSeasonalBanner = () => {
  const month = new Date().getMonth() + 1; // 1-indexed

  if (month >= 3 && month <= 5) {
    return {
      type: "wheat" as const,
      title: "گندم کا موسم!",
      subtitle: "Wheat Thresher — Special Offer",
      product: "Wheat Thresher 5 FT",
      description: "گندم کی کٹائی کے سیزن کے لیے بہترین تھریشر اب خاص رعایت پر دستیاب ہے۔",
      image: "https://sethtufail.com/cdn/shop/files/wheat-thresher-5-ft.png?v=1710928434"
    };
  }

  if (month >= 10 && month <= 12) {
    return {
      type: "fodder" as const,
      title: "چارہ کاٹنے کا وقت!",
      subtitle: "Pakistan Ka No.1 Toka — Reg 37397",
      product: "Seth Muhammad Tufail Toka",
      description: "ٹوکہ مشین کی خریداری پر بہترین قیمت اور فوری ڈیلیوری۔",
      image: "https://sethtufail.com/cdn/shop/files/wheat-thresher.png?v=1710928434"
    };
  }

  return {
    type: "default" as const,
    title: "Seth M. Tufail Foundry",
    subtitle: "Pakistan's Most Trusted Machinery",
    product: "High Quality Agri Solutions",
    description: "40+ Years of Excellence in Agricultural Machinery.",
    image: "https://sethtufail.com/cdn/shop/files/wheat-thresher.png?v=1710928434"
  };
};
