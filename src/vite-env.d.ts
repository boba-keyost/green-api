/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare const VITE__PREFIX__: string;
declare const VITE__API_ENDPOINT: string;
declare const VITE__IS_DEV: boolean;

declare module "*.module.pcss" {
    const content: Record<string, string>;
    export default content;
}

declare module "@fontsource/*" {}
declare module "@fontsource-variable/*" {}