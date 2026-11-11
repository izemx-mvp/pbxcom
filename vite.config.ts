// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              // Split large vendor libraries out of the entry chunk for better caching
              codeSplitting: {
                includeDependenciesRecursively: false,
                groups: [
                  { name: "vendor-react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
                  { name: "vendor-router", test: /node_modules[\\/]@tanstack[\\/]/, priority: 20 },
                  { name: "vendor-motion", test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/, priority: 20 },
                  { name: "vendor-ui", test: /node_modules[\\/](@radix-ui|cmdk|sonner|lucide-react|fuse\.js|zod|react-hook-form|@hookform)[\\/]/, priority: 10 },
                ],
              },
            },
          },
        },
      },
    },
  },
});
