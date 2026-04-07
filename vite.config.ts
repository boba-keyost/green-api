import camelCase from "lodash/camelCase";
import {Buffer} from "node:buffer";
import path from "node:path";
import {defineConfig, loadEnv} from 'vite';
import eslint from "vite-plugin-eslint";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";
import {abbrStr, getAPIEndpoint} from "./lib";
import postCSSConfig from "./postcss.config.ts";


const noAttr = () => {
    return {
        name: "no-attribute",
        transformIndexHtml(html: string) {
            return html.replace(/(type="module")? +crossorigin/gi, "defer");
        }
    }
}

export default defineConfig(({mode, isSsrBuild }) => {
    const isDev = mode === "development";
    const env = loadEnv(mode, process.cwd(), "");
    const fileHash = isDev ? "" : ".[hash:10]";

    process.env.VITE__PREFIX__ = postCSSConfig?.plugins?.["postcss-prefixer"]?.prefix || "";
    
    const config = {
        clearScreen: true,
        logLevel: "info",
        base: "",
        build: {
            outDir: "dist",
            sourcemap: isDev,
            chunkSizeWarningLimit: 2500,
            rollupOptions: {
                output: {
                    compact: true,
                    assetFileNames: `assets/[ext]/[name]${fileHash}.[ext]`,
                    chunkFileNames: `[format]/chunk-[name]${fileHash}.js`,
                    entryFileNames: `[format]/[name]${fileHash}.js`,
                    inlineDynamicImports: false,
                    sourcemapIgnoreList: relativeSourcePath => relativeSourcePath.includes("node_modules")
                }
            }
        },
        css: {
            devSourcemap: isDev,
            modules: {
                exportGlobals: true,
                localsConvention: (originalClassName: string) => {
                    const prefix = process.env.VITE__PREFIX__ || ""
                    if (prefix && originalClassName.indexOf(prefix) === 0) {
                        originalClassName = originalClassName.substring(prefix.length, originalClassName.length)
                    }
                    return camelCase(originalClassName)
                },
                generateScopedName: (name, filename, css) => {
                    const dir = path.relative("./src", path.dirname(filename));
                    const file = path.basename(filename, ".css");
                    const location = abbrStr(isDev ? dir.replace(/(?:^|\/)(.)[^/]+/gi, "$1") + file : `${dir}_${file}`);
                    const hash = isDev ? "" : Buffer.from(css).toString("base64");
                    return `${name}___${location}${hash ? "_" + hash.substring(0, 5) : ""}`.replace(/[^a-z_-]/gi, "_");
                }
            }
        },
        plugins: [
            nodePolyfills(),
            eslint({
                lintOnStart: isDev,
                failOnWarning: !isDev,
                failOnError: !isDev,
                include: [
                    "src/**/*.js",
                    "src/**/*.jsx",
                    "src/**/*.ts",
                    "src/**/*.tsx",
                    "src/**/*.mjs",
                    "src/**/*.mjsx",
                ],
            }),
            tsconfigPaths(),
            noAttr(),
        ],
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
            VITE__IS_DEV: JSON.stringify(isDev),
            VITE__PREFIX__: JSON.stringify(process.env.VITE__PREFIX__),
            VITE__API_ENDPOINT: JSON.stringify(getAPIEndpoint("", env)),
        },
        server: {
            sourcemapIgnoreList: sourcePath => sourcePath.includes("node_modules/.vite"),
        },
    }
    
    if (isSsrBuild) {
        config.build.outDir += "/server"
        config.build.copyPublicDir = false
    }

    return config
});