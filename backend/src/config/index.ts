import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define configuration interface
interface Config {
  // Server
  NODE_ENV: string;
  PORT: number;
  
  // Logging
  LOG_LEVEL: string;
  
  // API
  API_PREFIX: string;
  
  // CORS
  CORS_ORIGIN: string;
  
  // Jupiter API
  jupiter: {
    apiKey?: string;
    apiBaseUrl: string;
    tokenApiBaseUrl: string;
  };
  
  // Solana RPC
  solana: {
    rpcUrl?: string;
  };
  
  // Add other configuration properties here as needed
}

// Validate required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
];

// Check for missing required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Create and validate configuration
const config: Config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // API
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Jupiter API
  jupiter: {
    apiKey: process.env.JUPITER_API_KEY,
    apiBaseUrl: process.env.JUPITER_API_BASE_URL || 'https://quote-api.jup.ag/v6',
    tokenApiBaseUrl: process.env.JUPITER_TOKEN_API_BASE_URL || 'https://token-api.jup.ag',
  },
  
  // Solana RPC
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL,
  },
};

// Validate configuration
if (isNaN(config.PORT)) {
  throw new Error('PORT must be a valid number');
}

// Export configuration
export default config;
