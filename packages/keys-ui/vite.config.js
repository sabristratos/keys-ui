import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'resources/js/index.ts'),
            name: 'KeysUI',
            fileName: (format) => `keys-ui.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            // External dependencies that shouldn't be bundled
            external: [],
            output: {
                // Global variables for UMD build
                globals: {}
            }
        },
        outDir: 'dist',
        emptyOutDir: true,
        // Generate CSS file separately
        cssCodeSplit: false,
    },

    // CSS processing
    css: {
        postcss: {
            plugins: []
        }
    },

    // Development server configuration
    server: {
        port: 5174, // Different port from main app
        strictPort: true,
        cors: true
    },

    // Resolve aliases
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@css': resolve(__dirname, 'resources/css'),
        }
    },

    // Define environment variables
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }
});