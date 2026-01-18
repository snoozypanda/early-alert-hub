import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// export default defineConfig({
//   // ...
//   server: {
//     allowedHosts: ["early-alert-hub-1.onrender.com"],
//   },
// });
export default defineConfig(({ mode }) => ({
  server: {
    allowedHosts: [
      "early-alert-hub-1.onrender.com",
      "early-alert-hub.vercel.app",
    ],
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
