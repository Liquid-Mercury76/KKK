// This file provides type definitions for environment variables
// to ensure TypeScript can check them. The variables are
// injected at build time by Vite's 'define' configuration.

// Fix: The 'process' variable is already declared globally (e.g., by @types/node).
// Redeclaring it causes a conflict. Instead, we augment the existing NodeJS.ProcessEnv
// interface to add our custom environment variables.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
