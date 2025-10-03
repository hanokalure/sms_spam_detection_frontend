// web.config.js - Expo Web Configuration
module.exports = {
  // Enable CSS modules and other web-specific features
  webpack: {
    alias: {},
    plugins: [],
  },
  // Custom meta tags and document configuration
  document: {
    title: 'SMS Spam Detection - AI Powered',
    description: 'Advanced SMS spam detection using machine learning models - SVM and CatBoost',
    viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
    keywords: 'SMS, spam detection, machine learning, AI, SVM, CatBoost, text classification',
    author: 'SMS Spam Detection Team',
    themeColor: '#667eea',
    backgroundColor: '#f7fafc',
  }
};