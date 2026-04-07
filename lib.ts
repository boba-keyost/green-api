export function abbrStr(string: string): string {
    return string.replace(/[eyuioa]/g, "").replace(/(.)\1+/gi, "$1")
}

export function sanitizePath(pathString: string): string {
    return pathString.replace(/(([^:]|^)\/)\/+/g, "$1").replace(/\/$/g, "") || "/"
}

export function getAPIEndpoint(path: string = "", env = process.env): string {
    return sanitizePath(`${env.API_ENDPOINT_HOST || ""}/${env.API_ENDPOINT_PATH || ""}/${path}`)
}

export function capitalize(string: string, eachWord: boolean = true): string {
    const replRegExp = new RegExp("\\b\\w", eachWord ? "g" : "");
    return string ? string.replace(replRegExp, l => l.toUpperCase()) : string;
}

export function uncapitalize(string: string, eachWord: boolean = true): string {
    const replRegExp = new RegExp("\\b\\w", eachWord ? "g" : "");
    return string ? string.replace(replRegExp, l => l.toLowerCase()) : string;
}