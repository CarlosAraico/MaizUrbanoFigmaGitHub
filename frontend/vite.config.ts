import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    port: 5173,
  },
  define: {
    __API_BASE__: JSON.stringify(
      process.env.VITE_API_BASE || "http://127.0.0.1:4000"
    ),
  },
});
