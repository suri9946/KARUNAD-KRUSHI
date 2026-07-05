import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { contentApi } from '../services/contentApi';

const LanguageContext = createContext();

// Default UI Translations (used as fallback and initial state)
const defaultDictionary = {
  en: {
    brandName: "KARUNAD KRUSHI",
    tagline: "Building Intelligent Agri Solutions",
    mission: "Restore Soil Intelligently",
    home: "Home",
    products: "Products",
    scienceHub: "Science Hub",
    blog: "Blog",
    adminDashboard: "Admin Dashboard",
    readMore: "Read More",
    inquireNow: "Inquire Now",
    loading: "Loading",
    learnMore: "Learn More",
    details: "Details",
    specifications: "Specifications",
    ingredients: "Ingredients",
    applicationGuide: "Application Guide",
    scientificBacking: "Scientific Backing",
    quantity: "Quantity",
    buyNow: "Mock Checkout",
    contactUs: "Contact Us",
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    send: "Send Message",
    backToHome: "Back to Home",
    // Homepage stages
    splashText: "INITIATING SOIL RECONSTRUCTION SEQUENCE...",
    stageHeroTitle: "TEASER: THE SPARK OF LIFE",
    stageHeroDesc: "Teasing the visual journey of microbial activation.",
    stageDeadTitle: "STAGE 1: THE DEAD SOIL",
    stageDeadDesc: "Vast expanses of depleted, sterile agricultural soils across our country require dynamic, structured restoration.",
    stageCrisisTitle: "STAGE 2: THE HIDDEN CRISIS",
    stageCrisisDesc: "Chemical abuse and mechanical tilling have eroded the native microbial network. Soil organic carbon is approaching critical minimums.",
    stageScienceTitle: "STAGE 3: SCIENTIFIC REGENERATION",
    stageScienceDesc: "Through biology and research, we isolate specific bacterial strains to kickstart the nitrogen and phosphorus cycles natively.",
    stageBioblendTitle: "STAGE 4: BIOBLEND FORMULATION",
    stageBioblendDesc: "Our proprietary BioBlend formula concentrates billions of active spores inside a nutrient-rich organic carrier grid.",
    stageLivingTitle: "STAGE 5: THE LIVING SOIL",
    stageLivingDesc: "Re-introducing organic matter stimulates root fungi, earthworms, and rich biodiverse microbes, creating porous living humus.",
    stageRootsTitle: "STAGE 6: DEEP ROOT NETWORKS",
    stageRootsDesc: "Mycorrhizal networks link directly to crop roots, extending water absorption capacity up to 1000% dynamically.",
    stageCropsTitle: "STAGE 7: THRIVING CANOPY",
    stageCropsDesc: "Restored soil delivers rich, disease-resistant crop canopies, yielding higher weights and highly nutritious harvest results.",
    stageTrustTitle: "STAGE 8: TRUST & RESTORATION",
    stageTrustDesc: "Empowering farmers globally with science and organic solutions. Let us claim our soil back, intelligently.",
    inquirySuccess: "Your inquiry has been submitted successfully! We will get in touch shortly.",
    cartAdded: "Added to cart successfully!"
  },
  kn: {
    brandName: "ಕರುನಾಡು ಕೃಷಿ",
    tagline: "ಬುದ್ಧಿವಂತ ಕೃಷಿ ಪರಿಹಾರಗಳ ನಿರ್ಮಾಣ",
    mission: "ಮಣ್ಣನ್ನು ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಮರುಸ್ಥಾಪಿಸಿ",
    home: "ಮುಖಪುಟ",
    products: "ಉತ್ಪನ್ನಗಳು",
    scienceHub: "ವಿಜ್ಞಾನ ಕೇಂದ್ರ",
    blog: "ಬ್ಲಾಗ್",
    adminDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    readMore: "ಹೆಚ್ಚು ಓದಿ",
    inquireNow: "ವಿಚಾರಿಸಿ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ",
    learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    details: "ವಿವರಗಳು",
    specifications: "ವಿಶೇಷಣಗಳು",
    ingredients: "ಘಟಕಾಂಶಗಳು",
    applicationGuide: "ಬಳಕೆಯ ಮಾರ್ಗದರ್ಶಿ",
    scientificBacking: "ವೈಜ್ಞಾನಿಕ ಬೆಂಬಲ",
    quantity: "ಪ್ರಮಾಣ",
    buyNow: "ಮಾಕ್ ಚೆಕ್‌ಔಟ್",
    contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
    name: "ಹೆಸರು",
    email: "ಇಮೇಲ್",
    phone: "ದೂರವಾಣಿ",
    message: "ಸಂದೇಶ",
    send: "ಸಂದೇಶ ಕಳುಹಿಸಿ",
    backToHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    // Homepage stages
    splashText: "ಮಣ್ಣಿನ ಪುನರ್ನಿರ್ಮಾಣ ಪ್ರಕ್ರಿಯೆ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ...",
    stageHeroTitle: "ಟೀಸರ್: ಜೀವನದ ಕಿಡಿ",
    stageHeroDesc: "ಮೈಕ್ರೋಬಿಯಲ್ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆಯ ದೃಶ್ಯ ಪ್ರಯಾಣದ ಪರಿಚಯ.",
    stageDeadTitle: "ಹಂತ ೧: ನಿರ್ಜೀವ ಮಣ್ಣು",
    stageDeadDesc: "ನಮ್ಮ ದೇಶದಾದ್ಯಂತ ಸವಕಳಿಯಾದ, ಬಂಜರು ಕೃಷಿ ಭೂಮಿಗೆ ವ್ಯವಸ್ಥಿತ ಮತ್ತು ಕ್ರಿಯಾತ್ಮಕ ಮರುಸ್ಥಾಪನೆಯ ಅವಶ್ಯಕತೆಯಿದೆ.",
    stageCrisisTitle: "ಹಂತ ೨: ಅಡಗಿರುವ ಬಿಕ್ಕಟ್ಟು",
    stageCrisisDesc: "ರಾಸಾಯನಿಕಗಳ ಅತಿಯಾದ ಬಳಕೆ ಮತ್ತು ಯಾಂತ್ರಿಕ ಉಳುಮೆಯು ನೈಸರ್ಗಿಕ ಮೈಕ್ರೋಬಿಯಲ್ ಜಾಲವನ್ನು ನಾಶಪಡಿಸಿದೆ. ಸಾವಯವ ಇಂಗಾಲವು ತಳಮಟ್ಟ ತಲುಪಿದೆ.",
    stageScienceTitle: "ಹಂತ ೩: ವೈಜ್ಞಾನಿಕ ಪುನರುಜ್ಜೀವನ",
    stageScienceDesc: "ಜೀವಶಾಸ್ತ್ರ ಮತ್ತು ಸಂಶೋಧನೆಯ ಮೂಲಕ, ನಾವು ಸಾರಜನಕ ಮತ್ತು ರಂಜಕ ಚಕ್ರಗಳನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ಪ್ರಾರಂಭಿಸಲು ನಿರ್ದಿಷ್ಟ ಬ್ಯಾಕ್ಟೀರಿಯಾಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸುತ್ತೇವೆ.",
    stageBioblendTitle: "ಹಂತ ೪: ಬಯೋಬ್ಲೆಂಡ್ ಫಾರ್ಮುಲೇಶನ್",
    stageBioblendDesc: "ನಮ್ಮದೇ ಆದ ಬಯೋಬ್ಲೆಂಡ್ ಸೂತ್ರವು ಶತಕೋಟಿ ಸಕ್ರಿಯ ಸ್ಪೋರ್‌ಗಳನ್ನು ಪೌಷ್ಟಿಕಾಂಶ ಭರಿತ ಸಾವಯವ ವಾಹಕ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಸಾಂದ್ರೀಕರಿಸುತ್ತದೆ.",
    stageLivingTitle: "ಹಂತ ೫: ಜೀವಂತ ಮಣ್ಣು",
    stageLivingDesc: "ಸಾವಯವ ಪದಾರ್ಥಗಳನ್ನು ಮರುಪರಿಚಯಿಸುವುದರಿಂದ ಬೇರು ಶಿಲೀಂಧ್ರಗಳು, ಎರೆಹುಳುಗಳು ಮತ್ತು ವೈವಿಧ್ಯಮಯ ಸೂಕ್ಷ್ಮಜೀವಿಗಳನ್ನು ಉತ್ತೇಜಿಸಿ, ಫಲವತ್ತಾದ ಮಣ್ಣನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ.",
    stageRootsTitle: "ಹಂತ ೬: ಆಳವಾದ ಬೇರುಗಳ ಜಾಲ",
    stageRootsDesc: "ಮೈಕೋರೈಜಲ್ ಜಾಲಗಳು ನೇರವಾಗಿ ಬೆಳೆ ಬೇರುಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ, ನೀರು ಹೀರಿಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಶೇಕಡಾ ೧೦೦೦ ರಷ್ಟು ಹೆಚ್ಚಿಸುತ್ತದೆ.",
    stageCropsTitle: "ಹಂತ ೭: ಅಭಿವೃದ್ಧಿ ಹೊಂದುತ್ತಿರುವ ಬೆಳೆ",
    stageCropsDesc: "ಮರುಸ್ಥಾಪಿತ ಮಣ್ಣು ರೋಗನಿರೋಧಕ ಶಕ್ತಿಯುಳ್ಳ ಬೆಳೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ, ಇದರಿಂದಾಗಿ ಹೆಚ್ಚಿನ ಇಳುವರಿ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶಯುಕ್ತ ಕೊಯ್ಲು ಸಾಧ್ಯವಾಗುತ್ತದೆ.",
    stageTrustTitle: "ಹಂತ ೮: ವಿಶ್ವಾಸ ಮತ್ತು ಮರುಸ್ಥಾಪನೆ",
    stageTrustDesc: "ವೈಜ್ಞಾನಿಕ ಮತ್ತು ಸಾವಯವ ಪರಿಹಾರಗಳ ಮೂಲಕ ಜಾಗತಿಕವಾಗಿ ರೈತರನ್ನು ಸಬಲೀಕರಣಗೊಳಿಸುವುದು. ನಮ್ಮ ಮಣ್ಣನ್ನು ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಮರುಪಡೆಯೋಣ.",
    inquirySuccess: "ನಿಮ್ಮ ವಿಚಾರಣೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ! ನಾವು ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.",
    cartAdded: "ಕಾರ್ಟ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('kk_lang') || 'en';
  });

  const [dictionary, setDictionary] = useState(defaultDictionary);
  const [audiences, setAudiences] = useState(null);
  const [heroVideoUrl, setHeroVideoUrl] = useState('/assets/hero_video.mp4');

  // Load content dynamically from Supabase site_content table
  const fetchDynamicContent = useCallback(async () => {
    try {
      const dbContent = await contentApi.getSiteContent();
      const newDict = { en: { ...defaultDictionary.en }, kn: { ...defaultDictionary.kn } };

      Object.entries(dbContent).forEach(([key, val]) => {
        if (val) {
          if (key === 'audiences') {
            setAudiences(val.value || val);
          } else if (key === 'heroVideoUrl') {
            setHeroVideoUrl(val.en || val);
          } else if (typeof val === 'object' && !Array.isArray(val)) {
            if (val.en) newDict.en[key] = val.en;
            if (val.kn) newDict.kn[key] = val.kn;
          }
        }
      });

      setDictionary(newDict);
    } catch (err) {
      console.warn('Could not sync dynamic translations from Supabase site_content, using defaults.', err);
    }
  }, []);

  useEffect(() => {
    fetchDynamicContent();
  }, [fetchDynamicContent]);

  useEffect(() => {
    localStorage.setItem('kk_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'kn' : 'en'));
  };

  const t = (key) => {
    return dictionary[lang][key] || dictionary['en'][key] || defaultDictionary[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      toggleLanguage,
      t,
      audiences,
      heroVideoUrl,
      refreshContent: fetchDynamicContent
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
