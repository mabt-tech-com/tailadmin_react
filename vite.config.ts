// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(

        //////// zeyedha ena - start
        {
          babel: {
            plugins: [
              ['module:@preact/signals-react-transform'], // Add this line
            ],
          },
        }
        //////// zeyedha ena - end

    ),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],

  server: {
    port: 3000,
    open: true,
  },
});