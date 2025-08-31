// Environment configuration for Supabase
// Copy this file to .env.local and update with your actual values
// Or set these as environment variables in your deployment platform

export const ENV_CONFIG = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "https://cvvofmgregxnpigqpyps.supabase.co",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dm9mbWdyZWd4bnBpZ3FweXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTc1ODcsImV4cCI6MjA3MjIzMzU4N30.wXoefOaYjImehquN4LrEZqxa5e7p2KzuFvnlQm5yAuA"
};
