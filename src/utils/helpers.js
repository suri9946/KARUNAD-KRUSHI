/**
 * Formats a number to Indian Rupees currency string format (INR)
 * @param {number} value 
 * @returns {string} formatted currency string
 */
export function formatCurrency(value) {
  if (typeof value !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formats an ISO date string into a user-friendly readable date
 * @param {string} dateString 
 * @param {boolean} includeTime 
 * @returns {string} formatted date
 */
export function formatDate(dateString, includeTime = false) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Truncates text to a specified length and appends trailing characters if truncated
 * @param {string} text 
 * @param {number} length 
 * @param {string} suffix 
 * @returns {string} truncated text
 */
export function truncateText(text, length = 100, suffix = '...') {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + suffix;
}

/**
 * Generates a clean URL slug from a given text string
 * @param {string} text 
 * @returns {string} slugified text
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}
