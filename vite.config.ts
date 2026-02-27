import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || "https://eroowrimqlmpfyaurqcb.supabase.co"),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyb293cmltcWxtcGZ5YXVycWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjg1ODIsImV4cCI6MjA4NzcwNDU4Mn0.As9zpLxiz0ipTe8JXvTx0XUmYJCPKa-dE__WalZt9Lg"),
  },
  server: {
    host: true,
    allowedHosts: true,
  },
});
