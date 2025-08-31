import { ENV_CONFIG } from '../env.config.js';

// Supabase configuration using environment variables
export const SUPABASE_CONFIG = {
  url: ENV_CONFIG.SUPABASE_URL,
  anonKey: ENV_CONFIG.SUPABASE_ANON_KEY
};

// Counter configuration
export const COUNTER_CONFIG = {
  namespace: "global",
  key: "clicks"
};
