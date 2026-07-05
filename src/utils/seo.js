/**
 * Dynamically updates the page title, meta description, keywords, and OpenGraph tags in document head
 * @param {Object} seoData 
 * @param {string} seoData.title
 * @param {string} seoData.meta_description
 * @param {string} [seoData.keywords]
 * @param {string} [seoData.og_image]
 */
export function updateSEO(seoData) {
  if (!seoData) return;
  
  // 1. Update Title
  if (seoData.title) {
    document.title = seoData.title;
  }
  
  // 2. Update Meta Description
  if (seoData.meta_description) {
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', seoData.meta_description);
  }
  
  // 3. Update Meta Keywords
  if (seoData.keywords) {
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.setAttribute('content', seoData.keywords);
  } else {
    // If no keywords provided, clean up or set a generic default
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
      keywordsMeta.setAttribute('content', 'organic farming, soil biology, bioblend, yield restoration, agricultural inputs');
    }
  }
  
  // 4. Update OpenGraph Title
  if (seoData.title) {
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', seoData.title);
  }

  // 5. Update OpenGraph Description
  if (seoData.meta_description) {
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', seoData.meta_description);
  }
  
  // 6. Update OpenGraph Image
  if (seoData.og_image) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', seoData.og_image);
  } else {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', '/assets/logo.png');
    }
  }
}
