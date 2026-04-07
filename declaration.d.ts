declare module "*.module.pcss" {
    const content: Record<string, string>;
    export default content;
}

declare const VITE__PREFIX__: string;
declare const VITE__API_ENDPOINT: string;
declare const APP_BASE_PATH: string;