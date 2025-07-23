// API Configuration
const config = {
  development: {
    API_BASE_URL: "http://localhost:3000/api",
  },
  production: {
    API_BASE_URL: "https://full-stack-node-backend.onrender.com/api",
  },
};

// Auto-detect environment or manually override
const environment = import.meta.env.MODE || "development";

// Manual override - uncomment to force specific environment
// const environment = 'production'; // Force production
// const environment = 'development'; // Force development

export const API_BASE_URL =
  config[environment]?.API_BASE_URL || config.development.API_BASE_URL;

console.log(`🌐 Using API: ${API_BASE_URL} (${environment} mode)`);
