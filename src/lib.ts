import lodashIsEqual from "lodash/isEqual";
import qs, {type ParsedQs} from "qs";
import url from "url";
import type {URLScheme} from "~/misc.types";
import {abbrStr as libAbbrStr, capitalize as libCapitalize, sanitizePath as libSanitizePath} from "../lib";

export function isDev(): boolean {
    return VITE__IS_DEV;
}

export const classPrefix = (className: string) => `${VITE__PREFIX__}${className}`;

// noinspection JSUnusedGlobalSymbols
export const capitalize = libCapitalize;

// noinspection JSUnusedGlobalSymbols
export const abbrStr = libAbbrStr;

export const sanitizePath = libSanitizePath;

export function getAPIEndpoint(path: string = ""): string {
    return sanitizePath(`${VITE__API_ENDPOINT}/${path}`);
}

export function isNumber(str: unknown): boolean {
    if (typeof str === "number") {
        return true;
    }
    if (typeof str === "string") {
        return !isNaN(Number(str))
    }
    if (str && typeof str === "object" && typeof str.toString === "function") {
        return isNumber(str.toString)
    }
    return false
}

// noinspection JSUnusedGlobalSymbols
export const queryStringify = (params: unknown, opts: object = {}) => qs.stringify(params, {encodeValuesOnly: true, ...opts}).replace(/=($|&)/gi, "$1");

// noinspection JSUnusedGlobalSymbols
export function qsParse(searchString: string | null | undefined): ParsedQs {
    return searchString ? qs.parse(searchString.replace(/^\?/, "")) : {};
}

// noinspection JSUnusedGlobalSymbols
export const composeURLString = (urlScheme: Partial<URLScheme>): string => {
    const urlParts: string[] = [];

    if (urlScheme.protocol) {
        urlParts.push(urlScheme.protocol + "//");
    }
    if (urlScheme.host) {
        urlParts.push(urlScheme.host);
    }
    if (urlScheme.pathname) {
        urlParts.push(sanitizePath(urlScheme.pathname));
    }
    if (urlScheme.query || urlScheme.search) {
        const qString = typeof urlScheme.query === "object"
            ? queryStringify(urlScheme.query)
            : (urlScheme.query || urlScheme.search || "");
        
        if (qString.length > 0) {
            urlParts.push((qString[0] === '?' ? '' : "?") + qString);
        }
    }

    return urlParts.join("");
};

// noinspection JSUnusedGlobalSymbols
export const parseURLString = (urlToParse: string): URLScheme | false => {
    let urlScheme: URLScheme | false;
    const urlAuthRegExp = /\/\/([^:/]*)(:[^@/]*)?@/;
    if (urlToParse) {
        if (urlToParse.indexOf("://") < 0) {
            urlToParse = "//" + urlToParse;
        } else {
            urlToParse = urlToParse.replace(/(\w+:\/\/)*(\w+:\/\/)/ig, "$2");
        }
        if (urlAuthRegExp.test(urlToParse)) {
            urlToParse = urlToParse.replace(
                urlAuthRegExp,
                (_match: string, login: string, pass: string) => {
                    let parsedLogin = login || "";
                    let parsedPass = pass ? pass.substring(1) : "";
                    try {
                        parsedLogin = decodeURIComponent(parsedLogin);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (e) {
                        //do nothing
                    }
                    try {
                        parsedPass = decodeURIComponent(parsedPass);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (e) {
                        //do nothing
                    }
                    parsedLogin = encodeURIComponent(parsedLogin);
                    parsedPass = encodeURIComponent(parsedPass);

                    return  `//${parsedLogin}${pass ? ":" + parsedPass : ""}@`;
                }
            );
        }
    }
    try {
        urlScheme = url.parse(
            urlToParse,
            false,
            true
        );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
        urlScheme = false;
    }
    if (urlScheme) {
        urlScheme.query = qsParse(urlScheme.search);

        urlScheme.hostname = urlScheme.hostname || "";
        urlScheme.pathname = urlScheme.pathname || "";
        try {
            urlScheme.pathname = decodeURIComponent(urlScheme.pathname);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_e) {
            // do nothing
        }
    }

    return urlScheme;
};

// noinspection JSUnusedGlobalSymbols
export const deepEqual = (a: unknown, b: unknown) => lodashIsEqual(a, b);